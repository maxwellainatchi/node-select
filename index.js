module.exports = function(value, cases, options) {
    options = options || {};
    if (![true, false].includes(options.autoCall) ) { options.autoCall = true; }
    if (![true, false].includes(options.autoThrow) ) { options.autoThrow = true; }
    if (![true, false].includes(options.parseObjectTree) ) { options.parseObjectTree = false; }    

    let result;
    if (cases[value]) {
        result = cases[value];
    } else if (cases.default_case && cases[cases.default_case]) {
        result = cases[cases.default_case];
    } else if (cases.default) {
        result = cases.default;
    }
    if (options.autoCall && typeof result === 'function') {
        return result()
    } else if (options.autoThrow && result instanceof Error) {
        throw result
    } else {
        return result
    }
};
