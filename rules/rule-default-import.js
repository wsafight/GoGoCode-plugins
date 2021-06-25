const fs = require('fs')
const path = require("path")

const actionsDir = path.join(__dirname, '../test/actions')

const filePaths = []

// The current import path has no file suffix and no file. Try to use the following suffixes in turn
const fileSuffix = ['ts', 'js', 'json', 'node']

// TODO Pre generate an array of strings for all files
function setFilePaths (dirs) {
    dirs.forEach(() => {

    })
}


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
                    // Check whether the file exists. No exception is thrown
                    fs.accessSync(file)
                    // Replace imported path
                    match['filepath'][0].node.value = filePath.replace('@actions', `@actions/${platform}`)
                } catch (err) {
                    console.error(`cannot find file ${file}`)
                }
            }
        })
        .root('sfc')
}

