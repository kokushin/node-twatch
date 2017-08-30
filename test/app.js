/*
 * load modules
 */
const Twitter = require('twitter')
const request = require('request')
const minimist = require('minimist')
const config = require('./config.json')


/*
 * options
 */
const options = {
  user: minimist(process.argv.slice(2)).user,
  keyword: minimist(process.argv.slice(3)).key,
}


/*
 * load client
 */
const client = new Twitter(config.twitter)


/*
 * get username
 */
let username

if (options.user === true || options.user === undefined) {
  username = new RegExp('')
} else {
  username = new RegExp(options.user.replace(/\,/g, '|'))
}


/*
 * get keyword
 */
let keyword

if (options.keyword === true || options.keyword === undefined) {
  keyword = new RegExp('')
} else {
  keyword = new RegExp(options.keyword.replace(/\,/g, '|'))
}


/*
 * start watch
 */
client.stream('user', {}, (stream) => {
  stream.on('data', (event) => {
    if (username.test(event.user.screen_name) && keyword.test(event.text)) {
      sendMessage(event.user.screen_name, event.text)
    }
  })

  stream.on('error', (error) => {
    throw error
  })
})


/*
 * send message to Slack
 */
function sendMessage(username, text) {
  request.post('https://slack.com/api/chat.postMessage',
    {
      form: {
        token: config.slack.token,
        channel: config.slack.channel,
        text: `@${username}: ${text}`
      }
    }
  )
}
