module.exports = function (ast) {
    const platform = process.env.platform
    return ast
        .find('<template></template>')
        .replace(
            `<template platform="$_$platform">$_$content</template>`,
            match => {
                const isMatchPlatform = match['platform'][0].value === platform
                return isMatchPlatform ? match['content'][0].value.trim() : ''
            }
        )
        .root('sfc')
}
