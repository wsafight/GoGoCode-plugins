const fs = require('fs')
const path = require("path")

const actionsDir = path.join(__dirname, '../test/actions')

module.exports = function (ast) {
    const platform = process.env.platform
    return ast
        .find('<script></script>')
        .find(`import $_$action from '$_$filepath'`)
        .each(node => {
            const match = node.match
            const filePath = match['filepath'][0].value
            if (filePath.startsWith('@actions')) {
                const file = path.join(actionsDir, `/${platform}/${filePath.replace('@actions', '')}`) + '.js'
                try {
                    fs.accessSync(file)
                    console.log(file)
                    match['filepath'][0].node.value = filePath.replace('@actions', `@actions/${platform}`)
                } catch (err) {
                    console.error(`cannot find file ${file}`)
                }
            }
        })
        .root('sfc')
}

