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

// .statsKeysLow

test('statsKeysLow', t => {
  t.deepEqual(
    game.statsKeysLow({self: 3, money: 6, customers: 5, staff: 1}),
    ['self', 'staff']
  )
})

// .gameOverCriteria

test('gameOverCriteria met for unstarted games', t => {
  let gameState = {stats: {}, deck: [], progress: 0}
  t.deepEqual(
    game.gameOverCriteria(gameState, {}),
    'notEvenStarted'
  )
})
test('gameOverCriteria met for response with gameOver true', t => {
  let gameState = {stats: {}, deck: [1], progress: 1}
  t.deepEqual(
    game.gameOverCriteria(gameState, {gameOver: 'You lost!'}),
    'You lost!'
  )
})
test('gameOverCriteria met for any stats below 0', t => {
  let gameState = {stats: {self: -1, money: -1, customers: 5, staff: 1}, deck: [1], progress: 1}
  t.deepEqual(
    game.gameOverCriteria(gameState, {}),
    'self'
  )
})
test('gameOverCriteria met for self stats above 15', t => {
  let gameState = {stats: {self: 16}, deck: [1], progress: 1}
  t.deepEqual(
    game.gameOverCriteria(gameState, {}),
    'self__high'
  )
})
test('gameOverCriteria met for empty deck', t => {
  let gameState = {stats: {self: 5}, deck: [], progress: 42}
  t.deepEqual(
    game.gameOverCriteria(gameState, {}),
    'cardsOut'
  )
})
test('gameOverCriteria not met with standard set', t => {
  let gameState = {stats: {self: 5}, deck: [1], progress: 42}
  t.false(
    game.gameOverCriteria(gameState, {})
  )
})
test('gameOverCriteria not met with godmode cheat', t => {
  let gameState = {stats: {self: -1}, deck: [1], progress: 42, godmode: true}
  t.false(
    game.gameOverCriteria(gameState, {})
  )
})
