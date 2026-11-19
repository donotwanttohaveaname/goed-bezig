# goed bezig

A silly little game for learning 300 Flemish Dutch words and about 80 sentences. Built for one player: Anna.

"Goed bezig" is what a Fleming says when you are doing well. Literally: busy in a good way.

Play: https://donotwanttohaveaname.github.io/goed-bezig/

## The concept

Your dog only listens to Dutch. So you walk a route of 14 stops through Flanders, your dog walks with you, and every right answer pays out in wafels.

- **The route.** 14 places, opened one after the other: eerste woorden, kleine woorden, mensen, doen, thuis, eten & drinken, cijfers, onder vrienden, gevoelens, de hond, de stad, vrije tijd, de agenda, echt Vlaams. A place opens when 80% of the one before it is met.
- **De wandeling (the daily walk).** The main button. One walk is up to 10 new words plus whatever is due for repetition, about 5 minutes. The pace setting (10, 20 or 30 new words a day) decides how many walks a day make you "done". At 20 a day, all 300 are met in 15 days.
- **It gets harder as a word gets stronger.** New word card, then pick the meaning, then pick the Dutch, then type it, then recognise it by ear, then type it again. A miss sends the word back a step and brings it round again in the same walk.
- **Spaced repetition underneath.** A word comes back after 10 minutes, then 1 day, 3 days, 7 days, 21 days. Three states: ontmoet (met), gekend (right three times running), van buiten (by heart).
- **De of het?** 45 seconds, nouns only, two big buttons. De is always teal, het is always yellow, everywhere in the game.
- **Zinnen bouwen.** Tap the words into the right order. Sentences use your own words: the bus to Brussels, Aldi on Saturday, pilates on Tuesday, your dog by name.
- **De baas.** Every place has a boss (de buurvrouw, de kassierster van Aldi, de frituurbaas). 12 questions, 7 seconds each, 3 lives. Beat one and you get its sticker.
- **Things to collect.** Wafels (points), 8 levels from toerist to echte Vlaming, 27 stickers, a day streak.
- **Voortgang.** Met, known and by-heart counts, a forecast date, the last 14 days, progress per place, and the words you keep missing.

## The words

- 225 words and phrases are Anna's own list (`flemish_dutch_vocabulary.csv`), unchanged.
- 75 were added to reach 300, in four places marked `mine: true` in `js/data.js`: eerste woorden (22 greetings and survival phrases), kleine woorden (28: pronouns, zijn, hebben, connectors, prepositions), cijfers (12 numbers), echt Vlaams (13 everyday Flemish words such as amai, allez, goesting, de zetel).
- 78 practice sentences, written for this game.

To change a word or add one, edit `js/data.js`. Progress is stored per word by place id plus the Dutch text, so renaming a word resets that word only.

## How it is built

Plain HTML, CSS and JavaScript. No build step, no accounts, no server.

| file | what it is |
|---|---|
| `index.html` | the page shell |
| `css/style.css` | all styling (Anna's brand colours and type) |
| `js/data.js` | places, words, sentences, levels, stickers, the dog's lines |
| `js/app.js` | the game: spaced repetition, the walk, all screens |
| `sw.js` | lets the game open without a connection (network first, cache as fallback) |
| `manifest.json`, `img/` | lets you add it to a phone home screen as an app |

Progress lives in the browser of the device you play on (localStorage). Settings has "download a backup" and "restore from a backup" to move it to another device. Nothing is sent anywhere.

Words are read aloud with the device's own Dutch voice (the Belgian one when the device has it).

The page is public because GitHub Pages needs a public repository, but it asks search engines not to list it.

## Releasing a change

1. Bump `VERSION` in `js/app.js`.
2. Bump the three `?v=` numbers in `index.html` and `CACHE` plus the file list in `sw.js` to the same number.
3. Add a row to the table below.
4. Commit and push to `main`. A push is a publish.

## Versions

| version | date | what changed |
|---|---|---|
| 1.0.0 | 2026-11-19 | first playable build: 300 words, 78 sentences, the walk, de of het, zinnen bouwen, 14 bosses, stickers, progress |
