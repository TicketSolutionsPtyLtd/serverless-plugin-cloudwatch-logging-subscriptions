'use strict'

const _ = require('lodash')
const path = require('path')

function getNormalizedFunctionName(functionName) {
    const normalizedFunctionName = functionName[0].toUpperCase() + functionName.substr(1)
    return `${normalizedFunctionName}LambdaFunction`
}

function setupLogGroupSubscriptions() {
    this.service = this.serverless.service
    this.logToFunction = this.service.custom.logToFunction || 'logHandler'

    const functionsUsedForLogging = []

    this.service.getAllFunctions().forEach((functionName) => {
        const functionObject = this.service.getFunction(functionName)

        if (functionName === this.logToFunction && !functionObject.logToFunction) {
            return
        }

        const localLogToFunction = functionObject.logToFunction || this.logToFunction

        const templatePath = path.join(
            __dirname,
            '..',
            'lib',
            'cloudwatch-logs-subscription-filter-template.json'
        )

        const template = this.serverless.utils.readFileSync(templatePath)
        template.Properties.LogGroupName = `/aws/lambda/${functionObject.name}`
        template.Properties.DestinationArn['Fn::GetAtt'][0] = getNormalizedFunctionName(localLogToFunction)

        const functionLogicalId = getNormalizedFunctionName(functionName)
        const newResources = {
            [`${functionLogicalId}SubscriptionFilter`]: template,
        }

        const resources = this.service.provider.compiledCloudFormationTemplate.Resources
        _.merge(resources, newResources)

        functionsUsedForLogging.push(localLogToFunction)
        console.log(localLogToFunction)
    })

    _.uniq(functionsUsedForLogging).forEach((loggingFunction) => {
        const permissionTemplatePath = path.join(
            __dirname,
            '..',
            'lib',
            'log-inovke-lambda-permission-template.json'
        )

        const permissionTemplate = this.serverless.utils.readFileSync(permissionTemplatePath)
        permissionTemplate.Properties.FunctionName['Fn::GetAtt'][0] = getNormalizedFunctionName(loggingFunction)
        
        const loggingFunctionPermission = {
            [`${loggingFunction}LambdaPermission`]: permissionTemplate,
        }

        _.merge(this.service.provider.compiledCloudFormationTemplate.Resources, loggingFunctionPermission)
    })
}

module.exports = {
    setupLogGroupSubscriptions,
}
