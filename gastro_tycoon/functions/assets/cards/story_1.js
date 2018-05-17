const cards = {
  assistants: [
    {                            
      text: "",                  
      responses: [
        { // Response: 0 (no)    
          text: "",              
          effect: { self: 0, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: true, shuffleDeck: true, gameOver: false
        },
        { // Response: 1 (yes)   
          text: "",              
          effect: { self: 0, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: true, shuffleDeck: true, gameOver: false
        }
      ]
    }
  ]
}

module.exports = cards
