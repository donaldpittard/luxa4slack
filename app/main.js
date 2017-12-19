const path = require('path');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, "config/.env")
});
const {app, Menu, Tray} = require('electron');
const Luxa4Slack = require('./modules/luxa4slack');
const Slack = require('./modules/slack');

let appIcon = null;
let luxa4slack = null;
let slack = null;

app.on('ready', () => {
    appIcon = new Tray(Luxa4Slack.icons.available);
    luxa4slack = new Luxa4Slack(appIcon);
    slack = new Slack({
        apiToken: process.env.SLACK_API_TOKEN,
        user: process.env.SLACK_USER,
        luxa4slack: luxa4slack,
        logLevel: process.env.RTM_LOG_LEVEL
    });
    
});
