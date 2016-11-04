'use strict'

const BbPromise = require('bluebird')

const setupLogGroupSubscriptions = require('./lib/setupLogGroupSubscriptions')

class LoggingSubscriptionsPlugin {
    constructor(serverless, options) {
        this.serverless = serverless
        this.options = options

        Object.assign(
            this,
            setupLogGroupSubscriptions
        )

        this.hooks = {
            'after:deploy:compileFunctions': () => BbPromise.bind(this)
              .then(this.setupLogGroupSubscriptions),
        }
    }
}

module.exports = LoggingSubscriptionsPlugin
