const Luxafor = require("luxafor-api");
const Colors = {
    red: "#FF0000",
    green: "#00FF00",
    blue: "#0000FF",
    yellow: "#FFFF00",
    black: "#000000"
};

const PresenceColors = {
    available: Colors.green,
    away: Colors.yellow,
    inactive: Colors.black,
    dnd: Colors.red
};

/**
 * This class manages the luxafor color by wrapping the Luxafor API.
 * The object will subscribe to message received and presence changed
 * events. Based on these events, it will change the Luxafor color
 * appropriately. For more information on the Luxafor API go to
 * https://www.npmjs.com/package/luxafor-api
 */
class Luxa4Slack extends Luxafor {
    constructor(eventBus){
        super();

        if (this.device instanceof Error) {
            console.log(this.device);
            throw "Error: Device failed to initialize!";
        }

        if (!eventBus) {
            throw "Error: No event bus passed!";
        }

        this._dnd = false;
        this.fadeTo(Colors.black);
        this.subscribeToEvents(eventBus);
    }

    /**
     * This method subscribes the instance to message received, and
     * presence changed events in order to change the Luxafor color.
     */
    subscribeToEvents(eventBus){
        eventBus.on("app-closed", () => this.fadeTo(Colors.black));
        eventBus.on("message-received", this.handleMessageReceived.bind(this));
        eventBus.on("message-read", this.handleMessageRead.bind(this));
        eventBus.on("slack-presence-change", this.handleSlackPresenceChange.bind(this));
        eventBus.on("menu-click", this.handleMenuClick.bind(this));
    }

    handleMessageReceived() {
        if (this._dnd) {
            return;
        }

        if (!this._previousColor) {
            this._previousColor = this._currentColor;
        }

        this.fadeTo(Colors.blue);
    }

    handleMessageRead() {
        if (this._previousColor) {
            this._currentColor = this._previousColor;
            this._previousColor = null;
            this.fadeTo(this._currentColor);
        }
    }

    handleMenuClick(presence="inactive") {
        let color = PresenceColors[presence];
        this._currentColor = color;
        this.fadeTo(color);
        this._dnd = (presence === "dnd");
    }

    handleSlackPresenceChange(presence="inactive") {
        let color = PresenceColors[presence];
        this._currentColor = color;
        this.fadeTo(color);
    }
}

module.exports = Luxa4Slack;
