const cards = require('./cards_loader.js')
const helper = require('./helper.js')

const categoryStats = Object.entries(cards).forEach(categoryPair => {
  let categoryStatsObj = {self: 0, money: 0, customers: 0, staff: 0}

  categoryPair[1].forEach(card => {
    card.responses.forEach(response => {
      categoryStatsObj.self += response.effect.self
      categoryStatsObj.money += response.effect.money
      categoryStatsObj.customers += response.effect.customers
      categoryStatsObj.staff += response.effect.staff
    })
  })

  console.log(categoryPair[0])
  console.log(categoryStatsObj)
  console.log('')
})
