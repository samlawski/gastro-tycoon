import test from 'ava'
const cards = require('../cards_loader.js')
const helper = require('../helper.js')

test('all cardsToAdd keys actually exist as card categories', t => {
  let allCardsToAddKeys = Object.values(cards).reduce((keyArr, cardsArr) => {
    let keysFromCards = cardsArr.reduce((groupKeyArr, card) => {
      let keysFromFresponses = card.responses.reduce((responseKeyArr, response) => {
        return responseKeyArr.concat(Object.keys(response.cardsToAdd))
      }, [])
      return groupKeyArr.concat(keysFromFresponses)
    }, [])
    return keyArr.concat(keysFromCards)
  }, [])

  let uniqueCardKeysToAdd = helper.arrayUniq(allCardsToAddKeys)

  t.true(
    uniqueCardKeysToAdd.every(category => {
      return Object.keys(cards).includes(category)
    })
  )
})
test('all cardsToRemove keys actually exist as card categories', t => {
  let allCardsToRemoveKeys = Object.values(cards).reduce((keyArr, cardsArr) => {
    let keysFromCards = cardsArr.reduce((groupKeyArr, card) => {
      let keysFromFresponses = card.responses.reduce((responseKeyArr, response) => {
        return responseKeyArr.concat(Object.keys(response.cardsToRemove))
      }, [])
      return groupKeyArr.concat(keysFromFresponses)
    }, [])
    return keyArr.concat(keysFromCards)
  }, [])

  let uniqueCardKeysToRemove = helper.arrayUniq(allCardsToRemoveKeys)

  t.true(
    uniqueCardKeysToRemove.every(category => {
      return Object.keys(cards).includes(category)
    })
  )
})

test('has all card types as keys prefixed with file name', t => {
  t.deepEqual(
    Object.keys(cards),
    [
      'assistants__tutorial', 'assistants__beginner', 'assistants__intermediate', 'assistants__expert',
      'beginnings__locations', 'beginnings__menu', 'beginnings__staff', 'beginnings__first_customer', 'beginnings__random',
      'events__city', 'events__random', 'events__rats', 'events__staff',
      'lateStories__mafia',
      'stories__tutorial', 'stories__vacation'
    ]
  )
})

test('cards have text', t => {
  t.deepEqual(
    cards['assistants__tutorial'][0].text,
    "Good day! My name is Smam and I can see it's your first time you're trying to open a gastronomy business. Beginning anything can be hard. I'm here to make your work easier. But you are the one making decisions. Is this your first time playing this game?"
  )
})

test('card responses have text', t => {
  t.deepEqual(
    cards['assistants__tutorial'][0].responses[0].text,
    "Oh excellent. In that let's dive right in and pick a location to open your business!"
  )
})

test('card response effects are all set', t => {
  t.deepEqual(
    cards['assistants__tutorial'][0].responses[0].effect,
    { "self": 10, "money": 10, "staff": 10, "customers": 10 }
  )
})

test('card responses have shuffle property set', t => {
  t.true(cards['assistants__tutorial'][0].responses[0].shuffle)
})
test('card responses have default gameOver property set', t => {
  t.false(cards['assistants__tutorial'][0].responses[0].gameOver)
})

test('card response cardsToAdd have all properties set', t => {
  t.deepEqual(
    cards['assistants__tutorial'][0].responses[0].cardsToAdd,
    {"beginnings__locations": {top: true, shuffle: true}}
  )
})
test('card response cardsToRemove have all properties set', t => {
  t.deepEqual(
    cards['assistants__tutorial'][0].responses[0].cardsToRemove,
    {}
  )
})

test('sets new group key as category of the card', t => {
  t.deepEqual(
    cards['assistants__tutorial'][0].category,
    'assistants__tutorial'
  )
})
