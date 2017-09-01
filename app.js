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

  * user     =>  ${options.user !== undefined ? '@' + options.user : 'All users'}
  * keyword  =>  ${options.keyword !== undefined ? options.keyword : 'All keywords'}
`)

client.stream('user', {}, (stream) => {
  stream.on('data', (event) => {
    if (options.link === true) {
      if (username.test(event.user.screen_name) && keyword.test(event.text) && event.entities.urls.length > 0) {
        sendMessage(event.user.screen_name, event.text)
      }
    } else {
      if (username.test(event.user.screen_name) && keyword.test(event.text)) {
        sendMessage(event.user.screen_name, event.text)
      }
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
