'use strict';
/*
Table of Contents:
  - Require dependencies
  - Data: Cards (events)
  - Data: Speech responses
  - Intent fullfillments
  - Private Methods
  - General Helper Methods
  - Roadmap
*/

/* ** DEPENDENCIES ** */
const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

/* ** SPEECH DATA ** */

/* Placeholder Card
,
{
  text: "",
  responses: [
    { // Response: 0 (no)
      text: "",
      effect: { self: 0, money: 0, staff: 0, customers: 0 },
      cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
    },
    { // Response: 1 (yes)
      text: "",
      effect: { self: 0, money: 0, staff: 0, customers: 0 },
      cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
    }
  ]
}
*/

const CARDS = {
  assistants: [
    {
      text: "Hey! I hear you want to get into the gastro business. Great! I can help you with that. I'm Fred. I know my way around restaurants and can be of lots of help. Should I be your personal assistant?",
      responses: [
        { // Response: 0 (no)
          text: "You're nothing without me!",
          effect: { self: -10, money: 0, staff: -10, customers: -10 },
          cardsToAdd: [/* GAME OVER */], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Great! You won't regret this! I will help you build the best business possible!",
          effect: { self: 10, money: 9, staff: 11, customers: 10 },
          cardsToAdd: ["beginner"], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Hey! I'm Bob. I'm a financial advisor. I hear you want to build a new restaurant. Do you want me to be your advisor?",
      responses: [
        { // Response: 0 (no)
          text: "Very bad decision.",
          effect: { self: -10, money: 0, staff: -10, customers: -10 },
          cardsToAdd: [/* GAME OVER */], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Excellent decision. Together we will build a financially very successful business.",
          effect: { self: 10, money: 12, staff: 8, customers: 10 },
          cardsToAdd: ["beginner"], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Good afternoon. My name is James and I know my way around making people happy. What do you think? Should we go into business together?",
      responses: [
        { // Response: 0 (no)
          text: "Hm. Did not expect that. Well then have a good live.",
          effect: { self: -10, money: 0, staff: -10, customers: -10 },
          cardsToAdd: [/* GAME OVER */], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Wise choice. We will be a great team!",
          effect: { self: 10, money: 8, staff: 10, customers: 12 },
          cardsToAdd: ["beginner"], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Hello there! I'm Willy the astronaut and I hear you are planning to open a restaurant. You know where you could be a real entrepeneur? On the moon! Should we start a restaurant together on the moon?",
      responses: [
        { // Response: 0 (no)
          text: "No adventurer, huh? No problem. I'll leave then.",
          effect: { self: 5, money: 5, staff: 5, customers: 5 },
          cardsToAdd: ["assistants"], cardsToRemove: [], addToTop: true, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Woohoo! This will be an adventure!",
          effect: { self: 10, money: 15, staff: 10, customers: 10 },
          cardsToAdd: ["beginner__willy"], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        }
      ]
    }
  ],
  beginner: [
    {
      text: "Let's see. Where do you want to open your business. You can open it more in the city center or further out. Do you want to open it in the city center?",
      responses: [
        { // Response: 0 (no)
          text: "Alright further out. That does save us some money. But we might not get as many customers. But it's definitely going to help your personal sanity.",
          effect: { self: 1, money: -1, staff: 0, customers: -2 },
          cardsToAdd: ["employees__candidates"], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "City center! A little more expensive and probably more stress. But you are going to have loads of customers! Good choice!",
          effect: { self: -2, money: -2, staff: 0, customers: 2 },
          cardsToAdd: ["employees__candidates"], cardsToRemove: [], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "We should probably decide what kind of hot beverages we want to sell. How about coffee?",
      responses: [
        { // Response: 0 (no)
          text: "Really? Everyone likes coffee. But ok. I think this will make some customers quite unhappy.",
          effect: { self: 1, money: 2, staff: 1, customers: -2 },
          cardsToAdd: ["customers", "customers__country", "random"], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Nobody can say no to coffee!",
          effect: { self: -2, money: -2, staff: 0, customers: 2 },
          cardsToAdd: ["customers", "customers__city", "random"], cardsToRemove: [], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Our first customers! Let's be nice and reduce the price today. What do you think. Should we do it?",
      responses: [
        { // Response: 0 (no)
          text: "Saving some money. Smart. Although now it looks rather empty. Not many customers were convinced to try a new place on the first day without any special deal.",
          effect: { self: 1, money: 0, staff: 1, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Such a success! A lot of people came just for the discount. We lost a little bit of money but gained lots of happy customers.",
          effect: { self: -1, money: -2, staff: 0, customers: 2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Do you want to set up a stone oven to make pizza?",
      responses: [
        { // Response: 0 (no)
          text: "True. There are enough pizza places around anyway.",
          effect: { self: 0, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Pizza, Pizza, Pizza!",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        }
      ]
    }
  ],
  beginner__willy: [           ],
  customers: [
    {
      text: "One of our customers threw up in the middle of the restaurant. I wonder if he is drunk. Should we throw him out just in case?",
      responses: [
        { // Response: 0 (no)
          text: "Always very nice. Well he actually ended up leaving anyway. So nothing happened. Although our staff wasn't so happy about the cleaning.",
          effect: { self: 0, money: 0, staff: -1, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Whoops. Turns out he was seriously sick. Maybe we should have not just thrown him out. Oh well. Our staff had their fun. But our customers might appreciate our decision.",
          effect: { self: -1, money: 0, staff: 0, customers: -2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A group of people asks if they can move some tables around to fit more people. Is that ok?",
      responses: [
        { // Response: 0 (no)
          text: "Keep it structured. Good call. Although, the customers are leaving now and going to the restaurant accross the street.",
          effect: { self: 0, money: 0, staff: 0, customers: -2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Man... kind of stressful for both you and your staff. But they are happy and gave a really good tip!",
          effect: { self: -1, money: 2, staff: -1, customers: 1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A woman calls and wants to make a reservation for 8 people around dinner time. Is that ok?",
      responses: [
        { // Response: 0 (no)
          text: "You're right. You never know if groups that big show up. But we are kind of missing out on customers and money.",
          effect: { self: -1, money: 0, staff: 0, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Phew. They showed up. And they brought lots of money as it seems. Your staff is a little stressed but we are definitely selling a lot of goodies.",
          effect: { self: 0, money: 2, staff: -1, customers: 2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A young woman called to reserve a table for 5 people for lunch. Does that fit into the schedule?",
      responses: [
        { // Response: 0 (no)
          text: "Lunch is usually very busy. Good choice not to allow a reservation. We are making more money by keeping tables empty!",
          effect: { self: -1, money: 2, staff: 0, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Now we kept a table open but they didn't show up. Too bad. Lost customers and money.",
          effect: { self: -1, money: -2, staff: 0, customers: -2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A person dressed in a T-Rex costume walked in and shouts 'ARRRRRR!' Should I throw him out?",
      responses: [
        { // Response: 0 (no)
          text: "Well the other customers felt kind of uncomfortable and started leaving after the T-Rex didn't stop shouting.",
          effect: { self: 0, money: -1, staff: 0, customers: -2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "I had to chace the T-Rex around but finally got him. Now he is gone. Our customers were amused by the excitement.",
          effect: { self: 0, money: 0, staff: 0, customers: 1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    }
  ],
  customers__country: [
    {
      text: "Oh look! A couple hitchhikers. One of them asks if they can refill their water bottles. Should we allow it?",
      responses: [
        { // Response: 0 (no)
          text: "Oh no. One of them decided to pee at our wall outside to get back at us. Not so nice.",
          effect: { self: 0, money: 1, staff: -1, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "They have surprisingly many bottles in their backpacks. Oh well. They are happy though and buy something to eat as well.",
          effect: { self: 2, money: 2, staff: 1, customers: 2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "It's farmer market out there! Lot's of potential customers. Should we advertize our business on the market?",
      responses: [
        { // Response: 0 (no)
          text: "Not many people seem to notice our place. Too bad. Could have been good business.",
          effect: { self: -1, money: 0, staff: 0, customers: 1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Oh oh. Bad idea. The manager of the market threw us out. They would have wanted us to talk to them first. At least we got some customers, though.",
          effect: { self: -1, money: -1, staff: -1, customers: 2},
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    }
  ],
  customers__city: [
    {
      text: "A customer asks if we can adjust one of our meals to be completley vegan. Should we do it?",
      responses: [
        { // Response: 0 (no)
          text: "No customizations! Good policy. Although she really doesn't seem so happy about it.",
          effect: { self: 1, money: 0, staff: 0, customers: -2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Your chef complains and mumbles something about hipsters. I didn't really catch it but it didn't seem nice. The customer is happy, though.",
          effect: { self: 0, money: -1, staff: -1, customers: 2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A woman calls and wants to make a reservation for 7 people around dinner time. Is that ok?",
      responses: [
        { // Response: 0 (no)
          text: "Who knows if they would have shown up. But we are kind of missing out on customers and money.",
          effect: { self: -1, money: 0, staff: 0, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Hm. Looks like they never showed up. That's ashame.",
          effect: { self: -2, money: -1, staff: 0, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    }
  ],
  employees: [
    {
      text: "One of your employees accidentally lid himself on fire. Should we call the fire fighters?",
      responses: [
        { // Response: 0 (no)
          text: "Oh there he goes. He died a horrible death. Fortunately, nobody liked him anyway. However, the whole fire cost you a lot of money and personal stress.",
          effect: { self: -2, money: -3, staff: 1, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "How was this even possible? The fires are taken care of. Your employee is probably not gonna come back to work anytime soon, though. On the way out he scared a lot of customers.",
          effect: { self: 1, money: -1, staff: -1, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "Some money is missing from the register. You suspect one of your emplyees took some. Do you want to involve the police?",
      responses: [
        { // Response: 0 (no)
          text: "Let's handle this on our own. I locked all our employees in a room and told them I don't let them out until they tell me who it was... Too harsh? Oh well. I'll let them out then. They don't seem happy.",
          effect: { self: -1, money: -2, staff: -3, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "",
          effect: { self: 1, money: -2, staff: -1, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Our employees ask for more money. Should we give in?",
      responses: [
        { // Response: 0 (no)
          text: "Watching our resources. Good call. Although our employees just got pretty angry.",
          effect: { self: -1, money: 0, staff: -2, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "More money for everyone! Very generouse. Everyone is very happy.",
          effect: { self: 0, money: -2, staff: 2, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "Birthday party! One of your employees is celebrating a birthday party in the kitchen. Are you going to join the party?",
      responses: [
        { // Response: 0 (no)
          text: "Too much to do. I understand. This is not particularly good for your staff happiness.",
          effect: { self: 1, money: 0, staff: -1, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Party time! You had a little bit too much alcohol. Your customers are completely forgotten. But your team has the best time they ever had!",
          effect: { self: 2, money: 0, staff: 2, customers: -2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    }
  ],
  employees__candidates: [
    {
      text: "Here is a teenager who wants to work for you. Should we hire him? You still could need some staff.",
      responses: [
        { // Response: 0 (no)
          text: "Alright. Hopefully someone else comes along.",
          effect: { self: 0, money: -1, staff: -2, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Well. At least someone. He doesn't seem to be so expensive. So it's probably not a big deal if he messes up.",
          effect: { self: 2, money: -2, staff: 2, customers: 1 },
          cardsToAdd: ["employees"], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "An older lady claims she can make better coffee than we do. She says she would do it for 5 bucks an hour. Should we get her on board?",
      responses: [
        { // Response: 0 (no)
          text: "Yeah who knows if she really knows how to even make coffee. However, somebody overheard the conversation and now our customers think we discriminate because of age.",
          effect: { self: -1, money: 0, staff: 1, customers: -4 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Who de thunk. She is right. Her coffee is awesome. The customers love her. She doesn't even cost a lot of money.",
          effect: { self: 2, money: -1, staff: 1, customers: 3 },
          cardsToAdd: ["employees"], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A girl with green hair applied to a job with us. She might have given us more information about herself. But the green hair is really all I remembered. Should we hire her? ",
      responses: [
        { // Response: 0 (no)
          text: "Really? I would have thought she'd be a great addition to the team.",
          effect: { self: 0, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Good choice. I don't think she would let us down.",
          effect: { self: 1, money: -1, staff: 1, customers: -1 },
          cardsToAdd: ["employees__crazy"], cardsToRemove: [], addToTop: false, shuffleDeck: false
        }
      ]
    }
  ],
  employees__crazy: [
    {
      text: "I wonder if we made a mistake in our hiring decisions. One of our people painted all our tables green. Should we leave it?",
      responses: [
        { // Response: 0 (no)
          text: "Alright. Let's paint over it. Man, this will be expensive and the particular employee should be punished.",
          effect: { self: 2, money: -2, staff: -2, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "I like green too. Seems like it fits very well with our whole place.",
          effect: { self: 0, money: 0, staff: 2, customers: -1 },
          cardsToAdd: ["employees__crazy"], cardsToRemove: [], addToTop: false, shuffleDeck: false
        }
      ]
    }
  ],
  mafia__notpayed: [
    {
      text: "A black van drove by our restaurant a couple times. What do you think? Should we be worried?",
      responses: [
        { // Response: 0 (no)
          text: "Probably right...",
          effect: { self: 1, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Mhm.",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "I noticed now the third time: Sometimes there is a strange man in a suit sitting in the back watching our employees. Doesn't that make you feel weird, too?",
      responses: [
        { // Response: 0 (no)
          text: "I don't know how you do it. I feel very uncomfortable.",
          effect: { self: -1, money: 0, staff: -1, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Maybe we should rethink whether to pay the people from before some protection money. Our customers are not particularly happy and you also seem quite stressed.",
          effect: { self: -2, money: 0, staff: -1, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "When I arrived this morning, our entire interior was destroyed! Someone must have demolished everything over night! Do you think this might be related to the people who wanted protection money?",
      responses: [
        { // Response: 0 (no)
          text: "Not sure if you're right. We all still feel weird. But more importantly: The rebuilding of your restaurant will cost us quite some money.",
          effect: { self: -1, money: -3, staff: -1, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Oh oh. Maybe they give us another chance... For now we have to think about rebuilding our restaurant. And maybe come up with some ways to calm our staff down.",
          effect: { self: -1, money: -3, staff: -2, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    }
  ],
  mafia__payed: [
    {
      text: "A robbery! Oh no! What should we do?! They say they want access to our safe. Do we give them access?",
      responses: [
        { // Response: 0 (no)
          text: "We are all gonna die... Oh no. What's that? A black van showed up, a couple men in suits came out and started shooting at the robbers! Man. Our whole restaurant is destroyed but atleast we're alive.",
          effect: { self: 4, money: -4, staff: 2, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "They took all our money. But what's that? On the way out they got stopped by a black van. Looks like the people we gave money to before attacked the robbers and took all the money from them.",
          effect: { self: -1, money: -5, staff: -2, customers: -1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    }
  ],
  random: [
    {
      text: "A customer would like to tell you a story. Are you curious to hear it?",
      responses: [
	{ // Response: 0 (no)
	  text: "She almost starts to cry and leaves.",
	  effect: { self: 0, money: 1, staff: 0, customers: -1 },
	  cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
	},
	{ // Response: 1 (yes)
	  text: "She starts talking: Three days ago I walked through the park until suddenly I saw a big fat cat. I mean... it was really fat. It was lying on its back trying to get back on its feet but it simply not work. It couldn't get back up. Crazy right?",
	  effect: { self: -1, money: 0, staff: 0, customers: 2 },
	  cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
	}
      ]
    },
    {
      text: "There is a stranger in a good looking suit outside. He wants some money and offers protection in return. Should we give him the money?",
      responses: [
        { // Response: 0 (no)
          text: "Strange man. I think it's for the better we didn't pay him.",
          effect: { self: 0, money: 0, staff: 0, customers: -1 },
          cardsToAdd: ["mafia__notpayed"], cardsToRemove: ["mafia__payed"], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Probably for the best. Let's not make enemies so early on.",
          effect: { self: -1, money: -2, staff: 0, customers: +1 },
          cardsToAdd: ["mafia__payed"], cardsToRemove: ["mafia__notpayed"], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A stranger in a grey suit is here. He asks for money and offers protection. Should we trust him?",
      responses: [
        { // Response: 0 (no)
          text: "Oh oh. I hope he doesn't have powerful bosses.",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Yea. He looked strong. I'm sure we can use his strength. Although he might have also just been a con man who never shows up again.",
          effect: { self: 0, money: -5, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A good looking sales person showed up offering us a good deal on Shnud Light the popular beer. Do you want to take it?",
      responses: [
        { // Response: 0 (no)
          text: "Ok.",
          effect: { self: 0, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "I bet we get some new customers from that.",
          effect: { self: 0, money: -2, staff: 0, customers: 2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "It's been a good day. We had lots of customers. Isn't that fabulous?",
      responses: [
        { // Response: 0 (no)
          text: "Still not good enough? I guess we have to work harder.",
          effect: { self: 0, money: 3, staff: -1, customers: 2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Yeah!",
          effect: { self: 0, money: 3, staff: 1, customers: 2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A stray cat jumped through the kitchen window and ate half of our stuff! I caught it. Should we punish it?",
      responses: [
        { // Response: 0 (no)
          text: "I guess it wouldn't change anything anyway.",
          effect: { self: 2, money: -1, staff: 0, customers: 1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Yes! Let's teach it a lesson. I'll get a razer and shave her furr off! That'll be fun.",
          effect: { self: 0, money: -1, staff: 2, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "The water from our faucet has some sort of brown coloring. Should we be worried?",
      responses: [
        { // Response: 0 (no)
          text: "You're right. Let's serve it to the customers anyway. They might not be so happy but who cares.",
          effect: { self: 0, money: 0, staff: 0, customers: -2 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "I'll call someone to fix this. It'll cost us some money but it's probably for the best.",
          effect: { self: 0, money: -1, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "A customer just dropped a 50 dollar bill. I will give it back ok?",
      responses: [
        { // Response: 0 (no)
          text: "Every penny counts these days. Not sure how you live with your conscience.",
          effect: { self: -2, money: 2, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Certainly the right thing to do.",
          effect: { self: 1, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "The business has been running for a little while now. Do you want to go on vacation?",
      responses: [
        { // Response: 0 (no)
          text: "I see. Still so much to do I guess.",
          effect: { self: -2, money: 1, staff: 1, customers: 1 },
          cardsToAdd: [], cardsToRemove: [], addToTop: false, shuffleDeck: true
        },
        { // Response: 1 (yes)
          text: "Good call! See you back in a few days!",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], cardsToRemove: [], addToTop: true, shuffleDeck: false
        }
      ]
    }
  ],
  vacation: [
    {
      text: "Seems like you're enjoying yourself with some cocktails in the warm sun of the carrebean. Do you want to go back yet?",
      responses: [
        { // Response: 0 (no)
          text: "Yea let's get you some more of those cocktails.",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], cardsToRemove: [], addToTop: true, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Duty calls!",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: ["vacation"], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "Another wonderful day on the beach. Maybe you want to think about coming home. What do you think?",
      responses: [
        { // Response: 0 (no)
          text: "Can't get enough of that beach?",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], cardsToRemove: [], addToTop: true, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Alright. Next stop: Home. Welcome back!",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: ["vacation"], addToTop: false, shuffleDeck: true
        }
      ]
    },
    {
      text: "You seem very well rested out here in the sun. Is it time to go back to work yet?",
      responses: [
        { // Response: 0 (no)
          text: "Who am I kidding. Of course not!",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], cardsToRemove: [], addToTop: true, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Time to become reasonable.",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToAdd: [], cardsToRemove: ["vacation"], addToTop: false, shuffleDeck: true
        }
      ]
    }
  ]
};

const SAY = {
  default: {
    welcome: "Welcome to Gastro Tycoon. Ask me for 'instructions' if you don't know how to play. To dive in immediately just say 'start'.",
    startOptions: ["Let's go!", "Starting up!", "Alright!"],
    startOverConfirmation: "Are you sure you want to restart the game? This will reset your entire progress.",
    resumeConfirmation: "Alright. Where were we?",
    statusWarnings: {
      low: {
        self: [
          "Things are getting stressful.",
          "You really don't look healthy. You should do something about that.",
          "You should step a little shorter. You look horrible.",
          "You should do something about your health.",
          "Did you get enough sleep? You look very tired.",
          "You can't keep going like that. Look after yourself!",
          "Make sure to watch your own health!"
        ],
        money: [
          "Your finances are starting to concern me.",
          "Keep an eye on your money. It's starting to run low.",
          "If things keep going like this you might not be able to pay salaries soon.",
          "You really gotta watch your bank account. It doesn't look good.",
          "Be careful. Money doesn't last forever."
        ],
        staff: [
          "Your staff starts being slightly unhappy.",
          "I hear increasingly complaints from your staff.",
          "Your staff situation is not optimal.",
          "You gotta improve your employee situation."
        ],
        customers: [
          "I haven't seen many customers lately.",
          "Your restaurant ratings are going down.",
          "I hear quite a few complaints from customers.",
          "Keep your customers in mind as you make your next decisions. They've benn unhappy."
        ]
      },
      high: {
        self: [],
        money: [],
        staff: [],
        customers: []
      }
    },
    gameOver: {
      self: "You're burned out and eat everything in your restaurant.",
      self__high: "You finally discovered what it means to have inner peace. You close your restaurant and disappear... Forever.",
      money: "You're broke. The banks shut down your restaurant.",
      staff: "All your staff leaves you for Lui's restaurant around the corner. You're done.",
      customers: "Nobody likes your restaurant. Without any customers it doesn't make any sense to keep this place open.",
      cardsOut: "Congratulations! Your restaurant was voted best of the city! There is no higher honor than that. You are free to retire now.",
      notEvenStarted: "Wow. You failed before you even started. Well that's unfortunate."
    },
    gameOver__message: "Tell me to start over if you want to give it another try with a new restaurant. Or say 'stop' to close the game.",
    gameOver__score: (score) => `Congratulations! Your business survived ${score} days!`,
    instructions: {
      text: "In this game your assistant will ask you questions. The only thing you'll ever have to do is answer with either yes or no. Each decision you make influences either your money, customer satisfaction, staff happiness and personal stress level. Make sure that the decisions you make keep those four values balanced. If any of those values gets too little, you loose. But be careful. Being too good in any of them might also cause unwanted effects. Your goal is to keep your business alive as long as possible.",
      outroBeforeGame: "If you want to start a game, just say 'start'.",
      outroInGame: "Let's resume the game..."
    },
    fallback: {
      inGame: [
        "I didn't catch that. Can you please answer with either yes or no? Or ask for help.",
        "Please respond with yes or no."
      ],
      beforeGame: [
        "I'm sorry I didn't get that. You can ask me to start a game or ask for the game's instructions.",
        "My apologies. I didn't understand. What do you want to do? Start a game or hear the instructions?"
      ]
    },
    cheatResponse: {
      robinhood: "Let it rain gold!",
      godmode: "You can't lose anymore!",
      pirate: "Let's go on vacation."
    }
  }
};

const controller = app => {
  // doc: Get user locale:
  // const userLocale = app.getUserLocale();
  // const locale = Object.keys(SAY).includes(userLocale.split('-')[0]) ? userLocale.split('-')[0] : 'default';
  const locale = 'default'; // REMOVE this line if you uncomment the two above.
  const say = (key) => SAY[locale][key];

  /* ** PRIVATE METHODS ** */

  function initializeGame(){
    app.data.gameState = {
      stats: {
        self: 0,
        money: 0,
        staff: 0,
        customers: 0
      },
      progress: 0,
      deck: []
    };
    addCardsToTop("assistants");
  }

  function gameNotStarted(){
    return !app.data.gameState ||
           (app.data.gameState && (
             app.data.gameState.progress <= 0 ||
             app.data.gameState.deck.length <= 0
           ));
  }

  function buildResponse(response, newText, displayText = false){
    var firstResponse = `${response} ${giveStatusUpdateIfRequired()}`;
    app.ask(
      app.buildRichResponse()
        .addSimpleResponse({
          speech: `${firstResponse}`,
          displayText: `${displayText ? displayText : firstResponse}${app.data.gameState.progress > 0 ? ' Days in business: ' + app.data.gameState.progress : ''}`
        })
        .addSimpleResponse({
          speech: newText,
          displayText: newText
        })
        .addSuggestions(["Yes", "No"])
    );
  }

  function addCardsToTop(category = "random"){
    app.data.gameState.deck.unshift(
      ..._shuffleArray(addCategoryToCards(CARDS[category], category))
    );
  }

  function addCardsToBottom(category = "random"){
    app.data.gameState.deck.push(
      ..._shuffleArray(addCategoryToCards(CARDS[category], category))
    );
  }

  function addCategoryToCards(cards, category = "random"){
    return cards.map(card => {
      card.category = category;
      return card;
    });
  }

  function removeCardsOfCategory(category){
    var cardsWithoutCategory = app.data.gameState.deck.filter(card => card.category != category);
    app.data.gameState.deck = cardsWithoutCategory;
  }

  function giveStatusUpdateIfRequired(){
    var tooLowStatKeys = Object.keys(app.data.gameState.stats).filter(statKey => app.data.gameState.stats[statKey] < 5);
    // var tooHighStatKeys = Object.keys(app.data.gameState.stats).filter(statKey => app.data.gameState.stats[statKey] > 15);

    return (app.data.gameState.progress > 0) && (tooLowStatKeys.length > 0) ? _randomOfArray(say('statusWarnings').low[tooLowStatKeys[0]]) : '';
  }

  function updateGameStateStats(usersChoiceResponse){
    Object.keys(usersChoiceResponse.effect).forEach(statusKey => {
      var statusValue = usersChoiceResponse.effect[statusKey];
      if(usersChoiceResponse.reset){
        app.data.gameState.stats[statusKey] = statusValue;
      }else{
        app.data.gameState.stats[statusKey] += statusValue;
      }
    });
  }

  function anyGameOverCriteriaMet(){
    return (app.data.gameState.deck.length <= 0) || Object.keys(app.data.gameState.stats).map(key => app.data.gameState.stats[key]).some(status => status < 0);
  }

  function gameOverCriteria(){
    var tooLowStatKeys = Object.keys(app.data.gameState.stats).filter(statKey => app.data.gameState.stats[statKey] < 0);
    // var tooHighStatKeys = Object.keys(app.data.gameState.stats).filter(statKey => app.data.gameState.stats[statKey] > 15);

    if((app.data.gameState.deck.length <= 0) && (app.data.gameState.progress <= 1)){
      return 'notEvenStarted';
    }else if(app.data.gameState.stats.self > 15 && !app.data.gameState.godmode){
      return 'self__high';
    }else if(tooLowStatKeys.length > 0 && !app.data.gameState.godmode){
      return tooLowStatKeys[0];
    }else if(app.data.gameState.deck.length <= 0){
      return 'cardsOut';
    }else{
      return false;
    }
  }

  function gameOver(){
    return app.ask(
      app.buildRichResponse()
        .addSimpleResponse(`${say('gameOver')[gameOverCriteria()]} ${say('gameOver__score')(app.data.gameState.progress)}`)
        .addSimpleResponse(say('gameOver__message'))
        .addSuggestions(["Start over!", "Stop."])
    );
  }

  /* ** INTENTS & HANDLERS ** */
  return {
    welcomeIntent(){
      app.ask(
        app.buildRichResponse()
          .addSimpleResponse(say('welcome'))
          .addSuggestions(["Start the game!", "How do I play?"])
      );
    },

    helpIntent(){
      if(gameNotStarted()){
        app.ask(
          app.buildRichResponse()
            .addSimpleResponse(`${say('instructions').text} ${say('instructions').outroBeforeGame}`)
            .addSuggestions(["Start the game!", "How do I play?"])
        );
      }else{
        app.ask(
          app.buildRichResponse()
            .addSimpleResponse(say('instructions').text)
            .addSimpleResponse(`${say('instructions').outroInGame} ${app.data.gameState.deck[0].text}`)
            .addSuggestions(["Yes", "No"])
        );
      }
    },

    fallbackIntent(){
      var response, suggestions;

      if(gameNotStarted()){
        response = _randomOfArray(say('fallback').beforeGame);
        suggestions = ["Start the game!", "How do I play?"];
      }else{
        response = _randomOfArray(say('fallback').inGame);
        suggestions = ["Yes", "No"];
      }

      app.ask(
        app.buildRichResponse()
          .addSimpleResponse(response)
          .addSuggestions(suggestions)
      );
    },

    startNewGameIntent(){
      if(gameNotStarted() || anyGameOverCriteriaMet()){
        initializeGame();
        buildResponse(_randomOfArray(say('startOptions')), app.data.gameState.deck[0].text);
      }else{
        app.askForConfirmation(say('startOverConfirmation'));
      }
    },

    restartGameHandler(){ // Only handled if a game is currently active.
      if(app.getUserConfirmation()) initializeGame();
      buildResponse(_randomOfArray(say('resumeConfirmation')), app.data.gameState.deck[0].text);
    },

    responseIntent(){
      var topCard = app.data.gameState.deck.shift(); // remove and return top card;
      var usersChoiceResponse = topCard.responses[(app.getArgument('YesOrNo') == 'yes' ? 1 : 0)]; // if answer yes: get responses index 1.

      // Update progress
      app.data.gameState.progress++;
      // Update gameState status
      updateGameStateStats(usersChoiceResponse);
      // Remove cards from the deck
      usersChoiceResponse.cardsToRemove.forEach(category => removeCardsOfCategory(category));
      // Add new cards to the deck
      usersChoiceResponse.cardsToAdd.forEach(category => {
        return usersChoiceResponse.addToTop ? addCardsToTop(category) : addCardsToBottom(category);
      });
      // Stop the game if any game-over criteria is true.
      if(anyGameOverCriteriaMet()) return gameOver();
      // Shuffle deck if response requires it
      app.data.gameState.deck = usersChoiceResponse.shuffleDeck ? _shuffleArray(app.data.gameState.deck) : app.data.gameState.deck;

      buildResponse(
        usersChoiceResponse.text,
        app.data.gameState.deck[0].text
      );
    },

    cheatIntent(){
      var cheat = app.getArgument('cheatCode');

      if(cheat == 'robinhood'){
        app.data.gameState.stats.money += 10;
      }else if(cheat == 'godmode'){
        app.data.godmode = true;
      }else if(cheat == 'pirate'){
        addCardsToTop("vacation");
      }

      buildResponse(
        `<speak>
          <audio src="https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg"></audio>
          ${say('cheatResponse')[cheat]}
        </speak>`,
        app.data.gameState.deck[0].text,
        say('cheatResponse')[cheat]
      );
    }
  };
};

/* ** GENERAL HELPER METHODS ** */
const _randomIndexOfArray = array => Math.floor(Math.random() * array.length);
const _randomOfArray = array => array[_randomIndexOfArray(array)];
const _shuffleArray = array => array.sort(() => Math.random() - 0.5);

/* ** EXECUTE DIALOGFLOW APP ** */
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, res) => {
  // doc: Log everything for debugging:
  // console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));
  // doc: Initialize the Dialogflow app: (Dialogflow handles listening and parsing of requests)
  const dialogFlowApp = new DialogflowApp({request: req, response: res});
  // doc: Initialize the controller which returns an object with all the intents and handlers:
  const appController = controller(dialogFlowApp);
  // doc: Create a map from all the controller intents/handlers:
  const actionMap = new Map(Object.keys(appController).map(k => [k, appController[k]]));
  // doc: Pass intents and handlers back to dialogFlow:
  dialogFlowApp.handleRequest(actionMap);
});

/* Roadmap:

  Definitely before launch:
    - add different beginnings for each assistant
    - >100 add more cards!
    - >10 endings

  Maybe before launch:
  - add high stats warning.
  - More and more complex game over criteria and messages
    - high stats
    - specific combinations
    - certain values (-10 self is a different message than -1)
    - specific to cards or categories (e.g. killed by mafia)

  Post launch:
  - Add even more cards
  - Allow more input types (maybe numbers?)
  - add more chain-events
  - add events with custom gameOver event

*/
