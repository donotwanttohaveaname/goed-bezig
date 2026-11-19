/* goed bezig: the words, the places, the sentences.
   225 words come from Anna's own list (flemish_dutch_vocabulary.csv).
   The rest were added later: places marked mine:true.
   Word format: [dutch, english] or [dutch, english, 'p'] for a plural noun. */

const PLACES = [
  {
    id: 'hallo', nl: 'eerste woorden', en: 'hello, thanks, sorry', color: 'pink', icon: 'bubble', mine: true,
    boss: { who: 'de bakker', line: 'Goedemorgen! Wat mag het zijn?', lineEn: 'Good morning! What will it be?' },
    words: [
      ['hallo', 'hello'], ['dag', 'hi / bye'], ['goedemorgen', 'good morning'], ['goedemiddag', 'good afternoon'],
      ['goedenavond', 'good evening'], ['slaapwel', 'sleep well / good night'], ['tot ziens', 'goodbye'],
      ['tot straks', 'see you later'], ['tot morgen', 'see you tomorrow'], ['ja', 'yes'], ['nee', 'no'],
      ['alstublieft', 'please / here you go'], ['dank u', 'thank you'], ['merci', 'thanks'],
      ['graag gedaan', "you're welcome"], ['sorry', 'sorry'], ['excuseer', 'excuse me'],
      ['hoe gaat het?', 'how are you?'], ['goed, en met u?', 'fine, and you?'],
      ['ik begrijp het niet', "I don't understand"], ['spreekt u Engels?', 'do you speak English?'],
      ['smakelijk', 'enjoy your meal']
    ],
    sentences: [
      ['Hallo, hoe gaat het?', 'Hello, how are you?'],
      ['Goed, dank u!', 'Fine, thank you!'],
      ['Sorry, ik begrijp het niet.', "Sorry, I don't understand."],
      ['Excuseer, spreekt u Engels?', 'Excuse me, do you speak English?'],
      ['Tot morgen en slaapwel!', 'See you tomorrow and sleep well!']
    ]
  },
  {
    id: 'klein', nl: 'kleine woorden', en: 'I, you, and, but, with', color: 'yellow', icon: 'blocks', mine: true,
    boss: { who: 'de papegaai van de buren', line: 'En! Maar! Of! Ook!', lineEn: 'And! But! Or! Also!' },
    words: [
      ['ik', 'I'], ['jij', 'you (informal)'], ['u', 'you (formal)'], ['hij', 'he'], ['zij', 'she / they'],
      ['wij', 'we'], ['jullie', 'you (plural)'], ['zijn', 'to be'], ['hebben', 'to have'], ['en', 'and'],
      ['maar', 'but'], ['of', 'or'], ['ook', 'also / too'], ['niet', 'not'], ['geen', 'no / not any'],
      ['met', 'with'], ['zonder', 'without'], ['voor', 'for'], ['naar', 'to / towards'], ['van', 'of / from'],
      ['in', 'in'], ['op', 'on'], ['mijn', 'my'], ['hier', 'here'], ['daar', 'there'], ['heel', 'very'],
      ['een beetje', 'a little bit'], ['graag', 'gladly / with pleasure']
    ],
    sentences: [
      ['Ik ben {name} en ik heb een hond.', 'I am {name} and I have a dog.'],
      ['Ik ben hier met mijn zus.', 'I am here with my sister.'],
      ['Ik heb geen kat.', "I don't have a cat."],
      ['Thee zonder melk, alstublieft.', 'Tea without milk, please.'],
      ['Hij is ook een beetje moe.', 'He is also a little tired.'],
      ['Wij zijn hier, maar zij zijn daar.', 'We are here, but they are there.']
    ]
  },
  {
    id: 'mensen', nl: 'mensen', en: 'people & relationships', color: 'teal', icon: 'people',
    boss: { who: 'de buurvrouw', line: 'En, hoe is het met de familie?', lineEn: 'So, how is the family?' },
    words: [
      ['de persoon', 'the person'], ['de vriend', 'male friend'], ['de vriendin', 'female friend / girlfriend'],
      ['de familie', 'family'], ['de buurman', 'male neighbour'], ['de buurvrouw', 'female neighbour'],
      ['de man', 'man / husband'], ['de vrouw', 'woman / wife'], ['het kind', 'child'], ['de collega', 'colleague'],
      ['de moeder', 'mother'], ['de vader', 'father'], ['de zus', 'sister'], ['de broer', 'brother'],
      ['de partner', 'partner'], ['de buur', 'neighbour'], ['de mensen', 'people', 'p'], ['de naam', 'name']
    ],
    sentences: [
      ['Mijn buurvrouw is heel vriendelijk.', 'My neighbour is very friendly.'],
      ['De broer van mijn vriendin woont in Gent.', "My friend's brother lives in Ghent."],
      ['Mijn moeder en mijn vader wonen ver weg.', 'My mother and my father live far away.'],
      ['Het kind van de buurman is lief.', "The neighbour's child is sweet."],
      ['Wat is de naam van je collega?', "What is your colleague's name?"]
    ]
  },
  {
    id: 'doen', nl: 'doen', en: 'everyday verbs', color: 'orange', icon: 'bolt',
    boss: { who: 'de pilatesjuf', line: 'Allez, en nu: werken!', lineEn: 'Come on, and now: work!' },
    words: [
      ['wonen', 'to live'], ['werken', 'to work'], ['leren', 'to learn'], ['spreken', 'to speak'],
      ['begrijpen', 'to understand'], ['luisteren', 'to listen'], ['kijken', 'to look / watch'],
      ['denken', 'to think'], ['weten', 'to know (a fact)'], ['willen', 'to want'],
      ['kunnen', 'can / to be able to'], ['moeten', 'must / to have to'], ['gaan', 'to go'], ['komen', 'to come'],
      ['doen', 'to do'], ['maken', 'to make'], ['eten', 'to eat'], ['drinken', 'to drink'], ['slapen', 'to sleep'],
      ['wandelen', 'to walk']
    ],
    sentences: [
      ['Ik leer Nederlands.', 'I am learning Dutch.'],
      ['Ik wil goed Nederlands spreken.', 'I want to speak Dutch well.'],
      ['Ik begrijp veel, maar ik spreek weinig.', 'I understand a lot, but I speak little.'],
      ['Wij gaan vandaag wandelen.', 'We are going for a walk today.'],
      ['Ik moet morgen werken.', 'I have to work tomorrow.'],
      ['Wat wil je eten?', 'What do you want to eat?']
    ]
  },
  {
    id: 'thuis', nl: 'thuis', en: 'home & living', color: 'cyan', icon: 'house',
    boss: { who: 'de huisbaas', line: 'Ik kom even kijken. Waar is de sleutel?', lineEn: 'Just popping in. Where is the key?' },
    words: [
      ['het huis', 'house'], ['het appartement', 'apartment'], ['de kamer', 'room'], ['de keuken', 'kitchen'],
      ['de badkamer', 'bathroom'], ['de slaapkamer', 'bedroom'], ['de tafel', 'table'], ['de stoel', 'chair'],
      ['de sleutel', 'key'], ['schoonmaken', 'to clean'], ['het bed', 'bed'], ['de deur', 'door'],
      ['het raam', 'window'], ['de vloer', 'floor'], ['de muur', 'wall'], ['de bank', 'sofa'],
      ['de kast', 'cupboard'], ['de lamp', 'lamp'], ['de was', 'laundry'], ['de tuin', 'garden']
    ],
    sentences: [
      ['De sleutel is in de keuken.', 'The key is in the kitchen.'],
      ['Mijn appartement heeft een kleine tuin.', 'My apartment has a small garden.'],
      ['Ik moet de badkamer schoonmaken.', 'I have to clean the bathroom.'],
      ['De hond slaapt op de bank.', 'The dog sleeps on the sofa.'],
      ['De lamp in de slaapkamer is nieuw.', 'The lamp in the bedroom is new.']
    ]
  },
  {
    id: 'eten', nl: 'eten & drinken', en: 'food & drinks', color: 'green', icon: 'cup',
    boss: { who: 'de ober', line: 'Hebt u al gekozen?', lineEn: 'Have you chosen yet?' },
    words: [
      ['het eten', 'food'], ['het ontbijt', 'breakfast'], ['de lunch', 'lunch'], ['het avondeten', 'dinner'],
      ['de koffie', 'coffee'], ['de thee', 'tea'], ['de muntthee', 'mint tea'], ['het water', 'water'],
      ['de groenten', 'vegetables', 'p'], ['het vlees', 'meat'], ['de zalm', 'salmon'], ['de garnaal', 'shrimp'],
      ['de garnalen', 'shrimp (plural)', 'p'], ['de granaatappel', 'pomegranate'], ['de wafel', 'waffle'],
      ['de rijst', 'rice'], ['het brood', 'bread'], ['de kaas', 'cheese'], ['het ei', 'egg'], ['de vis', 'fish'],
      ['de aardappel', 'potato'], ['de appel', 'apple'], ['de banaan', 'banana'], ['de melk', 'milk'],
      ['het restaurant', 'restaurant']
    ],
    sentences: [
      ['Ik drink graag muntthee.', 'I like drinking mint tea.'],
      ['Een koffie met melk, alstublieft.', 'A coffee with milk, please.'],
      ['Ik eet zalm met rijst en groenten.', "I'm eating salmon with rice and vegetables."],
      ['Als ontbijt eet ik brood met kaas.', 'For breakfast I eat bread with cheese.'],
      ['Ik wil een wafel en een koffie.', 'I want a waffle and a coffee.'],
      ['Mijn zus eet geen vlees.', "My sister doesn't eat meat."]
    ]
  },
  {
    id: 'fruit', nl: 'fruit', en: 'all kinds of fruit', color: 'pink', icon: 'apple', mine: true,
    boss: { who: 'de fruitboer', line: 'Proeven? Lekker zoet!', lineEn: 'Want a taste? Nice and sweet!' },
    words: [
      ['het fruit', 'fruit'], ['de peer', 'pear'], ['de sinaasappel', 'orange'], ['de mandarijn', 'mandarin'],
      ['de citroen', 'lemon'], ['de limoen', 'lime'], ['de pompelmoes', 'grapefruit'], ['de aardbei', 'strawberry'],
      ['de framboos', 'raspberry'], ['de bosbes', 'blueberry'], ['de braam', 'blackberry'], ['de kers', 'cherry'],
      ['de druif', 'grape'], ['de perzik', 'peach'], ['de abrikoos', 'apricot'], ['de pruim', 'plum'],
      ['de ananas', 'pineapple'], ['de mango', 'mango'], ['de kiwi', 'kiwi'], ['de meloen', 'melon'],
      ['de watermeloen', 'watermelon'], ['de vijg', 'fig'], ['de avocado', 'avocado'], ['de kokosnoot', 'coconut'],
      ['de noot', 'nut']
    ],
    sentences: [
      ['Ik eet elke dag fruit.', 'I eat fruit every day.'],
      ['Een kilo aardbeien, alstublieft.', 'A kilo of strawberries, please.'],
      ['De druiven zijn heel zoet.', 'The grapes are very sweet.'],
      ['Ik wil een appel en een peer.', 'I want an apple and a pear.'],
      ['Mijn zus eet graag kersen.', 'My sister likes eating cherries.'],
      ['Is de mango rijp?', 'Is the mango ripe?']
    ]
  },
  {
    id: 'groen', nl: 'groenten', en: 'vegetables & herbs', color: 'green', icon: 'leaf', mine: true,
    boss: { who: 'de groenteboer', line: 'Verse groenten! Wat mag het zijn?', lineEn: 'Fresh vegetables! What will it be?' },
    words: [
      ['de tomaat', 'tomato'], ['de komkommer', 'cucumber'], ['de wortel', 'carrot'], ['de ui', 'onion'],
      ['de knoflook', 'garlic'], ['de paprika', 'bell pepper'], ['de sla', 'lettuce'], ['de spinazie', 'spinach'],
      ['de broccoli', 'broccoli'], ['de bloemkool', 'cauliflower'], ['de kool', 'cabbage'],
      ['de spruitjes', 'Brussels sprouts', 'p'], ['het witloof', 'chicory'], ['de courgette', 'courgette'],
      ['de aubergine', 'aubergine'], ['de champignon', 'mushroom'], ['de prei', 'leek'], ['de selder', 'celery'],
      ['de erwten', 'peas', 'p'], ['de bonen', 'beans', 'p'], ['de maïs', 'corn'], ['de pompoen', 'pumpkin'],
      ['de rode biet', 'beetroot'], ['de asperge', 'asparagus'], ['de radijs', 'radish'],
      ['de zoete aardappel', 'sweet potato'], ['de gember', 'ginger'], ['de peterselie', 'parsley']
    ],
    sentences: [
      ['Ik koop groenten op de markt.', 'I buy vegetables at the market.'],
      ['Zonder ui, alstublieft.', 'Without onion, please.'],
      ['De soep is met wortel en prei.', 'The soup is made with carrot and leek.'],
      ['Wij eten vanavond witloof.', "We're eating chicory tonight."],
      ['Ik eet graag broccoli met knoflook.', 'I like eating broccoli with garlic.'],
      ['De tomaten zijn nog niet rijp.', 'The tomatoes are not ripe yet.']
    ]
  },
  {
    id: 'salade', nl: 'salades', en: 'salads, soup & what goes on top', color: 'teal', icon: 'bowl', mine: true,
    boss: { who: 'de kok', line: 'Dressing erbij? Zout en peper?', lineEn: 'Dressing with that? Salt and pepper?' },
    words: [
      ['de salade', 'salad'], ['de gemengde salade', 'mixed salad'], ['de tomatensalade', 'tomato salad'],
      ['de Griekse salade', 'Greek salad'], ['de aardappelsalade', 'potato salad'], ['de pastasalade', 'pasta salad'],
      ['de kipsalade', 'chicken salad'], ['de tonijnsalade', 'tuna salad'], ['de fruitsalade', 'fruit salad'],
      ['de olijf', 'olive'], ['de olijfolie', 'olive oil'], ['de azijn', 'vinegar'], ['het zout', 'salt'],
      ['de peper', 'pepper'], ['de dressing', 'dressing'], ['de saus', 'sauce'], ['de mayonaise', 'mayonnaise'],
      ['de soep', 'soup']
    ],
    sentences: [
      ['Ik maak een salade met tomaat en komkommer.', "I'm making a salad with tomato and cucumber."],
      ['Ik doe olijfolie en azijn op de salade.', 'I put olive oil and vinegar on the salad.'],
      ['Een Griekse salade zonder olijven, alstublieft.', 'A Greek salad without olives, please.'],
      ['Mag ik het zout en de peper?', 'May I have the salt and the pepper?'],
      ['Als lunch eet ik soep met brood.', 'For lunch I eat soup with bread.']
    ]
  },
  {
    id: 'vlees', nl: 'vlees & vis', en: 'meat & fish', color: 'orange', icon: 'fish', mine: true,
    boss: { who: 'de beenhouwer', line: 'En voor mevrouw?', lineEn: 'And for madam?' },
    words: [
      ['de kip', 'chicken'], ['het rundvlees', 'beef'], ['het varkensvlees', 'pork'], ['het lamsvlees', 'lamb'],
      ['het kalfsvlees', 'veal'], ['het gehakt', 'minced meat'], ['de worst', 'sausage'], ['de ham', 'ham'],
      ['het spek', 'bacon'], ['de biefstuk', 'steak'], ['de kalkoen', 'turkey'], ['de eend', 'duck'],
      ['de hamburger', 'hamburger'], ['het stoofvlees', 'Flemish beef stew'], ['de beenhouwer', 'butcher'],
      ['de tonijn', 'tuna'], ['de kabeljauw', 'cod'], ['de forel', 'trout'], ['de haring', 'herring'],
      ['de makreel', 'mackerel'], ['de tong', 'sole'], ['de mosselen', 'mussels', 'p'], ['de inktvis', 'squid'],
      ['de krab', 'crab'], ['de kreeft', 'lobster'], ['de oester', 'oyster'], ['de scampi', 'scampi', 'p'],
      ['de zeevruchten', 'seafood', 'p'], ['de viswinkel', 'fish shop']
    ],
    sentences: [
      ['Ik eet liever vis dan vlees.', "I'd rather eat fish than meat."],
      ['De kip met rijst is lekker.', 'The chicken with rice is tasty.'],
      ['Een biefstuk met frietjes, alstublieft.', 'A steak with fries, please.'],
      ['Mosselen met frietjes is echt Belgisch.', 'Mussels with fries is properly Belgian.'],
      ['Is er vlees in de soep?', 'Is there meat in the soup?'],
      ['Ik neem de zalm met groenten.', "I'll have the salmon with vegetables."]
    ]
  },
  {
    id: 'cijfers', nl: 'cijfers', en: 'numbers', color: 'sky', icon: 'hash', mine: true,
    boss: { who: 'de kassierster van Aldi', line: 'Dat is dan twintig euro. Volgende!', lineEn: "That'll be twenty euros. Next!" },
    words: [
      ['één', 'one'], ['twee', 'two'], ['drie', 'three'], ['vier', 'four'], ['vijf', 'five'], ['zes', 'six'],
      ['zeven', 'seven'], ['acht', 'eight'], ['negen', 'nine'], ['tien', 'ten'], ['twintig', 'twenty'],
      ['honderd', 'hundred']
    ],
    sentences: [
      ['Ik heb twee broers en één zus.', 'I have two brothers and one sister.'],
      ['Twee koffies en drie wafels, alstublieft.', 'Two coffees and three waffles, please.'],
      ['De bus komt om acht uur.', "The bus comes at eight o'clock."],
      ['Hoeveel is dat? Tien euro.', 'How much is that? Ten euros.'],
      ['Het kind van de buurvrouw is vier jaar oud.', "The neighbour's child is four years old."]
    ]
  },
  {
    id: 'sociaal', nl: 'onder vrienden', en: 'social life', color: 'pink', icon: 'heart',
    boss: { who: 'de stamgast', line: 'Kom erbij! Wat drink je?', lineEn: 'Join us! What are you drinking?' },
    words: [
      ['afspreken', 'to arrange to meet / meet up'], ['de afspraak', 'appointment / arrangement'],
      ['het feestje', 'party'], ['de liefde', 'love'], ['samen', 'together'], ['alleen', 'alone'],
      ['misschien', 'maybe'], ['natuurlijk', 'of course'], ['de vriendengroep', 'group of friends'],
      ['het gesprek', 'conversation'], ['praten', 'to talk'], ['lachen', 'to laugh'], ['de grap', 'joke'],
      ['gezellig', 'cosy / sociable / enjoyable'], ['uitnodigen', 'to invite'], ['bezoeken', 'to visit'],
      ['het café', 'café'], ['het drankje', 'drink'], ['het weekend', 'weekend'],
      ['met vrienden afspreken', 'to meet up with friends'], ['vrienden ontmoeten', 'to meet friends'],
      ['op bezoek gaan', 'to visit someone'], ['samen eten', 'to eat together'], ['iets drinken', 'to have a drink'],
      ['uitgaan', 'to go out']
    ],
    sentences: [
      ['Zullen we iets drinken?', 'Shall we have a drink?'],
      ['Ik spreek zaterdag af met vrienden.', "I'm meeting up with friends on Saturday."],
      ['Het is hier heel gezellig.', "It's very cosy here."],
      ['Ik nodig mijn buren uit.', "I'm inviting my neighbours."],
      ['Misschien gaan we morgen uit.', "Maybe we'll go out tomorrow."],
      ['Natuurlijk kom ik naar het feestje!', "Of course I'm coming to the party!"]
    ]
  },
  {
    id: 'gevoel', nl: 'gevoelens', en: 'feelings & personality', color: 'yellow', icon: 'smile',
    boss: { who: 'de kapper', line: 'En, hoe voel je je vandaag?', lineEn: 'So, how are you feeling today?' },
    words: [
      ['blij', 'happy / glad'], ['verdrietig', 'sad'], ['boos', 'angry'], ['moe', 'tired'],
      ['zenuwachtig', 'nervous'], ['rustig', 'calm / quiet'], ['grappig', 'funny'], ['lief', 'sweet / kind'],
      ['druk', 'busy'], ['bang', 'afraid'], ['gelukkig', 'happy / fortunate'], ['enthousiast', 'enthusiastic'],
      ['verliefd', 'in love'], ['verveeld', 'bored'], ['nieuwsgierig', 'curious'], ['vriendelijk', 'friendly'],
      ['eerlijk', 'honest'], ['interessant', 'interesting'], ['moeilijk', 'difficult'], ['gemakkelijk', 'easy']
    ],
    sentences: [
      ['Ik ben blij, maar ook een beetje moe.', "I'm happy, but also a little tired."],
      ['Waarom ben je boos?', 'Why are you angry?'],
      ['Nederlands is niet gemakkelijk, maar wel interessant.', 'Dutch is not easy, but it is interesting.'],
      ['Mijn zus is altijd enthousiast.', 'My sister is always enthusiastic.'],
      ['Ik ben zenuwachtig voor morgen.', "I'm nervous about tomorrow."]
    ]
  },
  {
    id: 'hond', nl: 'de hond', en: 'dog & animals', color: 'teal', icon: 'paw',
    boss: { who: 'de dierenarts', line: 'Wie is hier zo braaf geweest?', lineEn: 'Who has been such a good girl?' },
    words: [
      ['de hond', 'dog'], ['de kat', 'cat'], ['het dier', 'animal'], ['de wandeling', 'walk'],
      ['de dierenarts', 'veterinarian'], ['de riem', 'leash'], ['de puppy', 'puppy'], ['blaffen', 'to bark'],
      ['uitlaten', 'to take a dog out'], ['het park', 'park'], ['de natuur', 'nature']
    ],
    sentences: [
      ['Ik moet de hond uitlaten.', 'I have to take the dog out.'],
      ['Waar is de riem?', 'Where is the leash?'],
      ['Wij maken een wandeling in het park.', "We're going for a walk in the park."],
      ['{dog} blaft soms naar de kat van de buren.', "{dogEn} sometimes barks at the neighbours' cat."],
      ['De dierenarts is heel lief voor {dog}.', 'The vet is very sweet to {dogEn}.']
    ]
  },
  {
    id: 'stad', nl: 'de stad', en: 'city & transport', color: 'orange', icon: 'bike',
    boss: { who: 'de tramchauffeur', line: 'Instappen! Waar moet u zijn?', lineEn: 'All aboard! Where are you headed?' },
    words: [
      ['de stad', 'city'], ['de straat', 'street'], ['de winkel', 'shop'], ['de supermarkt', 'supermarket'],
      ['het station', 'station'], ['de trein', 'train'], ['de fiets', 'bicycle'], ['de bus', 'bus'],
      ['het centrum', 'city centre'], ['dichtbij', 'nearby'], ['ver weg', 'far away'], ['de tram', 'tram'],
      ['de halte', 'stop'], ['het plein', 'square'], ['de markt', 'market'], ['de bakker', 'baker / bakery'],
      ['de apotheek', 'pharmacy'], ['het gebouw', 'building'], ['links', 'left'], ['rechts', 'right'],
      ['naar een winkel gaan', 'to go to a shop'], ['naar Aldi gaan', 'to go to Aldi'],
      ['naar Brussel gaan', 'to go to Brussels'], ['naar het museum gaan', 'to go to the museum'],
      ['een bus nemen', 'to take a bus'], ['een taxi nemen', 'to take a taxi'], ['met de bus gaan', 'to go by bus'],
      ['met de taxi gaan', 'to go by taxi']
    ],
    sentences: [
      ['Ik ga met de bus naar Brussel.', "I'm going to Brussels by bus."],
      ['De supermarkt is dichtbij.', 'The supermarket is nearby.'],
      ['Zaterdag ga ik naar Aldi.', "On Saturday I'm going to Aldi."],
      ['Het station is rechts en de apotheek is links.', 'The station is on the right and the pharmacy is on the left.'],
      ['Ik neem de fiets naar het centrum.', "I'm taking the bike to the centre."],
      ['Waar is de halte van de tram?', 'Where is the tram stop?']
    ]
  },
  {
    id: 'vrij', nl: 'vrije tijd', en: 'hobbies & free time', color: 'cyan', icon: 'note',
    boss: { who: 'de drumleraar', line: 'Een, twee, drie, vier!', lineEn: 'One, two, three, four!' },
    words: [
      ['de muziek', 'music'], ['het concert', 'concert'], ['de film', 'film'], ['het boek', 'book'],
      ['reizen', 'to travel'], ['dansen', 'to dance'], ['zingen', 'to sing'], ['spelen', 'to play'],
      ['drummen', 'to play drums'], ['de hobby', 'hobby'], ['het museum', 'museum'], ['het festival', 'festival'],
      ['het spel', 'game'], ['koken', 'to cook'], ['lezen', 'to read'], ['zwemmen', 'to swim'],
      ['fotograferen', 'to photograph'], ['het strand', 'beach'], ['de vakantie', 'holiday'],
      ['het avontuur', 'adventure'], ['bordspelletjes spelen', 'to play board games'],
      ['pilates doen', 'to do Pilates'], ['de sportles', 'sports class'], ['een film kijken', 'to watch a movie'],
      ['een wafel eten', 'to eat a waffle']
    ],
    sentences: [
      ['Ik speel graag bordspelletjes.', 'I like playing board games.'],
      ['Op dinsdag doe ik pilates.', 'On Tuesdays I do Pilates.'],
      ['Ik kan drummen, maar ik kan niet zingen.', "I can play the drums, but I can't sing."],
      ['Wil je een film kijken?', 'Do you want to watch a film?'],
      ['In de vakantie ga ik naar het strand.', 'In the holidays I go to the beach.'],
      ['Wij gaan zondag naar het museum.', "We're going to the museum on Sunday."]
    ]
  },
  {
    id: 'hobby', nl: "meer hobby's", en: 'painting, cycling, baking and more', color: 'yellow', icon: 'brush', mine: true,
    boss: { who: 'de juf van de tekenles', line: 'Penselen klaar? We beginnen!', lineEn: 'Brushes ready? Off we go!' },
    words: [
      ['schilderen', 'to paint'], ['tekenen', 'to draw'], ['schrijven', 'to write'], ['fietsen', 'to cycle'],
      ['gaan lopen', 'to go for a run'], ['sporten', 'to exercise'], ['tuinieren', 'to garden'], ['bakken', 'to bake'],
      ['breien', 'to knit'], ['naaien', 'to sew'], ['knutselen', 'to do crafts'], ['puzzelen', 'to do puzzles'],
      ['gamen', 'to play video games'], ['kamperen', 'to camp'], ['vissen', 'to go fishing'], ['klimmen', 'to climb'],
      ['skiën', 'to ski'], ['winkelen', 'to go shopping'], ['voetballen', 'to play football'],
      ['tennissen', 'to play tennis'], ['yoga doen', 'to do yoga'], ['gitaar spelen', 'to play guitar'],
      ['piano spelen', 'to play piano'], ['naar muziek luisteren', 'to listen to music'],
      ['series kijken', 'to watch series'], ['het schilderij', 'painting (the picture)'],
      ['de tekening', 'drawing (the picture)'], ['de verf', 'paint']
    ],
    sentences: [
      ['Ik schilder graag in het weekend.', 'I like painting at the weekend.'],
      ['Mijn vriendin kan heel goed tekenen.', 'My friend can draw very well.'],
      ['Wij gaan zondag fietsen.', "We're going cycling on Sunday."],
      ['Ik lees elke avond een boek.', 'I read a book every evening.'],
      ['Zullen we samen iets bakken?', 'Shall we bake something together?'],
      ['Ik speel piano, maar niet zo goed.', 'I play the piano, but not so well.']
    ]
  },
  {
    id: 'agenda', nl: 'de agenda', en: 'time & useful words', color: 'green', icon: 'calendar',
    boss: { who: 'de conducteur', line: 'De trein van vandaag komt morgen.', lineEn: "Today's train arrives tomorrow." },
    words: [
      ['maandag', 'Monday'], ['dinsdag', 'Tuesday'], ['woensdag', 'Wednesday'], ['donderdag', 'Thursday'],
      ['vrijdag', 'Friday'], ['zaterdag', 'Saturday'], ['zondag', 'Sunday'], ['de week', 'week'],
      ['vandaag', 'today'], ['morgen', 'tomorrow'], ['gisteren', 'yesterday'], ['straks', 'later / shortly'],
      ['altijd', 'always'], ['vaak', 'often'], ['soms', 'sometimes'], ['nooit', 'never'], ['vroeg', 'early'],
      ['laat', 'late'], ['groot', 'big'], ['klein', 'small'], ['mooi', 'beautiful'], ['nieuw', 'new'],
      ['oud', 'old'], ['goed', 'good'], ['slecht', 'bad'], ['veel', 'much / many'], ['weinig', 'little / few'],
      ['genoeg', 'enough'], ['waarom', 'why'], ['wanneer', 'when'], ['waar', 'where'],
      ['hoeveel', 'how much / how many'], ['omdat', 'because']
    ],
    sentences: [
      ['Vandaag is het maandag.', 'Today is Monday.'],
      ['Morgen moet ik vroeg werken.', 'Tomorrow I have to work early.'],
      ['Mijn vader drinkt altijd koffie, maar nooit thee.', 'My father always drinks coffee, but never tea.'],
      ['Wanneer kom je naar Brussel?', 'When are you coming to Brussels?'],
      ['Ik ben moe, omdat ik veel werk.', "I'm tired because I work a lot."],
      ['Het nieuwe huis is groot en mooi.', 'The new house is big and beautiful.']
    ]
  },
  {
    id: 'vlaams', nl: 'echt Vlaams', en: 'what the neighbours actually say', color: 'sky', icon: 'fries', mine: true,
    boss: { who: 'de frituurbaas', line: 'Zeg het maar! Met mayonaise?', lineEn: 'What will it be! With mayo?' },
    words: [
      ['amai', 'wow / oh my'], ['allez', 'come on / right then'], ['goesting', 'craving / feeling like it'],
      ['plezant', 'fun / pleasant'], ['salut', 'hi / bye'], ['ça va', "okay / it's fine"], ['tof', 'cool / great'],
      ['voilà', 'there you go'], ['de frietjes', 'fries', 'p'], ['het frietkot', 'chip stand'],
      ['de pint', 'a beer'], ['de gsm', 'mobile phone'], ['de zetel', 'sofa / armchair']
    ],
    sentences: [
      ['Amai, dat is plezant!', "Wow, that's fun!"],
      ['Ik heb goesting in frietjes.', 'I fancy some fries.'],
      ['Allez, tot morgen!', 'Right then, see you tomorrow!'],
      ['Een pint, alstublieft.', 'A beer, please.'],
      ['Salut, ça va?', "Hi, how's it going?"],
      ['Waar is mijn gsm?', 'Where is my phone?']
    ]
  }
];

