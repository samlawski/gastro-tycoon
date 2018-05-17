module.exports = {
  randomIndexOfArray: array => Math.floor(Math.random() * array.length),
  randomOf: array => array[Math.floor(Math.random() * array.length)],
  shuffle: array => array.sort(() => Math.random() - 0.5)
}
