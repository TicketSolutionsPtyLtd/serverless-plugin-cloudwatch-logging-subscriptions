'use strict'

const sinon = require('sinon')
const Serverless = require('serverless')

describe('Setup LogGroup Subscriptions', () => {
    const serverless = new Serverless()
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

    const module = Object.assign({
        serverless,
        options: {},
    }, baseModule)

    it('should setup log group subscriptions', () => {
        module.setupLogGroupSubscriptions()
        expect(serverless.service.provider.compiledCloudFormationTemplate.Resources)
            .toMatchSnapshot()
    })
})
