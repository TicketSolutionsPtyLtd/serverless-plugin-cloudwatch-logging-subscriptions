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

    const permissionTemplatePath = path.join(
            __dirname,
            '..',
            'lib',
            'log-inovke-lambda-permission-template.json'
        )

    const permissionTemplate = this.serverless.utils.readFileSync(permissionTemplatePath)
    permissionTemplate.LoggingLambdaPermission.Properties.FunctionName['Fn::GetAtt'][0] = getNormalizedFunctionName(this.logToFunction)

    _.merge(this.service.provider.compiledCloudFormationTemplate.Resources, permissionTemplate)

    this.service.getAllFunctions().forEach((functionName) => {
        if (functionName === this.logToFunction) {
            return
        }

        const functionObject = this.service.getFunction(functionName)
        const templatePath = path.join(
            __dirname,
            '..',
            'lib',
            'cloudwatch-logs-subscription-filter-template.json'
        )

        const template = this.serverless.utils.readFileSync(templatePath)
        template.Properties.LogGroupName = `/aws/lambda/${functionObject.name}`
        template.Properties.DestinationArn['Fn::GetAtt'][0] = getNormalizedFunctionName(this.logToFunction)

        const functionLogicalId = getNormalizedFunctionName(functionName)
        const newResources = {
            [`${functionLogicalId}SubscriptionFilter`]: template,
        }

        const resources = this.service.provider.compiledCloudFormationTemplate.Resources
        _.merge(resources, newResources)
    })
}

module.exports = {
    setupLogGroupSubscriptions,
}
