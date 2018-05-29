// const templateCard = {
//   "text": "",
//   "responses": [
//     { // response: no
//       "text": "",
//       "effect": { "self": 0, "money": 0, "staff": 0, "customers": 0 },
//       "cardsToAdd": {"": {"top": true, "shuffle": true}},
//       "cardsToRemove": {"": {"top": true, "shuffle": true}},
//       "shuffle": true, "gameOver": false
//     },
//     { // response: yes
//       "text": "",
//       "effect": { "self": 0, "money": 0, "staff": 0, "customers": 0 },
//       "cardsToAdd": {"": {"top": true, "shuffle": true}},
//       "cardsToRemove": {"": {"top": true, "shuffle": true}},
//       "shuffle": true, "gameOver": false
//     }
//   ]
// }

const isDefined = variable => variable != undefined
const returnDefined = variable => isDefined(variable) ? variable : false

module.exports = [
  'assistants',
  'beginnings',
  'events',
  'lateStories',
  'stories'
].reduce((deckGroupsObj, groupPrefix) => {
  const groupsOfPrefix = require(`./assets/cards/${groupPrefix}.json`)

  // Load all separate JSON files into one big object
  Object.entries(groupsOfPrefix).reduce((group, groupPair) => {
    const newGroupKey = `${groupPrefix}__${groupPair[0]}`

    // Prefix each object with the file name it was in originally
    group[newGroupKey] = groupPair[1].map(card => {
      // Build card or set default
      return {
        category: newGroupKey,
        text: returnDefined(card.text) || '',
        responses: isDefined(card.responses) ?
          card.responses.map(response => {
            return {
              text: returnDefined(response.text),
              shuffle: returnDefined(response.shuffle) || true,
              gameOver: returnDefined(response.gameOver),
              effect: {
                self: returnDefined(response.effect.self) || 0,
                money: returnDefined(response.effect.money) || 0,
                staff: returnDefined(response.effect.staff) || 0,
                customers: returnDefined(response.effect.customers) || 0
              },
              cardsToAdd: isDefined(response.cardsToAdd) ?
                Object.entries(response.cardsToAdd).reduce((newObj, groupObj) => {
                  newObj[groupObj[0]] = {
                    top: returnDefined(groupObj[1].top) || true,
                    shuffle: returnDefined(groupObj[1].shuffle) || true
                  }
                  return newObj
                }, {}) : {},
              cardsToRemove: isDefined(response.cardsToRemove) ?
                response.cardsToRemove : {}
            }
          }) : []
      }
    })

    return group
  }, deckGroupsObj)

  return deckGroupsObj
}, {})
