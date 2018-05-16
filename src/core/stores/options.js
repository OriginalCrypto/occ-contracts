/* globals process */
function normalizeOption(option) {
  if (String.prototype.substring.apply(option, [0, 2]) !== '--') {
    option = `--${option}`
  }

  return option
}

function indexOfOption (option) {
  return process.argv.indexOf(normalizeOption(option))
}

function indexOfValue (option) {
  const optionIndex = indexOfOption(option),
        valueIndex = optionIndex > -1 && process.argv.length > (optionIndex + 1) ? optionIndex + 1: -1

  return valueIndex
}

function get (option) {
  if (has(option)) {
    if (hasValue(option)) {
      return process.argv[indexOfValue(option)]
    }

    return true
  }
}

function has (option) {
  if (!option) return false
  
  return indexOfOption(option) > -1
}

function hasValue (option) {
  return indexOfValue(option) > -1
}

module.exports = { get, has, hasValue }
