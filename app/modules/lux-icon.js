const { Tray } = require("electron");
const path = require("path");

// Icon file paths
const icons = {
    available: path.join(__dirname, "../icons/lux_avail.png"),
    away: path.join(__dirname, "../icons/lux_away.png"),
    dnd: path.join(__dirname, "../icons/lux_dnd.png"),
    msg: path.join(__dirname, "../icons/lux_msg.png"),
    inactive: path.join(__dirname, "../icons/lux_off.png")
};

/**
 * This class manages what icon will appear in the user's tray.
 * The class listens for presence change events and updates
 * the tray icon image appropriately.
 */
class LuxIcon extends Tray {
    constructor(eventBus){
        super(icons.inactive);
        this.icons = icons;
        this.eventBus = eventBus;
        this.attachEventHandlers();
    }

    /**
     * Given a presence string, this method returns the appropriate icon.
     * @param string presence
     */
    getIconByPresence(presence='inactive') {
        return icons[presence];
    }

    /**
     * Given a new slack presence, this method changes the tray icon
     * to the appropriate presence icon.
     * @param string presence
     */
    handleSlackPresenceChange(presence) {
        let icon = this.getIconByPresence(presence);
        this.setImage(icon);
    }

    /**
     * Event handler for menu click events. Sets the image
     * of the tray to the appropriate presence representation.
     * @param string menuItem
     */
    handleMenuClick(menuItem) {
        let icon = this.getIconByPresence(menuItem);
        this.setImage(icon);
    }

    /**
     * Attaches event handleres to event bus.
     */
    attachEventHandlers() {
        this.eventBus.on("slack-presence-change", this.handleSlackPresenceChange.bind(this));
        this.eventBus.on("menu-click", this.handleMenuClick.bind(this));
    }
}

module.exports = LuxIcon;
