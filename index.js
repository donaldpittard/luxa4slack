require('dotenv').config();
const {promisify} = require('util');
const Log = require('log');
const Luxafor = require('luxafor-api');
const LUX_CONFIG = require('./luxafor-config');
const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const token = process.env.SLACK_API_TOKEN || '';
const rtm = new RtmClient(token, {logLevel: process.env.RTM_LOG_LEVEL});
var web = new WebClient(token);

var log = new Log(process.env.LOG || 'luxa4slack');
var device = new Luxafor();

// Ensure that device is attached
web.users.getPresenceAsync = promisify(web.users.getPresence);
web.dnd.infoAsync = promisify(web.dnd.info);

web.users.getPresenceAsync(process.env.SLACK_USER)
    .then((slack) => {
        if (slack.presence === 'away') {
            device.fadeTo(LUX_CONFIG.yellow);
            return;
        } else {
            return web.dnd.infoAsync(process.env.SLACK_USER);
        }
    })
    .then ((slack) => {
        if (!slack) return;

        if (slack.dnd_enabled) {
            device.fadeTo(LUX_CONFIG.red);
        } else {
            device.fadeTo(LUX_CONFIG.green);
        }
    })
    .catch((err) => {
        console.log(err);
        // exit
    });

rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    if (message.user !== process.env.SLACK_USER) {
        device.fadeTo(LUX_CONFIG.blue);
    } else {
        device.fadeTo(LUX_CONFIG.green);
    }
});

rtm.on(RTM_EVENTS.PRESENCE_CHANGE, (presenceChangeEvent) => {
    if (presenceChangeEvent.user === process.env.SLACK_USER) {
        if (presenceChangeEvent.presence === 'away') {
            device.fadeTo(LUX_CONFIG.yellow);
        } else if (presenceChangeEvent.presence === 'active') {
            device.fadeTo(LUX_CONFIG.green);
        }
    }
});

rtm.on(RTM_EVENTS.DND_UPDATED, (dndUpdatedEvent) => {
    if (dndUpdatedEvent.user === process.env.SLACK_USER) {
        if (dndUpdatedEvent.dnd_status.dnd_enabled) {
            device.fadeTo(LUX_CONFIG.red);
        } else {
            device.fadeTo(LUX_CONFIG.green);
        }
    }
});