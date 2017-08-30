# node-twatch

> Monitor specific tweets and post to Slack.

![node-twatch](https://github.com/kokushin/node-twatch/blob/material/demo.gif?raw=true)

## Install

> npm (global)

```
$ npm install node-twatch -g
```

> clone

```
$ git clone git@github.com:kokushin/node-twatch.git
$ cd node-twatch
$ npm install
```

> download [here](https://github.com/kokushin/node-twatch/archive/master.zip)

```
$ unzip node-twatch-master.zip
$ cd node-twatch-master
$ npm install
```

## Usage

Open config.json in a text editor and enter the Twitter API key and Slack's API key.

> 💡 When `npm install node-twatch -g` is executed, config.json exists in `/usr/local/lib/node_modules/node-twatch`.

- How to get Twitter API key [here](https://apps.twitter.com/)
- How to get Slack API key [here](https://api.slack.com/apps?new_app=1)

```json
{
  "twitter": {
    "consumer_key": "YOUR_CONSUMER_KEY",
    "consumer_secret": "YOUR_CONSUMER_SECRET",
    "access_token_key": "YOUR_ACCESS_TOKEN_KEY",
    "access_token_secret": "YOUR_ACCESS_TOKEN_SECRET"
  },
  "slack": {
    "token": "YOUR_ACCESS_TOKEN_KEY",
    "channel": "YOUR_CHANNEL_NAME"
  }
}
```

When you enter the following command, Twatch starts monitoring.

> 💡 Twitter users to monitor must "follow".

> npm (global)

```
$ twatch
```

> clone & download

```
$ npm run start
```

Press Ctrl + C to stop monitoring.

## Options

There is an option to specify the Twitter ID to be monitored and the keyword contained within tweet respectively.

### -u

You can specify the ID of the Twitter user to monitor. It is possible to specify more than one with ",".

> npm (global)

```
$ twatch -u user_id1,user_id2
```

> clone & download

```
$ npm run start -- --u user_id1,user_id2
```

### -k

You can specify keywords to be included in the tweets to be monitored. Uppercase and lowercase letters are not distinguished. It is possible to specify more than one with ",".

> npm (global)

```
$ twatch -k keyword1,keyword2
```

> clone & download

```
$ npm run start -- --k keyword1,keyword2
```

> 💡 If you do not specify an option, we will monitor all followers and tweets.

## Trouble shooting

> Error: Status Code: 401

The API key is not set correctly. You need to check and edit config.json.


## Contributor
[@kokushin](https://github.com/kokushin)

## License
Code and documentation copyright 2017 by kokushin. Code released under the [MIT License](https://github.com/kokushin/node-twatch/blob/master/LICENSE).
