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

test('startAssistant adds advanced assistants based on number of previous attempts', t => {
  t.deepEqual(game.startAssistant(11), 'assistants__advanced')
})
test('startAssistant adds intermediate assistants based on number of previous attempts', t => {
  t.deepEqual(game.startAssistant(6), 'assistants__intermediate')
})
test('startAssistant adds beginner assistants based on number of previous attempts', t => {
  t.deepEqual(game.startAssistant(1), 'assistants__beginner')
})
test('startAssistant adds tutorial assistants based on number of previous attempts', t => {
  t.deepEqual(game.startAssistant(0), 'assistants__tutorial')
})

// .updateStats

test('updateStats updates stats effects based on user choise', t => {
  let userChoiceResponse = {
    "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 }
  }

  t.deepEqual(
    game.updatedStats({self: 2, money: -2, staff: 0, customers: -10}, userChoiceResponse),
    {self: 12, money: 8, staff: 10, customers: 0}
  )
})
