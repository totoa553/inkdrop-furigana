module.exports = rubyLocator

function rubyLocator(value, fromIndex) {
    return value.indexOf('｜', fromIndex);
}