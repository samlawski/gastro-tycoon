import test from 'ava'
const {say, availableLocales, insertParams} = require('../say_utility.js')

// say

test('say returns message based on passed key and say.prorotype.action', t => {
  say.prototype.action = 'helpIntent'
  t.deepEqual(
    say('suggestionsInGame'),
    ['Yes', 'No']
  )
})
test('say returns message based on custom passed action key', t => {
  t.deepEqual(
    say('startOverConfirmation', {}, 'startNewGameIntent'),
    'Are you sure you want to restart the game? This will reset your entire progress.'
  )
})
test('say returns text with custom set parameter', t => {
  say.prototype.action = 'welcomeIntent'
  t.deepEqual(
    say('welcomeBack', {scoreDays: '42 days'}),
    "Welcome back! Your previous business was alive for 42 days. Just tell me to start a new round if you want or ask me for instructions if you need a reminder on how to play."
  )
})

// availableLocales

test('availableLocales returns given language sets', t => {
  t.deepEqual(
    availableLocales,
    ['en-US']
  )
})

// insertParams

test('insertParams replaces words starting with % with their corresponding parameter', t => {
  t.deepEqual(
    insertParams("Hi %name and %name2", {name: "Bob", name2: "Emma"}),
    "Hi Bob and Emma"
  )
})

test('insertParams doesnt do anything with unmatched params', t => {
  t.deepEqual(
    insertParams("Hi Fred", {name: "Carla"}),
    "Hi Fred"
  )
})
