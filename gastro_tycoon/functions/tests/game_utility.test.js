import test from 'ava'
const game = require('../game_utility.js')
const CARDS = require('../cards_loader.js')

// .notStarted

test('notStarted returns true for empty game state', t => {
  t.true(game.notStarted(undefined))
})

// .initialGameState

test('initialGameState returns the correct object', t => {
  t.deepEqual(
    game.initialState(),
    {
      stats: {
        self: 0,
        money: 0,
        staff: 0,
        customers: 0
      },
      progress: 0,
      deck: []
    }
  )
})

test('sets the actual deck', t => {
  t.deepEqual(
    game.initialState(CARDS['assistants__tutorial']).deck[0].text,
    "Good day! My name is Smam and I can see it's your first time you're trying to open a gastronomy business. Beginning anything can be hard. I'm here to make your work easier. But you are the one making decisions. Is this your first time playing this game?"
  )
})

// .startAssistant

test('startAssistant advanced', t => {
  t.deepEqual(game.startAssistant(11), 'assistants__advanced')
})
test('startAssistant intermediate', t => {
  t.deepEqual(game.startAssistant(6), 'assistants__intermediate')
})
test('startAssistant beginner', t => {
  t.deepEqual(game.startAssistant(1), 'assistants__beginner')
})
test('startAssistant tutorial', t => {
  t.deepEqual(game.startAssistant(0), 'assistants__tutorial')
})
