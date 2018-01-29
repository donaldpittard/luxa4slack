const RtmClient = require("@slack/client").RtmClient;
const WebClient = require("@slack/client").WebClient;
const RTM_EVENTS = require("@slack/client").RTM_EVENTS;

/**
 * This class wraps the logic for handling real time messaging (RTM) events
 * from the slack API. It also handles making calls to the slack API to fetch
 * the current user's presence and do not disturb (dnd) status.
 */
class Slack {
    /**
     * Creates a new instance of the Slack wrapper class.
     * The constructor expects a configuration object that
     * specifies a Slack API Token, a Slack User Id, and a
     * luxa4slack instance.
     * @param {*} config
     */
    constructor(config) {
        if (!config.apiToken) {
            throw "No API token provided!";
        }

        if (!config.user) {
            throw "No User ID provided!";
        }

        if (!config.luxa4slack) {
            throw "No luxafor was provided for slack to use!";
        }

        this.user = config.user;
        this.rtmClient = new RtmClient(config.apiToken, {
            logLevel: config.logLevel
        });
        this.webClient = new WebClient(config.apiToken);
        this.luxa4slack = config.luxa4slack;
        this.updateStatus = config.updateStatus || false;

        try {
            this.rtmClient.start();
        } catch (err) {
            throw err;
        }

        this.setLuxPresenceOrDndColor();
        this.attachMessageHandlers();
    }

    /**
     * Attaches events to the Real Time Messaging Events API for Slack.
     */
    attachMessageHandlers() {
        this.rtmClient.on(
            RTM_EVENTS.MESSAGE,
            this.handleMessageEvent.bind(this)
        );
        this.rtmClient.on(
            RTM_EVENTS.PRESENCE_CHANGE,
            this.handlePresenceChangeEvent.bind(this)
        );
        this.rtmClient.on(
            RTM_EVENTS.DND_UPDATED,
            this.handleDndUpdatedEvent.bind(this)
        );
        this.rtmClient.on(
            RTM_EVENTS.IM_MARKED,
            this.handleImMarkedEvent.bind(this)
        );
        this.rtmClient.on(
            RTM_EVENTS.CHANNEL_MARKED,
            this.handleChannelMarkedEvent.bind(this)
        );
    }

    /**
     * Handles all message events. If the message is for the current user,
     * then the luxafor is notified.
     * @param {*} message
     */
    handleMessageEvent(message) {
        if (message.user === this.user) {
            return;
        }

        this.webClient.dnd.info(this.user, (err, slack) => {
            if (!slack.dnd_enabled) {
                this.luxa4slack.notify();
            }
        });
    }

    /**
     * Handles all presence change events. If the event's user is the current user,
     * the presence and do not disturb status are checked and the luxafor is updated
     * appropriately.
     * @param {*} slack
     */
    handlePresenceChangeEvent(slack) {
        if (slack.user !== this.user) {
            return;
        }

        if (slack.presence === "away") {
            this.luxa4slack.setAway();
            this.setStatus("away");
        } else {
            this.webClient.dnd.info(this.user, (err, slack) => {
                if (slack.dnd_enabled) {
                    this.luxa4slack.setDnd();
                    this.setStatus("dnd");
                } else {
                    this.luxa4slack.setAvailable();
                    this.setStatus("available");
                }
            });
        }
    }

    /**
     * This function handles updates to do not disturb statuses.
     * If the do not disturb status is active, then the luxafor is updated.
     * If dnd is not active, then the luxafor's color is set based on presence.
     * @param {*} slack
     */
    handleDndUpdatedEvent(slack) {
        if (slack.user !== this.user) {
            return;
        }

        if (slack.dnd_status.dnd_enabled) {
            this.luxa4slack.setDnd();
            this.setStatus("dnd");
        } else {
            this.setLuxPresenceOrDndColor();
        }
    }

    /**
     * Handles when a message's read log is marked.
     * @param {*} event
     */
    handleImMarkedEvent(event) {
        this.setLuxPresenceOrDndColor();
    }

    /**
     * Handles the event when a channel's read log is marked.
     * @param {*} event
     */
    handleChannelMarkedEvent(event) {
        this.setLuxPresenceOrDndColor();
    }

    /**
     * Checks the user's presence for away. If the user is not away, then the user's
     * dnd status is checked. If dnd is not active, then the luxafor is updated for
     * available.
     */
    setLuxPresenceOrDndColor() {
        this.webClient.users.getPresence(this.user, (err, slack) => {
            if (err) {
                throw err;
            }

            if (slack.user !== this.user) {
                return;
            }

            if (slack.presence === "away") {
                this.luxa4slack.setAway();
                this.setStatus("away");
            } else {
                this.webClient.dnd.info(this.user, (err, slack) => {
                    if (err) {
                        throw err;
                    }

                    if (slack.dnd_enabled) {
                        this.luxa4slack.setDnd();
                        this.setStatus("dnd");
                    } else {
                        this.luxa4slack.setAvailable();
                        this.setStatus("available");
                    }
                });
            }
        });
    }

    setStatus(status) {
        let status_text = "";
        let status_emoji = "";

        if (!this.updateStatus) {
            return;
        }

        if (status === "available") {
            this.status = "available";
            status_emoji = ":luxafor-avail:";
        } else if (status === "away") {
            this.status = "away";
            status_emoji = ":luxafor-away:";
        } else if (status === "dnd") {
            this.status = "dnd";
            status_emoji = ":luxafor-dnd:";
        } else {
            return;
        }

        this.webClient.users.profile.set({
            user: this.user,
            profile: {
                status_text: status_text,
                status_emoji: status_emoji
            }
        });
    }
}

module.exports = Slack;
