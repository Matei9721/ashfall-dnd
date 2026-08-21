(() => {
  'use strict';

  const CONTENT = window.ASHFALL_CONTENT;
  const STORAGE_KEY = 'ashfall-dm-control-room-v1';
  const STORY_NOTICE_KEY = 'ashfall-story-notice-dismissed-v1';
  const EXPORT_FORMAT = 'ashfall-dm-workspace';
  const EXPORT_VERSION = 1;
  const NPC_NAMES = ['Elias Voss', 'Mara Vale', 'Nessa Grey', 'Mayor Aldren Morn', 'Constable Iven Rook', 'Silas Wren', 'Seraphine Vey'];
  const ROUTE_BY_VIEW = {
    desk: 'desk',
    map: 'map',
    readaloud: 'read-aloud',
    dice: 'dice',
    cast: 'cast',
    squad: 'squad',
    finale: 'finale',
    tracker: 'tracker',
    encounters: 'encounters',
    cheatsheet: 'rules',
  };
  const VIEW_BY_ROUTE = Object.fromEntries(Object.entries(ROUTE_BY_VIEW).map(([view, route]) => [route, view]));
  const NPC_PLAYBOOK = {
    'Elias Voss': { tier: 'Core guide', memory: 'Full memory', enters: 'Arrival / first reset', starts: 'The escort, the 3:12 wake-up and the restoration argument.' },
    'Mara Vale': { tier: 'Core heart', memory: 'No factual memory', enters: 'Arrival / first crisis', starts: 'Hospitality, Tomas’s empty place and the Lantern House fire.' },
    'Nessa Grey': { tier: 'Core recognition', memory: 'Partial memory', enters: 'Before and after reset', starts: 'A remembered promise that proves a relationship survived.' },
    'Mayor Aldren Morn': { tier: 'Pressure', memory: 'No factual memory', enters: 'When pressure is needed', starts: 'A curfew, detention or harmful protective ritual.' },
    'Constable Iven Rook': { tier: 'Investigation', memory: 'Evidence survives', enters: 'When the party needs proof', starts: 'A controlled claim the next reset can verify.' },
    'Silas Wren': { tier: 'Mechanism', memory: 'Habits and guilt', enters: 'When the party studies the wards', starts: 'A clock disagreement, diagram or command sequence.' },
    'Seraphine Vey': { tier: 'Revelation', memory: 'Fragmented memory', enters: 'When an anchor is touched', starts: 'A warning, catastrophe image or explanation of the final cost.' },
  };
  const NPC_META = {
    'Elias Voss': { race: 'Human', image: 'assets/npcs/elias-voss-inn.png', alt: 'Elias Voss, an older human courier waiting with a warm mug at a roadside inn before the journey to Ashfall.' },
    'Mara Vale': { race: 'Hill dwarf', image: 'assets/npcs/mara-vale-scene.png', alt: 'Mara Vale, a hill dwarf innkeeper carrying a tray through the busy Lantern House.' },
    'Nessa Grey': { race: 'Halfling', image: 'assets/npcs/nessa-grey-scene.png', alt: 'Nessa Grey, a halfling child tying a promise thread around a carved wooden bird at a window.' },
    'Mayor Aldren Morn': { race: 'High elf', image: 'assets/npcs/mayor-aldren-morn-scene.png', alt: 'Mayor Aldren Morn, a high elf leaning over a tabletop model of Ashfall during a crisis.' },
    'Constable Iven Rook': { race: 'Half-orc', image: 'assets/npcs/constable-iven-rook-scene.png', alt: 'Constable Iven Rook, a half-orc investigator connecting evidence while writing in his surviving notebook.' },
    'Silas Wren': { race: 'Rock gnome', image: 'assets/npcs/silas-wren-scene.png', alt: 'Silas Wren, a rock gnome clockmaker repairing a vast mechanism from a ladder.' },
    'Seraphine Vey': { race: 'Tiefling', image: 'assets/npcs/seraphine-vey-scene.png', alt: 'Seraphine Vey, a fragmented tiefling ward-mage bracing one hand against a cracking mirror seal.' },
  };
  const SQUAD_MEMBERS = [
    {
      name: 'Rurik',
      portrait: { race: 'Mountain dwarf', image: 'assets/squad/rurik.png', alt: 'Rurik, a bearded mountain dwarf fighter carrying a round shield and a travel pack through a market town.', width: 1408, height: 768, position: 'center 38%' },
      identity: 'Mountain dwarf • Fighter 1 • Outlander',
      alignment: 'Neutral Good',
      summary: 'An exiled village champion hunting the fortune needed to recover a sacred statue and return home.',
      stats: [['AC', '17'], ['HP', '13'], ['Initiative', '+1'], ['Passive Perception', '13']],
      abilities: [['STR', '17', '+3'], ['DEX', '13', '+1'], ['CON', '16', '+3'], ['INT', '10', '+0'], ['WIS', '12', '+1'], ['CHA', '8', '−1']],
      attacks: [
        ['Warhammer · one hand', '+5 to hit', '1d8 + 3 bludgeoning'],
        ['Warhammer · two hands', '+5 to hit', '1d10 + 3 bludgeoning'],
        ['Handaxe', '+5 to hit', '1d6 + 3 slashing'],
      ],
      saves: ['Strength +5', 'Constitution +5', 'Dexterity +1', 'Intelligence +0', 'Wisdom +1', 'Charisma −1'],
      skills: ['Athletics +5', 'Perception +3', 'Survival +3', 'Intimidation +1', 'Acrobatics +1', 'Animal Handling +1', 'Arcana +0', 'Deception −1', 'History +0', 'Insight +1', 'Investigation +0', 'Medicine +1', 'Nature +0', 'Performance −1', 'Persuasion −1', 'Religion +0', 'Sleight of Hand +1', 'Stealth +1'],
      features: [
        ['Defense fighting style', '+1 AC while wearing armor; included in the sheet value above.'],
        ['Second Wind', 'Bonus action: regain 1d10 + 1 HP once per short rest.'],
        ['Darkvision', 'See in darkness out to 60 feet.'],
        ['Dwarven Resilience', 'Advantage on saves against poison and resistance to poison damage.'],
        ['Stonecunning', 'Use double proficiency (+4 total) on History checks about stonework.'],
        ['Wanderer', 'Recall general terrain and find food and water for Rurik and up to five others each day.'],
      ],
      proficiencies: ['Light, medium and heavy armor; shields', 'Simple and martial weapons', 'Smith’s tools (or brewer’s/mason’s tools)', 'One musical instrument', 'Common, Dwarvish and one Outlander language'],
      equipment: ['Chain mail', 'Shield', 'Warhammer', 'Two handaxes', 'Staff', 'Hunting trap', 'Animal trophy', 'Traveler’s clothes', 'Explorer’s pack', '10 gp'],
      roleplay: [
        ['Trait', 'I see maybe enemy, I hit head.'],
        ['Ideal', 'Go back to my hometown to drink again hot milk with my village in the mountain.'],
        ['Bond', 'An injury to the unspoiled wilderness of my home is an injury to me.'],
        ['Flaw', 'I am slow to trust members of other races, tribes, and societies, especially travelling merchants.'],
      ],
      story: 'Rurik lost his money, his house and the village’s sacred statue while gambling with a travelling merchant. Once the village’s champion against dangerous monsters, he insists the dice were rigged. He is exiled until he can earn enough to buy back the statue, return home and marry the village’s daughter.',
    },
    {
      name: 'Aldric the Vigilant',
      portrait: { race: 'Variant human', image: 'assets/squad/aldric-the-vigilant.png', alt: 'Aldric the Vigilant, a human paladin in dark red armor marked with a crescent, holding a rapier.', width: 1024, height: 1536, position: 'center 6%' },
      identity: 'Variant human • Paladin 3 • Oath of the Watchers',
      alignment: 'Neutral / morally grey',
      summary: 'A quick, watchful courier wearing a vanished hero’s armor and trying to live up to an oath that was never meant for him.',
      stats: [['AC', '19'], ['HP', '29*'], ['Initiative', '+8'], ['Passive Perception', '11']],
      statsNote: '* Use 25 HP instead if taking the fixed level-up average.',
      abilities: [['STR', '13', '+1'], ['DEX', '16', '+3'], ['CON', '12', '+1'], ['INT', '8', '−1'], ['WIS', '8', '−1'], ['CHA', '16', '+3']],
      attacks: [
        ['Rapier', '+5 to hit', '1d8 + 3 piercing; one-handed with shield'],
        ['Javelin', '+3 to hit', '1d6 + 1 piercing'],
        ['Divine Smite', 'On a melee hit', 'Spend a slot for +2d8 radiant; +3d8 against fiends or undead'],
      ],
      saves: ['Charisma +5', 'Strength +3', 'Dexterity +3', 'Constitution +1', 'Intelligence −1', 'Wisdom +1'],
      skills: ['Acrobatics +5', 'Stealth +5', 'Persuasion +5', 'Perception +1', 'Insight +1'],
      features: [
        ['Alert', '+5 initiative; cannot be surprised while conscious; unseen attackers gain no advantage merely for being unseen.'],
        ['Divine Sense', 'Action; 4 uses per long rest. Detect celestials, fiends, undead and consecrated or desecrated places within 60 feet when not behind total cover.'],
        ['Lay on Hands', '15 HP healing pool per long rest; spend 5 HP to cure one poison or disease.'],
        ['Defense fighting style', '+1 AC while wearing armor; included above.'],
        ['Divine Health', 'Immune to disease.'],
        ['Watcher’s Will', 'Channel Divinity action: Aldric and up to three creatures within 30 feet gain advantage on Intelligence, Wisdom and Charisma saves for 1 minute.'],
        ['Abjure the Extraplanar', 'Channel Divinity action: aberrations, celestials, elementals, fey and fiends within 30 feet make a Wisdom save; on failure they are turned for 1 minute or banished home if from another plane.'],
        ['Courier’s Route', 'Knows city streets, courier customs, reliable safehouses and how to move a package—or people—past trouble.'],
      ],
      proficiencies: ['All armor and shields', 'Simple and martial weapons', 'Cartographer’s tools and land vehicles', 'Common and Celestial', 'Spell save DC 13; spell attack +5', 'Proficiency bonus +2'],
      equipment: ['The vanished hero’s scale mail, shield and holy symbol', 'Rapier', 'Five javelins', 'Explorer’s pack', 'Cartographer’s tools', 'Courier satchel', 'Marked city map', 'Damaged delivery receipt'],
      spells: [
        ['Bless', 'Action • 30 ft. • concentration, 1 minute', 'Up to three creatures add 1d4 to attack rolls and saving throws.'],
        ['Command', 'Action • 60 ft. • 1 round', 'On a failed Wisdom save, the target follows a safe one-word command such as Drop, Flee or Halt.'],
        ['Cure wounds', 'Action • touch', 'Restore 1d8 + 3 HP.'],
        ['Shield of faith', 'Bonus action • 60 ft. • concentration, 10 minutes', 'One creature gains +2 AC.'],
        ['Alarm · oath', '1 minute • 30 ft. • 8 hours', 'Protect a door, window or area up to a 20-foot cube with an audible or mental alarm. Costs a spell slot.'],
        ['Detect magic · oath', 'Action • self • concentration, 10 minutes', 'Sense magic within 30 feet, see visible auras and learn the school of a visible effect.'],
      ],
      spellOptions: [
        ['Compelled duel', 'Challenge one creature to focus on Aldric.'], ['Detect evil and good', 'Sense certain supernatural creatures and consecrated or desecrated places.'], ['Detect poison and disease', 'Detect nearby poisons, poisonous creatures and diseases.'], ['Divine favor', 'Add radiant damage to weapon attacks while concentrating.'], ['Heroism', 'Grant temporary HP each turn and immunity to fear.'], ['Protection from evil and good', 'Protect an ally from several supernatural creature types.'], ['Purify food and drink', 'Cleanse nonmagical food and drink.'], ['Searing smite', 'Next melee hit adds fire damage and may keep burning.'], ['Thunderous smite', 'Next melee hit adds thunder damage and may push and knock prone.'], ['Wrathful smite', 'Next melee hit adds psychic damage and may frighten.'],
      ],
      roleplay: [
        ['Trait', 'I automatically plan the fastest exit from every room.'],
        ['Ideal', 'A promise to deliver something is a promise, even if the destination is hell.'],
        ['Bond', 'The missing hero’s god has given me a chance to set this right; I refuse to waste it.'],
        ['Flaw', 'When someone calls me “hero,” I worry they will ask a question I cannot answer.'],
      ],
      secrets: [
        ['True name', 'Rorik'],
        ['The lie', 'The city believes the hero left on their destined adventure. In truth, Rorik wore the hero’s armor and fled after a forbidden artifact turned their laboratory into a disaster site. He does not know whether the hero is dead, displaced, transformed, imprisoned—or watching.'],
        ['The oath', 'Do not invite the artifact’s corruption in, bargain with fiends or their servants, abandon people depending on you, or treat consequences as someone else’s problem.'],
      ],
      rest: ['Short rest: regain one use of Channel Divinity.', 'Long rest: restore HP, three 1st-level spell slots, Lay on Hands and Divine Sense; prepared paladin spells may change.'],
    },
    {
      name: 'Mictlantlique',
      portrait: { race: 'Reborn', image: 'assets/squad/mictlantlique-game.png', alt: 'Mictlantlique, a flower-crowned skeletal warlock in colorful teal, crimson, violet and gold pilgrim vestments, holding a lit red candle and rosary inside a warm medieval inn.', width: 1672, height: 941, position: 'center 42%' },
      identity: 'Reborn • Undead Warlock 3 • Pact of the Tome',
      alignment: 'Chaotic Neutral',
      summary: 'A cast-down minor deity following the only clue waiting beside the grave where she awoke: an invitation to the escort mission.',
      stats: [['AC', '13'], ['HP', '24'], ['Initiative', '+2'], ['Passive Perception', '12']],
      abilities: [['STR', '8', '−1'], ['DEX', '14', '+2'], ['CON', '15', '+2'], ['INT', '10', '+0'], ['WIS', '10', '+0'], ['CHA', '17', '+3']],
      attacks: [
        ['Eldritch blast', '+5 to hit', '1d10 + 3 force damage; no spell slot required.'],
        ['Toll the dead', 'Wisdom save DC 13', '1d8 necrotic, or 1d12 if the target is already missing HP.'],
        ['Dagger', '+4 to hit', '1d4 + 2 piercing.'],
      ],
      saves: ['Charisma +5', 'Wisdom +2', 'Dexterity +2', 'Constitution +2', 'Intelligence +0', 'Strength −1'],
      skills: ['Deception +5', 'Arcana +2', 'History +2', 'Insight +2', 'Perception +2', 'Religion +2'],
      features: [
        ['Deathless Nature', 'Advantage against disease and poison, resistance to poison damage, no need to eat, drink, breathe or sleep, and a motionless 4-hour rest provides a long rest.'],
        ['Knowledge from a Past Life', 'Twice per long rest, after failing an ability check, add 1d6 as a half-remembered prayer, name, sign or divine instinct.'],
        ['Pact Magic', 'Two 2nd-level spell slots, restored after a short or long rest. Charisma is the spellcasting ability.'],
        ['Form of Dread', 'Twice per long rest, use a bonus action for 1 minute: gain 1d10 + 3 temporary HP, become immune to fear and potentially frighten one target hit each turn.'],
        ['Book of Shadows', 'The escort invitation develops black margins and new pages. It holds thaumaturgy, mage hand and toll the dead.'],
        ['Agonizing Blast', 'Add Charisma modifier (+3) to each eldritch blast beam’s damage.'],
        ['Book of Ancient Secrets', 'The Book of Shadows is a ritual book beginning with detect magic and find familiar.'],
        ['Shelter of the Faithful', 'Temples may offer modest support to a recognized servant of the gods, though her cast-down status can make that recognition tense.'],
      ],
      proficiencies: ['Light armor', 'Simple weapons', 'Common, Celestial and two Acolyte languages', 'Spell save DC 13; spell attack +5', 'Proficiency bonus +2'],
      equipment: ['Leather armor', 'Dagger', 'Cracked bead arcane focus', 'Scholar’s pack', 'Silent holy symbol', 'Vestments and prayer book', 'Five sticks of incense', 'Common clothes', '15 gp', 'Invitation / Book of Shadows', 'Sealed vial of grave soil'],
      spells: [
        ['Eldritch blast · cantrip', 'Action • spell attack', 'One beam for 1d10 + 3 force damage.'],
        ['Minor illusion · cantrip', 'Action • 1 minute', 'Create a sound or a motionless image inside a 5-foot cube.'],
        ['Thaumaturgy · tome cantrip', 'Action • up to 1 minute', 'Create a minor supernatural sign such as a booming voice, altered flame or harmless tremor.'],
        ['Mage hand · tome cantrip', 'Action • 1 minute', 'A spectral hand manipulates an object weighing up to 10 pounds.'],
        ['Toll the dead · tome cantrip', 'Action • Wisdom save', 'Deal 1d8 necrotic, or 1d12 if the target is wounded.'],
        ['Armor of Agathys', 'Action • 1 hour', 'At 2nd level gain 10 temporary HP; melee attackers take 10 cold damage while those HP remain.'],
        ['Cause fear', 'Action • concentration, 1 minute', 'One creature makes a Wisdom save or becomes frightened.'],
        ['Hex', 'Bonus action • concentration, 1 hour', 'Add 1d6 necrotic damage when hitting the target and hinder checks with one chosen ability.'],
        ['Misty step', 'Bonus action • self', 'Teleport up to 30 feet to a visible unoccupied space.'],
        ['Detect magic · ritual', '10-minute ritual', 'Sense magic and see magical auras without spending a spell slot.'],
        ['Find familiar · ritual', '70-minute ritual', 'Summon a spirit companion in a normal familiar form.'],
      ],
      magicSummary: '2 slots • 4 known • 5 cantrips',
      spellSectionTitle: 'Pact magic, cantrips and rituals',
      roleplay: [
        ['Trait', 'I still expect doors to open for me, then remember that I am no longer anyone important.'],
        ['Ideal', 'The dead deserve dignity; the gods must also be accountable for what they do with them.'],
        ['Bond', 'I will learn why a dead gravedigger held this invitation when I woke, even if the answer condemns me.'],
        ['Flaw', 'I treat every kindness from a god as a bargain with unseen terms.'],
      ],
      secrets: [
        ['Former existence', 'Mictlantlique remembers that she was once a minor god, but not her divine office or why the greater gods cast her down.'],
        ['Grave awakening', 'She first became aware inside a skeleton’s body beside an opened grave and a dead gravedigger holding the escort invitation.'],
        ['Unknown patron', 'Her deathly power may be a remnant of divinity, a bargain from the gods, or an opportunistic being exploiting her fall.'],
      ],
      rest: ['Short rest: restore both 2nd-level Pact Magic slots.', 'Long rest: restore both slots, Form of Dread uses and Knowledge from a Past Life uses; four hours of motionless inactivity is enough.'],
    },
  ];
  const SQUAD_SCENE = { race: 'Escort departure', image: 'assets/squad/squad-preparing-carriage.png', alt: 'Rurik, Aldric and Mictlantlique preparing a horse-drawn carriage outside the roadside inn at dawn while Elias checks the route in the background.', width: 1672, height: 941 };
  const TRACKS = {
    bond: { label: 'Bond', sublabel: 'relationships', color: 'teal', max: 8 },
    truth: { label: 'Truth', sublabel: 'understanding', color: 'amber', max: 8 },
    fracture: { label: 'Fracture', sublabel: 'entity foothold', color: 'rose', max: 8 },
  };
  const ABILITIES = [
    { short: 'STR', name: 'Strength', summary: 'Raw physical power', use: 'Lift, break, shove, climb or hold something heavy.', save: 'Resist being pushed, restrained or physically overpowered.' },
    { short: 'DEX', name: 'Dexterity', summary: 'Agility and precision', use: 'Move quietly, balance, react quickly or work with careful hands.', save: 'Dodge explosions, traps and other sudden area effects.' },
    { short: 'CON', name: 'Constitution', summary: 'Health and endurance', use: 'Endure exhaustion, poison, harsh weather or prolonged effort. Constitution checks are uncommon.', save: 'Resist poison, disease and effects that assault the body.' },
    { short: 'INT', name: 'Intelligence', summary: 'Learning and reasoning', use: 'Recall lore, investigate clues or understand magic and nature.', save: 'Resist effects that attack thought, memory or logic.' },
    { short: 'WIS', name: 'Wisdom', summary: 'Awareness and intuition', use: 'Notice danger, read people, tend wounds or navigate the wild.', save: 'Resist fear, charms and effects that twist perception or will.' },
    { short: 'CHA', name: 'Charisma', summary: 'Presence and force of personality', use: 'Persuade, deceive, intimidate, perform or project confidence.', save: 'Resist effects that overwhelm or displace your sense of self.' },
  ];
  const SKILL_GROUPS = [
    { ability: 'Strength', short: 'STR', skills: [
      ['Athletics', 'Climb, swim, jump, grapple, shove or force something with trained physical effort.'],
    ] },
    { ability: 'Dexterity', short: 'DEX', skills: [
      ['Acrobatics', 'Keep your balance, tumble, land safely or escape a physical hold.'],
      ['Sleight of Hand', 'Pick a pocket, conceal an object or perform precise hand work unnoticed.'],
      ['Stealth', 'Hide, move silently or avoid being noticed.'],
    ] },
    { ability: 'Intelligence', short: 'INT', skills: [
      ['Arcana', 'Recall lore about magic, spells, magical creatures, planes or symbols.'],
      ['History', 'Recall past events, cultures, wars, people, places or old customs.'],
      ['Investigation', 'Search methodically, connect clues and work out how something fits together.'],
      ['Nature', 'Recall lore about animals, plants, terrain, weather and the natural world.'],
      ['Religion', 'Recall lore about gods, rites, holy symbols, undead and religious traditions.'],
    ] },
    { ability: 'Wisdom', short: 'WIS', skills: [
      ['Animal Handling', 'Calm, guide, control or understand a domesticated or frightened animal.'],
      ['Insight', 'Read body language, motives, mood or whether someone seems sincere. It is not mind reading.'],
      ['Medicine', 'Stabilize a dying creature, assess an injury or recognize an illness.'],
      ['Perception', 'Notice something with your senses: a sound, movement, hidden creature or obvious clue.'],
      ['Survival', 'Track, navigate, forage, predict weather or recognize hazards in the wild.'],
    ] },
    { ability: 'Charisma', short: 'CHA', skills: [
      ['Deception', 'Mislead someone through a lie, disguise, omission or convincing false behavior.'],
      ['Intimidation', 'Influence someone through threats, pressure or a frightening presence.'],
      ['Performance', 'Entertain or hold an audience with music, acting, dance, storytelling or spectacle.'],
      ['Persuasion', 'Influence someone honestly through tact, reason, empathy or good faith.'],
    ] },
  ];
  const MAP_LOCATIONS = [
    {
      id: 'lantern-house', name: 'Lantern House', playerName: 'Inn', playerSubtitle: 'A warm place to rest', subtitle: 'Mara’s inn • party base', x: 33, y: 29, accent: 'amber',
      immediate: 'The untouched place setting.', deeper: 'Dream journals beneath the floor.', complication: 'The evening fire may start.', relationship: 'Help Mara face what happened to her son.',
    },
    {
      id: 'saint-orras-church', name: 'Saint Orra’s Church', playerName: 'Church', playerSubtitle: 'The village church', subtitle: 'Route to the finale', x: 62, y: 29, accent: 'teal',
      immediate: 'Thirteen bell strokes.', deeper: 'The sealed stair and warnings from Seraphine’s echo.', complication: 'Aldren detains someone he believes is a threat.', relationship: 'Prove that recurring fear does not make repeated harm necessary.',
    },
    {
      id: 'cemetery', name: 'Cemetery', playerName: 'Cemetery', playerSubtitle: 'Old village graves', subtitle: 'Proof of the village’s death', x: 82, y: 49, accent: 'violet',
      immediate: 'Names appear at midnight.', deeper: 'Real remains lie beneath the reconstructed graves.', complication: 'False voices use the dead.', relationship: 'Treat Nessa as a person rather than evidence.',
    },
    {
      id: 'clockmakers-house', name: 'Clockmaker’s House', playerName: 'Clockmaker', playerSubtitle: 'A house full of clocks', subtitle: 'The magical explanation', x: 27, y: 58, accent: 'amber',
      immediate: 'Clocks show different moments of the same day.', deeper: 'Silas’s diagrams of the crystal.', complication: 'Silas may burn his work.', relationship: 'Help him admit his part in Seraphine’s sacrifice.',
    },
    {
      id: 'mayors-manor', name: 'Mayor’s Manor', playerName: 'Manor', playerSubtitle: 'The mayor’s home', subtitle: 'Records and portraits', x: 68, y: 69, accent: 'rose',
      immediate: 'Ledgers end 307 years ago.', deeper: 'Portraits show Elias with earlier parties.', complication: 'Iven arrives.', relationship: 'Give Iven a test the next reset can verify.',
    },
    {
      id: 'the-hollow', name: 'The Hollow', playerName: 'Forest hollow', playerSubtitle: 'A dark place beyond the trees', subtitle: 'Contact with Seraphine', x: 87, y: 17, accent: 'violet',
      immediate: 'Sound disappears.', deeper: 'The catastrophe and previous loops can be heard.', complication: 'Memories exchange between characters.', relationship: 'One of the clearest places for Seraphine’s genuine echo to manifest.',
    },
    {
      id: 'crystal-chest', name: 'The Crystal Chest', playerName: 'Chest', playerSubtitle: 'A guarded traveling chest', subtitle: 'A mobile mystery', x: 90, y: 83, accent: 'teal',
      immediate: 'Elias guards it.', deeper: 'Earlier witness echoes and the termination command.', complication: 'The entity can imitate those echoes.', relationship: 'Make Elias confront evidence that his merciful ending opens the prison.',
    },
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function slugify(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const CHARACTER_SLUGS = new Set(NPC_NAMES.map(slugify));

  function hashForView(view) {
    if (view.startsWith('section:')) {
      const slug = view.slice('section:'.length);
      const group = CHARACTER_SLUGS.has(slug) ? 'character' : 'guide';
      return `#/${group}/${encodeURIComponent(slug)}`;
    }
    return `#/${ROUTE_BY_VIEW[view] || ROUTE_BY_VIEW.desk}`;
  }

  function viewFromHash(hash = window.location.hash) {
    if (!hash) return null;
    try {
      const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
      if (parts.length === 1) return VIEW_BY_ROUTE[parts[0]] || null;
      if (parts.length !== 2 || !['character', 'guide'].includes(parts[0])) return null;
      const section = findSection(parts[1]);
      if (!section || (parts[0] === 'character' && !CHARACTER_SLUGS.has(section.slug))) return null;
      return `section:${section.slug}`;
    } catch (error) {
      return null;
    }
  }

  function syncHash(view, replace = false) {
    const nextHash = hashForView(view);
    if (window.location.hash === nextHash) return;
    try {
      window.history[replace ? 'replaceState' : 'pushState'](null, '', nextHash);
    } catch (error) {
      window.location.hash = nextHash;
    }
  }

  function loadState() {
    const base = {
      view: 'desk',
      loop: 1,
      bond: 0,
      truth: 0,
      fracture: 0,
      scene: '',
      prompt: 'What does the party want now?',
      promptIndex: 0,
      revelations: {},
      relationships: {},
      logs: [],
      finale: { ending: '', successes: 0, failures: 0, finalImage: '', notes: '' },
      dice: { expression: '1d20', last: null, history: [] },
      map: { selected: 'lantern-house' },
      encounters: {
        active: 'combat',
        combat: { round: 1, beat: 0, hound1: 7, hound2: 7, swarm: 10, decision: '' },
        cart: { calm: false, inspect: false, repair: false, complication: false, outcome: '' },
      },
      showSecrets: false,
    };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved) return base;
      return {
        ...base,
        ...saved,
        revelations: { ...base.revelations, ...(saved.revelations || {}) },
        relationships: { ...base.relationships, ...(saved.relationships || {}) },
        finale: { ...base.finale, ...(saved.finale || {}) },
        dice: { ...base.dice, ...(saved.dice || {}) },
        map: { selected: saved.map?.selected || base.map.selected, showDetails: false },
        encounters: {
          ...base.encounters,
          ...(saved.encounters || {}),
          combat: { ...base.encounters.combat, ...(saved.encounters?.combat || {}) },
          cart: { ...base.encounters.cart, ...(saved.encounters?.cart || {}) },
        },
      };
    } catch (error) {
      return base;
    }
  }

  function exportWorkspace() {
    const payload = {
      format: EXPORT_FORMAT,
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      workspace: state,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = payload.exportedAt.slice(0, 10);
    link.href = url;
    link.download = `ashfall-workspace-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast('Workspace exported. Keep the JSON file somewhere safe.');
  }

  function importWorkspace() {
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = 'application/json,.json';
    picker.addEventListener('change', async () => {
      const file = picker.files?.[0];
      if (!file) return;
      try {
        const payload = JSON.parse(await file.text());
        if (payload?.format !== EXPORT_FORMAT || payload?.version !== EXPORT_VERSION || !payload.workspace || Array.isArray(payload.workspace) || typeof payload.workspace !== 'object') {
          throw new Error('Unsupported Ashfall workspace file.');
        }
        if (!window.confirm('Import this Ashfall workspace? It will replace the tracker currently saved in this browser.')) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.workspace));
        state = loadState();
        render();
        showToast('Workspace imported. You are ready to continue.');
      } catch (error) {
        showToast(error instanceof SyntaxError ? 'That file is not valid JSON.' : error.message);
      }
    }, { once: true });
    picker.click();
  }

  let state = loadState();
  const initialRouteView = viewFromHash();
  if (initialRouteView) state.view = initialRouteView;
  let toastTimer;
  let portraitReturnFocus;

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* private browsing can block storage */ }
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function showStoryNotice() {
    const dialog = $('#story-notice');
    if (!dialog) return;
    try {
      if (localStorage.getItem(STORY_NOTICE_KEY) === 'true') return;
    } catch (error) {
      // The notice can still be shown if browser storage is unavailable.
    }
    dialog.showModal();
    requestAnimationFrame(() => $('#continue-story-notice')?.focus());
  }

  function closeStoryNotice(rememberChoice = false) {
    if (rememberChoice) {
      try { localStorage.setItem(STORY_NOTICE_KEY, 'true'); } catch (error) { /* storage may be unavailable */ }
    }
    $('#story-notice')?.close();
  }

  function findSection(titleOrSlug) {
    return CONTENT.sections.find(section => section.title === titleOrSlug || section.slug === titleOrSlug);
  }

  function findTable(header) {
    for (const section of CONTENT.sections) {
      const block = section.blocks.find(item => item.type === 'table' && item.rows[0]?.includes(header));
      if (block) return block;
    }
    return null;
  }

  function findTableInSection(section, header) {
    return section?.blocks.find(item => item.type === 'table' && item.rows[0]?.includes(header)) || null;
  }

  function blockText(block) {
    if (!block) return '';
    if (block.type === 'list') return block.items.join(' ');
    if (block.type === 'table') return block.rows.flat().join(' ');
    return block.text || '';
  }

  function sectionDescription(section) {
    const first = section?.blocks[0];
    if (first && first.type !== 'p' && first.type !== 'callout') return 'A working section from the Ashfall campaign guide.';
    return first ? blockText(first) : 'A working section from the Ashfall campaign guide.';
  }

  function getScenePrompts() {
    const table = findTableInSection(findSection('DM scene engine'), 'Question');
    if (!table) return ['What does the party want now?', 'Who resists them?', 'What changes if they succeed?'];
    return table.rows.slice(1).map(row => row[0]).filter(Boolean);
  }

  function parseDiceExpression(expression) {
    const normalized = String(expression || '').trim().replace(/\s+/g, '').toLowerCase();
    const match = normalized.match(/^(\d+)?d(\d+)(?:([+-])(\d+))?$/);
    if (!match) return { error: 'Use a format like d20, 2d6+3, or d8-1.' };
    const count = Number(match[1] || 1);
    const sides = Number(match[2]);
    const modifier = Number(match[4] || 0) * (match[3] === '-' ? -1 : 1);
    if (count < 1 || count > 50) return { error: 'Roll between 1 and 50 dice at a time.' };
    if (sides < 2 || sides > 1000) return { error: 'Dice must have between 2 and 1,000 sides.' };
    if (Math.abs(modifier) > 10000) return { error: 'Keep the modifier between −10,000 and +10,000.' };
    return { expression: normalized, count, sides, modifier };
  }

  function performDiceRoll(expression = state.dice.expression) {
    const parsed = parseDiceExpression(expression);
    if (parsed.error) { showToast(parsed.error); return; }
    const rolls = Array.from({ length: parsed.count }, () => Math.floor(Math.random() * parsed.sides) + 1);
    const total = rolls.reduce((sum, roll) => sum + roll, 0) + parsed.modifier;
    const result = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      expression: parsed.expression,
      rolls,
      modifier: parsed.modifier,
      total,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    state.dice = {
      expression: parsed.expression,
      last: result,
      history: [result, ...(state.dice.history || [])].slice(0, 16),
    };
    saveState();
    render();
    showToast(`${parsed.expression} rolled ${total}.`);
  }

  function setView(view, options = {}) {
    if (view !== 'map' || state.view !== 'map') state.map.showDetails = false;
    state.view = view;
    if (options.updateHash !== false) syncHash(view, options.replaceHash === true);
    saveState();
    render();
    const contentWrap = $('.content-wrap');
    if (contentWrap) contentWrap.scrollTop = 0;
    if (options.focus) $('#view').focus({ preventScroll: true });
    if (window.innerWidth <= 820) $('#sidebar').classList.remove('open');
  }

  function setGuideView(slug) {
    setView(`section:${slug}`);
  }

  function applyHashRoute() {
    const routedView = viewFromHash();
    if (!routedView) {
      syncHash(state.view, true);
      return;
    }
    if (routedView !== state.view) setView(routedView, { updateHash: false, focus: true });
  }

  function updateBreadcrumb() {
    const label = state.view === 'desk' ? 'Session desk'
      : state.view === 'map' ? 'Map'
        : state.view === 'readaloud' ? 'Read aloud'
          : state.view === 'dice' ? 'Dice roller'
            : state.view === 'cast' ? 'The cast'
              : state.view === 'squad' ? 'The squad'
                : state.view === 'finale' ? 'Finale'
                : state.view === 'tracker' ? 'Campaign tracker'
                  : state.view === 'encounters' ? 'Road to Ashfall'
                    : state.view === 'cheatsheet' ? 'D&D cheatsheet'
                    : findSection(state.view.replace('section:', ''))?.title || 'Guide';
    $('#breadcrumb').innerHTML = `<span class="breadcrumb-muted">ASHFALL</span><span class="breadcrumb-slash">/</span><span>${escapeHTML(label)}</span>`;
  }

  function renderGuideNav() {
    const nav = $('#guide-nav');
    const skip = new Set(['Campaign overview', 'Read-aloud descriptions', 'Campaign tracker', 'Loop and session log', 'Finale preparation sheet', 'Blank NPC record']);
    nav.innerHTML = CONTENT.sections
      .filter(section => !skip.has(section.title))
      .map(section => `
        <button class="nav-item ${state.view === `section:${section.slug}` ? 'active' : ''}" data-section="${escapeHTML(section.slug)}">
          <span class="nav-icon">·</span><span>${escapeHTML(section.title)}</span>
        </button>`).join('');
    $('#section-count').textContent = CONTENT.sections.length;
  }

  function renderTrackRows(compact = false) {
    return Object.entries(TRACKS).map(([key, track]) => {
      const value = Math.max(0, Number(state[key]) || 0);
      const width = Math.min(100, (value / track.max) * 100);
      return `<div class="track-row track-${key} track-${track.color} ${compact ? 'track-compact' : ''}">
        <div class="track-name">${track.label}<small>${track.sublabel}</small></div>
        <div class="track-bar"><div class="track-fill" style="width:${width}%"></div></div>
        <div class="track-value">${value}</div>
        ${compact ? '' : `<div class="track-buttons"><button type="button" data-track="${key}" data-delta="-1" aria-label="Decrease ${track.label}">−</button><button type="button" data-track="${key}" data-delta="1" aria-label="Increase ${track.label}">+</button></div>`}
      </div>`;
    }).join('');
  }

  function renderRail() {
    const scene = state.scene.trim() || 'No active scene yet.';
    const nextRevelationCount = Object.values(state.revelations).filter(Boolean).length;
    $('#rail-content').innerHTML = `
      <div class="rail-card">
        <span class="mini-label">Current loop</span>
        <h3>Loop ${escapeHTML(state.loop)}</h3>
        <p>${escapeHTML(scene)}</p>
        <div class="rail-divider"></div>
        <button class="button button-warm button-sm" type="button" data-action="next-loop">Begin next loop <span>↗</span></button>
      </div>
      <div class="rail-card">
        <span class="mini-label">Crystal imprints</span>
        <div class="mini-tracks">${renderTrackRows(true)}</div>
        <div class="rail-divider"></div>
        <p>${nextRevelationCount} essential revelation${nextRevelationCount === 1 ? '' : 's'} logged.</p>
      </div>
      <div class="rail-card">
        <span class="mini-label">Spoiler shield</span>
        <p>${state.showSecrets ? 'Secrets are visible. Turn the eye off before sharing your screen.' : 'Secrets are hidden. Reveal them when you need the deeper truth.'}</p>
        <button class="button button-sm" style="margin-top:12px" type="button" data-action="toggle-secrets">${state.showSecrets ? 'Hide secrets' : 'Reveal secrets'}</button>
      </div>`;
  }

  function renderHero() {
    return `<section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">THE DAY THAT REFUSES TO DIE</div>
        <h1>Tomorrow never comes to Ashfall.</h1>
        <p>Ashfall is a creepy time-loop mystery about memory, consent and the cost of mercy. Keep the truth close, let the players choose their route, and let every meaningful choice teach the crystal what this village could become.</p>
        <div class="hero-note">“There is no consequence-free ending.”</div>
      </div>
      <div class="hero-side">
        <div class="hero-status">
          <div class="hero-status-top"><span>Live session</span><span class="source-dot"></span></div>
          <strong>Loop ${escapeHTML(state.loop)}</strong>
          <small>${state.showSecrets ? 'Spoiler shield open' : 'Spoiler shield active'}</small>
        </div>
      </div>
    </section>`;
  }

  function renderDiceResult(result) {
    if (!result) {
      return `<div class="dice-result dice-empty"><span class="dice-empty-glyph">⚄</span><span>Roll a die to put a number on the table.</span></div>`;
    }
    const modifier = result.modifier ? ` ${result.modifier > 0 ? '+' : '−'} ${Math.abs(result.modifier)}` : '';
    return `<div class="dice-result has-roll">
      <div class="dice-result-top"><span>Last roll</span><span>${escapeHTML(result.time)}</span></div>
      <div class="dice-total">${escapeHTML(result.total)}</div>
      <div class="dice-equation"><code>${escapeHTML(result.expression)}</code><span>${result.rolls.map(roll => escapeHTML(roll)).join(' · ')}${escapeHTML(modifier)}</span></div>
    </div>`;
  }

  function renderDiceRoller(compact = false) {
    const history = (state.dice.history || []).slice(0, compact ? 4 : 16);
    return `<section class="card dice-card ${compact ? 'card-padded' : ''}">
      <div class="card-label"><span>Roll at the table</span><span>Offline</span></div>
      <div class="dice-heading-row"><div><h3 class="card-title">The dice are listening.</h3><p class="dice-subtitle">Use a quick preset or enter a full expression.</p></div><span class="dice-glyph" aria-hidden="true">⚄</span></div>
      <div class="dice-roll-form"><label for="dice-input">Expression</label><div class="dice-input-row"><input id="dice-input" class="dice-input" data-dice-input value="${escapeHTML(state.dice.expression || '1d20')}" spellcheck="false" aria-label="Dice expression" /><button class="button button-primary" type="button" data-action="roll-dice">Roll</button></div></div>
      <div class="dice-presets" aria-label="Dice presets">${['d4','d6','d8','d10','d12','d20','d100','2d6+3'].map(expression => `<button class="dice-preset" type="button" data-dice-expression="${expression}">${expression}</button>`).join('')}</div>
      ${renderDiceResult(state.dice.last)}
      ${history.length ? `<div class="dice-history-heading"><span>Recent rolls</span>${compact ? `<button class="text-button" type="button" data-view="dice">Open roller →</button>` : `<button class="text-button" type="button" data-action="clear-dice-history">Clear</button>`}</div><div class="dice-history">${history.map(result => `<button class="dice-history-item" type="button" data-dice-reroll="${escapeHTML(result.expression)}"><span><code>${escapeHTML(result.expression)}</code><small>${escapeHTML(result.time)}</small></span><strong>${escapeHTML(result.total)}</strong></button>`).join('')}</div>` : ''}
    </section>`;
  }

  function renderDicePage() {
    return `<div class="reference-header"><div><div class="eyebrow">RANDOMNESS WITHOUT LEAVING THE TABLE</div><h1>Dice roller</h1><p>Roll common D&D dice, enter expressions like <code>2d6+3</code>, and keep a small local history so the last result stays visible while you narrate.</p></div></div>
      <div class="dice-page-grid"><div>${renderDiceRoller(false)}</div><section class="card card-padded dice-guide-card"><div class="card-label"><span>Quick syntax</span><span>Examples</span></div><div class="dice-syntax-row"><code>d20</code><span>one twenty-sided die</span></div><div class="dice-syntax-row"><code>2d6+3</code><span>two six-sided dice, plus 3</span></div><div class="dice-syntax-row"><code>d8-1</code><span>one eight-sided die, minus 1</span></div><div class="rail-divider"></div><p>Results are generated in this browser only. They are not synced or sent anywhere.</p></section></div>`;
  }

  function renderCheatsheet() {
    const abilities = ABILITIES.map(ability => `<article class="ability-card">
      <div class="ability-badge">${ability.short}</div>
      <div><h3>${ability.name}</h3><p class="ability-summary">${ability.summary}</p><p><strong>Checks:</strong> ${ability.use}</p><p><strong>Saves:</strong> ${ability.save}</p></div>
    </article>`).join('');
    const skills = SKILL_GROUPS.map(group => `<section class="skill-group">
      <div class="skill-group-heading"><span>${group.short}</span><div><h2>${group.ability} skills</h2><p>Add your ${group.ability} modifier, plus proficiency if the skill is marked proficient.</p></div></div>
      <div class="skill-list">${group.skills.map(([name, description]) => `<div class="skill-row"><h3>${name}</h3><p>${description}</p></div>`).join('')}</div>
    </section>`).join('');
    return `<div class="reference-header rules-header"><div><div class="eyebrow">BEGINNER'S TABLE REFERENCE</div><h1>D&amp;D cheatsheet</h1><p>Start with what the character tries to do. The DM chooses the roll only when the outcome is uncertain and failure would matter.</p></div><div class="heading-actions"><button class="button button-primary button-sm" type="button" data-view="dice">Open dice roller →</button></div></div>
      <section class="rules-callout" aria-labelledby="d20-flow-heading">
        <div class="rules-callout-number">d20</div><div><h2 id="d20-flow-heading">The roll you will use most</h2><p><strong>Roll a d20 + the relevant ability modifier + your proficiency bonus if you are proficient.</strong> Compare the total with the Difficulty Class (DC). Meeting or beating the DC succeeds.</p><div class="roll-example"><span>Example</span><code>d20 + 3 Wisdom + 2 proficiency = Insight check</code></div></div>
      </section>
      <nav class="rules-jump" aria-label="Cheatsheet sections"><a href="#checks">Checks</a><a href="#abilities">Abilities</a><a href="#skills">Skills</a><a href="#combat">Combat</a><a href="#turns">Your turn</a></nav>
      <section class="rules-section" id="checks"><div class="rules-section-heading"><span>01</span><div><h2>How a check works</h2><p>Not every action needs a roll. Roll when the DM says the result is uncertain.</p></div></div>
        <div class="rule-step-grid"><article><span>1</span><h3>Describe the action</h3><p>Say what you want and how you attempt it. Do not lead with a skill name.</p></article><article><span>2</span><h3>DM chooses the roll</h3><p>The DM picks the ability or skill and sets a DC, usually from easy 10 to hard 20.</p></article><article><span>3</span><h3>Add the numbers</h3><p>Roll d20 + ability modifier. Add proficiency only when it applies.</p></article><article><span>4</span><h3>Resolve the result</h3><p>Total meets or beats the DC: success. Otherwise the DM describes the consequence.</p></article></div>
        <div class="rules-note-grid"><article><h3>Advantage</h3><p>Roll two d20s and use the higher result.</p></article><article><h3>Disadvantage</h3><p>Roll two d20s and use the lower result.</p></article><article><h3>Natural 20 / natural 1</h3><p>They automatically hit or miss on attack rolls. For checks and saves, the total normally still decides.</p></article><article><h3>Helping</h3><p>If the help is plausible, one character can often give another advantage. The DM decides.</p></article></div>
      </section>
      <section class="rules-section" id="abilities"><div class="rules-section-heading"><span>02</span><div><h2>The six abilities</h2><p>The big categories behind almost every d20 roll. The modifier—not the large score—is usually added to the roll.</p></div></div><div class="ability-grid">${abilities}</div></section>
      <section class="rules-section" id="skills"><div class="rules-section-heading"><span>03</span><div><h2>All eighteen skills</h2><p>A skill is a focused use of an ability. The DM can pair a skill with a different ability when the approach calls for it.</p></div></div><div class="skill-groups">${skills}</div><div class="rules-tip"><strong>No Constitution skills?</strong><span>Correct. Constitution checks use the Constitution modifier directly when the DM calls for one.</span></div></section>
      <section class="rules-section" id="combat"><div class="rules-section-heading"><span>04</span><div><h2>AC, attacks and damage</h2><p>Armor Class is the number an attack must meet or beat.</p></div></div>
        <div class="combat-formula"><span class="formula-label">Attack roll</span><code>d20 + attack bonus</code><span class="formula-compare">≥</span><code>target's AC</code><strong>Hit</strong></div>
        <div class="combat-grid"><article><h3>Armor Class (AC)</h3><p>AC represents how hard someone is to hit. Armor, a shield, Dexterity and magic may affect it. If the attack total equals the AC, the attack hits.</p></article><article><h3>Attack bonus</h3><p>Use the bonus printed beside the weapon or spell attack. For <code>Bite +4</code>, roll d20 + 4 against AC.</p></article><article><h3>Damage roll</h3><p>Roll damage only after a hit. <code>1d6+2</code> means one six-sided die plus 2. Damage reduces hit points; it is not compared with AC.</p></article><article><h3>Critical hit</h3><p>A natural 20 hits and doubles the attack's damage dice. Add flat modifiers once. A natural 1 automatically misses.</p></article><article><h3>Saving throw spell</h3><p>Some spells do not make an attack roll. The target rolls the named saving throw against the caster's save DC.</p></article><article><h3>Hit points (HP)</h3><p>HP measures how much harm a creature can keep fighting through. At 0 HP, player characters normally fall unconscious and make death saves.</p></article></div>
      </section>
      <section class="rules-section" id="turns"><div class="rules-section-heading"><span>05</span><div><h2>Combat round at a glance</h2><p>Initiative sets the order. On your turn, you can normally move and take one action.</p></div></div>
        <div class="turn-strip"><article><span>Start</span><h3>Initiative</h3><p>Roll d20 + Dexterity modifier. Highest total acts first.</p></article><article><span>Move</span><h3>Up to your speed</h3><p>30 feet is usually six 5-foot squares. Movement can be split around your action.</p></article><article><span>Act</span><h3>One action</h3><p>Attack, cast a spell, Dash, Disengage, Dodge, Help, Hide, Ready, Search or Use an Object.</p></article><article><span>If available</span><h3>Bonus action</h3><p>Only use one when a feature, spell or item specifically gives you one.</p></article><article><span>Off-turn</span><h3>Reaction</h3><p>One quick response to a trigger, such as an opportunity attack. It refreshes at the start of your turn.</p></article></div>
        <div class="rules-note-grid action-notes"><article><h3>Dash</h3><p>Gain extra movement equal to your speed.</p></article><article><h3>Disengage</h3><p>Your movement does not provoke opportunity attacks this turn.</p></article><article><h3>Dodge</h3><p>Attackers you can see have disadvantage against you; you gain advantage on Dexterity saves.</p></article><article><h3>Ready</h3><p>Choose a trigger and an action to take later using your reaction.</p></article></div>
      </section>
      <div class="source-footnote">Quick reference for standard D&amp;D 5e table play. A specific class feature, spell or DM ruling can override a general rule.</div>`;
  }

  function renderMap() {
    const selected = MAP_LOCATIONS.find(location => location.id === state.map.selected) || MAP_LOCATIONS[0];
    const safeMode = !state.map.showDetails;
    const selectedName = safeMode ? selected.playerName : selected.name;
    const selectedSubtitle = safeMode ? selected.playerSubtitle : selected.subtitle;
    const selectedDetail = safeMode
      ? `<div class="map-safe-panel"><span class="map-safe-icon">◉</span><strong>Player-safe map</strong><p>Location details are hidden until you choose to reveal the DM layer.</p><button class="button button-warm button-sm" type="button" data-action="reveal-map-details">Reveal DM details</button></div>`
      : `<div class="map-fact"><span>Immediate clue</span><strong>${escapeHTML(selected.immediate)}</strong></div>
          <div class="map-fact"><span>Deeper clue</span><strong>${escapeHTML(selected.deeper)}</strong></div>
          <div class="map-fact"><span>Complication</span><strong>${escapeHTML(selected.complication)}</strong></div>
          <div class="map-fact"><span>Relationship pressure</span><strong>${escapeHTML(selected.relationship)}</strong></div>`;
    return `<div class="reference-header map-header"><div><div class="eyebrow">ASHFALL • LOCATION TOOLKIT</div><h1>The village remembers.</h1><p>${safeMode ? 'A neutral village map for the players to explore. Click a landmark to identify where they are.' : 'Click a landmark to pull its immediate clue, deeper clue, complication and relationship pressure into view. The map is a visual aid; clues can move when the table needs them.'}</p></div><div class="heading-actions"><button class="button button-sm" type="button" data-action="reset-map">Reset selection</button>${safeMode ? '' : '<button class="button button-sm" type="button" data-action="hide-map-details">Hide DM details</button>'}</div></div>
      <div class="map-workspace">
        <section class="map-board card" aria-label="Interactive map of Ashfall">
          <img class="map-image" src="assets/ashfall-map.png" alt="Atmospheric illustrated map of the village of Ashfall" />
          <div class="map-vignette" aria-hidden="true"></div>
          <div class="map-markers">${MAP_LOCATIONS.map(location => { const markerName = safeMode ? location.playerName : location.name; return `<button class="map-marker ${state.map.selected === location.id ? 'selected' : ''} marker-${location.accent}" type="button" data-map-location="${location.id}" style="left:${location.x}%;top:${location.y}%" aria-label="${escapeHTML(markerName)}"><span class="map-marker-core">${state.map.selected === location.id ? '●' : '·'}</span><span class="map-marker-label">${escapeHTML(markerName)}</span></button>`; }).join('')}</div>
          ${safeMode ? '' : '<div class="map-key"><span><i class="key-dot key-amber"></i> village life</span><span><i class="key-dot key-teal"></i> crystal / ward</span><span><i class="key-dot key-violet"></i> memory / echo</span></div>'}
        </section>
        <aside class="map-detail card card-padded">
          <div class="card-label"><span>Selected location</span><span>${MAP_LOCATIONS.indexOf(selected) + 1} / ${MAP_LOCATIONS.length}</span></div>
          <div class="map-detail-heading"><span class="map-detail-icon marker-${selected.accent}">⌖</span><div><h2>${escapeHTML(selectedName)}</h2><p>${escapeHTML(selectedSubtitle)}</p></div></div>
          ${selectedDetail}
          <div class="map-detail-footer">${safeMode ? '<span>Safe to show players</span>' : `<button class="button button-primary button-sm" type="button" data-action="set-scene-location" data-location-name="${escapeHTML(selected.name)}">Set as scene focus</button><span>DM layer visible</span>`}</div>
        </aside>
      </div>`;
  }

  function renderDesk() {
    const quick = findSection('Quick start');
    const pacing = findSection('Player-paced story structure');
    const firstLoop = findSection('Running the first loop');
    const repeatingDay = findSection('The repeating day');
    const mustHappen = pacing?.blocks.find(block => block.type === 'h2' && block.text === 'What must happen eventually');
    const mustHappenIndex = pacing?.blocks.indexOf(mustHappen);
    const mustHappenList = pacing?.blocks[Number(mustHappenIndex) + 1];
    const revelations = findTable('Revelation');
    const prompts = getScenePrompts();
    const prompt = prompts[state.promptIndex % prompts.length] || state.prompt;
    const firstLoopTimeline = findTableInSection(firstLoop, 'Time');
    const schedule = findTableInSection(repeatingDay, 'Time');
    const scheduleRows = schedule?.rows.slice(1, 4) || [];
    const revealed = Object.values(state.revelations).filter(Boolean).length;
    const npcCount = Object.values(state.relationships).filter(item => item?.attitude || item?.note).length;

    return `${renderHero()}
      <div class="section-heading"><div><h2>Session desk</h2><p>Everything you need to make the next scene move.</p></div><div class="heading-actions"><button class="button button-primary" type="button" data-action="next-loop">↻ Start next loop</button><button class="button" type="button" data-action="toggle-secrets">${state.showSecrets ? '◉ Hide secrets' : '◉ Reveal secrets'}</button></div></div>
      <div class="desk-grid">
        <section class="card card-padded scene-card">
          <div class="card-label"><span>Scene focus</span><span>Loop ${escapeHTML(state.loop)}</span></div>
          <h3 class="card-title">What is happening right now?</h3>
          <textarea class="scene-input" data-state-text="scene" placeholder="e.g. The party is testing whether Aldren's ritual is necessary…">${escapeHTML(state.scene)}</textarea>
          <div class="card-footer"><span class="card-footer-note">Saved on this device</span><button class="button button-sm button-primary" type="button" data-action="save-scene">Save focus</button></div>
        </section>
        <section class="card track-card">
          <div class="card-label"><span>Crystal imprints</span><span>Live</span></div>
          ${renderTrackRows()}
          <div class="card-footer"><span class="card-footer-note">Award 1–2 for a major scene.</span><button class="button button-sm" type="button" data-action="reset-tracks">Reset tracks</button></div>
        </section>
      </div>
      <div class="dashboard-three">
        <section class="card metric-card"><span class="card-label">Loop memory</span><span class="metric">${escapeHTML(state.loop)}</span><p>Party + Elias: full. Nessa: partial. Villagers: emotion only.</p><div class="progress-dots">${Array.from({length: 5}, (_, index) => `<span class="progress-dot ${index < Math.min(5, state.loop) ? 'filled' : ''}"></span>`).join('')}</div></section>
        <section class="card metric-card"><span class="card-label">Revelations</span><span class="metric">${revealed}<span style="font-size:16px;color:var(--muted)"> / ${Math.max(0, (revelations?.rows.length || 1) - 1)}</span></span><p>Essential truths logged in the tracker.</p></section>
        <section class="card metric-card"><span class="card-label">NPC notes</span><span class="metric">${npcCount}<span style="font-size:16px;color:var(--muted)"> / 7</span></span><p>Relationships with emotional carryover.</p></section>
      </div>
      <section class="card card-padded first-loop-card">
        <div class="card-label"><span>${state.loop === 1 ? 'First loop • run this now' : 'First-loop reference'}</span><span>1:00 p.m. → 3:13 a.m.</span></div>
        <div class="first-loop-heading"><div><h3 class="card-title">Establish normal. Create one consequence. Erase it.</h3><p>The party can sleep: the Witness Crystal wakes every anchored identity automatically at 3:12 a.m.</p></div><button class="button button-primary" type="button" data-view="section:${slugify('Running the first loop')}">Open complete runner →</button></div>
        <div class="first-loop-strip">${(firstLoopTimeline?.rows.slice(1) || []).map(row => `<div class="first-loop-step"><span>${escapeHTML(row[0])}</span><strong>${escapeHTML(row[1])}</strong><small>${escapeHTML(row[2] || '')}</small></div>`).join('')}</div>
      </section>
      <div class="desk-grid" style="margin-top:14px">
        <div>${renderDiceRoller(true)}</div>
        <section class="card card-padded prompt-card dice-side-card"><div class="card-label"><span>Useful at a glance</span><span>D20 / D100</span></div><div class="prompt-text">Roll in the same window where you keep the scene. The last result stays visible while you describe what happens next.</div><div class="prompt-meta"><span>Supports d20, 2d6+3, d8−1 and more.</span><button class="text-button" type="button" data-view="dice">Open full roller →</button></div></section>
      </div>
      <div class="desk-grid" style="margin-top:14px">
        <section class="card card-padded prompt-card">
          <div class="card-label"><span>Scene engine</span><button class="button button-sm" type="button" data-action="next-prompt">Shuffle prompt</button></div>
          <div class="prompt-text">${escapeHTML(prompt)}</div>
          <div class="prompt-meta"><span>Use this when the table stalls.</span><span>${escapeHTML(state.promptIndex + 1)} / ${prompts.length}</span></div>
        </section>
        <section class="card card-padded prompt-card">
          <div class="card-label"><span>Next scheduled pressure</span><span>From the repeating day</span></div>
          <div class="quick-actions">${scheduleRows.map(row => `<button class="button button-sm" type="button" data-action="schedule-event" data-event="${escapeHTML(row.join(' — '))}">${escapeHTML(row[0])}</button>`).join('')}</div>
          <div class="prompt-meta"><span>${escapeHTML(scheduleRows[0]?.[1] || 'Advance an event when the party stalls.')}</span><button class="text-button" type="button" data-view="section:${slugify('The repeating day')}">Open schedule →</button></div>
        </section>
      </div>
      <div class="section-heading"><div><h2>Keep the spine visible</h2><p>${escapeHTML(sectionDescription(quick))}</p></div><button class="button" type="button" data-view="section:${slugify('Quick start')}">Open quick start →</button></div>
      <div class="card card-padded">
        <div class="card-label"><span>What must happen eventually</span><span>Do not hide these behind a roll</span></div>
        <div class="revelation-list">${(mustHappenList?.items || []).map(item => `<div class="check-row"><span style="color:var(--teal);font-size:13px">·</span><span>${escapeHTML(item)}</span></div>`).join('')}</div>
      </div>`;
  }

  function renderTable(block) {
    const rows = block.rows || [];
    if (!rows.length) return '';
    const header = rows[0];
    return `<div class="body-table-wrap"><table class="body-table"><thead><tr>${header.map(cell => `<th>${escapeHTML(cell)}</th>`).join('')}</tr></thead><tbody>${rows.slice(1).map(row => `<tr>${row.map(cell => `<td>${escapeHTML(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function renderBlock(block) {
    if (block.type === 'h2') return `<h2 class="${block.spoiler ? 'spoiler-heading' : ''}">${escapeHTML(block.text)}</h2>`;
    if (block.type === 'p') return `<p>${escapeHTML(block.text)}</p>`;
    if (block.type === 'list') return `<ul>${block.items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
    if (block.type === 'table') return renderTable(block);
    if (block.type === 'callout') return `<div class="body-callout ${block.variant === 'readaloud' ? 'readaloud' : ''}">${escapeHTML(block.text)}</div>`;
    return '';
  }

  function renderReference(section) {
    if (!section) return '<div class="empty-state"><strong>Section not found</strong>The guide could not find that section.</div>';
    const introBlock = section.blocks[0]?.type === 'p' || section.blocks[0]?.type === 'callout' ? section.blocks[0] : null;
    const introIndex = introBlock ? 0 : -1;
    const blocks = section.blocks.map((block, index) => {
      if (index === introIndex) return '';
      const content = renderBlock(block);
      if (!block.spoiler) return content;
      return `<div class="spoiler-block ${state.showSecrets ? '' : 'is-hidden'}"><div class="spoiler-content">${content}</div></div>`;
    }).join('');
    const npc = NPC_META[section.title];
    const dossierMeta = npc ? `<div class="npc-dossier-meta"><span>${escapeHTML(npc.race)}</span><span>NPC dossier</span></div>` : '';
    const portrait = npc ? `<button class="npc-dossier-portrait npc-portrait-trigger" type="button" data-portrait-name="${escapeHTML(section.title)}" aria-label="Show ${escapeHTML(section.title)} portrait full screen"><img src="${escapeHTML(npc.image)}" alt="${escapeHTML(npc.alt)}" width="1254" height="1254" /><span class="portrait-open-hint" aria-hidden="true">⛶ Show portrait</span></button>` : '';
    return `<div class="reference-header ${npc ? 'npc-reference-header' : ''}"><div><div class="eyebrow">GUIDE REFERENCE</div><h1>${escapeHTML(section.title)}</h1><p>${escapeHTML(sectionDescription(section))}</p>${dossierMeta}</div><div class="${npc ? 'npc-reference-side' : ''}"><div class="heading-actions"><button class="button button-sm" type="button" data-action="toggle-secrets">${state.showSecrets ? '◉ Hide secrets' : '◉ Reveal secrets'}</button></div>${portrait}</div></div>
      <div class="reference-body">${blocks}</div><div class="source-footnote">Pulled from <code>${escapeHTML(CONTENT.source)}</code>. Use the guide as a flexible toolkit: clues can move, loops do not need to be counted, and player choice sets the pace.</div>`;
  }

  function renderReadAloud() {
    const section = findSection('Read-aloud descriptions');
    const cards = [];
    let pendingTitle = '';
    (section?.blocks || []).forEach(block => {
      if (block.type === 'p' && block.text.startsWith('READ ALOUD')) pendingTitle = block.text.replace(/^READ ALOUD\s*[—-]?\s*/i, '');
      else if (block.type === 'callout') {
        cards.push(`<article class="readaloud-card"><h3>${escapeHTML(pendingTitle || 'Read aloud')}</h3><p>${escapeHTML(block.text)}</p><button class="button button-sm copy-readaloud" type="button" data-copy="${escapeHTML(block.text)}">Copy</button></article>`);
        pendingTitle = '';
      }
    });
    return `<div class="reference-header"><div><div class="eyebrow">TABLE-READY PROSE</div><h1>Read aloud</h1><p>Seven atmospheric entrances and thresholds. Copy a passage when the table reaches it, then get back to watching the players.</p></div><div class="heading-actions"><button class="button button-sm" type="button" data-view="section:${slugify('Read-aloud descriptions')}">Open full section →</button></div></div><div class="readaloud-list">${cards.join('')}</div>`;
  }

  function sectionGroups(section) {
    const groups = {};
    let active = '';
    (section?.blocks || []).forEach(block => {
      if (block.type === 'h2') { active = block.text; groups[active] = []; }
      else if (active) groups[active].push(block);
    });
    return groups;
  }

  function groupText(groups, name) {
    const blocks = groups[name] || [];
    return blocks.map(blockText).join(' ').trim();
  }

  function renderNpcCard(section) {
    const groups = sectionGroups(section);
    const playbook = NPC_PLAYBOOK[section.title] || { tier: 'Supporting', memory: 'No factual memory', enters: 'When useful', starts: 'A character-led complication.' };
    const npc = NPC_META[section.title];
    const role = section.blocks.find(block => block.type === 'p')?.text || '';
    const secret = groupText(groups, 'Hidden truth').replace(/^DM secret:?\s*/i, '');
    const atGlanceTable = section.blocks.find(block => block.type === 'table' && block.rows[0]?.includes('At a glance'));
    const wantsFearTable = section.blocks.find(block => block.type === 'table' && block.rows[0]?.includes('Wants'));
    const atGlance = atGlanceTable?.rows?.[1]?.join(' ') || role;
    const wantsFear = wantsFearTable?.rows?.[1] || [];
    const contribution = groups['Finale contribution'] ? groupText(groups, 'Finale contribution') : (section.blocks.find(block => block.type === 'callout')?.text || '');
    return `<article class="card npc-card">
      ${npc ? `<button class="npc-card-art npc-portrait-trigger" type="button" data-portrait-name="${escapeHTML(section.title)}" aria-label="Show ${escapeHTML(section.title)} portrait full screen"><img src="${escapeHTML(npc.image)}" alt="${escapeHTML(npc.alt)}" width="1254" height="1254" loading="lazy" /><span class="portrait-open-hint" aria-hidden="true">⛶ Show portrait</span></button>` : ''}
      <div class="npc-card-top"><div class="npc-badges">${npc ? `<span>${escapeHTML(npc.race)}</span>` : ''}<span>${escapeHTML(playbook.tier)}</span><span>${escapeHTML(playbook.memory)}</span></div><h3>${escapeHTML(section.title)}</h3><div class="npc-card-role">${escapeHTML(role)}</div></div>
      <div class="npc-card-body">
        <p>${escapeHTML(atGlance)}</p>
        <dl class="npc-facts">
          <div><dt>Bring in</dt><dd>${escapeHTML(playbook.enters)}</dd></div>
          <div><dt>Starts</dt><dd>${escapeHTML(playbook.starts)}</dd></div>
          <div><dt>Wants</dt><dd>${escapeHTML(wantsFear[0] || '—')}</dd></div>
          <div><dt>Fears</dt><dd>${escapeHTML(wantsFear[1] || '—')}</dd></div>
          <div class="${secret ? 'spoiler-block ' + (state.showSecrets ? '' : 'is-hidden') : ''}"><div class="spoiler-content"><dt>DM secret</dt><dd>${escapeHTML(secret || 'No secret recorded.')}</dd></div></div>
        </dl>
      </div>
      <div class="npc-card-footer"><button class="button button-sm" type="button" data-view="section:${escapeHTML(section.slug)}">Open dossier →</button></div>
    </article>`;
  }

  function renderCast() {
    const sections = NPC_NAMES.map(findSection).filter(Boolean);
    const handoff = [
      ['Enter', 'Elias'], ['Care', 'Mara'], ['Recognise', 'Nessa'], ['Prove', 'Iven'], ['Pressure', 'Aldren'], ['Understand', 'Silas'], ['Choose', 'Seraphine'],
    ];
    return `<div class="reference-header"><div><div class="eyebrow">WHO ACTS NEXT • WHAT THEY START • WHAT SURVIVES</div><h1>The cast</h1><p>Choose the character whose story job matches what the party needs now. Their dossier gives motive and secrets; the cards below tell you when to bring them in and which event they start.</p></div><div class="heading-actions"><button class="button button-sm" type="button" data-view="section:${slugify('NPC quick reference')}">Open full handoff →</button></div></div><div class="cast-handoff" aria-label="Character story handoff">${handoff.map(([stage,name], index) => `<div><span>${escapeHTML(stage)}</span><strong>${escapeHTML(name)}</strong>${index < handoff.length - 1 ? '<i>→</i>' : ''}</div>`).join('')}</div><div class="cast-grid">${sections.map(renderNpcCard).join('')}</div>`;
  }

  function renderSquadTagList(items, className = 'squad-tag-list') {
    return `<div class="${className}">${items.map(item => `<span>${escapeHTML(item)}</span>`).join('')}</div>`;
  }

  function renderSquadActions(items) {
    return `<div class="squad-action-list">${items.map(([name, roll, detail]) => `<article><div><strong>${escapeHTML(name)}</strong><span>${escapeHTML(roll)}</span></div><p>${escapeHTML(detail)}</p></article>`).join('')}</div>`;
  }

  function renderSquadFacts(items) {
    return `<dl class="squad-facts">${items.map(([label, detail]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(detail)}</dd></div>`).join('')}</dl>`;
  }

  function renderSquadMember(member, index) {
    const portrait = member.portrait;
    const portraitButton = `<button class="squad-portrait npc-portrait-trigger" type="button" data-portrait-name="${escapeHTML(member.name)}" aria-label="Show ${escapeHTML(member.name)} portrait full screen"><img src="${escapeHTML(portrait.image)}" alt="${escapeHTML(portrait.alt)}" width="${portrait.width}" height="${portrait.height}" loading="lazy" style="object-position:${escapeHTML(portrait.position)}" /><span class="portrait-open-hint" aria-hidden="true">⛶ Show portrait</span></button>`;
    if (member.pending) {
      return `<article class="card squad-profile squad-profile-empty" id="squad-${slugify(member.name)}">
        ${portraitButton}
        <div class="squad-profile-main"><div class="squad-profile-heading"><div><span class="squad-number">0${index + 1}</span><div class="eyebrow">PLAYER CHARACTER</div><h2>${escapeHTML(member.name)}</h2><p class="squad-identity">${escapeHTML(member.identity)}</p></div></div><div class="squad-blank" aria-label="${escapeHTML(member.name)} character details"></div></div>
      </article>`;
    }
    const stats = `<div class="squad-stat-strip">${member.stats.map(([label, value]) => `<div><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`).join('')}</div>${member.statsNote ? `<p class="squad-stat-note">${escapeHTML(member.statsNote)}</p>` : ''}`;
    const abilities = `<div class="squad-ability-grid">${member.abilities.map(([name, score, modifier]) => `<div><span>${escapeHTML(name)}</span><strong>${escapeHTML(score)}</strong><small>${escapeHTML(modifier)}</small></div>`).join('')}</div>`;
    const features = `<div class="squad-feature-list">${member.features.map(([name, detail]) => `<article><strong>${escapeHTML(name)}</strong><p>${escapeHTML(detail)}</p></article>`).join('')}</div>`;
    const spells = member.spells ? `<details class="squad-detail"><summary><span>Magic</span><small>${escapeHTML(member.magicSummary || '3 slots • 4 prepared + 2 oath spells')}</small></summary><div class="squad-detail-body"><div class="squad-section-title"><span>${escapeHTML(member.spellSectionTitle || 'Prepared and oath spells')}</span><strong>Spell save DC 13</strong></div>${renderSquadActions(member.spells)}${member.spellOptions?.length ? `<div class="squad-subsection"><h3>Other 1st-level options</h3>${renderSquadActions(member.spellOptions.map(([name, detail]) => [name, 'Prepare after a long rest', detail]))}</div>` : ''}</div></details>` : '';
    const secrets = member.secrets ? `<div class="squad-secret spoiler-block ${state.showSecrets ? '' : 'is-hidden'}"><div class="spoiler-content"><div class="squad-section-title"><span>Private identity</span><strong>DM / player secret</strong></div>${renderSquadFacts(member.secrets)}</div></div>` : '';
    return `<article class="card squad-profile" id="squad-${slugify(member.name)}">
      ${portraitButton}
      <div class="squad-profile-main">
        <div class="squad-profile-heading"><div><span class="squad-number">0${index + 1}</span><div class="eyebrow">PLAYER CHARACTER</div><h2>${escapeHTML(member.name)}</h2><p class="squad-identity">${escapeHTML(member.identity)}</p></div></div>
        <p class="squad-summary">${escapeHTML(member.summary)}</p>
        ${stats}
        <details class="squad-detail" open><summary><span>Combat &amp; checks</span><small>At-table numbers</small></summary><div class="squad-detail-body"><div class="squad-section-title"><span>Ability scores</span><strong>${escapeHTML(member.alignment)}</strong></div>${abilities}<div class="squad-subsection"><h3>Attacks</h3>${renderSquadActions(member.attacks)}</div><div class="squad-check-columns"><section><h3>Saving throws</h3>${renderSquadTagList(member.saves)}</section><section><h3>Skills</h3>${renderSquadTagList(member.skills)}</section></div></div></details>
        <details class="squad-detail"><summary><span>Features &amp; proficiencies</span><small>What the character can do</small></summary><div class="squad-detail-body">${features}<div class="squad-subsection"><h3>Proficiencies &amp; languages</h3>${renderSquadTagList(member.proficiencies)}</div>${member.rest ? `<div class="squad-rest">${member.rest.map(item => `<p>${escapeHTML(item)}</p>`).join('')}</div>` : ''}</div></details>
        ${spells}
        <details class="squad-detail"><summary><span>Equipment &amp; roleplay</span><small>Inventory, hooks and history</small></summary><div class="squad-detail-body"><div class="squad-subsection"><h3>Equipment</h3>${renderSquadTagList(member.equipment)}</div>${renderSquadFacts(member.roleplay)}${member.story ? `<div class="squad-story"><span>Background story</span><p>${escapeHTML(member.story)}</p></div>` : ''}</div></details>
        ${secrets}
      </div>
    </article>`;
  }

  function renderSquad() {
    return `<div class="reference-header squad-header"><div><div class="eyebrow">PLAYER CHARACTERS • QUICK REFERENCE • TABLE READY</div><h1>The squad</h1><p>Keep the party’s portraits, combat numbers, abilities and roleplay hooks together before the road carries them into Ashfall.</p></div></div><button class="squad-group-scene npc-portrait-trigger" type="button" data-portrait-name="The squad" aria-label="Show the squad preparing the carriage full screen"><img src="${escapeHTML(SQUAD_SCENE.image)}" alt="${escapeHTML(SQUAD_SCENE.alt)}" width="${SQUAD_SCENE.width}" height="${SQUAD_SCENE.height}" /><span class="squad-group-caption"><small>ESCORT DEPARTURE</small><strong>Preparing the carriage</strong></span><span class="portrait-open-hint" aria-hidden="true">⛶ Show scene</span></button><nav class="squad-jump" aria-label="Squad members">${SQUAD_MEMBERS.map(member => `<button type="button" data-squad-target="squad-${slugify(member.name)}">${escapeHTML(member.name)}</button>`).join('')}</nav><div class="squad-list">${SQUAD_MEMBERS.map(renderSquadMember).join('')}</div>`;
  }

  function renderFinale() {
    const table = findTable('Ending');
    const endings = table?.rows.slice(1) || [];
    const selected = state.finale.ending;
    return `<div class="reference-header"><div><div class="eyebrow">THE CHOICE THAT CHANGES ASHFALL</div><h1>Finale</h1><p>There is no consequence-free ending. Use the tracks, the relationships and the players’ actual priorities to make the choice feel earned.</p></div><div class="heading-actions"><button class="button button-sm" type="button" data-view="section:${slugify('Possible endings')}">Open full endings section →</button></div></div>
      <div class="ending-grid">${endings.map((row, index) => {
        const key = slugify(row[0]);
        return `<article class="ending-card ${selected === key ? 'selected' : ''}" data-ending="${escapeHTML(key)}"><div class="ending-radio">●</div><h3>${escapeHTML(row[0])}</h3><p>${escapeHTML(row[1] || '')}</p></article>`;
      }).join('')}</div>
      <div class="finale-board">
        <section class="card challenge-card"><div class="card-label"><span>Ritual challenge</span><span>Live tally</span></div><h3 class="card-title">Three successes before three failures</h3><p style="margin:7px 0 0;color:var(--muted);font-size:12px">“Give Ashfall a future” requires four successes. Truth adjusts the starting DC; Bond and Fracture change the help and complications.</p><div class="success-failure"><div class="challenge-count success"><span class="mini-label">Successes</span><strong>${state.finale.successes}</strong><div class="quick-actions"><button class="button button-sm" type="button" data-finale-delta="successes:-1">−</button><button class="button button-sm" type="button" data-finale-delta="successes:1">+</button></div></div><div class="challenge-count failure"><span class="mini-label">Failures</span><strong>${state.finale.failures}</strong><div class="quick-actions"><button class="button button-sm" type="button" data-finale-delta="failures:-1">−</button><button class="button button-sm" type="button" data-finale-delta="failures:1">+</button></div></div></div><textarea class="finale-log" data-finale-text="notes" placeholder="Ritual consequences, promises, sacrifices…">${escapeHTML(state.finale.notes)}</textarea></section>
        <section class="card challenge-card"><div class="card-label"><span>Final image</span><span>Last line / sound</span></div><textarea class="finale-log" style="min-height:150px" data-finale-text="finalImage" placeholder="What does the table see when the ending lands?">${escapeHTML(state.finale.finalImage)}</textarea><div class="card-footer" style="margin-top:12px"><span class="card-footer-note">Make the cost visible.</span><button class="button button-sm button-primary" type="button" data-action="save-finale">Save ending notes</button></div></section>
      </div>`;
  }

  function renderTracker() {
    const revelations = findTable('Revelation');
    const relationshipTable = findTable('NPC');
    const revelationRows = revelations?.rows.slice(1) || [];
    const relationshipRows = relationshipTable?.rows.slice(1).filter(row => row[0] && NPC_NAMES.includes(row[0])) || NPC_NAMES.map(name => [name]);
    const logs = state.logs.length ? state.logs : [{ loop: state.loop, objective: '', discovery: '', npc: '', imprint: '' }];
    return `<div class="reference-header"><div><div class="eyebrow">MEMORY THAT SURVIVES THE RESET</div><h1>Campaign tracker</h1><p>Keep the campaign’s durable state in one place: major revelations, emotional carryover, loop history and the final choice.</p></div><div class="heading-actions workspace-actions"><button class="button button-sm" type="button" data-action="export-workspace">Export</button><button class="button button-sm" type="button" data-action="import-workspace">Import</button><button class="button button-sm button-danger" type="button" data-action="clear-workspace">Clear workspace</button></div></div>
      <div class="tracker-grid">
        <section class="card tracker-section"><h3>Essential revelations</h3><p>Do not hide these behind a roll. Check them when the players have credible evidence.</p><div class="revelation-list">${revelationRows.map((row, index) => { const key = `revelation-${index}`; return `<label class="check-row"><input type="checkbox" data-revelation="${key}" ${state.revelations[key] ? 'checked' : ''} /><span><strong>${escapeHTML(row[0])}</strong>${row[1] ? ` — ${escapeHTML(row[1])}` : ''}</span></label>`; }).join('')}</div></section>
        <section class="card tracker-section"><h3>NPC relationships</h3><p>Emotional carryover is the part of the loop that should feel alive.</p><div class="relationship-grid">${relationshipRows.map(row => { const name = row[0]; const item = state.relationships[name] || {}; return `<div class="relationship-row"><strong>${escapeHTML(name)}</strong><select data-relationship="${escapeHTML(name)}" data-relationship-field="attitude"><option value="" ${!item.attitude ? 'selected' : ''}>Choose attitude</option><option ${item.attitude === 'trusting' ? 'selected' : ''}>trusting</option><option ${item.attitude === 'uncertain' ? 'selected' : ''}>uncertain</option><option ${item.attitude === 'opposed' ? 'selected' : ''}>opposed</option><option ${item.attitude === 'changed' ? 'selected' : ''}>changed</option></select><input data-relationship="${escapeHTML(name)}" data-relationship-field="note" value="${escapeHTML(item.note || '')}" placeholder="Promise / carryover" /></div>`; }).join('')}</div></section>
        <section class="card tracker-section"><div class="card-label"><span>Loop and session log</span><button class="button button-sm" type="button" data-action="add-log">Add loop</button></div><p>Record what changed, not every event.</p><div class="tracker-table-wrap"><table class="log-table"><thead><tr><th>Loop</th><th>Party objective</th><th>Key discovery</th><th>NPC change</th><th>Crystal imprint</th></tr></thead><tbody>${logs.map((log, index) => `<tr><td><input type="number" min="1" data-log="${index}" data-log-field="loop" value="${escapeHTML(log.loop || state.loop)}" /></td><td><input data-log="${index}" data-log-field="objective" value="${escapeHTML(log.objective || '')}" /></td><td><input data-log="${index}" data-log-field="discovery" value="${escapeHTML(log.discovery || '')}" /></td><td><input data-log="${index}" data-log-field="npc" value="${escapeHTML(log.npc || '')}" /></td><td><input data-log="${index}" data-log-field="imprint" value="${escapeHTML(log.imprint || '')}" /></td></tr>`).join('')}</tbody></table></div></section>
        <section class="card tracker-section"><h3>Unresolved threads</h3><p>Leave yourself a hook for the next time the party looks away.</p><div class="revelation-list">${['What does Elias do next?', 'Which NPC is closest to breaking?', 'What clue moved location?', 'What does the crystal want to show?'].map((label, index) => `<label><span class="mini-label">${escapeHTML(label)}</span><input class="tracker-input" data-thread="${index}" value="${escapeHTML(state.threads?.[index] || '')}" placeholder="Write a one-line hook…" /></label>`).join('')}</div></section>
      </div>`;
  }

  function renderEnemy(name, key, hp, max, ac, attack) {
    const stateLabel = hp <= 0 ? 'Defeated / fled' : hp <= Math.ceil(max / 2) ? 'Bloodied' : 'Ready';
    return `<div class="enemy-row ${hp <= 0 ? 'enemy-down' : ''}"><div class="enemy-info"><strong>${name}</strong><span>AC ${ac} • ${attack}</span></div><div class="enemy-state"><span>${stateLabel}</span><strong>${hp}/${max} HP</strong></div><div class="hp-controls"><button type="button" data-encounter-hp="${key}" data-delta="-1" aria-label="Damage ${name}">−</button><button type="button" data-encounter-hp="${key}" data-delta="1" aria-label="Heal ${name}">+</button></div></div>`;
  }

  function renderCombatEncounter() {
    const combat = state.encounters.combat;
    const beats = [
      { label: 'Beat 1 • Test the edges', prompt: 'Have the hounds circle and threaten whoever stands apart. Telegraph their intent before they bite.', question: 'Who protects the vulnerable character, and how?' },
      { label: 'Beat 2 • Split attention', prompt: 'The cinder swarm crawls toward dropped gear, a waterskin or the campfire. Make the environment matter.', question: 'Do they spend actions controlling the swarm or keep attacking?' },
      { label: 'Beat 3 • Offer the exit', prompt: 'When two enemies are bloodied, show their nerve breaking. Water, sand, a cloak or a forceful threat can end the fight.', question: 'Do they pursue, spare, capture or drive the creatures off?' },
    ];
    const beat = beats[Math.min(combat.beat, beats.length - 1)];
    const activeEnemies = [combat.hound1, combat.hound2, combat.swarm].filter(hp => hp > 0).length;
    return `<section class="encounter-runner encounter-combat"><div class="runner-top"><div><div class="card-label"><span>COMBAT • ROUND ${combat.round}</span><span>${activeEnemies} ACTIVE</span></div><h2>Ash on the Road</h2><p>Use the current beat as guidance, then follow the players’ choices.</p></div><button class="button button-sm" type="button" data-action="reset-combat">Reset fight</button></div>
      <div class="runner-grid"><div class="runner-main">
        <div class="encounter-readaloud"><span class="mini-label">Opening read aloud</span><p>The road dips between black-barked trees. A grey animal steps out of the ash ahead, its paws making no sound. A second shape circles behind you. When the wind shifts, the creatures’ ribs glow like banked coals—and something small and bright skitters through the dust at your feet.</p></div>
        <div class="beat-card"><div class="beat-progress">${beats.map((item, index) => `<span class="${index === combat.beat ? 'current' : index < combat.beat ? 'done' : ''}">${index + 1}</span>`).join('')}</div><span class="mini-label">${beat.label}</span><h3>${beat.prompt}</h3><p>${beat.question}</p><div class="runner-actions"><button class="button button-primary" type="button" data-action="next-combat-beat">${combat.beat < 2 ? 'Advance to next beat →' : 'Keep this decision visible'}</button><button class="button" type="button" data-action="next-combat-round">Next round</button></div></div>
        <div class="decision-panel"><span class="mini-label">How does the party resolve it?</span><div class="decision-buttons">${[['force','Fight to the end'],['mercy','Drive them off'],['capture','Capture one'],['retreat','Party retreats']].map(([key,label]) => `<button type="button" class="decision-button ${combat.decision === key ? 'selected' : ''}" data-encounter-decision="${key}">${label}</button>`).join('')}</div>${combat.decision ? `<div class="decision-result">${combat.decision === 'force' ? 'Reward: a warm glassy tooth. Keep it a mundane omen.' : combat.decision === 'mercy' ? 'Reward: a Bond-leaning character moment for choosing restraint.' : combat.decision === 'capture' ? 'The creature is frightened, not intelligent; it avoids living green plants.' : 'Let them regroup. The hounds do not pursue beyond the black-barked trees.'}</div>` : ''}</div>
      </div><aside class="runner-side"><div class="side-heading"><span class="mini-label">Enemy board</span><span>Tap − for damage</span></div>${renderEnemy('Ash-hound 1','hound1',combat.hound1,7,12,'bite +4 • 1d6+2')}${renderEnemy('Ash-hound 2','hound2',combat.hound2,7,12,'bite +4 • 1d6+2')}${renderEnemy('Cinder swarm','swarm',combat.swarm,10,11,'spray +3 • 1d4 fire')}<div class="tactics-note"><strong>Behaviour, not a script</strong><p>Hounds isolate. The swarm threatens objects. All three flee when the pack loses confidence.</p></div></aside></div></section>`;
  }

  function renderCartEncounter() {
    const cart = state.encounters.cart;
    const completed = ['calm', 'inspect', 'repair'].filter(key => cart[key]).length;
    const phase = completed === 0 ? ['Start with pressure','Orin talks too quickly and the mule trembles. Ask who approaches first.'] : completed < 3 ? ['Let everyone contribute','Call on a different character for the next useful approach. Failure adds motion, not a dead end.'] : ['Resolve the scene','Ask each player what small task their character chose, then select the lasting outcome.'];
    return `<section class="encounter-runner encounter-social"><div class="runner-top"><div><div class="card-label"><span>NON-COMBAT • GUIDED SCENE</span><span>${completed}/3 APPROACHES</span></div><h2>The Empty Cart</h2><p>Move from panic to understanding to repair. Every character can take a useful role.</p></div><button class="button button-sm" type="button" data-action="reset-cart">Reset scene</button></div>
      <div class="runner-grid"><div class="runner-main"><div class="encounter-readaloud"><span class="mini-label">Opening read aloud</span><p>A handcart sits crooked across the road. Its owner kneels beside one wheel, staring at the empty space where a wooden pin should be. A mule trembles in the traces. “I had it a moment ago,” he says. “I keep putting it down, and then it is gone.”</p></div>
        <div class="beat-card"><div class="social-progress"><span class="${completed >= 1 ? 'done' : 'current'}">Calm</span><span class="${completed >= 2 ? 'done' : completed === 1 ? 'current' : ''}">Notice</span><span class="${completed >= 3 ? 'done' : completed === 2 ? 'current' : ''}">Repair</span></div><span class="mini-label">DM prompt</span><h3>${phase[0]}</h3><p>${phase[1]}</p>${completed < 3 ? `<button class="button" type="button" data-action="cart-complication">${cart.complication ? 'Complication active: the cart is rolling' : 'On a failed roll: add complication'}</button>` : ''}${cart.complication ? '<div class="complication-note"><strong>Immediate pressure:</strong> the mule pulls free and the cart begins rolling downhill. Ask what each character does now.</div>' : ''}</div>
        <div class="approach-list">${[
          ['calm','Calm Orin and the mule','Animal Handling or Persuasion • DC 11','Orin admits he has not slept and can finally explain the route.'],
          ['inspect','Inspect the cart','Investigation or Perception • DC 12','The missing pin is caught in the torn blanket under the cart.'],
          ['repair','Repair or improvise','Survival, Sleight of Hand or tools • DC 12','A tent peg, dagger hilt or tied cord holds the wheel safely.'],
        ].map(([key,title,check,reveal]) => `<button type="button" class="approach-card ${cart[key] ? 'complete' : ''}" data-cart-check="${key}"><span class="approach-check">${cart[key] ? '✓' : '○'}</span><span><strong>${title}</strong><small>${check}</small><em>${cart[key] ? reveal : 'Tap when the party completes this approach.'}</em></span></button>`).join('')}</div>
      </div><aside class="runner-side"><span class="mini-label">Lasting outcome</span><div class="outcome-list">${[['help','Help without taking over','Directions, dried fruit and warm trust.'],['rush','Fix it, but frighten Orin','The cart is safe; Orin leaves wary.'],['leave','Leave him behind','No directions or ration bundle.']].map(([key,title,detail]) => `<button type="button" class="outcome-button ${cart.outcome === key ? 'selected' : ''}" data-cart-outcome="${key}"><strong>${title}</strong><span>${detail}</span></button>`).join('')}</div><div class="tactics-note"><strong>Keep it ordinary</strong><p>Exhaustion, a bent axle and a frightened mule explain everything. Orin knows no campaign secrets.</p></div></aside></div></section>`;
  }

  function renderEncounters() {
    const active = state.encounters.active;
    return `<div class="reference-header encounter-header"><div><div class="eyebrow">ENCOUNTER SET 01 • BEFORE ASHFALL</div><h1>Road to Ashfall</h1><p>Run both opening scenes from one guided board. Progress and choices stay saved in this browser.</p></div><div class="heading-actions"><button class="button button-sm" type="button" data-view="section:${slugify('First encounters on the road')}">Open full guide →</button></div></div><div class="encounter-switch" role="group" aria-label="Choose encounter"><button type="button" class="${active === 'combat' ? 'active' : ''}" data-encounter-view="combat"><span>⚔</span><strong>Ash on the Road</strong><small>Combat runner</small></button><button type="button" class="${active === 'cart' ? 'active' : ''}" data-encounter-view="cart"><span>◇</span><strong>The Empty Cart</strong><small>Decision guide</small></button></div>${active === 'combat' ? renderCombatEncounter() : renderCartEncounter()}`;
  }

  function renderCurrentView() {
    if (state.view === 'desk') return renderDesk();
    if (state.view === 'map') return renderMap();
    if (state.view === 'readaloud') return renderReadAloud();
    if (state.view === 'dice') return renderDicePage();
    if (state.view === 'cast') return renderCast();
    if (state.view === 'squad') return renderSquad();
    if (state.view === 'finale') return renderFinale();
    if (state.view === 'tracker') return renderTracker();
    if (state.view === 'encounters') return renderEncounters();
    if (state.view === 'cheatsheet') return renderCheatsheet();
    if (state.view.startsWith('section:')) return renderReference(findSection(state.view.replace('section:', '')));
    return renderDesk();
  }

  function render() {
    updateBreadcrumb();
    renderGuideNav();
    $$('.primary-nav .nav-item, .encounter-nav .nav-item, .rules-nav .nav-item').forEach(item => {
      const isActive = item.dataset.view === state.view;
      item.classList.toggle('active', isActive);
      if (isActive) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    if (state.view === 'encounters') $('#encounter-folder').open = true;
    $('#view').innerHTML = renderCurrentView();
    renderRail();
    const active = $('.nav-item.active');
    if (active && active.closest('.guide-nav')) active.scrollIntoView({ block: 'nearest' });
  }

  function updateTrack(key, delta) {
    state[key] = Math.max(0, Math.min(TRACKS[key].max, (Number(state[key]) || 0) + delta));
    saveState(); render();
  }

  function nextLoop() {
    const currentScene = state.scene.trim();
    if (currentScene) {
      state.logs = [...state.logs.filter(log => log.loop !== state.loop), { loop: state.loop, objective: currentScene, discovery: '', npc: '', imprint: `B${state.bond} T${state.truth} F${state.fracture}` }];
    }
    state.loop = Math.max(1, Number(state.loop) + 1);
    state.scene = '';
    saveState(); render();
    showToast(`Loop ${state.loop} begins. Ask what each player remembers most strongly.`);
  }

  function toggleSecrets() {
    state.showSecrets = !state.showSecrets;
    saveState(); render();
    showToast(state.showSecrets ? 'Spoiler shield lifted.' : 'Spoiler shield active.');
  }

  function copyText(text) {
    const value = String(text || '');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(value).then(() => showToast('Copied to clipboard.')).catch(() => showToast('Copy unavailable — select the passage manually.'));
    else showToast('Copy unavailable — select the passage manually.');
  }

  function openNpcPortrait(name, trigger) {
    const squadMember = SQUAD_MEMBERS.find(member => member.name === name);
    const npc = NPC_META[name] || squadMember?.portrait || (name === 'The squad' ? SQUAD_SCENE : null);
    const dialog = $('#npc-portrait-dialog');
    if (!npc || !dialog) return;
    $('#npc-portrait-image').src = npc.image;
    $('#npc-portrait-image').alt = npc.alt;
    $('#npc-portrait-title').textContent = name;
    $('#npc-portrait-race').textContent = npc.race;
    portraitReturnFocus = trigger;
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => $('#close-npc-portrait')?.focus());
  }

  function closeNpcPortrait() {
    const dialog = $('#npc-portrait-dialog');
    if (dialog?.open) dialog.close();
  }

  function doSearch(query) {
    const panel = $('#search-results-panel');
    const results = $('#search-results');
    const q = query.trim().toLowerCase();
    if (q.length < 2) { panel.hidden = true; return; }
    const found = [];
    CONTENT.sections.forEach(section => section.blocks.forEach(block => {
      const text = blockText(block);
      if (text.toLowerCase().includes(q) || section.title.toLowerCase().includes(q)) found.push({ section, block, text });
    }));
    $('#search-result-label').textContent = `${found.length} result${found.length === 1 ? '' : 's'} for “${query.trim()}”`;
    results.innerHTML = found.slice(0, 30).map((result, index) => `<button class="search-result" type="button" data-search-section="${escapeHTML(result.section.slug)}"><span class="search-result-location">${escapeHTML(result.section.title)}</span><span class="search-result-title">${result.block.spoiler && !state.showSecrets ? '<span class="search-result-lock">◉ </span>' : ''}${escapeHTML(result.block.type === 'h2' ? result.block.text : result.text.slice(0, 98))}</span><span class="search-result-preview">${result.block.spoiler && !state.showSecrets ? 'Hidden by spoiler shield' : escapeHTML(result.text.slice(0, 160))}</span></button>`).join('') || '<div class="empty-state" style="margin:8px">No matching passage.</div>';
    panel.hidden = false;
  }

  function handleClick(event) {
    const searchBox = event.target.closest('.search-box');
    if (searchBox && window.innerWidth <= 820 && !event.target.matches('input')) {
      event.preventDefault();
      searchBox.classList.add('search-open');
      $('#global-search').focus();
      return;
    }
    const portrait = event.target.closest('[data-portrait-name]');
    if (portrait) { openNpcPortrait(portrait.dataset.portraitName, portrait); return; }
    const squadTarget = event.target.closest('[data-squad-target]');
    if (squadTarget) { document.getElementById(squadTarget.dataset.squadTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const view = event.target.closest('[data-view]');
    if (view) { setView(view.dataset.view); return; }
    const section = event.target.closest('[data-section]');
    if (section) { setGuideView(section.dataset.section); return; }
    const result = event.target.closest('[data-search-section]');
    if (result) { $('#search-results-panel').hidden = true; $('#global-search').value = ''; setGuideView(result.dataset.searchSection); return; }
    const dicePreset = event.target.closest('[data-dice-expression]');
    if (dicePreset) { state.dice.expression = dicePreset.dataset.diceExpression; performDiceRoll(state.dice.expression); return; }
    const diceReroll = event.target.closest('[data-dice-reroll]');
    if (diceReroll) { state.dice.expression = diceReroll.dataset.diceReroll; performDiceRoll(state.dice.expression); return; }
    const mapLocation = event.target.closest('[data-map-location]');
    if (mapLocation) { state.map.selected = mapLocation.dataset.mapLocation; saveState(); render(); return; }
    const encounterView = event.target.closest('[data-encounter-view]');
    if (encounterView) { state.encounters.active = encounterView.dataset.encounterView; saveState(); render(); return; }
    const encounterHp = event.target.closest('[data-encounter-hp]');
    if (encounterHp) { const key = encounterHp.dataset.encounterHp; const max = key === 'swarm' ? 10 : 7; state.encounters.combat[key] = Math.max(0, Math.min(max, Number(state.encounters.combat[key]) + Number(encounterHp.dataset.delta))); saveState(); render(); return; }
    const encounterDecision = event.target.closest('[data-encounter-decision]');
    if (encounterDecision) { state.encounters.combat.decision = encounterDecision.dataset.encounterDecision; saveState(); render(); return; }
    const cartCheck = event.target.closest('[data-cart-check]');
    if (cartCheck) { const key = cartCheck.dataset.cartCheck; state.encounters.cart[key] = !state.encounters.cart[key]; saveState(); render(); return; }
    const cartOutcome = event.target.closest('[data-cart-outcome]');
    if (cartOutcome) { state.encounters.cart.outcome = cartOutcome.dataset.cartOutcome; saveState(); render(); return; }
    const track = event.target.closest('[data-track]');
    if (track) { updateTrack(track.dataset.track, Number(track.dataset.delta)); return; }
    const action = event.target.closest('[data-action]');
    if (action) {
      const actionName = action.dataset.action;
      if (actionName === 'next-loop') nextLoop();
      if (actionName === 'toggle-secrets') toggleSecrets();
      if (actionName === 'next-prompt') { state.promptIndex += 1; state.prompt = getScenePrompts()[state.promptIndex % getScenePrompts().length]; saveState(); render(); }
      if (actionName === 'roll-dice') performDiceRoll($('.dice-input')?.value || state.dice.expression);
      if (actionName === 'clear-dice-history') { state.dice.history = []; state.dice.last = null; saveState(); render(); showToast('Dice history cleared.'); }
      if (actionName === 'reset-map') { state.map.selected = MAP_LOCATIONS[0].id; saveState(); render(); showToast('Map selection reset.'); }
      if (actionName === 'reveal-map-details') { state.map.showDetails = true; render(); showToast('DM map layer revealed.'); }
      if (actionName === 'hide-map-details') { state.map.showDetails = false; render(); showToast('Player-safe map restored.'); }
      if (actionName === 'set-scene-location') { state.scene = `At ${action.dataset.locationName}: `; saveState(); setView('desk'); showToast(`${action.dataset.locationName} set as the scene focus.`); }
      if (actionName === 'reset-tracks') { state.bond = 0; state.truth = 0; state.fracture = 0; saveState(); render(); showToast('Crystal imprints reset.'); }
      if (actionName === 'save-scene') { state.scene = $('.scene-input')?.value || ''; saveState(); renderRail(); showToast('Scene focus saved.'); }
      if (actionName === 'schedule-event') showToast(action.dataset.event || 'Advance a scheduled event.');
      if (actionName === 'add-log') { state.logs.push({ loop: state.loop, objective: '', discovery: '', npc: '', imprint: '' }); saveState(); render(); }
      if (actionName === 'save-finale') { saveState(); showToast('Finale notes saved.'); }
      if (actionName === 'next-combat-beat') { state.encounters.combat.beat = Math.min(2, state.encounters.combat.beat + 1); saveState(); render(); }
      if (actionName === 'next-combat-round') { state.encounters.combat.round += 1; saveState(); render(); }
      if (actionName === 'reset-combat') { state.encounters.combat = { round: 1, beat: 0, hound1: 7, hound2: 7, swarm: 10, decision: '' }; saveState(); render(); showToast('Combat runner reset.'); }
      if (actionName === 'cart-complication') { state.encounters.cart.complication = !state.encounters.cart.complication; saveState(); render(); }
      if (actionName === 'reset-cart') { state.encounters.cart = { calm: false, inspect: false, repair: false, complication: false, outcome: '' }; saveState(); render(); showToast('Cart scene reset.'); }
      if (actionName === 'export-workspace') exportWorkspace();
      if (actionName === 'import-workspace') importWorkspace();
      if (actionName === 'clear-workspace') { if (window.confirm('Clear the local Ashfall tracker? The guide content will remain.')) { localStorage.removeItem(STORAGE_KEY); state = loadState(); render(); showToast('Workspace cleared.'); } }
      return;
    }
    const ending = event.target.closest('[data-ending]');
    if (ending) { state.finale.ending = ending.dataset.ending; saveState(); render(); showToast('Ending selected for the finale board.'); return; }
    const finaleDelta = event.target.closest('[data-finale-delta]');
    if (finaleDelta) { const [field, raw] = finaleDelta.dataset.finaleDelta.split(':'); state.finale[field] = Math.max(0, Math.min(9, Number(state.finale[field]) + Number(raw))); saveState(); render(); return; }
    const copy = event.target.closest('[data-copy]');
    if (copy) { copyText(copy.dataset.copy); return; }
  }

  function handleInput(event) {
    const target = event.target;
    if (target.matches('[data-state-text]')) { state[target.dataset.stateText] = target.value; saveState(); return; }
    if (target.matches('[data-finale-text]')) { state.finale[target.dataset.finaleText] = target.value; saveState(); return; }
    if (target.matches('[data-revelation]')) { state.revelations[target.dataset.revelation] = target.checked; saveState(); renderRail(); return; }
    if (target.matches('[data-relationship]')) { const name = target.dataset.relationship; state.relationships[name] = { ...(state.relationships[name] || {}), [target.dataset.relationshipField]: target.value }; saveState(); return; }
    if (target.matches('[data-log]')) { const index = Number(target.dataset.log); state.logs[index] = { ...(state.logs[index] || {}), [target.dataset.logField]: target.value }; saveState(); return; }
    if (target.matches('[data-thread]')) { state.threads = state.threads || {}; state.threads[target.dataset.thread] = target.value; saveState(); return; }
  }

  function handleKeydown(event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#global-search').focus(); }
    if (event.key === 'Escape' && $('#npc-portrait-dialog')?.open) { event.preventDefault(); closeNpcPortrait(); return; }
    if (event.target.matches('[data-dice-input]') && event.key === 'Enter') { event.preventDefault(); performDiceRoll(event.target.value); return; }
    if (event.target.matches('input, textarea, select')) return;
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) setView(['desk', 'map', 'readaloud', 'dice', 'cast', 'finale', 'tracker', 'encounters', 'cheatsheet'][Number(event.key) - 1]);
    if (!event.metaKey && !event.ctrlKey && !event.altKey && event.key.toLowerCase() === 's') setView('squad');
    if (event.key === 'Escape') { $('#search-results-panel').hidden = true; $('.search-box')?.classList.remove('search-open'); $('#sidebar').classList.remove('open'); }
  }

  function wireUI() {
    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleInput);
    document.addEventListener('keydown', handleKeydown);
    $('#global-search').addEventListener('input', event => doSearch(event.target.value));
    $('#close-search').addEventListener('click', () => { $('#search-results-panel').hidden = true; });
    $('#mobile-menu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
    $('#secrets-toggle').addEventListener('click', toggleSecrets);
    $('#help-button').addEventListener('click', () => $('#help-modal').showModal());
    $('#close-help').addEventListener('click', () => $('#help-modal').close());
    $('#dismiss-help').addEventListener('click', () => $('#help-modal').close());
    $('#continue-story-notice').addEventListener('click', () => closeStoryNotice());
    $('#dismiss-story-notice').addEventListener('click', () => closeStoryNotice(true));
    $('#close-npc-portrait').addEventListener('click', closeNpcPortrait);
    $('#npc-portrait-dialog').addEventListener('click', event => { if (event.target === event.currentTarget || event.target.classList.contains('npc-portrait-stage')) closeNpcPortrait(); });
    $('#npc-portrait-dialog').addEventListener('close', () => { portraitReturnFocus?.focus(); portraitReturnFocus = null; });
    $('#source-button').addEventListener('click', () => setView('section:campaign-overview'));
    window.addEventListener('popstate', applyHashRoute);
    window.addEventListener('hashchange', applyHashRoute);
  }

  wireUI();
  render();
  syncHash(state.view, true);
  showStoryNotice();
})();
