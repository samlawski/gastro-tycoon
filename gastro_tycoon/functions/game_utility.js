const Deck = require('./deck_utility.js')
const CARDS = require('./cards_loader.js')
const helper = require('./helper.js')

module.exports = (() => {
  const notStarted = gameState => {
    return !gameState ||
           (gameState && (
             gameState.progress <= 0 ||
             gameState.deck.length <= 0
           ))
  }

  const initialState = (initialDeck = []) => {
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
  }

  const startAssistant = playCount => {
    if(playCount > 10){
      return 'assistants__expert'
    }else if(playCount > 5){
      return 'assistants__intermediate'
    }else if(playCount > 0){
      return 'assistants__beginner'
    }else{
      return 'assistants__tutorial'
    }
  }

  const updatedStats = (originalStats, usersChoiceResponse) => {
    return usersChoiceResponse.resetStats ?
      usersChoiceResponse.effect :
      Object.keys(usersChoiceResponse.effect).reduce((accumulator, currentKey) => {
        let statusValue = usersChoiceResponse.effect[currentKey]
        accumulator[currentKey] += statusValue
        return accumulator
      }, originalStats)
  }

  const statsKeysLow = stats => Object.keys(stats).filter(statKey => stats[statKey] < 5)
  // TODO statKeysTooHigh(conv) {}

  const statsAsEmoji = originalStats => {
    return Object.keys(originalStats).reduce((stats, statKey) => {
      stats[statKey] = _numberToEmoji(originalStats[statKey])
      return stats
    }, {})
  }

  const gameOverCriteria = (gameState, usersChoiceResponse) =>{
    let tooLowStatKeys = Object.keys(gameState.stats).filter(statKey => gameState.stats[statKey] < 0)
    // let tooHighStatKeys = Object.keys(gameState.stats).filter(statKey => gameState.stats[statKey] > 15)
    let lastCardStillBeginning = gameState.deck.length == 1 && [
      'beginnings__locations',
      'assistants__beginner',
      'assistants__tutorial',
      'assistants__intermediate',
      'assistants__expert'
    ].includes(gameState.deck[0].category)

    if((gameState.deck.length <= 0 && gameState.progress <= 0) ||
        lastCardStillBeginning){
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
  }

  const applyCheat = (conv, cheat) => {
    if(cheat == 'robinhood'){
      conv.data.gameState.stats.money += 10
    }else if(cheat == 'godmode'){
      conv.data.gameState.godmode = true
    }else if(cheat == 'reset'){
      conv.user.storage.highScore = 0
      conv.user.storage.playedGamesCount = 0
    }else if(cheat == 'pirate'){
      conv.data.gameState.deck = Deck.withCardsOnTop(
        conv.data.gameState.deck,
        helper.shuffle(CARDS['stories__vacation'])
      )
    }
    return conv
  }

  const _numberToEmoji = number => {
    //🌕🌖🌗🌘🌑
    const maxValues = [
      [4, '😰'],
      [7, '☹️'],
      [10, '🙁'],
      [13, '😐'],
      [16, '🙂'],
      [19, '😀'],
      [21, '😁']
    ]
    const statArray = maxValues.find(valArr => number < valArr[0]) || maxValues[maxValues.length - 1]
    return statArray[1]
  }

  return {
    notStarted,
    initialState,
    startAssistant,
    updatedStats,
    statsKeysLow,
    statsAsEmoji,
    gameOverCriteria,
    applyCheat,
    _numberToEmoji
  }
})()
