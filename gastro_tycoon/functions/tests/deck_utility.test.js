import test from 'ava'
const Deck = require('../deck_utility.js')

// .withCardsOnTop

test('withCardsOnTop spreads second argument at beginning of array', t => {
  t.deepEqual(
    Deck.withCardsOnTop([1,2,3], [4,5,6]),
    [4,5,6,1,2,3]
  )
})

// .withCardsAtBottom

test('withCardsAtBottom spreads second argument at the end of array', t => {
  t.deepEqual(
    Deck.withCardsAtBottom([1,2,3], [4,5,6]),
    [1,2,3,4,5,6]
  )
})

// .withoutCategories

test('withoutCategories filters cards from deck with given category', t => {
  const deck = [{category: 'fred'}, {category: 'bob'}]
  t.deepEqual(
    Deck.withoutCategories(deck, ['fred']),
    [{category: 'bob'}]
  )
})

// .rebuild

const currentDeck = [
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
  },
  {
    "category": "assistants__tutorial",
    "text": "Second Test Card",
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
  },
  {
    "category": "assistants__beginner",
    "text": "Second Test Card",
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

test('rebuild removes cards to remove', t => {
  let userChoiceResponse = {
    "text": "Oh excellent. In that let's dive right in and pick a location to open your business!",
    "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 },
    "cardsToAdd": {},
    "cardsToRemove": {"assistants__tutorial": {"top": true, "shuffle": true}},
    "shuffle": true, "gameOver": false
  }

  t.deepEqual(
    Deck.rebuild(currentDeck, userChoiceResponse).length,
    1
  )
})

test('rebuild removes multiple keys', t => {
  let userChoiceResponse = {
    "text": "Oh excellent. In that let's dive right in and pick a location to open your business!",
    "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 },
    "cardsToAdd": {},
    "cardsToRemove": {
      "assistants__tutorial": {"top": true, "shuffle": true},
      "assistants__beginner": {"top": true, "shuffle": true}
    },
    "shuffle": true, "gameOver": false
  }

  t.deepEqual(
    Deck.rebuild(currentDeck, userChoiceResponse),
    []
  )
})

test('rebuild adds new cards to the top', t => {
  let userChoiceResponse = {
    "text": "Test",
    "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 },
    "cardsToAdd": {
      "beginnings__locations": {"top": true, "shuffle": false},
      "beginnings__menu": {"top": false, "shuffle": true}
    },
    "cardsToRemove": {},
    "shuffle": false, "gameOver": false
  }

  t.deepEqual(
    Deck.rebuild(currentDeck, userChoiceResponse)[0].category,
    "beginnings__locations"
  )
})

test('rebuild add new cards to the bottom', t => {
  let userChoiceResponse = {
    "text": "Test",
    "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 },
    "cardsToAdd": {
      "beginnings__locations": {"top": true, "shuffle": false},
      "beginnings__menu": {"top": false, "shuffle": true}
    },
    "cardsToRemove": {},
    "shuffle": false, "gameOver": false
  }

  t.deepEqual(
    Deck.rebuild(currentDeck, userChoiceResponse).reverse()[0].category,
    "beginnings__menu"
  )
})

test('rebuild does not add cards of a category if that category is already present', t => {
  let userChoiceResponse = {
    "text": "Test",
    "effect": { "self": 10, "money": 10, "staff": 10, "customers": 10 },
    "cardsToAdd": {
      "assistants__beginner": {"top": true, "shuffle": true}
    },
    "cardsToRemove": {},
    "shuffle": false, "gameOver": false
  }

  t.deepEqual(
    Deck.rebuild(currentDeck, userChoiceResponse).map(c => c.category),
    ["assistants__tutorial", "assistants__tutorial", "assistants__beginner"]
  )
})
