const path = require("path");
const dotenv = require("dotenv").config({
    path: path.join(__dirname, "config/.env")
});
const { app, Menu, Tray } = require("electron");
const Luxa4Slack = require("./modules/luxa4slack");
const LuxIcon = require("./modules/lux-icon");
const EventBus = require("./modules/event-bus");
const Slack = require("./modules/slack");

let appIcon = null;
let luxa4slack = null;
let slack = null;
let events = null;

app.on("ready", () => {
    try {
        events = new EventBus();
        appIcon = new LuxIcon(events);

        const menu = Menu.buildFromTemplate([
            {
                label: "Close",
                click: () => {
                    events.emit("app-closed");
                    app.quit();
                }
            }
        ]);
        appIcon.setContextMenu(menu);

        luxa4slack = new Luxa4Slack(events);
        slack = new Slack({
            apiToken: process.env.SLACK_API_TOKEN,
            events: events,
            logLevel: process.env.RTM_LOG_LEVEL,
            updateStatus: process.env.UPDATE_STATUS
        });
    } catch (err) {
        console.log(err);
    }
});
