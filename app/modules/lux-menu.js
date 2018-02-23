const { Menu, MenuItem } = require("electron");
const nativeImage = require("electron").nativeImage;

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
            label: "Available", 
            type: "radio", 
            click(){
                eventBus.emit("presence-available");
            }
        }));

        this.append(new MenuItem({
            label: "Away from my desk", 
            type: "radio", 
            click(){
                eventBus.emit("presence-away");
            }
        }));

        this.append(new MenuItem({
            label: "Do Not Disturb", 
            type: "radio",
            click(){
                eventBus.emit("presence-dnd");
            }
        }));

        this.append(new MenuItem({
            label: 'Inactive',
            type: "radio",
            checked: true,
            click(){
                eventBus.emit("presence-inactive");
            }
        }));

        this.append(new MenuItem({label: 'Close', click(){eventBus.emit("app-closed");}}));
    }
}

module.exports = LuxMenu;
