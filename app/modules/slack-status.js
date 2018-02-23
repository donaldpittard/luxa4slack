const { WebClient } = require('@slack/client');

/** 
 * This class uses the Slack WebClient API to update the user's
 * status_text and status emoji on presence change events. For
 * more information go to
 * http://slackapi.github.io/node-slack-sdk/web_api
 */
class SlackStatus {
    constructor(config) {
        if (!config.eventBus) {
            throw "Error: Event bus required!";
        }

        if (!config.apiToken) {
            throw "Error: API Token required!";
        }

        this.updateStatus = config.updateStatus ? true : false;
        this.webClient = new WebClient(config.apiToken);
        this.subscribeToEvents(config.eventBus);
    }

    /**
     * Given an event but, this function subscribes the instance to 
     * presence change events and updates the slack profile status text
     * and status emoji appropriately.
     * @param {*} eventBus 
     */
    subscribeToEvents(eventBus) {
        let self = this;

        eventBus.on("presence-available", () => {
            self.webClient.users.profile.set({
                profile: {
                    status_text: "Available",
                    status_emoji: ":luxafor-avail:"
                }
            });
        });

        eventBus.on("presence-away", () => {
            self.webClient.users.profile.set({
                profile: {
                    status_text: "Away from desk",
                    status_emoji: ":luxafor-away:"
                }
            });
        });

        eventBus.on("presence-dnd", () => {
            self.webClient.users.profile.set({
                profile: {
                    status_text: "Do not disturb",
                    status_emoji: ":luxafor-dnd:"
                }
            });
        });

        eventBus.on("presence-inactive", () => {
            self.webClient.users.profile.set({
                profile: {
                    status_text: "Inactive",
                    status_emoji: ":luxafor-away:"
                }
            });
        });
    }
}

module.exports = SlackStatus;
