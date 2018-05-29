const helper = require('./helper.js')
const CARDS = require('./cards_loader.js')

module.exports = (() => {
  const withCardsOnTop = (deck, newCards) => [...newCards, ...deck]

  const withCardsAtBottom = (deck, newCards) => [...deck, ...newCards]

  const withoutCategories = (deck, categories) => deck.filter(card => !categories.includes(card.category))

  const rebuild = (deck, usersChoiceResponse) => {
    let newDeck = deck.slice()
    // Remove cards from the deck
    newDeck = withoutCategories(
      deck, Object.keys(usersChoiceResponse.cardsToRemove)
    )
    // Add new cards to the deck
    Object.keys(usersChoiceResponse.cardsToAdd).forEach(category => {
      let choiceObj = usersChoiceResponse.cardsToAdd[category]

      newDeck = choiceObj.top ?
        withCardsOnTop(
          newDeck,
          choiceObj.shuffle ? helper.shuffle(CARDS[category]) : CARDS[category]
        ) :
        withCardsAtBottom(
          newDeck,
          choiceObj.shuffle ? helper.shuffle(CARDS[category]) : CARDS[category]
        )
    })
    // Shuffle deck if response requires it
    newDeck = usersChoiceResponse.shuffle ?
      helper.shuffle(newDeck) : newDeck
    return newDeck
  }

  return {
    withCardsOnTop,
    withCardsAtBottom,
    withoutCategories,
    rebuild
  }
})()
