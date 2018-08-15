const { WebClient } = require('@slack/client');

const presenceProfiles = {
    available: {
        status_text: "Available",
        status_emoji: ":luxafor-avail:"
    },
    away: {
        status_text: "Away from desk",
        status_emoji: ":luxafor-away:"
    },
    dnd: {
        status_text: "Do not disturb",
        status_emoji: ":luxafor-dnd:"
    },
    inactive: {
        status_text: "Away desk",
        status_emoji: ":luxafor-away:"
    }
};

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SNOOZE_TIME = MINUTES_IN_HOUR * HOURS_IN_DAY;

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

    handleSlackPresenceChange(presence="inactive") {
        let profile = presenceProfiles[presence];
        this.webClient.users.profile.set({
            profile: presenceProfiles[presence]
        });

        if (presence === "dnd") {
            this.webClient.dnd.setSnooze({
                num_minutes: SNOOZE_TIME
            });
        } else {
            this.webClient.dnd.endDnd();
        }
    }

    handleMenuClick(menuItem="inactive") {
        this.webClient.users.profile.set({
            profile: presenceProfiles[menuItem]
        });

        if (menuItem === "dnd") {
            this.webClient.dnd.setSnooze({
                num_minutes: SNOOZE_TIME
            });
        } else {
            this.webClient.dnd.endDnd();
        }
    }

    /**
     * Given an event but, this function subscribes the instance to
     * presence change events and updates the slack profile status text
     * and status emoji appropriately.
     * @param {*} eventBus
     */
    subscribeToEvents(eventBus) {
        eventBus.on("slack-presence-change", this.handleSlackPresenceChange.bind(this));
        eventBus.on("menu-click", this.handleMenuClick.bind(this));
    }
}

module.exports = SlackStatus;