/* Levels, by wafels collected. */
const LEVELS = [
  { at: 0, nl: 'toerist', en: 'tourist' },
  { at: 40, nl: 'nieuwkomer', en: 'newcomer' },
  { at: 120, nl: 'fietser', en: 'cyclist' },
  { at: 250, nl: 'buur', en: 'neighbour' },
  { at: 450, nl: 'stamgast', en: 'regular at the café' },
  { at: 750, nl: 'wafelkenner', en: 'waffle connoisseur' },
  { at: 1200, nl: 'bijna Vlaming', en: 'almost Flemish' },
  { at: 1800, nl: 'echte Vlaming', en: 'properly Flemish' }
];

/* Stickers that are not boss stickers. Boss stickers are generated per place. */
const STICKERS = [
  { id: 'first', nl: 'eerste wandeling', en: 'finish your first walk', icon: 'route', color: 'pink' },
  { id: 'perfect', nl: 'foutloos', en: 'a walk without one mistake', icon: 'check', color: 'green' },
  { id: 'combo10', nl: 'tien op rij', en: 'ten right in a row', icon: 'bolt', color: 'yellow' },
  { id: 'streak3', nl: 'drie dagen', en: 'three days in a row', icon: 'flame', color: 'orange' },
  { id: 'streak7', nl: 'een hele week', en: 'seven days in a row', icon: 'flame', color: 'pink' },
  { id: 'streak30', nl: 'een maand', en: 'thirty days in a row', icon: 'flame', color: 'cyan' },
  { id: 'met50', nl: 'vijftig woorden', en: '50 words met', icon: 'bubble', color: 'teal' },
  { id: 'met150', nl: 'halfweg', en: 'half of all words met', icon: 'bike', color: 'yellow' },
  { id: 'met300', nl: 'alles ontmoet', en: 'every word met', icon: 'star', color: 'pink' },
  { id: 'vb100', nl: 'honderd van buiten', en: '100 words by heart', icon: 'heart', color: 'sky' },
  { id: 'vb300', nl: 'echte Vlaming', en: 'every word by heart', icon: 'fries', color: 'orange' },
  { id: 'dehet20', nl: 'de of het? de!', en: '20 in one round of de of het', icon: 'blocks', color: 'teal' },
  { id: 'zin10', nl: 'zinnenbouwer', en: 'build 10 sentences', icon: 'note', color: 'green' }
];

