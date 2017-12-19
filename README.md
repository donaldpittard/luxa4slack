# luxa4slack
A Slack/Luxafor Integration using Node.js

## Running Locally
Make sure you have [Node.js](https://nodejs.org/en/) installed.

```
cd ~
git clone git@github.com:donaldpittard/luxa4slack.git
cd luxa4slack
npm install
```

You will need to create a [legacy token](https://api.slack.com/custom-integrations/legacy-tokens) for the Slack API.
You will also need to get your Slack User ID. The easiest way to do this is through the Slack Web Application.
Open up your messages, right click on your name, and click inspect.
You will see an html link element with an attribute data-member-id.

Once you have the API Token and the User ID, create a .env file under app/config that contains the following:
```
SLACK_API_TOKEN=[YOUR SLACK TOKEN HERE]
SLACK_USER=[YOUR SLACK USER ID]
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
