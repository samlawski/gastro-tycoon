const helper = require('../helper.js')

const speechAssets = (params = {}) => {
  let p = param => params[param] || '' // doc: fallback in case passed param doesn't exist
  return {
    'en-US': {
      'welcomeIntent': {
        welcome: `Welcome to Gastro Tycoon. Ask me for 'instructions' if you don't know how to play. To dive in immediately just say 'start'.`,
        welcomeBack: `Welcome back! Your previous business was alive for ${p('score')} day${p('score') > 1 ? 's' : ''}. Just tell me to start a new round if you want or ask me for instructions if you need a reminder on how to play.`,
        suggestions: [`Start the game!`, `How do I play?`]
      },
      'helpIntent': {
        instructions: `In this game, your assistant will ask you questions. The only thing you'll ever have to do is answer with either yes or no. Each decision you make influences either your money, customer satisfaction, staff happiness and personal stress level. Make sure that the decisions you make keep those four values balanced. If any of those values get too little, you lose. But be careful. Being too good in any of them might also cause unwanted effects. Your goal is to keep your business alive as long as possible.`,
        outroBeforeGame: `If you want to start a game, just say 'start'.`,
        outroInGame: `Let's resume the game...`,
        suggestions: [`Start the game!`, `How do I play?`],
        suggestionsInGame: [`Yes`, `No`]
      },
      'fallbackIntent': {
        inGame: helper.randomOf([
          `I didn't catch that. Can you please answer with either yes or no? Or ask for help.`,
          `Please respond with yes or no.`
        ]),
        suggestionsInGame: [`Yes`, `No`],
        beforeGame: helper.randomOf([
          `I'm sorry I didn't get that. You can ask me to start a game or ask for the game's instructions.`,
          `My apologies. I didn't understand. What do you want to do? Start a game or hear the instructions?`
        ]),
        suggestionsBeforeGame: [`Start the game!`, `How do I play?`]
      },
      'startNewGameIntent': {
        startOptions: helper.randomOf([`Let's go!`, `Starting up!`, `Alright!`]),
        startOverConfirmation: `Are you sure you want to restart the game? This will reset your entire progress.`,
        suggestions: [`Yes`, `No`]
      },
      'restartGameHandler': {
        resumeConfirmation: `Alright. Where were we?`,
        suggestions: [`Yes`, `No`]
      },
      'responseIntent': {
        suggestions: [`Yes`, `No`],
        gameOverSuggestions: [`Start over!`, `Stop.`],
        gameOver: {
          self: `You're burned out and eat everything in your restaurant.`,
          self__high: `You finally discovered what it means to have inner peace. You close your restaurant and disappear... Forever.`,
          money: `You're broke. The banks shut down your restaurant.`,
          staff: `All your staff leaves you for Lui's restaurant around the corner. You're done.`,
          customers: `Nobody likes your restaurant. Without any customers, it doesn't make any sense to keep this place open.`,
          cardsOut: `Congratulations! Your restaurant was voted best of the city! There is no higher honor than that. You are free to retire now.`,
          notEvenStarted: `Wow. You failed before you even started. Well, that's unfortunate.`,
          lostInSpace: `You spent 3 more years in space until you finally accept that no one will ever show up. You close shop and decide to start a business to sell moon rock.`,
          deathByAsteroid: `An enormous asteroid squashed you. It was a quick death.`,
          deathByAlien: `The aliens didn't appreciate how they were treated, pulled out a laser gun and shot you.`
        },
        gameOver__message: `Tell me to start over if you want to give it another try with a new restaurant. Or say 'stop' to close the game.`,
        gameOver__score: `Congratulations! Your business survived ${p('score')} day${p('score') > 1 ? 's' : ''}!`
      },
      'cheatIntent': {
        robinhood: "Let it rain gold!",
        godmode: "You can't lose anymore!",
        pirate: "Let's go on vacation.",
        suggestions: [`Yes`, `No`]
      },
      // NON-INTENTS
      'statusWarnings': {
        low: {
          self: helper.randomOf([
            `Things are getting stressful.`,
            `You really don't look healthy. You should do something about that.`,
            `You should step a little shorter. You look horrible.`,
            `You should do something about your health.`,
            `Did you get enough sleep? You look very tired.`,
            `You can't keep going like that. Look after yourself!`,
            `Make sure to watch your own health!`
          ]),
          money: helper.randomOf([
            `Your finances are starting to concern me.`,
            `Keep an eye on your money. It's starting to run low.`,
            `If things keep going like this you might not be able to pay salaries soon.`,
            `You really gotta watch your bank account. It doesn't look good.`,
            `Be careful. Money doesn't last forever.`
          ]),
          staff: helper.randomOf([
            `Your staff starts being slightly unhappy.`,
            `I hear increasingly complaints from your staff.`,
            `Your staff situation is not optimal.`,
            `You gotta improve your employee situation.`
          ]),
          customers: helper.randomOf([
            `I haven't seen many customers lately.`,
            `Your restaurant ratings are going down.`,
            `I hear quite a few complaints from customers.`,
            `Keep your customers in mind as you make your next decisions. They've been unhappy.`
          ])
        }
      }
    }
  }
}


function say(key, params = {}, groupKey = say.prototype.action) {
  return speechAssets(params)[say.prototype.locale][groupKey][key]
}
say.prototype.locale = 'en-US'

const availableLocales = Object.keys(speechAssets)

module.exports = {say, availableLocales}
