const path = require("path");
const dotenv = require("dotenv").config({
    path: path.join(__dirname, "config/.env")
});
const { app } = require("electron");
const EventBus = require("./modules/event-bus");
const LuxIcon = require("./modules/lux-icon");
const Luxa4Slack = require("./modules/luxa4slack");
const LuxMenu = require("./modules/lux-menu");
const Slack = require("./modules/slack");
const SlackStatus = require("./modules/slack-status");

let appIcon = null;
let events = null;
let luxa4slack = null;
let menu = null;
let slack = null;
let slackStatus = null;

app.on("ready", () => {
    try {
        events = new EventBus();
        appIcon = new LuxIcon(events);
        menu = new LuxMenu(events);

        events.on("app-closed", app.quit);
        appIcon.setContextMenu(menu);

        luxa4slack = new Luxa4Slack(events);
        slack = new Slack({
            apiToken: process.env.SLACK_API_TOKEN,
            eventBus: events,
            logLevel: process.env.RTM_LOG_LEVEL,
        });
        slackStatus = new SlackStatus({
            apiToken: process.env.SLACK_API_TOKEN,
            eventBus: events,
            updateStatus: process.env.UPDATE_STATUS
        });
    } catch (err) {
        console.log(err);
    }
});
