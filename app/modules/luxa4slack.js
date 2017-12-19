const path = require('path');
const nativeImage = require('electron').nativeImage
const Luxafor = require('luxafor-api');
const Colors = {
    red:    "#FF0000",
    green:  "#00FF00",
    blue:   "#0000FF",
    yellow: "#FFFF00",
    black:  "#000000"
};

const Icons = {
    available: path.join(__dirname, '../icons/lux_avail.png'), 
    away:      path.join(__dirname, '../icons/lux_away.png'),
    dnd:       path.join(__dirname, '../icons/lux_dnd.png'),
    notify:    path.join(__dirname, '../icons/lux_msg.png'),
    off:       path.join(__dirname, '../icons/lux_off.png')
};

/**
 * This class wraps the luxafor-api to expose an API for the 
 * Slack module to use. It handles manipulation of the colors
 * and tray icon for the app.
 */
class Luxa4Slack extends Luxafor {
    constructor (tray) {
        super();

        if (!tray) {
            throw('Error: No Tray object supplied!');
        }

        this.tray = tray;
        
        if (this.device instanceof Error) {
            console.log(this);
            console.log("ERROR: Device Failed");
            throw('Luxafor failed to initialize!');
        }

        this.off();
    }

    /**
     * Sets the luxafor device to the available color as defined
     * in Colors. Updates the tray icon to the available icon picture
     * as specified in Icons.
     */
    setAvailable () {
        console.log('Setting luxafor to available');
        this.tray.setImage(Icons.available);
        this.fadeTo(Colors.green);
    }

    /**
     * Sets the luxafor device to the do not disturb color as defined
     * in Colors. Updates the tray icon to the do not disturb icon picture
     * as specified in Icons.
     */
    setDnd () {
        console.log('Setting DND on luxafor');
        this.tray.setImage(Icons.dnd);
        this.fadeTo(Colors.red);
    }

    /**
     * Sets the luxafor device to the away color as defined in Colors.
     * Updates the tray icon to the away icon picture specified in Icons.
     */
    setAway () {
        console.log('Setting Luxafor to away');
        this.tray.setImage(Icons.away);
        this.fadeTo(Colors.yellow);
    }

    /**
     * Makes the luxafor blink and sets the luxafor device to 
     * the notify color as defined in Colors.
     * Sets the tray icon to the picture specified in Icons.
     */
    notify () {
        let target = 255;
        let speed = 10;
        let repeat = 5;

        this.setColor(Colors.blue);
        this.flash(Colors.blue, target, speed, repeat);
        this.tray.setImage(Icons.notify);
    }

    /**
     * Turns the luxafor device off. Sets
     * the tray icon to the picture specified in Icons.
     */
    off () {
        console.log('Turning luxafor off');
        this.tray.setImage(Icons.off);
        this.fadeTo(Colors.black);
    }
}

Luxa4Slack.icons = Icons;

module.exports = Luxa4Slack;