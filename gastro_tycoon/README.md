# Gastro Tycoon

... is a game for the Google Assistant. The player is the owner of a new restaurant business and the goal is to stay in business for as long as possible. Throughout the game the user is presented with different choices which all will impact the business in one way or the other.

## How to deploy

Deploy functions: `firebase deploy --only functions`
Deploy privacy landing page: `firebase deploy --only hosting`

## Roadmap:

### v1
  - add different beginnings for each assistant
  - >100 add more cards!
  - >10 endings

### v2
- When game over, show
  - list of achievements you accomplished,
  - lists of gameOver variations you discovered
  - number of cards (out of # of total cards) discovered
  - maybe: list of categories discovered
- Add even more cards
- add high stats warning.
- More story events
  - rival businesses. Sabotaging etc.
- More and more complex game over criteria and messages
  - high stats
  - specific combinations
  - certain values (-10 self is a different message than -1)
  - specific to cards or categories (e.g. killed by mafia)

### v3
- Add even more cards
- Add complex story development and achievements
  - Add/Remove cards based on days in business
  - Allow career progression:
    - Start with a small business
    - after 30 days, it becomes a larger business
    - after 60 days, open a new branch and start running a chain
    - based on mafia story: become the mobster head
- Add more `user.storage` use cases:
  - store special unlocked cards
  - introduce an achievement system and store user's achievements
  - build new deck based on what the user already unlocked/achieved
  - permanently unlock cards as you proceed through the gameOver
  - permanently discard cards to avoid too much repetition?

### v4
- Add even more cards
- Allow more input types (maybe numbers?)
- add more chain-events
- add events with custom gameOver event
