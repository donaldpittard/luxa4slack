const Luxafor = require("luxafor-api");
const Colors = {
    red: "#FF0000",
    green: "#00FF00",
    blue: "#0000FF",
    yellow: "#FFFF00",
    black: "#000000"
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

        this.fadeTo(Colors.black);
        this.events(eventBus);
    }

    /** 
     * This method subscribes the instance to message received, and 
     * presence changed events in order to change the Luxafor color.
     */
    events(eventBus){
        let self = this;
        eventBus.on("app-closed", () => self.fadeTo(Colors.black));

        eventBus.on("message-received", () => {
            self.setColor(Colors.blue);
            self.flash(Colors.blue, 255, 10, 5);
        });

        eventBus.on("presence-available", () => {
            self.fadeTo(Colors.green);
        });

        eventBus.on("presence-away", () => {
            self.fadeTo(Colors.yellow);
        });

        eventBus.on("presence-dnd", () => {
            self.fadeTo(Colors.red);
        });

        eventBus.on("presence-inactive", () => {
            self.fadeTo(Colors.black);
        });
    }
}

module.exports = Luxa4Slack;
