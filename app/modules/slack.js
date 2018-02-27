const { RtmClient, WebClient, CLIENT_EVENTS, RTM_EVENTS } = require('@slack/client');
const appData = {};
const ignoredMessageSubtypes = [
    'bot_message',
    'channel_join',
    'channel_archive',
    'channel_leave',
    'channel_purpose',
    'channel_topic',
    'channel_unarchive',
    'group_archive',
    'group_join',
    'group_leave',
    'group_name',
    'group_purpose',
    'group_topic',
    'group_unarchive',
    'message_deleted',
    'unpinned_item'
];

/**
 * This class uses Slack's Real-time Messaging (RTM) API to listen
 * for events. We want to listen for Slack presence change events,
 * Slack message received events, and read marker update events.
 * Given these events, the class will emit presence change or
 * message received events. For more information go to
 * http://slackapi.github.io/node-slack-sdk/rtm_api
 */
class Slack {
    constructor(config){
        if (!config) {
            throw 'Error: Configuration object required for constructor!';
        }

        if (!config.apiToken) {
            throw 'Error: API Token required!';
        }

        if (!config.eventBus) {
            throw 'Error: Event Bus required!';
        }

        const rtm = new RtmClient(config.apiToken, {
            dataStore: false,
            useRtmConnect: true
        });

        this.webClient = new WebClient(config.apiToken);
        this.rtmEvents(rtm, config.eventBus);
        rtm.start({
            batch_presence_away: true
        });
    }

    /**
     * This function subscribes the instance to RTM events and
     * emits presence changed and message received events appropriately.
     */
    rtmEvents(rtm, eventBus) {
      let self = this;

        rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
            console.log(connectData);
            appData.selfId = connectData.self.id;
            console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
        });

        rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
            console.log("Subscribing presence");
            rtm.subscribePresence([appData.selfId]);
        });

        rtm.on(RTM_EVENTS.MESSAGE, (message) => {
            console.log(message);
            if((message.subtype && ignoredMessageSubtypes.includes(message.subtype)) ||
               (!message.subtype && message.user === appData.selfId)) {
                return;
            }

            eventBus.emit("message-received");
        });

        rtm.on(RTM_EVENTS.PRESENCE_CHANGE, (event) => {
            console.log(event);
            if (event.presence === "active") {
                console.log("Emitting Available Presence");
                eventBus.emit("presence-available");
            } else if (event.presence === "away") {
                console.log("Emitting away presence");
                eventBus.emit("presence-away");
            }
        });

        rtm.on(RTM_EVENTS.IM_MARKED, (event) => {
            console.log(event);
            // If we've read all our messages, then we are assumed available.
            if (event.unread_count_display === 0) {
                eventBus.emit("presence-available");
            }
        });

        rtm.on(RTM_EVENTS.CHANNEL_MARKED, (event) => {
            console.log(event);
            eventBus.emit("presence-available");
        });

        rtm.on(RTM_EVENTS.GROUP_MARKED, (event) => {
            console.log(event);
            eventBus.emit("presence-available");
        });

        rtm.on(RTM_EVENTS.DND_UPDATED, (event) => {
          console.log(event);
          if (!event.dnd_status) {
            return;
          }

          let slack = event.dnd_status;

          if (slack.dnd_enabled) {
            eventBus.emit("presence-dnd");
          } else {
            self.webClient.users.getPresence()
              .then((slack) => {
                console.log(slack);

                if (slack.presence === 'away') {
                  eventBus.emit("presence-away");
                } else {
                  eventBus.emit("presence-available");
                }
              })
          }
        });
    }
}

module.exports = Slack;
