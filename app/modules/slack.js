const { RTMClient, WebClient } = require('@slack/client');
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

        const rtm = new RTMClient(config.apiToken, {
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

        rtm.on('authenticated', (connectData) => {
            appData.selfId = connectData.self.id;
        });

        rtm.on('connected', () => {
            rtm.subscribePresence([appData.selfId]);
        });

        rtm.on('message', (message) => {
            if((message.subtype && ignoredMessageSubtypes.includes(message.subtype)) ||
               (!message.subtype && message.user === appData.selfId)) {
                return;
            }

            eventBus.emit("message-received");
        });

        rtm.on('presence_change', (event) => {
            if (event.presence === "active") {
                eventBus.emit("slack-presence-change", "available");
            } else if (event.presence === "away") {
                eventBus.emit("slack-presence-change", "away");
            }
        });

        rtm.on('im_marked', (event) => {
            // If we've read all our messages, then send a message read event.
            if (event.unread_count_display === 0) {
                eventBus.emit("message-read");
            }
        });

        rtm.on('channel_marked', (event) => {
            if (event.unread_count_display === 0) {
                eventBus.emit("message-read");
            }
        });

        rtm.on('group_marked', (event) => {
            if (event.unread_count_display === 0) {
                eventBus.emit("message-read");
            }
        });
    }
}

module.exports = Slack;
