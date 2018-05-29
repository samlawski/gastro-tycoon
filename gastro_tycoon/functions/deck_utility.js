const gameNotStarted = gameState => {
  return !gameState ||
         (gameState && (
           gameState.progress <= 0 ||
           gameState.deck.length <= 0
         ))
}

module.exports = {
  gameNotStarted
}
