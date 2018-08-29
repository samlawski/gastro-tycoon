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
    "Good day! My name is Sam and I can see it's your first time you're trying to open a gastronomy business. Beginning anything can be hard. I'm here to make your work easier. But you are the one making decisions. Is this your first time playing this game?"
  )
})

// .startAssistant

test('startAssistant adds advanced assistants based on number of previous attempts', t => {
  t.deepEqual(game.startAssistant(11), 'assistants__expert')
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
test('updateStats with resetStats true sets the effect stats exactly as they are instead of calculating them', t => {
  let userChoiceResponse = {
    "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 },
    "resetStats": true
  }

  t.deepEqual(
    game.updatedStats({self: 2, money: -2, staff: 0, customers: -10}, userChoiceResponse),
    {self: 10, money: 10, staff: 10, customers: 10}
  )
})

// .statsKeysLow

test('statsKeysLow', t => {
  t.deepEqual(
    game.statsKeysLow({self: 3, money: 6, customers: 5, staff: 1}),
    ['self', 'staff']
  )
})

// .statsAsEmoji

test('statsAsEmoji converts numbers to emoji', t => {
  t.deepEqual(
    game.statsAsEmoji({self: 3, money: 6, customers: 10, staff: 20}),
    {self: '😨', money: '😥', customers: '😐', staff: '😁'}
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
test('gameOverCriteria notEvenStarted if last card is beginnings__locations', t => {
  let gameState = {stats: {}, deck: [{category: 'beginnings__locations'}], progress: 2}
  t.deepEqual(
    game.gameOverCriteria(gameState, {}),
    'notEvenStarted'
  )
})
test('gameOverCriteria notEvenStarted if last card is assistants__*', t => {
  let gameState = {stats: {}, deck: [{category: 'assistants__tutorial'}], progress: 2}
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
test('gameOverCriteria met for self stats above 21', t => {
  let gameState = {stats: {self: 22}, deck: [1], progress: 1}
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

// .applyCheat

test('applyCheat raises money for robinhood', t => {
  let conv = {data: {gameState: {stats: {money: 1}} }}
  t.deepEqual(
    game.applyCheat(conv, 'robinhood'),
    {data: {gameState: {stats: {money: 11}} }}
  )
})
test('applyCheat set godmode true', t => {
  let conv = {data: {gameState: {stats: {money: 1}} }}
  t.deepEqual(
    game.applyCheat(conv, 'godmode'),
    {data: {gameState: {stats: {money: 1}, godmode: true} }}
  )
})
test('applyCheat add vacation cards to top for pirate', t => {
  let conv = {
    data: {
      gameState: {
        deck: [
          {
            "category": "assistants__tutorial",
            "text": "Good day! My name is Smam and I can see it's your first time you're trying to open a gastronomy business. Beginning anything can be hard. I'm here to make your work easier. But you are the one making decisions. Is this your first time playing this game?",
            "responses": [
              {
                "text": "Oh excellent. In that let's dive right in and pick a location to open your business!",
                "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 },
                "cardsToAdd": {"beginnings__locations": {"top": true, "shuffle": true}},
                "cardsToRemove": {"assistants__tutorial": {"top": true, "shuffle": true}},
                "shuffle": true, "gameOver": false
              },
              {
                "text": "No worries. That's what I'm here for. I will be your personal assistant and present to you everything you need to decide on and all you gotta do is to tell me whether you agree or not. I will take care of the rest.",
                "effect": { "self": 12, "money": 12, "staff": 12, "customers": 12 },
                "cardsToAdd": {"stories__tutorial__01": {"top": true, "shuffle": false}},
                "cardsToRemove": {"assistants__tutorial": {"top": true, "shuffle": true}},
                "shuffle": true, "gameOver": false
              }
            ]
          }
        ]
      }
    }
  }
  let newState = game.applyCheat(conv, 'pirate')

  t.deepEqual(
    newState.data.gameState.deck[0].category,
    'stories__vacation'
  )
})
test('applyCheat resets user values for reset', t => {
  let conv = {user: {storage: {highScore: 42, playedGamesCount: 2}}}
  t.deepEqual(
    Object.values(game.applyCheat(conv, 'reset').user.storage),
    [0,0]
  )
})
test('applyCheat does not overwrite other conv values', t => {
  let conv = {data: {gameState: {stats: {money: 1}} }, user: {storage: {highScore: 42}}}
  t.deepEqual(
    game.applyCheat(conv, 'robinhood').user.storage.highScore,
    42
  )
})

// PRIVATE METHODS

// ._numberToEmoji

test('_numberToEmoji returns lowest emoji as low fallback', t => {
  t.deepEqual(game._numberToEmoji(-1), '😨')
})
test('_numberToEmoji returns lowest emojis', t => {
  t.deepEqual(game._numberToEmoji(0), '😨')
  t.deepEqual(game._numberToEmoji(1), '😨')
  t.deepEqual(game._numberToEmoji(2), '😨')
  t.deepEqual(game._numberToEmoji(3), '😨')
})
test('_numberToEmoji returns medium emojis', t => {
  t.deepEqual(game._numberToEmoji(4), '😥')
  t.deepEqual(game._numberToEmoji(5), '😥')
  t.deepEqual(game._numberToEmoji(6), '😥')
})
test('_numberToEmoji returns highest emoji', t => {
  t.deepEqual(game._numberToEmoji(19), '😁')
  t.deepEqual(game._numberToEmoji(20), '😁')
  t.deepEqual(game._numberToEmoji(21), '😁')
})
test('_numberToEmoji returns highest emoji as high fallback', t => {
  t.deepEqual(game._numberToEmoji(100), '😁')
})
