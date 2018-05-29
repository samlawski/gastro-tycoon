module.exports = {
  isPresent: x => (typeof x != 'undefined') && (x != undefined) && (x.length > 0 || Object.keys(x).length > 0),
  randomIndexOfArray: array => Math.floor(Math.random() * array.length),
  randomOf: array => array[Math.floor(Math.random() * array.length)],
  shuffle: array => array.slice().sort(() => Math.random() - 0.5)
}
