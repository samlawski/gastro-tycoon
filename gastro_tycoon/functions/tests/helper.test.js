import test from 'ava'
const helper = require('../helper.js')

test('is an object', t => {
  t.deepEqual(
    Object.keys(helper),
    ['arrayUniq', 'isPresent', 'randomIndexOfArray', 'randomOf', 'shuffle']
  )
})

// .arrayUniq()
test('arrayUniq returns only unique elements of an array', t => {
  t.deepEqual(
    helper.arrayUniq([2,2,3,3]),
    [2,3]
  )
})

// .isPresent()
test('array returns true', t => {
  t.true(helper.isPresent([42]))
})
test('string returns true', t => {
  t.true(helper.isPresent('carl'))
})
test('object returns true', t => {
  t.true(helper.isPresent({a: 42}))
})
test('null returns false', t => {
  t.false(helper.isPresent(null))
})
test('undefined returns false', t => {
  t.false(helper.isPresent(undefined))
})
test('empty string returns false', t => {
  t.false(helper.isPresent(''))
})
test('empty array returns false', t => {
  t.false(helper.isPresent([]))
})
test('empty object returns false', t => {
  t.false(helper.isPresent({}))
})


//.randomIndexOfArray()
test('returns a random number within length of array', t => {
  t.true(
    [0,1,2].includes(
      helper.randomIndexOfArray(['a', 'b', 'c'])
    )
  )
})

//.randomOf()
test('returns a random element from the array', t => {
  t.true(
    ['a', 'b', 'c'].includes(
      helper.randomOf(['a', 'b', 'c'])
    )
  )
})

//.shuffle()
test('returns a shuffled version of the given array', t => {
  let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
  t.not(helper.shuffle(arr), arr)
})
