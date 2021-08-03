const fs = require('fs')
const path = require("path")

const actionsDir = path.join(__dirname, '../test/actions')

const filePaths = []

// The current import path has no file suffix and no file. Try to use the following suffixes in turn
const fileSuffix = ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue']

// Pre generate an array of strings for all files
function readFileList (dir) {
    const files = fs.readdirSync(dir);
    files.forEach(item => {
        var fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(path.join(dir, item));  //递归读取文件
        } else {
            filePaths.push(fullPath);
        }
    });
}

readFileList(actionsDir);

module.exports = function (ast) {
    const platform = process.env.platform
    return ast
        .find('<script></script>')
        .find(`import $_$action from '$_$filepath'`)
        .each(node => {
            const match = node.match
            const filePath = match['filepath'][0].value
            if (filePath.startsWith('@actions')) {
                const file = path.join(actionsDir, `/${platform}/${filePath.replace('@actions', '')}`)

                const hasFile = filePaths.some(path => {
                    if (path === file) {
                        return true
                    }
                    return fileSuffix.some(suffix => path === `${file}.${suffix}`)
                })
                if (hasFile) {
                    match['filepath'][0].node.value = filePath.replace('@actions', `@actions/${platform}`)
                }
            }
        })
        .root('sfc')
}