/* The game's own voice. [dutch, english] */
const DOG_LINES = {
  hello: [['Dag {name}! Klaar voor vandaag?', 'Hi {name}! Ready for today?'],
          ['Hallo {name}! Zin in woorden?', 'Hello {name}! In the mood for words?'],
          ['Allez {name}, we gaan.', "Come on {name}, let's go."]],
  due: [['Er wachten {n} woorden op jou.', '{n} words are waiting for you.'],
        ['{n} woorden willen herhaald worden.', '{n} words want repeating.']],
  done: [['Klaar voor vandaag. Goed bezig!', 'Done for today. Nice going!'],
         ['Amai, jij bent snel. Tot morgen!', "Wow, you're fast. See you tomorrow!"]],
  ok: [['Juist!', 'Correct!'], ['Goed zo!', 'Well done!'], ['Amai!', 'Wow!'], ['Voilà!', 'There you go!'],
       ['Top!', 'Great!'], ['Zo is dat!', "That's how it's done!"]],
  bad: [['Oei.', 'Oops.'], ['Bijna!', 'Almost!'], ['Niet erg.', 'No worries.'], ['Nog eens!', 'Once more!'],
        ['Allez, volgende keer.', 'Come on, next time.']],
  combo: [['{n} op rij!', '{n} in a row!'], ['Amai, {n} op rij!', 'Wow, {n} in a row!']]
};

if (typeof module !== 'undefined') module.exports = { PLACES, LEVELS, STICKERS, DOG_LINES };
