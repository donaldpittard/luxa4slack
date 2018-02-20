const Luxafor = require("luxafor-api");
const Colors = {
    red: "#FF0000",
    green: "#00FF00",
    blue: "#0000FF",
    yellow: "#FFFF00",
    black: "#000000"
};

/**
 * This class wraps the luxafor-api to expose an API for the
 * Slack module to use. It handles manipulation of the colors
 * and tray icon for the app.
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

        this.events(eventBus);
    }

    /** 
     * Attach event handlers to event bus
     */
    events(eventBus){
        let self = this;
        eventBus.on("app-closed", () => self.fadeTo(Colors.black));

        eventBus.on("slack-message-received", () => {
            self.setColor(Colors.blue);
            self.flash(Colors.blue, 255, 10, 5);
        });

        eventBus.on("slack-dnd-enabled", () => self.fadeTo(Colors.red));
        eventBus.on("slack-presence-changed", (presence) => {
            if (presence === "away") {
                self.fadeTo(Colors.yellow);
            } else if (presence === "active") {
                self.fadeTo(Colors.green);
            }
        });
    }
}

module.exports = Luxa4Slack;
