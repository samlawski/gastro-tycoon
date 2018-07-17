import test from 'ava'
const Cards = require('../cards_loader.js')
const Dev = require('../dev_utility.js')

/*
  This file contains a number of balancing tests
  to help identify unbalanced parts of the game
  and know where to add new cards.
*/

// Beginnings

test('beginnings__locations always "no" needs to lose the game for money', t => {
  const cardsOfCategory = Cards['beginnings__locations']
  const moneyValuesOfAnswerNo = cardsOfCategory.map(card => card.responses[0].effect.money)
  const totalMoneyForAllNo = moneyValuesOfAnswerNo.reduce((total, val) => total + val)

  t.true(totalMoneyForAllNo < -10)
})

// test('beginnings__locations all "yes" add beginnings__menu')
// test('beginnings__location the total of all effects of any "yes" answer need to be 0')
// test('going the fastest route through "beginnings" needs to get the user on a balanced score with money back up to normal')
