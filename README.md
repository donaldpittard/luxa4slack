# luxa4slack
A Slack/Luxafor Integration using Node.js

## Running Locally
Make sure you have [Node.js](https://nodejs.org/en/) at least version 8.10.0 installed.

```
cd ~
git clone git@github.com:donaldpittard/luxa4slack.git
cd luxa4slack
npm install
```

You will need to create a [legacy token](https://api.slack.com/custom-integrations/legacy-tokens) for the Slack API.

Once you have the API Token, create a .env file under app/config that contains the following:
```
SLACK_API_TOKEN=[YOUR SLACK TOKEN HERE]
```

Now you can run the application from within the luxa4slack directory:
```
sudo node_modules/.bin/electron .
```

## TODO
- [ ] Add user authentication
- [ ] Add logging
- [ ] Add initialization messages
- [X] Electronify
- [ ] Test with Slack Desktop App
- [ ] Add support for Windows
- [ ] Add configurations page to coordinate team-specific meanings and messages to colors
