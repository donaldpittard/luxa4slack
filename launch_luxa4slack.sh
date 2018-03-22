#!/bin/bash

cd $(dirname ${BASH_SOURCE[0]});
electron_path=./node_modules/.bin/electron

nohup $electron_path . &>/tmp/luxa4slack.error.log & disown %%