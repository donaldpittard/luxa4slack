const { Menu, MenuItem } = require("electron");
const nativeImage = require("electron").nativeImage;
const PRESENCE_LABELS = {
    available: "Available",
    away: "Away from my desk",
    dnd: "Do not disturb",
    inactive: "Inactive"
};

/**
 * This class manages the Luxafor Menu. It allows a user
 * to manage their Slack status and luxafor color from the tray
 * by emitting presence change events when the user clicks
 * on a different presence.
 */
class LuxMenu extends Menu {
    constructor(eventBus){
        super();

        this.append(new MenuItem({
            label: PRESENCE_LABELS.available,
            type: "radio",
            click(){
                eventBus.emit("menu-click", "available");
            }
        }));

        this.append(new MenuItem({
            label: PRESENCE_LABELS.away,
            type: "radio",
            click(){
                eventBus.emit("menu-click", "away");
            }
        }));

        this.append(new MenuItem({
            label: PRESENCE_LABELS.dnd,
            type: "radio",
            click(){
                eventBus.emit("menu-click", "dnd");
            }
        }));

        this.append(new MenuItem({
            label: PRESENCE_LABELS.inactive,
            type: "radio",
            // checked: true,
            click(){
                eventBus.emit("menu-click", "inactive");
            }
        }));

        this.append(new MenuItem({label: 'Close', click(){eventBus.emit("app-closed");}}));

        this.handlers = {
            available: this.checkAvailable.bind(this),
            away: this.checkAway.bind(this),
            dnd: this.checkDnd.bind(this),
            inactive: this.checkInactive.bind(this)
        };

        this.subscribeToEvents(eventBus);
    }

    /**
     * This method subscribes the instance to presence change events and
     * sets the checked value of the appropriate menu item on the event.
     * @param {*} eventBus
     */
    subscribeToEvents(eventBus) {
        eventBus.on("slack-presence-change", this.handleSlackPresenceChange.bind(this));
        eventBus.on("menu-click", this.handleMenuClick.bind(this));
    }

    handleSlackPresenceChange(presence="inactive") {
        let handler = this.handlers[presence];
        handler();
    }

    handleMenuClick(menuItem="inactive") {
        let handler = this.handlers[menuItem];
        handler();
    }

    checkMenuItem(labelKey="inactive") {
        this.items.forEach((menuItem) => {
            if (menuItem.label === PRESENCE_LABELS[labelKey]) {
                menuItem.checked = true;
            }
        });
    }

    checkAvailable() {this.checkMenuItem("available");}
    checkAway() {this.checkMenuItem("away");}
    checkDnd() {this.checkMenuItem("dnd");}
    checkInactive() {this.checkMenuItem("inactive");}
}

module.exports = LuxMenu;
