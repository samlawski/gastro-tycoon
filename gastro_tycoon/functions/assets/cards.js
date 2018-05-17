/*
  Legend:
    - `addToTop: true, shuffleDeck: true`
      Default. Just put the cards on top of the deck and reshuffle everything
    - `addToTop: true, shuffleDeck: false`
      Put cards on top and make sure the next one drawn is definitely from the added cards
    - `addToTop: false, shuffleDeck: false`
      Add cards at the bottom and don't shuffle yet. Makes the new cards don't appear in the next turn already
*/

/* Placeholder Card
,
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

{
  text: "",
  responses: [
    { // Response: 0 (no)
      text: "",
      effect: { self: 0, money: 0, staff: 0, customers: 0 }
    },
    { // Response: 1 (yes)
      text: "",
      effect: { self: 0, money: 0, staff: 0, customers: 0 }
    }
  ]
}
*/

const cards = {
  assistants: [
    {
      text: "Hey! I hear you want to get into the gastro business. Great! I can help you with that. I'm Fred. I know my way around restaurants and can be of lots of help. Should I be your personal assistant?",
      responses: [
        { // Response: 0 (no)
          text: "You're nothing without me!",
          effect: { self: -10, money: 0, staff: -10, customers: -10 },
          cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
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
          cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
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
          cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Wise choice. We will be a great team!",
          effect: { self: 10, money: 8, staff: 10, customers: 12 },
          cardsToAdd: ["beginner"], cardsToRemove: ["assistants"], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Hello there! I'm Willy the astronaut and I hear you are planning to open a restaurant. You know where you could be a real entrepreneur? On the moon! Should we start a restaurant together on the moon?",
      responses: [
        { // Response: 0 (no)
          text: "No adventurer, huh? No problem. I'll leave then.",
          effect: { self: 5, money: 5, staff: 5, customers: 5 },
          cardsToAdd: ["assistants"], shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Woohoo! This will be an adventure!",
          effect: { self: 10, money: 15, staff: 10, customers: 10 },
          cardsToAdd: ["space_cafe__1"], cardsToRemove: ["assistants"], shuffleDeck: false
        }
      ]
    }
  ],
  beginner: [
    {
      text: "Let's see. Where do you want to open your business? You can open it more in the city center or further out. Do you want to open it in the city center?",
      responses: [
        { // Response: 0 (no)
          text: "Alright further out. That does save us some money. But we might not get as many customers. But it's definitely going to help your personal sanity.",
          effect: { self: 1, money: -1, staff: 0, customers: -2 },
          cardsToAdd: ["employees__candidates"], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "City center! A little more expensive and probably more stress. But you are going to have loads of customers! Good choice!",
          effect: { self: -2, money: -2, staff: 0, customers: 2 },
          cardsToAdd: ["employees__candidates"], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "We should probably decide what kind of hot beverages we want to sell. How about coffee?",
      responses: [
        { // Response: 0 (no)
          text: "Really? Everyone likes coffee. But ok. I think this will make some customers quite unhappy.",
          effect: { self: 1, money: 2, staff: 1, customers: -2 },
          cardsToAdd: ["customers", "customers__country", "random"], addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Nobody can say no to coffee!",
          effect: { self: -2, money: -2, staff: 0, customers: 2 },
          cardsToAdd: ["customers", "customers__city", "random__city", "random"], addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Our first customers! Let's be nice and reduce the price today. What do you think? Should we do it?",
      responses: [
        { // Response: 0 (no)
          text: "Saving some money. Smart. Although now it looks rather empty. Not many customers were convinced to try a new place on the first day without any special deal.",
          effect: { self: 1, money: 0, staff: 1, customers: -1 },
          addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Such a success! A lot of people came just for the discount. We lost a little bit of money but gained lots of happy customers.",
          effect: { self: -1, money: -2, staff: 0, customers: 2 },
          addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Do you want to set up a stone oven to make pizza?",
      responses: [
        { // Response: 0 (no)
          text: "True. There are enough pizza places around anyway.",
          effect: { self: 0, money: 0, staff: 0, customers: 0 },
          addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Pizza, Pizza, Pizza!",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          addToTop: false, shuffleDeck: false
        }
      ]
    }
  ],
  customers: [
    {
      text: "One of our customers threw up in the middle of the restaurant. I wonder if he is drunk. Should we throw him out just in case?",
      responses: [
        { // Response: 0 (no)
          text: "Always very nice. Well he actually ended up leaving anyway. So nothing happened. Although our staff wasn't so happy about the cleaning.",
          effect: { self: 0, money: 0, staff: -1, customers: -1 }
        },
        { // Response: 1 (yes)
          text: "Whoops. Turns out he was seriously sick. Maybe we should have not just thrown him out. Oh well. Our staff had their fun. But our customers might appreciate our decision.",
          effect: { self: -1, money: 0, staff: 0, customers: -2 }
        }
      ]
    },
    {
      text: "A group of people asks if they can move some tables around to fit more people. Is that ok?",
      responses: [
        { // Response: 0 (no)
          text: "Keep it structured. Good call. Although, the customers are leaving now and going to the restaurant accross the street.",
          effect: { self: 0, money: 0, staff: 0, customers: -2 }
        },
        { // Response: 1 (yes)
          text: "Man... kind of stressful for both you and your staff. But they are happy and gave a really good tip!",
          effect: { self: -1, money: 2, staff: -1, customers: 1 }
        }
      ]
    },
    {
      text: "A woman calls and wants to make a reservation for 8 people around dinner time. Is that ok?",
      responses: [
        { // Response: 0 (no)
          text: "You're right. You never know if groups that big show up. But we are kind of missing out on customers and money.",
          effect: { self: -1, money: 0, staff: 0, customers: -1 }
        },
        { // Response: 1 (yes)
          text: "Phew. They showed up. And they brought lots of money as it seems. Your staff is a little stressed but we are definitely selling a lot of goodies.",
          effect: { self: 0, money: 2, staff: -1, customers: 2 }
        }
      ]
    },
    {
      text: "A young woman called to reserve a table for 5 people for lunch. Does that fit into the schedule?",
      responses: [
        { // Response: 0 (no)
          text: "Lunch is usually very busy. Good choice not to allow a reservation. We are making more money by keeping tables empty!",
          effect: { self: -1, money: 2, staff: 0, customers: -1 }
        },
        { // Response: 1 (yes)
          text: "Now we kept a table open but they didn't show up. Too bad. Lost customers and money.",
          effect: { self: -1, money: -2, staff: 0, customers: -2 }
        }
      ]
    },
    {
      text: "A person dressed in a T-Rex costume walked in and shouts 'ARRRRRR!' Should I throw him out?",
      responses: [
        { // Response: 0 (no)
          text: "Well the other customers felt kind of uncomfortable and started leaving after the T-Rex didn't stop shouting.",
          effect: { self: 0, money: -1, staff: 0, customers: -2 }
        },
        { // Response: 1 (yes)
          text: "I had to chace the T-Rex around but finally got him. Now he is gone. Our customers were amused by the excitement.",
          effect: { self: 0, money: 0, staff: 0, customers: 1 }
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
          addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "They have surprisingly many bottles in their backpacks. Oh well. They are happy though and buy something to eat as well.",
          effect: { self: 2, money: 2, staff: 1, customers: 2 }
        }
      ]
    },
    {
      text: "It's farmer's market out there! Lot's of potential customers. Should we advertise our business on the market?",
      responses: [
        { // Response: 0 (no)
          text: "Not many people seem to notice our place. Too bad. Could have been good business.",
          effect: { self: -1, money: 0, staff: 0, customers: 1 }
        },
        { // Response: 1 (yes)
          text: "Oh oh. Bad idea. The manager of the market threw us out. They would have wanted us to talk to them first. At least we got some customers, though.",
          effect: { self: -1, money: -1, staff: -1, customers: 2}
        }
      ]
    }
  ],
  customers__city: [
    {
      text: "A customer asks if we can adjust one of our meals to be completely vegan. Should we do it?",
      responses: [
        { // Response: 0 (no)
          text: "No customizations! Good policy. Although she really doesn't seem so happy about it.",
          effect: { self: 1, money: 0, staff: 0, customers: -2 },
          addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Your chef complains and mumbles something about hipsters. I didn't really catch it but it didn't seem nice. The customer is happy, though.",
          effect: { self: 0, money: -1, staff: -1, customers: 2 }
        }
      ]
    },
    {
      text: "A woman calls and wants to make a reservation for 7 people around dinner time. Is that ok?",
      responses: [
        { // Response: 0 (no)
          text: "Who knows if they would have shown up. But we are kind of missing out on customers and money.",
          effect: { self: -1, money: 0, staff: 0, customers: -1 }
        },
        { // Response: 1 (yes)
          text: "Hm. Looks like they never showed up. That's ashame.",
          effect: { self: -2, money: -1, staff: 0, customers: -1 }
        }
      ]
    }
  ],
  employees: [
    {
      text: "One of your employees accidentally lid himself on fire. Should we call the firefighters?",
      responses: [
        { // Response: 0 (no)
          text: "Oh there he goes. He died a horrible death. Fortunately, nobody liked him anyway. However, the whole fire cost you a lot of money and personal stress.",
          effect: { self: -2, money: -3, staff: 1, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "How was this even possible? The fires are taken care of. Your employee is probably not gonna come back to work anytime soon, though. On the way out he scared a lot of customers.",
          effect: { self: 1, money: -1, staff: -1, customers: -1 }
        }
      ]
    },
    {
      text: "Some money is missing from the register. You suspect one of your employees took some. Do you want to involve the police?",
      responses: [
        { // Response: 0 (no)
          text: "Let's handle this on our own. I locked all our employees in a room and told them I don't let them out until they tell me who it was... Too harsh? Oh well. I'll let them out then. They don't seem happy.",
          effect: { self: -1, money: -2, staff: -3, customers: 0 },
          addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "",
          effect: { self: 1, money: -2, staff: -1, customers: 0 },
          addToTop: false, shuffleDeck: false
        }
      ]
    },
    {
      text: "Our employees ask for more money. Should we give in?",
      responses: [
        { // Response: 0 (no)
          text: "Watching our resources. Good call. Although our employees just got pretty angry.",
          effect: { self: -1, money: 0, staff: -2, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "More money for everyone! Very generouse. Everyone is very happy.",
          effect: { self: 0, money: -2, staff: 2, customers: 0 }
        }
      ]
    },
    {
      text: "Birthday party! One of your employees is celebrating a birthday party in the kitchen. Are you going to join the party?",
      responses: [
        { // Response: 0 (no)
          text: "Too much to do. I understand. This is not particularly good for your staff happiness.",
          effect: { self: 1, money: 0, staff: -1, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "Party time! You had a little bit too much alcohol. Your customers are completely forgotten. But your team has the best time they ever had!",
          effect: { self: 2, money: 0, staff: 2, customers: -2 }
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
          effect: { self: 0, money: -1, staff: -2, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "Well. At least someone. He doesn't seem to be so expensive. So it's probably not a big deal if he messes up.",
          effect: { self: 2, money: -2, staff: 2, customers: 1 },
          cardsToAdd: ["employees"]
        }
      ]
    },
    {
      text: "An older lady claims she can make better coffee than we do. She says she would do it for 5 bucks an hour. Should we get her on board?",
      responses: [
        { // Response: 0 (no)
          text: "Yeah who knows if she really knows how to even make coffee. However, somebody overheard the conversation and now our customers think we discriminate because of age.",
          effect: { self: -1, money: 0, staff: 1, customers: -4 }
        },
        { // Response: 1 (yes)
          text: "Who de thunk. She is right. Her coffee is awesome. The customers love her. She doesn't even cost a lot of money.",
          effect: { self: 2, money: -1, staff: 1, customers: 3 },
          cardsToAdd: ["employees"]
        }
      ]
    },
    {
      text: "A girl with green hair applied to a job with us. She might have given us more information about herself. But the green hair is really all I remembered. Should we hire her? ",
      responses: [
        { // Response: 0 (no)
          text: "Really? I would have thought she'd be a great addition to the team.",
          effect: { self: 0, money: 0, staff: 0, customers: 0 },
          addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Good choice. I don't think she would let us down.",
          effect: { self: 1, money: -1, staff: 1, customers: -1 },
          cardsToAdd: ["employees__crazy"], addToTop: false, shuffleDeck: false
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
          addToTop: false, shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "I like green too. Seems like it fits very well with our whole place.",
          effect: { self: 0, money: 0, staff: 2, customers: -1 },
          cardsToAdd: ["employees__crazy"], addToTop: false, shuffleDeck: false
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
          effect: { self: 1, money: 0, staff: 0, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "Mhm.",
          effect: { self: -1, money: 0, staff: 0, customers: 0 }
        }
      ]
    },
    {
      text: "I noticed now the third time: Sometimes there is a strange man in a suit sitting in the back watching our employees. Doesn't that make you feel weird, too?",
      responses: [
        { // Response: 0 (no)
          text: "I don't know how you do it. I feel very uncomfortable.",
          effect: { self: -1, money: 0, staff: -1, customers: -1 }
        },
        { // Response: 1 (yes)
          text: "Maybe we should rethink whether to pay the people from before some protection money. Our customers are not particularly happy and you also seem quite stressed.",
          effect: { self: -2, money: 0, staff: -1, customers: -1 }
        }
      ]
    },
    {
      text: "When I arrived this morning, our entire interior was destroyed! Someone must have demolished everything over night! Do you think this might be related to the people who wanted protection money?",
      responses: [
        { // Response: 0 (no)
          text: "Not sure if you're right. We all still feel weird. But more importantly: The rebuilding of your restaurant will cost us quite some money.",
          effect: { self: -1, money: -3, staff: -1, customers: -1 }
        },
        { // Response: 1 (yes)
          text: "Oh oh. Maybe they give us another chance... For now we have to think about rebuilding our restaurant. And maybe come up with some ways to calm our staff down.",
          effect: { self: -1, money: -3, staff: -2, customers: -1 }
        }
      ]
    }
  ],
  mafia__payed: [
    {
      text: "A robbery! Oh no! What should we do?! They say they want access to our safe. Do we give them access?",
      responses: [
        { // Response: 0 (no)
          text: "We are all gonna die... Oh no. What's that? A black van showed up, a couple men in suits came out and started shooting at the robbers! Man. Our whole restaurant is destroyed but at least we're alive.",
          effect: { self: 4, money: -4, staff: 2, customers: -1 }
        },
        { // Response: 1 (yes)
          text: "They took all our money. But what's that? On the way out they got stopped by a black van. Looks like the people we gave money to before attacked the robbers and took all the money from them.",
          effect: { self: -1, money: -5, staff: -2, customers: -1 }
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
      addToTop: false, shuffleDeck: true
    },
    { // Response: 1 (yes)
      text: "She starts talking: Three days ago I walked through the park until suddenly I saw a big fat cat. I mean... it was really fat. It was lying on its back trying to get back on its feet but it simply not work. It couldn't get back up. Crazy right?",
      effect: { self: -1, money: 0, staff: 0, customers: 2 },
      addToTop: false, shuffleDeck: true
    }
      ]
    },
    {
      text: "There is a stranger in a good looking suit outside. He wants some money and offers protection in return. Should we give him the money?",
      responses: [
        { // Response: 0 (no)
          text: "Strange man. I think it's for the better we didn't pay him.",
          effect: { self: 0, money: 0, staff: 0, customers: -1 },
          cardsToAdd: ["mafia__notpayed"], cardsToRemove: ["mafia__payed"]
        },
        { // Response: 1 (yes)
          text: "Probably for the best. Let's not make enemies so early on.",
          effect: { self: -1, money: -2, staff: 0, customers: 1 },
          cardsToAdd: ["mafia__payed"], cardsToRemove: ["mafia__notpayed"]
        }
      ]
    },
    {
      text: "A stranger in a grey suit is here. He asks for money and offers protection. Should we trust him?",
      responses: [
        { // Response: 0 (no)
          text: "Oh oh. I hope he doesn't have powerful bosses.",
          effect: { self: -1, money: 0, staff: 0, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "Yea. He looked strong. I'm sure we can use his strength. Although he might have also just been a con man who never shows up again.",
          effect: { self: 0, money: -5, staff: 0, customers: 0 }
        }
      ]
    },
    {
      text: "A good-looking sales person showed up offering us a good deal on Shnud Light the popular beer. Do you want to take it?",
      responses: [
        { // Response: 0 (no)
          text: "Ok.",
          effect: { self: 0, money: 0, staff: 0, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "I bet we get some new customers from that.",
          effect: { self: 0, money: -2, staff: 0, customers: 2 }
        }
      ]
    },
    {
      text: "It's been a good day. We had lots of customers. Isn't that fabulous?",
      responses: [
        { // Response: 0 (no)
          text: "Still not good enough? I guess we have to work harder.",
          effect: { self: 0, money: 3, staff: -1, customers: 2 }
        },
        { // Response: 1 (yes)
          text: "Yeah!",
          effect: { self: 0, money: 3, staff: 1, customers: 2 }
        }
      ]
    },
    {
      text: "A stray cat jumped through the kitchen window and ate half of our stuff! I caught it. Should we punish it?",
      responses: [
        { // Response: 0 (no)
          text: "I guess it wouldn't change anything anyway.",
          effect: { self: 2, money: -1, staff: 0, customers: 1 }
        },
        { // Response: 1 (yes)
          text: "Yes! Let's teach it a lesson. I'll get a razer and shave her furr off! That'll be fun.",
          effect: { self: 0, money: -1, staff: 2, customers: 0 }
        }
      ]
    },
    {
      text: "The water from our faucet has some sort of brown coloring. Should we be worried?",
      responses: [
        { // Response: 0 (no)
          text: "You're right. Let's serve it to the customers anyway. They might not be so happy but who cares.",
          effect: { self: 0, money: 0, staff: 0, customers: -2 }
        },
        { // Response: 1 (yes)
          text: "I'll call someone to fix this. It'll cost us some money but it's probably for the best.",
          effect: { self: 0, money: -1, staff: 0, customers: 0 }
        }
      ]
    },
    {
      text: "A customer just dropped a 50 dollar bill. I will give it back ok?",
      responses: [
        { // Response: 0 (no)
          text: "Every penny counts these days. Not sure how you live with your conscience.",
          effect: { self: -2, money: 2, staff: 0, customers: 0 }
        },
        { // Response: 1 (yes)
          text: "Certainly the right thing to do.",
          effect: { self: 1, money: 0, staff: 0, customers: 0 }
        }
      ]
    },
    {
      text: "The business has been running for a little while now. Do you want to go on vacation?",
      responses: [
        { // Response: 0 (no)
          text: "I see. Still so much to do I guess.",
          effect: { self: -2, money: 1, staff: 1, customers: 1 }
        },
        { // Response: 1 (yes)
          text: "Good call! See you back in a few days!",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], shuffleDeck: false
        }
      ]
    }
  ],
  random__city: [
    {
      text: "A new startup rented some office space next door. Want to go say 'welcome' to our new neighbours?",
      responses: [
        { // Response: 0 (no)
          text: "Let's not waste time bothering about these hispters",
          effect: { self: -1 },
          cardsToAdd: ["startup"]
        },
        { // Response: 1 (yes)
          text: "The startup is called Drinkstr and it seems to make some interesting new drin. Maybe this could become interesting for our business some time.",
          effect: { self: 1 },
          cardsToAdd: ["startup"]
        }
      ]
    }
  ],
  space_cafe__1: [
    {
      text: "Wow... it's rather... strange up here. Are you sure this was the right decision?",
      responses: [
        { // Response: 0 (no)
          text: "Great. Maybe you should have said something before we flew up here. Now we gotta do this no matter what.",
          effect: { self: -2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["space_cafe__2"], cardsToRemove: ["space_cafe__1"]
        },
        { // Response: 1 (yes)
          text: "If you think so. Let's hope you were right.",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["space_cafe__2"], cardsToRemove: ["space_cafe__1"]
        }
      ]
    },
    {
      text: "Grey. Lot's of grey rocks. Other than that... nothing. Should we build our restaurant in one of those big craters?",
      responses: [
        { // Response: 0 (no)
          text: "Not a crater. Alright. Let's build it right here then.",
          effect: { self: -2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["space_cafe__2", "space_cafe__asteroids"], cardsToRemove: ["space_cafe__1"]
        },
        { // Response: 1 (yes)
          text: "I think that was a wise choice. craters offer protection against asteroids.",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["space_cafe__2"], cardsToRemove: ["space_cafe__1"]
        }
      ]
    }
  ],
  space_cafe__2: [
    {
      text: "Alright. Your restaurant is all set up and ready to go. Now, we wait for customers. Do you see any?",
      responses: [
        { // Response: 0 (no)
          text: "They will come. I'm sure. We basically have the monopoly on this planet.",
          effect: { self: -1, money: -1, staff: 0, customers: -1 },
          cardsToAdd: ["space_cafe__3"], cardsToRemove: ["space_cafe__2"]
        },
        { // Response: 1 (yes)
          text: "Liar. But I guess being an optimistic visionary is a good thing for entrpeneurs.",
          effect: { self: 1, money: -1, staff: 0, customers: 1 },
          cardsToAdd: ["space_cafe__3"], cardsToRemove: ["space_cafe__2"]
        }
      ]
    }
  ],
  space_cafe__3: [
    {
      text: "So it's been some days and we still haven't seen any customers. I wonder if we should change something. Should we put up billboards?",
      responses: [
        { // Response: 0 (no)
          text: "If we just wait long enough, we might get some customers you think? Ok.",
          effect: { self: -1, money: 0, staff: 0, customers: -1 },
          cardsToAdd: ["space_cafe__4__end"], cardsToRemove: ["space_cafe__3"]
        },
        { // Response: 1 (yes)
          text: "Great! Let's see if we get some attention.",
          effect: { self: 0, money: -1, staff: 0, customers: -1 },
          cardsToAdd: ["space_cafe__4"], cardsToRemove: ["space_cafe__3"]
        }
      ]
    }
  ],
  space_cafe__4__end: [
    {
      text: "Not sure anyone will ever show up... Don't you think?",
      responses: [
        { // Response: 0 (no)
          gameOver: "lostInSpace"
        },
        { // Response: 1 (yes)
          gameOver: "lostInSpace"
        }
      ]
    }
  ],
  space_cafe__4: [
    {
      text: "What's that?! A Tesla is floating towards our drive through! Could that be our first customer?",
      responses: [
        { // Response: 0 (no)
          text: "Don't be so pessimistic! The car actually stopped and we got our first customer!",
          effect: { self: -1, money: 1, staff: 0, customers: 1 },
          cardsToAdd: ["space_cafe__random"], cardsToRemove: ["space_cafe__4"]
        },
        { // Response: 1 (yes)
          text: "Woohoo! You're right! Our first order! How exciting. I'm sure word is getting out now.",
          effect: { self: 1, money: 1, staff: 0, customers: 1 },
          cardsToAdd: ["space_cafe__random"], cardsToRemove: ["space_cafe__4"]
        }
      ]
    }
  ],
  space_cafe__random: [
    {
      text: "A group of small green people walked in. They don't seem human. Should we serve them anyway?",
      responses: [
        { // Response: 0 (no)
          gameOver: "deathByAlien"
        },
        { // Response: 1 (yes)
          text: "These little guys seem particularly happy.",
          effect: { self: 0, money: 2, staff: 0, customers: 2 }
        }
      ]
    }
  ],
  space_cafe__asteroids: [
    {
      text: "A big asteroid is coming closer and closer! Are you gonna risk your life protecting your business?",
      responses: [
        { // Response: 0 (no)
          gameOver: "deathByAsteroid"
        },
        { // Response: 1 (yes)
          gameOver: "deathByAsteroid"
        }
      ]
    }
  ],
  startup: [
    {
      text: "A full bearded from the startup next doort told us his company developed a new vegan, lactose free, gluten free, alcohol free, caffein free, sugar free drink. They ask if we want to sell it.",
      responses: [
        { // Response: 0 (no)
          text: "Didn't seem like a tasty drink.",
          effect: { self: -1 }
        },
        { // Response: 1 (yes)
          text: "Well, maybe Drinkster will be the next big thing. We will see how our customers like it.",
          effect: { self: 0, money: -2, staff: 0, customers: 2 }
        }
      ]
    }
  ],
  vacation: [
    {
      text: "Seems like you're enjoying yourself with some cocktails in the warm sun of the Carribean. Do you want to go back yet?",
      responses: [
        { // Response: 0 (no)
          text: "Yea let's get you some more of those cocktails.",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Duty calls!",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToRemove: ["vacation"]
        }
      ]
    },
    {
      text: "Another wonderful day on the beach. Maybe you want to think about coming home. What do you think?",
      responses: [
        { // Response: 0 (no)
          text: "Can't get enough of that beach?",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Alright. Next stop: Home. Welcome back!",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToRemove: ["vacation"]
        }
      ]
    },
    {
      text: "You seem very well rested out here in the sun. Is it time to go back to work yet?",
      responses: [
        { // Response: 0 (no)
          text: "Who am I kidding. Of course not!",
          effect: { self: 2, money: -1, staff: 0, customers: 0 },
          cardsToAdd: ["vacation"], shuffleDeck: false
        },
        { // Response: 1 (yes)
          text: "Time to become reasonable.",
          effect: { self: -1, money: 0, staff: 0, customers: 0 },
          cardsToRemove: ["vacation"]
        }
      ]
    }
  ]
}

function buildCards(cards, category = 'random'){
  return cards.map(card => {
    // Add category to card
    card.category = category
    // Set default response values
    card.responses = card.responses.map(responseObj => {
      let newObj = Object.assign({}, responseObj)
      // Set effect defaults
      if(newObj.effect == undefined){
        newObj.effect = { self: 0, money: 0, staff: 0, customers: 0 }
      }else{
        newObj.effect.self = newObj.effect.self == undefined ? 0 : newObj.effect.self
        newObj.effect.money = newObj.effect.money == undefined ? 0 : newObj.effect.money
        newObj.effect.staff = newObj.effect.staff == undefined ? 0 : newObj.effect.staff
        newObj.effect.customers = newObj.effect.customers == undefined ? 0 : newObj.effect.customers
      }
      // Set action and deck defaults
      newObj.text = newObj.text == undefined ? '' : newObj.text
      newObj.cardsToAdd = newObj.cardsToAdd == undefined ? [] : newObj.cardsToAdd
      newObj.cardsToRemove = newObj.cardsToRemove == undefined ? [] : newObj.cardsToRemove
      newObj.addToTop = newObj.addToTop == undefined ? true : newObj.addToTop
      newObj.shuffleDeck = newObj.shuffleDeck == undefined ? true : newObj.shuffleDeck
      newObj.gameOver = newObj.gameOver == undefined ? false : newObj.gameOver
      return newObj
    })
    return card
  })
}
// Add the key of each group of cards as 'category' for each individual card
module.exports = Object.keys(cards).reduce((accumulator, currentKey) => {
  accumulator[currentKey] = buildCards(cards[currentKey], currentKey)
  return accumulator
}, {})
