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

  statsKeysLow: stats => Object.keys(stats).filter(statKey => stats[statKey] < 5)

}
