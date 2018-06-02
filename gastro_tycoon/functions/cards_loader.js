// const templateCard = {
//   "text": "",
//   "responses": [
//     { // response: no
//       "text": "",
//       "effect": { "self": 0, "money": 0, "staff": 0, "customers": 0 },
//       "cardsToAdd": {"": {"top": true, "shuffle": true}},
//       "cardsToRemove": {"": {"top": true, "shuffle": true}},
//       "shuffle": true, "gameOver": false, "resetStats": false
//     },
//     { // response: yes
//       "text": "",
//       "effect": { "self": 0, "money": 0, "staff": 0, "customers": 0 },
//       "cardsToAdd": {"": {"top": true, "shuffle": true}},
//       "cardsToRemove": {"": {"top": true, "shuffle": true}},
//       "shuffle": true, "gameOver": false, "resetStats": false
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
  Object.keys(groupsOfPrefix).reduce((group, oldGroupKey) => {
    const newGroupKey = `${groupPrefix}__${oldGroupKey}`

    // Prefix each object with the file name it was in originally
    group[newGroupKey] = groupsOfPrefix[oldGroupKey].map(card => {
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
              resetStats: returnDefined(response.resetStats),
              effect: returnDefined(response.effect) ?
                {
                  self: returnDefined(response.effect.self) || 0,
                  money: returnDefined(response.effect.money) || 0,
                  staff: returnDefined(response.effect.staff) || 0,
                  customers: returnDefined(response.effect.customers) || 0
                } : {self: 0, money: 0, staff: 0, customers: 0},
              cardsToAdd: isDefined(response.cardsToAdd) ?
                Object.keys(response.cardsToAdd).reduce((newObj, groupKey) => {
                  newObj[groupKey] = {
                    top: returnDefined(response.cardsToAdd[groupKey].top) || true,
                    shuffle: returnDefined(response.cardsToAdd[groupKey].shuffle) || true
                  }
                  return newObj
                }, {}) : {},
              cardsToRemove: isDefined(response.cardsToRemove) ?
                Object.keys(response.cardsToRemove).reduce((newObj, groupKey) => {
                  newObj[groupKey] = {
                    top: returnDefined(response.cardsToRemove[groupKey].top) || true,
                    shuffle: returnDefined(response.cardsToRemove[groupKey].shuffle) || true
                  }
                  return newObj
                }, {}) : {},
            }
          }) : []
      }
    })

    return group
  }, deckGroupsObj)

  return deckGroupsObj
}, {})
