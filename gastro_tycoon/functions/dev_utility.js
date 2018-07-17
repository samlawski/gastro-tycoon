const cards = require('./cards_loader.js')
const helper = require('./helper.js')

module.exports = (() => {

  const addStats = (stats1, stats2) => {
    return Object.keys(stats1).reduce((totalStats, statsKey) => {
      totalStats[statsKey] = stats1[statsKey] + stats2[statsKey]
      return totalStats
    }, {})
  }
  const sumStats = arr => arr.reduce((totalStats, currentStats) => {
    return addStats(currentStats, totalStats)
  }, {self: 0, money: 0, staff: 0, customers: 0})

  const cardStats_no = card => card.responses[0].effect
  const cardStats_yes = card => card.responses[1].effect
  const cardStats_total = card => addStats(cardStats_no(card), cardStats_yes(card))

  // Command line Execution:
  const categoryStats = Object.entries(cards).map(categoryPair => {
    const categoryKey   = categoryPair[0]
    const categoryCards = categoryPair[1]

    const statsTotal  = categoryCards.map(card => cardStats_total(card))
    const statsYes    = categoryCards.map(card => cardStats_yes(card))
    const statsNo     = categoryCards.map(card => cardStats_no(card))


    console.log(categoryKey)
    console.log('Total Stats: ', sumStats(statsTotal))
    console.log('Yes Stats: ', sumStats(statsYes))
    console.log('No Stats: ', sumStats(statsNo))
    console.log('')
  })

  return {
    addStats,
    sumStats,
    cardStats_no,
    cardStats_yes,
    cardStats_total
  }
})()
