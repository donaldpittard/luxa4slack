const { Tray } = require("electron");
const path = require("path");

// Icon file paths
const icons = {
    available: path.join(__dirname, "../icons/lux_avail.png"),
    away: path.join(__dirname, "../icons/lux_away.png"),
    dnd: path.join(__dirname, "../icons/lux_dnd.png"),
    msg: path.join(__dirname, "../icons/lux_msg.png"),
    off: path.join(__dirname, "../icons/lux_off.png")        
};

/** 
 * This class manages what icon will appear in the user's tray.
 * The class listens for presence change events and updates 
 * the tray icon image appropriately.
 */
class LuxIcon extends Tray {
    constructor(eventBus){
        super(icons.off);
        this.icons = icons;
        this.setImage(this.icons.off);
        this.events(eventBus);
    }

    /**
     * Given an event bus, this method subscribes the instance
     * to presence change events.
     * @param {*} eventBus 
     */
    events(eventBus) {
        let self = this;

        eventBus.on("presence-available", function() {
            self.setImage(icons.available);
        });

        eventBus.on("presence-inactive", function() {
            self.setImage(icons.off);
        });

        eventBus.on("presence-away", function() {
            self.setImage(icons.away);
        });

        eventBus.on("presence-dnd", function() {
            self.setImage(self.icons.dnd);
        });
    }
}

module.exports = LuxIcon;