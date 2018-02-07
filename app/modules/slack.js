const promisify = require("promisify-node");
const RtmClient = require("@slack/client").RtmClient;
const WebClient = require("@slack/client").WebClient;
const RTM_EVENTS = require("@slack/client").RTM_EVENTS;

const STATUS = {
    active: "active",
    away: "away",
    doNotDisturb: "dnd"
};

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
     * events bus.
     * @param {*} config
     */
    constructor(config) {
        if (!config.apiToken) {
            throw "No API token provided!";
        }

        if (!config.user) {
            throw "No User ID provided!";
        }

        this.user = config.user;
        this.rtmClient = new RtmClient(config.apiToken, {
            logLevel: config.logLevel
        });
        this.webClient = new WebClient(config.apiToken);
        this.events = config.events;
        this.updateStatus = config.updateStatus || false;

        try {
            this.rtmClient.start();
        } catch (err) {
            throw err;
        }

        this.fetchSlackPrenceAndDndInfo();
        this.attachMessageHandlers();
    }

    asyncFetchSlackPresence() {
        const getStatus = promisify(this.webClient.users.getPresence).bind(
            this.webClient.users
        );

        return getStatus(this.user);
    }

    asyncFetchDnd() {
        const getDnd = promisify(this.webClient.dnd.info).bind(
            this.webClient.dnd
        );

        return getDnd(this.user);
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
            RTM_EVENTS.MANUAL_PRESENCE_CHANGE,
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
        console.log("Handling message event");
        console.log(message);
        if (message.user === this.user) {
            return;
        }

        this.events.emit("slack-message-received", message);
    }

    /**
     * Handles all presence change events. If the event's user is the current user,
     * the presence and do not disturb status are checked and the luxafor is updated
     * appropriately.
     * @param {*} slack
     */
    handlePresenceChangeEvent(slack) {
        console.log("Handling presence change event");
        if (!slack.presence) {
            // Throw an error here
        }

        this.events.emit("slack-presence-changed", slack.presence);
        this.setStatus(slack.presence);
    }

    /**
     * This function handles updates to do not disturb statuses.
     * If the do not disturb status is active, then the luxafor is updated.
     * If dnd is not active, then the luxafor's color is set based on presence.
     * @param {*} slack
     */
    handleDndUpdatedEvent(slack) {
        console.log("Handling DND update event");
        console.log(slack);
        this.fetchSlackPrenceAndDndInfo();
    }

    /**
     * Handles when a message's read log is marked.
     * @param {*} event
     */
    handleImMarkedEvent(event) {
        console.log("Handling IM Marked Event");
        console.log(event);
        this.fetchSlackPrenceAndDndInfo();
    }

    /**
     * Handles the event when a channel's read log is marked.
     * @param {*} event
     */
    handleChannelMarkedEvent(event) {
        console.log("Handling Channel Marked Event");
        console.log(event);
        this.fetchSlackPrenceAndDndInfo();
    }

    /**
     * Checks the user's presence for away. If the user's presence is away, a presence changed
     * event is emitted with presence away. If the presence is not away, the do not disturb
     * info is queried. If do not disturb is enabled, then the slack-dnd-enabled event is
     * emitted. Otherwise a presence change event is emitted with the active presence.
     */
    fetchSlackPrenceAndDndInfo() {
        this.asyncFetchSlackPresence()
            .then(slack => {
                if (slack.presence === STATUS.away) {
                    this.events.emit("slack-presence-changed", slack.presence);
                    this.setStatus(STATUS.away).bind(this);
                } else {
                    return this.asyncFetchDnd().bind(this);
                }
            })
            .then(slack => {
                if (slack.dnd_enabled) {
                    this.events.emit("slack-dnd-enabled");
                    this.setStatus(STATUS.doNotDisturb);
                } else {
                    this.events.emit("slack-presence-changed", STATUS.active);
                    this.setStatus(STATUS.active);
                }
            })
            .bind(this);
    }

    setStatus(status) {
        console.log("Setting status", status);
        let status_text = "";
        let status_emoji = "";

        if (!this.updateStatus) {
            return;
        }

        if (status === STATUS.active) {
            this.status = STATUS.active;
            status_emoji = ":luxafor-avail:";
        } else if (status === STATUS.away) {
            this.status = STATUS.away;
            status_emoji = ":luxafor-away:";
        } else if (status === STATUS.doNotDisturb) {
            this.status = STATUS.doNotDisturb;
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
