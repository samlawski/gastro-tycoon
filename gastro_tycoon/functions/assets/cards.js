/*
  Legend:
    - `addToTop: true, shuffleDeck: true`
      Default. Just put the cards on top of the deck and reshuffle everything
    - `addToTop: true, shuffleDeck: false`
      Put cards on top and make sure the next one drawn is definitely from the added cards
    - `addToTop: false, shuffleDeck: false`
      Add cards at the bottom and don't shuffle yet. Makes the new cards don't appear in the next turn already
*/

const cards = require('./cards/legacyCards.json')

function buildCards(cards, category = 'random'){
  return cards.map(card => {
    // Add category to card
    card.category = category
    // Set default response values
    card.responses = card.responses.map(responseObj => {
      let newObj = Object.assign({}, responseObj)
      // Set effect defaults
      if(newObj.effect == undefined){
        newObj.effect = { self: 0, money: 0, staff: 0, customers: 0 }
      }else{
        newObj.effect.self = newObj.effect.self == undefined ? 0 : newObj.effect.self
        newObj.effect.money = newObj.effect.money == undefined ? 0 : newObj.effect.money
        newObj.effect.staff = newObj.effect.staff == undefined ? 0 : newObj.effect.staff
        newObj.effect.customers = newObj.effect.customers == undefined ? 0 : newObj.effect.customers
      }
      // Set action and deck defaults
      newObj.text = newObj.text == undefined ? '' : newObj.text
      newObj.cardsToAdd = newObj.cardsToAdd == undefined ? [] : newObj.cardsToAdd
      newObj.cardsToRemove = newObj.cardsToRemove == undefined ? [] : newObj.cardsToRemove
      newObj.addToTop = newObj.addToTop == undefined ? true : newObj.addToTop
      newObj.shuffleDeck = newObj.shuffleDeck == undefined ? true : newObj.shuffleDeck
      newObj.gameOver = newObj.gameOver == undefined ? false : newObj.gameOver
      return newObj
    })
    return card
  })
}
// Add the key of each group of cards as 'category' for each individual card
module.exports = Object.keys(cards).reduce((accumulator, currentKey) => {
  accumulator[currentKey] = buildCards(cards[currentKey], currentKey)
  return accumulator
}, {})
