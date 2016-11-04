'use strict'

const sinon = require('sinon')
const Serverless = require('serverless')

describe('Setup LogGroup Subscriptions', () => {
    let serverless
    let module

    beforeEach(() => {
        serverless = new Serverless()
        serverless.cli = {
            log: sinon.spy(),
            consoleLog: sinon.spy(),
        }

        serverless.service.provider.compiledCloudFormationTemplate = {
            Resources: {},
        }

        serverless.service.functions = {
            testing: {
                name: 'testing',
            },
        }

        const baseModule = require('./setupLogGroupSubscriptions') // eslint-disable-line global-require

        module = Object.assign({
            serverless,
            options: {},
        }, baseModule)
    })

    it('should setup log group subscriptions', () => {
        module.setupLogGroupSubscriptions()
        expect(serverless.service.provider.compiledCloudFormationTemplate.Resources)
            .toMatchSnapshot()
    })

    it('should setup log group subscriptions to the correct functions', () => {
        serverless.service.functions.testingLocalFunction = {
            logToFunction: 'testLogHandler',
        }

        module.setupLogGroupSubscriptions()
        expect(serverless.service.provider.compiledCloudFormationTemplate.Resources)
            .toMatchSnapshot()
    })
})
