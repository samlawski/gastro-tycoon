const Deck = require('./deck_utility.js')
const CARDS = require('./cards_loader.js')
const helper = require('./helper.js')

module.exports = {

  notStarted: gameState => {
    return !gameState ||
           (gameState && (
             gameState.progress <= 0 ||
             gameState.deck.length <= 0
           ))
  },

  initialState: (initialDeck = []) => {
    return {
      stats: {
        self: 0,
        money: 0,
        staff: 0,
        customers: 0
      },
      progress: 0,
      deck: initialDeck
    }
  },

  startAssistant: playCount => {
    if(playCount > 10){
      return 'assistants__advanced'
    }else if(playCount > 5){
      return 'assistants__intermediate'
    }else if(playCount > 0){
      return 'assistants__beginner'
    }else{
      return 'assistants__tutorial'
    }
  },

  updatedStats: (originalStats, usersChoiceResponse) => {
    return Object.keys(usersChoiceResponse.effect).reduce((accumulator, currentKey) => {
      let statusValue = usersChoiceResponse.effect[currentKey]
      accumulator[currentKey] += statusValue
      return accumulator
    }, originalStats)
  },

  statsKeysLow: stats => Object.keys(stats).filter(statKey => stats[statKey] < 5),
  // TODO statKeysTooHigh(conv) {}

  gameOverCriteria: (gameState, usersChoiceResponse) =>{
    let tooLowStatKeys = Object.keys(gameState.stats).filter(statKey => gameState.stats[statKey] < 0)
    // let tooHighStatKeys = Object.keys(gameState.stats).filter(statKey => gameState.stats[statKey] > 15)

    if((gameState.deck.length <= 0) && (gameState.progress <= 1)){
      return 'notEvenStarted'
    }else if(usersChoiceResponse.gameOver && !gameState.godmode){
      return usersChoiceResponse.gameOver // custom Game Over message
    }else if(gameState.stats.self > 15 && !gameState.godmode){
      return 'self__high'
    }else if(tooLowStatKeys.length > 0 && !gameState.godmode){
      return tooLowStatKeys[0]
    }else if(gameState.deck.length <= 0){
      return 'cardsOut'
    }else{
      return false
    }
  },

  applyCheat: (gameState, cheat) => {
    if(cheat == 'robinhood'){
      gameState.stats.money += 10
    }else if(cheat == 'godmode'){
      gameState.godmode = true
    }else if(cheat == 'pirate'){
      gameState.deck = Deck.withCardsOnTop(
        gameState.deck,
        helper.shuffle(CARDS['stories__vacation'])
      )
    }
    return gameState
  }

}
