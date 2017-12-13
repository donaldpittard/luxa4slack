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
Once you have the token, update the .env file the luxa4slack directory.
```
SLACK_API_TOKEN=[YOUR SLACK TOKEN HERE]
```

Now you will need to get your Slack User ID. The easiest way to do this is through the Slack Web Application.
Open up your messages, right click on your name, and click inspect.
You will see an html link element with an attribute data-member-id.
Once you get that update the .env file as follows:
```
SLACK_USER=[YOUR SLACK USER ID]
```

Now you can run the app from within the luxa4slack directory.
```
sudo node index.js
```