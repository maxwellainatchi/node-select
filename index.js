module.exports = function(value, cases) {
    let result;
    if (cases[value]) {
        result = cases[value];
    } else if (cases.default) {
        result = cases.default;
    }
    if (typeof result === 'function') {
        return result()
    } else if (result instanceof Error) {
        throw result
    } else {
        return result
    }
};
