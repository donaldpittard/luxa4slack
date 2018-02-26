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
                eventBus.emit("presence-available");
            }
        }));

        this.append(new MenuItem({
            label: PRESENCE_LABELS.away, 
            type: "radio", 
            click(){
                eventBus.emit("presence-away");
            }
        }));

        this.append(new MenuItem({
            label: PRESENCE_LABELS.dnd, 
            type: "radio",
            click(){
                eventBus.emit("presence-dnd");
            }
        }));

        this.append(new MenuItem({
            label: PRESENCE_LABELS.inactive,
            type: "radio",
            checked: true,
            click(){
                eventBus.emit("presence-inactive");
            }
        }));

        this.append(new MenuItem({label: 'Close', click(){eventBus.emit("app-closed");}}));
        
        this.subscribeToEvents(eventBus);
    }

    /**
     * This method subscribes the instance to presence change events and
     * sets the checked value of the appropriate menu item on the event.
     * @param {*} eventBus 
     */
    subscribeToEvents(eventBus) {
        var self = this;

        eventBus.on("presence-available", () => {
            self.items.forEach((menuItem) => {
                if (menuItem.label === PRESENCE_LABELS.available) {
                    menuItem.checked = true;
                }
            });
        });

        eventBus.on("presence-away", () => {
            self.items.forEach((menuItem) => {
                if (menuItem.label === PRESENCE_LABELS.away) {
                    menuItem.checked = true;
                }
            });
        });

        eventBus.on("presence-dnd", () => {
            self.items.forEach((menuItem) => {
                if (menuItem.label === PRESENCE_LABELS.dnd) {
                    menuItem.checked = true;
                }
            });
        })
    }
}

module.exports = LuxMenu;
