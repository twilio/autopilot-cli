module.exports = (message, exit) => {
  console.error(message)
  // exit
  exit && process.exit(1)
}
