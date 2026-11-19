# goed bezig

A silly little game for learning 428 Flemish Dutch words and 107 sentences. Built for one player: Anna.

"Goed bezig" is what a Fleming says when you are doing well. Literally: busy in a good way.

Play: https://donotwanttohaveaname.github.io/goed-bezig/

## The concept

You walk a route of 19 places through Flanders and every right answer pays out in wafels. Nothing is locked: every word and every sentence is open from the first minute.

- **The route.** 19 places, all open: eerste woorden, kleine woorden, mensen, doen, thuis, eten & drinken, fruit, groenten, salades, vlees & vis, cijfers, onder vrienden, gevoelens, de hond, de stad, vrije tijd, meer hobby's, de agenda, echt Vlaams. Tap any place to practise only its words.
- **De sneltest.** For the words you already know. One tap per word, 30 words a round: pick the meaning or tap "geen idee". What you know jumps straight to "gekend" and comes back a few days later as a typing check, so a lucky guess gets caught. What you do not know goes to the front of the learning queue.
- **Ken ik al.** Every new-word card has this button. Tap it and you skip the lessons for that word, as long as you can type it.
- **De wandeling (the daily walk).** The main button. One walk is up to 10 new words plus whatever is due for repetition, about 5 minutes. The pace setting (10, 20 or 30 new words a day) decides how many walks a day make you "done". At 20 a day, all 428 are met in 22 days, sooner with the sneltest.
- **It gets harder as a word gets stronger.** New word card, then pick the meaning, then pick the Dutch, then type it, then recognise it by ear, then type it again. A miss sends the word back a step and brings it round again in the same walk.
- **Spaced repetition underneath.** A word comes back after 10 minutes, then 1 day, 3 days, 7 days, 21 days. Three states: ontmoet (met), gekend (right three times running), van buiten (by heart).
- **De of het?** 45 seconds, nouns only, two big buttons. De is always teal, het is always yellow, everywhere in the game.
- **Zinnen bouwen.** All 107 sentences are open from the start, and every walk ends with two of them. Tap the words into the right order. Sentences use your own words: the bus to Brussels, Aldi on Saturday, pilates on Tuesday.
- **De baas.** Every place has a boss (de buurvrouw, de kassierster van Aldi, de frituurbaas). 12 questions, 7 seconds each, 3 lives. Beat one and you get its sticker.
- **Things to collect.** Wafels (points), 8 ranks from toerist to echte Vlaming, 32 stickers, a day streak.
- **Voortgang.** Met, known and by-heart counts, a forecast date, the last 14 days, progress per place, and the words you keep missing.

## The words

- 225 words and phrases are Anna's own list (`flemish_dutch_vocabulary.csv`), unchanged.
- 203 were added, in nine places marked `mine: true` in `js/data.js`: eerste woorden (22 greetings and survival phrases), kleine woorden (28: pronouns, zijn, hebben, connectors, prepositions), cijfers (12 numbers), echt Vlaams (13 everyday Flemish words such as amai, allez, goesting, de zetel), fruit (25), groenten (28), salades (18, with soup, oil, salt and pepper), vlees & vis (29), meer hobby's (28, such as schilderen, tekenen, fietsen, bakken).
- 107 practice sentences, written for this game.
- The dog has her own place (de hond) and can be given her name in Settings, which puts it in two sentences there. She is not the mascot.

To change a word or add one, edit `js/data.js`. Progress is stored per word by place id plus the Dutch text, so renaming a word resets that word only.

## How it is built

Plain HTML, CSS and JavaScript. No build step and no server of its own; sync, when linked, goes through a Google Sheet.

| file | what it is |
|---|---|
| `index.html` | the page shell |
| `css/style.css` | all styling (Anna's brand colours and type) |
| `js/data.js` | places, words, sentences, levels, stickers, the dog's lines |
| `js/app.js` | the game: spaced repetition, the walk, all screens |
| `sw.js` | lets the game open without a connection (network first, cache as fallback) |
| `backend/Code.gs` | the sync backend, an Apps Script that lives inside the Google Sheet "goed bezig". The copy here has a placeholder where the secret goes |
| `manifest.json`, `img/` | lets you add it to a phone home screen as an app |

Progress lives in the browser of the device you play on (localStorage). Settings has "download a backup" and "restore from a backup".

**Sync.** A device that has the sync code also keeps its progress in the Google Sheet "goed bezig", so the phone and the laptop show the same thing. Paste the code once per device under instellingen (on an iPhone, the home-screen app and Safari count as two devices). The Sheet gets a "Progress" tab with one row per day played and a "Words" tab with every word and its strength. The sync code is a secret and is not in this repository. A device without the code sends nothing anywhere.

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
| 1.1.0 | 2026-11-19 | nothing is locked any more: all places and sentences open from the start. New: the sneltest (sort what you already know) and "ken ik al" on new-word cards. Sync code added but switched off until its Google Sheet exists |
| 1.2.0 | 2026-11-19 | 128 more words in five new places: fruit, groenten, salades, vlees & vis, meer hobby's (428 words, 107 sentences). The dog is no longer the mascot: plain greeting on the home screen, no dog name at the start, she keeps her own place |
| 1.3.0 | 2026-11-19 | sync is on: paste the sync code under instellingen and the phone and laptop share progress through the Google Sheet "goed bezig" |
