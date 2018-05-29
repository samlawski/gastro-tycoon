import test from 'ava'
const {say, availableLocales} = require('../assets/speechAssets.js')

test.beforeEach(t => {
  say.prototype.locale = 'en-US'
  say.prototype.action = 'welcomeIntent'
})

// .say()
test('returns correct string for given intent', t => {
  t.is(
    say('welcome'),
    `Welcome to Gastro Tycoon. Ask me for 'instructions' if you don't know how to play. To dive in immediately just say 'start'.`
  )
})

// .availableLocales
// test('returns only English for now', t => {
//   t.deepEqual(
//     availableLocales,
//     ['en-US']
//   )
// })
