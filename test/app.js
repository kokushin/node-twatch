#!/usr/bin/env node

'use strict'

/*
 * load modules
 */

const Twitter = require('twitter')
const request = require('request')
const minimist = require('minimist')
const chalk = require('chalk')
const figlet = require('figlet')
const clear = require('clear')
const ora = require('ora')
const config = require('./config.json')
const pkg = require('../package.json')


/*
 * options
 */

const options = {
  user: minimist(process.argv).u || minimist(process.argv).user,
  keyword: minimist(process.argv).k || minimist(process.argv).keyword,
  link: minimist(process.argv).l || minimist(process.argv).link,
}


/*
 * get username
 */

let username

if (options.user !== true && options.user !== undefined) {
  username = new RegExp(String(options.user).replace(/\,/g, '|'))
} else {
  username = new RegExp('')
}


/*
 * get keyword
 */

let keyword

if (options.keyword !== true && options.keyword !== undefined) {
  keyword = new RegExp(String(options.keyword).replace(/\,/g, '|'), 'i')
} else {
  keyword = new RegExp('')
}


/*
 * set info
 */
const info = {
  version: pkg.version,
  option: {
    user: options.user !== undefined ? '@' + options.user : 'All users',
    keyword: options.keyword !== undefined ? options.keyword : 'All keywords',
  }
}


/*
 * send setting info to Slack
 */

request.post('https://slack.com/api/chat.postMessage',
  {
    form: {
      token: config.slack.token,
      channel: config.slack.channel,
      text: `Server started! \n>version: ${info.version} \n>date: ${new Date()} \n>user: ${info.option.user} \n>keyword: ${info.option.keyword}`
    }
  }
)


/*
 * load client
 */

const client = new Twitter(config.twitter)


/*
 * start watch
 */

clear()

console.log(
  chalk.cyan(
    figlet.textSync('twatch', { horizontalLayout: 'full' })
  )
)

console.log(`
  ${new Date()}

  * user     =>  ${info.option.user}
  * keyword  =>  ${info.option.keyword}
`)

client.stream('user', {}, (stream) => {
  stream.on('data', (obj) => {
    let tweet = {
      'username': obj.user.screen_name,
      'text': obj.text,
      'checkText': obj.text.replace(/(https:\/\/t.co\/([a-z|A-Z|0-9]+))/g, ''),
      'checkLink': obj.entities.urls.length > 0,
    }
    if (username.test(tweet.username) && keyword.test(tweet.checkText)) {
      if (options.link === true && !tweet.checkLink) {
        return
      }
      sendMessage(tweet.username, tweet.text)
    }
  })

  stream.on('error', (error) => {
    throw error
  })
})

ora('Monitoring started ...').start()


/*
 * send message to Slack
 */

function sendMessage(username, text) {
  const message = [
    {
      color: '#00aced',
      author_name: `@${username}`,
      author_link: `https://twitter.com/${username}`,
      text: text
    }
  ]
  request.post('https://slack.com/api/chat.postMessage',
    {
      form: {
        token: config.slack.token,
        channel: config.slack.channel,
        attachments: JSON.stringify(message)
      }
    }
  )
}
