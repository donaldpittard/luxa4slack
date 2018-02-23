const { Menu, MenuItem } = require("electron");
const nativeImage = require("electron").nativeImage;
const LuxIcon = require("./lux-icon");

/**
 * Allows user to switch luxafor status via menu bar
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
        this.subscribeToEvents(eventBus);
    }

    subscribeToEvents(eventBus) {
        let self = this;

        eventBus.on("presence-available", () => {
            console.log("Changing presence menu item");
            self.items.forEach(menuItem => {
                console.log(menuItem);
                if (menuItem.label === "Available") {
                    menuItem.checked = true;
                }
            });
        });
    }
}

module.exports = LuxMenu;
