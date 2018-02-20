const {Tray} = require("electron");
const path = require("path");

/** 
 * Luxafor Tray Icon class
 */
class LuxIcon extends Tray {
    constructor(eventBus){
        const icons = {
            available: path.join(__dirname, "../icons/lux_avail.png"),
            away: path.join(__dirname, "../icons/lux_away.png"),
            dnd: path.join(__dirname, "../icons/lux_dnd.png"),
            msg: path.join(__dirname, "../icons/lux_msg.png"),
            off: path.join(__dirname, "../icons/lux_off.png")        
        };

        super(icons.off);

        this.icons = icons;
        this.setImage(this.icons.off);
        this.events(eventBus);
    }

    /**
     * Attaches event handlers to event bus.
     */
    events(eventBus) {
        let self = this;

        eventBus.on("luxafor-available", function() {
            self.setImage(self.icons.available);
        });

        eventBus.on("luxafor-off", function() {
            self.setImage(self.icons.off);
        });

        eventBus.on("luxafor-away", function() {
            self.setImage(self.icons.away);
        });

        eventBus.on("luxafor-dnd", function() {
            self.setImage(self.icons.dnd);
        });
    }
}

module.exports = LuxIcon;