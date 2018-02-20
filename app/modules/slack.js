const { RtmClient, CLIENT_EVENTS, RTM_EVENTS } = require('@slack/client');
const { WebClient } = require('@slack/client');
const appData = {};

/**
 * This class wraps the logic for handling real time messaging (RTM) events
 * from the slack API. It also handles making calls to the slack API to fetch
 * the current user's presence and do not disturb (dnd) status.
 */
class Slack {
    constructor(config){
        if (!config) {
            throw 'Error: Configuration object required for constructor!';
        }

        if (!config.apiToken) {
            throw 'Error: API Token required!';
        }

        if (!config.events) {
            throw 'Error: Event Bus required!';
        }

        const rtm = new RtmClient(config.apiToken, {
            dataStore: false,
            useRtmConnect: true
        });

        this.rtmEvents(rtm, config.eventBus);

        rtm.start();
    }

    rtmEvents(rtm, eventBus) {
        rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
            appData.selfId= connectData.self.id;
            console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
        });

        rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPEN, () => {
            rtm.subscribePresence(appData.selfId);
        });

        rtm.on(RTM_EVENTS.MESSAGE, (message) => {
            console.log(message);
        });
    }
}

module.exports = Slack;
