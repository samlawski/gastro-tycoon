'use strict'
/* ** TABLE OF CONTENTS **
- Dependencies
- Speech Assets
- Library
- Private application logic
- App Middleware
- Event actions
- User intent actions
- Execute Action
*/

/* ** DEPENDENCIES ** */
const {dialogflow, Confirmation, Suggestions, SimpleResponse} = require('actions-on-google')
const functions = require('firebase-functions') // doc: to export the function
const app = dialogflow({debug: true}) // doc: toggle logs for debugging - TODO

/* ** ASSETS & LIBRARIES  ** */
const helper = require('./helper.js')
const CARDS = require('./cards_loader.js')
const {say, availableLocales} = require('./say_utility.js')

/* ** PRIVATE APPLICATION LOGIC ** */
const Game = require('./game_utility.js')
const Deck = require('./deck_utility.js')

function statusUpdate(statsLow) {
  return statsLow.map(key => helper.randomOf(say('low', {}, 'statusWarnings')[key])).join(' ')
}

function anyGameOverCriteriaMet(conv, usersChoiceResponse = {}){
  return Game.gameOverCriteria(conv.data.gameState, usersChoiceResponse) != false
}

/* ** APP MIDDLEWARE ** */

// doc: loads before each intent action
app.middleware(conv => {
  // doc: Set locale to user locale if available - otherwise use en-US
  say.prototype.locale = availableLocales.includes(conv.user.locale) ?
    conv.user.locale : 'en-US'
  // doc: Set current action (as speech assets are nested by intent action)
  say.prototype.action = conv.action
})

/* ** EVENT ACTIONS ** */

app.intent('RestartGameHandler', (conv, params, confirmationGranted) => { // Only handled if a game is currently active.
  if(confirmationGranted){
    conv.data.gameState = Game.initialState(
      helper.shuffle(
        CARDS[Game.startAssistant(conv.user.storage.playedGamesCount)]
      )
    )
  }

  conv.ask(say('resumeConfirmation'))
  conv.ask(conv.data.gameState.deck[0].text)
  conv.ask(new Suggestions(say('suggestions')))
})

/* ** USER INTENT ACTIONS ** */

app.intent('WelcomeIntent', conv => {
  (conv.user.storage.highScore > 0) ?
    conv.ask(say('welcomeBack', {score: conv.user.storage.highScore})) :
    conv.ask(say('welcome'))
  conv.ask(new Suggestions(say('suggestions')))
})

app.intent('HelpIntent', conv => {
  if(Game.notStarted(conv.data.gameState)){
    conv.ask(`${say('instructions')} ${say('outroBeforeGame')}`)
    conv.ask(new Suggestions(say('suggestions')))
  }else{
    conv.ask(say('instructions'))
    conv.ask(`${say('outroInGame')} ${conv.data.gameState.deck[0].text}`)
    conv.ask(new Suggestions(say('suggestionsInGame')))
  }
})

app.intent('Default Fallback Intent', conv => {
  if(Game.notStarted(conv.data.gameState)){
    conv.ask(helper.randomOf(say('beforeGame')))
    conv.ask(say('suggestionsBeforeGame'))
  }else{
    conv.ask(helper.randomOf(say('inGame')))
    conv.ask(say('suggestionsInGame'))
  }
})

app.intent('StartNewGameIntent', conv => {
  if(Game.notStarted(conv.data.gameState) || anyGameOverCriteriaMet(conv)){
    // Set initial game state
    conv.data.gameState = Game.initialState(
      helper.shuffle(
        CARDS[
          Game.startAssistant(conv.user.storage.playedGamesCount)
        ]
      )
    )

    conv.ask(helper.randomOf(say('startOptions')))
    conv.ask(conv.data.gameState.deck[0].text)
    conv.ask(new Suggestions(say('suggestions')))
  }else{
    conv.ask(new Confirmation(say('startOverConfirmation')))
  }
})

app.intent('ResponseIntent', (conv, params) => {
  var topCard = conv.data.gameState.deck.shift() // remove and return top card
  var usersChoiceResponse = topCard.responses[(params['YesOrNo'] == 'yes' ? 1 : 0)] // if answer yes: get responses index 1.
  // Update progress
  conv.data.gameState.progress++
  // Write latest highscore to user storage
  conv.user.storage.highScore = conv.data.gameState.progress
  // Update gameState status
  conv.data.gameState.stats = Game.updatedStats(conv.data.gameState.stats, usersChoiceResponse)
  console.log('Game Stats', conv.data.gameState.stats, conv.data.gameState.progress) // TODO remove after debugging
  // Rebuild the deck:
  conv.data.gameState.deck = Deck.rebuild(conv.data.gameState.deck, usersChoiceResponse)

  // Stop the game if any game-over criteria is true.
  if(anyGameOverCriteriaMet(conv, usersChoiceResponse)){
    // Game over response
    conv.ask(`${say('gameOver')[Game.gameOverCriteria(conv.data.gameState, usersChoiceResponse)]} ${say('gameOver__score', {score: conv.data.gameState.progress})}`)
    conv.ask(say('gameOver__message'))
    conv.ask(new Suggestions(say('gameOverSuggestions')))
  }else{
    // Continue game response
    let response = `${usersChoiceResponse.text} ${statusUpdate(Game.statsKeysLow(conv.data.gameState.stats))}`
    conv.ask(new SimpleResponse({
      speech: response,
      text: `${response}${conv.data.gameState.progress > 0 ? ' Days in business: ' + conv.data.gameState.progress : ''}`
    }))
    conv.ask(conv.data.gameState.deck[0].text)
    conv.ask(new Suggestions(say('suggestions')))
  }
})

app.intent('CheatIntent', (conv, params) => {
  let cheat = params['cheatCode']
  conv.data.gameState = Game.applyCheat(cong.data.gameState, cheat)

  conv.ask(new SimpleResponse({
    speech: `
      <speak>
        <audio src="https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"></audio>
        ${say(cheat)}
      </speak>`,
    text: say(cheat)
  }))
  conv.ask(conv.data.gameState.deck[0].text)
  conv.ask(new Suggestions(say('suggestions')))
})

/* ** EXECUTE ACTION ** */
exports.gastroTycoonIndex = functions.https.onRequest(app)
