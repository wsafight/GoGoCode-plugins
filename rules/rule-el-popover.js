module.exports = function (ast, options, $) {
    const platform = process.env.platform
    return ast
        .find('<template></template>')
        .replace(
            `<template platform="$_$platform">$_$</template>`,
            match => {
                const isMatchPlatform = match['platform'][0].value === platform
                console.log(isMatchPlatform ? match[0][0].value : '')
                return isMatchPlatform ?  match[0][0].value.trim() : ''
            })
        .root('sfc');
}
