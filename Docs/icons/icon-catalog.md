# Icon catalog — Isaac's Homebrew (PF2e)

Every document in this module that carries an icon: its name, its current icon, and its description. Every entry also carries an *Icon brief* — what the technique, power, item or effect itself looks like, written as an icon subject. For **The Saint** (Saint Seiya) and **The Soulbound** (Bleach) it follows the source series where the entry is based on one; for **The Assimilator** and **The Stargazer** it follows what the entry does and its in-game description.

- 923 compendium entries with an icon (+ 18 documents the scripts create at runtime, listed at the end).
- Descriptions are trimmed to ~400 characters here; `icon-catalog.csv` has them in full, one row per entry, for batch prompting.
- Icon paths starting `modules/isaacs-hb-pf2e/icons/` are this module's own SVGs; `icons/…` are Foundry core; `systems/pf2e/…` are the PF2e system's.
- No icon: *The Saint — Handbook* (journal).

## Contents

- [The Saint](#the-saint)
- [The Soulbound](#the-soulbound)
- [The Assimilator](#the-assimilator)
- [The Stargazer](#the-stargazer)
- [Created at runtime by scripts](#created-at-runtime-by-scripts)

## The Saint

### saint-class (2)

- **Gold Cloth** · _armor_ · `modules/isaacs-hb-pf2e/icons/breastplate-layered-steel-gold.svg`  
  One of the twelve Gold Cloths, forged for a constellation and worn by its Saint. It answers to you and to no one else. You can summon or dismiss the Cloth with a single Interact action. While dismissed it is not on your person and cannot be taken from you. It cannot be removed from you against your will by any means short of destroying it, and it accepts armor runes normally. If you are reduced…  
  **Icon brief** (Saint Seiya — Gold Cloth (object form)): A Gold Cloth assembled in its object form: a gleaming golden statue of a zodiac figure on a pedestal, radiating hard white-gold light against a dark starfield, the twelve zodiac glyphs ringed faintly around it.
- **Saint** · _class_ · `modules/isaacs-hb-pf2e/icons/breastplate-layered-steel-gold.svg`  
  A Gold Saint stands in the attack, wearing gold, and punches a god. Eleven days out of thirteen you are an excellent but not dominant martial. On the thirteenth — the day your own constellation rises — the Cloth burns and you become something else. And on one day in a hundred and thirty, the sky exalts you, and for that day you are very nearly unstoppable. You are not a spellcaster. Your power is…  
  **Icon brief** (Saint Seiya — Gold Saints): A single golden fist punching upward into a dark sky, a blaze of gold cosmo trailing from it, and one constellation flaring bright above among twelve dim ones.

### saint-class-features (77)

#### Actions

- **Adapt** · _action_ · `systems/pf2e/icons/actions/Reaction.webp`  
  Frequency once per round Trigger You would be damaged by an effect you have already adapted to. You heighten your adaptation. Until the start of your next turn, your resistance to that effect increases to twice your level , and if the effect required a save, you improve your degree of success by one step. Granted by the Not by the Same Attack feat.  
  **Icon brief** (Saint Seiya — 'the same technique never works twice on a Saint'): An incoming energy blast splitting harmlessly around a golden open palm, its shards fanning away; a faint glowing copy of that same blast already etched in the palm like a learned pattern.
- **Arayashiki** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  Frequency once per day Trigger You are reduced to 0 Hit Points or killed. You keep acting for 1 minute or until the encounter ends. You cannot drop below 1 Hit Point; you are immune to death effects and to the dying, unconscious, and paralyzed conditions; and you ignore the wounded and drained conditions. When it ends you are dying 3 and your Cloth shatters. If the trigger killed you, you die…  
  **Icon brief** (Saint Seiya — Shaka's Arayashiki (Eighth Sense)): A golden spark of consciousness rising out of a dark abyss, a vertical rift of pale lotus-light opening between life and death; drifting gray soul-wisps below, the spark climbing upward untouched.
- **Athena's Temper** · _action_ · `icons/weapons/swords/sword-gold-holy.webp`  
  The last rung of the Arms Advance, gained at 19th level. Frequency once per day Every Libra weapon gains a fifth damage die , past the game's own cap — that part is permanent — and one property rune of your choice , re-chosen each morning. This action is that choice. The rune applies to all twelve weapons at once and lasts until you choose again tomorrow. A property rune you bought and etched…  
  **Icon brief** (Saint Seiya — Libra Cloth's weapons): Six pairs of golden weapons — swords, tridents, three-section staffs, nunchaku, tonfa, round shields — arranged in a radiating wheel, each tempered to white-hot glowing edges as if fresh from the forge, rune sparks rising.
- **Attuned Casting** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  Frequency once per day You cast a Technique of 2 actions or fewer without spending a Focus Point . Granted by Cloth Attunement  
  **Icon brief** (Homebrew (Saint class)): A small golden technique-sigil igniting from a fingertip with no flame of cost: a constellation glyph lighting itself, a tiny closed circuit of gold light looping back into the hand.
- **Aurora Execution** · _action_ · `systems/pf2e/icons/actions/ThreeActions.webp`  
  Frequency once per minute 60-foot line. Each creature takes 16d6[cold] damage with a basic Fortitude save. A creature that critically fails is frozen solid — petrified, and shatterable by any critical hit. Incapacitation. Granted by the Aquarius Zenith Boon.  
  **Icon brief** (Saint Seiya — Camus's Aurora Execution): Two gauntleted hands clasped together high overhead in the shape of a water jar, a torrent of absolute-zero cold pouring down in a straight beam, ribboned with green and violet aurora light.
- **Bloody Rose** · _action_ · `systems/pf2e/icons/actions/TwoActions.webp`  
  Frequency once per minute 60 feet, one creature. Fortitude save. Failure 10d6[poison] damage and enfeebled 2. Critical Failure It dies . Incapacitation. Granted by the Pisces Zenith Boon.  
  **Icon brief** (Saint Seiya — Aphrodite's Bloody Rose): A single pure-white rose flying stem-first like a dart, its petals turning crimson from the base upward as it drinks blood; a thin red trail behind it.
- **Burn Your Cosmo** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  Frequency once per day Requirements Your constellation is ascendant today. You force the sky's hand. Treat today as Exalted : your Zenith Boon activates for 1 minute. If the day is already Exalted, instead extend your Zenith Boon to all allies within 30 feet for 1 minute. Granted by Seventh Sense. Apply your Cloth's Sky: Zenith effect alongside this one for the duration, or use the sky tracker's…  
  **Icon brief** (Saint Seiya — burning the cosmo): A golden aura erupting skyward like a pillar of fire from a clenched fist, the wearer's constellation blazing white at its peak, embers of gold stars swirling around.
- **Dimension Step** · _action_ · `systems/pf2e/icons/actions/OneAction.webp`  
  You teleport up to 60 feet to a space you can see. Granted by the Aries Ascendant and Zenith Boons.  
  **Icon brief** (Saint Seiya — Mu's teleportation): Two matching circles of shimmering lavender-gold starlight, one fading and one forming a short distance away, a faint stream of stardust arcing between them.
- **Dissolve** · _action_ · `systems/pf2e/icons/actions/TwoActions.webp`  
  Frequency once per 10 minutes You touch one unattended object of up to 10 Bulk, or a 10-foot cube of a structure. It is destroyed , its atoms parted and scattered as a fine glittering dust. This cannot destroy artifacts, Cloths, or objects of similar significance. Against a creature's attended object, that creature may attempt a Reflex save against your Cosmo DC to pull it clear. On any day your…  
  **Icon brief** (Saint Seiya — Camus: freezing is stilling the atoms): A golden fingertip touching a stone block that is breaking apart into a cloud of fine glittering dust, cubes dissolving into sparkling motes from the point of contact.
- **Golden Arrow: Named Shot** · _action_ · `modules/isaacs-hb-pf2e/icons/arrow-glowing-yellow.svg`  
  Frequency once per minute Any creature you can name within a mile, through any barrier short of a planar boundary. It takes @Golden Arrow's damage, plus an additional 8 dice. Automation note: Foundry has no way to target a creature purely by name, off the current scene or otherwise undetected — this reaches anyone on the viewed scene within range, ignoring line of effect, which is the mechanical…  
  **Icon brief** (Saint Seiya — Sagittarius's Golden Arrow): A golden arrow in flight crossing an enormous distance, passing straight through a stone wall that ripples like water around it; a lone target-sigil glowing on the horizon.
- **Om** · _action_ · `systems/pf2e/icons/actions/OneAction.webp`  
  Shaka fights with his eyes closed and opens them only when he intends to end things. You close your eyes. Using this action applies Effect: Om, which is what blinds you and what holds the count. While they are closed you are blinded — fully, with all that entails — but you gain one Om stack at the end of each of your turns, to a maximum of 5 (7 on a day Virgo is ascendant). While you have at…  
  **Icon brief** (Saint Seiya — Shaka's closed eyes): A pair of serenely closed eyes drawn as two gold arcs, the Sanskrit ॐ glowing between them, cosmo pooling and building like still water behind the lids.
- **Open Your Eyes** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  You open your eyes, and whatever you have been holding goes out all at once. Using this action flips Eyes Open on Effect: Om. Your blindness lifts immediately, and the next Technique you cast or unarmed Strike you make before the end of this turn is empowered: +2 damage dice per stack spent, and a −1 circumstance penalty per 2 stacks spent to any saving throw it allows. The effect stays on you…  
  **Icon brief** (Saint Seiya — Shaka opening his eyes): Two eyes snapping open, pure white-gold light bursting out of them in twin beams; a lotus mandala shattering outward from the force.
- **Place a Scarlet Needle** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  Trigger You hit a creature with an unarmed Strike. You add one needle to that creature, to a maximum of 15. Target it before you use this action; the needle lands on whoever you have targeted. At 5 needles it is enfeebled 1. At 10 it is blinded. At 14 it is stunned 2 and its Strikes lose all runes. All three happen by themselves, once each, as the count passes them — see Effect: Scarlet Needle,…  
  **Icon brief** (Saint Seiya — Milo's Scarlet Needle): A single long crimson fingernail extended from a golden gauntlet, a tiny red star of light at its tip, with a thin streak of red where it has just struck.
- **Rozan Hyaku Ryū Ha** · _action_ · `systems/pf2e/icons/actions/ThreeActions.webp`  
  Frequency once per round 60-foot line. Each creature takes 12d10[bludgeoning] damage with a basic Reflex save. A creature that critically fails is knocked prone and stunned 2. Granted by the Libra Zenith Boon.  
  **Icon brief** (Saint Seiya — Rozan Hyaku Ryū Ha): A hundred green-and-gold Chinese dragons of cosmo surging upward in a dense braided torrent from a single fist, a waterfall in mist behind them.
- **Sever** · _action_ · `systems/pf2e/icons/actions/Reaction.webp`  
  Frequency once per turn Trigger A creature attacks you, or a spell effect enters your space. You sever it. The attack or effect has no effect. Automation note: Foundry has no hook that lets a third party void an attack or a spell already in motion — the same limit that keeps Taurus' Titan's Stance from retargeting an incoming attack. This action exists so the frequency is real and a click records…  
  **Icon brief** (Saint Seiya — Shura's Excalibur): A golden knife-hand slicing through the air, a blade-thin line of white light cutting an oncoming fireball cleanly in two, the halves dissipating.
- **Six Realms Unmade** · _action_ · `systems/pf2e/icons/actions/ThreeActions.webp`  
  Frequency once per minute 60-foot emanation. Each enemy must attempt a Will save against your Cosmo DC or lose all five senses for 1 minute: blinded, deafened, and the loss of smell, taste and touch. Critical Failure The loss lasts until the creature receives restoration — the four effects are applied with no duration, so nothing takes them off on a timer. Incapacitation. Granted by the Virgo…  
  **Icon brief** (Saint Seiya — Shaka's Rikudō / Tenbu Hōrin): A six-spoked wheel of golden light spinning in a dark void, each spoke a different realm; the five senses shown as eye, ear, nose, tongue and hand symbols fading to ash around it.
- **Star Guard** · _action_ · `systems/pf2e/icons/actions/Reaction.webp`  
  Trigger A creature within 60 feet makes a ranged or spell attack, or targets an ally with a spell. You send the effect nowhere . It is expended with no result. Ascendant: once per round. Zenith: no frequency limit, and once per minute you may instead target a creature within 60 feet — Fortitude save against your Cosmo DC, and on a critical failure it is teleported one mile away ( incapacitation…  
  **Icon brief** (Saint Seiya — Mu's Crystal Wall / dimension): An incoming magic bolt striking a pane of faint violet starlight and vanishing into it as if into deep space, leaving only scattered star specks.
- **Star Guard: Exile** · _action_ · `systems/pf2e/icons/actions/Reaction.webp`  
  Trigger A creature within 60 feet makes a ranged or spell attack, or targets an ally with a spell. Instead of sending the effect nowhere, you send the creature . It attempts a Fortitude save against your Cosmo DC; on a critical failure it is teleported one mile away. The module moves the token along the line from you to it, as far as the scene allows, and reports the distance actually travelled.…  
  **Icon brief** (Saint Seiya — Mu's Starlight Extinction): A swirling spiral of stars opening like a whirlpool in the night sky, a dark silhouette being pulled into it and vanishing in sparkles.
- **Summon an Arm** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  You call one of the Cloth's six Arms into your hands, or send it back. An Arm is a matched pair , and it always arrives as both weapons at once, one in each hand — there is no half of an Arm to hold. Summoning one therefore dismisses whichever Arm you were holding, and you gain the new pair's Art in place of the old one. On a day your constellation is Ascendant , The Balance lets you keep one…  
  **Icon brief** (Saint Seiya — Libra Cloth's weapons): A pair of matching golden weapons materializing from twin beams of light descending into two open hands, with the Libra scales glyph ♎ glowing above.
- **Summon or Dismiss Cloth** · _action_ · `systems/pf2e/icons/actions/OneAction.webp`  
  Your Gold Cloth answers instantly. You summon your Cloth onto your body, or dismiss it. While dismissed it is not on your person and cannot be taken from you. The Cloth cannot be removed from you against your will by any means short of destroying it. Granted by The Cloth  
  **Icon brief** (Saint Seiya — Cloth summoning): A golden Cloth disassembling into separate glowing armor pieces flying through the air toward an empty silhouette, each trailing a streak of light, the opened Pandora Box below.
- **Swap Aspect** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  Frequency once per hour You change between your Light and Shadow aspects. Your appearance, voice, and aura change completely; nothing short of true seeing connects the two. In Shadow, your 1st Technique becomes a single-target confuse effect (Will save, confused 1 round on a failure) instead of its usual effect. Granted by Gemini — the Other Dimension. Using this action flips the Two Faces toggle…  
  **Icon brief** (Saint Seiya — Gemini's two faces): A single golden mask split vertically down the middle: one half serene and lit in white light, the other half snarling and shrouded in black-violet shadow.
- **The Yellow Spring Is Here** · _action_ · `systems/pf2e/icons/actions/ThreeActions.webp`  
  Frequency once per Zenith day 30-foot emanation. Every enemy at half Hit Points or fewer must attempt a Fortitude save against your Cosmo DC or die . Incapacitation. Granted by the Cancer Zenith Boon.  
  **Icon brief** (Saint Seiya — Deathmask's Yomotsu Hirasaka): A wide ring of blue will-o'-wisp fire spreading across the ground, and from it pale soul-wisps tearing free of fallen bodies and drifting toward a gaping pit on a gray hillside.
- **The Yellow Spring Opens** · _action_ · `systems/pf2e/icons/actions/FreeAction.webp`  
  Frequency once per round A creature within 30 feet at half Hit Points or fewer must attempt a Fortitude save against your Cosmo DC or take 8d6[void] damage and be slowed 1. Granted by the Cancer Ascendant Boon. While that boon is active, any creature you reduce to 0 Hit Points also dies with no save.  
  **Icon brief** (Saint Seiya — Deathmask's Sekishiki Meikai Ha): A single finger pointing upward, a pale blue soul being pulled out of a wounded figure in a thin stream of ghostly light toward a dark yawning crack in the ground.
- **Vow's Answer** · _action_ · `systems/pf2e/icons/actions/Reaction.webp`  
  Frequency once per round Trigger The target of your Vow would be reduced to 0 Hit Points while within 30 feet of you. You Stride up to your Speed toward them. If this brings them within your reach, they remain at 1 Hit Point instead. A given ally can be saved this way only once per hour. Granted by the Saint's Vow feat.  
  **Icon brief** (Homebrew (Saint class)): A golden streak of motion crossing the gap to catch a falling ally, a glowing oath-ribbon of light linking the two, the ally's falling silhouette frozen at the brink.
#### Core

- **Armor Expertise** · _feat_ · `icons/equipment/chest/breastplate-banded-steel-gold.webp`  
  Wearing your Cloth has become as natural as wearing your own skin. Your proficiency ranks for unarmored defense and for light and medium armor increase to expert. This is the Saint's own Armor Expertise. It deliberately does not grant heavy armor, which the Saint never trains in.  
  **Icon brief** (Homebrew (Saint class)): A golden armor plate fused seamlessly with skin at the edges, the metal following the shape of a muscle like a second skin, glowing at the seam.
- **Ascendant Constellation** · _feat_ · `icons/magic/light/beams-rays-orange-purple-large.webp`  
  You always know when your own constellation is ascendant and what its aspect is. You know nothing of the other twelve. When the day's sign is your Cloth's: Ascendant (any aspect): you gain your Cloth's Ascendant Boon , and your Techniques heighten as though you were 4 levels higher . Exalted: you gain your Cloth's Zenith Boon instead, and your Techniques heighten as though you were 8 levels…  
  **Icon brief** (Saint Seiya — constellation rising): A single zodiac constellation (star points joined by gold lines) rising over a dark horizon, bright and gold, while the other signs stay dim and gray.
- **Cloth Attunement** · _feat_ · `modules/isaacs-hb-pf2e/icons/breastplate-layered-steel-gold.svg`  
  You and the Cloth have stopped being two things. All your Techniques gain one additional heightening step , as though you were 2 levels higher than you are. Once per day you may cast a Technique of 2 actions or fewer without spending a Focus Point . The extra step is automated as bonus damage dice on every Technique; the non-damage riders of a heightening step are applied by hand from the…  
  **Icon brief** (Homebrew (Saint class)): A golden gauntlet and the hand inside it merging into one, the gold armor and veins of cosmo-light flowing together, a stepped arrow of heightening light rising above.
- **Cloth Mastery** · _feat_ · `icons/skills/melee/unarmed-punch-fist.webp`  
  Your fists have become the equal of any weapon. Your proficiency rank for unarmed attacks increases to master.  
  **Icon brief** (Homebrew (Saint class)): A bare golden fist striking a steel sword and shattering the blade, fragments flying, the fist itself unscratched and glowing.
- **Cosmo** · _feat_ · `icons/magic/light/explosion-star-glow-orange.webp`  
  Your inner cosmo is a wellspring you can spend. You gain a focus pool of 1 Focus Point and the Refocus activity; you Refocus by burning your cosmo for 10 minutes. Your Techniques are focus spells with the cosmo trait, using your Cosmo DC and your key ability. Techniques have no rank. Each one heightens once per 2 character levels above the level at which you gained it. You gain your Cloth's…  
  **Icon brief** (Saint Seiya — the inner universe (cosmo)): A small universe — a swirling galaxy of gold stars — glowing inside the outline of a human chest, light spilling out of it like a wellspring.
- **Cosmo Expertise** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-star-glow-orange-purple.svg`  
  Your command of your own cosmo sharpens. Your proficiency rank for your Cosmo DC increases to expert.  
  **Icon brief** (Homebrew (Saint class)): A small flame of golden cosmo sharpening into a focused point, a thin ring of light tightening around it.
- **Cosmo Mastery** · _feat_ · `icons/magic/light/explosion-star-glow-purple.webp`  
  Your cosmo answers you completely. Your proficiency rank for your Cosmo DC increases to master.  
  **Icon brief** (Homebrew (Saint class)): A sphere of golden cosmo held perfectly still in an open palm, perfectly round and calm, concentric rings of light expanding out from it.
- **Cosmo Strike** · _feat_ · `icons/skills/melee/unarmed-punch-fist-yellow-red.webp`  
  Your cosmo burns in your hands. Your fist deals 1d6 bludgeoning damage and is in the brawling group with the agile, finesse, nonlethal, and unarmed traits. Your unarmed Strikes are magical and gain a +1 circumstance bonus to damage per weapon damage die . At 5th level your proficiency rank for unarmed attacks increases to expert, and you gain the brawling critical specialization effect. GM note:…  
  **Icon brief** (Saint Seiya — cosmo-charged punch): A clenched fist wrapped in burning golden cosmo, a star-shaped impact flash at the knuckles.
- **Eighth Sense (Arayashiki)** · _feat_ · `icons/magic/death/skull-humanoid-crown-white-blue.webp`  
  You have already crossed death once, and you know the way back. You gain Arayashiki ◆ — a free action, once per day, triggered when you are reduced to 0 Hit Points or killed. It keeps you acting for 1 minute and cannot be refused by death itself; read the action for what it costs you afterward.  
  **Icon brief** (Saint Seiya — Arayashiki): A glowing golden figure-outline walking back up out of a dark pit of gray souls, a path of light rising beneath its feet, the underworld below.
- **Expert Cosmo Strike** · _feat_ · `icons/skills/melee/hand-grip-staff-yellow-brown.webp`  
  Your attacks with your fists become more precise and deadly. Your proficiency rank for unarmed attacks increases to expert, and you gain the brawling critical specialization effect. This is the 5th-level half of Cosmo Strike, granted as its own feature so the proficiency increase lands on the sheet.  
  **Icon brief** (Homebrew (Saint class)): A fist striking with pinpoint precision, the impact a sharp star-flash on a single glowing vital point, crack lines radiating outward.
- **Fourth Technique (Ultimate)** · _feat_ · `icons/magic/light/explosion-star-large-orange-purple.webp`  
  You learn your Cloth's 4th Technique — its Ultimate, the one the stories are about. It has no rank and heightens once per 2 character levels above 16th.  
  **Icon brief** (Homebrew (Saint class)): The four-pointed star of a fourth technique, its top point blazing far brighter than the others, golden light pillar breaking a stormy sky.
- **Second Cosmo** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Your cosmo runs deeper. Your focus pool increases by 1 Focus Point.  
  **Icon brief** (Homebrew (Saint class)): Two golden flames of cosmo side by side, the second newly lit, burning in a dark chest-shaped silhouette.
- **Second Technique** · _feat_ · `icons/magic/symbols/runes-star-blue.webp`  
  You learn your Cloth's 2nd Technique . Like all Techniques it has no rank, and it heightens once per 2 character levels above 6th. Which Technique this is depends on your Cloth; see your Cloth's entry.  
  **Icon brief** (Homebrew (Saint class)): A second star joining a constellation line, lighting up in gold beside the first, a short line of light connecting them.
- **Seventh Sense** · _feat_ · `icons/magic/light/explosion-star-glow-silhouette.webp`  
  You have touched the seventh sense, and the world's ordinary rules have stopped applying to your fists. Passive. Your Strikes ignore resistances and bypass all material weaknesses and immunities; you strike incorporeal creatures normally. You automatically know the location of anything that has damaged you in the last minute. You gain Burn Your Cosmo ◆ — a free action, once per day, that treats…  
  **Icon brief** (Saint Seiya — the Seventh Sense): A cosmo aura exploding from gold into blinding pure white, a fist passing through a ghostly incorporeal shape and breaking it, seven small lights in a ring.
- **Shelter of the Cloth** · _feat_ · `icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp`  
  Your cosmo spills outward far enough to shade the people near you. Allies within 30 feet treat the day's aspect as one step milder: Malefic becomes Retrograde, and Retrograde becomes nothing. This is passive and always on. It stacks with a Stargazer's Forewarned — a party with both is simply immune to the sky.  
  **Icon brief** (Homebrew (Saint class)): A dome of soft golden cosmo spread like a canopy over several small silhouettes, the storm-dark sky outside dimmed and calmed where the dome covers it.
- **Sixth Sense** · _feat_ · `icons/magic/perception/third-eye-blue-red.webp`  
  You perceive cosmo directly. You gain an imprecise sense with a range of 60 feet that detects everything with a cosmo. You are never off-guard to undetected or hidden creatures, and you cannot be flanked by anything your sixth sense perceives. The sense and the immunity to flanking are on the sheet. "Never off-guard to undetected or hidden creatures" is a note: pf2e applies that off-guard from…  
  **Icon brief** (Saint Seiya — the Sixth Sense): A closed eye with a ring of golden ripples spreading outward from it like sonar, hidden figures in the dark lit up as glowing outlines where the ripples touch.
- **Sky-Reading** · _feat_ · `modules/isaacs-hb-pf2e/icons/telescope-blue.svg`  
  Years of watching one constellation have taught you to read the rest of the sky, even though it will never answer you the way yours does. You become trained in a skill of your choice, and in Astronomy Lore . You can use that Lore to determine the current sign and aspect of the sky, and to identify a Saint's Cloth by the way their cosmo moves.  
  **Icon brief** (Homebrew (Saint class)): A brass star chart wheel with all twelve zodiac signs around its rim, one sign brightly gold and the rest faint, a pointer turning between them.
- **The Cloth** · _feat_ · `modules/isaacs-hb-pf2e/icons/breastplate-layered-steel-gold.svg`  
  You are bonded to one of the twelve Gold Cloths. It is medium armor (+4 AC, Dex cap +1, check penalty −2, Strength 16), free at 1st level, and it accepts armor runes normally. You can summon or dismiss it with a single Interact action. It cannot be removed from you by any means short of destroying it. If you are reduced to 0 Hit Points the Cloth cracks; it self-repairs after 24 hours, or…  
  **Icon brief** (Homebrew (Saint class)): A gold Cloth box (Pandora Box) standing upright and open, a golden suit of armor glowing inside it, constellation emblem engraved on the lid.
- **Third Cosmo** · _feat_ · `icons/magic/light/explosion-star-glow-yellow.webp`  
  Your cosmo runs deeper still. Your focus pool increases by 1 Focus Point, to a maximum of 3.  
  **Icon brief** (Homebrew (Saint class)): Three golden flames of cosmo rising together in a triangle, the third and largest newly lit at the top.
- **Third Technique (Cloth Ability)** · _feat_ · `modules/isaacs-hb-pf2e/icons/breastplate-collared-steel-gold.svg`  
  Your Cloth has taught you its deepest art. You learn your Cloth's 3rd Technique , its Cloth Ability . It has no rank and heightens once per 2 character levels above 11th.  
  **Icon brief** (Homebrew (Saint class)): A golden Cloth plate engraved with a single deep rune that glows from within, the rune unfolding into a burst of the Cloth's signature light.
- **Unfailing Cosmo** · _feat_ · `icons/magic/defensive/shield-barrier-glowing-triangle-orange.webp`  
  You never suffer the sky's Retrograde or Malefic aspects, or any of their riders. Ever. You still gain every Ascendant and Exalted benefit normally.  
  **Icon brief** (Homebrew (Saint class)): A golden flame burning steady while dark storm clouds and falling black stars break apart around it without touching it.
#### Gold Cloths

- **Aquarius — Absolute Zero** · _feat_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  ♒ The Aquarius Cloth. [OFFENSE/removal] Cloth Passive — Cold Blood You have cold resistance equal to your level and are immune to the effects of severe cold environments. You gain a +1 status bonus to Will saves against emotion effects, and you are trained in Occultism or Arcana (your choice). Techniques 1st — Signature (L1) — Diamond Dust 2nd (L6) — Koliço 3rd — Cloth Ability (L11) — Freezing…  
  **Icon brief** (Saint Seiya — Aquarius Gold Cloth): The Aquarius glyph ♒ carved in ice, a golden amphora tipping and pouring a stream of frost-white cold that freezes into crystals mid-air.
- **Aries — the Wall** · _feat_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  ♈ The Aries Cloth. [DEFENSE] Cloth Passive — Cloth Mending You are trained in Crafting. You can Repair any Cloth, armor, or shield in 10 minutes with no check and no repair kit, restoring 10 × your level Hit Points. A Cloth you repair is fully restored regardless of how it was destroyed. Techniques 1st — Signature (L1) — Crystal Wall 2nd (L6) — Starlight Extinction 3rd — Cloth Ability (L11) —…  
  **Icon brief** (Saint Seiya — Aries Gold Cloth): The Aries glyph ♈ framed by two great spiral ram horns, a faint hexagonal crystal barrier shimmering in front, and a hammer and chisel crossed below for Cloth repair.
- **Cancer — the Yellow Spring** · _feat_ · `icons/magic/death/hand-dirt-undead-zombie.webp`  
  ♋ The Cancer Cloth. [OFFENSE] Cloth Passive — The Boundary You can see and speak with spirits, ghosts, and the recently dead. You automatically know the current Hit Point category (healthy, hurt, near death, dying) of every creature within 30 feet. You are trained in Medicine. Techniques 1st — Signature (L1) — Sekishiki Meikai Ha 2nd (L6) — Sekishiki Kisōen 3rd — Cloth Ability (L11) — Sekishiki…  
  **Icon brief** (Saint Seiya — Cancer Gold Cloth): The Cancer glyph ♋ set on a gray hillside under a dim sky, ringed by floating blue will-o'-wisp flames, faint ghostly faces in the dark behind it.
- **Capricorn — Excalibur** · _feat_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-gold.svg`  
  ♑ The Capricorn Cloth. [OFFENSE, conditional] Cloth Passive — The Sword Arm & The Sharpest Sword The Sword Arm. Your unarmed Strikes gain the versatile S and deadly d8 traits. You are trained in Athletics. The Sharpest Sword. Your critical hits with unarmed Strikes sever — the target permanently loses the use of one limb, natural attack, or sense of your choice until it receives regenerate . You…  
  **Icon brief** (Saint Seiya — Capricorn Gold Cloth): The Capricorn glyph ♑ with a gleaming upright holy sword of white-gold light slicing through it, a single fine cut line across the dark background.
- **Gemini — the Other Dimension** · _feat_ · `icons/magic/control/energy-stream-link-spiral-teal.webp`  
  ♊ The Gemini Cloth. [OFFENSE] Cloth Passive — Two Faces You are trained in Deception. You have two aspects, Light and Shadow , and swap between them as a free action once per hour. In Shadow, Another Dimension instead becomes a single-target confuse effect (Will save, confused 1 round on a failure). Your appearance, voice, and aura change completely. You have two identities that nothing short of…  
  **Icon brief** (Saint Seiya — Gemini Gold Cloth): The Gemini glyph ♊ split down the middle into a light half and a shadow half, a cracked rift of swirling galaxies opening behind it.
- **Leo — the Lightning** · _feat_ · `icons/magic/lightning/bolt-strike-forked-blue.webp`  
  ♌ The Leo Cloth. [OFFENSE] Cloth Passive — Pride of the Lion You are immune to the frightened condition and to fear effects. You are trained in Intimidation, with a +1 circumstance bonus to Demoralize. Techniques 1st — Signature (L1) — Lightning Bolt 2nd (L6) — Lightning Crown 3rd — Cloth Ability (L11) — Lightning Plasma 4th — Ultimate (L16) — Photon Burst Ascendant Boon — Lightning Plasma…  
  **Icon brief** (Saint Seiya — Leo Gold Cloth): The Leo glyph ♌ formed from crackling golden lightning, a roaring lion's head silhouette in electric light behind it.
- **Libra — the Weapons** · _feat_ · `icons/weapons/swords/sword-guard-blue.webp`  
  ♎ The Libra Cloth. [OFFENSE/DEFENSE] Cloth Passive — The Cloth of Arms The only Gold Cloth that carries weapons. You are trained in martial weapons , and they advance with your unarmed proficiency automatically. Cosmo Strike applies to Libra weapons — they are magical and gain +1 damage per weapon damage die, exactly as your fists do. Your Cloth holds six Arms , and every Arm is a matched pair —…  
  **Icon brief** (Saint Seiya — Libra Gold Cloth): The Libra glyph ♎ as a golden balance scale, with six pairs of small golden weapons hanging from its arms and crossing beneath it.
- **Pisces — the Roses** · _feat_ · `modules/isaacs-hb-pf2e/icons/rose-thorned-red.svg`  
  ♓ The Pisces Cloth. [OFFENSE] Cloth Passive — Royal Demon Rose Roses grow from your Cloth. You are immune to poison . Any creature that touches you or hits you with an unarmed or non-reach melee attack takes 1d6[poison] damage. Techniques 1st — Signature (L1) — Piranha Rose 2nd (L6) — Royal Demon Rose 3rd — Cloth Ability (L11) — Crimson Fog 4th — Ultimate (L16) — Royal Funeral Ascendant Boon —…  
  **Icon brief** (Saint Seiya — Pisces Gold Cloth): The Pisces glyph ♓ woven out of thorned rose stems, three roses — red, black and white — blooming around it, a haze of poisonous petals.
- **Sagittarius — the Arrow** · _feat_ · `icons/weapons/ammunition/arrow-head-war-flight.webp`  
  ♐ The Sagittarius Cloth. [UTILITY] Cloth Passive — The Bow Your Cloth includes a bow that uses your unarmed proficiency and can never be disarmed or destroyed. You gain a +2 circumstance bonus to Perception checks to notice things beyond 100 feet, and your Speed increases by 10 feet. Techniques 1st — Signature (L1) — Golden Arrow 2nd (L6) — Chiron's Light Impulse 3rd — Cloth Ability (L11) —…  
  **Icon brief** (Saint Seiya — Sagittarius Gold Cloth): The Sagittarius glyph ♐ as a golden drawn bow with a nocked arrow, a pair of great feathered golden wings spread behind it.
- **Scorpio — the Needle** · _feat_ · `icons/skills/wounds/injury-triple-slash-bleed.webp`  
  ♏ The Scorpio Cloth. [OFFENSE] Cloth Passive — Fifteen Needles Needles are counted on each creature separately, and they reset when the creature takes a full rest or when the encounter ends. Whenever you hit a creature with an unarmed Strike, you may spend a free action — Place a Scarlet Needle — to add one needle, to a maximum of 15. At 5 needles the creature is enfeebled 1. At 10 it is blinded.…  
  **Icon brief** (Saint Seiya — Scorpio Gold Cloth): The Scorpio glyph ♏ ending in a curled scorpion stinger, fifteen small crimson stars tracing the Scorpius constellation around it, the brightest red star at the heart.
- **Taurus — the Horn** · _feat_ · `modules/isaacs-hb-pf2e/icons/bull-horns-brown.svg`  
  ♉ The Taurus Cloth. [OFFENSE] Cloth Passive — Bulwark You cannot be moved against your will by any creature or effect of your size or smaller. You gain a +2 circumstance bonus to Athletics checks and to your DC against Shove, Trip, Grapple, and Disarm. Techniques 1st — Signature (L1) — Great Horn 2nd (L6) — Pleiades Nova 3rd — Cloth Ability (L11) — Titan's Stance 4th — Ultimate (L16) — Titan's…  
  **Icon brief** (Saint Seiya — Taurus Gold Cloth): The Taurus glyph ♉ with massive forward-curving golden bull horns, a ground-shaking golden shockwave ring at its base.
- **Virgo — Nearest to God** · _feat_ · `icons/magic/control/energy-stream-link-white.webp`  
  ♍ The Virgo Cloth. [CONTROL] Cloth Passive — Om Shaka fights with his eyes closed and opens them only when he intends to end things. As a single action ( concentrate ) you may close your eyes . While your eyes are closed you are blinded — fully, with all that entails — but you gain one Om stack at the end of each of your turns, to a maximum of 5 . While you have at least 1 stack you gain a +1…  
  **Icon brief** (Saint Seiya — Virgo Gold Cloth): The Virgo glyph ♍ above an open golden lotus, two closed eyes drawn in light above the lotus, a soft mandala halo behind.
#### Libra Arts

- **Rebound Rhythm** · _action_ · `icons/weapons/misc/nunchaku.webp`  
  The Art of the Libra Nunchaku. Frequency once per turn Requirements You are wielding both Libra Nunchaku (Right) and Libra Nunchaku (Left) Trigger You hit a creature with a Nunchaku Strike The chain whips back. Make a Strike with the other Nunchaku against that creature or one adjacent to it. This Strike is made at your current multiple attack penalty and increases it normally, and it always…  
  **Icon brief** (Saint Seiya — Libra nunchaku): Two golden nunchaku in mid-swing, one chain whipping back toward a second target in a curving arc of light, motion trails tracing a figure-eight.
- **Setting the Tide** · _action_ · `icons/weapons/polearms/trident-silver-red.webp`  
  The Art of the Libra Tridents. Frequency once per round Requirements You are wielding both Libra Trident (Right) and Libra Trident (Left) Trigger A creature within your reach uses a move action, or leaves a square within your reach Strike it with a trident. On a hit its movement immediately ends ; on a critical hit it is also pushed 10 feet and knocked prone . Greater (8th level) Your reach with…  
  **Icon brief** (Saint Seiya — Libra tridents): Two golden tridents planted crossed in the ground, a flowing wall of water-blue light between them blocking a figure trying to step past.
- **The Crossing** · _action_ · `icons/weapons/swords/shortsword-guard-gold.webp`  
  The Art of the Libra Twin Swords — Rozan Jūjiken. Frequency once per turn Requirements You are wielding both Libra Twin Sword (Right) and Libra Twin Sword (Left) Trigger You hit the same creature with both Twin Swords this turn The cuts cross. The target takes persistent bleed equal to your weapons' number of damage dice in d6s — 2d6 once you have striking, 5d6 at Athena's Temper — and is…  
  **Icon brief** (Saint Seiya — Rozan Jūjiken (cross slash)): Two golden swords crossing in an X, a glowing crimson X-shaped slash cut in the air behind them, droplets of light falling from the cut.
- **The Turning Guard** · _action_ · `icons/weapons/clubs/baton-night-stick-truncheon.webp`  
  The Art of the Libra Tonfa. Frequency once per round Requirements You are wielding both Libra Tonfa (Right) and Libra Tonfa (Left) Trigger A melee attack against you critically fails While wielding both Tonfa you gain the parry bonus (+1 circumstance to AC) with no action spent . When the trigger is met, Strike the attacker with a Tonfa; this Strike does not increase your multiple attack penalty.…  
  **Icon brief** (Saint Seiya — Libra tonfa): Two golden tonfa spinning around the forearms, a deflected enemy blade glancing off in a spray of sparks, a curved motion arc showing the turn.
- **The Twin Bulwark** · _action_ · `icons/equipment/shield/heater-steel-gold.webp`  
  The Art of the Libra Shields. Frequency once per round Requirements You are wielding both Libra Shield (Right) and Libra Shield (Left) While wielding both Shields you may Raise a Shield as a free action once per round — this action — and you can Shield Block as a reaction even without the feat, which the Art grants you outright. Each Shield has Hardness equal to your level , Hit Points equal to 8…  
  **Icon brief** (Saint Seiya — Libra shields (Dragon Shield heritage)): Two round golden shields raised side by side, edges overlapping into one wall, a dragon-scale pattern of light across both.
- **The Twin Bulwark: Riposte** · _action_ · `icons/equipment/shield/heater-steel-gold.webp`  
  The Twin Bulwark, Perfect — gained at 14th level. Trigger A Shield Block with a Libra Shield reduces the damage to 0 The attacker takes your Shield's damage dice in bludgeoning — 4d6 with major striking , 5d6 at Athena's Temper . Target the attacker and use this. Granted by The Twin Bulwark at 14th level.  
  **Icon brief** (Saint Seiya — Libra shields): A round golden Libra shield absorbing a strike so completely the blow vanishes at its face, a golden counter-shockwave rebounding outward toward the attacker.
- **The Whirling Circle** · _action_ · `icons/weapons/staves/staff-simple.webp`  
  The Art of the Libra Sanjiegun. Frequency once per round Requirements You are wielding both Libra Sanjiegun (Right) and Libra Sanjiegun (Left) Make one Sanjiegun Strike against each enemy within your reach . Each attack counts toward your multiple attack penalty, but the penalty doesn't increase until you have made all of them . Greater (8th level) The activity costs two actions instead — The…  
  **Icon brief** (Saint Seiya — Libra three-section staff): A golden three-section staff swinging in a wide circle, a single glowing ring of motion sweeping around the center.
- **The Whirling Circle (Greater)** · _action_ · `icons/weapons/staves/staff-simple.webp`  
  The Art of the Libra Sanjiegun, Greater — gained at 8th level. Frequency once per round Requirements You are wielding both Libra Sanjiegun (Right) and Libra Sanjiegun (Left) Make one Sanjiegun Strike against each enemy within your reach . Each attack counts toward your multiple attack penalty, but the penalty doesn't increase until you have made all of them . Greater (8th level) The activity…  
  **Icon brief** (Saint Seiya — Libra three-section staff): Two golden three-section staffs whirling in a full circle, a blazing gold ring of motion around a center point, larger and with a second outer ring of light.
#### Libra Weapons

- **Libra Nunchaku (Left)** · _weapon_ · `icons/weapons/misc/nunchaku.webp`  
  One half of the Libra Cloth's Nunchaku (Sōsetsukon) — the left hand. 1d6 bludgeoning, one hand each, flail group; agile, backswing, finesse, magical, trip, twin. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed…  
  **Icon brief** (Saint Seiya — Libra Cloth's nunchaku): A golden nunchaku (sōsetsukon), two short ornate gold rods joined by a short chain, held to the left; Libra scales engraved on the handles.
- **Libra Nunchaku (Right)** · _weapon_ · `icons/weapons/misc/nunchaku.webp`  
  One half of the Libra Cloth's Nunchaku (Sōsetsukon) — the right hand. 1d6 bludgeoning, one hand each, flail group; agile, backswing, finesse, magical, trip, twin. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed…  
  **Icon brief** (Saint Seiya — Libra Cloth's nunchaku): A golden nunchaku (sōsetsukon), two short ornate gold rods joined by a short chain, held to the right, mirror image of the left one.
- **Libra Sanjiegun (Left)** · _weapon_ · `icons/weapons/staves/staff-simple.webp`  
  One half of the Libra Cloth's Sanjiegun (Sansetsukon) — the left hand. 1d8 bludgeoning, one hand each, flail group; disarm, magical, reach, sweep, trip, twin. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency…  
  **Icon brief** (Saint Seiya — Libra Cloth's three-section staff): A golden three-section staff (sansetsukon): three gold rods linked by short chains, laid in a zigzag, angled to the left.
- **Libra Sanjiegun (Right)** · _weapon_ · `icons/weapons/staves/staff-simple.webp`  
  One half of the Libra Cloth's Sanjiegun (Sansetsukon) — the right hand. 1d8 bludgeoning, one hand each, flail group; disarm, magical, reach, sweep, trip, twin. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency…  
  **Icon brief** (Saint Seiya — Libra Cloth's three-section staff): A golden three-section staff (sansetsukon): three gold rods linked by short chains, laid in a zigzag, angled to the right (mirror of the left).
- **Libra Shield (Left)** · _shield_ · `icons/equipment/shield/heater-steel-gold.webp`  
  One half of the Libra Cloth's Shields (Sōtate) — the left hand. 1d6 bludgeoning, one hand each, shield group; magical, shove, twin, versatile S. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency with it, and it…  
  **Icon brief** (Saint Seiya — Libra Cloth's shields): A round golden Libra shield with a raised boss and fluted ridges, seen from the front, on the left side.
- **Libra Shield (Right)** · _shield_ · `icons/equipment/shield/heater-steel-gold.webp`  
  One half of the Libra Cloth's Shields (Sōtate) — the right hand. 1d6 bludgeoning, one hand each, shield group; magical, shove, twin, versatile S. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency with it, and…  
  **Icon brief** (Saint Seiya — Libra Cloth's shields): A round golden Libra shield with a raised boss and fluted ridges, seen from the front, on the right side (mirror of the left).
- **Libra Tonfa (Left)** · _weapon_ · `icons/weapons/clubs/baton-night-stick-truncheon.webp`  
  One half of the Libra Cloth's Tonfa (Tonfā) — the left hand. 1d6 bludgeoning, one hand each, club group; agile, finesse, magical, parry, twin. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency with it, and it…  
  **Icon brief** (Saint Seiya — Libra Cloth's tonfa): A golden tonfa with a short side handle, gripped along the forearm, angled to the left.
- **Libra Tonfa (Right)** · _weapon_ · `icons/weapons/clubs/baton-night-stick-truncheon.webp`  
  One half of the Libra Cloth's Tonfa (Tonfā) — the right hand. 1d6 bludgeoning, one hand each, club group; agile, finesse, magical, parry, twin. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency with it, and it…  
  **Icon brief** (Saint Seiya — Libra Cloth's tonfa): A golden tonfa with a short side handle, gripped along the forearm, angled to the right (mirror of the left).
- **Libra Trident (Left)** · _weapon_ · `icons/weapons/polearms/trident-silver-red.webp`  
  One half of the Libra Cloth's Tridents (Sansōgeki) — the left hand. 1d10 piercing, one hand each, spear group; magical, reach, thrown 30 ft, twin, versatile S. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency…  
  **Icon brief** (Saint Seiya — Libra Cloth's tridents): A golden three-pronged trident with ornate barbed points, held diagonally to the left.
- **Libra Trident (Right)** · _weapon_ · `icons/weapons/polearms/trident-silver-red.webp`  
  One half of the Libra Cloth's Tridents (Sansōgeki) — the right hand. 1d10 piercing, one hand each, spear group; magical, reach, thrown 30 ft, twin, versatile S. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency…  
  **Icon brief** (Saint Seiya — Libra Cloth's tridents): A golden three-pronged trident with ornate barbed points, held diagonally to the right (mirror of the left).
- **Libra Twin Sword (Left)** · _weapon_ · `icons/weapons/swords/shortsword-guard-gold.webp`  
  One half of the Libra Cloth's Twin Swords (Sōken) — the left hand. 1d8 slashing, one hand each, sword group; agile, finesse, magical, twin, versatile P. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency with…  
  **Icon brief** (Saint Seiya — Libra Cloth's twin swords): A golden straight double-edged sword with a winged guard, pointed up and angled to the left.
- **Libra Twin Sword (Right)** · _weapon_ · `icons/weapons/swords/shortsword-guard-gold.webp`  
  One half of the Libra Cloth's Twin Swords (Sōken) — the right hand. 1d8 slashing, one hand each, sword group; agile, finesse, magical, twin, versatile P. An Arm always arrives as both weapons at once, one in each hand: summon or dismiss it with Summon an Arm. It can never be disarmed, sundered, or destroyed, and it accepts weapon runes normally. A Libra Saint uses their unarmed proficiency with…  
  **Icon brief** (Saint Seiya — Libra Cloth's twin swords): A golden straight double-edged sword with a winged guard, pointed up and angled to the right (mirror of the left).

### saint-effects (74)

- **Sky: Benefic** · _effect_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  The sky is kind. Today's sign carries a +1 circumstance bonus on its domain — the checks that constellation touches. The sky is terrain. It applies to every creature, not only to a Saint. Sign Automated on Also, by hand Aries initiative The first Strike you make in each encounter is also affected — the module adds it. Taurus fortitude, athletics Athletics to resist forced movement is also…  
  **Icon brief** (Homebrew (Saint class)): A calm night sky with one zodiac sign shining softly, a gentle golden ray falling down from it; a small plus-sign star on the horizon. Warm, kind tones.
- **Sky: Exalted** · _effect_ · `icons/magic/light/explosion-star-glow-orange.webp`  
  The sky is blazing. Today's sign carries a +2 circumstance bonus on its domain — the checks that constellation touches. The sky is terrain. It applies to every creature, not only to a Saint. Sign Automated on Also, by hand Aries initiative The first Strike you make in each encounter is also affected — the module adds it. Taurus fortitude, athletics Athletics to resist forced movement is also…  
  **Icon brief** (Homebrew (Saint class)): A night sky with one zodiac sign blazing like a sun, rays bursting outward and lighting the land gold-white; a double-plus star marker. Intense, triumphant.
- **Sky: Malefic** · _effect_ · `icons/magic/unholy/orb-hands-pink.webp`  
  The sky is hostile. Today's sign carries a -2 circumstance penalty on its domain — the checks that constellation touches. The sky is terrain. It applies to every creature, not only to a Saint. Sign Automated on Also, by hand Aries initiative The first Strike you make in each encounter is also affected — the module adds it. Taurus fortitude, athletics Athletics to resist forced movement is also…  
  **Icon brief** (Homebrew (Saint class)): A night sky with one zodiac sign burning blood-red behind dark clouds, a jagged hostile ray striking down; a double-minus star marker. Ominous, angry.
- **Sky: Retrograde** · _effect_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  The sky drags. Today's sign carries a -1 circumstance penalty on its domain — the checks that constellation touches. The sky is terrain. It applies to every creature, not only to a Saint. Sign Automated on Also, by hand Aries initiative The first Strike you make in each encounter is also affected — the module adds it. Taurus fortitude, athletics Athletics to resist forced movement is also…  
  **Icon brief** (Homebrew (Saint class)): A dim night sky where one zodiac sign drags backward on a looping arrow (retrograde motion), its stars smeared and dull; a single minus star marker.
#### Activities

- **Effect: Aiolos's Wings** · _effect_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-swirl-gold.svg`  
  Granted by Aiolos's Wings You have a fly Speed equal to twice your Speed, and you can Fly at full speed while attacking without penalty. Golden Arrow becomes a 1-action Technique that costs no Focus Point.  
  **Icon brief** (Saint Seiya — Sagittarius wings): A great pair of spread golden feathered wings blazing with light, a golden arrow drawn across them, the figure high in a dawn sky.
- **Effect: Aiolos's Wings (Shared)** · _effect_ · `modules/isaacs-hb-pf2e/icons/wind-stream-blue.svg`  
  Granted by Aiolos's Wings The Sagittarius Saint shares flight with you. You have a fly Speed equal to your own Speed for the duration.  
  **Icon brief** (Saint Seiya — Sagittarius wings): A small pair of golden feathered wings of light sprouting from an ally's shoulders, a single golden feather drifting down from them.
- **Effect: Arayashiki** · _effect_ · `icons/magic/death/skull-humanoid-crown-white-blue.webp`  
  Granted by Eighth Sense (Arayashiki) You keep acting for 1 minute or until the encounter ends. You cannot drop below 1 Hit Point; you are immune to death effects and to the dying, unconscious, and paralyzed conditions; and you ignore the wounded and drained conditions. When this ends you are dying 3 and your Cloth shatters. If the trigger killed you, you die when the minute ends. You may end it…  
  **Icon brief** (Saint Seiya — Arayashiki): A figure outlined in steady white-gold light standing upright while a dark shadow of death pours past and around it without taking hold.
- **Effect: Astral Body** · _effect_ · `icons/magic/perception/silhouette-stealth-shadow.webp`  
  A projected consciousness, not a creature. It is invisible to anything without a sixth sense or see invisibility , cannot be damaged or physically interacted with, and cannot attack. Created and removed by Astral Projection.  
  **Icon brief** (Saint Seiya — Saga's astral body): A translucent, ghostly blue-white double of a figure, glowing at the edges and see-through, floating slightly above the ground.
- **Effect: Astral Projection** · _effect_ · `icons/magic/perception/silhouette-stealth-shadow.webp`  
  Applied by Astral Projection Your consciousness is elsewhere. Your own body is unconscious and off-guard for the duration, and you perceive and speak through the astral body instead. You may cast mental Techniques through it, using its position as the origin — the module measures range and line of effect from the astral body for those, and from your own body for everything else. Damage to your…  
  **Icon brief** (Saint Seiya — astral projection): A body lying slumped and dim, with a thin silver cord of light rising from its chest to a faint glowing double far above.
- **Effect: Athena's Arsenal** · _effect_ · `icons/weapons/swords/sword-gold-holy.webp`  
  Applied by Athena's Arsenal: Overdrive. For 1 minute the twelve weapons circle you: you gain a +2 circumstance bonus to AC , and any creature that ends its turn adjacent to you takes 2d8[slashing] damage.  
  **Icon brief** (Saint Seiya — Libra Cloth's twelve weapons): Twelve golden weapons orbiting in a slow spinning ring, blades outward, forming a glittering cutting barrier around an empty center.
- **Effect: Athena's Arsenal (Overdrive)** · _effect_ · `icons/weapons/swords/sword-gold-holy.webp`  
  Applied by Athena's Arsenal: Overdrive for the length of the activity. Each of the six Strikes deals its weapon's damage plus 2d8, growing a die per heightening step, and each counts as the second weapon of its pair — so the twin bonus always applies.  
  **Icon brief** (Saint Seiya — Libra weapons volley): Six golden weapons — sword, trident, staff, nunchaku, tonfa, shield — flying outward in all directions like spokes, each leaving a white-hot streak.
- **Effect: Athena's Temper** · _effect_ · `icons/weapons/swords/sword-gold-holy.webp`  
  Applied by Athena's Temper. Every Libra weapon carries the property rune you chose this morning, until you choose again tomorrow. Automation note: the rune is added as a strike adjustment rather than etched onto the twelve items. pf2e trims a weapon's property runes to the number of potency slots it has in its own source data , and the Arms Advance grants their potency as an alteration rather…  
  **Icon brief** (Saint Seiya — Libra weapons): A golden weapon blade with a single rune burning on it in a bright color, the rune changing with a faint sunrise glow behind.
- **Effect: Burn Your Cosmo** · _effect_ · `icons/magic/light/explosion-star-glow-silhouette.webp`  
  Granted by Seventh Sense You have forced the sky's hand. Treat today as Exalted : your Zenith Boon is active for 1 minute. If the day was already Exalted, your Zenith Boon instead extends to all allies within 30 feet for 1 minute. Apply your Cloth's Sky: Zenith effect alongside this one for the duration, or use the sky tracker's Burn Cosmo control, which does it for you and reverts when the…  
  **Icon brief** (Saint Seiya — burning the cosmo to the Zenith): A constellation forced to blaze at its brightest, every star white-hot, a pillar of golden fire rising from below to meet it.
- **Effect: Chiron's Light Impulse** · _effect_ · `modules/isaacs-hb-pf2e/icons/beam-explosion-blue.svg`  
  Applied by Chiron's Light Impulse. You are wreathed in golden light for 1 minute. You gain a +1 status bonus to attack rolls, your attacks deal an extra 1d6[force] damage, and you gain a fly Speed of 20 feet — equal to your own Speed once the Saint reaches 14th level. Once during the duration, you may treat one attack roll or saving throw as though you had rolled a 10. The game offers it as a…  
  **Icon brief** (Saint Seiya (Episode G) — Aiolos's Chiron's Light Impulse): A figure wrapped in a cocoon of warm golden light, faint feathered shapes of a centaur bow's arrow guiding upward, a gentle golden glow rather than an attack.
- **Effect: Double Excalibur** · _effect_ · `modules/isaacs-hb-pf2e/icons/gladius.svg`  
  Applied by Double Excalibur for the length of the activity. Both Strikes gain the deadly d12 trait and ignore Hardness, resistance, and immunity to physical damage.  
  **Icon brief** (Saint Seiya — Shura's Excalibur (doubled)): Two crossed blades of white-gold light, edges sharp as razors, carving a clean X through solid rock.
- **Effect: Entrust Your Cosmo (1 Focus)** · _effect_ · `modules/isaacs-hb-pf2e/icons/hand-sparks-glow-orange.svg`  
  Granted by the Entrust Your Cosmo feat. A Saint has poured 1 Focus Point of their own cosmo into you. You gain a +1 status bonus to attack rolls, saving throws, and skill checks, and temporary Hit Points equal to the granting Saint's level. A creature can benefit from Entrust Your Cosmo only once per hour, no matter how many Saints offer it.  
  **Icon brief** (Saint Seiya — sharing cosmo): A single small golden flame passed from one glowing hand to another, a thin ribbon of light linking them.
- **Effect: Entrust Your Cosmo (2 Focus)** · _effect_ · `modules/isaacs-hb-pf2e/icons/hand-sparks-glow-orange.svg`  
  Granted by the Entrust Your Cosmo feat. A Saint has poured 2 Focus Points of their own cosmo into you. As 1 Focus Point, and your Strikes count as magical and deal an additional 1d6 damage of the granting Saint's Cloth element. A creature can benefit from Entrust Your Cosmo only once per hour, no matter how many Saints offer it.  
  **Icon brief** (Saint Seiya — sharing cosmo): Two golden flames flowing from one hand into another, the receiving fist beginning to glow with an elemental colour.
- **Effect: Entrust Your Cosmo (3 Focus)** · _effect_ · `modules/isaacs-hb-pf2e/icons/hand-sparks-glow-orange.svg`  
  Granted by the Entrust Your Cosmo feat. A Saint has poured 3 Focus Points of their own cosmo into you. As 2 Focus Points, and you are quickened 1 (Strike, Stride, or Step only), and you can see and act normally through any darkness, invisibility, or concealment. A creature can benefit from Entrust Your Cosmo only once per hour, no matter how many Saints offer it.  
  **Icon brief** (Saint Seiya — sharing cosmo): Three golden flames pouring in a river of light from one hand into another, the receiver blazing fully gold, darkness parting around them.
- **Effect: Excalibur** · _effect_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-gold.svg`  
  Granted by Excalibur Until the end of your turn, your unarmed Strikes deal slashing damage, gain the deadly d10 trait (d12 from 10th level), and ignore an object's Hardness. From 14th level they deal an additional 1d6 slashing damage, and 2d6 from 18th.  
  **Icon brief** (Saint Seiya — Shura's Excalibur): A forearm transformed into a gleaming holy blade of white-gold light, edge glowing, ready to cut.
- **Effect: Freezing Shield** · _effect_ · `modules/isaacs-hb-pf2e/icons/orb-ice-water.svg`  
  Applied by Freezing Shield. A dome of frozen air surrounds you for 1 minute. You and your allies inside gain cold resistance and a +2 circumstance bonus to AC against ranged attacks. Ranged and spell attacks crossing into the dome from outside take a −4 circumstance penalty. Any creature hostile to you that enters the dome or ends its turn inside it takes cold damage with a basic Fortitude save,…  
  **Icon brief** (Saint Seiya — Hyoga/Camus Freezing Shield): A translucent dome of frozen air and frost crystals, arrows freezing and stopping mid-flight against its surface.
- **Effect: Lightning Plasma (Second Action)** · _effect_ · `icons/magic/lightning/bolt-strike-forked-blue.webp`  
  Granted by Sky: Zenith (Leo). On a Zenith day the Lion gives you two extra actions each turn, usable only to Strike or Stride. The first is the quickened condition, which pf2e understands. This counter is the second. pf2e keeps no pool of actions — the sheet has no number to decrement — so the count is here, on the token, and it goes back to 1 at the start of each of your turns. Click it down…  
  **Icon brief** (Saint Seiya — Aiolia's Lightning Plasma): Two glowing lightning-bolt pips stacked like extra action tokens, behind them a dense lattice of golden lightning beams criss-crossing.
- **Effect: Om** · _effect_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-purple.svg`  
  Granted by the Virgo Cloth Passive, Virgo — Nearest to God Your eyes are closed. The blinded condition applies for as long as they are, and lifts the moment you open them. Increase this effect's value by 1 at the end of each of your turns, to a maximum of 5 (7 on a day Virgo is ascendant). While your eyes are closed you gain the value as a status bonus to your Technique DCs and to unarmed Strike…  
  **Icon brief** (Saint Seiya — Shaka's Om): Closed eyes drawn as gold arcs, a counter of small glowing beads gathering in a mala-like ring around them as the held cosmo builds.
- **Effect: Pleiades Nova** · _effect_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Applied for the duration of the volley by Pleiades Nova Each Strike deals force damage, and every Strike after the first takes a cumulative −1 penalty as the light scatters.  
  **Icon brief** (Saint Seiya — Aldebaran's Pleiades): Seven blue-white points of light (the Pleiades cluster) scattering outward from a single fist, each fainter than the last.
- **Effect: Rise** · _effect_ · `modules/isaacs-hb-pf2e/icons/heart-cross-strong-flame-red.svg`  
  Granted by the Rise feat. You refused to fall. You are at 1 Hit Point and wounded 1 (or your wounded value increased by 1).  
  **Icon brief** (Saint Seiya — 'a Saint always rises'): A cracked, battered golden gauntlet pushing up off the ground, a single thin line of light along the cracks, dust falling away.
- **Effect: Rising Cosmo** · _effect_ · `modules/isaacs-hb-pf2e/icons/explosion-star-glow-orange-purple.svg`  
  Granted by the Rising Cosmo feat. Increase this effect's value by 1 each time you are critically hit, are reduced to half Hit Points or lower for the first time, or are reduced to 0 Hit Points (maximum 3). You gain the value as a status bonus to unarmed Strike damage and to your Technique DCs. At 2 or more you also gain a +1 status bonus to attack rolls and saving throws. At 3, once per round you…  
  **Icon brief** (Saint Seiya — cosmo burning brighter as the Saint is hurt): A cracked golden aura through whose cracks brighter white light pours, three stacked flame tiers growing larger from bottom to top.
- **Effect: Rose-Marked** · _effect_ · `modules/isaacs-hb-pf2e/icons/rose-thorned-red.svg`  
  Granted by Royal Funeral. From the rose's colour you know the marked creature's exact current Hit Points, reported at the start of each of your turns. Ends when the encounter does.  
  **Icon brief** (Saint Seiya — Aphrodite's roses): A single rose pinned to a creature, its petals' colour shifting from white to deep red like a gauge showing how much life remains.
- **Effect: Rozan Ryū Hi Shō** · _effect_ · `icons/magic/water/wave-water-blue.webp`  
  Applied by Rozan Ryū Hi Shō for the length of the activity. The Strike made during the flight deals additional damage — 6d8 at 11th level, and one die more per heightening step, a lit sky included.  
  **Icon brief** (Saint Seiya — Shiryu's Rozan Ryū Hi Shō): A soaring green-gold dragon of cosmo carrying a fist upward in a spiral flight, mist and spray streaming behind it.
- **Effect: Second Ascension** · _effect_ · `icons/magic/light/beams-rays-orange-purple-large.webp`  
  Granted by the Second Ascension feat. For 1 minute, treat the day as though your constellation were ascendant (or Exalted, if it was already ascendant). Apply the matching Sky effect for the duration.  
  **Icon brief** (Saint Seiya — the sky obeys): A constellation pulled up over the horizon by a beam of golden will, the stars lighting one by one, a sky that was dim now gold.
- **Effect: Soul Consumed** · _effect_ · `icons/magic/death/undead-ghost-strike-white.webp`  
  Reduced to 0 Hit Points by Sekishiki Kisōen. The demonic blue flames fed on this creature's soul as they burned. It cannot be raised by any effect below resurrect .  
  **Icon brief** (Saint Seiya — Manigoldo's Sekishiki Kisōen): A ghostly soul-shape engulfed and consumed by demonic blue onibi flames, only a hollow outline of ash left behind.
- **Effect: Speed of Light** · _effect_ · `icons/magic/movement/trail-streak-zigzag-yellow.webp`  
  Granted by the Speed of Light feat. You are quickened 1 for 1 minute; the extra action can be used only to Strike, Stride, or Step. You also do not trigger reactions based on your movement — you are simply not where the reaction expected you to be.  
  **Icon brief** (Saint Seiya — light-speed movement): A figure reduced to a streak of pure golden light, multiple faint afterimages along its path, a reaching enemy hand closing on empty air.
- **Effect: Tenpōrin'in** · _effect_ · `icons/magic/light/explosion-star-glow-silhouette.webp`  
  Applied by Tenpōrin'in to the Saint and every ally in the emanation. You gain a status bonus to Will saves and to saves against mental effects, and you are immune to the fascinated and frightened conditions. The bonus is +1, +2 from the Saint's 12th level, and +3 from their 18th — and the immunity extends to confused from 12th. All four numbers are the caster's , not yours, so they are written in…  
  **Icon brief** (Saint Seiya — Shaka's Tenpōrin (wheel of dharma)): A golden eight-spoked dharma wheel turning slowly, a calm aura of light spreading outward over several small figures, frightening shadows fleeing from the edges.
- **Effect: Titan's Stance** · _effect_ · `icons/creatures/abilities/bull-head-horns-glowing.webp`  
  Granted by Titan's Stance You took the blow meant for an ally. Reduce the damage by 10 plus twice your level.  
  **Icon brief** (Saint Seiya — Aldebaran's guard): Two massive golden forearms crossed in a block, a huge blow shattering on them in a spray of light, a small figure sheltered behind.
#### Lent Arms

- **Effect: The Twelve Arms (Nunchaku)** · _effect_ · `icons/weapons/misc/nunchaku.webp`  
  Granted by The Twelve Arms. The Libra Saint has put the Nunchaku in your hands — both of them, one per hand, because an Arm is a matched pair and never arrives as half of one. While you hold them you use the Saint's weapon proficiency, the weapons carry the Saint's full Arms Advance — potency and damage dice, whatever tier the Saint has reached, a lit sky included — their Cosmo Strike bonus, and…  
  **Icon brief** (Saint Seiya — Libra Cloth's nunchaku (lent)): A pair of golden nunchaku descending from a beam of light into an ally's open hands, Libra scales glyph glowing above.
- **Effect: The Twelve Arms (Sanjiegun)** · _effect_ · `icons/weapons/staves/staff-simple.webp`  
  Granted by The Twelve Arms. The Libra Saint has put the Sanjiegun in your hands — both of them, one per hand, because an Arm is a matched pair and never arrives as half of one. While you hold them you use the Saint's weapon proficiency, the weapons carry the Saint's full Arms Advance — potency and damage dice, whatever tier the Saint has reached, a lit sky included — their Cosmo Strike bonus, and…  
  **Icon brief** (Saint Seiya — Libra Cloth's three-section staffs (lent)): A pair of golden three-section staffs descending from a beam of light into an ally's hands, chains unspooling.
- **Effect: The Twelve Arms (Shields)** · _effect_ · `icons/equipment/shield/heater-steel-gold.webp`  
  Granted by The Twelve Arms. The Libra Saint has put the Shields in your hands — both of them, one per hand, because an Arm is a matched pair and never arrives as half of one. While you hold them you use the Saint's weapon proficiency, the weapons carry the Saint's full Arms Advance — potency and damage dice, whatever tier the Saint has reached, a lit sky included — their Cosmo Strike bonus, and…  
  **Icon brief** (Saint Seiya — Libra Cloth's shields (lent)): A pair of round golden Libra shields descending from a beam of light onto an ally's forearms.
- **Effect: The Twelve Arms (Tonfa)** · _effect_ · `icons/weapons/clubs/baton-night-stick-truncheon.webp`  
  Granted by The Twelve Arms. The Libra Saint has put the Tonfa in your hands — both of them, one per hand, because an Arm is a matched pair and never arrives as half of one. While you hold them you use the Saint's weapon proficiency, the weapons carry the Saint's full Arms Advance — potency and damage dice, whatever tier the Saint has reached, a lit sky included — their Cosmo Strike bonus, and you…  
  **Icon brief** (Saint Seiya — Libra Cloth's tonfa (lent)): A pair of golden tonfa descending from a beam of light into an ally's hands, spinning once as they arrive.
- **Effect: The Twelve Arms (Tridents)** · _effect_ · `icons/weapons/polearms/trident-silver-red.webp`  
  Granted by The Twelve Arms. The Libra Saint has put the Tridents in your hands — both of them, one per hand, because an Arm is a matched pair and never arrives as half of one. While you hold them you use the Saint's weapon proficiency, the weapons carry the Saint's full Arms Advance — potency and damage dice, whatever tier the Saint has reached, a lit sky included — their Cosmo Strike bonus, and…  
  **Icon brief** (Saint Seiya — Libra Cloth's tridents (lent)): A pair of golden tridents descending from a beam of light into an ally's hands, prongs pointing up.
- **Effect: The Twelve Arms (Twin Swords)** · _effect_ · `icons/weapons/swords/shortsword-guard-gold.webp`  
  Granted by The Twelve Arms. The Libra Saint has put the Twin Swords in your hands — both of them, one per hand, because an Arm is a matched pair and never arrives as half of one. While you hold them you use the Saint's weapon proficiency, the weapons carry the Saint's full Arms Advance — potency and damage dice, whatever tier the Saint has reached, a lit sky included — their Cosmo Strike bonus,…  
  **Icon brief** (Saint Seiya — Libra Cloth's twin swords (lent)): A pair of golden swords descending point-down from a beam of light into an ally's hands.
#### Riders

- **Effect: Aura Tick** · _effect_ · `icons/svg/aura.svg`  
  Content-free by design. This is the item a Saint's Aura rule element points at so pf2e's own aura check has something to grant and take back as a creature crosses the line or ends its turn inside — the mechanism, not the message. The module reads its creation, works out which of the Saint's own effects is carrying the actual tick — the damage, the save, the condition — applies that, and deletes…  
  **Icon brief** (Homebrew (Saint class)): A thin ring of faint golden cosmo on the ground with one small spark crossing its edge: a plain aura border marker, simple and low-detail, gold line on a dark background.
- **Effect: Bleeding from The Crossing** · _effect_ · `icons/weapons/swords/shortsword-guard-gold.webp`  
  Granted by The Crossing at 14th level. The Twin Swords crossed in this creature, and the wound will not close. It receives only half the Hit Points from any healing while it is bleeding from The Crossing. Automation note: pf2e has no modifier that multiplies healing, so the halving is applied to the Hit Points that actually landed, and said out loud in chat each time.  
  **Icon brief** (Saint Seiya — Rozan Jūjiken): A deep X-shaped wound glowing red on a creature, the crossing still bleeding light, healing motes bouncing off it and only half sinking in.
- **Effect: Crimson Mirage** · _effect_ · `icons/magic/control/hypnosis-mesmerism-eye-tan.webp`  
  Applied by Crimson Mirage. For 1 minute this creature is dazzled , treats all other creatures as concealed , and takes mental damage at the end of each of its turns — one die per needle currently in it. The dazzled and the damage are applied for you. The concealment is a note: pf2e resolves concealment from the attacker's side, as a DC 5 flat check the attacker rolls, and there is no rule element…  
  **Icon brief** (Saint Seiya — Milo's Scarlet Needle (crimson haze)): A creature seen through a shimmering crimson haze, its vision blurred into red doubled shapes, small red needle-points pulsing on its body.
- **Effect: Reactions Denied** · _effect_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  Applied by Tenma Kōfuku on a critical failure. You cannot use reactions. pf2e has no condition for this and no gate on a reaction being taken, so the effect is the enforcement: it sits on the token with its own timer, and it says so on every roll the creature makes. Nothing else in the system can refuse the reaction, which is recorded here rather than quietly dropped.  
  **Icon brief** (Saint Seiya — Shaka's Tenma Kōfuku (rider)): A creature's raised guard frozen in place, wrapped in pale gold Sanskrit-script bands of light; a small crossed-out lightning-arrow symbol for a reaction that can't fire.
- **Effect: Runes Severed** · _effect_ · `icons/skills/melee/strike-dagger-blood-red.webp`  
  Applied by the fourteenth Scarlet Needle. This creature's Strikes lose all runes. The fundamental runes are taken here — potency and striking both drop to nothing — which is where a weapon's numbers actually live. pf2e has no alteration that clears property runes in one move, only ones that remove a named rune, so a flaming or a ghost touch rune stays until the GM takes it off. An NPC's Strikes…  
  **Icon brief** (Saint Seiya — Milo's fourteenth Scarlet Needle): A sword blade whose glowing engraved runes are bursting off it in fragments, each struck through by a crimson needle-point of light; the runes fade to dull grey steel.
- **Effect: Scarlet Needle** · _effect_ · `icons/skills/melee/strike-dagger-blood-red.webp`  
  Applied by Scarlet Needle, by Place a Scarlet Needle, by Crimson Flurry, and by both Scorpio skies. The badge counts the needles currently in this creature . That is the whole tracker: needles are per-creature by definition, and every creature carries its own. The count crosses three thresholds by itself, once each: at 5 the creature is enfeebled 1, at 10 it is blinded, and at 14 it is stunned 2…  
  **Icon brief** (Saint Seiya — Milo's Scarlet Needle): A patch of skin with several small crimson puncture points, joined by faint red lines into the hooked tail of the Scorpius constellation; a single drop of blood under the brightest point.
- **Effect: Sense Lost (Smell and Taste)** · _effect_ · `icons/magic/air/wind-vortex-swirl-purple.webp`  
  Applied by Sky: Ascendant (Virgo). The creature has lost its sense of smell and taste. It cannot detect creatures or objects by scent, and anything requiring taste automatically fails. Senses lost this way return only through restoration or a full night's rest.  
  **Icon brief** (Saint Seiya — Shaka's Tenbu Hōrin (sense stripped)): A nose and lips shape outlined in pale gold, dissolving into drifting lotus petals; a faint dharma-wheel ring behind them shows a sense being taken away.
- **Effect: Sense Lost (Touch)** · _effect_ · `modules/isaacs-hb-pf2e/icons/hand-magic-glow-pink.svg`  
  Applied by Sky: Ascendant (Virgo). The creature has lost its sense of touch: it takes a −4 penalty to attack rolls and cannot Grapple. Senses lost this way return only through restoration or a full night's rest.  
  **Icon brief** (Saint Seiya — Shaka's Tenbu Hōrin (sense stripped)): An open hand turning grey and translucent from the fingertips, its outline crumbling into golden motes; a numb, colourless hand set against a pale gold wheel of light.
- **Effect: Severed (Limb)** · _effect_ · `icons/skills/wounds/bone-broken-marrow-red.webp`  
  Severed by Capricorn — Excalibur's The Sharpest Sword . The creature has permanently lost the use of one limb, until it receives regenerate .  
  **Icon brief** (Saint Seiya — Shura's Excalibur (severed)): A limb's silhouette cut cleanly by a single straight line of golden light, the lower part fading to shadow; a razor-thin gold slash mark across the cut.
- **Effect: Severed (Natural Attack)** · _effect_ · `icons/skills/melee/strike-slashes-orange.webp`  
  Severed by Capricorn — Excalibur's The Sharpest Sword . The creature has permanently lost one natural attack, until it receives regenerate .  
  **Icon brief** (Saint Seiya — Shura's Excalibur (severed)): A beast's claw or fang split cleanly in two by a hair-thin line of golden light, one half falling away into dust.
- **Effect: Severed (Sense)** · _effect_ · `icons/magic/perception/eye-slit-orange.webp`  
  Severed by Capricorn — Excalibur's The Sharpest Sword . The creature has permanently lost one sense, until it receives regenerate .  
  **Icon brief** (Saint Seiya — Shura's Excalibur (severed)): An eye symbol bisected by a single horizontal golden slash, the lower half going dark: a sense cut away by the holy sword's edge.
- **Effect: The Scorpion's Blessing** · _effect_ · `icons/skills/melee/strike-dagger-blood-red.webp`  
  Granted for the day by Sky: Zenith (Scorpio) to every ally of the Scorpio Saint. Your hits place a Scarlet Needle in whatever you hit — the Scorpion's count, not yours. Everything the needles then do is the Saint's Cloth doing it.  
  **Icon brief** (Saint Seiya — Milo's Scarlet Needle (shared)): A weapon striking, with a crimson scorpion-tail sting of light coiled around its tip like a ribbon; a red needle-point spark at the impact.
#### Sky: Ascendant

- **Sky: Ascendant (Aquarius)** · _effect_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  ♒ Aquarius is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Any cold damage you deal forces a Fortitude save against your Cosmo DC; on a failure the creature is slowed 1. This is cumulative — at slowed 4 it is instead petrified in ice , which any critical hit shatters. Your cold damage…  
  **Icon brief** (Saint Seiya — Camus's Aquarius cosmo): The Aquarius water-bearer constellation rising over a frozen horizon, a jar of light tipped and pouring a stream of ice crystals that frosts the ground; dawn-blue, pale gold stars.
- **Sky: Ascendant (Aries)** · _effect_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  ♈ Aries is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. You gain a +2 status bonus to AC and to all saving throws. Star Guard ↩ (reaction; once per round; trigger a creature within 60 feet makes a ranged or spell attack, or targets an ally with a spell) — the effect goes nowhere . It is…  
  **Icon brief** (Saint Seiya — Mu's Aries cosmo): The Aries constellation rising over the horizon, framed by a pair of curled ram horns of light; a faint crystal-wall pane shimmering in front of the rising stars.
- **Sky: Ascendant (Cancer)** · _effect_ · `icons/magic/death/hand-dirt-undead-zombie.webp`  
  ♋ Cancer is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Any creature you reduce to 0 Hit Points dies , with no save. Once per round as a free action, a creature within 30 feet at or below half Hit Points must attempt a Fortitude save against your Cosmo DC or take 8d6[void] damage and be…  
  **Icon brief** (Saint Seiya — Deathmask's Cancer cosmo): The Cancer constellation rising over a grey ashen hill, the Praesepe cluster glowing as a cloud of tiny blue will-o'-wisps drifting upward.
- **Sky: Ascendant (Capricorn)** · _effect_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-gold.svg`  
  ♑ Capricorn is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Your unarmed Strikes ignore all resistances, physical immunities, and Hardness , and gain +1 damage die. On a critical hit you may sever a limb, a sense, or a natural attack until the target receives regenerate . You Strike…  
  **Icon brief** (Saint Seiya — Shura's Capricorn cosmo): The Capricorn sea-goat constellation rising, its brightest stars joined by one long straight golden blade-line that cuts the horizon in two.
- **Sky: Ascendant (Gemini)** · _effect_ · `icons/magic/control/energy-stream-link-spiral-teal.webp`  
  ♊ Gemini is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Once per round you may cast your Signature Technique without spending a Focus Point. Galaxian Explosion's burst increases by 20 feet. Granted by Ascendant Constellation. Applied and removed by the module's sky tracker; a GM can also…  
  **Icon brief** (Saint Seiya — Saga's Gemini cosmo): The Gemini twin constellation rising as two mirrored star figures, one gold and one shadow-violet, with a thin crack of warped space between them.
- **Sky: Ascendant (Leo)** · _effect_ · `icons/magic/lightning/bolt-strike-forked-blue.webp`  
  ♌ Leo is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Your fists gain the agile trait and deal an additional 1d6[electricity] damage. You gain an extra action each turn, usable only to Strike or Stride. This applies the quickened condition; the Strike-or-Stride restriction is yours to…  
  **Icon brief** (Saint Seiya — Aiolia's Leo cosmo): The Leo constellation rising behind the horizon, its stars linked by crackling gold lightning in the shape of a roaring lion's head.
- **Sky: Ascendant (Libra)** · _effect_ · `icons/weapons/swords/sword-guard-blue.webp`  
  ♎ Libra is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. The Balance You may wield one weapon from each of two different Arms at once and gain both their Arts; the two count as a matched pair for the twin trait. Summon an Arm no longer sets down the Arm you were holding, so calling a second…  
  **Icon brief** (Saint Seiya — Dohko's Libra cosmo): The Libra constellation rising as a set of golden balance scales, its two pans each holding a crossed pair of small weapons; a jade-green glow beneath.
- **Sky: Ascendant (Pisces)** · _effect_ · `modules/isaacs-hb-pf2e/icons/rose-thorned-red.svg`  
  ♓ Pisces is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. You radiate a 10-foot emanation of roses. At the end of each of your turns, enemies inside must attempt a Fortitude save against your Cosmo DC or take 4d6[poison] damage and become enfeebled 1 (cumulative to enfeebled 4). Cap 4…  
  **Icon brief** (Saint Seiya — Aphrodite's Pisces cosmo): The Pisces constellation rising as two star-fish joined by a cord, trailing a loose ring of drifting red rose petals around the horizon.
- **Sky: Ascendant (Sagittarius)** · _effect_ · `icons/weapons/ammunition/arrow-head-war-flight.webp`  
  ♐ Sagittarius is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. You gain a fly Speed equal to your Speed. Golden Arrow's range increment becomes one mile ; it ignores all cover, concealment, and the hidden and undetected conditions, and can strike any creature whose location you can name even…  
  **Icon brief** (Saint Seiya — Aiolos's Sagittarius cosmo): The Sagittarius archer constellation rising, its stars forming a drawn bow with a single golden arrow nocked toward the sky; feathers of light at the bottom.
- **Sky: Ascendant (Scorpio)** · _effect_ · `icons/skills/wounds/injury-triple-slash-bleed.webp`  
  ♏ Scorpio is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Needles land on any attack you make against a creature, hit or miss. Each needle deals 1d6[persistent,bleed] damage, stacking, capped at 10 needles of bleed. At 8 needles the creature must attempt a Fortitude save against your Cosmo…  
  **Icon brief** (Saint Seiya — Milo's Scorpio cosmo): The Scorpio constellation rising in a curve over the horizon, its red heart-star Antares glowing deep crimson and its tail raised to sting.
- **Sky: Ascendant (Taurus)** · _effect_ · `modules/isaacs-hb-pf2e/icons/bull-horns-brown.svg`  
  ♉ Taurus is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Your unarmed Strikes gain +1 damage die , and a creature you hit must attempt a Fortitude save against your Cosmo DC or be pushed 10 feet and knocked prone. You count as one size larger whenever it benefits you. Granted by Ascendant…  
  **Icon brief** (Saint Seiya — Aldebaran's Taurus cosmo): The Taurus constellation rising as a bull's head of stars with long horns, the red eye-star Aldebaran bright; dust kicked up below as if from a charge.
- **Sky: Ascendant (Virgo)** · _effect_ · `icons/magic/control/energy-stream-link-white.webp`  
  ♍ Virgo is ascendant today. Your Cloth is awake. For the whole day your Techniques heighten as though you were 4 levels higher , and you have your Ascendant Boon. Each time you hit with an unarmed Strike, the target must attempt a Will save against your Cosmo DC or lose a sense. Losses are cumulative: sight (blinded), hearing (deafened), smell and taste, then touch (−4 to attack rolls, cannot…  
  **Icon brief** (Saint Seiya — Shaka's Virgo cosmo): The Virgo constellation rising out of an opening golden lotus, its stars faint and serene; a soft halo of light behind, like a closed eye.
#### Sky: Zenith

- **Sky: Zenith (Aquarius)** · _effect_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  ♒ Aquarius rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. As the Ascendant Boon, plus Aurora Execution once per minute ◆◆◆: 60-foot line, 16d6[cold] damage, basic Fortitude; a critical failure leaves the creature frozen solid (petrified, shatterable). Incapacitation.…  
  **Icon brief** (Saint Seiya — Camus's Aurora Execution): The Aquarius constellation blazing directly overhead at the top of the sky, pouring a torrent of aurora-coloured absolute-zero cold straight down; a green-blue aurora curtain.
- **Sky: Zenith (Aries)** · _effect_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  ♈ Aries rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. You gain a +2 status bonus to AC and to all saving throws. Star Guard ↩ (reaction; no frequency limit ), and Dimension Step ◆ (teleport 60 feet). Once per minute you may instead target a creature within 60 feet:…  
  **Icon brief** (Saint Seiya — Mu's Aries cosmo (Zenith)): The Aries constellation blazing at the zenith, its ram horns forming a full circle of light, with a crystal dome hanging under it that bends incoming attacks away.
- **Sky: Zenith (Cancer)** · _effect_ · `icons/magic/death/hand-dirt-undead-zombie.webp`  
  ♋ Cancer rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. As the Ascendant Boon, plus The Yellow Spring Is Here — usable once today . 30-foot emanation: every enemy at half Hit Points or fewer must attempt a Fortitude save against your Cosmo DC or die . Incapacitation.…  
  **Icon brief** (Saint Seiya — Deathmask's Yellow Spring): The Cancer constellation blazing at the top of the sky; directly beneath it the pit of Yomotsu Hirasaka is wide open, a column of blue souls being drawn up into the stars.
- **Sky: Zenith (Capricorn)** · _effect_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-gold.svg`  
  ♑ Capricorn rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. As the Ascendant Boon. In addition, once per turn per creature you may use a reaction when a creature attacks you or a spell enters your space to sever it — it has no effect. Granted by Ascendant Constellation.…  
  **Icon brief** (Saint Seiya — Shura's Excalibur (Zenith)): The Capricorn constellation at the zenith, turned entirely into a single colossal golden sword pointing down, its edge splitting the sky from top to bottom.
- **Sky: Zenith (Gemini)** · _effect_ · `icons/magic/control/energy-stream-link-spiral-teal.webp`  
  ♊ Gemini rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. As the Ascendant Boon. In addition, a duplicate of you appears in an adjacent space at the start of each of your turns. It has your statistics, acts on your initiative with 2 actions and can only Strike and Stride…  
  **Icon brief** (Saint Seiya — Saga's Gemini cosmo (Zenith)): The Gemini twins at the top of the sky, both blazing equally gold, stepping out of the stars as two identical glowing silhouettes side by side.
- **Sky: Zenith (Leo)** · _effect_ · `icons/magic/lightning/bolt-strike-forked-blue.webp`  
  ♌ Leo rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher, and you have your Zenith Boon. Your fists gain the agile trait and deal an additional 3d6[electricity] damage. You gain two extra actions each turn, usable only to Strike or Stride. The first is the quickened condition, applied for you. The second…  
  **Icon brief** (Saint Seiya — Aiolia's Lightning Plasma (Zenith)): The Leo constellation directly overhead, a full blazing lion's head of gold light sending a dense lattice of lightning beams down in every direction.
- **Sky: Zenith (Libra)** · _effect_ · `icons/weapons/swords/sword-guard-blue.webp`  
  ♎ Libra rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. The Balance (Zenith) As the Ascendant Boon, except you wield all six Arms at once — the Cloth holds what your hands cannot — gaining every Art simultaneously. Summon an Arm never sets anything down today, so…  
  **Icon brief** (Saint Seiya — Dohko's Libra Arsenal (Zenith)): The Libra scales blazing at the zenith, all twelve gold weapons (swords, tridents, staffs, nunchaku, tonfa, shields) orbiting the scales in a full ring.
- **Sky: Zenith (Pisces)** · _effect_ · `modules/isaacs-hb-pf2e/icons/rose-thorned-red.svg`  
  ♓ Pisces rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. As the Ascendant Boon, but the emanation is 15 feet and deals 8d6[poison] damage each turn. Plus Bloody Rose once per minute ◆◆ ( incapacitation , death): 60 feet, one creature, Fortitude save; on a failure…  
  **Icon brief** (Saint Seiya — Aphrodite's Bloody Rose (Zenith)): The Pisces constellation blazing overhead, a whirlwind of red roses falling in a spiral, with one white rose at the centre turning red from its base.
- **Sky: Zenith (Sagittarius)** · _effect_ · `icons/weapons/ammunition/arrow-head-war-flight.webp`  
  ♐ Sagittarius rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher, and you have your Zenith Boon. You gain a fly Speed equal to your Speed. As the Ascendant Boon, plus once per minute Golden Arrow: Named Shot: any creature you can name within a mile, through any barrier short of a planar boundary, takes…  
  **Icon brief** (Saint Seiya — Aiolos's Golden Arrow (Zenith)): The Sagittarius constellation at the top of the sky as a full drawn bow, firing a single golden arrow straight down with a long blazing trail across the night.
- **Sky: Zenith (Scorpio)** · _effect_ · `icons/skills/wounds/injury-triple-slash-bleed.webp`  
  ♏ Scorpio rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher, and you have your Zenith Boon. Needles land on any attack you make against a creature, hit or miss. Each needle deals 1d6[persistent,bleed] damage, stacking, capped at 10 needles of bleed. At 5 needles the creature must attempt a Fortitude save…  
  **Icon brief** (Saint Seiya — Milo's Antares (Zenith)): The Scorpio constellation blazing overhead, its red star Antares swollen and pulsing like a heart; crimson light lines fall from each star like needles.
- **Sky: Zenith (Taurus)** · _effect_ · `modules/isaacs-hb-pf2e/icons/bull-horns-brown.svg`  
  ♉ Taurus rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. Your unarmed Strikes gain +2 damage dice , and a creature you hit must attempt a Fortitude save against your Cosmo DC or be pushed 10 feet and knocked prone. You count as one size larger whenever it benefits you,…  
  **Icon brief** (Saint Seiya — Aldebaran's Great Horn (Zenith)): The Taurus constellation at the top of the sky blazing gold, the bull's horns lowered and a huge golden shockwave charging down toward the ground.
- **Sky: Zenith (Virgo)** · _effect_ · `icons/magic/control/energy-stream-link-white.webp`  
  ♍ Virgo rises Exalted today. This is the one day in a hundred and thirty. For the whole day your Techniques heighten as though you were 8 levels higher , and you have your Zenith Boon. As the Ascendant Boon, plus once per minute ◆◆◆, 60-foot emanation, Will save against your Cosmo DC or lose all five senses for 1 minute; a critical failure lasts until restoration . Incapacitation. Granted by…  
  **Icon brief** (Saint Seiya — Shaka's Virgo cosmo (Zenith)): The Virgo constellation blazing overhead as a gigantic open golden lotus with an eye opening at its centre; six faint rings of the six realms around it.

### saint-feats (28)

#### Level 1

- **Cosmo Sense** · _feat_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  By reading the microcosm of a creature, you gauge the macrocosm it can call on. Cosmo Sense ◆ (single action) Attempt a check to Recall Knowledge about a creature within 60 feet, using your key ability modifier in place of the relevant skill. Success You learn its level relative to yours (higher, equal, or lower) and its single highest and lowest saving throws. Critical Success As success, and…  
  **Icon brief** (Homebrew (Saint class)): A small glowing sphere (microcosm) held between two fingers, reflecting a vast swirling galaxy (macrocosm) inside it; a faint scanning ring around it.
- **Fists of the Constellation** · _feat_ · `modules/isaacs-hb-pf2e/icons/orb-lightning-purple.svg`  
  You channel your Signature Technique through your fists, letting its essence bleed into every strike. Choose one damage type dealt by your Cloth's Signature Technique — electricity for Leo, cold for Aquarius, force by default. Your unarmed Strikes deal that damage type instead of bludgeoning, and they count as your Signature Technique's element for your own feats and boons that reference it. Once…  
  **Icon brief** (Homebrew (Saint class)): A clenched gold-gauntleted fist with a small glowing constellation of star points and connecting lines across the knuckles, sparking with the signature element.
- **Pandora Box** · _feat_ · `modules/isaacs-hb-pf2e/icons/chest-reinforced-steel-gold.svg`  
  Your dismissed Cloth is not merely stored — it is sent , and it can find you again across any distance. When you dismiss your Cloth, you may send it to a pocket of folded space instead of collapsing it into a box or onto your body. While there it is beyond the reach of any effect. As an activity taking 10 minutes , you may summon it to your current location from anywhere on the same plane; from…  
  **Icon brief** (Saint Seiya — Pandora Box): A square metal Cloth box with a constellation emblem embossed on its lid and leather shoulder straps, half-sunk into a fold of starry space as if sent through it.
- **Saint's Vow** · _feat_ · `icons/magic/holy/saint-glass-portrait-halo.webp`  
  You swear to protect one person, and the oath sharpens you against whatever threatens them. Choose one ally during your daily preparations; they are the target of your Vow until your next preparations. You gain a +1 circumstance bonus to attack rolls against any creature that has damaged the target of your Vow, or attempted to inflict a condition on them, since the end of your last turn.…  
  **Icon brief** (Homebrew (Saint class)): Two hands clasped in an oath, a thin golden thread of cosmo linking one wrist to a protected figure's silhouette; a small shield-shaped star between them.
#### Level 10

- **Cosmo Legend** · _feat_ · `icons/magic/light/explosion-star-large-orange-purple.webp`  
  Your Techniques burn at the full furnace of your cosmo, not half. All your Techniques gain one additional heightening step , as though you were 2 levels higher than you are. This applies to every Technique you know, at every slot. Balance note: this is deliberately a capstone-tier feat — roughly +15% Technique output, and it stacks with Cloth Attunement at 17th for two steps. Watch it in play.  
  **Icon brief** (Homebrew (Saint class)): A roaring furnace of golden cosmo shaped like a burning star, with a small technique glyph at its heart and flames climbing past the frame.
- **Cosmo Overflow** · _feat_ · `icons/magic/light/explosion-star-glow-orange.webp`  
  Your inner cosmo runs over its banks. On the days the sky ignores you, you compensate through sheer output; on the days it favours you, you become a furnace. Cosmo Overflow ◆◆ (two actions) Frequency once per hour You cast a Technique you know of 2 actions or fewer without spending a Focus Point . On any day your Cloth's constellation is ascendant or Exalted, the frequency increases to once per…  
  **Icon brief** (Homebrew (Saint class)): A golden cosmo aura overflowing its outline like water over a dam, spilling in waves of light from a glowing core.
- **Golden Cosmo** · _feat_ · `modules/isaacs-hb-pf2e/icons/beams-rays-orange.svg`  
  Your cosmo answers not only to your own star but to the ones beside it. On any day one of the two constellations adjacent to yours in the zodiac is ascendant, you gain your Ascendant Boon at half effect : halve any bonus, extra damage die, extra action, or emanation radius it grants (minimum 1 where the boon grants a number), and any frequency of once per round becomes once per minute. If an…  
  **Icon brief** (Homebrew (Saint class)): A golden constellation in the centre with its two neighbouring zodiac constellations on either side glowing at half brightness, linked to it by thin gold lines.
#### Level 12

- **Cloth Resonance** · _feat_ · `modules/isaacs-hb-pf2e/icons/breastplate-collared-steel-gold.svg`  
  Your bond with your Cloth has deepened past armor into a second body. Its runes, its history, and your cosmo have become one thing, and it answers your intent before your mind forms it. Choose two benefits from the list below; you gain both. You may retrain to swap one whenever you gain a level. Reactive Cloth — your Cloth's AC bonus applies even in the brief instants surprise would deny it to…  
  **Icon brief** (Homebrew (Saint class)): A piece of gold armour plate with glowing engraved runes pulsing in time with a heartbeat-shaped line of cosmo running through it.
- **Second Ascension** · _feat_ · `icons/magic/light/beams-rays-orange-purple-large.webp`  
  For a moment, by sheer will, you make the sky obey. Frequency three times per week For 1 minute , treat the day as though your Cloth's constellation were ascendant, gaining your Ascendant Boon. If your sign is already ascendant but not Exalted, you may instead spend this to treat the day as Exalted for 1 minute, gaining your Zenith Boon. You cannot use Second Ascension and Seventh Sense's Burn…  
  **Icon brief** (Homebrew (Saint class)): A fist raised toward the sky, pulling a single zodiac constellation down so it shines directly above, a burst of will-light around the fist.
#### Level 14

- **Rising Cosmo** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-star-glow-orange-purple.svg`  
  Every Saint learns the same truth on the edge of defeat: the more you are hurt, the brighter you burn. As the fight turns against you, your cosmo climbs — and the wounds that should end you become the fuel that answers back. You gain a rising bonus that starts at 0 and increases by 1 each time you are critically hit, are reduced to half your Hit Points or lower for the first time, or are reduced…  
  **Icon brief** (Saint Seiya — the Seventh Sense awakening): A cracked, battered gold gauntlet blazing brighter where the cracks are, flames of cosmo climbing out of the damage.
- **Speed of Light** · _feat_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  You cross the distance between two heartbeats. Frequency once per day You are quickened 1 for 1 minute . You can use the extra action each round only to Strike, Stride, or Step. While quickened this way you also do not trigger reactions based on your movement — you are simply not where the reaction expected you to be.  
  **Icon brief** (Saint Seiya — light-speed Gold Saints): A golden afterimage streak crossing the frame in an instant, a straight line of light with trailing sparks and a faint heartbeat line beneath.
#### Level 16

- **Atomic Dissolution** · _feat_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-purple-white.svg`  
  Camus taught it plainly: to freeze a thing, still its atoms; to destroy a thing, part them. Every technique you have ever thrown was this, and now you do it deliberately, with your hands, to anything at all. Your unarmed Strikes ignore an object's Hardness entirely , and you can damage and destroy objects and structures of any material with your bare hands, including those normally immune to…  
  **Icon brief** (Saint Seiya — Camus's teaching: Atomic Dissolution): A fist touching a stone block that breaks apart into a cloud of tiny glittering particles, the atoms drifting away as frosty sparkle.
- **Zenith Reach** · _feat_ · `icons/magic/light/explosion-star-glow-silhouette.webp`  
  The awakened seventh sense answers you more than once. You may use Seventh Sense's Burn Your Cosmo action twice per day instead of once. Additionally, its duration increases from 1 minute to 1 minute per Focus Point you currently have , up to 3 minutes.  
  **Icon brief** (Saint Seiya — the Seventh Sense): Two overlapping golden suns of cosmo, the second rising out of the first; a small 'VII' glyph in the centre.
#### Level 18

- **Entrust Your Cosmo** · _feat_ · `modules/isaacs-hb-pf2e/icons/hand-sparks-glow-orange.svg`  
  This is the oldest thing a Saint knows how to do. When your own road ends, or when someone else's matters more, you give them what you have left — and they carry it further than you could. Entrust Your Cosmo ◆◆ (two actions) Frequency once per hour Target one willing ally you can touch, or within 30 feet if your Cloth's constellation is ascendant Spend any number of Focus Points. The target gains…  
  **Icon brief** (Saint Seiya — Saints entrusting their cosmo): One fading golden hand passing a glowing ball of cosmo into another outstretched hand; the light growing brighter as it changes hands.
- **Not by the Same Attack** · _feat_ · `icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp`  
  No technique defeats a Gold Saint a second time. The first strike teaches you; the second finds you ready. Your cosmo reads an attack's structure the instant it lands and rebuilds you against it. The first time each day a given creature deals damage to you with a specific attack, spell, or effect, note it. Every subsequent time that same effect from any source targets you , you gain a +2…  
  **Icon brief** (Saint Seiya — 'The same technique never works twice on a Saint'): An attack's energy beam shattering into fragments against a golden constellation shield that has formed in its exact shape; a ghost of the first hit behind.
- **The Thirteenth** · _feat_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  There is a thirteenth sky, and on the nights it shows there is no constellation in it at all. Every other Saint stands in the dark. You do not. On any day the sky is Starless — no sign ascendant — your own constellation is treated as ascendant instead, and you gain your Ascendant Boon for the whole day. You also always know when a Starless sky is coming, one day in advance. Design note: this feat…  
  **Icon brief** (Homebrew (Saint class)): A totally black night sky with no constellations, and one single golden star burning alone in the middle of the darkness.
- **Two Skies** · _feat_ · `icons/magic/light/beams-rays-orange-purple-large.webp`  
  You have learned to read a second sky behind the first, and to stand in both at once. Choose a second Gold Cloth constellation during your daily preparations. Until your next preparations, you are also treated as a Saint of that constellation for the purpose of which days are yours — but not for its Techniques, passive, or Cloth Ability. On a day your chosen second constellation is ascendant, you…  
  **Icon brief** (Homebrew (Saint class)): Two layered night skies, one in front of the other, each with a different zodiac constellation glowing gold, both overlapping in the centre.
#### Level 2

- **Cloth Bond** · _feat_ · `icons/equipment/chest/breastplate-scale-grey.webp`  
  The runes worked into your Cloth resonate with a technique you have mastered. Choose one Technique you know. The fundamental and property runes on your Cloth also apply to that Technique's spell attack rolls and damage, treating it as though it were a weapon bearing those runes. If the Technique makes a spell attack, it now adds your Cloth's potency bonus to that attack roll, closing the usual…  
  **Icon brief** (Homebrew (Saint class)): A gold armour plate with glowing runes, one rune lifting off and flowing into a technique sigil of cosmo light.
- **Heated-Up Cosmo** · _feat_ · `icons/magic/fire/flame-burning-embers-orange.webp`  
  You stoke your inner cosmo in an instant rather than through long meditation. Once per day you may Refocus as a single action instead of over 10 minutes. You can do this in the middle of an encounter; the burst of raw cosmo is visible as a flare of light around you, and any creature with a sixth sense or equivalent immediately knows your location.  
  **Icon brief** (Homebrew (Saint class)): A sudden burst of gold flame erupting from a meditative closed palm, sparks flying outward, a cosmo flash in one beat.
#### Level 20

- **Athena Exclamation** · _feat_ · `icons/magic/light/explosion-star-large-orange-purple.webp`  
  The forbidden technique. Three cosmos ignited as one tear open a hole where the world used to be. Requirements You are within 30 feet of at least two other creatures who have this feat — Saints, or beings the GM rules can channel cosmo at this tier — and all three of you spend the actions together. Athena Exclamation ◆◆◆ (three actions, and requires two allies to each spend 3 actions) Choose a…  
  **Icon brief** (Saint Seiya — Athena Exclamation): Three golden lights joined at a single point in a triangle, collapsing into one blinding white-gold sphere that tears a hole in the world like a miniature Big Bang.
- **Beyond the Eighth** · _feat_ · `icons/magic/death/skull-humanoid-crown-white-blue.webp`  
  Your consciousness has already crossed death once. Now it lingers on the far shore at will. Your Eighth Sense (Arayashiki) improves in three ways: Its duration increases from 1 minute to 10 minutes , or until the encounter ends. While Arayashiki is active you may travel to and from the edge of death as movement : once per round you may Stride through any barrier as though it were not there,…  
  **Icon brief** (Saint Seiya — Arayashiki (Eighth Sense)): A soul-flame of gold standing on the far shore of a dark river of the dead, a small 'VIII' glyph above, with the world of the living behind it.
- **Constellation of One** · _feat_ · `modules/isaacs-hb-pf2e/icons/star-sparkles-yellow.svg`  
  The sky is not finished. It has been added to before — every constellation was drawn by someone, and the ones with the most stars belonged to the ones who did the most. What you have done is enough that the sky has made room for it. A star kindles in your constellation where there was none, and it will still be burning long after your name is a story. Work with your GM to identify the single deed…  
  **Icon brief** (Homebrew (Saint class)): A new constellation being drawn in the night sky with lines of gold light, its star points newly lit, the hand-drawn shape of a human figure among old constellations.
#### Level 4

- **Rise** · _feat_ · `modules/isaacs-hb-pf2e/icons/heart-cross-strong-flame-red.svg`  
  A Gold Saint does not stay down. Frequency once per day Trigger You are reduced to 0 Hit Points but not killed outright. You remain conscious with 1 Hit Point instead of falling. You are wounded 1, or your wounded value increases by 1, and you cannot use this feat again until you have rested. This is a raw refusal to fall, not healing. If the hit would kill you outright — reducing you below the…  
  **Icon brief** (Saint Seiya — A Saint's refusal to fall): A gold gauntlet slamming into the ground and pushing up from it, a burst of golden cosmo exploding around the fist.
- **Second Cloth Technique** · _feat_ · `icons/magic/symbols/runes-star-blue.webp`  
  You have studied a sister Cloth's art. Learn the 1st (Signature) Technique of a Cloth other than your own. It uses your Cosmo DC and focus pool normally, but it heightens one step behind your own Techniques — treat it as gained 2 levels later than you actually gained it. You may retrain which Technique this is when you gain a level. You cannot select another Cloth's 2nd, 3rd, or 4th Technique…  
  **Icon brief** (Homebrew (Saint class)): A second constellation emblem overlaid on the first, two zodiac glyphs side by side with gold linking lines, one bright and one half-lit.
#### Level 6

- **Burning Cosmo** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-flame-blue-orange.svg`  
  You let your cosmo blaze until lesser wills buckle under the sheer weight of it. You do not threaten — you simply are , and it is too much. You can Demoralize using your key ability modifier in place of Intimidation. You are trained in this use even if untrained in Intimidation, and you add your Intimidation proficiency instead if it is higher. When you Demoralize this way you may target any…  
  **Icon brief** (Homebrew (Saint class)): A blazing golden aura that warps the air, heavy waves of pressure pushing outward; small dark silhouettes shrinking before it.
- **Speed of Sound** · _feat_ · `icons/magic/movement/trail-streak-zigzag-yellow.webp`  
  When the stars align for you, you move faster than the eye can follow. Your Speed increases by 10 feet . On any day your Cloth's constellation is ascendant or Exalted, this bonus increases to +20 feet and you ignore difficult terrain that isn't magical.  
  **Icon brief** (Saint Seiya — Bronze Saints at Mach speed): A sonic-boom cone of pale shockwave rings around a golden streak of movement, dust kicked up behind.
#### Level 8

- **Read the Constellation** · _feat_ · `icons/magic/perception/orb-crystal-ball-scrying-blue.webp`  
  You learn to feel your own constellation approaching over the horizon of days. Frequency once per week During your daily preparations, you learn whether your Cloth's constellation will be ascendant on any of the next three days , and if so which day and whether it will be Exalted. This lets you plan: to press for a confrontation on your day, or to counsel delay until the sky turns. You still…  
  **Icon brief** (Homebrew (Saint class)): A constellation shown on a horizon line with three small dawn-suns ahead of it, one marked by a glowing star: the sign foreseen days in advance.
- **Twin Cosmo** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  You split your focus, unleashing a technique in the same breath as your defense. Frequency once per day Trigger An enemy takes an action that would trigger a reaction you could make, or an ally within 30 feet is reduced to 0 Hit Points. You cast one Technique you know with a casting time of 2 actions or fewer as a reaction. If the Technique normally costs a Focus Point, it still does.  
  **Icon brief** (Homebrew (Saint class)): A gold arm raised in a guard while a second, ghostly arm of cosmo thrusts a technique forward at the same moment; two layered motions.

### saint-journals (0)


### saint-macros (1)

- **Set Today's Sky** · _script_ · `icons/magic/light/beams-rays-orange-purple-large.webp`  
  Macro:  
  **Icon brief** (Homebrew (Saint class)): A round celestial dial showing the twelve zodiac glyphs, a gold pointer set on one of them, star field behind.

### saint-techniques (48)

#### 1st — Signature (L1)

- **Another Dimension** · _spell_ · `icons/magic/control/energy-stream-link-spiral-teal.webp`  
  Gemini — 1st (Signature) Technique, gained at level 1. You open a seam in space and push someone through it. The target must attempt a Will save. Failure It is banished into folded space for 1 minute, then returns to the square it left. Critical Failure As failure, but for 10 minutes. Heightening (+2 levels) The range increases by 10 feet. At 12th and 16th level, you may target one additional…  
  **Icon brief** (Saint Seiya — Saga's Another Dimension): Space cracking open into a triangular rift outlined in purple light, a swirling void of distorted galaxies inside it, pulling inward.
- **Crystal Wall** · _spell_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  Aries — 1st (Signature) Technique, gained at level 1. Mu raises the wall, and the thing that was coming stops coming. You create a barrier of solidified cosmo 15 feet long and 10 feet high in an unoccupied space you can see. It has AC 10, Hardness equal to your level, and Hit Points equal to four times your level, and it blocks line of effect. The wall is destroyed when its Hit Points reach 0.…  
  **Icon brief** (Saint Seiya — Mu's Crystal Wall): A flat, nearly invisible pane of crystal light standing upright, faint hexagonal glints across its surface, a projectile bouncing back off it.
- **Diamond Dust** · _spell_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  Aquarius — 1st (Signature) Technique, gained at level 1. Condensed, icy air launched from the hand; it freezes all it touches. Each creature in the cone takes 1d8[cold] damage with a basic Fortitude save. A creature that fails is slowed 1 for 1 round. Heightening (+2 levels) The damage increases by 1d8. On a day your constellation is Ascendant this Technique heightens as though you were 4 levels…  
  **Icon brief** (Saint Seiya — Hyoga/Camus's Diamond Dust): A fist thrust forward releasing a blizzard of sparkling ice crystals and frozen air, white and pale blue diamond glints spreading in a cone.
- **Excalibur** · _spell_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-gold.svg`  
  Capricorn — 1st (Signature) Technique, gained at level 1. Your arm is the sword. You have simply stopped pretending otherwise. Until the end of your turn, your unarmed Strikes deal slashing damage, gain the deadly d10 trait, and ignore Hardness. Heightening (+2 levels) At 10th level the deadly die becomes d12. At 14th and 18th level, your Strikes deal an additional 1d6 slashing damage. On a day…  
  **Icon brief** (Saint Seiya — Shura's Excalibur): A forearm held edge-on as a blade, wrapped in a long straight golden light-edge like a holy sword, a clean cut through the air behind it.
- **Golden Arrow** · _spell_ · `icons/weapons/ammunition/arrow-head-war-flight.webp`  
  Sagittarius — 1st (Signature) Technique, gained at level 1. You draw a bow that is not there and loose an arrow that does not miss for reasons of distance. Make a spell attack roll against the target's AC. The arrow ignores cover and concealment. Critical Success Double damage. Success 2d6[force] damage. Golden Arrow has a range increment of 500 feet. Heightening (+2 levels) The damage increases…  
  **Icon brief** (Saint Seiya — Aiolos's Golden Arrow): A single golden arrow of light streaking forward from a bow of light, its feathered tail blazing, a long straight trail behind it.
- **Great Horn** · _spell_ · `modules/isaacs-hb-pf2e/icons/bull-horns-brown.svg`  
  Taurus — 1st (Signature) Technique, gained at level 1. You lower your shoulder and the air breaks in front of you. Each creature in the cone takes 1d8[bludgeoning] damage with a basic Fortitude save. A creature that fails is pushed 15 feet and knocked prone. Heightening (+2 levels) The damage increases by 1d8. On a day your constellation is Ascendant this Technique heightens as though you were 4…  
  **Icon brief** (Saint Seiya — Aldebaran's Great Horn): A golden shockwave blasting forward in a cone, shaped like the head and horns of a charging bull, the air rippling.
- **Lightning Bolt** · _spell_ · `icons/magic/lightning/bolt-strike-forked-blue.webp`  
  Leo — 1st (Signature) Technique, gained at level 1. You throw your fist forward and the lightning goes where it is told. Each creature in the line takes 1d12[electricity] damage with a basic Reflex save. Heightening (+2 levels) The damage increases by 1d12. On a day your constellation is Ascendant this Technique heightens as though you were 4 levels higher; on a Zenith , 8 levels higher.  
  **Icon brief** (Saint Seiya — Aiolia's Lightning Bolt): A fist thrust forward and a single thick bolt of golden-white lightning shooting straight out of it in a line.
- **Piranha Rose** · _spell_ · `modules/isaacs-hb-pf2e/icons/root-vine-thorns-red.svg`  
  Pisces — 1st (Signature) Technique, gained at level 1. Roses go where you point them, and they are hungry. Each target takes 1d8[slashing] damage plus 1d6[persistent,bleed] damage, with a basic Reflex save. A successful save negates the persistent damage. Heightening (+2 levels) The slashing damage increases by 1d8. At 9th, 13th, and 17th level, the persistent bleed damage increases by 1d6. On a…  
  **Icon brief** (Saint Seiya — Aphrodite's Piranha Rose): A swarm of black roses flying forward like teeth, their petals edged sharp, tearing a trail of black and red petals through the air.
- **Rozan Shō Ryū Ha** · _spell_ · `icons/magic/water/vortex-water-whirlpool-blue.webp`  
  Libra — 1st (Signature) Technique, gained at level 1. Rising Dragon. You strike upward and a column of water and cosmo climbs with your fist. Each creature in the cylinder takes 1d10[bludgeoning] damage with a basic Reflex save. A creature that critically fails is launched 30 feet straight up — and comes down, taking 15 bludgeoning damage from the fall and landing prone. Heightening (+2 levels)…  
  **Icon brief** (Saint Seiya — Shiryu/Dohko's Rozan Shō Ryū Ha): An uppercut sending a jade-green and gold Chinese dragon spiralling upward in a column of rushing waterfall water.
- **Scarlet Needle** · _spell_ · `icons/skills/wounds/injury-triple-slash-bleed.webp`  
  Scorpio — 1st (Signature) Technique, gained at level 1. One needle, placed exactly. You will place fourteen more. The target must attempt a Fortitude save. Failure It gains one needle and takes 1d6[persistent,bleed] damage. Critical Failure As failure, and it is off-guard for 1 round. Heightening (+2 levels) The persistent bleed damage increases by 1d6. On a day your constellation is Ascendant…  
  **Icon brief** (Saint Seiya — Milo's Scarlet Needle): A single long crimson fingernail glowing red, firing a thin needle of red light; a tiny red star mark at its tip.
- **Sekishiki Meikai Ha** · _spell_ · `icons/magic/death/hand-dirt-undead-zombie.webp`  
  Cancer — 1st (Signature) Technique, gained at level 1. Praesepe Underworld Waves. The target takes 1d8[void] damage with a basic Will save. A creature that fails is also drained 1; one that critically fails is drained 2 and slowed 1. Heightening (+2 levels) The damage increases by 1d8. On a day your constellation is Ascendant this Technique heightens as though you were 4 levels higher; on a…  
  **Icon brief** (Saint Seiya — Deathmask's Sekishiki Meikai Ha): A single index finger pointing upward, a soul being pulled out of a body as a pale blue ghost wisp toward a grey path into darkness.
- **Tenbu Hōrin** · _spell_ · `icons/magic/control/energy-stream-link-white.webp`  
  Virgo — 1st (Signature) Technique, gained at level 1. Treasure of Heaven. You decide what this creature is permitted to perceive. The target must attempt a Will save. Failure It loses one sense of your choice for 1 minute: sight (blinded), hearing (deafened), or smell and taste. Critical Failure Two senses. Heightening (+2 levels) The range increases by 10 feet. At 12th and 16th level, you may…  
  **Icon brief** (Saint Seiya — Shaka's Tenbu Hōrin): A huge golden mandala wheel (dharmachakra) spinning, framed by two blossoming sāla trees, lotus petals drifting.
#### 2nd (L6)

- **Astral Projection** · _spell_ · `icons/magic/perception/silhouette-stealth-shadow.webp`  
  Gemini — 2nd Technique, gained at level 6. Saga governed the Sanctuary as two people at once. You project your consciousness into an astral body anywhere within 200 feet that you can see or have visited. For up to 10 minutes you perceive and speak through it. The astral body is invisible to creatures without a sixth sense or see invisibility , cannot be damaged or physically interacted with, and…  
  **Icon brief** (Saint Seiya — Saga's astral body): A translucent glowing ghost-double of a figure stepping away from a still body, linked by a thin silver-gold cord.
- **Chiron's Light Impulse** · _spell_ · `icons/magic/light/beam-rays-yellow.webp`  
  Sagittarius — 2nd Technique, gained at level 6. Sagittarius is the centaur Chiron — the teacher. This is his gift: the arrow that guides rather than kills. The target is wreathed in golden light for 1 minute. It gains a +1 status bonus to attack rolls, its attacks deal an extra 1d6[force] damage, and it gains a fly Speed of 20 feet. Once during the duration, as a free action, the target may treat…  
  **Icon brief** (Saint Seiya — Aiolos's Chiron's Light Impulse (Episode G)): A soft golden arrow of light wrapping around a target and becoming a gentle golden aura, like a teacher's guiding hand.
- **Crimson Mirage** · _spell_ · `icons/magic/control/hypnosis-mesmerism-eye-tan.webp`  
  Scorpio — 2nd Technique, gained at level 6. The scarlet haze that comes before Antares. Requirements The target has at least 1 needle. The target must attempt a Will save. Failure For 1 minute it is dazzled, treats all other creatures as concealed, and takes 1d6[mental] damage per needle it currently has at the end of each of its turns. Critical Failure As failure, and it is confused for 1 round…  
  **Icon brief** (Saint Seiya — Milo's scarlet haze): A red haze clouding the eyes, everything beyond tinted crimson and blurred, with faint red needle points glowing inside the mist.
- **Jumping Stone** · _spell_ · `icons/skills/movement/figure-running-gray.webp`  
  Capricorn — 2nd Technique, gained at level 6. Shura's leap — he crosses the distance and the blade arrives before he does. Stride up to twice your Speed , ignoring difficult terrain and crossing gaps up to 20 feet as though on solid ground. This movement does not trigger reactions. At any point during the movement, make one unarmed Strike dealing an additional 3d8[slashing] damage. If you moved…  
  **Icon brief** (Saint Seiya — Shura's Jumping Stone): A blade-arm leaping across a gap in a long arc, a golden slash trailing behind and stone fragments flying where it pushed off.
- **Koliço** · _spell_ · `modules/isaacs-hb-pf2e/icons/ice-crystal-white-blue.svg`  
  Aquarius — 2nd Technique, gained at level 6. Ice Rings — rings of cold generated from the fingers, which surround the target and render the captive unable to move. The target must attempt a Reflex save. Success Half damage and slowed 1 for 1 round. Failure 3d8[cold] damage and immobilized for 1 minute (Escape DC equal to your Cosmo DC; the rings have Hardness 8 and 30 Hit Points, and shatter if…  
  **Icon brief** (Saint Seiya — Hyoga's Kol'tso (Ice Rings)): Several rings of icy white-blue wind spiralling from a fingertip and locking around a target's body like frozen hoops.
- **Lightning Crown** · _spell_ · `icons/magic/lightning/bolt-strike-sparks-blue.webp`  
  Leo — 2nd Technique, gained at level 6. The Saint sends cosmo into the ground, and it erupts as pillars of electricity. Choose up to three 5-foot squares within 60 feet; a pillar of lightning erupts from each. You aim the 15-foot square each pillar fills — the square it stands in and everything adjacent to it. A creature in or adjacent to a pillar takes 3d8[electricity] damage with a basic Reflex…  
  **Icon brief** (Saint Seiya — Aiolia's Lightning Crown (Episode G)): Three pillars of crackling gold lightning erupting straight up out of the ground in a crown-like ring.
- **Pleiades Nova** · _spell_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Taurus — 2nd Technique, gained at level 6. The star cluster on the Bull's shoulder, thrown as points of light. Make five ranged unarmed Strikes against any creatures within 60 feet, each dealing 1d6[force] damage plus your key ability modifier. Your multiple attack penalty does not increase during this activity, but each Strike after the first takes a cumulative −1 penalty as the light scatters.…  
  **Icon brief** (Saint Seiya — Aldebaran's Pleiades): A fist sending a cluster of seven bright blue-white stars flying forward, like the Pleiades thrown as glowing points.
- **Royal Demon Rose** · _spell_ · `modules/isaacs-hb-pf2e/icons/rose-thorned-white.svg`  
  Pisces — 2nd Technique, gained at level 6. The white roses whose scent alone kills — Aphrodite's first garden. A 20-foot burst fills with drifting white petals for 1 minute. Any creature that starts its turn in the area must attempt a Fortitude save. Failure 3d8[poison] damage and enfeebled 1. Critical Failure As failure, and stupefied 2 for 1 minute — the scent takes the mind before the body.…  
  **Icon brief** (Saint Seiya — Aphrodite's Royal Demon Rose): A drifting cloud of pale white rose petals hanging in the air, their sweet poisonous scent shown as faint lavender mist.
- **Sekishiki Kisōen** · _spell_ · `icons/magic/fire/projectile-fireball-smoke-blue.webp`  
  Cancer — 2nd Technique, gained at level 6. Demonic Blue Flames — cold fire that burns by feeding on souls. Each creature in the area takes 3d8[void] damage with a basic Will save. The flames feed: for each creature that fails its save, you regain 3 Hit Points , to a maximum equal to your level per casting. A creature reduced to 0 Hit Points by this Technique has its soul consumed and cannot be…  
  **Icon brief** (Saint Seiya — Manigoldo's Sekishiki Kisōen): Ghostly cold blue flames (onibi) burning over a field, each flame carrying a tiny screaming face as it feeds on souls.
- **Starlight Extinction** · _spell_ · `modules/isaacs-hb-pf2e/icons/portal-vortex-blue.svg`  
  Aries — 2nd Technique, gained at level 6. Mu's art: the thing is not broken, it is sent away. The target must attempt a Will save. Failure It is teleported 60 feet in a direction you choose, arriving in the nearest open space. Critical Failure It is teleported 250 feet, lands prone, and takes 3d6[force] damage. Heightening (+2 levels) The damage increases by 1d6 and the failure distance by 30…  
  **Icon brief** (Saint Seiya — Mu's Starlight Extinction): A swirling spiral of starlight and galaxy dust wrapping a target and dissolving it away into the cosmos.
- **Tenpōrin'in** · _spell_ · `icons/magic/control/energy-stream-link-white.webp`  
  Virgo — 2nd Technique, gained at level 6. Clarity of Mind — the wheel of dharma turning, clarity offered outward. You and your allies in the emanation gain a +1 status bonus to Will saves and to saves against mental effects, and are immune to the fascinated and frightened conditions, for 1 minute. When you cast this Technique, a card offers every mental effect on a creature in the area; choosing…  
  **Icon brief** (Saint Seiya — Shaka's Tenpōrin'in): A slowly turning golden dharma wheel radiating calm rings of light, a quiet halo spreading over allies.
- **The Twelve Arms** · _spell_ · `icons/weapons/swords/sword-gold-holy.webp`  
  Libra — 2nd Technique, gained at level 6. Twelve weapons, six pairs of hands that are not yours. Distribute up to five Arms (matched pairs) to allies within 30 feet; you keep at least one. For 3 rounds , each ally wielding an Arm uses your weapon proficiency with it, receives its full Arms Advance for your level, and gains that Arm's Art (including its Greater and Perfect upgrades). The weapons…  
  **Icon brief** (Saint Seiya — Dohko's Libra weapons): Six pairs of golden weapons (swords, tridents, staffs, nunchaku, tonfa, shields) flying outward in a fan from a set of balance scales.
#### 3rd — Cloth Ability (L11)

- **Crimson Flurry** · _spell_ · `icons/skills/wounds/injury-body-pain-gray.webp`  
  Scorpio — 3rd (Cloth Ability) Technique, gained at level 11. Fifteen needles delivered in a single burst rather than one at a time. Make four unarmed Strikes against any creatures within 30 feet at no increase to your multiple attack penalty. Target whoever you mean to hit before you cast; the Strikes are dealt out among them in turn, so one enemy takes all four. Each Strike that hits applies one…  
  **Icon brief** (Saint Seiya — Milo's Scarlet Needle (rapid)): A burst of many crimson needles of light fanning out from one fingertip at once, red streaks hitting multiple points.
- **Crimson Fog** · _spell_ · `modules/isaacs-hb-pf2e/icons/vines-thorned-curled-glow-red.svg`  
  Pisces — 3rd (Cloth Ability) Technique, gained at level 11. Bloody Rose Blizzard — a storm of red roses, the garden released all at once. Each creature in the area takes 6d8[piercing] damage with a basic Reflex save. A creature that fails also takes 3d6[persistent,bleed] damage. The area fills with crimson petals for 1 minute: it is difficult terrain , and creatures inside are concealed from…  
  **Icon brief** (Saint Seiya — Aphrodite's Bloody Rose blizzard): A storm of red roses swirling across the frame in a blizzard of crimson petals.
- **Crystal Net** · _spell_ · `icons/magic/defensive/shield-barrier-blue.webp`  
  Aries — 3rd (Cloth Ability) Technique, gained at level 11. A net woven by psychokinetic power that traps the adversary and completely inhibits their mobility. Each creature in the area must attempt a Reflex save. Success It is restrained until the end of its next turn. Failure It is immobilized for 1 minute (Escape DC equal to your Cosmo DC). Critical Failure As failure, and it takes 6d8[force]…  
  **Icon brief** (Saint Seiya — Mu's Crystal Net): A spiderweb of glittering crystal threads strung in the air, catching and binding a struggling silhouette.
- **Double Excalibur** · _spell_ · `modules/isaacs-hb-pf2e/icons/swords-crossed-yellow.svg`  
  Capricorn — 3rd (Cloth Ability) Technique, gained at level 11. Both arms as blades — the technique that cuts twice in the space of one cut. Make two unarmed Strikes against a single creature within reach. Both are made at your full attack modifier with no multiple attack penalty, both gain deadly d12, and both ignore Hardness, resistance, and immunity to physical damage. If both hit, the target…  
  **Icon brief** (Saint Seiya — Shura's Excalibur (both arms)): Two forearms crossed into an X, each edged with a long golden blade of light, two cuts landing as one.
- **Freezing Shield** · _spell_ · `icons/magic/defensive/shield-barrier-blue.webp`  
  Aquarius — 3rd (Cloth Ability) Technique, gained at level 11. Dégel's defensive art — a wall of absolute cold that stops what is thrown at it. A dome of frozen air with a 20-foot radius forms centred on you and lasts 1 minute. You and your allies inside gain cold resistance 15 and a +2 circumstance bonus to AC against ranged attacks. Any creature hostile to you that enters the dome or ends its…  
  **Icon brief** (Saint Seiya — Dégel's Freezing Shield (Lost Canvas)): A dome of frozen, misty air surrounding the user, ice crystals forming on its surface as an attack freezes against it.
- **Galaxian Explosion** · _spell_ · `icons/magic/light/explosion-star-glow-purple.webp`  
  Gemini — 3rd (Cloth Ability) Technique, gained at level 11. A galaxy's birth compressed into a fist. Each creature in the area takes 6d8[force] damage with a basic Reflex save. The area becomes difficult terrain for 1 minute as space folds in on itself. Heightening (+2 levels) The damage increases by 1d8. On a day your constellation is Ascendant this Technique heightens as though you were 4…  
  **Icon brief** (Saint Seiya — Saga's Galaxian Explosion): Planets and stars aligned in a row, bursting into a galaxy-scale explosion of purple, blue and white light.
- **Infinity Break** · _spell_ · `modules/isaacs-hb-pf2e/icons/arrow-head-glowing-yellow.svg`  
  Sagittarius — 3rd (Cloth Ability) Technique, gained at level 11. Aiolos's shot travelled fourteen years to reach its target. Choose a direction. The arrow travels in a line of any length up to one mile . Each creature in the line takes 12d6[force] damage with a basic Reflex save. The arrow passes through walls, structures, cover, and any barrier with Hardness less than 20 , destroying a 5-foot…  
  **Icon brief** (Saint Seiya — Aiolos's Infinity Break): A barrage of countless golden arrows of light streaking forward in an endless straight line to the horizon.
- **Lightning Plasma** · _spell_ · `icons/magic/lightning/bolt-strike-forked-blue.webp`  
  Leo — 3rd (Cloth Ability) Technique, gained at level 11. You are in more places than one, briefly, and each of them is punching. Make three unarmed Strikes against any creatures within 30 feet at no increase to your multiple attack penalty. Target whoever you mean to hit before you cast; the Strikes are dealt out among them in turn, so one enemy takes all three. The activity counts as three…  
  **Icon brief** (Saint Seiya — Aiolia's Lightning Plasma): A dense lattice of hundreds of golden lightning beams criss-crossing in every direction from a single point.
- **Rozan Ryū Hi Shō** · _spell_ · `icons/magic/water/wave-water-blue.webp`  
  Libra — 3rd (Cloth Ability) Technique, gained at level 11. Dragon Flight — the Saint punches forward as if flying, and the dragon leaves the ground carrying the strike with it. Fly up to 60 feet in a straight line and make one unarmed Strike or Libra weapon Strike at any point during the movement, dealing +6d8 damage on a hit. This movement doesn't trigger reactions. On a hit you may continue to…  
  **Icon brief** (Saint Seiya — Shiryu's Rozan Ryū Hi Shō): A flying punch carried forward by a jade-green dragon soaring horizontally, its body wrapped around the strike.
- **Sekishiki Konsō Ha** · _spell_ · `icons/magic/death/skull-energy-light-purple.webp`  
  Cancer — 3rd (Cloth Ability) Technique, gained at level 11. Soul Burial Waves — nearby spirits taken as gunpowder; the explosion is proportional to their strength. Each creature in the area takes 6d8[void] damage with a basic Fortitude save. Add 1d8 for every creature that has died in this area within the last hour , to a maximum of +5d8. Undead and spirits in the area take an additional 2d8…  
  **Icon brief** (Saint Seiya — Manigoldo's Sekishiki Konsō Ha): Many blue ghost-souls gathered into a sphere and detonating in a burst of pale blue spirit-fire.
- **Tenma Kōfuku** · _spell_ · `icons/magic/light/explosion-star-glow-silhouette.webp`  
  Virgo — 3rd (Cloth Ability) Technique, gained at level 11. Demon Pacifier — cosmo manifested physically between the palms, then released as light. You compress your cosmo between your hands for the entire casting, then release it. Each creature in the cone takes 6d8[force] damage with a basic Will save — this strikes the spirit, not the body. A creature that fails is stunned 1; one that…  
  **Icon brief** (Saint Seiya — Shaka's Tenma Kōfuku): A ball of compressed cosmo between two palms, released as a vast cone of gold light shaped like a demon's face.
- **Titan's Stance** · _spell_ · `modules/isaacs-hb-pf2e/icons/bull-horns-glowing-red.svg`  
  Taurus — 3rd (Cloth Ability) Technique, gained at level 11. Aldebaran does not dodge. He stands where the blow was going. Trigger An ally within 15 feet would be hit by an attack or targeted by a damaging effect. You interpose yourself and become the target instead. You take the damage reduced by 10 plus twice your level , and you cannot be moved from your square by that effect. Heightening (+2…  
  **Icon brief** (Saint Seiya — Aldebaran's guard): A massive figure standing with arms folded in front of an ally, a golden bull-horn aura taking the blow head-on.
#### 4th — Ultimate (L16)

- **Aiolos's Wings** · _spell_ · `modules/isaacs-hb-pf2e/icons/wind-swirl-gray.svg`  
  Sagittarius — 4th (Ultimate) Technique, gained at level 16. You take on the aspect of the constellation itself. For 10 minutes you gain a fly Speed equal to twice your Speed , you can Fly at full speed while attacking without penalty, and Golden Arrow becomes a 1-action Technique that costs no Focus Point. You may also share flight with up to five allies within 30 feet, each gaining a fly Speed…  
  **Icon brief** (Saint Seiya — Aiolos's wings): A huge pair of golden feathered wings spread wide in the sky, glowing feathers drifting from them.
- **Antares** · _spell_ · `icons/skills/wounds/injury-body-pain-gray.webp`  
  Scorpio — 4th (Ultimate) Technique, gained at level 16. The last needle is the heart. You have been walking toward it for fourteen strikes. Requirements The target has at least 5 needles. The target must attempt a Fortitude save. Failure 16d6[piercing] damage and paralyzed for 1 round. Critical Failure It dies — the scarlet star at the Scorpion's heart has found its own. Heightening (+2 levels)…  
  **Icon brief** (Saint Seiya — Milo's Antares): A single crimson needle of light piercing a glowing red star at the heart, the star Antares, with fourteen dimmer red points around it.
- **Athena's Arsenal: Overdrive** · _spell_ · `icons/weapons/swords/sword-gold-holy.webp`  
  Libra — 4th (Ultimate) Technique, gained at level 16. All twelve weapons released at once — the arsenal Athena entrusted to a single Saint. Every Arm detaches and attacks independently. Make six Strikes distributed as you choose among creatures within 60 feet, one with a weapon from each of the six Arms , each dealing that weapon's damage +2d8 . Each Strike counts as the second weapon of its…  
  **Icon brief** (Saint Seiya — Dohko's Libra arsenal): All twelve golden weapons flying out at once in a circle, each spinning and attacking on its own around the scales.
- **Excalibur: The Sword That Cuts Everything** · _spell_ · `modules/isaacs-hb-pf2e/icons/greatsword-flamberge-gold.svg`  
  Capricorn — 4th (Ultimate) Technique, gained at level 16. The blade Athena gave to a mortal, used at its full extension. Each creature in the line takes 16d6[slashing] damage with a basic Reflex save. A creature that critically fails is severed , no save. This damage ignores all Hardness, all resistances, and all immunities to physical damage , and treats force effects such as wall of force and…  
  **Icon brief** (Saint Seiya — Shura's Excalibur (full extension)): One enormous golden blade-edge of light extending to the horizon, slicing a mountain cleanly in two.
- **Freezing Coffin** · _spell_ · `icons/magic/water/ice-crystal-white.webp`  
  Aquarius — 4th (Ultimate) Technique, gained at level 16. Formed at −273°C, at the limit of absolute zero; its solidity is such that not even the strength of a Gold Saint could break it. The target must attempt a Fortitude save. Failure 16d6[cold] damage and slowed 2 for 1 minute. Critical Failure It is entombed in unmelting ice indefinitely: petrified , ageless, and needing no air. The coffin has…  
  **Icon brief** (Saint Seiya — Camus's Freezing Coffin): A target sealed inside a towering, perfectly clear block of ice shaped like a coffin, frost mist pouring from its base.
- **Mavros Eruption Clast** · _spell_ · `icons/magic/fire/explosion-embers-evade-silhouette.webp`  
  Gemini — 4th (Ultimate) Technique, gained at level 16. Defteros's black flame — the volcanic eruption of the shadow twin. Each creature in the area takes 8d8[fire] damage with a basic Reflex save. A creature that critically fails is blinded for 1 minute : Mavros burns black, and what it takes first is sight. The area burns for 1 minute. A creature that enters it or ends its turn there takes…  
  **Icon brief** (Saint Seiya — Defteros's black flame (Lost Canvas)): A fist driving into the ground and an eruption of black flame and molten magma bursting upward like a volcano.
- **Photon Burst** · _spell_ · `icons/magic/light/explosion-star-large-orange-purple.webp`  
  Leo — 4th (Ultimate) Technique, gained at level 16. The Lion's cosmo released as raw light, at the speed of light. Choose a 120-foot line or a 30-foot burst within 120 feet as you cast. Each creature in the area takes 16d6[force] damage with a basic Reflex save. A creature that critically fails is blinded for 1 minute and dazzled until it receives restoration . This damage is not reduced by cover…  
  **Icon brief** (Saint Seiya — Aiolia's Photon Burst (Episode G)): A blinding sphere of pure golden-white light exploding outward along a straight line at light speed.
- **Rikudō Rinne** · _spell_ · `icons/magic/control/energy-stream-link-large-blue.webp`  
  Virgo — 4th (Ultimate) Technique, gained at level 16. The Six Realms of Samsara — the soul sent to one of the six worlds while the body remains on the field. The target must attempt a Will save. Success It is stunned 1. Failure Its soul is cast into one of the six realms for 1 minute: it is stunned for the duration, its body standing empty on the battlefield. Critical Failure As failure but for…  
  **Icon brief** (Saint Seiya — Shaka's Rikudō Rinne): A great turning wheel divided into six realms, souls being flung into each segment, a golden halo around the hub.
- **Royal Funeral** · _spell_ · `modules/isaacs-hb-pf2e/icons/rose-thorned-red.svg`  
  Pisces — 4th (Ultimate) Technique, gained at level 16. Aphrodite's last technique. He calls it a funeral because he has already decided how it ends. A single black rose crosses the distance. The target must attempt a Fortitude save. Success Half damage and enfeebled 1. Failure 16d6[poison] damage, enfeebled 2, and drained 2 — the rose is drinking. Critical Failure The rose reaches the heart and…  
  **Icon brief** (Saint Seiya — Aphrodite's black rose): A single black rose flying straight forward, a thin trail of dark petals behind it, against a pale funeral background.
- **Sekishiki Tenryū Ha** · _spell_ · `icons/magic/death/skull-poison-green.webp`  
  Cancer — 4th (Ultimate) Technique, gained at level 16. Heaven's Dragon Wave — the march of the spirits, the road to Yomotsu Hirasaka fully open. Each creature in the cone must attempt a Fortitude save. Success Half damage. Failure 8d8[void] damage, and it is dragged 30 feet toward the mouth. Critical Failure As failure, and if the creature is at half Hit Points or fewer it dies , its soul carried…  
  **Icon brief** (Saint Seiya — Manigoldo's Sekishiki Tenryū Ha): A great procession of blue souls marching up a road to the open pit of Yomotsu Hirasaka, forming the shape of a dragon in the sky.
- **Stardust Revolution** · _spell_ · `icons/magic/light/explosion-star-large-orange.webp`  
  Aries — 4th (Ultimate) Technique, gained at level 16. Meteors called down from the constellation itself. Each creature in the area takes 8d8[force] damage with a basic Reflex save. A creature that critically fails is stunned 1 and knocked prone. Heightening (+2 levels) The damage increases by 1d8. On a day your constellation is Ascendant this Technique heightens as though you were 4 levels…  
  **Icon brief** (Saint Seiya — Mu's Stardust Revolution): A storm of glittering golden and white meteors streaking down out of a constellation like a meteor shower.
- **Titan's Break: The Golden Horn** · _spell_ · `modules/isaacs-hb-pf2e/icons/bull-horns-gold.svg`  
  Taurus — 4th (Ultimate) Technique, gained at level 16. Aldebaran's charge — the one that ends the fight. Each creature in the line takes 8d8[bludgeoning] damage with a basic Fortitude save. A creature that fails is pushed to the end of the line and knocked prone; one that critically fails takes an additional 4d8[bludgeoning] damage and is stunned 2. Any wall, door, or structure in the line with…  
  **Icon brief** (Saint Seiya — Aldebaran's Golden Horn): A towering golden bull of light charging forward in a straight line, its horns lowered, a shockwave flattening the ground.

## The Soulbound

### soulbound-class (1)

- **Soulbound** · _class_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Three peoples fight the same war with the same physics and opposite manners. A Soul Reaper carries their own soul as a sword, and it argues with them. A Hollow ate its own heart and wears the hole; its power is sealed inside it rather than carried. A Quincy owns no soul-weapon at all — they reach into the air, take the spirit particles that are already there, and make a bow out of them. You are a…  
  **Icon brief** (Homebrew (Soulbound class) — Bleach themes): Three emblems fused into one roundel: a black-hilted katana, a cracked white Hollow mask fragment, and a blue five-pointed Quincy cross, laid over a pale circle of spiritual light, each piece throwing a different-coloured glow (blue-white, red, blue).

### soulbound-class-features (103)

#### Actions

- **Blut** · _feat_ · `icons/magic/control/buff-flight-wings-blue.webp`  
  Frequency once per round Choose Vene or Arterie . The choice lasts until the start of your next turn, and you cannot have both.  
  **Icon brief** (Bleach — Quincy Blut): A forearm seen close up with glowing blue reishi veins branching under the skin like circuitry, half the pattern pale-blue (vein) and half deep crimson-blue (artery), meeting at the wrist.
- **Cero Metralleta — Sustain** · _action_ · `icons/skills/ranged/target-bullseye-arrow-blue.webp`  
  Frequency once per round Fire again in a different direction , at no Reiatsu cost . Choose the cone or the line freshly, as you would on the first shot.  
  **Icon brief** (Bleach — Starrk's Cero Metralleta): A second fan of dozens of small blue-white cero bullets sweeping out from a pistol muzzle in a new direction, motion arc showing the barrage swinging across the frame.
- **Don the Other Face** · _action_ · `icons/magic/symbols/runes-triangle-blue.webp`  
  Cost 1 Reiatsu Point · Frequency once per encounter For 1 minute you gain your borrowed Lineage's Aspect . While it is on, you take a −1 status penalty to Will saves — what you are wearing is not yours, and it argues.  
  **Icon brief** (Bleach — Visored hollowfication): A hand pulling a cracked white bone mask with red slash markings down over a face-shaped shadow, black-and-gold Hollow reiatsu bleeding from the eye holes.
- **Kanzen Saimin — Sustain** · _action_ · `icons/magic/control/hypnosis-mesmerism-eye.webp`  
  Frequency once per round · Target one creature you have hypnotized Push the lie further. The target attempts a Will save against your Reiatsu DC; on a failure it is confused until the end of its turn. A creature that is not hypnotized is not affected — there is nothing yet for the lie to be built on.  
  **Icon brief** (Bleach — Aizen's Complete Hypnosis): A swirling vortex of mirror shards around a single reflected moon, the fragments warping into a confused spiral; faint purple light, the image doubling and smearing.
- **Manifest or Dismiss Spirit Weapon** · _action_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Frequency once per round Your spirit weapon appears in your hand, or dissolves. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away.  
  **Icon brief** (Homebrew (Soulbound class)): A sword half-formed in mid-air: the hilt solid, the blade still condensing from streaming motes of blue-white spirit particles, or the reverse — dissolving back into them.
- **Pressure Crush (Action)** · _action_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue-large.svg`  
  Cost 1 Reiatsu Point Enemies in a 20-foot emanation attempt a Fortitude save; on a failure they are clumsy 1 and take a −5-foot status penalty to Speeds for 1 minute.  
  **Icon brief** (Bleach — spiritual pressure): A ring of heavy, dark-blue reiatsu pressing down like a lid, the ground cracking into a shallow crater and small debris pinned flat beneath it.
- **Pressure Flare (Action)** · _action_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue.svg`  
  Frequency once per encounter Enemies within 15 feet must succeed at a Will save against your Reiatsu DC or be frightened 1 .  
  **Icon brief** (Bleach — spiritual pressure): A sudden flare of jagged, flame-like spiritual pressure bursting outward from a central point, tall aura spikes in pale blue and white, enough to make onlookers recoil.
- **Release** · _action_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Requirements Your spirit weapon is manifested. You speak your release command. Your spirit weapon assumes its released form for the rest of the encounter . The first Release each encounter is free. Releasing again after re-sealing costs 1 Reiatsu Point. You can't Release while your spirit weapon is dismissed. Release is not a stance and doesn't conflict with stance actions.  
  **Icon brief** (Bleach — Shikai release): A sealed katana in mid-transformation: the blade cracking open with light pouring out of the seams, a burst of reiatsu radiating from the tsuba as it takes its released shape.
- **Seal the Art** · _feat_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  Cost 1 Reiatsu Point Range 30 feet, one creature Attempt to counteract one ongoing magical effect, stance, aura, or release state affecting the target. Your counteract check uses your Reiatsu DC's proficiency and key attribute; your counteract rank is half your level, rounded up . A release state — Shikai, Bankai, Resurrección, Segunda Etapa, Vollständig, a Barbarian's Rage, a Magus's Arcane…  
  **Icon brief** (Bleach — Quincy reishi sealing): A blue Quincy cross pressed against a ring of wild energy, the energy being drawn in and dimmed — like a lid of blue light snapping shut over a flame.
- **Senbonzakura Kageyoshi — Sustain** · _action_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-pink.svg`  
  Frequency once per round Move the second emanation up to 30 feet , or switch modes: Gokei (Total Scene) — the second emanation shrinks to a 10-foot burst centred on one enemy; that enemy takes double the damage and cannot benefit from cover or concealment against it. Senkei (Slaughterscape) — the blades condense into a 20-foot cage around you and one enemy. Neither of you can leave; your Strikes…  
  **Icon brief** (Bleach — Byakuya's Senbonzakura Kageyoshi): A rushing river of pink cherry-blossom blades turning in mid-air like a school of fish, a second swirl tightening into a ball around a point.
- **Steady the Breath** · _action_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Steady the Breath is the Refocus activity: you meditate, or you argue with your sword, or you eat something. Ten minutes restores 1 Reiatsu Point . With Deep Breath , the first Steady the Breath each day restores 2 instead.  
  **Icon brief** (Homebrew (Soulbound class) — Refocus): A sheathed katana laid across a meditation mat with a thin curl of incense smoke, a soft blue glow slowly refilling the scabbard from tip to hilt.
- **Unbound Technique** · _action_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-blue.svg`  
  While you are in a Full Release , your Release Technique costs no Reiatsu Points — but you can use it only once per round . This entry is the allowance itself: it pays for the Technique, and when it is spent the Technique cannot be used again until your next round.  
  **Icon brief** (Homebrew (Soulbound class)): A released spirit weapon wreathed in a free-flowing aura whose energy loops back into itself in an endless figure-eight, no cost glyph — power flowing unspent.
- **Zanka no Tachi — Sustain** · _action_ · `icons/magic/fire/flame-burning-campfire-orange.webp`  
  Frequency once per round Select one cardinal aspect. It lasts until you select another. Higashi: Kyokujitsujin — your Strikes ignore all resistances and immunities, and a creature damaged by your spirit weapon can't regain Hit Points and has its regeneration and fast healing suppressed until the end of your next turn. Nishi: Zanjitsu Gokui — fire immunity, resistance to all damage equal to half…  
  **Icon brief** (Bleach — Yamamoto's Zanka no Tachi): A compass rose drawn in ash on cracked earth, each of its four points (east, west, south, north) tipped with a different heat: a burning edge, a flame aura, rising skeletal hands, and a cleaving slash.
#### Core

- **Deepening Reserve (11th)** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  The well goes down further still. Your maximum reiatsu pool increases to 3 Reiatsu Points. How this works in Foundry: Pathfinder derives your focus pool's size from the focus effects you know — one point per non-cantrip focus effect — and then clamps it to a ceiling. This feature sets that ceiling. Until you have chosen a Spirit and gained its Release Technique, you know no focus effects and the…  
  **Icon brief** (Homebrew (Soulbound class)): A deep stone well viewed from above, three levels of glowing blue water rings descending into darkness, the lowest ring brightest.
- **Deepening Reserve (5th)** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  The well goes down further than it did. Your maximum reiatsu pool increases to 2 Reiatsu Points. How this works in Foundry: Pathfinder derives your focus pool's size from the focus effects you know — one point per non-cantrip focus effect — and then clamps it to a ceiling. This feature sets that ceiling. Until you have chosen a Spirit and gained its Release Technique, you know no focus effects…  
  **Icon brief** (Homebrew (Soulbound class)): A stone well seen from above with two rings of glowing blue spiritual water inside it, the second ring newly lit.
- **Departed Flesh** · _feat_ · `modules/isaacs-hb-pf2e/icons/skull-humanoid-white.svg`  
  You're immune to disease, you don't need to eat or drink, and when you roll a success on a save against a poison effect you get a critical success instead. You still need to rest.  
  **Icon brief** (Bleach — souls in Soul Society (gigai-less body)): A translucent, ghostly hand with a broken chain of fate dangling from the wrist, untouched by a cloud of green poison vapour that parts around it.
- **Flash Step** · _feat_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  Frequency once per round You step between one instant and the next. Stride up to your Speed. This movement doesn't trigger reactions. Shunpo &middot; Sonido &middot; Hirenkyaku.  
  **Icon brief** (Bleach — Shunpo / Sonido / Hirenkyaku): A streak of motion across the frame: a faint afterimage at one end, a sharp flicker of displaced air and a single footprint of light at the other, nothing in between.
- **Full Release** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-blue.svg`  
  Frequency once per day Requirements Your spirit weapon is in its released form and you have at least 1 Reiatsu Point Bankai &middot; Segunda Etapa &middot; Vollständig. For 1 minute : Your spirit weapon's damage die increases by one step. You gain your Spirit's Full Release ability. Your Release Technique costs no Reiatsu Points, but you can use it only once per round . You emit a 15-foot…  
  **Icon brief** (Bleach — Bankai / Segunda Etapa / Vollständig): A towering pillar of reiatsu erupting skyward from a sword, black-and-white energy spiralling up with a shockwave ring spreading at its base.
- **Greater Flash Step** · _feat_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  You leave an afterimage. Until the start of your next turn after you use Flash Step, the first attack made against you each round requires the attacker to succeed at a DC 5 flat check or the attack misses. Automation note: the flat check is rolled and announced when an attack resolves against you. Pathfinder fixes an attack's outcome before this module can see it, so for now the roll is reported…  
  **Icon brief** (Bleach — Shunpo afterimage): Two identical translucent silhouettes, one fading, one solid, with an enemy blade passing harmlessly through the ghostly afterimage.
- **Konsō** · _feat_ · `icons/magic/holy/prayer-hands-glowing-yellow.webp`  
  Soul Burial. A 10-minute exploration activity. Choose a haunt, spirit, or incorporeal undead of your level or lower that is not currently hostile (or has been reduced below half Hit Points and is willing, restrained, or bound). Attempt a Religion or Spirit Lore check against its DC. Critical Success The soul departs peacefully. A haunt is permanently neutralized; an undead is destroyed without…  
  **Icon brief** (Bleach — Konsō (soul burial)): The butt of a katana hilt pressing against a glowing forehead, a black kanji seal blooming at the contact point and a soul dissolving into a flutter of black hell butterflies.
- **Lineage** · _feat_ · `icons/magic/symbols/runes-triangle-blue.webp`  
  Three peoples fight the same war with the same physics and opposite manners. Choose what you are; the choice is permanent. Soul Reaper Hollow Quincy Buys Kidō breadth (six chosen) and the Zanjutsu family Hierro, Regeneración, Sonido Reishi weapon, Blut, Sealing Pays No resistance, no fast healing, baseline Speed Two fixed kidō (Cero, Bala); no Zanjutsu Two fixed kidō (Heizen, Gritz); no Zanjutsu…  
  **Icon brief** (Homebrew (Soulbound class)): Three paths branching from a single point: a black katana, a white bone mask, and a blue reishi bow at the ends of three diverging roads, a choice to be made.
- **Perfected Full Release** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-purple.svg`  
  Your Full Release lasts 2 minutes instead of 1, its emanation increases to 20 feet , and you are no longer fatigued when it ends.  
  **Icon brief** (Homebrew (Soulbound class)): A Bankai-scale pillar of energy, steadier and wider than the first, its aura ring double-banded and calm at the edges — power held without strain.
- **Refined Release** · _feat_ · `icons/magic/light/explosion-star-glow-purple.webp`  
  Your Release Technique gains its Refined benefit, listed under your Spirit. The base rank of the Refined effect is 5. Where a Refined benefit widens an area, it is applied here rather than authored into the Technique: a focus effect heightens per rank, and "at 9th level" is not a rank step.  
  **Icon brief** (Homebrew (Soulbound class)): A released blade with its special technique engraved along the fuller in glowing kanji, the light sharper and more precise than a raw release.
- **Reiatsu** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  You have a reiatsu pool : maximum 1 Reiatsu Point, increasing to 2 at 5th level and 3 at 11th. Refill it during your daily preparations, or by spending 10 minutes on Steady the Breath — the Refocus activity. You meditate, or you argue with your sword, or you eat something. Techniques and kidō are focus effects with the reiatsu trait. They use your Reiatsu DC and key attribute, have no rank , and…  
  **Icon brief** (Homebrew (Soulbound class) — reiatsu pool): A single glowing orb of blue-white spiritual pressure cupped in an open palm, wisps of aura rising off it like steam.
- **Reiatsu Expertise** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Your spiritual pressure has weight others can feel across a room. Your proficiency rank for your Reiatsu DC increases to expert.  
  **Icon brief** (Bleach — reiatsu): A tall column of visible spiritual pressure rising off a silhouette, shaded heavier at the base so the floor seems to sag under its weight.
- **Reiatsu Mastery** · _feat_ · `icons/magic/light/explosion-star-glow-purple.webp`  
  Standing near you is a decision other people have to make. Your proficiency rank for your Reiatsu DC increases to master.  
  **Icon brief** (Bleach — reiatsu): A room-filling dome of crushing reiatsu, everything under it bowed toward the floor, the central aura dense and nearly opaque.
- **Released Form** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Your Lineage offers you a Spirit to choose — a zanpakutō, a Resurrección, or a Schrift. It grants a Release action, a Released Form — permanent changes to your weapon's statistics and traits while released — and a Release Technique , a signature effect costing 1 Reiatsu Point and usable only while released. Release is not a stance. It doesn't conflict with stance actions, and it lasts the whole…  
  **Icon brief** (Homebrew (Soulbound class)): A sealed weapon beside its released form, an arrow of light between them: plain katana to ornate blade, mask fragment to armour, bow-sigil to full bow.
- **Rising Pressure** · _feat_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue.svg`  
  Once per round, the first time you either deal damage to an enemy with your spirit weapon or take damage from an enemy, you regain 1 Reiatsu Point . You can't exceed your maximum pool, and over the course of a single encounter you can't regain more points this way than your maximum pool size. Level Pool Max per encounter Techniques per fight 1–4 1 +1 2 5–10 2 +2 4 11–20 3 +3 6 Every other focus…  
  **Icon brief** (Homebrew (Soulbound class)): A blade striking and drawing a thread of blue reiatsu back into itself from the wound, a small refill gauge glowing at the hilt.
- **Spirit (Hollow)** · _feat_ · `icons/magic/symbols/runes-star-blue.webp`  
  Choose your Spirit — your Resurrección. It grants a Released Form , a Release Technique , and, at 13th level, a Full Release . The choice is permanent.  
  **Icon brief** (Bleach — Arrancar Resurrección): A cracked bone mask fragment on a hilt, energy splitting the mask open to reveal a beast-shaped silhouette of power within.
- **Spirit (Quincy)** · _feat_ · `icons/magic/symbols/runes-star-blue.webp`  
  Choose your Spirit — your Schrift. It grants a Released Form , a Release Technique , and, at 13th level, a Full Release . The choice is permanent.  
  **Icon brief** (Bleach — Quincy Schrift): A single glowing gothic letter (Schrift) blazing in blue-white light inside a Quincy five-pointed cross, ready to be claimed.
- **Spirit (Soul Reaper)** · _feat_ · `icons/magic/symbols/runes-star-blue.webp`  
  Choose your Spirit — your zanpakutō. It grants a Released Form , a Release Technique , and, at 13th level, a Full Release . The choice is permanent.  
  **Icon brief** (Bleach — zanpakutō spirit): A katana held upright with the shadowy shape of its spirit rising behind it, an indistinct figure made of the blade's own reiatsu.
- **Spirit Lore** · _lore_ · `systems/pf2e/icons/default-icons/lore.svg`  
  Souls, the afterlife, haunts, and hollow-things — where they come from, what they want, and what is owed to them.  
  **Icon brief** (Homebrew (Soulbound class)): An open old tome showing a ghost, a Hollow mask and a chain of fate sketched in ink, a black hell butterfly resting on the page.
- **Spirit Sense** · _feat_ · `icons/magic/perception/third-eye-blue-red.webp`  
  You automatically sense the presence and approximate strength of undead, haunts, spirits, and incorporeal creatures within 60 feet , even through thin barriers, without learning their exact location — they are hidden to you rather than undetected. You can see and target incorporeal creatures normally. You are also trained in Spirit Lore : souls, the afterlife, haunts, and hollow-things.  
  **Icon brief** (Homebrew (Soulbound class)): Faint glowing outlines of spirits and a hollow-mask silhouette behind a thin wall, sensed as warm smudges of light rather than seen.
- **Spirit Weapon** · _feat_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Your power has a shape. What that shape is depends on your Lineage — a Soul Reaper's zanpakutō is their own soul with an edge on it, a Hollow's is the fragment of mask that sealed their power inside their body, a Quincy's is a bow condensed out of the air — but the rules are identical. Choose one sealed profile. Your spirit weapon is a martial weapon and always counts as one you're proficient…  
  **Icon brief** (Bleach — zanpakutō / mask / Heilig Bogen): A katana, a bone mask fragment and a blue reishi bow arranged in a triangle around a glowing soul flame — three shapes of the same power.
- **Spirit Weave** · _feat_ · `icons/equipment/chest/breastplate-layered-leather-blue.webp`  
  Reishi settles into the weave of what you wear. Your proficiency ranks in light armor and unarmored defense increase to expert.  
  **Icon brief** (Homebrew (Soulbound class)): Close-up of black shihakushō cloth whose weave glows with fine threads of blue reishi, a deflected strike sparking off it.
- **Unsealed** · _feat_ · `icons/magic/light/explosion-star-large-orange.webp`  
  You can use Full Release twice per day . While in a Full Release you're immune to fear effects, and the first time each round you critically hit with your spirit weapon you regain 1 Reiatsu Point.  
  **Icon brief** (Homebrew (Soulbound class)): Two reiatsu pillars side by side, a broken seal paper fluttering between them, a burning core of fearless white light at the centre.
- **Weapon Expertise** · _feat_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Practice has made the blade an extension of the argument. Your proficiency ranks for simple weapons, martial weapons, unarmed attacks, and your spirit weapon increase to expert. You also gain access to the critical specialization effects of all weapons you are at least expert with.  
  **Icon brief** (Homebrew (Soulbound class)): A katana mid-swing leaving a clean crescent of light, the edge sharp and bright as a mirror.
- **Weapon Mastery** · _feat_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Your proficiency ranks for simple weapons, martial weapons, unarmed attacks, and your spirit weapon increase to master.  
  **Icon brief** (Homebrew (Soulbound class)): A katana held in perfect stillness with a single drop falling cleanly in two along its edge.
#### Lineages

- **Cero and Bala** · _feat_ · `modules/isaacs-hb-pf2e/icons/beam-jet-stream-red.svg`  
  A Hollow's demon arts are not learned, they are anatomy . You know exactly two kidō and they are always these: Bala , your free cantrip, and Cero . You cannot learn others, and no feat grants you more.  
  **Icon brief** (Bleach — Hollow Cero and Bala): An open palm with a red sphere of cero charging between the fingertips and a small red bullet of compressed reiatsu (bala) shooting off a knuckle.
- **Heilig Bogen and Blut** · _feat_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  Heilig Bogen ("holy bow"). You may choose the Spirit Bow profile for your spirit weapon. Your bow needs no ammunition; you condense arrows out of ambient reishi. In an area with little or no ambient spiritual energy — a dead-magic zone, a sealed vault — your bow's damage die decreases by one step. Blut [free-action] Frequency once per round. Choose Vene or Arterie . The choice lasts until the…  
  **Icon brief** (Bleach — Quincy Heilig Bogen and Blut): A glowing blue reishi bow drawn back, ambient particles streaming into the arrow, with blue vein-patterns lighting up along the drawing arm.
- **Heizen and Gritz** · _feat_ · `icons/magic/light/beam-rays-blue-large.webp`  
  A Quincy's demon arts are Gintō — small silver tubes of liquefied reiryoku, uncorked and spoken over, which is exactly what Kidō is to a Soul Reaper. You know two and they are always these: Heizen , your free cantrip, and Gritz . You cannot learn others, and no feat grants you more. The third canon Gintō, Sprenger, is not a kidō: it needs five Seele Schneider planted in a pentacle, and it appears…  
  **Icon brief** (Bleach — Quincy Gintō): Two small silver tubes uncorked, liquefied silver reiryoku pouring out and forming a cross-shaped pillar of light (Heizen) and a cage of light bars (Gritz).
- **Hierro and Sonido** · _feat_ · `icons/equipment/chest/breastplate-scale-grey.webp`  
  Hierro ("iron skin"). Your compressed reiryoku hardens your skin. You gain resistance to physical damage equal to half your level (minimum 1). Sonido ("sound"). You gain a +5-foot status bonus to all your Speeds. At 11th level this increases to +10 feet. Hierro is broader than Thermal Nimbus — all physical rather than one energy type — at half the rate, and it arrives at 1st level on a class with…  
  **Icon brief** (Bleach — Arrancar Hierro and Sonido): Steel-grey skin with a blade bouncing off it in sparks, and beside it a blur-streak of high-speed movement with a sonic crack.
- **Hollow** · _feat_ · `modules/isaacs-hb-pf2e/icons/skull-horned-white.svg`  
  Arrancar. You ate your own heart and wear the hole; your power is sealed inside you rather than carried. Granted skill Athletics. Release ladder Resurrección &rarr; Segunda Etapa. Your demon arts are not learned, they are anatomy: you know Bala and Cero , you cannot learn others, and no feat grants you more.  
  **Icon brief** (Bleach — Arrancar): A cracked white bone mask fragment over a hole torn through a chest, black hollow energy curling from the void.
- **Kidō Adept** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn two kidō of your choice at 1st level, and one additional kidō at 5th, 9th, 13th and 17th level — six chosen kidō in total, on top of your free cantrip Shō . You are the only Lineage that chooses : a Hollow and a Quincy each get exactly two fixed kidō native to what they are. Six known focus effects is the top of the range Pathfinder permits without a spell list, and this is the Lineage…  
  **Icon brief** (Bleach — Kidō): Six glowing kidō glyph circles arranged in a ring around an outstretched hand, each a different colour (red fire, yellow binding, green healing, blue fire, pale lightning, black).
- **Kidō Learned (13th)** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn one kidō of your choice from the Ways of Destruction, Binding and Mending.  
  **Icon brief** (Bleach — Kidō): A hand tracing the thirteenth stroke of a kidō incantation in mid-air, the glyph circle completing with an orange flare.
- **Kidō Learned (17th)** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn one kidō of your choice from the Ways of Destruction, Binding and Mending.  
  **Icon brief** (Bleach — Kidō): A dense kidō glyph circle with many rings, its final ring sealing shut with a white flash — a high-number incantation mastered.
- **Kidō Learned (1st)** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn one kidō of your choice from the Ways of Destruction, Binding and Mending.  
  **Icon brief** (Bleach — Kidō): A single simple kidō glyph circle glowing in an open palm, the first chant learned, thin and bright.
- **Kidō Learned (2nd)** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn one kidō of your choice from the Ways of Destruction, Binding and Mending.  
  **Icon brief** (Bleach — Kidō): Two small overlapping kidō glyph circles glowing above a palm, red and yellow.
- **Kidō Learned (5th)** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn one kidō of your choice from the Ways of Destruction, Binding and Mending.  
  **Icon brief** (Bleach — Kidō): A kidō glyph circle with five spokes of light, glowing green-blue, chant text circling its rim.
- **Kidō Learned (9th)** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn one kidō of your choice from the Ways of Destruction, Binding and Mending.  
  **Icon brief** (Bleach — Kidō): A layered kidō circle with nine segmented arcs of light orbiting it, a crackle of energy at the centre.
- **Quincy** · _feat_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  You own no soul-weapon at all. You reach into the air, take the spirit particles that are already there, and make a bow out of them. Granted skill Crafting. Release ladder Schrift &rarr; Vollständig. Your demon arts are Gintō — silver tubes of liquefied reiryoku, uncorked and spoken over. You know Heizen and Gritz , and you cannot learn others. At 5th level you gain the talent that started a war:…  
  **Icon brief** (Bleach — Quincy): Floating spirit particles drawn out of the air and condensing into a blue reishi bow, a blue five-pointed Quincy cross dangling below it.
- **Regeneración** · _feat_ · `icons/magic/life/cross-area-circle-green-white.webp`  
  High-speed regeneration. You gain fast healing 2 . This increases to fast healing 4 at 11th level and fast healing 6 at 17th. It is deactivated while you have the dying condition , and suppressed until the end of your next turn whenever you take spirit damage or damage from a holy or vitality effect. Soul Reapers and Quincy exist to shut this down, and both can, from 1st level. That clause is the…  
  **Icon brief** (Bleach — Arrancar Regeneración): A severed limb regrowing from the stump in a burst of white bone and fresh tissue, with a green-white glow along the seam.
- **Sealing** · _feat_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  The Quincy talent that started a war: they do not out-fight a Soul Reaper, they switch them off . You gain the Seal the Art activity.  
  **Icon brief** (Bleach — Quincy seals): A Quincy cross pressed over a zanpakutō, the blade's glow dimming and draining into the cross — a sword switched off.
- **Segunda Piel** · _feat_ · `modules/isaacs-hb-pf2e/icons/breastplate-scale-grey-white.svg`  
  Hierro's resistance applies to spirit damage as well as physical, and Regeneración is no longer suppressed by damage from holy or vitality effects. Spirit damage still suppresses it.  
  **Icon brief** (Bleach — Arrancar Hierro): Skin plated over with a second, harder layer of white bone-like armour, a spirit blade glancing off with sparks.
- **Sklaverei** · _feat_ · `icons/magic/control/energy-stream-link-blue.webp`  
  Absolute subordination of reishi. When you successfully counteract with Seal the Art , you regain 1 Reiatsu Point (ignoring Rising Pressure's per-encounter cap), and the target is off-guard until the end of its next turn. On a critical success against a release state, the suppression lasts 1 minute instead.  
  **Icon brief** (Bleach — Quincy Sklaverei): Ribbons of spirit particles torn out of the surroundings and spiralling into a single glowing Quincy cross, which shines brighter as it eats them.
- **Soul Reaper** · _feat_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Shinigami. You carry your own soul as a sword, and it argues with you. Granted skill Society. Release ladder Shikai &rarr; Bankai. You are the only Lineage that chooses its demon arts: six kidō of your own selection, on top of your free cantrip Shō . You also drill the sword arts rather than intuiting them, and gain the Zanjutsu family at 5th level.  
  **Icon brief** (Bleach — Shinigami): A katana in a black scabbard tied with a white sash, a black hell butterfly perched on the hilt.
- **Zanjutsu** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  The sword arts, drilled rather than intuited. You gain access to the Zanjutsu feat family and one Zanjutsu technique of your choice for free. Zanjutsu techniques are Strike-based reiatsu effects, each costing 1 Reiatsu Point and requiring your spirit weapon to be Released. More of the family can be taken as class feats at their listed levels.  
  **Icon brief** (Bleach — Zanjutsu): A katana in a precise iaido draw, its clean silver arc leaving a single thin line of light.
- **Zanjutsu Mastery** · _feat_ · `icons/skills/melee/blade-tips-triple-steel.webp`  
  Your Zanjutsu techniques' damage dice increase by one step (d6&rarr;d8, d8&rarr;d10). Once per round, when you critically hit with your spirit weapon, you regain 1 Reiatsu Point. This ignores Rising Pressure's per-encounter cap .  
  **Icon brief** (Bleach — Zanjutsu): A katana cutting a perfect crescent of light, the edge leaving three ghost-trails, each sharper than the last.
#### Spirits

- **Antithesis** · _feat_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  A — Uryū Ishida. The last Quincy of the old line, and the only one who chose his letter's meaning himself. Antithesis reverses two events that have already happened.  
  **Icon brief** (Bleach — Uryū's 'A' (Antithesis)): Two arrows of blue light flying in opposite directions along a single line, crossing in an X where a wound and its reversal swap places.
- **Antithesis — Schrift** · _feat_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  Your Heilig Bogen takes its full shape — a broad blue bow of light. Your spirit weapon gains the Spirit Bow profile if it did not have it, its damage die increases by one step, and its range increment increases to 100 feet . You also gain Seele Schneider (Soul Cutter) : your bow may be used as a melee weapon, 1d8 slashing , finesse , whose vibrating reishi edge means its Strikes ignore resistance…  
  **Icon brief** (Bleach — Uryū's Heilig Bogen (Schrift form)): A broad, winged blue bow of light, its wide arms built like spread wings, a crackling arrow of reishi nocked at the centre.
- **Arrogante** · _feat_ · `modules/isaacs-hb-pf2e/icons/skull-crowned-white.svg`  
  Arrogance — Baraggan Louisenbairn. Release: "Rot." The God-King of Hueco Mundo. His aspect of death is aging, and he is in no hurry, because nothing that lives can outlast him.  
  **Icon brief** (Bleach — Barragan's Arrogante): A sealed zanpakutō: a huge ornate battle axe with an ornamented crown motif on the head, wrapped in a faint purple-black haze of decay.
- **Arrogante — Resurrección** · _feat_ · `modules/isaacs-hb-pf2e/icons/skull-crowned-white.svg`  
  Your flesh sloughs away and you stand as a crowned skeleton in a dark cloak. Your spirit weapon becomes Gran Caída (Great Fall) : 1d12 slashing , two-handed, sweep , forceful . You become immune to disease , poison , and the doomed condition's worsening — you can still gain doomed, but it never increases past 1.  
  **Icon brief** (Bleach — Barragan's Resurrección): A jeweled golden crown floating above a skull in a dark hooded cloak, a massive black double-bladed axe (Gran Caída) planted beside it.
- **Bailar de Valquiria** · _feat_ · `modules/isaacs-hb-pf2e/icons/angel-winged-humanoid-golden.svg`  
  The Miracle Made Flesh. Golden wings, a mane of light, and a body that reassembles itself. You gain fast healing equal to your current Miracle points . When you are reduced to 0 Hit Points while you have at least 5 Miracle points, you instead remain at 1 Hit Point , lose 5 Miracle points, and your spirit weapon's damage die increases by one step for the rest of the encounter. This can occur any…  
  **Icon brief** (Homebrew (Soulbound class) — based on Gerard Valkyrie's Vollständig): Huge golden wings framing a heart of blazing white light, shattered pieces of armour flying back together around it as the body reassembles.
- **Colmillo** · _feat_ · `modules/isaacs-hb-pf2e/icons/wolf-howl-moon-grey-large.svg`  
  Canon gives Starrk no Segunda Etapa. The wolves themselves are canon — Starrk divides his soul and the fragments attack and detonate. You divide your soul. Eight spirit wolves appear in unoccupied squares within 30 feet. They are not creatures : they have no statistics, take no actions, cannot be attacked, and do not flank. They are a resource you spend. At the start of each of your turns, you…  
  **Icon brief** (Bleach — Starrk's soul wolves): A pack of eight translucent blue-white wolves made of reiatsu fanning out in a ring, eyes glowing, ready to lunge and detonate.
- **Daiguren Hyōrinmaru** · _feat_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-swirl-blue.svg`  
  Grand Crimson Lotus Ice Ring. Ice sheathes you as wings, claws, and a tail. You gain a fly Speed equal to your Speed and cold resistance equal to your level . Three four-petaled ice flowers hang in the air behind you. They are not a timer — canon is explicit that they mark how long until Daiguren Hyōrinmaru matures . Each is a charge. Once per round you may spend one petal-flower to use Sennen…  
  **Icon brief** (Bleach — Hitsugaya's Bankai, Daiguren Hyōrinmaru): Massive crystalline ice dragon wings spread wide behind a clawed ice arm holding a katana, three four-petaled ice flowers floating in an arc overhead.
- **Deus Ex Machina** · _feat_ · `icons/magic/fire/explosion-fireball-large-orange.webp`  
  The Heat at full output. Wings and a halo of blue reishi. You gain a fly Speed equal to your Speed and fire immunity , and: Burner Finger's Five option becomes a 60-foot cone . Once per round, when you damage a creature with fire, it takes 2d6 persistent fire damage; the flat check to end it is DC 20 rather than DC 15.  
  **Icon brief** (Homebrew (Soulbound class) — based on Bazz-B's Vollständig): A blazing Quincy pentagram halo of blue reishi hovering over rod-shaped wings of fire, flames licking off every edge.
- **Hirviendo** · _feat_ · `modules/isaacs-hb-pf2e/icons/water-elemental-blue.svg`  
  Canon gives Harribel no Segunda Etapa. Hirviendo itself is canon — she boils away all water around her, including ice. Water rises around you in a 20-foot emanation , difficult terrain for enemies. Once per round when you hit with your spirit weapon you may push the target 5 feet. La Gota may be used as a 60-foot line instead of a cone. You also gain Trident and Hirviendo .  
  **Icon brief** (Bleach — Harribel's Hirviendo): A shark-tooth broad blade pointing forward with the water around it boiling into roiling steam, bubbles and hot vapour rising in a ring.
- **Hyōrinmaru** · _feat_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  Ice Ring — Tōshirō Hitsugaya. Release: "Reign over the frosted heavens." The strongest ice zanpakutō. A patient dragon that thinks in centuries and is annoyed by your hurry.  
  **Icon brief** (Bleach — Hitsugaya's Hyōrinmaru): A sealed katana with a four-pointed star-shaped guard, a faint coil of frost wrapping the blade and an icy dragon eye glinting in its reflection.
- **Hyōrinmaru — Shikai** · _feat_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  A crescent blade on a chain, trailing an ice dragon. Your spirit weapon's damage type becomes cold (you may still choose spirit). On a critical hit, the target takes a −5-foot status penalty to its Speeds until the end of your next turn.  
  **Icon brief** (Bleach — Hitsugaya's Hyōrinmaru (Shikai)): A crescent-moon blade on a long chain swinging from a katana's hilt, a coiling ice dragon roaring off the blade's tip in blue-white mist.
- **Kanzen Saimin** · _feat_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-purple.svg`  
  Complete Hypnosis. Canon's condition is precise and this implements it literally: the target must have seen your Shikai release , and thereafter they are in your hypnosis every time you release. The blind are immune. When you Release, and when a creature that can see first observes you while released, that creature must succeed at a Will save against your Reiatsu DC or be hypnotized for 1 minute.…  
  **Icon brief** (Bleach — Aizen's Complete Hypnosis): A full moon reflected on a still lake, the reflection slightly offset from the real moon above — a double image warning of illusion.
- **Kanzen Saimin: Sōten Kisshun** · _feat_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-large-purple.svg`  
  Canon gives Aizen no Bankai. He never releases one, never names one, and the story treats Kyōka Suigetsu's Shikai as already being the strongest ability in the setting — that is the point of the character. This entry is therefore invented , and it is built as an extension of the Shikai rather than a new form, which is the only honest way to do it. All enemies within 60 feet who can see you must…  
  **Icon brief** (Homebrew (Soulbound class) — invented Bankai for Kyōka Suigetsu): A shattered mirror whose every shard reflects a different false world, all of them showing the same moon; violet light, the surrounding scene splitting apart like glass.
- **Kyōka Suigetsu** · _feat_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-purple.svg`  
  Mirror Flower, Water Moon — Sōsuke Aizen. Release: "Shatter." A spirit of perfect deception. It does not lie to your enemies. It lies to their senses, and it lies constantly.  
  **Icon brief** (Bleach — Aizen's Kyōka Suigetsu): A katana held over still water, its reflection rippling into a blooming flower; a full moon mirrored perfectly beside it.
- **Los Lobos** · _feat_ · `modules/isaacs-hb-pf2e/icons/wolf-howl-moon-grey.svg`  
  The Wolves — Coyote Starrk. Release: "Kick about." The loneliest Espada. His power was never sealed in a sword — it was sealed in another person, because he could not bear to be alone with it.  
  **Icon brief** (Bleach — Starrk's Los Lobos): A sealed katana resting against a howling grey wolf silhouette under the moon, the wolf's shape made of drifting blue reiatsu.
- **Los Lobos — Resurrección** · _feat_ · `modules/isaacs-hb-pf2e/icons/wolf-howl-moon-grey.svg`  
  Your spirit weapon splits into two ornate pistols . Each is a ranged weapon: 1d6 piercing , agile , range increment 60 feet, reload 0, and they need no ammunition. You may wield and fire both. You also gain a grey wolf-pelt coat and bandolier; your Speed increases by 5 feet. On the second voice: canon's Los Lobos is two beings sharing one power, and the pistols speak. That is a roleplaying fact,…  
  **Icon brief** (Bleach — Starrk's Resurrección): Two ornate, engraved pistols crossed over a wolf-fur pelt, a puff of blue cero smoke at each muzzle.
- **Murciélago** · _feat_ · `modules/isaacs-hb-pf2e/icons/wing-bat-membrane-green.svg`  
  Bat — Ulquiorra Cifer. Release: "Enclose." Emptiness given form. Cold, precise, and genuinely curious about what a heart is.  
  **Icon brief** (Bleach — Ulquiorra's Murciélago): A sealed katana with a dark guard, a single black bat wing unfurling from its hilt in green-tinged shadow.
- **Murciélago — Resurrección** · _feat_ · `modules/isaacs-hb-pf2e/icons/wing-bat-membrane-green.svg`  
  Black membranous wings, a tattered coat of energy, and green tear-tracks. You gain a fly Speed equal to your Speed. Your spirit weapon becomes Luz de la Luna (Light of the Moon) , a javelin of hardened green energy: 1d10 piercing , versatile S, reach , and it re-forms in your hand instantly if thrown or dropped.  
  **Icon brief** (Bleach — Ulquiorra's Resurrección): A pair of black membranous bat wings spread wide around a bright green javelin of hardened light (Luz de la Luna).
- **Murciélago — Segunda Etapa** · _feat_ · `modules/isaacs-hb-pf2e/icons/wing-bat-membrane-green-large.svg`  
  The only canon Segunda Etapa in the series. Your remaining humanity sheds: black fur, a long whip-like tail, horns, and the mask gone entirely. Your fly Speed increases by 20 feet . You gain resistance to all damage except spirit equal to half your level . High-Speed Regeneration. Your Regeneración fast healing doubles , and it now restores lost limbs. You gain Lanza del Relámpago .  
  **Icon brief** (Bleach — Ulquiorra's Segunda Etapa): A demonic black silhouette with a long whip-like tail and curved horns, black fur shedding green light, green tear-lines glowing where the face should be.
- **Pantera** · _feat_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue.svg`  
  Panther — Grimmjow Jaegerjaquez. Release: "Grind." A predator that has never once been bored. Speed, claws, and appetite.  
  **Icon brief** (Bleach — Grimmjow's Pantera): A sealed katana with a panther's claw-mark slash across it, blue light seeping from the scratches.
- **Pantera — Resurrección** · _feat_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue.svg`  
  Your mask-fragment dissolves into white armour, claws, and a whip of a tail. You gain two claw unarmed attacks: 1d8 slashing , agile , finesse , in the brawling group. Your Speed increases by 10 feet (this stacks with Sonido).  
  **Icon brief** (Bleach — Grimmjow's Resurrección): White armoured claws mid-swipe with a whip-like tail curling behind, blue energy flaring off the claw tips.
- **Pantera — Segunda Etapa** · _feat_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue-large.svg`  
  Canon gives Grimmjow no Segunda Etapa — Ulquiorra is explicitly the only Espada who reached one. The technique Desgarrón is canon and appears where canon puts it, at his Final Release. This second released form is invented , and is deliberately the least transformative of the five Hollow entries for that reason. Your Speed increases by another 10 feet , and your claws gain deadly d10 . Once per…  
  **Icon brief** (Homebrew (Soulbound class) — invented second form for Grimmjow): Ten long blue energy claws (Desgarrón) arcing out from a pair of white armoured paws, fiercer and longer than before.
- **Quincy: Letzt Stil** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-blue.svg`  
  Last Form. Unlike every other Vollständig, Letzt Stil is not a wings-and-halo transformation — it is the old Quincy technique of removing the limiter on your own bow. A blue quiver of pure reiryoku forms at your right shoulder and drinks the ambient reishi. Your spirit weapon's damage die increases by two steps instead of one. Your Strikes ignore all resistances to physical and spirit damage, and…  
  **Icon brief** (Bleach — Quincy Letzt Stil): A blue quiver of pure reiryoku forming at a shoulder, drawing ambient particles in, beside a huge limiter-free bow crackling with uncontrolled power.
- **Respira Absoluta** · _feat_ · `modules/isaacs-hb-pf2e/icons/skull-crowned-white-purple.svg`  
  Canon gives Baraggan no Segunda Etapa ; his Resurrección is already treated as the end state. This form extrapolates from what canon does establish: Respira ages everything it touches, including attacks aimed at him and the ground he stands on, and Baraggan can control its speed. Respira becomes permanent and free . You emit a 20-foot emanation of aging miasma for as long as the Segunda Etapa…  
  **Icon brief** (Homebrew (Soulbound class) — extrapolated from Barragan's Respira): A wide ring of dark purple aging miasma spreading over cracked, crumbling ground, everything it touches withering into dust and bones.
- **Ryūjin Jakka** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-glowing-orange.svg`  
  Flowing Blade-like Flame — Genryūsai Shigekuni Yamamoto. Release: "Reduce all creation to ash." The oldest and strongest fire zanpakutō in Soul Society. It does not burn things down so much as decide they are finished.  
  **Icon brief** (Bleach — Yamamoto's Ryūjin Jakka): A sealed katana emerging from a wooden walking cane, the first lick of flame curling from the blade's edge.
- **Ryūjin Jakka — Shikai** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-glowing-orange.svg`  
  The blade sheathes itself in flame. Your spirit weapon's damage type becomes fire (you may still choose spirit) and it gains deadly d8 . You gain fire resistance equal to half your level .  
  **Icon brief** (Bleach — Yamamoto's Ryūjin Jakka (Shikai)): A katana fully engulfed in roaring orange flame, the fire streaming off it like a banner.
- **Senbonzakura** · _feat_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-pink.svg`  
  Thousand Cherry Blossoms — Byakuya Kuchiki. Release: "Scatter." A blade that refuses to be one blade. Aristocratic, precise, and utterly without mercy.  
  **Icon brief** (Bleach — Byakuya's Senbonzakura): A sealed katana with a single pink cherry blossom petal resting on the blade's edge, already sliced cleanly in two.
- **Senbonzakura — Shikai** · _feat_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-pink.svg`  
  Your blade disintegrates into a slow cloud of petal-fine blades. Your Strikes gain reach 15 feet and lose the two-hand and twin traits; your hands are empty. Your Strikes are not affected by cover between you and the target — the blades simply go around it.  
  **Icon brief** (Bleach — Byakuya's Senbonzakura (Shikai)): A katana hilt with no blade, the blade drifting off it as a slow pink cloud of glinting petal-shaped blades.
- **Senbonzakura Kageyoshi** · _feat_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-pink-red.svg`  
  Vibrant Display of a Thousand Cherry Blossoms. Two rows of a thousand blades rise from the ground and scatter. You gain a second 20-foot emanation centred on a point within 60 feet. At the start of each of your turns, each enemy in either emanation takes 5d6[slashing] damage with a basic Reflex save. You can Sustain once per round to move the second emanation up to 30 feet, or to switch between…  
  **Icon brief** (Bleach — Byakuya's Bankai, Senbonzakura Kageyoshi): Two long rows of giant, gleaming swords rising out of darkness, their tops already scattering into a pink torrent of cherry-blossom blades.
- **Tensa Zangetsu** · _feat_ · `modules/isaacs-hb-pf2e/icons/sword-katana-black.svg`  
  Heaven Chain Slaying Moon. Canon compresses rather than expands: everything Ichigo has is forced into a smaller, blacker blade. Your spirit weapon's damage die does not increase, overriding Full Release's normal die step. Instead: You gain a +10-foot status bonus to all Speeds, and Flash Step's frequency becomes twice per round . Getsuga Tenshō becomes 1 action , and its line is 60 feet (90 with…  
  **Icon brief** (Bleach — Ichigo's Bankai, Tensa Zangetsu): A slim, all-black daitō with a manji (卍)-shaped guard and a short broken chain at the pommel, black reiatsu with a red outline coiling around it.
- **The Balance** · _feat_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  B — Jugram Haschwalth. Yhwach's second, and the coldest ability in the series: he does not stop misfortune, he moves it onto someone else.  
  **Icon brief** (Bleach — Haschwalth's 'B' (The Balance)): A golden balance scale, one pan holding a bright star of good fortune, the other a dark cloud of misfortune tipping toward a distant figure.
- **The Balance — Schrift** · _feat_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  Your spirit weapon becomes Freund Schild (Substitute Shield) , canon's name for Haschwalth's spirit weapon — he fights with a blade, not a bow: 1d8 slashing , versatile P, parry . You gain a +1 circumstance bonus to AC while you have at least 1 Reiatsu Point remaining. This is the one flat numeric bonus in the class. It is a circumstance bonus, so it collides with cover and with Raise a Shield,…  
  **Icon brief** (Bleach — Haschwalth's Freund Schild): A tall ornate kite-shield with a Quincy cross emblem paired with a straight sword, the shield glowing pale blue.
- **The Balance, at Night** · _feat_ · `modules/isaacs-hb-pf2e/icons/heater-crystal-white.svg`  
  Canon's Haschwalth holds Yhwach's power while his king sleeps. Wings of white light, a halo, and a sword in each hand. Your Release Technique's damage reduction increases to three times your level . Once per round, when an ally within 60 feet would take damage, you may redirect that damage to yourself; you then apply your Release Technique's reduction to it as a free action without spending your…  
  **Icon brief** (Bleach — Haschwalth's Vollständig): Wings of white light and a glowing halo behind a sword in each hand, a balance scale glyph shining between them.
- **The Heat** · _feat_ · `modules/isaacs-hb-pf2e/icons/projectile-fireball-smoke-strong-red.svg`  
  H — Bazz-B. Loud, disloyal, and the best pure offensive Schrift in the Wandenreich. He controls heat by counting on his fingers.  
  **Icon brief** (Bleach — Bazz-B's 'H' (The Heat)): Five fingers splayed, each tip burning a different intensity of flame from orange to white-blue, heat haze shimmering around the hand.
- **The Heat — Schrift** · _feat_ · `modules/isaacs-hb-pf2e/icons/projectile-fireball-smoke-strong-red.svg`  
  Your reishi runs hot. Your spirit weapon's damage type becomes fire (you may still choose spirit), it gains deadly d8 , and you gain fire resistance equal to half your level . Canon's escalation is literal — Burner Finger One through Five .  
  **Icon brief** (Bleach — Bazz-B's 'H' (The Heat)): A hand with one finger raised and glowing white-hot, a thin pillar of flame like a laser shooting from its tip.
- **The Miracle** · _feat_ · `icons/magic/holy/angel-winged-humanoid-blue.webp`  
  M — Gerard Valkyrie. The Heart of the Soul King. Break him and he does not weaken — he gets bigger. The only way to beat The Miracle is to stop hitting it.  
  **Icon brief** (Bleach — Gerard's 'M' (The Miracle)): A cracked golden heart with light pouring out of the cracks, growing bigger with every crack.
- **The Miracle — Schrift** · _feat_ · `icons/magic/holy/angel-winged-humanoid-blue.webp`  
  You take up an enormous sword and shield of white reishi. Your spirit weapon becomes 1d12 slashing , two-handed, forceful , shove . Your maximum Hit Points increase by your level, and you gain a +1 circumstance bonus to saves against effects that would reduce your Hit Points to 0.  
  **Icon brief** (Bleach — Gerard's 'M' Schrift): An enormous sword and shield made of white reishi, the shield's face bearing a Quincy cross, a golden aura pulsing from them.
- **The Thunderbolt** · _feat_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-white.svg`  
  T — Candice Catnipp. The most aggressive Schrift in the Sternritter. She does not aim; she becomes the lightning and arrives.  
  **Icon brief** (Bleach — Candice's 'T' (The Thunderbolt)): A jagged lightning bolt slamming down from a dark sky into the ground with a starburst of green-white sparks.
- **The Thunderbolt — Schrift** · _feat_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-white.svg`  
  Your spirit weapon becomes a sword of arcing electricity : 1d8 slashing , versatile P, and its damage type becomes electricity (you may still choose spirit). You gain electricity resistance equal to half your level , and your Flash Step becomes an electricity-flavoured teleport — it ignores difficult terrain and you may pass through creatures' spaces, though you can't end there.  
  **Icon brief** (Bleach — Candice's 'T' Schrift): A straight sword made entirely of arcing yellow-green electricity, branching sparks jumping off its edges.
- **Thunderbolt Form** · _feat_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-forked-white.svg`  
  Your hair becomes lightning and your wings arc white. You gain a fly Speed equal to your Speed and electricity immunity , and: You emit a 10-foot emanation of live current. A creature that ends its turn in it takes 3d6[electricity] damage (basic Reflex). Once per round when you hit with your spirit weapon, arcs jump: one other creature within 15 feet of the target takes 3d6 electricity (basic…  
  **Icon brief** (Bleach — Candice's Vollständig): Six jagged lightning-bolt-shaped wings arcing white around a crackling halo, a field of live current spitting sparks below.
- **Tiburón** · _feat_ · `icons/creatures/fish/fish-shark-swimming.webp`  
  Shark — Tier Harribel. Release: "Destroy." A spirit that measures everything against the ocean and finds it wanting. Sacrifice, not slaughter.  
  **Icon brief** (Bleach — Harribel's Tiburón): A sealed zanpakutō: a broad short blade with a hollow centre and a shark-fin guard, droplets of water beading on its edge.
- **Tiburón — Resurrección** · _feat_ · `icons/creatures/fish/fish-shark-swimming.webp`  
  Water erupts around you and you step out of it. Your spirit weapon becomes a broad hollow-edged blade shaped like a shark's tooth: 1d12 slashing , two-handed, sweep . You gain a swim Speed equal to your Speed, you can breathe water, and you can create water freely from the gill-slits along the blade.  
  **Icon brief** (Bleach — Harribel's Resurrección): A broad, hollow-centred blade shaped like a shark's tooth rising from an erupting column of seawater.
- **Zangetsu** · _feat_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-black.svg`  
  Slaying Moon — Ichigo Kurosaki. Release: none. Zangetsu is never sealed — canon Ichigo carries a released blade at all times.  
  **Icon brief** (Bleach — Ichigo's Zangetsu): A huge cleaver blade planted in the ground beneath a crescent moon, a faint black-and-blue aura leaking from it.
- **Zangetsu — Shikai** · _feat_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-black.svg`  
  An oversized cleaver with no guard and no proper hilt. Your spirit weapon's damage die increases by one step and it gains two-handed d12 if it did not already have a two-handed trait. Your first Release each encounter is free and requires no action — you begin every encounter already released.  
  **Icon brief** (Bleach — Ichigo's Zangetsu (Shikai)): A giant guardless cleaver-shaped blade, black on the spine and silver on the edge, its hilt wrapped in white cloth that trails off in a long ribbon.
- **Zanka no Tachi** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-blackened-orange.svg`  
  Longsword of the Remnant Flame. Canon inverts every expectation: the Bankai does not release more fire, it pulls all of it into the blade . The sword blackens and looks burnt out. Everything around you dries and cracks. Your spirit weapon's damage die increases by two steps instead of one. You lose your fire resistance while it is active. At the start of each of your turns, each creature other…  
  **Icon brief** (Bleach — Yamamoto's Bankai, Zanka no Tachi): A charred, burnt-out black katana with no flame at all, heat haze warping the air around it and the ground cracked and dried in a ring.

### soulbound-effects (88)

- **Effect: Allotted Fortune** · _effect_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  The Quincy has handed you the other half. You gain a +1 status bonus to your next attack roll against the creature they marked.  
  **Icon brief** (Bleach — Haschwalth's 'B' (The Balance)): A small golden star of good fortune floating into an outstretched hand from one pan of a tipped scale.
- **Effect: Antithesis — Reversed** · _effect_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  The harm was sent back where it came from. You have resistance equal to the Quincy's level against the triggering damage.  
  **Icon brief** (Bleach — Uryū's 'A' (Antithesis)): A wound closing as its blood streams back out and away, flowing up to its source in a reversed blue arrow.
- **Effect: Antithesis — Schrift** · _effect_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  A broad blue bow of light, and a blade of vibrating reishi beside it.  
  **Icon brief** (Bleach — Uryū's Heilig Bogen & Seele Schneider): A broad blue bow of light crossed with a slender vibrating reishi blade (Seele Schneider), the blade's edge buzzing with visible vibration lines.
- **Effect: Apotheosis** · _effect_ · `modules/isaacs-hb-pf2e/icons/angel-winged-humanoid-golden.svg`  
  You gain temporary Hit Points equal to twice your level . At the start of your next turn the light detonates again, for half the Waning dice.  
  **Icon brief** (Homebrew (Soulbound class) — based on Gerard's Miracle): A bright golden shield of temporary light wrapped around a body, a ring of light already swelling outward for a second detonation.
- **Effect: Arrogante — Resurrección** · _effect_ · `modules/isaacs-hb-pf2e/icons/skull-crowned-white.svg`  
  A crowned skeleton with a vast double axe. Immune to disease and poison, and doomed never rises above 1.  
  **Icon brief** (Bleach — Barragan's Resurrección): A crowned skull with a vast black double axe, a ghostly ring of rot around it where disease and poison simply wither.
- **Effect: Bailar de Valquiria** · _effect_ · `modules/isaacs-hb-pf2e/icons/angel-winged-humanoid-golden.svg`  
  Golden wings and a body that reassembles itself. Fast healing equal to your Miracle points, and five of them will buy your life.  
  **Icon brief** (Homebrew (Soulbound class) — based on Gerard Valkyrie): Golden wings folding around shattered fragments that pull themselves back into a glowing whole, five bright points counting the lives it can buy.
- **Effect: Blut Arterie** · _effect_ · `modules/isaacs-hb-pf2e/icons/energy-stream-link-red.svg`  
  Reishi runs through your arteries. Your Strikes with your spirit weapon ignore resistances to physical and spirit damage , and treat the target's cover as one step less.  
  **Icon brief** (Bleach — Quincy Blut Arterie): Glowing red-blue arterial lines pulsing along a striking arm, the blade's edge punching cleanly through a cracked shield.
- **Effect: Blut Vene** · _effect_ · `icons/magic/defensive/shield-barrier-blue.webp`  
  Reishi runs through your veins. You have resistance to physical damage equal to half your level (minimum 1).  
  **Icon brief** (Bleach — Quincy Blut Vene): Pale-blue vein patterns lit up like armour under the skin, an incoming blade cracking against them.
- **Effect: Cero Metralleta — Sustained** · _effect_ · `icons/magic/lightning/bolts-salvo-clouds-sky.webp`  
  The barrage is still firing. Your next Cero Metralleta this turn costs no Reiatsu Point, and you may shape it freshly as the cone or the line. Guide §7B, Refined: "You may Sustain Cero Metralleta at the start of your next turn to fire it again in a different direction without spending a Reiatsu Point." The free shot is what the Sustain buys — without this marker the very first Cero Metralleta of…  
  **Icon brief** (Bleach — Starrk's Cero Metralleta): A spent pistol barrel still glowing blue, a stream of cero bullets flowing off it as the barrage continues.
- **Effect: Chain Anchor** · _effect_ · `icons/magic/control/debuff-chains-ropes-red.webp`  
  Anchored. You can't Step away from the creature that struck you until the end of your next turn.  
  **Icon brief** (Homebrew (Soulbound class)): A chain of spiritual light anchored to a creature's ankle and staked into the ground beside the one who struck it.
- **Effect: Colmillo** · _effect_ · `modules/isaacs-hb-pf2e/icons/wolf-howl-moon-grey-large.svg`  
  Eight spirit wolves stand in the squares around you. The badge counts them; you regain one at the start of each of your turns.  
  **Icon brief** (Bleach — Starrk's soul wolves): A circle of eight small blue reiatsu wolves sitting around a central point, one freshly forming from wisps.
- **Effect: Cover Pierced** · _effect_ · `modules/isaacs-hb-pf2e/icons/barrier-shield-dome-blue.svg`  
  The attacker treats this creature's cover as one step less : greater becomes standard, standard becomes lesser, and lesser becomes none.  
  **Icon brief** (Homebrew (Soulbound class)): A shield of stone cover cracking apart, an arrow of light already slipping through the gap.
- **Effect: Crawling Rope** · _effect_ · `modules/isaacs-hb-pf2e/icons/debuff-chains-ropes-yellow.svg`  
  A rope of yellow energy is wound around your legs. You take a −10-foot status penalty to your Speeds and you can't Step.  
  **Icon brief** (Bleach — Bakudō #4 Hainawa): A coil of glowing yellow spiritual rope wound tightly around a pair of legs, binding them together.
- **Effect: Daiguren Hyōrinmaru** · _effect_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-swirl-blue.svg`  
  Wings, claws and a tail of ice. You have a fly Speed equal to your Speed and cold resistance equal to your level . The badge counts your petal-flowers : one may be spent per round.  
  **Icon brief** (Bleach — Hitsugaya's Daiguren Hyōrinmaru): Ice wings, claws and a tail glittering blue-white, with three floating ice flowers counting down petal by petal.
- **Effect: Deus Ex Machina** · _effect_ · `icons/magic/fire/explosion-fireball-large-orange.webp`  
  Wings and a halo of blue reishi. Fire immunity, a fly Speed, and fire that does not go out easily.  
  **Icon brief** (Homebrew (Soulbound class) — based on Bazz-B): Wings and a halo of blue reishi rimmed in fire, flame that clings and refuses to go out.
- **Effect: Frosted Stride** · _effect_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  Ice has taken your feet. You have a −5-foot status penalty to your Speeds.  
  **Icon brief** (Bleach — Hitsugaya's Hyōrinmaru): A pair of feet frozen to the ground in a creeping crust of blue ice, frost spreading up the ankles.
- **Effect: Full Release** · _effect_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-blue.svg`  
  Your spirit weapon's damage die increases by one step, your Release Technique costs no Reiatsu Points but works only once per round, and you emit a 15-foot emanation of crushing spiritual pressure — an enemy that ends its turn in it must succeed at a Will save against your Reiatsu DC or become frightened 1 , or frightened 2 on a critical failure. A creature that succeeds is temporarily immune for…  
  **Icon brief** (Bleach — Bankai / Segunda Etapa / Vollständig): A creature at the centre of a crushing ring of spiritual pressure, the ground buckling into a crater around it and the air distorted.
- **Effect: Gintō Reserve** · _effect_ · `icons/consumables/potions/bottle-conical-corked-blue.webp`  
  Three silver tubes on your belt. The badge counts them; each is a free Gritz.  
  **Icon brief** (Bleach — Quincy Gintō): Three small silver Gintō tubes clipped to a belt, each glowing faintly blue with liquefied reiryoku.
- **Effect: Gokei** · _effect_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-red.svg`  
  Total Scene. The blades amass into a sphere around one creature and implode. Your second emanation is a 10-foot burst on one enemy; that enemy takes double damage from it and cannot benefit from cover or concealment against it.  
  **Icon brief** (Bleach — Byakuya's Gōkei): A dense sphere of countless pink petal-blades closing around a single point and imploding in a pink flash.
- **Effect: Greater Flash Step** · _effect_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  An afterimage stands where you were. The first attack made against you each round requires the attacker to succeed at a DC 5 flat check or the attack misses. When an attack resolves against you, a card offers the flat check. Pathfinder has already settled the attack roll by then, so a failed check is announced for the table to apply rather than silently rewriting the hit — but the check itself is…  
  **Icon brief** (Bleach — Shunpo afterimage): A fading afterimage silhouette with an attack passing harmlessly through it, the real figure a blur beside it.
- **Effect: Guard Opened** · _effect_ · `icons/skills/melee/blade-tips-triple-steel.webp`  
  This creature's AC is 2 lower against the Strike that opened its guard.  
  **Icon brief** (Homebrew (Soulbound class)): A guard broken open, a crossed pair of blocking swords knocked apart with a gap of light between them.
- **Effect: Guard the Threshold** · _effect_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  Something stands between you and the dead. Reduce the triggering damage by 2 + the Soulbound's level .  
  **Icon brief** (Homebrew (Soulbound class)): A torii gate with a black-robed figure standing in it, a ghostly hand reaching through from the darkness behind and stopping short.
- **Effect: Higashi** · _effect_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-glowing-red.svg`  
  Rising Sun Blade. Your Strikes ignore all resistances and immunities. A creature damaged by your spirit weapon can't regain Hit Points, and its regeneration and fast healing are suppressed, until the end of your next turn.  
  **Icon brief** (Bleach — Yamamoto's Higashi: Kyokujitsujin): A katana whose edge alone burns with a thin white-gold line of fire, like a rising sun cresting a blade.
- **Effect: Hirviendo** · _effect_ · `modules/isaacs-hb-pf2e/icons/water-elemental-blue.svg`  
  Water stands around you in a 20-foot emanation, difficult terrain for enemies. La Gota may be thrown as a 60-foot line.  
  **Icon brief** (Bleach — Harribel's Hirviendo): A ring of standing, rising seawater encircling a point, waves curling outward as a barrier.
- **Effect: Hollow's Mask** · _effect_ · `modules/isaacs-hb-pf2e/icons/skull-horned-white.svg`  
  A mask you did not grow. Temporary Hit Points equal to your level, resistance to physical damage equal to a quarter of your level (minimum 1), and a +5-foot bonus to all your Speeds.  
  **Icon brief** (Bleach — Visored mask): A white bone mask with red stripes worn over a shadowed face, a short-lived halo of dark Hollow reiatsu around it.
- **Effect: Hyōrinmaru — Shikai** · _effect_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  Your spirit weapon's damage type is cold . A critical hit slows what it touches.  
  **Icon brief** (Bleach — Hitsugaya's Hyōrinmaru (Shikai)): A crescent blade on a chain coated in frost, a frozen spray of ice crystals trailing off the arc of a cut.
- **Effect: Hypnotized** · _effect_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-purple.svg`  
  You perceive this Soulbound 5 feet from where they actually stand . Attacks you make against them require a DC 5 flat check (DC 6 if they have Refined Release), and they are hidden from you whenever they are not adjacent to you.  
  **Icon brief** (Bleach — Aizen's Complete Hypnosis): A figure seen through a warped, rippling mirror, the image displaced to one side of where its shadow actually falls.
- **Effect: Kanzen Saimin** · _effect_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-purple.svg`  
  Everything anyone sees of you is a lie you are telling. A creature that has seen your release and failed its Will save perceives you 5 feet from where you stand. Landing a blow on where you actually are breaks the hypnosis. Under Kanzen Saimin: Sōten Kisshun only a critical hit does.  
  **Icon brief** (Bleach — Aizen's Complete Hypnosis): A reflected silhouette standing in a pool of still water beside empty ground — the image is real, the figure is not.
- **Effect: Kanzen Saimin: Sōten Kisshun** · _effect_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-large-purple.svg`  
  The hypnosis stops being a lie about your position and becomes a lie about everything. Every enemy within 60 feet who can see you must attempt the Shikai save, including those already immune . Only a critical hit breaks it. Sustain once per round to force one hypnotized creature to attempt a Will save or be confused until the end of its turn.  
  **Icon brief** (Homebrew (Soulbound class) — invented Bankai for Kyōka Suigetsu): An entire field of view breaking apart into mirror shards, every shard showing a different false world, a single crack running through the centre.
- **Effect: Kendō — Opened Guard** · _effect_ · `icons/skills/melee/blade-tips-triple-steel.webp`  
  Your next Strike with your spirit weapon treats the target's AC as 2 lower .  
  **Icon brief** (Bleach — Zanjutsu (Kendō)): A swordsman's blade sliding past a raised guard, the guard knocked aside and the target's open centre lit.
- **Effect: Kendō — Piercing** · _effect_ · `icons/skills/melee/blade-tips-triple-steel.webp`  
  Your next Zanjutsu: Kendō Strike treats the target's AC as 2 lower .  
  **Icon brief** (Bleach — Zanjutsu (Kendō)): A katana point lancing forward through a gap in a breastplate, a narrow line of light showing the opening.
- **Effect: Kendō — Severing** · _effect_ · `icons/skills/melee/blade-tips-triple-steel.webp`  
  Your next Zanjutsu: Kendō Strike ignores all resistances and immunities to its damage type.  
  **Icon brief** (Bleach — Zanjutsu (Kendō)): A katana edge slicing through a glowing protective rune, the rune splitting in half.
- **Effect: Kendō — Unresisted** · _effect_ · `icons/skills/melee/blade-tips-triple-steel.webp`  
  Your next Strike with your spirit weapon ignores all resistances and immunities to its damage type.  
  **Icon brief** (Bleach — Zanjutsu (Kendō)): A blade cutting cleanly through a shimmering barrier and its rune circle, nothing slowing it.
- **Effect: Kidō Combination — Opening** · _effect_ · `icons/magic/symbols/runes-carved-stone-purple.webp`  
  A Way of Destruction has just been spoken. Until the end of your turn a binding kidō costs you 1 Reiatsu Point fewer — once per encounter.  
  **Icon brief** (Bleach — Kidō): A red fiery kidō glyph fading out and, from its embers, a yellow binding-rope glyph spinning up — one art leading straight into the next.
- **Effect: Kidō Focus** · _effect_ · `icons/magic/symbols/runes-carved-stone-purple.webp`  
  A second beat of concentration went into the art that caught you: −1 circumstance penalty to this save.  
  **Icon brief** (Bleach — Kidō): A kidō glyph circle with an extra outer ring of concentration, the light tightening and pressing down on its target.
- **Effect: Kita** · _effect_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-blackened-orange.svg`  
  Heaven and Earth End in Ashes. You may use Kita: Tenchi Kaijin once per round.  
  **Icon brief** (Bleach — Yamamoto's Kita: Tenchi Kaijin): A single vast slash carving a burning line through heaven and earth, the sky and ground on either side split and crumbling into ash.
- **Effect: Letzt Stil — Spent** · _effect_ · `modules/isaacs-hb-pf2e/icons/explosion-star-glow-blue-dim.svg`  
  You removed the limiter, and the bow has taken its price. You have lost your Schrift Form , your Release Technique , Licht Regen , Vollständig , and your entire reiatsu pool . They return when you complete 24 hours of rest . You keep your weapon, your proficiencies, and your feats.  
  **Icon brief** (Bleach — Quincy Letzt Stil (aftermath)): A shattered Quincy bow lying on the ground, its pieces dark and drained, the last flickers of blue fading out of it.
- **Effect: Los Lobos — Resurrección** · _effect_ · `modules/isaacs-hb-pf2e/icons/wolf-howl-moon-grey.svg`  
  Two ornate pistols that never run dry, and five more feet of Speed.  
  **Icon brief** (Bleach — Starrk's Resurrección): Two ornate pistols glinting, ammunition endlessly reforming in blue light within their chambers.
- **Effect: Minami** · _effect_ · `modules/isaacs-hb-pf2e/icons/dust-smoke-cloud-brown.svg`  
  Great Funeral Pyre of 1,500,000. The ash of everything your flames have killed rises in a 20-foot emanation. Enemies that end their turn in it must succeed at a Reflex save or be grabbed by ash-figures (Escape against your Reiatsu DC). The figures take no actions and are not creatures — this class has no minions.  
  **Icon brief** (Bleach — Yamamoto's Minami: Kaika Daisōjin): Charred skeletons and ash-figures clawing up out of a field of grey ash, hands reaching to grab.
- **Effect: Miracle Points** · _effect_ · `icons/magic/holy/angel-winged-humanoid-blue.webp`  
  Every wound has been counted and kept. The badge is your Miracle points : you have resistance to all damage equal to the number you hold , and you may spend any number at the start of your turn for +1d6 damage each until the end of it.  
  **Icon brief** (Bleach — Gerard's Miracle): A tally of glowing golden scars on a growing body, each counted wound shining like a gem of stored power.
- **Effect: Murciélago — Resurrección** · _effect_ · `modules/isaacs-hb-pf2e/icons/wing-bat-membrane-green.svg`  
  Wings, and a javelin of hardened green energy.  
  **Icon brief** (Bleach — Ulquiorra's Resurrección): Black bat wings framing a bright green javelin of hardened energy, held point-down.
- **Effect: Murciélago — Segunda Etapa** · _effect_ · `modules/isaacs-hb-pf2e/icons/wing-bat-membrane-green-large.svg`  
  Black fur, a whip-like tail, horns, and no mask at all. +20 feet of fly Speed, resistance to all damage except spirit equal to half your level , and Regeneración at double rate.  
  **Icon brief** (Bleach — Ulquiorra's Segunda Etapa): A demonic black silhouette with a whip-like tail and horns, green light pouring off it as it regenerates.
- **Effect: Nishi** · _effect_ · `modules/isaacs-hb-pf2e/icons/barrier-wall-flame-ring-orange.svg`  
  Setting Sun Ultimate Form. You are wreathed in heat: fire immunity and resistance to all damage equal to half your level . A creature that damages you with an unarmed attack, a melee weapon, or a Grapple takes 4d6 fire .  
  **Icon brief** (Bleach — Yamamoto's Nishi: Zanjitsu Gokui): A body wrapped in a shimmering mantle of white-hot flame, a striking fist recoiling burnt as it touches.
- **Effect: Pantera — Resurrección** · _effect_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue.svg`  
  White armour, claws, and a whip of a tail. Two claw attacks, and +10 feet of Speed.  
  **Icon brief** (Bleach — Grimmjow's Resurrección): White armour plates, curved claws and a whip-like tail, blue light streaking behind them with speed.
- **Effect: Pantera — Segunda Etapa** · _effect_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue-large.svg`  
  Another +10 feet of Speed, claws that are deadly d10 , and a 60-foot Garra de la Pantera whose critical failures bleed.  
  **Icon brief** (Homebrew (Soulbound class) — invented second form for Grimmjow): Long, lethal blue energy claws raking forward in a 60-foot sweep, blood spray at their ends.
- **Effect: Pressure Crush** · _effect_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue-large.svg`  
  The air itself is leaning on you. You take a −5-foot status penalty to your Speeds.  
  **Icon brief** (Bleach — spiritual pressure): A creature hunched as though the air were made of lead, a heavy blue haze pushing down and slowing its stride.
- **Effect: Quincy: Letzt Stil** · _effect_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-blue.svg`  
  The limiter is off. Two die steps, resistance-piercing Strikes that stack with Blut Vene, and Licht Regen as a 60-foot cone once per round for free. When this ends you lose your Schrift Form, your Release Technique, Licht Regen, Vollständig and your entire reiatsu pool until 24 hours of rest.  
  **Icon brief** (Bleach — Quincy Letzt Stil): A limiter-free bow crackling with overwhelming blue power, a volley of arrows fanning out in a cone.
- **Effect: Quincy's Discipline** · _effect_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  You are wearing a Quincy's discipline. You gain Blut as a free action once per round, except that Blut Vene grants resistance equal to a quarter of your level rather than half. Your ranged Strikes ignore the target's cover.  
  **Icon brief** (Homebrew (Soulbound class)): A borrowed blue Quincy cross glowing beside a katana guard, faint blue vein-light running from it, an arrow sailing past a broken wall of cover.
- **Effect: Regeneración Suppressed** · _effect_ · `icons/magic/unholy/strike-body-life-soul-purple.webp`  
  Spirit — or, before Segunda Piel , a holy or vitality effect — has closed the wound the wrong way. Your Regeneración does nothing until the end of your next turn.  
  **Icon brief** (Bleach — Arrancar Regeneración): A torn wound with flickers of regrowing tissue held back by a thin ring of holy light, the healing stalled.
- **Effect: Reiatsu Barrier** · _effect_ · `modules/isaacs-hb-pf2e/icons/barrier-shield-dome-blue.svg`  
  Pressure hardened into a wall. You have resistance equal to your level against the triggering damage.  
  **Icon brief** (Bleach — reiatsu barrier): A wall of hardened blue reiatsu taking a blow full on, the impact rippling through it like struck glass.
- **Effect: Released** · _effect_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Your spirit weapon is in its released form for the rest of the encounter. Release is not a stance: this does not conflict with stance actions, and nothing but the end of the encounter, or re-sealing on purpose, takes it away.  
  **Icon brief** (Bleach — Shikai release): A released spirit weapon held aloft, its released form glowing steady — a sword in its true shape, aura settled around it.
- **Effect: Remnant Ice Doll** · _effect_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-swirl-blue.svg`  
  A doll of ice stands where the blow landed. The damage is reduced by twice your level , and the doll shatters.  
  **Icon brief** (Bleach — Hitsugaya's Zanhyō Ningyō): A life-sized doll of ice shattering into shards where a blow landed, the real target untouched behind it.
- **Effect: Respira — Cannot Heal** · _effect_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  The miasma has stopped this creature knitting itself back together. It cannot regain Hit Points until the end of its next turn.  
  **Icon brief** (Bleach — Barragan's Respira): A wound edged in grey decay that refuses to close, ash flaking off its edges.
- **Effect: Respira — In the Miasma** · _effect_ · `icons/magic/death/skull-poison-green.webp`  
  You are standing inside an Arrogante's Respira Absoluta . Content-free by design: this is how "a creature within the emanation " becomes something a predicate can test. pf2e's own Aura rule grants it on entering and takes it back on leaving, so the decay that consumes what is aimed at the Arrogante reaches the creatures actually standing in the miasma and nobody else.  
  **Icon brief** (Bleach — Barragan's Respira): A figure-less square filled with drifting purple-black miasma; inside it a small hourglass whose sand has turned to ash and a withered leaf crumbling at the edges. Muted violet and bone-grey.
- **Effect: Respira Absoluta** · _effect_ · `modules/isaacs-hb-pf2e/icons/skull-crowned-white-purple.svg`  
  A permanent 20-foot emanation of aging miasma. Enemies that end their turn in it take 3d6 void with a basic Fortitude save, and what is aimed at you may simply age to nothing.  
  **Icon brief** (Homebrew (Soulbound class) — extrapolated from Barragan's Respira): A permanent dark purple fog of aging miasma, an incoming arrow crumbling to rust and dust mid-flight within it.
- **Effect: Ryūjin Jakka — Shikai** · _effect_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-glowing-orange.svg`  
  A blade sheathed in flame. Its damage type is fire , it is deadly d8 , and you have fire resistance equal to half your level .  
  **Icon brief** (Bleach — Yamamoto's Ryūjin Jakka (Shikai)): A katana blade fully sheathed in roaring orange-red flame, the fire licking upward from the edge like a torch; a faint heat shimmer around it and a small ember-shield glyph at the hilt.
- **Effect: Segunda Piel (Early)** · _effect_ · `modules/isaacs-hb-pf2e/icons/shield-barrier-flaming-diamond-white.svg`  
  Your Hierro closes over the wound. Its resistance applies to spirit damage as well as physical until the end of your next turn.  
  **Icon brief** (Bleach — Arrancar Hierro): A wound on grey skin closing over with a seam of dull steel plating, rivet-like, a faint white spirit-glow catching on the metal. Close crop, cold grey and white.
- **Effect: Senbonzakura — Shikai** · _effect_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-pink.svg`  
  A slow cloud of petal-fine blades. Your Strikes have reach 15 feet and ignore cover between you and the target.  
  **Icon brief** (Bleach — Byakuya's Senbonzakura (Shikai)): A slow, loose cloud of pink petal-blades streaming outward from a bare hilt toward the far corner, reaching around a stone wall. Soft pink glints on dusk-blue.
- **Effect: Senbonzakura Kageyoshi** · _effect_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-pink-red.svg`  
  Two emanations of petal-blades. At the start of each of your turns every enemy in either takes 5d6 slashing damage with a basic Reflex save. Sustain once per round to move the second emanation, or to enter Gokei or Senkei .  
  **Icon brief** (Bleach — Byakuya's Senbonzakura Kageyoshi): Two swirling rings of pink cherry-blossom blades circling a central point, each petal a glinting razor; one ring drifting off to the side, trailing petals. Dark background, hot pink light.
- **Effect: Senkei** · _effect_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-white.svg`  
  Slaughterscape. A thousand swords form a 20-foot cage around you and one enemy. Neither of you can leave. Your Strikes against that enemy ignore all resistances , and you may make one extra Strike each round at your current multiple attack penalty. You lose Senbonzakura's reach and cover-ignoring, and you cannot target enemies outside the cage.  
  **Icon brief** (Bleach — Byakuya's Senkei): Top-down view: a ring of a thousand tall gleaming swords standing point-down in the ground, forming a closed circular arena; pink light falling between the blades onto the floor.
- **Effect: Severance** · _effect_ · `icons/magic/death/skull-energy-light-white.webp`  
  You have stopped carrying your power and become it. For 10 rounds : Your spirit weapon's Strikes deal an additional 4d6 spirit damage. You are immune to fear and death effects , and to the frightened and doomed conditions. Reiatsu stops mattering. Your Release Technique and every kidō you know cost nothing and have no frequency limit . You gain your Spirit's Full Release ability and its 20-foot…  
  **Icon brief** (Bleach — Final Getsuga / Final Release): A body-sized silhouette dissolving into pure black reiatsu that rises like smoke, rimmed by a thin crimson edge; ten small tally marks ticking down around it. Black, red, white.
- **Effect: Severed** · _effect_ · `modules/isaacs-hb-pf2e/icons/skull-energy-light-white-dim.svg`  
  You severed the bond that named you, and it is gone. You have lost your Released Form , your Release Technique , your Full Release , and your entire reiatsu pool . They return when you complete a week of downtime rebuilding what you severed. You keep your Hit Points, your proficiencies, your skills, your Lineage features, and every other feat.  
  **Icon brief** (Homebrew (Soulbound class) — Severed): A snapped silver chain whose broken end fades into empty air, beside a sword hilt with no blade; the glow drained from both. Desaturated grey, a faint cut line through the centre.
- **Effect: Shikake** · _effect_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-purple.svg`  
  You have been shown the wrong person. You treat one creature within your reach as though it were the Soulbound, and you treat the Soulbound as an ally .  
  **Icon brief** (Bleach — Aizen's Kyōka Suigetsu): A creature's view through a cracked hand-mirror: the reflection shows the wrong figure, while a pale moon floats on water below. Teal and silver, with a hairline fracture.
- **Effect: Shitonegaeshi** · _effect_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  The ground has been taken from under you. You can't Step .  
  **Icon brief** (Bleach — Zanjutsu: Shitonegaeshi): A floor tile flipping up like an overturned cushion under a stumbling foot, a sword-slash arc above it. Wooden dojo floor, motion lines, an ink-brush feel.
- **Effect: Sight of the Balance** · _effect_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  Your fortune and misfortune are the Quincy's to allot. You take a −2 status penalty to your next saving throw .  
  **Icon brief** (Bleach — Haschwalth's The Balance): A pair of golden scales hovering over a crouched shadow; the pan on the shadow's side sinks under a dark weight. Gold on deep blue, a white Quincy star at the pivot.
- **Effect: Silenced Chain** · _effect_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  The seal sits on your voice. You can't cast spells or use kidō.  
  **Icon brief** (Bleach — Bakudō #99 Kin (first song)): A mouth wrapped shut with black cloth strips pinned by iron bolts; small kanji seals glowing faintly on the bindings. Black, iron grey and pale gold.
- **Effect: Six Rods** · _effect_ · `icons/magic/control/debuff-chains-ropes-purple.webp`  
  Six rods of light hold you at the midsection. You can't use manipulate actions. The immobilized condition is applied alongside this effect.  
  **Icon brief** (Bleach — Bakudō #61 Rikujōkōrō): Six thin bars of yellow-white light converging from six directions into a glowing ring around a waist-height point, pinning it in place. Bright gold against dark.
- **Effect: Soul Reaper's Discipline** · _effect_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You are wearing a reaper's discipline. Every kidō you know costs no Reiatsu Point while the Face is on.  
  **Icon brief** (Homebrew (Soulbound class) — borrowed Soul Reaper aspect): A black-lacquered mask of a stern shinigami face held up in front of a white Hollow skull, kanji glyphs circling it like a kidō incantation. Black, white, blue glyph-light.
- **Effect: Splitting Void** · _effect_ · `modules/isaacs-hb-pf2e/icons/barrier-shield-dome-blue.svg`  
  A wall of pure nothing stands between you and what was coming. You have resistance equal to your level against the triggering damage.  
  **Icon brief** (Bleach — Bakudō #81 Danku): A tall, perfectly flat translucent pane of pale light standing upright; a fireball splashing against it and scattering into sparks. Clean geometric edges, cool white-blue.
- **Effect: Steeled Against Pressure** · _effect_ · `icons/magic/defensive/shield-barrier-blue.webp`  
  You have already stood in this Soulbound's spiritual pressure and kept your feet. You are temporarily immune to that emanation for 10 minutes.  
  **Icon brief** (Homebrew (Soulbound class) — Spiritual pressure): A small figure standing braced, feet planted, against a heavy downward wave of coloured reiatsu pressing on it like weather; a calm blue ward around the figure's chest.
- **Effect: Steeled Against Respira** · _effect_ · `icons/magic/defensive/shield-barrier-glowing-triangle-green.webp`  
  Something you aimed at an Arrogante reached them through the miasma. You are temporarily immune to Respira Absoluta 's flat check for 1 minute. Guide §7B: "A creature that succeeds is temporarily immune to this flat check for 1 minute." Without it the decay could hold one attacker off for a whole encounter, which is the clause the temporary immunity exists to prevent.  
  **Icon brief** (Bleach — Barragan's Respira): A gloved hand that has pushed through a wall of purple-black miasma unharmed, the miasma parting around it; a small white sigil of resistance glowing on the palm.
- **Effect: Tensa Zangetsu** · _effect_ · `modules/isaacs-hb-pf2e/icons/sword-katana-black.svg`  
  A smaller, blacker blade. +10 feet to all Speeds, Flash Step twice per round, and Getsuga Tenshō at one action.  
  **Icon brief** (Bleach — Ichigo's Bankai, Tensa Zangetsu): A slim all-black daitō with a manji (卍)-shaped guard and a short broken chain dangling from the pommel, crackling with black-and-red reiatsu and afterimage speed streaks.
- **Effect: The Balance — Fortune Held** · _effect_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  How much misfortune you have taken off other people this encounter. A tally, and nothing else — The Reckoning reads it to know whether the debt is doomed 1 or doomed 2 .  
  **Icon brief** (Homebrew (Soulbound class) — The Balance tally): A golden ledger page with tally marks being drawn in light, a small balance scale emblem stamped in the corner; one pan heaped with dark coins of misfortune.
- **Effect: The Balance — Held** · _effect_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  Misfortune has been handed to you. You take a −1 status penalty to saving throws (and to AC if the Quincy has Refined Release).  
  **Icon brief** (Bleach — Haschwalth's The Balance): A single tilted golden scale with a black stone of misfortune sinking one pan, dark vapour rising from it onto a silhouette below.
- **Effect: The Balance — Held (Refined)** · _effect_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  Misfortune has been handed to you. You take a −1 status penalty to AC and saving throws .  
  **Icon brief** (Bleach — Haschwalth's The Balance): A dark shadow weight dropped onto a shield and a pair of feet, cracking the ground slightly; a tilted golden scale above. Grey-blue with a sour green tint.
- **Effect: The Balance — Redistributed** · _effect_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  The harm was moved onto somebody else. You have resistance equal to twice the Quincy's level against the triggering damage — three times at the Vollständig.  
  **Icon brief** (Bleach — Haschwalth's The Balance): A wound of red light leaving one silhouette and flowing along a golden thread into another figure across the frame, a balance scale at the midpoint of the thread.
- **Effect: The Balance — Schrift** · _effect_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  Freund Schild in your hands, and fortune on your side while the pool holds.  
  **Icon brief** (Bleach — Haschwalth's Schrift 'B'): A tall white heater shield with a blue Quincy star (Freund Schild) and a golden balance scale floating above it. White, gold and Quincy blue.
- **Effect: The Balance, at Night** · _effect_ · `modules/isaacs-hb-pf2e/icons/heater-crystal-white.svg`  
  Wings of white light and a sword in each hand. Your reduction is three times your level, an ally's harm can be taken onto yourself once a round, and you allot one enemy's fortune each turn.  
  **Icon brief** (Bleach — Haschwalth's The Balance (Vollständig)): Broad wings of white light spreading behind two crossed swords, a golden balance scale floating between the blades under a dark night sky with a pale moon.
- **Effect: The Heat — Schrift** · _effect_ · `modules/isaacs-hb-pf2e/icons/projectile-fireball-smoke-strong-red.svg`  
  Reishi that runs hot: a fire-typed spirit weapon with deadly d8 , and fire resistance equal to half your level.  
  **Icon brief** (Bleach — Bazz-B's Schrift 'H'): A glowing blue reishi blade whose edge has turned into white-hot fire, flames rolling off it; a stylised letter H branded in flame on the crossguard.
- **Effect: The Miracle — Grown** · _effect_ · `icons/magic/light/explosion-star-glow-yellow.webp`  
  The body reassembled itself larger. Your spirit weapon's damage die is one step larger per tally here , for the rest of the encounter.  
  **Icon brief** (Bleach — Gerard Valkyrie's The Miracle): A broken shard of a golden statue reassembling itself larger than before, pieces flying inward with light streaming from the cracks; small stacked tally pips beneath.
- **Effect: The Miracle — Schrift** · _effect_ · `icons/magic/holy/angel-winged-humanoid-blue.webp`  
  A sword and shield too large for you, and a body that treats being broken as an instruction.  
  **Icon brief** (Bleach — Gerard Valkyrie's Schrift 'M'): An enormous white sword and a vast round shield crossed, both oversized and glowing gold at the rims, a stylised M radiating from the shield's boss.
- **Effect: The Miracle — Spent** · _effect_ · `icons/magic/light/explosion-star-glow-yellow.webp`  
  Points spent into the swing. Your spirit weapon's Strikes deal +1d6 per point until the end of your turn — and with Blitz of the Hero , +5 feet to your Speeds per point, to a maximum of +20.  
  **Icon brief** (Bleach — Gerard Valkyrie's The Miracle): A sword swing trailing golden stars that are being burned up like fuel, each star leaving a spark; motion streaks behind the arc. Gold and white on deep blue.
- **Effect: The Thunderbolt — Schrift** · _effect_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-white.svg`  
  A sword of arcing electricity, resistance to the same, and a Flash Step that is really a teleport.  
  **Icon brief** (Bleach — Candice Catnipp's Schrift 'T'): A sword made of forking green-yellow electricity that never holds one shape, sparks spitting off it; a lightning-bolt letter T at the hilt.
- **Effect: Thunderbolt Form** · _effect_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-forked-white.svg`  
  Lightning for hair and white arcs for wings. A 10-foot emanation of live current, and arcs that jump from whatever you hit.  
  **Icon brief** (Bleach — Candice Catnipp's Vollständig): Six white-yellow lightning-bolt-shaped wings fanning out from a central halo of crackling electricity, arcs jumping outward to the frame's edges.
- **Effect: Tiburón — Resurrección** · _effect_ · `icons/creatures/fish/fish-shark-swimming.webp`  
  A shark's tooth in your hands, a swim Speed, and water whenever you want it. You can breathe water , and you can create water freely from the gill-slits along the blade. pf2e automates no drowning and has no "breathes water" field, so the nearest thing it does have is said instead: the amphibious creature trait, which its own glossary defines as breathing in water and in air. It shows on the…  
  **Icon brief** (Bleach — Harribel's Tiburón (Resurrección)): A huge broad blade shaped like a shark's tooth with a hollow centre and gill-slits along its spine, water pouring from the slits and swirling around it. Aqua and bone-white.
- **Effect: Wound That Will Not Close** · _effect_ · `modules/isaacs-hb-pf2e/icons/skull-energy-light-white-dim.svg`  
  The cut went through something that does not grow back. For 1 minute this creature cannot regain Hit Points , and any regeneration or fast healing it has is suppressed.  
  **Icon brief** (Homebrew (Soulbound class) — unhealing wound): A clean diagonal cut on grey skin glowing faintly white at the edges, a green healing spark breaking apart against it before it can touch. Red, white and dead green.
- **Effect: Zangetsu — Shikai** · _effect_ · `modules/isaacs-hb-pf2e/icons/greatsword-crossguard-black.svg`  
  A blade that is never sealed. Your spirit weapon's damage die is one step larger, and it gains two-hand d12 unless it was already two-handed.  
  **Icon brief** (Bleach — Ichigo's Zangetsu (Shikai)): A massive cleaver-shaped blade with no guard, its hilt wrapped in white cloth that trails off in a long ribbon; blue-white reiatsu flaring along the edge.
- **Effect: Zanka no Tachi** · _effect_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-blackened-orange.svg`  
  Every flame pulled into one blackened blade. Your damage die is two steps larger, your fire resistance is gone, and everything within 30 feet of you — allies included — burns for 1d6 at the start of each of your turns. Sustain once per round to select a cardinal aspect.  
  **Icon brief** (Bleach — Yamamoto's Bankai, Zanka no Tachi): A charred, ash-black katana that looks burnt out, the air around it warping with heat; the ground beneath dried and cracked in a radiating spiderweb. Black, ember-orange cracks.

### soulbound-equipment (13)

- **Freund Schild** · _weapon_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  Substitute Shield — Haschwalth fights with a blade, not a bow.  
  **Icon brief** (Bleach — Haschwalth's Freund Schild): A tall white heater shield with a pointed base, a blue five-pointed Quincy star at its centre and thin silver trim, faint reishi glow at the edges.
- **Gran Caída** · _weapon_ · `icons/weapons/axes/axe-double-black.webp`  
  Great Fall — a vast double axe carried by a crowned skeleton.  
  **Icon brief** (Bleach — Barragan's Gran Caída): A huge black double-bladed battle axe with ornate gold fittings, a small skull crown motif at the head, wisps of purple decay coming off the blades.
- **Los Lobos — Pistols** · _weapon_ · `icons/weapons/guns/gun-pistol-flintlock.webp`  
  Two ornate pistols that need no ammunition and speak when they feel like it.  
  **Icon brief** (Bleach — Starrk's Los Lobos pistols): Two ornate long-barrelled pistols crossed, wolf-head motifs on the grips, blue cero light glowing in both muzzles. Silver, black and blue.
- **Luz de la Luna** · _weapon_ · `modules/isaacs-hb-pf2e/icons/javelin-glowing-green.svg`  
  Light of the Moon — a javelin of hardened green energy that re-forms in your hand the instant it leaves it.  
  **Icon brief** (Bleach — Ulquiorra's Luz de la Luna): A long javelin of hardened, glowing green energy with a crescent-shaped tip, faint green after-images showing it re-forming in a reaching hand.
- **Pantera — Claws** · _weapon_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue.svg`  
  Ten blades of condensed reishi where your hands were.  
  **Icon brief** (Bleach — Grimmjow's Pantera (claws)): A hand where the fingers have become ten long blades of condensed blue reishi, curved like a panther's claws, glowing cyan at the tips.
- **Seele Schneider** · _weapon_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Soul Cutter — a vibrating reishi edge that cuts what resists cutting. An additional way to use your bow, not a replacement for it: the Heilig Bogen stays in your hands.  
  **Icon brief** (Bleach — Quincy Seele Schneider): A long thin hilt with a humming blue blade of vibrating reishi, the edge rendered as a blurred, buzzing line; tiny spirit particles being drawn into it.
- **Spirit Weapon (Blade)** · _weapon_ · `icons/weapons/swords/sword-guard-blue.webp`  
  A Soul Reaper's zanpakutō is their own soul with an edge on it. A Hollow's is the fragment of mask that sealed their power inside their body. Bonded. You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away. It cannot be permanently destroyed while you live; if broken,…  
  **Icon brief** (Bleach — Zanpakutō (generic)): A sealed katana in a plain black sheath with a square guard, the blade's spirit leaking out as a faint blue silhouette around it — a soul given an edge.
- **Spirit Weapon (Great Blade)** · _weapon_ · `icons/weapons/swords/greatsword-blue.webp`  
  Too much blade for the arm holding it, which has never once been the point. Bonded. You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away. It cannot be permanently destroyed while you live; if broken, it re-forms after 10 minutes of rest. Soul-Etched. During your…  
  **Icon brief** (Homebrew (Soulbound class) — Spirit Weapon (Great Blade)): An oversized broad blade far too big for its short hilt, leaning diagonally across the square, blue reiatsu gathering along its edge.
- **Spirit Weapon (Paired Blades)** · _weapon_ · `modules/isaacs-hb-pf2e/icons/swords-short-blue.svg`  
  One soul, argued into two edges. They agree with each other rarely and with you less often. Bonded. You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away. It cannot be permanently destroyed while you live; if broken, it re-forms after 10 minutes of rest. Soul-Etched.…  
  **Icon brief** (Homebrew (Soulbound class) — Spirit Weapon (Paired Blades)): Two short swords crossed in an X, one glowing warm, one cold, their reiatsu sparking where the blades touch as if arguing.
- **Spirit Weapon (Spirit Bow)** · _weapon_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  A Quincy owns no soul-weapon. They reach into the air, take the spirit particles that are already there, and make a bow out of them. Bonded. You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away. It cannot be permanently destroyed while you live; if broken, it…  
  **Icon brief** (Bleach — Quincy Heilig Bogen): A tall glowing blue bow of spirit particles, a five-pointed Quincy cross at its grip, an arrow of light drawn and ready; particles condensing from the air.
- **The Miracle — Sword and Shield** · _weapon_ · `icons/weapons/swords/greatsword-crossguard-silver.webp`  
  An enormous sword and shield of white reishi, both far too large for anything that should be carrying them.  
  **Icon brief** (Bleach — Gerard Valkyrie's sword and shield): A colossal white reishi sword and round shield stacked behind each other, so large they overflow the frame; golden light along every edge.
- **The Thunderbolt — Arcing Sword** · _weapon_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-white.svg`  
  A sword of arcing electricity that never quite holds still.  
  **Icon brief** (Bleach — Candice Catnipp's sword): A blade of arcing green-yellow lightning, its shape constantly shifting, thin electric arcs leaping off the edge to the frame.
- **Tiburón — Hollow-Edged Blade** · _weapon_ · `modules/isaacs-hb-pf2e/icons/sword-broad-blue.svg`  
  A broad hollow-edged blade shaped like a shark's tooth, with gill-slits down its spine.  
  **Icon brief** (Bleach — Harribel's Tiburón blade): A broad sword shaped like a shark's tooth with a hollow centre and three gill-slits down the spine, bone-white with aqua water glinting through the hollow.

### soulbound-feats (47)

#### 10th

- **Ghost Step** · _feat_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  Flash Step lets you move through creatures' spaces (you can't end there) and ignores difficult terrain.  
  **Icon brief** (Bleach — Shunpo): A ghostly afterimage silhouette passing straight through another figure, trail of fading copies behind it and no footprints on the rough ground.
- **Perfected Technique** · _feat_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Frequency once per encounter Use your Release Technique without spending a Reiatsu Point.  
  **Icon brief** (Homebrew (Soulbound class) — Perfected Technique): A flawless single sword stroke drawn as one unbroken ink-brush arc, a small empty reiatsu orb next to it showing nothing was spent.
- **Reishi Mastery** · _feat_ · `icons/magic/control/energy-stream-link-blue.webp`  
  Seal the Art 's counteract rank increases by 1, and it costs no Reiatsu Point on a critical success.  
  **Icon brief** (Bleach — Quincy Sklaverei): A Quincy star at the centre drawing in streams of spirit particles from a broken kidō circle, the circle's light unravelling into the star.
#### 12th

- **Kidō Mastery** · _feat_ · `icons/magic/symbols/runes-carved-stone-red.webp`  
  Your destruction kidō deal an additional die of damage of their damage type.  
  **Icon brief** (Homebrew (Soulbound class) — Kidō Mastery): A large ornate kidō circle with an extra outer ring of kanji, its central sphere of destruction energy doubled in brightness.
- **Segunda Piel Temprana** · _feat_ · `icons/equipment/chest/breastplate-scale-grey.webp`  
  Hierro's resistance applies to spirit damage for 1 round each time you are critically hit.  
  **Icon brief** (Bleach — Arrancar Hierro): A cracked piece of skin re-sealing itself with steel-grey plating as a blade critically lands, sparks flying where the edge meets metal.
- **Soul Sever** · _feat_ · `icons/magic/holy/prayer-hands-glowing-yellow.webp`  
  When you reduce a creature to 0 Hit Points with your spirit weapon, you immediately perform a Konsō on it as a free action with no check, permanently preventing it from rising as undead.  
  **Icon brief** (Bleach — Konsō): A sword pommel touching a fallen spirit's forehead, a glowing black kanji seal stamped where it touched and the spirit dissolving into butterflies.
#### 14th

- **Instant Full Release** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-blue.svg`  
  Full Release takes 1 action instead of 2.  
  **Icon brief** (Homebrew (Soulbound class) — Instant Full Release): A sword being drawn in a single stroke with a burst of reiatsu already exploding at the scabbard's mouth, a stopwatch hand frozen at one tick.
- **Twin Pressure** · _feat_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue-large.svg`  
  While in a Full Release , the emanation's Will save also applies to enemies that enter it, not only those that end their turn in it.  
  **Icon brief** (Homebrew (Soulbound class) — Twin Pressure): Two overlapping rings of reiatsu emanation, one around the wielder, one catching an enemy as it steps in, pressing down.
- **Vollständig Endurance** · _feat_ · `modules/isaacs-hb-pf2e/icons/explosion-star-large-blue.svg`  
  When your Vollständig ends you are not fatigued, and you may spend 1 Reiatsu Point to extend it by 1 round, up to three times.  
  **Icon brief** (Bleach — Quincy Vollständig): A white Quincy halo and wings of light extending one more beat than they should, three small extra feathers of light glowing at the tips.
#### 16th

- **Reiatsu Flood** · _feat_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue-large.svg`  
  Your Rising Pressure per-encounter cap increases by 1. Guide §11.1 calls this the single most dangerous feat in the class. `rising-pressure.mjs` reads it off the sheet, so the ceiling has exactly one home.  
  **Icon brief** (Homebrew (Soulbound class) — Reiatsu Flood): A cup overflowing with glowing blue reiatsu that spills over the rim and floods the base of the frame like a tide.
- **Unbroken Chain** · _feat_ · `icons/magic/control/debuff-chains-ropes-red.webp`  
  Frequency once per day When you would be reduced to 0 Hit Points while released, spend 1 Reiatsu Point to remain at 1 Hit Point instead.  
  **Icon brief** (Homebrew (Soulbound class) — Unbroken Chain): A cracked chain refusing to break, one link glowing red-hot and holding everything together; a heartbeat line flat but for one spike.
#### 18th

- **Beyond the Blade** · _feat_ · `icons/weapons/swords/sword-guard-purple.webp`  
  Your Release Technique 's damage dice increase by two steps (d6&rarr;d10, d8&rarr;d12).  
  **Icon brief** (Homebrew (Soulbound class) — Release Technique): A sword thrust forward whose released energy erupts into a far larger, double-sized burst of reiatsu than the blade itself. Blue-white flare.
#### 1st

- **Additional Kidō** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-carved-stone-blue.svg`  
  You learn one more kidō of your choice. Special You can take this feat up to three times. A Hollow or a Quincy cannot take this: their arts are what they physically are, not a curriculum. With three of these a Soul Reaper reaches nine kidō at 20th — the hard ceiling — and has given up three Zanjutsu techniques to do it.  
  **Icon brief** (Homebrew (Soulbound class) — Kidō): An open scroll with three new kanji incantations glowing in gold, a small kidō circle forming above it.
- **Hirenkyaku Drill** · _feat_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  You may use Flash Step at 1st level instead of 3rd, but only once per encounter until 3rd level.  
  **Icon brief** (Bleach — Quincy Hirenkyaku): A glowing platform of blue spirit particles under a striding foot, a long streak of light behind it as if the ground itself carries the step.
- **Pesquisa** · _feat_ · `icons/magic/perception/third-eye-blue-red.webp`  
  Spirit Sense's range increases to 120 feet , and you learn each detected creature's approximate level relative to your own.  
  **Icon brief** (Bleach — Arrancar Pesquisa): Concentric sonar-like rings of reiatsu pulsing outward from a central point, small coloured dots of different sizes lit up on the rings.
- **Reader of Threads** · _feat_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-small-blue.svg`  
  Frequency once per round You can Recall Knowledge about spirits, haunts, and undead using Spirit Lore as a free action , and you learn one extra piece of information on a success.  
  **Icon brief** (Homebrew (Soulbound class) — Reader of Threads): A hand tracing glowing spirit-threads that trail off a translucent ghost, small kanji labels floating at the thread ends.
- **Sheathed Draw** · _feat_ · `icons/weapons/swords/sword-guard-blue.webp`  
  When you roll initiative, you manifest your spirit weapon and Release as a single free action.  
  **Icon brief** (Bleach — Iaijutsu draw): A katana half-drawn from its scabbard with a burst of reiatsu flaring at the mouth, initiative drum-beat lines behind it.
- **Twin Fang** · _feat_ · `modules/isaacs-hb-pf2e/icons/swords-short-blue.svg`  
  While your spirit weapon has the twin or agile trait, your second Strike each round with it reduces your multiple attack penalty by 1.  
  **Icon brief** (Homebrew (Soulbound class) — Twin Fang): Two fangs of reiatsu, one longer than the other, striking in quick succession, the second leaving a brighter, sharper bite.
- **Zanjutsu Footwork** · _feat_ · `icons/skills/movement/feet-winged-boots-brown.webp`  
  When you critically hit with your spirit weapon, you Step as a free action.  
  **Icon brief** (Bleach — Zanjutsu footwork): A sword's critical cut flashing white, with a dotted footstep path sliding sideways from it, ink-brush motion lines.
#### 20th

- **Final Release** · _feat_ · `icons/magic/death/skull-energy-light-white.webp`  
  Frequency once per week · Requirements You are 20th level and in a Full Release You stop carrying your power and become it. You enter Severance for 10 rounds . Somewhere inside those ten rounds you get exactly one irreversible attack, unique to your Spirit — your Severing Art . Using it is two actions, costs nothing, and immediately ends Severance whether you want it to or not. Its damage depends…  
  **Icon brief** (Bleach — Final Release): A sword hilt shattering as its blade turns into a column of raw reiatsu that consumes the whole frame; a single kanji 'end' glowing at the centre.
#### 2nd

- **Gintō Reserve** · _feat_ · `icons/consumables/potions/bottle-conical-corked-blue.webp`  
  You prepare 3 Gintō during your daily preparations. Each may be spent as a free action to use Gritz without spending a Reiatsu Point. Unspent Gintō are lost at your next preparations.  
  **Icon brief** (Bleach — Quincy Gintō): Three small silver tubes in a row, one uncorked and pouring a ribbon of liquid light, a faint pentacle drawn beneath them.
- **Guard the Threshold** · _feat_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  Trigger An ally within 15 feet takes damage from an undead, spirit, or incorporeal creature. Reduce that damage by 2 + your level . A Champion's reaction, exactly — but restricted to three creature types.  
  **Icon brief** (Homebrew (Soulbound class) — Guard the Threshold): A sword held flat across a doorway of light, a ghostly grasping hand breaking against it before reaching the figure behind.
- **Kidō Focus** · _feat_ · `icons/magic/symbols/runes-carved-stone-purple.webp`  
  When you use a kidō, you may spend 1 additional action to give the target a −1 circumstance penalty to its save.  
  **Icon brief** (Homebrew (Soulbound class) — Kidō Focus): Two fingers held to the lips over a kidō circle that narrows into a sharp focused beam aimed at a target sigil.
- **Pressure Flare** · _feat_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue.svg`  
  Frequency once per encounter Enemies within 15 feet must succeed at a Will save against your Reiatsu DC or be frightened 1 . This costs no Reiatsu Point.  
  **Icon brief** (Bleach — Spiritual pressure (Reiatsu)): A sudden flare of towering reiatsu exploding upward, shaped faintly like a looming face of light; tiny figures recoiling.
- **Rapid Bala** · _feat_ · `modules/isaacs-hb-pf2e/icons/projectile-bolt-glowing-red.svg`  
  When you use Bala , you may spend 1 additional action to use it again against the same or a different creature. Both uses apply and increase your multiple attack penalty as normal.  
  **Icon brief** (Bleach — Hollow Bala): Two red fist-sized spheres of compressed reiatsu fired in quick succession, the second one overtaking the first, short motion trails.
#### 4th

- **Cero Doble** · _feat_ · `modules/isaacs-hb-pf2e/icons/beam-jet-stream-red.svg`  
  Cero may be shaped as a 30-foot cone instead of a 60-foot line, and creatures that critically fail against it are pushed 10 feet away from you.  
  **Icon brief** (Bleach — Hollow Cero (wide)): A red cero spread wide into a fan-shaped cone from an open palm, the outer edge of the blast pushing back rubble. Red and black.
- **Chain Anchor** · _feat_ · `icons/magic/control/debuff-chains-ropes-red.webp`  
  When you critically hit a creature with your spirit weapon, it can't Step away from you until the end of its next turn.  
  **Icon brief** (Homebrew (Soulbound class) — Chain Anchor): A sword pinned through a shadow on the ground with a chain looped around it; the enemy's foot straining against the anchored shadow.
- **Deep Breath** · _feat_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue.svg`  
  You regain 2 Reiatsu Points instead of 1 the first time you use Steady the Breath each day.  
  **Icon brief** (Homebrew (Soulbound class) — Deep Breath): A seated silhouette exhaling a calm blue spiral of reiatsu that curls back into two glowing points at its chest.
- **Reiatsu Barrier** · _feat_ · `modules/isaacs-hb-pf2e/icons/barrier-shield-dome-blue.svg`  
  Trigger You are hit by an attack · Cost 1 Reiatsu Point You gain resistance equal to your level against the triggering damage.  
  **Icon brief** (Homebrew (Soulbound class) — Reiatsu Barrier): A fist-sized shell of coloured reiatsu hardening around a forearm at the point of impact, a strike cracking against it.
- **Shunpo Strike** · _feat_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  Flash Step , then Strike . This doesn't count against Flash Step's frequency.  
  **Icon brief** (Bleach — Shunpo strike): An afterimage trail ending abruptly in a sword slash that appears from nowhere behind a target, three fading silhouettes in a line.
#### 6th

- **Blut Discipline** · _feat_ · `icons/magic/control/buff-flight-wings-blue.webp`  
  You may switch which Blut you have active as a free action twice per round instead of once.  
  **Icon brief** (Bleach — Quincy Blut): A forearm whose visible blue veins of reishi shift between two patterns — thick armouring veins and thin bright arterial ones — split down the middle.
- **Cut the Cord** · _feat_ · `icons/weapons/swords/sword-guard-blue.webp`  
  Your spirit weapon's Strikes ignore the first 5 points of resistance to spirit damage.  
  **Icon brief** (Homebrew (Soulbound class) — Cut the Cord): A blade slicing cleanly through a glowing protective cord of spirit-thread, frayed ends curling away. Blue edge, pale gold threads.
- **Descorrer** · _feat_ · `modules/isaacs-hb-pf2e/icons/portal-vortex-purple.svg`  
  Frequency once per hour You open a Garganta : you and up to 5 allies teleport up to 500 feet to a location you can see or have visited.  
  **Icon brief** (Bleach — Arrancar Garganta): A black rift tearing open in the sky with jagged teeth-like edges, revealing a dark void beyond; ragged white fragments peeling back from its rim.
- **Kidō Combination** · _feat_ · `icons/magic/symbols/runes-carved-stone-purple.webp`  
  Frequency once per encounter Immediately after using a destruction kidō, use a binding kidō against the same target for 1 fewer Reiatsu Point (minimum 0).  
  **Icon brief** (Homebrew (Soulbound class) — Kidō Combination): A red Shakkahō fireball on the left linked by a glowing arrow to a yellow binding rope on the right, both orbiting one target point.
- **Reactive Strike** · _feat_ · `icons/skills/melee/blade-tip-chipped-blood-red.webp`  
  You gain the Reactive Strike reaction: when a creature within your reach uses a manipulate or move action, makes a ranged attack, or leaves a square during a move action, make a melee Strike against it. A critical hit disrupts a manipulate action. A reaper who stands still is the most dangerous thing on the field. This is pf2e's own shared class feat at the level Barbarian and Champion get it,…  
  **Icon brief** (Homebrew (Soulbound class) — Reactive Strike): A blade flashing out from a guard stance into an enemy reaching past it, a short bright arc of light marking the counter-cut.
#### 8th

- **Pressure Crush** · _feat_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue-large.svg`  
  Cost 1 Reiatsu Point Enemies in a 20-foot emanation attempt a Fortitude save; on a failure they are clumsy 1 and take a −5-foot status penalty to Speeds for 1 minute.  
  **Icon brief** (Bleach — Spiritual pressure (Reiatsu)): A heavy downward column of reiatsu crushing small silhouettes to their knees, cracks spreading through the ground around them.
- **Rising Tide** · _feat_ · `modules/isaacs-hb-pf2e/icons/wind-vortex-blue.svg`  
  The first time each round that Rising Pressure grants you a Reiatsu Point, you also gain temporary Hit Points equal to half your level (minimum 2). They last until the start of your next turn and don't stack with themselves. This ties the class's signature engine to its real weakness — a 10-Hit-Point light-armour frontliner — and pays out every round of every fight.  
  **Icon brief** (Homebrew (Soulbound class) — Rising Tide): Three ascending waves of reiatsu, each higher than the last, with a thin shell of pale light forming over a silhouette at the crest.
- **Zanjutsu: Hakuda** · _feat_ · `icons/skills/melee/unarmed-punch-fist.webp`  
  You gain a 1d6 fist unarmed attack with agile , finesse and nonlethal , and you may make one unarmed Strike as part of any Zanjutsu technique.  
  **Icon brief** (Bleach — Hakuda): A bare fist striking in tandem with a sword, the punch's shockwave ring overlapping the blade's slash arc. Black and white ink.
#### Borrowed Nature

- **Borrowed Nature** · _feat_ · `icons/magic/symbols/runes-triangle-blue.webp`  
  You take on a second Lineage's nature, partially and with effort. Choose a Lineage other than your own; this choice is permanent . You learn that Lineage's free cantrip kidō — Shō , Bala or Heizen — and it costs you no Reiatsu Point, exactly as it would for someone born to it. You also gain Don the Other Face . Every one of the six directions has a name in the source material: a Soul Reaper…  
  **Icon brief** (Homebrew (Soulbound class) — borrowed Lineage): A half-and-half mask: one side a Soul Reaper's ink kanji, the other a white Hollow bone fragment, joined by a thin crack of light.
- **Deeper Crossing** · _feat_ · `modules/isaacs-hb-pf2e/icons/runes-triangle-purple.svg`  
  Prerequisite Borrowed Nature You may Don the Other Face twice per encounter, and your Aspect deepens: Soul Reaper's Discipline — you learn a second kidō, and while the Face is on your destruction kidō deal one additional die of damage. Hollow's Mask — temporary Hit Points equal to twice your level, resistance equal to half your level, and the Speed bonus increases to +10 feet . Quincy's…  
  **Icon brief** (Homebrew (Soulbound class) — Deeper Crossing): A mask pressed deeper into a face, its glyphs bleeding into the skin around it, two overlapping auras — black-and-white Hollow and blue Soul Reaper.
- **Second Nature** · _feat_ · `icons/magic/symbols/runes-triangle-orange.webp`  
  Prerequisite Deeper Crossing The mask stops being something you put on. Your Borrowed Nature Aspect — the 6th-level version, not the 12th — is always active : no action, no Reiatsu Point, no duration, and no Will penalty . Donning the Other Face still upgrades you to the Deeper Crossing numbers for 1 minute, twice per encounter. Canon: this is the exact difference between a Visored who has to…  
  **Icon brief** (Homebrew (Soulbound class) — Second Nature): A white Hollow mask that has become a permanent part of a face, its edges grown into the skin with no visible seam, a calm glow in the eye-hole.
#### Zanjutsu

- **Zanjutsu: Hitotsume: Nadegiri** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  You learn the Hitotsume: Nadegiri Zanjutsu technique. Zanjutsu techniques are Strike-based reiatsu effects, each costing 1 Reiatsu Point and requiring your spirit weapon to be Released.  
  **Icon brief** (Bleach — Zanjutsu: Hitotsume (feat)): A wooden training post in a dojo with a single long dash-mark of scuffed footprints leading to one clean diagonal cut across it, an ink kanji for 'one' (一) brushed above.
- **Zanjutsu: Ikkotsu** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  You learn the Ikkotsu Zanjutsu technique. Zanjutsu techniques are Strike-based reiatsu effects, each costing 1 Reiatsu Point and requiring your spirit weapon to be Released.  
  **Icon brief** (Bleach — Kenpachi's Ikkotsu (feat)): A cracked practice boulder with one deep fist-shaped crater in its centre, a single bone kanji (骨) brushed in ink beside it.
- **Zanjutsu: Kendō** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  You learn the Zanjutsu: Kendō Zanjutsu technique. Zanjutsu techniques are Strike-based reiatsu effects, each costing 1 Reiatsu Point and requiring your spirit weapon to be Released.  
  **Icon brief** (Bleach — Kendō (feat)): A wooden bokken laid across a cracked lacquered armour plate on a dojo floor, a precise single puncture glowing white in the plate.
- **Zanjutsu: Nadegiri** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  You learn the Nadegiri Zanjutsu technique. Zanjutsu techniques are Strike-based reiatsu effects, each costing 1 Reiatsu Point and requiring your spirit weapon to be Released.  
  **Icon brief** (Bleach — Kenpachi's Nadegiri (feat)): A ring of bamboo practice posts all sliced through at the same height by one circular stroke, their tops sliding off together.
- **Zanjutsu: Shitonegaeshi** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  You learn the Shitonegaeshi Zanjutsu technique. Zanjutsu techniques are Strike-based reiatsu effects, each costing 1 Reiatsu Point and requiring your spirit weapon to be Released.  
  **Icon brief** (Bleach — Zanjutsu: Shitonegaeshi (feat)): A dojo floor mat folded over like a flipped cushion with a training sword resting across it, small footwork arrows painted on the boards.
- **Zanjutsu: Sōkotsu** · _feat_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  You learn the Sōkotsu Zanjutsu technique. Zanjutsu techniques are Strike-based reiatsu effects, each costing 1 Reiatsu Point and requiring your spirit weapon to be Released.  
  **Icon brief** (Bleach — Kenpachi's Sōkotsu (feat)): A practice boulder with two side-by-side fist craters joined by a single crack, the kanji for 'two' (二) brushed beside them.

### soulbound-journals (1)

- **The Soulbound: Handbook** · _journal_ · `icons/sundries/books/book-embossed-blue.webp`  
  Three peoples fight the same war with the same physics and opposite manners. A Soul Reaper carries their own soul as a sword, and it argues with them. A Hollow ate its own heart and wears the hole. A Quincy owns no soul-weapon at all — they reach into the air and make a bow out of what is already there. Mechanically they are one chassis: 10 Hit Points, light armour, a Reiatsu DC , and a focus…  
  **Icon brief** (Homebrew (Soulbound class) — Handbook): A thick bound book with three symbols on its cover in a triangle — a katana, a white bone mask with a chest hole, and a blue Quincy star.

### soulbound-kido (16)

#### Hollow Arts

- **Bala** · _spell_ · `modules/isaacs-hb-pf2e/icons/projectile-bolt-glowing-red.svg`  
  A Hollow's demon arts are not learned, they are anatomy. A Bala is weaker than a Cero and fired at roughly twenty times the rate — which is a cantrip and a focus effect, described in the source material before anyone tried to stat it. Make a spell attack roll against one creature within 60 feet. On a hit it takes 1d4[force] damage plus your key attribute modifier, doubled on a critical hit. Bala…  
  **Icon brief** (Bleach — Hollow Bala): A small, fast red sphere of compressed reiatsu punched from a fist, short speed trails behind it.
- **Cero** · _spell_ · `modules/isaacs-hb-pf2e/icons/beam-jet-stream-red.svg`  
  Gathered at a horn, a fingertip, or the tongue, and let go in a straight line. Each creature in a 60-foot line takes 2d6[force] damage with a basic Reflex save. Heightened (+1) The damage increases by 1d6. The line is longer than Shakkahō's burst because Cero is a Hollow's only costed kidō — breadth traded for reach.  
  **Icon brief** (Bleach — Hollow Cero): A thick red beam of reiatsu fired straight from an open mouth or fingertip, a dark core inside the red, scorching the ground.
#### Quincy Arts (Gintō)

- **Gritz** · _spell_ · `icons/magic/control/debuff-chains-ropes-net-white.webp`  
  A silver tube uncorked and spoken over; a man-sized pentacle closes over what it names. One creature within 30 feet attempts a Reflex save. Failure It is immobilized for 1 round (Escape against your Reiatsu DC). Critical Failure It is restrained for 1 minute. It can attempt a new save at the end of each of its turns. One step better than Sai on a critical failure, because it is the Quincy's only…  
  **Icon brief** (Bleach — Quincy Gintō: Gritz): A man-sized glowing pentacle of light closing over a target like a cage, a silver Gintō tube spilling liquid light at the base.
- **Heizen** · _spell_ · `icons/magic/light/beam-rays-blue-large.webp`  
  A flat rectangular pane of light. Canon is plain about what it does: it slices through what it crosses. Each creature in a 15-foot line takes 1d6[force] damage with a basic Reflex save. Heightened (+2) The damage increases by 1d6. An area cantrip, so it adds no attribute modifier.  
  **Icon brief** (Bleach — Quincy Gintō: Heizen): A flat rectangular pane of light cutting through the frame vertically, a cross-shaped pillar of light rising from it.
#### Way of Binding (Bakudō)

- **Danku — Splitting Void** · _spell_ · `modules/isaacs-hb-pf2e/icons/barrier-shield-dome-blue.svg`  
  Trigger You or an ally within 15 feet would take damage from a ranged attack, a spell, or an area effect. Bakudō #81. A wall of pure nothing, held up flat against whatever is coming. The target of the trigger gains resistance equal to your level against the triggering damage.  
  **Icon brief** (Bleach — Bakudō #81 Danku): A tall flat rectangular pane of translucent light with sharp corners, a beam of energy splashing harmlessly off its face.
- **Hainawa — Crawling Rope** · _spell_ · `modules/isaacs-hb-pf2e/icons/debuff-chains-ropes-yellow.svg`  
  Bakudō #4. A rope of yellow energy from the fingertips, around the legs. One creature within 30 feet attempts a Reflex save. Failure It takes a −10-foot status penalty to its Speeds for 1 round and can't Step. Critical Failure As failure, and it is off-guard for that round.  
  **Icon brief** (Bleach — Bakudō #4 Hainawa): A rope of glowing yellow reiatsu shooting from two fingertips and coiling tightly around a pair of legs.
- **Kin — Silence the Chain** · _spell_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  Bakudō #99. The first of the great seals: cloth, then bolts, then the weight of a sentence. One creature within 30 feet attempts a Will save. Failure It is stupefied 2 for 1 minute, and can't cast spells or use kidō for 1 round. Critical Failure It is stupefied 3 for 1 minute, and can't cast spells or use kidō for 2 rounds.  
  **Icon brief** (Bleach — Bakudō #99 Kin): Arms bound by black cloth strips, then pinned by large iron bolts driven through the cloth into the ground, a heavy stone slab looming above.
- **Rikujōkōrō — Six Rods** · _spell_ · `icons/magic/control/debuff-chains-ropes-purple.webp`  
  Bakudō #61. Six thin rods of light slam into the midsection from six directions and hold it there. One creature within 30 feet attempts a Fortitude save. Failure It is immobilized and can't use manipulate actions for 1 round. Critical Failure As failure, for 2 rounds. Deliberately without the incapacitation trait, which is why it stops at "no manipulate actions" rather than at paralysed.  
  **Icon brief** (Bleach — Bakudō #61 Rikujōkōrō): Six thin rectangular blades of yellow light slamming in from six directions into a figure's midsection, freezing it in mid-motion.
- **Sai — Restrain** · _spell_ · `icons/magic/control/debuff-chains-ropes-red.webp`  
  Bakudō #1. The arms lock behind the back and stay there. One creature within 30 feet attempts a Reflex save. Failure It is immobilized for 1 round (Escape against your Reiatsu DC). Critical Failure It is immobilized for 1 minute. It can attempt a new save at the end of each of its turns.  
  **Icon brief** (Bleach — Bakudō #1 Sai): Two arms suddenly locked behind a back by an invisible force, faint white kidō lines around the wrists.
#### Way of Destruction (Hadō)

- **Byakurai — Pale Lightning** · _spell_ · `icons/magic/lightning/bolt-strike-blue.webp`  
  Hadō #4. A single white bolt from one finger. Precise, quiet, and faster than the eye. Make a spell attack roll against one creature within 60 feet. On a hit it takes 2d6[electricity] damage, doubled on a critical hit. This ignores lesser cover . Heightened (+1) The damage increases by 1d6.  
  **Icon brief** (Bleach — Hadō #4 Byakurai): A single, thin, perfectly straight bolt of pale white lightning shooting from an extended index finger, piercing through a target.
- **Kurohitsugi — Black Coffin** · _spell_ · `icons/magic/death/skull-humanoid-crown-white-blue.webp`  
  Hadō #90. A box of black reiatsu closes over the target, and what is inside it is pierced from every direction at once. Each creature in a 10-foot burst within 60 feet takes 9d6[void] damage with a basic Reflex save. A creature that critically fails is immobilized until the end of its next turn (Escape against your Reiatsu DC). Heightened (+1) The damage increases by 1d6.  
  **Icon brief** (Bleach — Hadō #90 Kurohitsugi): A tall black box of dark reiatsu closing around a target, dozens of black spears piercing it from every side; purple-black edges.
- **Shakkahō — Crimson Bloom** · _spell_ · `modules/isaacs-hb-pf2e/icons/explosion-fireball-medium-red.svg`  
  Hadō #31. A sphere of red fire gathered in the palm and thrown. The workhorse of the destructive arts. Each creature in a 10-foot burst within 60 feet takes 2d6[fire] damage with a basic Reflex save. Heightened (+1) The damage increases by 1d6.  
  **Icon brief** (Bleach — Hadō #31 Shakkahō): A sphere of red fire gathered in an open palm, ready to be thrown, sparks spiralling around it.
- **Shō — Thrust** · _spell_ · `modules/isaacs-hb-pf2e/icons/abstract-impact-white.svg`  
  Hadō #1. A blunt shove of pure pressure — the first thing anyone learns, and the one a reaper never stops using. One creature within 30 feet takes 1d4[force] damage plus your key attribute modifier, with a basic Reflex save. On a critical failure it is also pushed 5 feet. Heightened (+2) The damage increases by 1d4.  
  **Icon brief** (Bleach — Hadō #1 Shō): An index finger flicked forward with an invisible shockwave ring pushing outward, a shove of pressure lifting dust.
- **Sōkatsui — Sundering Wave** · _spell_ · `icons/magic/fire/beam-jet-stream-blue.webp`  
  Hadō #33. Blue fire poured along the ground in a widening wave. Each creature in a 30-foot line takes 2d4[spirit] damage with a basic Reflex save. A creature that fails is pushed 10 feet away from you. Heightened (+1) The damage increases by 1d4. The push is the reason the die is a d4 rather than a d6.  
  **Icon brief** (Bleach — Hadō #33 Sōkatsui): A wide wave of blue fire pouring from an open palm and spreading along the ground in a cone.
- **Sōren Sōkatsui — Twin Wave** · _spell_ · `modules/isaacs-hb-pf2e/icons/beam-jet-stream-blue-yellow.svg`  
  Hadō #73. Both hands, side by side. Canon calls it twice the power of the basic variant, and it is. Each creature in a 60-foot line takes 7d6[spirit] damage with a basic Reflex save. A creature that fails also takes 1d6 persistent fire damage. Heightened (+1) The damage increases by 1d6.  
  **Icon brief** (Bleach — Hadō #73 Sōren Sōkatsui): Two hands held side by side unleashing a massive, twin-cored torrent of blue fire, far larger and brighter than the single version.
#### Way of Mending (Kaidō)

- **Kaidō — Mend the Weave** · _spell_ · `icons/magic/life/heart-cross-green.webp`  
  The Way of Mending. Hands over the wound, and the weave pulled back together. You restore 5 Hit Points per half your level, rounded up (minimum 5) to one willing creature you touch. At 9th level you also remove one of clumsy , enfeebled or stupefied . This is meant to be mediocre. You are not the party's healer, and the class does not pretend otherwise: Kaidō exists so a lone Soul Reaper can…  
  **Icon brief** (Bleach — Kaidō): Two hands held over a wound with a soft green-gold glow pouring from the palms, the wound's edges weaving back together.

### soulbound-macros (1)

- **Soulbound: Test Rig** · _script_ · `modules/isaacs-hb-pf2e/icons/vial-flask-clear-blue.svg`  
  Macro:  
  **Icon brief** (Homebrew (Soulbound class) — Test rig macro): A glass vial of clear blue reiatsu in a lab clamp, a small gear and measuring scale engraved on the glass.

### soulbound-techniques (46)

- **Antithesis** · _spell_ · `modules/isaacs-hb-pf2e/icons/bow-recurve-blue.svg`  
  Trigger You or an ally within 30 feet takes damage from a creature you can see. You reverse the two events. The triggering creature takes 2d6[spirit] damage, and the target of the trigger gains resistance equal to your level against the triggering damage. Heightened (+2) The damage increases by 1d6. Refined (9th) You additionally gain Licht Regen . This is Bakudō #81 with the damage reflected…  
  **Icon brief** (Bleach — Uryū's Schrift 'A' (Antithesis)): Two arrows of light reversing direction mid-flight, swapping places in a loop; a stylised letter A at the loop's centre. Blue and white.
- **Apotheosis** · _spell_ · `modules/isaacs-hb-pf2e/icons/angel-winged-humanoid-golden.svg`  
  Cost nothing · Requirements You are in Severance Every wound taken all fight arrives at once as growth. 30-foot emanation , basic Fortitude, force damage. You gain temporary Hit Points equal to twice your level . At the start of your next turn the emanation detonates a second time for half the Waning dice. ⚠ Extrapolated — growing stronger from damage is Gerard's canon Schrift. Waning. The damage…  
  **Icon brief** (Bleach — Gerard Valkyrie's The Miracle (homebrew finisher)): A body-sized burst of golden light erupting outward in a ring, every old wound line glowing gold before exploding into growth.
- **Aullido** · _spell_ · `modules/isaacs-hb-pf2e/icons/wolf-howl-moon-grey-large.svg`  
  Cost nothing · Requirements You are in Severance Howl. Every wolf you have left converges on one point and goes off together. Requirements At least one wolf remains. 40-foot burst within 120 feet, basic Reflex, force damage. You expend all remaining wolves and regain none for the rest of the encounter. If you had five or more , creatures that critically fail are also knocked prone and stunned 1 .…  
  **Icon brief** (Bleach — Starrk's soul wolves): A pack of blue spirit wolves converging from all sides onto one point and detonating together in a massive blue explosion.
- **Burner Finger** · _spell_ · `modules/isaacs-hb-pf2e/icons/projectile-fireball-smoke-strong-red.svg`  
  Choose a number of fingers from one to five. Each choice is a different effect, and each costs the same single Reiatsu Point. Fingers Effect One Range 60 ft., one creature. Ranged spell attack, 3d6 fire, doubled on a crit. Two Range 60 ft., two creatures. As One, but 2d6 each. Three 30-foot line , basic Reflex, 2d6 fire. Four A blade of fire with an elongated crossguard forms around your hand and…  
  **Icon brief** (Bleach — Bazz-B's Burner Finger): A hand with one index finger extended, a laser-thin pillar of white-hot fire shooting from the fingertip, the other fingers ready.
- **Burning Full Fingers** · _spell_ · `icons/magic/fire/explosion-fireball-large-orange.webp`  
  Cost nothing · Requirements You are in Severance Fire on all five fingertips at once, released as a spiralling torrent. 60-foot cone , basic Reflex, fire damage. Creatures that fail take 4d6 persistent fire whose flat check to end is DC 20 rather than DC 15. Canon's own name for Bazz-B's strongest technique. Waning. The damage is 20d6 if used in the first round of Severance, and two dice fewer…  
  **Icon brief** (Bleach — Bazz-B's Burning Full Fingers): All five fingertips of a hand ablaze, the flames merging into a single spiralling torrent of fire that fills the frame.
- **Cero Metralleta** · _spell_ · `modules/isaacs-hb-pf2e/icons/projectile-bolt-salvo-red.svg`  
  Machine-Gun Hollow Flash. You fire an uncountable barrage from both pistols. Canon has Starrk claim he can fire a thousand at once. Each creature in a 60-foot cone takes 2d6[force] damage with a basic Reflex save. You may instead shape it as a 120-foot line . Heightened (+1) The damage increases by 1d6. Refined (9th) You may Sustain Cero Metralleta at the start of your next turn to fire it again…  
  **Icon brief** (Bleach — Starrk's Cero Metralleta): A machine-gun barrage of hundreds of small blue ceros streaking forward in a dense cone from two pistols.
- **Cero Oscuras** · _spell_ · `modules/isaacs-hb-pf2e/icons/wing-bat-membrane-green.svg`  
  Dark Hollow Flash. A cero so black it takes the light with it. Make a spell attack roll against one creature within 90 feet. On a hit it takes 3d6[spirit] damage, doubled on a critical hit. Heightened (+1) The damage increases by 1d6. Refined (9th) On a critical hit the target is off-guard until the start of your next turn, and Cero Oscuras gains a 5-foot burst at the target's location dealing…  
  **Icon brief** (Bleach — Ulquiorra's Cero Oscuras): A sphere of pure black energy rimmed in vivid green, swallowing the light around it, ready to fire.
- **Cero Oscuras: Ceniza** · _spell_ · `modules/isaacs-hb-pf2e/icons/wing-bat-membrane-green-large.svg`  
  Cost nothing · Requirements You are in Severance Dark Hollow Flash: Ash. A black cero fired point-blank down a corridor of nothing. 120-foot line , basic Reflex, spirit damage. A creature reduced to 0 Hit Points by this crumbles to ash ; returning it to life requires a 10th-rank effect. ⚠ Extrapolated name — the ash is canon: it is how Ulquiorra himself ends. Waning. The damage is 20d6 if used in…  
  **Icon brief** (Bleach — Ulquiorra's Cero Oscuras (point blank)): A black cero with a green outline fired straight down a long empty corridor, a figure in its path crumbling to ash.
- **Colmillo — Fang** · _spell_ · `modules/isaacs-hb-pf2e/icons/wolf-howl-moon-grey-large.svg`  
  Requirements at least one wolf remains Expend any number of wolves. Each wolf you expend moves to a point within 60 feet and detonates in a 10-foot burst : 3d6[force] damage, basic Reflex. A creature in more than one burst takes damage only from the highest . Heightened (+1) The damage increases by 1d6.  
  **Icon brief** (Bleach — Starrk's soul wolves): A single blue spirit wolf lunging forward and bursting into a ring of blue light on impact.
- **Desgarrón** · _spell_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue-large.svg`  
  Cost nothing · Requirements You are in Severance Panther King's Claw. Your claws extend into ten blades of condensed reishi and you throw all of them. 60-foot cone , basic Reflex, slashing damage. Creatures that fail take 4d6 persistent bleed . Canon has Grimmjow name this his strongest attack, which is why it sits here rather than in his Segunda Etapa. Waning. The damage is 20d6 if used in the…  
  **Icon brief** (Bleach — Grimmjow's Desgarrón): Ten huge blue energy claws raking forward from outstretched fingers, five on each side, forming a cone of slashing light.
- **Electrocution** · _spell_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-forked-white.svg`  
  Cost nothing · Requirements You are in Severance You stop directing the lightning and simply become the storm. 30-foot emanation , basic Reflex, electricity damage. Creatures that fail are stunned 2 . Canon's name for Candice's strongest technique. Carries the incapacitation trait. Waning. The damage is 20d6 if used in the first round of Severance, and two dice fewer each round after — 18d6,…  
  **Icon brief** (Bleach — Candice Catnipp's Electrocution): A storm of crackling green-yellow lightning radiating outward from a central point in a full circle, everything caught in it lit white.
- **Ennetsu Jigoku** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-glowing-orange.svg`  
  Scorching Heat Hell. Each creature in the emanation takes 2d6[fire] damage with a basic Reflex save. Creatures that fail also take 1d4 persistent fire damage. Heightened (+1) The damage increases by 1d6, and the persistent damage by 1d4 at every other increment. Refined (9th) The emanation increases to 20 feet , and the ground within it becomes difficult terrain from burning debris until the end…  
  **Icon brief** (Bleach — Yamamoto's Ennetsu Jigoku): A ring of tall fire pillars rising from the ground, enclosing a dark centre, the flames rising like a burning prison.
- **Galvano Blast** · _spell_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-white.svg`  
  Each creature in a 60-foot line takes 2d6[electricity] damage with a basic Reflex save. Creatures that fail are stunned 1 ; creatures that critically fail are stunned 2 . Heightened (+1) The damage increases by 1d6. Refined (9th) You may instead throw Galvano Javelin . This carries the incapacitation trait. Stunned on a failed basic save at rank 1 is above the curve without it; against a creature…  
  **Icon brief** (Bleach — Candice Catnipp's Galvano Blast): A thick, straight beam of green-yellow lightning tearing across the frame, crackling arcs spitting off its edges.
- **Galvano Javelin** · _spell_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-white.svg`  
  You throw a javelin of lightning. Make a ranged spell attack against one creature within 90 feet; on a hit it takes 6d6[electricity] damage, doubled on a critical hit, and is stunned 1 . Heightened (+1) The damage increases by 1d6. Carries the incapacitation trait.  
  **Icon brief** (Bleach — Candice Catnipp's Galvano Javelin): A javelin of crackling green-yellow lightning in mid-flight, sparks trailing behind it.
- **Garra de la Pantera** · _spell_ · `modules/isaacs-hb-pf2e/icons/paw-print-pair-blue.svg`  
  Claw of the Panther. You fire crystalline darts from your elbow. Each creature in a 30-foot cone takes 2d6[piercing] damage with a basic Reflex save. The area is littered with shards and becomes difficult terrain for enemies until the start of your next turn. Heightened (+1) The damage increases by 1d6. Refined (9th) Your claws' damage die increases to 1d10 , and after using Garra de la Pantera…  
  **Icon brief** (Bleach — Grimmjow's Garra de la Pantera): A cone of crystalline blue darts fired from an elbow-blade, the shards scattering across the ground.
- **Getsuga Tenshō** · _spell_ · `modules/isaacs-hb-pf2e/icons/projectile-dark-blue.svg`  
  Moon Fang Heaven-Piercer. Each creature in the line takes 2d6[spirit] damage with a basic Reflex save. Heightened (+1) The damage increases by 1d6. Refined (9th) — Kuroi Getsuga (Black Moon Fang) . The line increases to 60 feet , the damage ignores resistance to spirit damage , and creatures that critically fail take 1d6 persistent spirit damage.  
  **Icon brief** (Bleach — Getsuga Tenshō): A huge crescent-moon wave of blue-white energy flying off a blade's edge, cutting a trench in the ground beneath it.
- **Hirviendo — Boil** · _spell_ · `modules/isaacs-hb-pf2e/icons/flame-burning-water-blue.svg`  
  Frequency once per round You boil the water around you. All water and ice within your emanation — including that created by other creatures, and including effects with the water or cold trait that create terrain — is destroyed, and each enemy in the emanation takes 2d6[fire] damage. Terrain denial with a small damage rider: the counterpart to the Quincy's Seal the Art, aimed at battlefield…  
  **Icon brief** (Bleach — Harribel's Hirviendo): Water swirling around a central blade boiling into thick white steam, the ice crystals evaporating instantly.
- **Hitotsume: Nadegiri** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  Requirements Your spirit weapon is Released · Cost 1 Reiatsu Point First: Clean Sweep. Stride up to your Speed, then make one Strike dealing an additional 1d6[untyped] damage; if the Strike hits, the target is off-guard until the end of your turn. Heightened (+2) +1d6.  
  **Icon brief** (Bleach — Zanjutsu: Nadegiri): A dash forward followed by a single clean sword sweep, the cut drawn as one bold brush stroke with dust trailing the dash.
- **Hyōryū Senbi** · _spell_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-swirl-blue.svg`  
  Ice Dragon Whirling Tail. Cost one petal-flower. Swinging the blade in a line, you throw a crescent of overflowing ice. Each creature in a 60-foot line takes 5d6[cold] damage with a basic Reflex save; creatures that fail are slowed 1 until the end of their next turn. Heightened (+1) The damage increases by 1d6.  
  **Icon brief** (Bleach — Hitsugaya's Hyōryū Senbi): A crescent of overflowing ice thrown from a sword swing, ice crystals spreading out behind it in a line.
- **Hyōten Hyakkasō** · _spell_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-swirl-blue.svg`  
  Cost nothing · Requirements You are in Severance Frozen Heavens Hundred Flower Funeral. Snow falls and ice flowers bloom on everything it touches. 30-foot emanation , basic Fortitude, cold damage. Creatures that fail are restrained in a pillar of ice (Escape against your Reiatsu DC) and take 4d6 persistent cold that allows no flat check to end while restrained. Canon: the target's life ends when…  
  **Icon brief** (Bleach — Hitsugaya's Hyōten Hyakkasō): Snowflakes falling from a hole in dark clouds and blooming into delicate ice flowers wherever they touch.
- **Ikkotsu** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  Requirements Your spirit weapon is Released · Cost 1 Reiatsu Point Single Bone. Make one Strike dealing an additional 4d6[untyped] damage; on a critical hit the target is stunned 1 . Heightened (+1) +1d6. Carries the incapacitation trait.  
  **Icon brief** (Bleach — Kenpachi's Ikkotsu): A single massive punch with a bone-white shockwave ring and cracks spiderwebbing out from the point of impact.
- **Ittō Kasō** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-glowing-orange.svg`  
  Cost nothing · Requirements You are in Severance Single Blade Cremation. A pillar of red fire in the shape of a katana's tip erupts from the ground. 20-foot burst within 60 feet, basic Reflex, fire damage — and it deals the Waning dice +2d6 , the only Art in the class that beats the table. The fire ignores resistance and immunity to fire . Creatures that fail can't regain Hit Points for 1 minute…  
  **Icon brief** (Bleach — Yamamoto's Ittō Kasō): A single towering pillar of red fire erupting from the ground in the shape of a katana's tip.
- **Kanzen Saimin: Owari** · _spell_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-large-purple.svg`  
  Cost nothing · Requirements You are in Severance Complete Hypnosis: The End. The hypnosis stops being a lie about your position and becomes a lie about everything. 60-foot emanation , basic Will, mental damage. Creatures that fail are confused for 1 minute. On a critical failure the creature perceives its own allies as you for that minute and cannot be shaken loose by damage. ⚠ Extrapolated.…  
  **Icon brief** (Bleach — Aizen's Kyōka Suigetsu (homebrew finisher)): A shattering mirror reflecting a distorted world, the cracks spreading across a moon reflected on dark water.
- **Kita: Tenchi Kaijin** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-two-handed-blackened-orange.svg`  
  North, Heaven and Earth End in Ashes. Frequency once per round · Requirements you are in the Kita aspect. Each creature in a 60-foot line takes 5d6[fire] damage with a basic Reflex save. This damage cannot be reduced by resistance to fire, by Blut Vene, or by Hierro . Heightened (+1) The damage increases by 1d6. Canon's note that "not even Blut Vene can block this attack" is the only unresistable…  
  **Icon brief** (Bleach — Yamamoto's Kita: Tenchi Kaijin): A single vertical slash cleaving through the sky and the earth beneath, a line of ash and fire splitting the frame.
- **La Gota** · _spell_ · `icons/creatures/fish/fish-shark-swimming.webp`  
  The Drop. A blade of compressed water thrown from the edge. Each creature in the cone takes 2d6[slashing] damage with a basic Reflex save; creatures that fail are pushed 10 feet away from you. Heightened (+1) The damage increases by 1d6. Refined (9th) — Cascada (Waterfall) . The cone increases to 40 feet , creatures that critically fail fall prone , and the area becomes difficult terrain from…  
  **Icon brief** (Bleach — Harribel's La Gota): A blade of compressed water thrown from a sword's edge, a spray of droplets trailing behind it.
- **La Hora Final** · _spell_ · `modules/isaacs-hb-pf2e/icons/skull-crowned-white-purple.svg`  
  Cost nothing · Requirements You are in Severance The Final Hour. Respira stops being a breath and becomes a verdict. 30-foot emanation , basic Fortitude, void damage. Creatures that fail are enfeebled 3 for 1 minute and drained 1 for 24 hours as decades leave them. ⚠ Extrapolated — the aging is Baraggan's canon aspect of death. Waning. The damage is 20d6 if used in the first round of Severance,…  
  **Icon brief** (Bleach — Barragan's Respira (homebrew finisher)): A purple-black miasma expanding outward, a clock face at its centre whose hands are withering.
- **Lanza del Relámpago** · _spell_ · `modules/isaacs-hb-pf2e/icons/bolt-strike-forked-green.svg`  
  Lance of the Lightning. Frequency once per round You forge a javelin of crackling green lightning and throw it. Make a ranged spell attack against one creature within 120 feet; on a hit it takes 5d6[electricity] damage, doubled on a critical hit. Whether or not you hit, the lance detonates in a 15-foot burst at that point: 5d6 fire damage, basic Reflex. Heightened (+1) +1d6 to both.  
  **Icon brief** (Bleach — Ulquiorra's Lanza del Relámpago): A javelin of crackling green lightning thrown forward, the energy pulsing along its length.
- **Licht Regen** · _spell_ · `modules/isaacs-hb-pf2e/icons/beams-rays-blue.svg`  
  Light Rain. A volley of arrows blackens the sky. Each creature in a 30-foot cone takes 6d6[piercing] damage with a basic Reflex save. Creatures that critically fail are off-guard until the start of your next turn. Heightened (+1) The damage increases by 1d6. It enters at 6d6 and reaches 9d6 at rank 10 — under the standard area ladder's 11d6, because it comes as an addition to an existing Release…  
  **Icon brief** (Bleach — Quincy Licht Regen): A volley of blue arrows of light filling the sky, raining down in a cone.
- **Mugetsu** · _spell_ · `modules/isaacs-hb-pf2e/icons/projectile-dark-blue.svg`  
  Cost nothing · Requirements You are in Severance Moonless Sky. A blade of black reiatsu pours from your arm. 60-foot cone , basic Reflex, spirit damage. This ignores all resistances and immunities to spirit damage . Canon's Saigo no Getsuga Tenshō is the state — here, Severance — and Mugetsu is the one attack inside it. Every other Spirit gets the same two-part shape. Waning. The damage is 20d6…  
  **Icon brief** (Bleach — Ichigo's Mugetsu): A sweeping wave of pure black darkness pouring from an extended arm, swallowing everything in its path.
- **Nadegiri** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  Requirements Your spirit weapon is Released · Cost 1 Reiatsu Point Clean Sweep. Make one Strike against each enemy in your reach, each at your current multiple attack penalty; the penalty doesn't increase until all Strikes are made.  
  **Icon brief** (Bleach — Kenpachi's Nadegiri): A huge sweeping horizontal slash ringing all the way around, a full circle of light cutting through multiple silhouettes.
- **Ola Azul** · _spell_ · `icons/creatures/fish/fish-shark-swimming.webp`  
  Cost nothing · Requirements You are in Severance Blue Wave. Reiryoku gathers in the hollow of the blade and leaves it as a single wave. 60-foot line , basic Reflex, slashing damage. Creatures that fail are pushed 30 feet directly away from you and knocked prone . Creatures that critically fail are pushed 60 feet instead. Waning. The damage is 20d6 if used in the first round of Severance, and two…  
  **Icon brief** (Bleach — Harribel's Ola Azul): A single wave of blue reiryoku gathered in the hollow of a shark's-tooth blade and flung forward in a line.
- **Respira** · _spell_ · `modules/isaacs-hb-pf2e/icons/skull-crowned-white.svg`  
  Breath of Death. A black miasma spills from you and everything in it gets older. Each creature in the emanation takes 2d6[void] damage with a basic Fortitude save. Creatures that fail are enfeebled 1 for 1 minute as they age; on a critical failure, enfeebled 2 and clumsy 1 instead. The miasma lingers: until the start of your next turn, an enemy that enters or ends its turn in the area takes 1d6…  
  **Icon brief** (Bleach — Barragan's Respira): A black miasma spilling outward from a central point, everything it touches turning old and withering.
- **Ryūsenka** · _spell_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  Hail Flower Dragon. Make a Strike with your spirit weapon. On a hit it deals an additional 1d6[cold] damage, and the target must succeed at a Fortitude save or be immobilized in ice until the end of its next turn (Escape against your Reiatsu DC). On a critical hit the ice shatters: the target instead takes an additional 2d6 cold and is off-guard until the end of its next turn. Heightened (+2) The…  
  **Icon brief** (Bleach — Hitsugaya's Ryūsenka): A sword's tip piercing a target, an ice flower blooming instantly at the point of impact.
- **Senbonzakura** · _spell_ · `modules/isaacs-hb-pf2e/icons/leaf-petals-pink.svg`  
  Byakuya Kuchiki's Release Technique. Each creature in the emanation takes 2d6[slashing] damage with a basic Reflex save. The area is difficult terrain for enemies until the start of your next turn. Heightened (+1) The damage increases by 1d6. Refined (9th) The emanation increases to 20 feet , and creatures that critically fail are off-guard until the start of your next turn.  
  **Icon brief** (Bleach — Byakuya's Senbonzakura): A blade dissolving into thousands of tiny pink cherry-blossom petals, each one a razor, swirling in a vortex.
- **Sennen Hyōrō** · _spell_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-swirl-blue.svg`  
  Thousand-Year Ice Prison. Cost one petal-flower. Four walls of ice erupt in a 20-foot burst within 60 feet and close inward. Each enemy in the area attempts a Reflex save. Failure 5d6[cold] damage and immobilized until the end of its next turn. Critical Failure As failure, but restrained for 1 minute instead (Escape against your Reiatsu DC). Heightened (+1) The damage increases by 1d6.  
  **Icon brief** (Bleach — Hitsugaya's Sennen Hyōrō): Four towering walls of ice erupting from the ground and slamming inward, trapping a target in the centre.
- **Shikake** · _spell_ · `modules/isaacs-hb-pf2e/icons/eye-ringed-glow-angry-purple.svg`  
  The Setup. One creature within 30 feet attempts a Will save. Failure The target treats one creature of your choice within its reach as if it were you, and treats you as an ally, until the end of its next turn. Critical Failure As failure, for 2 rounds. Refined (9th) The failure effect also makes the target off-guard to the misidentified creature. This is an illusion, a mental effect, and a visual…  
  **Icon brief** (Bleach — Aizen's Kyōka Suigetsu): A target's eyes reflecting the wrong figure, a faint ripple across the reflection like disturbed water.
- **Shitonegaeshi** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  Requirements Your spirit weapon is Released · Cost 1 Reiatsu Point Cushion Overturn. Make a Strike dealing an additional 1d6[untyped] damage; on a hit, you may Step as a free action, and the target can't Step until the end of its next turn. Heightened (+2) +1d6.  
  **Icon brief** (Bleach — Zanjutsu: Shitonegaeshi): A stepping foot and a sword cut, the floor rolling over beneath an opponent's feet like a flipped cushion, unbalancing them.
- **Shūkei: Hakuteiken** · _spell_ · `modules/isaacs-hb-pf2e/icons/sword-guard-white.svg`  
  Cost nothing · Requirements You are in Severance Endscape: White Imperial Sword. Every blade condenses into a single white sword; wings and a vertical halo open behind you. One creature within reach. Make a Strike; on a hit it takes the Waning dice as slashing damage. This ignores all resistances and immunities . On a hit the target can't regain Hit Points, and its regeneration and fast healing…  
  **Icon brief** (Bleach — Byakuya's Shūkei: Hakuteiken): All the cherry-blossom petals condensing into a single brilliant white sword, wings and a vertical halo of light spreading behind it.
- **Sōkotsu** · _spell_ · `modules/isaacs-hb-pf2e/icons/blade-tips-triple-blue.svg`  
  Requirements Your spirit weapon is Released · Cost 1 Reiatsu Point Double Bone. Make two Strikes against one creature; the second doesn't increase your multiple attack penalty. On a hit each deals an additional 1d6[untyped] damage. Heightened (+2) +1d6.  
  **Icon brief** (Bleach — Kenpachi's Sōkotsu): Two fists striking side by side, two overlapping bone-white shockwave rings bursting from one point.
- **Sprenger** · _spell_ · `icons/magic/light/explosion-star-glow-blue.webp`  
  Cost nothing · Requirements You are in Severance Five Seele Schneider planted in a pentacle, and the Gintō poured over them. 20-foot burst within 60 feet, basic Reflex, force damage. Creatures that critically fail are restrained by lines of light for 1 minute (Escape against your Reiatsu DC). Canon's fifth and largest Gintō, and the reason Uryū's Vollständig does not carry it. Waning. The damage…  
  **Icon brief** (Bleach — Quincy Sprenger): Five Seele Schneider blades planted in the ground in a pentacle, glowing lines of light connecting them as the Gintō is poured.
- **The Balance — Reaction** · _spell_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  Trigger You take damage from a creature or effect you can perceive. You redistribute the harm. Reduce the damage you take by twice your level , then choose one enemy within 60 feet: it takes 2d6[spirit] damage, and until the end of its next turn it takes a −1 status penalty to saving throws . Heightened (+2) The damage increases by 1d6. Refined (9th) The status penalty applies to AC and saving…  
  **Icon brief** (Bleach — Haschwalth's The Balance): A golden scale tipping as damage is redistributed, a glowing thread of light flowing from one pan into a distant enemy.
- **The Miracle — Growth** · _spell_ · `icons/magic/holy/angel-winged-humanoid-blue.webp`  
  Trigger You take damage from an enemy · Frequency once per round Damage is a promise of growth. Gain 2 Miracle points (to a maximum of 10). While you have 1 or more Miracle points you gain resistance to all damage equal to the number of Miracle points you have . You may spend any number of Miracle points as a free action at the start of your turn; for each point spent, until the end of your turn…  
  **Icon brief** (Bleach — Gerard Valkyrie's The Miracle): A golden aura flaring brighter as damage is taken, glowing points of light counting upward.
- **The Reckoning** · _spell_ · `modules/isaacs-hb-pf2e/icons/heater-crystal-white.svg`  
  Cost nothing · Requirements You are in Severance Every misfortune you have held back for other people, handed to one person at once. One creature within 60 feet , basic Fortitude, spirit damage. This ignores all resistances and immunities . The target is doomed 1 . If you have used your Release Technique at least three times this encounter, it is doomed 2 instead. ⚠ Extrapolated — the…  
  **Icon brief** (Bleach — Haschwalth's The Balance (homebrew finisher)): A heavy dark weight of every held misfortune falling onto a single target, a golden scale cracking under the strain.
- **Trident** · _spell_ · `modules/isaacs-hb-pf2e/icons/trident-blue.svg`  
  Frequency once per round You infuse the blade and fire a high-force slash in a series of three. Make three ranged Strikes with your spirit weapon against one creature within 60 feet, each at your current multiple attack penalty; the penalty does not increase until all three are made .  
  **Icon brief** (Bleach — Harribel's Trident): Three high-pressure water slashes fired in quick succession from a sword's edge, forming a trident shape.
- **Zanhyō Ningyō** · _spell_ · `modules/isaacs-hb-pf2e/icons/snowflake-ice-swirl-blue.svg`  
  Remnant Ice Doll. Cost one petal-flower. Trigger You are hit by an attack. A doll of ice takes the blow. Reduce the damage by an amount equal to twice your level ; the doll shatters.  
  **Icon brief** (Bleach — Hitsugaya's Zanhyō Ningyō): A translucent ice doll shattering into fragments as a strike hits it, sparing the real figure.
- **Zanjutsu: Kendō** · _spell_ · `icons/skills/melee/blade-tips-triple-steel.webp`  
  Requirements Your spirit weapon is Released · Cost 1 Reiatsu Point Make one Strike. Before rolling , choose: it ignores all resistances and immunities to its damage type, or it treats the target's AC as 2 lower . On a hit, it deals an additional 5d6[untyped] damage. Heightened (+1) +1d6. The AC clause is capped at −2 so it cannot combine with flanking and a status penalty to erase a boss's…  
  **Icon brief** (Bleach — Kendō): A precise katana thrust passing straight through a glowing armour glyph that shatters, the blade's edge brilliant white.

## The Assimilator

### assimilator-bonds (30)

- **Adamant Shell** · _effect_ · `icons/magic/defensive/armor-green-hex.webp`  
  Diamond + Steel. Your Hardness bonuses stack fully rather than taking the higher, and you cannot be off-guard from flanking. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A carapace plate of clear diamond facets fused over grey steel scales, the two layers interlocking like a vault door; faint white sparkle where they bond, a blade glancing off.
- **Ascension** · _effect_ · `icons/magic/air/weather-wind-gust.webp`  
  Platinum + Aluminium. Your fly Speed increases by 20 feet and you may hover. Falling is something that happens to other people. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A pale platinum-and-silver membrane wing unfurling from a ridged chitin back, hovering weightless above a drop, tiny motes drifting downward beneath while the wing stays still.
- **Blackfire** · _effect_ · `icons/magic/unholy/projectile-flame-white-purple.webp`  
  Ruby + Onyx. Your fire damage becomes void and fire , and sheds darkness rather than light. When it kills a creature, you regain Hit Points equal to your level. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A clawed carapace hand wreathed in black flame that drinks light instead of shedding it, a ruby glowing red at its core inside an onyx shell, dark smoke curling.
- **Blind Hunter** · _effect_ · `icons/magic/perception/eye-ringed-glow-angry-large-red.webp`  
  Tin + Onyx. Inside your own magical darkness, your tremorsense becomes precise and enemies within it are off-guard to you. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A pool of inky darkness with ripples spreading across the ground like tremors, a tin-grey chitin limb pressed to the floor, a faint outline of hidden prey picked out in pale lines.
- **Chimera** · _effect_ · `icons/creatures/magical/construct-face-stone-pink.webp`  
  Electrum + Nickel. You hold one additional Aberration, and it may be drawn from the Depth-4 rider list of either of your Instincts. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A lump of mismatched growths — a claw, an eye, a fin — budding from one electrum-and-nickel streaked chitin mass, iridescent and unsettling.
- **Chitin Bloom** · _effect_ · `icons/magic/nature/leaf-armor-scale-green.webp`  
  Emerald + Chromium. Your fast healing also repairs your Carapace, and your Hardness increases by your fast healing value. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): Cracked chitin plates knitting themselves shut as green emerald tissue blooms through the seams like flowers, chrome-bright edges hardening behind the growth.
- **Cleansing Light** · _effect_ · `icons/magic/holy/prayer-hands-glowing-yellow-green.webp`  
  Pearl + Magnesium. Your Flare Core also ends one condition of value 1 on every ally inside the emanation. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A pearl-white sphere of light bursting from a ribbed organ, its soft glow washing over several figures and lifting dark wisps of affliction off them.
- **Cold Reading** · _effect_ · `icons/magic/water/snowflake-ice-blue-white.webp`  
  Sapphire + Lapis Lazuli. Your Studied creature is also slowed 1 the first time you damage it each round, with no save. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A deep-blue sapphire eye set in chitin, lapis veins radiating from it, frost spreading across a targeted silhouette whose motion has slowed into blurred afterimages.
- **Conduction** · _effect_ · `icons/magic/lightning/bolt-beam-strike-blue.webp`  
  Ruby + Copper. Your fire damage counts as fire and electricity , using whichever resistance is lower. Creatures in metal armour take +2 per damage die from it. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A copper-veined fist striking a breastplate, fire and electricity braided around the knuckles, sparks crawling over the metal armour.
- **Crowned Fortune** · _effect_ · `icons/commodities/currency/coin-embossed-crown-gold.webp`  
  Topaz + Citrine. Once per encounter, declare a Strike imperial before rolling. On a success it counts as a critical success. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A carapace fist topped with a small crown of topaz and citrine spikes, a golden coin-flash bursting at the moment of impact.
- **Exsanguinary** · _effect_ · `icons/skills/wounds/blood-cells-disease-green.webp`  
  Garnet + Jet. Persistent bleed you inflict also heals you for the same amount each time it ticks. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): Ribbons of blood flowing from a bleeding wound back along a jet-black tendril into a garnet-red pulsing gland.
- **Hammerform** · _effect_ · `icons/weapons/hammers/hammer-double-engraved-gold.webp`  
  Bronze + Iron. Your unarmed Strikes gain the fatal d10 trait when you have Stridden at least 10 feet this turn. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A carapace arm swelling into a massive bronze-and-iron hammerhead, motion streaks trailing behind it as it charges forward to strike.
- **Immune System** · _effect_ · `icons/magic/life/cross-area-circle-green-white.webp`  
  Jade + Zinc. Shifting Tissue may name poison, disease or a single spell school as well as an energy type. Ruled (#95): disease is a +2 circumstance bonus to saves against disease ; a spell school is one tradition — arcane, divine, occult or primal. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A jade-green chitin cell wall with zinc-grey antibody-like spines, engulfing and dissolving floating green spores and a faint spell glyph.
- **Impossible Body** · _effect_ · `icons/magic/water/projectile-ice-teardrop.webp`  
  Diamond + Mercury. You are simultaneously rigid and fluid: keep your Hardness while amorphous, and Liquid Form's reaction has no per-round limit. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A diamond-faceted plate that ripples like liquid mercury, half rigid crystal and half flowing silver in one shape.
- **Lightning Lash** · _effect_ · `icons/magic/lightning/bolt-forked-blue-yellow.webp`  
  Copper + Cobalt. Your ranged Arcane Channel Strike conducts: it chains to a second creature within 15 feet of the first for half damage. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A blue cobalt bolt fired from a copper-veined palm, striking one target and arcing on to a second, the jump drawn as a forked branch of lightning.
- **Living Armour** · _effect_ · `icons/magic/defensive/armor-shield-barrier-steel.webp`  
  Hematite + Moonstone. Reactive Evolution triggers off damage taken by an ally within 15 feet as well as yourself. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): Hematite-red plates sprouting from a carapace and reaching outward to shield an ally standing nearby, moonstone sheen rippling across them as they adapt.
- **Living Flame** · _effect_ · `icons/magic/life/heart-area-circle-red-green.webp`  
  Ruby + Emerald. While you are taking persistent fire damage, or dealing it to anyone, your fast healing increases by 5. You burn what you are, and it grows back. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A burning chitin limb whose charred tissue is regrowing red-and-green at the same rate it chars, flames and new buds side by side.
- **Mindstorm** · _effect_ · `icons/magic/control/hypnosis-mesmerism-eye-tan.webp`  
  Amethyst + Quartz. A creature that fails a save against one of your Mutations is stupefied 1 and its next spell requires a DC 5 flat check. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A purple amethyst nodule cracking open into a whirl of quartz shards circling a skull-like silhouette, sparks of broken spell-light scattering.
- **Molten Carapace** · _effect_ · `icons/magic/fire/barrier-shield-explosion-yellow.webp`  
  Ruby + Iron. Your Carapace's Hardness increases by 5, and a creature that hits you with a melee unarmed or reach attack takes fire damage equal to half your level. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A thick iron-black carapace with lines of glowing molten ruby-red running through its cracks, a striking fist recoiling in a burst of embers.
- **Null Shroud** · _effect_ · `icons/magic/unholy/barrier-shield-glowing-pink.webp`  
  Onyx + Lead. Your magical darkness suppresses magical effects inside it (counteract rank = half your level) and cannot itself be counteracted below 6th rank. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A dense dome of lead-grey darkness swallowing floating spell glyphs, the runes dimming and breaking apart as they cross into it.
- **Quicksilver Gait** · _effect_ · `icons/magic/movement/trail-streak-impact-blue.webp`  
  Carnelian + Mercury. You may Stride through creatures' spaces as though they were difficult terrain, and cannot be caught flat-footed by movement-triggered reactions. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A silvery liquid leg flowing between two silhouettes as though they were water, carnelian-orange streaks marking the path.
- **Reaper's Edge** · _effect_ · `icons/magic/death/weapon-scythe-rune-green.webp`  
  Silver + Jet. Your void damage ignores the resistances and immunities of incorporeal undead entirely. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A silver-and-jet chitin blade cutting cleanly through a translucent ghost, the spectre splitting where it should have passed through.
- **Rime Flow** · _effect_ · `icons/magic/water/barrier-ice-crystal-wall-faceted-blue.webp`  
  Sapphire + Mercury. Your Liquid Form damage reduction also freezes the attacker: it takes cold damage equal to the amount reduced. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A blow sinking into liquid-mercury flesh that turns to sapphire ice around the attacker's fist, frost climbing up the striking arm.
- **Rot** · _effect_ · `icons/magic/acid/dissolve-arm-flesh.webp`  
  Jet + Manganese. Persistent acid you inflict also reduces the target's resistances by an additional 5 while it lasts. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): Dark acid seeping from jet-black claws into a creature's hide, the surface pitting and flaking, manganese-purple corrosion spreading outward.
- **Runaway Growth** · _effect_ · `icons/magic/nature/root-vine-barrier-wall-brown.webp`  
  Nickel + Emerald. Your Aberrations re-roll automatically whenever you drop below half Hit Points, and doing so restores Hit Points equal to twice your level. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): Chaotic tumour-like growths erupting across a wounded carapace, nickel-grey and emerald-green, a heart-red glow of healing at the centre.
- **Second Heart** · _effect_ · `icons/magic/life/heart-broken-red.webp`  
  Garnet + Emerald. Once per day, when you would die, you don't — you drop to 1 Hit Point and are stunned 1 as the second heart takes over. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): Two hearts side by side inside a translucent ribcage of chitin, one stopped and grey, the other garnet-red and just starting to beat.
- **Siege Frame** · _effect_ · `icons/weapons/hammers/hammer-double-bronze.webp`  
  Iron + Steel. You ignore an object's Hardness up to 10, and forced movement you cause increases by an additional 10 feet. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): An oversized iron-and-steel chitin ram punching through a stone wall, bricks flying back far further than a normal blow would throw them.
- **Solar Core** · _effect_ · `icons/magic/light/beam-explosion-orange.webp`  
  Ruby + Gold. Once per encounter as a two-action activity, ignite: for 1 minute your fire damage increases by one die size and you shed bright light 60 feet. You take 1d6 fire at the start of each of your turns. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A ruby sphere ringed in gold set into a chitin chest, igniting into a small blazing sun with a corona of flame.
- **Storm Battery** · _effect_ · `icons/magic/lightning/barrier-shield-crackling-orb-pink.webp`  
  Amber + Cobalt. Your Reservoir stores charges from your own ranged Strikes, and spending 3 charges lets Arcane Channel target every creature in a 15-foot cone. Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): An amber cell-sac filled with crackling cobalt lightning, three charge-sparks orbiting it, ready to discharge.
- **Transmutation** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  Gold + Electrum. Gilded Core may name a Substrate of your second Instinct, and Alloyed Instinct's half-value clause becomes three-quarters (round up). Suppressed while either Substrate is below Depth 2; it is not lost.  
  **Icon brief** (Assimilator — Bond): A gold nugget flowing into a pale electrum ingot on a living organic lattice, the metals blending where they touch, alchemical swirl of yellow-white light.

### assimilator-class (1)

- **Assimilator** · _class_ · `icons/creatures/claws/claw-talons-glowing-orange.webp`  
  Something alive is wearing you, and it grows by eating. Not by levelling — by eating . Feed it a ruby and it learns to burn. Feed it iron and the limbs get heavier and longer. Feed it nickel and you do not know what you will have on Tuesday, and neither does it. Your build is not a list of choices made at character creation. It is a stomach , and its contents are visible on you. Key attribute…  
  **Icon brief** (Assimilator — Class): A human arm overgrown by a living black-green carapace: ridged chitin plates, fine tendrils, glowing veins, a cut ruby and an iron shard being drawn into the flesh at the wrist.

### assimilator-class-features (59)

#### Actions

- **Carapace Block** · _feat_ · `icons/equipment/shield/buckler-wooden-boss-glowing-blue.webp`  
  Trigger You take physical damage. Reduce the damage by your Carapace's Hardness. The Carapace takes that much damage. Use it when the damage is rolled, before it is applied: it arms the plate for the next physical damage you take this round, and the block is taken off that damage as it lands.  
  **Icon brief** (Assimilator — Action): A raised chitin forearm-plate taking a sword blow head-on, cracks spidering across the plate while the arm behind stays whole.
- **Feed** · _feat_ · `icons/consumables/food/dried-meat-jerky-fish-red.webp`  
  Activity (10 minutes) Consume one Substrate you are holding. If you already hold it, its Depth increases by 1 ; otherwise it enters your Lattice at Depth 1 . Either way it costs Mass equal to its new Depth, and the physical Substrate is destroyed. Using it opens the Gullet, where the Substrate and the specimen are chosen and the Mass is checked.  
  **Icon brief** (Assimilator — Action): A gaping toothed maw opening in a carapace palm, swallowing a glittering gemstone, veins lighting up as it is absorbed.
- **Manifest the Apotheosis** · _feat_ · `icons/magic/light/explosion-star-large-orange.webp`  
  Frequency once per day Every bound Substrate manifests at your Depth cap for 1 minute, regardless of the Mass you actually paid.  
  **Icon brief** (Assimilator — Action): Every gem and metal fused into the carapace blazing at once, a crown of crystal and metal spikes erupting outward in a single brilliant flare.
- **Purify** · _action_ · `icons/magic/holy/prayer-hands-glowing-yellow-white.webp`  
  White Instinct. End one condition on yourself or an ally. A number of times per day equal to your highest Depth. Target the ally first; with no target it is you.  
  **Icon brief** (Assimilator — Action): A white-glowing chitin hand drawing black tendrils of a condition out of an ally's chest, the dark strands burning away to light.
- **Shed** · _feat_ · `icons/consumables/food/shank-meat-bone-glazed-red.webp`  
  During your daily preparations only. Remove any Substrate, or reduce any Substrate's Depth, freeing that Mass. What you shed is destroyed, not recovered. Using it opens the Gullet, where the Substrate and the specimen are chosen and the Mass is checked.  
  **Icon brief** (Assimilator — Action): A husk of old chitin peeling away from a limb like a snake's moulted skin, a crumbling gem falling from it as dust.
- **Study** · _action_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  Blue Instinct. You Study a creature. Until the encounter ends, your Mutations treat its resistances as lower by twice your highest Depth, and you gain a +1 circumstance bonus to AC against it. One creature at a time: Studying another ends the first.  
  **Icon brief** (Assimilator — Action): A blue compound eye opening in carapace, scanning lines tracing a creature's outline and highlighting its weak points.
#### Bonds

- **Ignite the Solar Core** · _action_ · `icons/magic/fire/explosion-fireball-large-orange.webp`  
  Solar Core (Ruby + Gold). Once per encounter, ignite: for 1 minute your fire damage increases by one die size and you shed bright light 60 feet. You take 1d6 fire at the start of each of your turns.  
  **Icon brief** (Assimilator — Action): The moment of ignition: a ruby-and-gold chest core bursting into white-hot light, flames licking back over the carapace that holds it.
- **Imperial Strike** · _action_ · `icons/commodities/currency/coin-embossed-crown-gold.webp`  
  Crowned Fortune (Topaz + Citrine). Once per encounter, declare your next Strike imperial before rolling. On a success it counts as a critical success.  
  **Icon brief** (Assimilator — Action): A carapace fist striking with a golden crown-shaped flare at the point of impact, the hit landing as a starburst of topaz light.
- **Storm Channel** · _action_ · `icons/magic/lightning/bolt-forked-large-orange.webp`  
  Storm Battery (Amber + Cobalt). Spend 3 charges from your Reservoir: make your Arcane Channel Strike against every creature in a 15-foot cone.  
  **Icon brief** (Assimilator — Action): A cone of cobalt lightning fanning out from an outstretched chitin palm, three spent charge-sparks fading at the wrist.
#### Core

- **Alien Physiology** · _feat_ · `icons/creatures/abilities/tail-swipe-green.webp`  
  You are no longer entirely a person. You need neither food, drink nor air, and you are immune to disease . You are immune to the drained condition , and to any effect that would alter your physical form against your will (petrification, polymorph, and the like) — the symbiont is already using that space. To accept a polymorph willingly, switch on Accept a transformation before it lands; switching…  
  **Icon brief** (Assimilator — Class feature): A closed chitin chrysalis-like body with no mouth or nostrils, gills sealed shut, indifferent veins glowing faintly — a thing that needs nothing.
- **Apotheosis** · _feat_ · `icons/magic/light/explosion-star-large-orange.webp`  
  The host and the thing stop being two things. Your Mass increases by 3 in each track. Once per day, as a free action , every bound Substrate manifests at your Depth cap for 1 minute, regardless of the Mass you actually paid. Your Carapace can no longer be broken by physical damage alone; only an effect that would destroy an object outright can do it.  
  **Icon brief** (Assimilator — Class feature): Host and symbiont merged into one shape: a carapace silhouette with no seam left between flesh and plate, gems and metals studded across it glowing in unison.
- **Assimilation** · _feat_ · `icons/magic/life/heart-cross-strong-flame-green.webp`  
  You gain Mass in two separate pools — 1 Gem Mass and 1 Metal Mass at 1st level — and the two activities that manage them, Feed and Shed . A Substrate at Depth N costs N Mass , and your Depth cap is 1. Depth 1–2 takes an ordinary specimen — a looted ruby, a copper ingot, a pearl off a necklace. Depth 3–4 takes a quickened specimen , one that grew somewhere the mundane world doesn't reach; those…  
  **Icon brief** (Assimilator — Class feature): Two glowing reservoirs inside a carapace — one faceted red-violet for gems, one ridged grey for metals — with a small gem and a metal shard dropping into each.
- **Assimilation Expertise** · _feat_ · `icons/magic/life/heart-cross-strong-flame-green.webp`  
  Your proficiency rank for your Assimilator DC increases to expert.  
  **Icon brief** (Assimilator — Class feature): A gem half-sunk into living chitin, three tendrils wrapping it with practised precision, a single bronze-coloured ring of light around it.
- **Assimilation Mastery** · _feat_ · `icons/magic/life/heart-cross-strong-flame-green.webp`  
  Your proficiency rank for your Assimilator DC increases to master.  
  **Icon brief** (Assimilator — Class feature): A gem almost fully absorbed into living chitin, intricate tendrils threaded through every facet, a silver-gold double ring of light around it.
- **Carapace Expertise** · _feat_ · `icons/creatures/claws/claw-talons-glowing-orange.webp`  
  The plate has learned where to hit. Your proficiency rank for unarmed attacks increases to expert.  
  **Icon brief** (Assimilator — Class feature): A chitin fist striking a precise point on a target, a crosshair of veins on the knuckle, one ring of bronze light.
- **Carapace Mastery** · _feat_ · `icons/creatures/claws/claw-talons-glowing-orange.webp`  
  Your proficiency rank for unarmed attacks increases to master.  
  **Icon brief** (Assimilator — Class feature): A chitin fist with blade-like ridges, its blow landing in a perfect radial crack, a double ring of gold light around it.
- **Fifth Bond** · _feat_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  You gain a fifth Bond slot, and your Gem Mass and Metal Mass each increase by 2.  
  **Icon brief** (Assimilator — Class feature): Five interlocking rings of fused gem and metal set in a pentagon on a carapace back, all five glowing.
- **First Bond** · _feat_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  You gain your first Bond slot . A Bond requires both its Substrates at Depth 2 or higher; you choose it when you gain the slot and may change it at daily preparations.  
  **Icon brief** (Assimilator — Class feature): One gem and one metal shard joined by a living tendril knot into a single glowing ring on chitin.
- **Fourth Bond** · _feat_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  You gain a fourth Bond slot.  
  **Icon brief** (Assimilator — Class feature): Four interlocking gem-and-metal rings set in a square on chitin, the fourth newly formed and brightest.
- **Fourth Skin** · _feat_ · `icons/creatures/abilities/fang-tooth-blood-red.webp`  
  Your Depth cap becomes 4. Your Gem Mass increases by 2 and your Metal Mass by 1.  
  **Icon brief** (Assimilator — Class feature): Four nested layers of chitin peeled back in a cross-section like tree rings, the deepest layer glowing hottest.
- **Growth (14th)** · _feat_ · `icons/creatures/abilities/fang-tooth-blood-red.webp`  
  Your Gem Mass and Metal Mass each increase by 2.  
  **Icon brief** (Assimilator — Class feature): Both Mass reservoirs, gem and metal, swelling and overflowing with new crystal and ore, veins bulging around them.
- **Growth (3rd)** · _feat_ · `icons/creatures/abilities/fang-tooth-blood-red.webp`  
  Your Gem Mass increases by 1.  
  **Icon brief** (Assimilator — Class feature): A single faceted gem reservoir inside the carapace swelling larger, a new crystal budding off its side.
- **Instinct** · _feat_ · `icons/magic/perception/eye-ringed-glow-angry-red.webp`  
  Your Instinct is the colour you have invested the most total Mass in, counting both tracks. It grants that colour's Instinct clause , which applies to every Mutation you have , including Mutations of other colours. Ties are broken by you, freely, at daily preparations. Instinct is recalculated at daily preparations and costs nothing to change. It also sets your Instinct's damage type : Red fire,…  
  **Icon brief** (Assimilator — Class feature): A colour wheel of gem hues set into chitin, one wedge glowing brightest and its colour spreading out through the veins.
- **Living Weapon** · _feat_ · `icons/creatures/claws/claw-talons-glowing-orange.webp`  
  You gain the critical specialization effect of the brawling group for your unarmed attacks.  
  **Icon brief** (Assimilator — Class feature): A carapace fist whose knuckles sprout thorns, a target knocked prone and dazed by the blow, stars of impact around it.
- **Second Bond** · _feat_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  You gain a second Bond slot, and your Gem Mass and Metal Mass each increase by 2.  
  **Icon brief** (Assimilator — Class feature): Two interlocking gem-and-metal rings bound together on a chitin plate, a living tendril weaving between them.
- **Second Skin** · _feat_ · `icons/creatures/abilities/fang-tooth-blood-red.webp`  
  Your Depth cap becomes 2, and your Gem Mass and Metal Mass each increase by 1.  
  **Icon brief** (Assimilator — Class feature): Two nested layers of chitin shown in cross-section, the inner one glowing, a new harder shell forming over the old.
- **Shell Mastery** · _feat_ · `icons/equipment/chest/breastplate-layered-leather-brown.webp`  
  Your proficiency rank for unarmored defense increases to master.  
  **Icon brief** (Assimilator — Class feature): A domed chitin shell curling around a body like an armadillo, arrows and blades bouncing off its overlapping plates.
- **Symbiotic Reflex** · _feat_ · `icons/magic/defensive/shield-barrier-flaming-diamond-red.webp`  
  Frequency once per round; Trigger A creature you can see damages you. Choose one — (a) gain resistance equal to twice your highest Depth against that damage, or (b) if the triggering creature is within your reach, make a Carapace Strike against it. It does not stack with Carapace Block against the same damage. Target the creature that damaged you and use it as the damage is rolled. It asks which:…  
  **Icon brief** (Assimilator — Class feature): A carapace that reacts on its own: a tendril-tipped spike lashing out from the shoulder to strike back at an attacker, or plates flaring to absorb the hit.
- **The Carapace** · _feat_ · `icons/creatures/claws/claw-talons-glowing-orange.webp`  
  Something alive is wearing you. It is your weapon, your armour, and the thing that breaks. Carapace Strike. Your unarmed attack is the class. It deals 1d8 bludgeoning damage, is in the brawling group, and has only the unarmed trait — it is not agile and it is not finesse. Handwraps of mighty blows work normally; the class grants no free fundamental runes. Living Plate. The symbiont is your armour…  
  **Icon brief** (Assimilator — Class feature): A heavy, living chitin gauntlet-arm: ridged black-green plates, glowing veins, a cracked edge — weapon, armour and the thing that breaks.
- **Third Bond** · _feat_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  You gain a third Bond slot.  
  **Icon brief** (Assimilator — Class feature): Three interlocking gem-and-metal rings in a triangle on a chitin plate, the third newly fused and glowing.
- **Third Skin** · _feat_ · `icons/creatures/abilities/fang-tooth-blood-red.webp`  
  Your Depth cap becomes 3. Your Gem Mass increases by 2 and your Metal Mass by 1.  
  **Icon brief** (Assimilator — Class feature): Three nested chitin layers in cross-section, rings like geological strata, the innermest layer pulsing with gem-light.
#### Mutations

- **Aberrant Gland** · _action_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  Frequency once per encounter A 15-foot cone dealing 2d6 damage of your Instinct's type, basic Reflex save against your class DC.  
  **Icon brief** (Assimilator — Mutation): A bulbous gland swelling on a chitin shoulder, spraying a wide cone of glowing energy in the Instinct's colour.
- **Amorphous** · _action_ · `icons/consumables/potions/vial-ornet-silver-black.webp`  
  You become amorphous for 1 minute: immune to precision damage, and critical hits against you deal normal damage.  
  **Icon brief** (Assimilator — Mutation): A body slumping into a shapeless, rubbery chitin mass, a dagger point sinking in harmlessly with no vital spot to find.
- **Ascendant Flight** · _action_ · `icons/commodities/metal/ingot-silver.webp`  
  Gain a fly Speed equal to half your land Speed for 1 minute.  
  **Icon brief** (Assimilator — Mutation): A pair of translucent insect-like wings bursting from a chitin back mid-beat, lifting the body off the ground.
- **Carrion Harvest** · _action_ · `icons/commodities/gems/gem-faceted-cushion-teal-black.webp`  
  A creature within 30 feet at or below half its Hit Points must succeed at a Fortitude save against your class DC or take void damage equal to twice your level .  
  **Icon brief** (Assimilator — Mutation): Black tendrils reaching from a carapace hand across the ground to a wounded, half-bloodied creature, drawing a dark void-mist out of it.
- **Cleansing Tide** · _action_ · `icons/commodities/gems/pearl-white-oval.webp`  
  Frequency once per encounter (twice at Pearl Depth 4) End one condition of value 1 on yourself or an adjacent ally. At Depth 3 the range is 30 feet and it may instead reduce one affliction's stage by 1; at Depth 4 it may instead counteract one spell effect of 4th rank or lower.  
  **Icon brief** (Assimilator — Mutation): A gentle wave of pearl-white water rolling off a chitin palm over an ally, washing a grey affliction-stain from their skin.
- **Clear Tide** · _action_ · `icons/commodities/gems/pearl-white-oval.webp`  
  Reduce the value of one of your conditions by 1.  
  **Icon brief** (Assimilator — Mutation): A small clear ripple spreading across one's own carapace, a dark condition-mark fading by a notch.
- **Discharge** · _action_ · `icons/commodities/gems/gem-rough-square-yellow.webp`  
  Cost 3 Reservoir charges A 30-foot line of 6d6 damage of the stored type, basic Reflex save against your class DC.  
  **Icon brief** (Assimilator — Mutation): A straight 30-foot line of stored energy blasting from a chitin palm, three charge-sparks emptying into the beam.
- **Draw on the Reservoir** · _action_ · `icons/commodities/gems/gem-rough-square-yellow.webp`  
  Spend 1 Reservoir charge: your next Strike deals +1d4 of the stored type. At Amber Depth 2, if you have 2 charges, spend 2 instead for +1d6 + 2 .  
  **Icon brief** (Assimilator — Mutation): A single charge-spark flowing from an amber sac down the arm into a chitin fist, crackling around the knuckles before the punch.
- **Exsanguinate** · _action_ · `icons/commodities/gems/gem-rough-cushion-red.webp`  
  Drain a dying creature within 30 feet: it dies, and you regain Hit Points equal to your level.  
  **Icon brief** (Assimilator — Mutation): A dying creature's last red life-thread pulled across the air into an open chitin maw in the palm.
- **Flare** · _action_ · `icons/magic/light/explosion-star-glow-silhouette.webp`  
  Frequency once per encounter Creatures in a 15-foot emanation must succeed at a Fortitude save against your class DC or be dazzled for 1 round. At Magnesium Depth 3 a failure is blinded instead, and the flare deals fire damage equal to your level to creatures with light sensitivity or light blindness. At Depth 4 the emanation is 30 feet and counteracts magical darkness; once per day it may…  
  **Icon brief** (Assimilator — Mutation): A burst of blinding white-magnesium light erupting from a ribbed chest organ, rays spreading in a ring.
- **Forked Channel** · _action_ · `icons/magic/lightning/bolt-forked-blue.webp`  
  Cobalt, Depth 4. Arcane Channel targets two creatures within 120 feet: one Strike at each. Choose up to two targets and use it; the Channel is rolled at each, at the same multiple attack penalty.  
  **Icon brief** (Assimilator — Mutation): A blue cobalt bolt splitting in two mid-flight from a chitin palm, each fork reaching a different distant target.
- **Frame Rush** · _action_ · `icons/skills/melee/unarmed-punch-fist.webp`  
  Bronze, Depth 3. Make a Strike and then a Shove, Trip or Grapple, as a single action. Target a creature and use it: the Carapace Strike is rolled against it, then a card asks which of the three follows, at the next step of your multiple attack penalty.  
  **Icon brief** (Assimilator — Mutation): A bronze-heavy chitin arm landing a punch and then hooking the target in the same motion, two motion arcs flowing into one.
- **Gilded Apotheosis** · _action_ · `icons/commodities/metal/ingot-gold.webp`  
  One Substrate chosen for your Gilded Core manifests at Depth 4 for 1 minute, regardless of its real Depth.  
  **Icon brief** (Assimilator — Mutation): One embedded gem in a carapace blazing gold, ringed by four concentric depth-circles all lit at once.
- **Gilded Chance** · _action_ · `icons/commodities/gems/gem-faceted-rough-yellow.webp`  
  Trigger You fail a check. Reroll the check and take the second result. At Citrine Depth 2 you may do this twice per day, and the reroll gains a +2 circumstance bonus . Using it rerolls your most recent failed check for you, keeping the new result, with the +2 added at Depth 2.  
  **Icon brief** (Assimilator — Mutation): A golden d20 tumbling back up into the air for a second roll, citrine sparkles trailing behind it.
- **Healing Flare** · _action_ · `icons/magic/light/explosion-star-glow-yellow.webp`  
  Magnesium Depth 4. Once per day your Flare instead heals each ally in a 30-foot emanation for Hit Points equal to your level.  
  **Icon brief** (Assimilator — Mutation): A warm white-and-green flare bursting from a chest organ, petals of light falling onto allies' wounds and closing them.
- **Hollow Flight** · _action_ · `icons/commodities/metal/ingot-silver.webp`  
  Fly 30 feet.  
  **Icon brief** (Assimilator — Mutation): A light, hollow-boned chitin frame leaping into the air on short stubby wings, a quick flight arc behind it.
- **Lay Bare** · _action_ · `icons/magic/perception/eye-slit-orange.webp`  
  Lapis Lazuli, Depth 4. Once per encounter, name a creature's strongest save ; for 1 minute your Mutations target its weakest instead. Target the creature and use it: its saves are read off its sheet, and your Mutations' saves that call for the strongest roll the weakest.  
  **Icon brief** (Assimilator — Mutation): A deep-blue lapis eye peeling back a creature's armoured shell to reveal a soft glowing weak spot beneath.
- **Null Field** · _action_ · `icons/commodities/metal/ingot-worn-steel.webp`  
  Frequency once per encounter Suppress magical effects in a 15-foot emanation for 1 round: attempt to counteract each, counteract rank equal to half your level.  
  **Icon brief** (Assimilator — Mutation): A ring of dull grey energy spreading out from a carapace, spell glyphs inside it flickering and going dark.
- **Pass Through** · _action_ · `icons/consumables/potions/vial-ornet-silver-black.webp`  
  Trigger You are hit. Reduce the damage by your level as the blow passes through you. Use it as the damage is rolled; it is taken off that damage as it lands. With Carapace Block or Symbiotic Reflex also armed, only the largest applies.  
  **Icon brief** (Assimilator — Mutation): A sword blade passing through a body that ripples like water, the edge emerging on the other side with only a trace of harm.
- **Prism Counteract** · _action_ · `icons/commodities/gems/gem-faceted-diamond-pink.webp`  
  Counteract one magical effect: counteract rank equal to half your level, counteract modifier equal to your class DC − 10. Twice per day at Quartz Depth 4.  
  **Icon brief** (Assimilator — Mutation): A crystal prism grown from a chitin palm splitting an incoming spell beam into harmless rainbow strands.
- **Prism Reflection** · _action_ · `icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp`  
  Quartz, Depth 4. Trigger A spell targets only you. Reflect it back at its caster; a Will save against your class DC negates. Target the caster and use it: the caster rolls Will against your class DC and the card says reflected or negated. Carrying the spell to the caster — its damage card, its conditions — is the table's.  
  **Icon brief** (Assimilator — Mutation): A faceted quartz shield on a carapace bouncing a spell bolt straight back the way it came, the reflected beam tinted rainbow.
- **Reactive Evolution** · _action_ · `icons/commodities/gems/gem-faceted-round-white.webp`  
  Trigger You take damage of a type. Gain resistance to that type — 2 for 1 minute at Moonstone Depth 1 (once per encounter), 5 at Depth 2 (twice per encounter), 8 until the encounter ends at Depth 3 (two types at once), 12 at Depth 4 (unlimited, three types at once).  
  **Icon brief** (Assimilator — Mutation): Moonstone-sheened plates rapidly reshaping where a fire burst struck them, new heat-resistant scales growing in that blast's colour.
- **Reading Eye** · _action_ · `icons/commodities/gems/gem-rough-cushion-blue.webp`  
  Recall Knowledge about a creature you can see.  
  **Icon brief** (Assimilator — Mutation): A single slit-pupilled eye opening in the back of a chitin hand, studying a creature's outline with faint knowledge-runes around it.
- **Shadow Mantle** · _action_ · `icons/commodities/gems/gem-faceted-round-black.webp`  
  Create a 20-foot emanation of magical darkness for 1 minute. You see through it normally.  
  **Icon brief** (Assimilator — Mutation): A cloak of living darkness pouring off a carapace and spreading in a circle, a pair of faint glowing eyes visible within.
- **Shadow Step** · _action_ · `icons/commodities/gems/gem-faceted-round-black.webp`  
  Teleport from an area of darkness to another area of darkness within 60 feet. Use it, then click the destination: both squares must be in darkness — a dark scene, or inside a darkness such as Shadow Mantle's — and within 60 feet.  
  **Icon brief** (Assimilator — Mutation): A body sinking into one pool of shadow and rising from another across the ground, a dark trail linking the two.
- **Shift Tissue** · _action_ · `icons/commodities/metal/ingot-steel.webp`  
  Change the energy type Shifting Tissue resists. Using this opens the Gullet with the change allowed.  
  **Icon brief** (Assimilator — Mutation): A patch of chitin flowing from red to blue to green like a chameleon, swapping which energy it resists.
- **Turn of Fortune** · _action_ · `icons/commodities/gems/gem-faceted-rough-yellow.webp`  
  Trigger A d20 roll is made within 30 feet, and you see the result. Change that roll by 5 in either direction — yours, an ally's, or an enemy's.  
  **Icon brief** (Assimilator — Mutation): A tumbling d20 nudged mid-roll by a thin chitin tendril, its face turning to show a different number.
#### The Carapace

- **Living Plate** · _armor_ · `icons/equipment/chest/breastplate-layered-leather-brown.webp`  
  The symbiont is your armour and cannot be removed. It functions as explorer's clothing that is alive : AC item bonus +0, Dex cap +5, no check penalty, no Speed penalty, no Bulk. It accepts armour potency, resilient and property runes, etched by feeding rather than by a smith. You cannot wear other armour. Attempting it suppresses Living Plate, every Mutation, and your Instinct until you take it…  
  **Icon brief** (Assimilator — Class feature): A suit of thin, supple living chitin hugging the body like clothes, plates breathing slightly, rune-etchings grown into the surface rather than carved.

### assimilator-effects (58)

- **Aberration: A Gland** · _effect_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  Once per encounter, a 15-foot cone dealing 2d6 of your Instinct's type, basic Reflex.  
  **Icon brief** (Assimilator — Effect): A swollen, throbbing gland bulging on the neck or shoulder, glowing faintly in the Instinct's colour, ready to spray.
- **Aberration: A Limb** · _effect_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  An additional unarmed Strike, agile, 1d6 of a physical type.  
  **Icon brief** (Assimilator — Effect): An extra thin chitin arm sprouting from the ribs, quick and clawed, poised to strike.
- **Aberration: A Maw** · _effect_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  Your jaws gain the deadly d8 trait.  
  **Icon brief** (Assimilator — Effect): A wide jaw lined with long hooked teeth grown into a carapace, gums glistening.
- **Aberration: A Mode** · _effect_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  A climb Speed equal to half your land Speed.  
  **Icon brief** (Assimilator — Effect): Hooked climbing claws and suction pads growing from chitin hands and feet, clinging to a sheer wall.
- **Aberration: A Plate** · _effect_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  Hardness +3 and a −5-foot Speed penalty.  
  **Icon brief** (Assimilator — Effect): A heavy, thick slab of chitin plate grown over a shoulder, dragging the body down with its weight.
- **Aberration: An Organ** · _effect_ · `icons/magic/unholy/strike-body-explode-disintegrate.webp`  
  One sense: darkvision.  
  **Icon brief** (Assimilator — Effect): A glowing extra eye with a dark-adapted pupil growing on a carapace brow, seeing clearly through gloom.
- **Effect: Amorphous** · _effect_ · `icons/consumables/potions/vial-ornet-silver-black.webp`  
  Immune to precision damage; critical hits against you deal normal damage.  
  **Icon brief** (Assimilator — Effect): A soft, blobby outline with no clear joints or vital spots, a pointed weapon slipping off harmlessly.
- **Effect: Apotheosis** · _effect_ · `icons/magic/light/explosion-star-large-orange.webp`  
  Every bound Substrate manifests at your Depth cap, regardless of the Mass you actually paid.  
  **Icon brief** (Assimilator — Effect): A carapace studded with every gem and metal, all blazing at full intensity, a crown of crystal spikes radiating light.
- **Effect: Argent-Bound** · _effect_ · `icons/magic/control/debuff-chains-ropes-purple.webp`  
  Silver, Depth 4. Critically hit by an Assimilator's Argent Edge: this creature cannot use reactions or innate spells until the end of its next turn.  
  **Icon brief** (Assimilator — Effect): A creature's limbs bound in shimmering silver threads, frozen mid-reaction, its innate magic sputtering out.
- **Effect: Ascendant Flight** · _effect_ · `icons/commodities/metal/ingot-silver.webp`  
  A fly Speed equal to half your land Speed.  
  **Icon brief** (Assimilator — Effect): Translucent insect wings buzzing on a carapace back, the body hovering a little above the ground.
- **Effect: Carapace Block** · _effect_ · `icons/equipment/shield/buckler-wooden-boss-glowing-blue.webp`  
  The plate is set. The next physical damage you take is reduced by your Carapace's Hardness, and the Carapace takes that much damage. Spent when it lands.  
  **Icon brief** (Assimilator — Effect): A chitin plate set forward and braced, a faint shield-glow on its surface, waiting for the next blow.
- **Effect: Carapace Broken** · _effect_ · `icons/equipment/chest/breastplate-layered-leather-brown.webp`  
  The Carapace is broken. You lose Living Plate's rune benefits, and every Mutation at Depth 3 or higher is switched off until the Carapace is repaired — with the Repair activity against its own Hardness, or one hour of Feeding it any Substrate you don't bind. Put on and taken off by the module as the plate's Hit Points cross its Broken Threshold.  
  **Icon brief** (Assimilator — Effect): A shattered chitin plate split down the middle, fragments falling away, dim veins underneath with their glow switched off.
- **Effect: Carrion-Marked** · _effect_ · `icons/magic/death/skull-horned-worn-fire-blue.webp`  
  Jet, Depth 3. Killed by an Assimilator's Carrion Bloom: this creature cannot be returned to life by magic below 6th rank .  
  **Icon brief** (Assimilator — Effect): A corpse marked with a black fungal bloom, jet tendrils rooting it to the ground, a broken halo above refusing resurrection.
- **Effect: Cold Reading** · _effect_ · `icons/magic/water/snowflake-ice-blue.webp`  
  Slowed 1 by Cold Reading until the end of its next turn.  
  **Icon brief** (Assimilator — Effect): A creature dusted in blue frost, its movements leaving slow, smeared afterimages.
- **Effect: Conductive Charge (Electricity)** · _effect_ · `icons/commodities/metal/ingot-copper.webp`  
  Your next Strike before the end of your next turn deals +1d4 electricity .  
  **Icon brief** (Assimilator — Effect): A carapace fist crackling with blue-white sparks, an electric charge coiled around the knuckles.
- **Effect: Conductive Charge (Fire)** · _effect_ · `icons/commodities/metal/ingot-copper.webp`  
  Your next Strike before the end of your next turn deals +1d4 fire .  
  **Icon brief** (Assimilator — Effect): A carapace fist with small orange flames licking around the knuckles, ready to land a burning punch.
- **Effect: Corroded** · _effect_ · `icons/magic/acid/dissolve-bone-white.webp`  
  Rot Touch has pitted this creature: all its resistances are lower by the amount named, against anyone's damage, until the end of its next turn.  
  **Icon brief** (Assimilator — Effect): A creature's hide pitted and bubbling with acid, armour flaking off in green-brown patches.
- **Effect: Depth 4 for This Strike** · _effect_ · `icons/magic/light/explosion-star-glow-yellow.webp`  
  A critical hit. The Substrates named here count as Depth 4 for this Strike — its damage and whatever answers it landing — whether or not they are at Depth 4. Gold's Instinct, Topaz at Depth 4 and Apex Predator make it. It ends when your next attack is rolled, or at the end of your turn. Not while the Carapace is broken, which switches every Mutation at Depth 3 or higher off.  
  **Icon brief** (Assimilator — Effect): A critical-hit starburst where a carapace fist lands, four concentric depth-rings flashing around the impact.
- **Effect: Devour** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  Temporary Hit Points from what you ate, for 1 minute.  
  **Icon brief** (Assimilator — Effect): A full, swollen gut-sac glowing in a carapace belly, a translucent shimmer of borrowed temporary life around the body.
- **Effect: Gilded Apotheosis** · _effect_ · `icons/commodities/metal/ingot-gold.webp`  
  The first Substrate chosen for your Gilded Core manifests at Depth 4.  
  **Icon brief** (Assimilator — Effect): A single gem in the carapace shining like molten gold, its glow far brighter than its size.
- **Effect: Glacial Chill** · _effect_ · `icons/commodities/gems/gem-faceted-radiant-blue.webp`  
  This creature's Speeds are reduced by 5 feet until the end of its next turn.  
  **Icon brief** (Assimilator — Effect): Frost creeping over a creature's legs and feet, ice crystals clinging to them, its stride shortened.
- **Effect: Hunted in Darkness** · _effect_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  Inside a Blind Hunter's magical darkness: off-guard to that Assimilator.  
  **Icon brief** (Assimilator — Effect): A creature lost in pitch darkness looking the wrong way, a faint shape of a hunter's claw looming behind it.
- **Effect: Imperial** · _effect_ · `icons/commodities/currency/coin-embossed-crown-gold.webp`  
  Your next Strike is imperial: on a success it counts as a critical success.  
  **Icon brief** (Assimilator — Effect): A small golden crown hovering over a carapace fist, a glint of guaranteed triumph on the knuckles.
- **Effect: Instinctive Surge** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  Until the end of your turn, your Instinct clause treats every Substrate as one Depth higher.  
  **Icon brief** (Assimilator — Effect): Every gem set in the carapace flaring one step brighter at once, the dominant colour surging through the veins.
- **Effect: Integrated Plating** · _effect_ · `icons/magic/defensive/shield-barrier-blue.webp`  
  Gray Instinct. You used a Mutation: resistance equal to its Depth to all physical damage until the start of your next turn.  
  **Icon brief** (Assimilator — Effect): Grey interlocking plates sliding together over a carapace after a Mutation fires, a dull iron sheen of resistance.
- **Effect: Kinetic Surge** · _effect_ · `icons/magic/lightning/bolt-forked-orange.webp`  
  Orange Instinct. You moved or reacted: your next Mutation this round deals +1d4 of its own damage type.  
  **Icon brief** (Assimilator — Effect): Orange motion-streaks trailing off a moving carapace, kinetic energy pooling as a bright ember in the palm.
- **Effect: Knitting Surge** · _effect_ · `icons/commodities/gems/gem-cut-square-green.webp`  
  Knitting Flesh refused to let you fall: fast healing 15 for 1 minute.  
  **Icon brief** (Assimilator — Effect): Torn flesh pulling itself shut in a rush: pale green seams zipping closed across a wound, glowing green threads stitching faster than the eye can follow, droplets of light rising.
- **Effect: Laid Bare** · _effect_ · `icons/magic/perception/eye-slit-orange.webp`  
  Lapis Lazuli, Depth 4. An Assimilator named this creature's strongest save: for 1 minute, that Assimilator's Mutations target its weakest instead.  
  **Icon brief** (Assimilator — Effect): A creature's silhouette with a deep-blue lapis lens over it; its brightest shield-sigil cracked and dimmed, while a small weak point glows exposed, targeted by thin blue lines.
- **Effect: Lapis Insight** · _effect_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  Lapis Lazuli, Depth 2. An allied Assimilator has read this creature: +1 circumstance to attacks against it, for 1 round.  
  **Icon brief** (Assimilator — Effect): A ring of small dark lenses all focused on one target, a blue crosshair of light settling over it, lapis-blue sparks marking where to strike.
- **Effect: Mindstorm** · _effect_ · `icons/magic/control/hypnosis-mesmerism-swirl.webp`  
  Stupefied 1 by Mindstorm until the end of its next turn. Its next spell requires a DC 5 flat check.  
  **Icon brief** (Assimilator — Effect): A head-shaped silhouette wrapped in a swirling violet thundercloud, little psychic lightning forks crackling inside, a spell glyph fizzling and breaking apart at the edge.
- **Effect: Null Weight** · _effect_ · `icons/commodities/metal/ingot-worn-steel.webp`  
  A −1 status penalty to this creature's next save.  
  **Icon brief** (Assimilator — Effect): A single heavy grey lead weight hanging from a creature's shoulders, a protective rune beneath it pressed flat and dim.
- **Effect: Null Weight Aura** · _effect_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  Lead, Depth 3. Within 10 feet of an Assimilator's Null Weight: −1 status to spell attack rolls and spell DCs .  
  **Icon brief** (Assimilator — Effect): A dull lead-grey ring spreading on the ground around a carapaced figure, floating spell runes inside it sagging and dimming as if pulled down by weight.
- **Effect: Pass Through** · _effect_ · `icons/consumables/potions/vial-ornet-silver-black.webp`  
  The next damage from a creature is reduced by your level. Spent when it lands.  
  **Icon brief** (Assimilator — Effect): A blade passing through a section of translucent, jelly-like carapace that parts around it and closes behind, the blow's force fading into ripples.
- **Effect: Plated Guard** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  +2 circumstance bonus to AC until the start of your next turn. You cannot use Carapace Block.  
  **Icon brief** (Assimilator — Effect): Chitin plates swelling and overlapping into a thick bulging shield over a forearm, ridged and dark, a blow sparking off the surface.
- **Effect: Quartz Charge** · _effect_ · `icons/magic/light/beam-rays-magenta.webp`  
  Quartz, Depth 3. You counteracted an effect, or a spell failed against you: your next Strike deals +2d6 force .  
  **Icon brief** (Assimilator — Effect): A clear quartz prism growing from a knuckle, crackling with stored white-violet force, light refracting into a sharp beam ready to discharge.
- **Effect: Reach of the Thing** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  Your next Carapace Strike this turn has reach 10 feet (the reach trait).  
  **Icon brief** (Assimilator — Effect): A carapaced arm with a sudden extra length of jointed chitin unfolding from the elbow, the fist now reaching twice as far, segments still sliding into place.
- **Effect: Reactive Evolution** · _effect_ · `icons/commodities/gems/gem-faceted-round-white.webp`  
  Resistance to the damage type you chose, by your Moonstone's Depth.  
  **Icon brief** (Assimilator — Effect): A pale moonstone sheen sliding across armoured plates to the side just struck, the plating there hardening in that element's colour.
- **Effect: Reservoir Primed** · _effect_ · `icons/commodities/gems/gem-rough-square-yellow.webp`  
  Your next Strike carries the Reservoir's stored energy.  
  **Icon brief** (Assimilator — Effect): A translucent amber sac at the sternum full to bursting, the stored energy pouring down a vein into a clenched fist that glows orange.
- **Effect: Second Hunger** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  Two borrowed Mass deepen a bound Substrate for 1 minute; then it returns to its real Depth.  
  **Icon brief** (Assimilator — Effect): A glowing gem embedded in flesh swelling larger, borrowed light flowing into it from two small floating orbs, an hourglass faint behind it.
- **Effect: Shadow Mantle** · _effect_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  A 20-foot emanation of magical darkness surrounds you for 1 minute. You see through it normally.  
  **Icon brief** (Assimilator — Effect): An expanding sphere of inky black darkness with a carapaced silhouette at its core, edges impossible to locate, one pair of faint eyes seeing through.
- **Effect: Siphoned** · _effect_ · `icons/magic/unholy/orb-hands-pink.webp`  
  A Black Instinct Mutation drank from this creature: a status penalty to one check or DC until the end of its next turn.  
  **Icon brief** (Assimilator — Effect): A creature's glowing aura being drawn out in a thin black stream toward a dark mouth-like orifice, its colour fading where the stream leaves.
- **Effect: Siphoning** · _effect_ · `icons/magic/unholy/orb-hands-pink.webp`  
  You took what the Black Instinct drank: a status bonus to the same check or DC.  
  **Icon brief** (Assimilator — Effect): A dark onyx-black carapace node swollen with stolen light, a thin stream flowing in, the plate glowing faintly with the borrowed strength.
- **Effect: Solar Core** · _effect_ · `icons/magic/fire/explosion-fireball-large-orange.webp`  
  Your fire damage increases by one die size and you shed bright light 60 feet. You take 1d6 fire at the start of each of your turns.  
  **Icon brief** (Assimilator — Effect): A blazing miniature sun burning in the chest of a carapace, cracks of white-orange fire spreading outward, light pouring off in rays and scorching the plates.
- **Effect: Studied** · _effect_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  An Assimilator has Studied this creature: its Mutations treat this creature's resistances as lower, and it has a circumstance bonus to AC against this creature, until the encounter ends.  
  **Icon brief** (Assimilator — Effect): A creature marked by a blue lens and annotated with faint glowing lines over its armour seams, its resistance-shield sigil thinning.
- **Effect: Studied Guard** · _effect_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  +1 circumstance bonus to AC against the creature you Studied (Blue Instinct).  
  **Icon brief** (Assimilator — Effect): A blue lens-eye over a raised chitin forearm guard, the guard angled exactly into the path of one enemy's strike.
- **Effect: Symbiotic Reflex** · _effect_ · `icons/magic/defensive/shield-barrier-flaming-diamond-red.webp`  
  The thing that is wearing you has opinions about being hit. The next damage you take is reduced by twice your highest Depth. Spent when it lands.  
  **Icon brief** (Assimilator — Effect): Carapace plates snapping shut over a body on their own as a blow arrives, small reflexive spikes bristling, a hit absorbed into the plating.
- **Effect: Taste for It** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  Your next Recall Knowledge about the creature you damaged is a free action with a +2 circumstance bonus.  
  **Icon brief** (Assimilator — Effect): A forked tendril-tongue tasting a drop of an enemy's blood, a glowing question-mark glyph of knowledge rising from the taste.
- **Effect: Wall of Me** · _effect_ · `icons/magic/symbols/chevron-elipse-circle-blue.webp`  
  Your wall of Carapace stands for 1 minute or until destroyed; your own Carapace's Hardness is 2 lower while it does.  
  **Icon brief** (Assimilator — Effect): A ridged wall of living chitin standing in a line, veined and breathing, a trail of carapace still connecting it to a thinned-out armoured figure.
- **Effect: Worn No Longer** · _effect_ · `icons/creatures/abilities/mouth-teeth-long-red.webp`  
  The Carapace is away for 1 minute. You are unarmoured, unmutated, and a person again.  
  **Icon brief** (Assimilator — Effect): An empty carapace shell standing apart and walking away, a pale unarmoured human silhouette left behind, a severed tendril between them.
- **Instinct: Black** · _effect_ · `icons/magic/unholy/orb-hands-pink.webp`  
  Consume / Corrupt. When a Mutation damages a creature, it takes a −1 status penalty to one check or DC of your choice until the end of its next turn, and you gain +1 status to the same thing . At Depth 3+ the penalty and bonus become −2 / +2 . Your Instinct's damage type is void. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): A black symbiont maw draining a ribbon of colour from one target into itself, a downward and upward arrow pair, void-black and dull violet.
- **Instinct: Blue** · _effect_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  Adapt / Understand. Study a creature (one action). Until the encounter ends, your Mutations treat its resistances as lower by twice your highest Depth , and you gain +1 circumstance to AC against it. One creature at a time. Your Instinct's damage type is cold. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): A single huge blue compound eye set in chitin, scanning a target through concentric rings of light, cold-blue and thoughtful.
- **Instinct: Gold** · _effect_ · `icons/magic/light/explosion-star-glow-yellow.webp`  
  Amplify / Dominate. At daily preparations choose one bound Substrate; it counts as one Depth higher , never above your Depth cap. When you critically hit, that Substrate counts as Depth 4 for that Strike even if it isn't at Depth 4. Your Instinct's damage type is force. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): A carapace crowned with a glowing golden gem, smaller gems around it brightening one step at a time, gilded light.
- **Instinct: Gray** · _effect_ · `icons/magic/defensive/shield-barrier-blue.webp`  
  Harden / Integrate. Your Carapace's Hardness increases by the total Depth of your bound metals . When you use a Mutation, gain resistance equal to its Depth to all physical damage until the start of your next turn. Your Instinct's damage type is bludgeoning. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): Iron-grey carapace plates bolting themselves together in heavy layers, metal veins merging into the shell, rivet-like nodes.
- **Instinct: Green** · _effect_ · `icons/magic/nature/leaf-glow-green.webp`  
  Grow / Reproduce. When a Mutation deals damage, gain temporary Hit Points equal to its Depth . Fast healing equal to the number of bound Green Substrates. Your Instinct's damage type is poison. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): Green chitin sprouting new buds of living tissue, poison-green droplets on the tips, a spiral of growth unfolding outward.
- **Instinct: Orange** · _effect_ · `icons/magic/lightning/bolt-forked-orange.webp`  
  Move / React. The first time each round you Stride, Step or use a reaction, your next Mutation this round deals +1d4 of its own damage type. +5 feet Speed per bound Orange Substrate. Your Instinct's damage type is electricity. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): A carapaced leg mid-stride trailing orange sparks of electricity, the motion charging a crackling node in the next limb.
- **Instinct: Purple** · _effect_ · `icons/magic/symbols/runes-star-magenta.webp`  
  Mutate / Transcend. Your Mutations count as magical . At daily preparations one Substrate of your choice manifests one Depth higher , and one other, randomly determined, manifests one Depth lower . Your Instinct's damage type is mental. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): Violet carapace mutating mid-change: spines, eyes and fins shimmering in and out, iridescent purple-magenta light.
- **Instinct: Red** · _effect_ · `icons/magic/fire/flame-burning-hand-orange.webp`  
  Consume / Destroy. When a Mutation deals damage, it deals +1 damage per Depth of its Substrate. Against a creature that has already lost Hit Points this encounter, double that bonus. Your Instinct's damage type is fire. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): A red chitin claw tearing into a wound, flames bursting from the cut, a hungry red glow pulsing from the veins.
- **Instinct: White** · _effect_ · `icons/magic/holy/prayer-hands-glowing-yellow-white.webp`  
  Preserve / Purify. When a Mutation deals damage, one ally within 30 feet gains temporary Hit Points equal to its Depth . A number of times per day equal to your highest Depth , end one condition on yourself or an ally as a free action. Your Instinct's damage type is vitality. Under Electrum Depth 3 this clause may be a second one, at half value.  
  **Icon brief** (Assimilator — Instinct): A pale white carapace hand radiating clean light to a nearby ally, small chains of a condition snapping apart in the glow.

### assimilator-feats (45)

- **Additional Bond** · _feat_ · `icons/magic/symbols/arrowhead-green.webp`  
  Prerequisite: at least one Bond. You gain one additional Bond slot .  
  **Icon brief** (Assimilator — Feat): Three Substrate gems linked by glowing veins in a triangle, a fourth socket opening in the flesh beside them.
- **Apex Growth** · _feat_ · `icons/creatures/claws/claw-talons-glowing-orange.webp`  
  Your Carapace Strike and Talons each gain one additional damage die .  
  **Icon brief** (Assimilator — Feat): A carapace fist and a talon hand both growing an extra row of serrated ridges, damage glyphs doubling on each.
- **Apex Predator** · _feat_ · `icons/creatures/abilities/fang-tooth-blood-red.webp`  
  When you critically hit with a Mutation, that Substrate counts as Depth 4 for that Strike , whether or not it is at Depth 4. Does not stack with Gold's Instinct clause — take the better.  
  **Icon brief** (Assimilator — Feat): A predatory chitin jaw closing on prey at the moment of a critical hit, a gem in its brow flaring to maximum brightness.
- **Assimilate** · _feat_ · `icons/magic/life/cross-worn-green.webp`  
  Once per day, ◆◆◆ (10 minutes, over the remains of a creature of your level or lower) : gain one of its resistances, senses, or movement modes until your next daily preparations. Not its spells and not its Strikes.  
  **Icon brief** (Assimilator — Feat): A carapaced hand pressed onto the remains of a slain creature, a ribbon of the creature's essence — scales, eyes or wings — drawn up the arm into the plating.
- **Barbed Growth** · _feat_ · `icons/magic/nature/root-vine-entwined-thorns.webp`  
  A creature that critically fails a melee Strike against you takes damage equal to twice your highest Depth , of your Instinct's damage type.  
  **Icon brief** (Assimilator — Feat): Chitin covered in backward-pointing barbs, an enemy's sword shattering on them, the barbs dripping the Instinct's coloured energy.
- **Bonded Deep** · _feat_ · `icons/magic/symbols/runes-carved-stone-green.webp`  
  One Bond you know functions with its Substrates at Depth 1 instead of Depth 2.  
  **Icon brief** (Assimilator — Feat): Two Substrate gems joined by a short, thick glowing vein that runs deep under the flesh, small but already bonded.
- **Burrower** · _feat_ · `icons/magic/earth/barrier-lava-stone-orange.webp`  
  Prerequisite: a metal Substrate at Depth 2 or higher. You gain a burrow Speed of 15 feet through earth, sand and loose stone.  
  **Icon brief** (Assimilator — Feat): Carapace-plated claws boring into earth, soil and stone flying, a tunnel spiral behind them, metallic grey sheen on the digging edges.
- **Chimeric Frame** · _feat_ · `icons/creatures/magical/construct-gargoyle-stone-gray.webp`  
  You gain two of Nickel's Aberrations without binding Nickel, re-rolled or re-chosen at each daily preparations.  
  **Icon brief** (Assimilator — Feat): A carapace sprouting two mismatched aberrant parts at once — an extra eye and a fin, or a second arm — each flickering with nickel-silver light.
- **Consume the Fallen** · _feat_ · `icons/magic/death/projectile-skull-animal-green.webp`  
  ◆◆◆ (1 minute, over a corpse) : gain temporary Hit Points equal to twice your level , and until your next daily preparations one bound Substrate counts as one Depth higher (never above your cap). Once per day.  
  **Icon brief** (Assimilator — Feat): A dark maw of chitin opening over a corpse, the body dissolving into motes drawn in, a gem in the plate brightening as it feeds.
- **Deep Feeding** · _feat_ · `icons/consumables/food/shank-meat-bone-glazed-red.webp`  
  Once per day you may Feed as a 1-minute activity instead of 10 minutes. Useful exactly once per dungeon, and that once matters.  
  **Icon brief** (Assimilator — Feat): A symbiont mouth gulping a gem in one swallow, a tiny clock-face showing a single minute beside it.
- **Deep Vein** · _feat_ · `icons/commodities/gems/gem-faceted-rough-blue.webp`  
  Prerequisite: a Substrate at your Depth cap. One Substrate of your choice may exceed your Depth cap by 1 , to a maximum of Depth 4. You still pay its Mass.  
  **Icon brief** (Assimilator — Feat): A single gem burning past its socket's rim, its vein plunging far deeper into the flesh than the others, overflowing light.
- **Devour** · _feat_ · `icons/consumables/food/bowl-ribs-meat-rice-mash-brown-white.webp`  
  ◆ (Interact) Consume an object of light Bulk or less that you are holding. Gain temporary Hit Points equal to your level , lasting 1 minute. Once per 10 minutes. The object is gone; be careful whose it was.  
  **Icon brief** (Assimilator — Feat): A small object — a dagger or trinket — being swallowed whole by a mouth opening in a palm, a faint shield of temporary vitality rising.
- **Devouring Plate** · _feat_ · `icons/creatures/abilities/fangs-teeth-bite.webp`  
  When you reduce a creature to 0 Hit Points with a Carapace Strike, you may Feed on it as a free action: gain a temporary Substrate of any kind at Depth 2 until your next daily preparations, costing no Mass.  
  **Icon brief** (Assimilator — Feat): A carapace strike felling an enemy, the plate itself opening into a mouth that drinks the falling creature in, a new temporary gem forming.
- **Digest** · _feat_ · `icons/consumables/potions/bottle-bulb-corked-glowing-red.webp`  
  Once per day, ◆◆◆ (1 minute) : reduce the stage of one affliction affecting you by 2 . The symbiont did not consult you about this.  
  **Icon brief** (Assimilator — Feat): A disease-coloured green-grey sickness swirling inside a translucent stomach-sac, being dissolved into harmless bubbles by the symbiont.
- **Eat the World** · _feat_ · `icons/magic/unholy/orb-hands-pink.webp`  
  Once per day, ◆◆◆ (1 minute) : consume a magic item of level equal to or lower than your own. Until your next daily preparations you gain one of its abilities and 4 temporary Mass in either track. The item is destroyed and nobody is getting it back.  
  **Icon brief** (Assimilator — Feat): A glowing magic item — a wand or ring — cracking as a chitin maw devours it, its enchantment light streaming into the carapace.
- **Fifth Depth** · _feat_ · `icons/commodities/gems/gem-faceted-radiant-blue.webp`  
  One Substrate may reach Depth 5 , costing 5 Mass. Its Depth 4 rider applies twice where that is meaningful, and all of its numeric values increase by half again .  
  **Icon brief** (Assimilator — Feat): A gem embedded so deep that five concentric glowing rings surround it in the flesh, the outermost ring searing bright.
- **Grasping Plates** · _feat_ · `icons/creatures/claws/claw-bear-paw-swipe-brown.webp`  
  You grow a second Strike form. Talons — unarmed, 1d6 slashing , brawling group, traits agile, finesse, unarmed. You may use either it or your Carapace Strike freely.  
  **Icon brief** (Assimilator — Feat): A hand whose fingers have grown into long hooked chitin talons, sharp and agile, a fresh slash mark trailing behind.
- **Greater Bond** · _feat_ · `icons/magic/symbols/runes-star-blue.webp`  
  Choose one Bond you know. Its numeric values increase by half again , rounded up.  
  **Icon brief** (Assimilator — Feat): A Bond of linked gems whose connecting veins thicken and blaze half again as bright, the pattern enlarged.
- **Greater Mass Growth** · _feat_ · `icons/commodities/gems/gem-rough-cushion-blue.webp`  
  Your Gem Mass and Metal Mass each increase by 2 .  
  **Icon brief** (Assimilator — Feat): Two inner reservoirs — one of gem-light, one of molten metal — both swelling larger inside a carapaced torso.
- **Instinct Fusion** · _feat_ · `icons/magic/symbols/circle-ouroboros.webp`  
  Prerequisite: Two Instincts, or Electrum at Depth 3. Both of your Instinct clauses operate at full value . You are two organisms sharing a host and they do not always agree.  
  **Icon brief** (Assimilator — Feat): Two coloured symbiont instincts twisting together like a double helix inside one host, both at full brightness, faintly arguing in clashing colours.
- **Instinctive Surge** · _feat_ · `icons/magic/control/debuff-energy-hold-blue-yellow.webp`  
  Free action , once per encounter: until the end of your turn, your Instinct clause treats every Substrate as one Depth higher .  
  **Icon brief** (Assimilator — Feat): Every gem on a carapace flaring one step brighter at once, a shockwave of instinct-coloured light rippling over the plates.
- **Iron Gullet** · _feat_ · `icons/commodities/metal/ingot-iron.webp`  
  Your Metal Mass increases by 1 .  
  **Icon brief** (Assimilator — Feat): A heavy iron-lined gullet glowing dull red, metal shards sliding down it, space for one more.
- **Legendary Mass** · _feat_ · `icons/commodities/gems/gem-faceted-diamond-blue.webp`  
  Your Gem Mass and Metal Mass each increase by 3 .  
  **Icon brief** (Assimilator — Feat): A colossal inner reservoir of gems and metal spilling over, the carapace distended and radiant with stored material.
- **Living Fortress** · _feat_ · `icons/environment/settlement/tower-stone-blue.webp`  
  If you did not move on your last turn, your Carapace's Hardness doubles until you do.  
  **Icon brief** (Assimilator — Feat): A carapace rooted into the ground with chitin anchors, its plates doubled and fused into a fortress-like shell, blows ringing off it.
- **Mass Growth** · _feat_ · `icons/commodities/gems/gem-amber-insect-orange.webp`  
  Your Gem Mass and Metal Mass each increase by 1 .  
  **Icon brief** (Assimilator — Feat): A small gem pouch and a small metal pouch inside living tissue each swelling slightly, a pair of plus signs.
- **Omnivore** · _feat_ · `icons/consumables/food/berries-cream-bowl-mint-red.webp`  
  You have two Instincts at full value , and your Gem Mass and Metal Mass merge into a single pool of their combined size. Gems and metals no longer compete for separate space — the distinction stops meaning anything to you.  
  **Icon brief** (Assimilator — Feat): Gems and metals pouring together into one shared glowing maw, their separate colours mixing into a single swirl.
- **Perfect Adaptation** · _feat_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  You gain Moonstone's Reactive Evolution at Depth 2 without binding Moonstone. If you already hold Moonstone, treat it as one Depth higher for this Mutation only.  
  **Icon brief** (Assimilator — Feat): A moonstone-white carapace that changes colour wherever it is struck, every element washing off it harmlessly.
- **Perfect Organism** · _feat_ · `icons/magic/nature/tree-animated-smile.webp`  
  Every bound Substrate counts as being at your Depth cap , regardless of the Mass you actually paid for it. Mass now buys only breadth ; depth is free.  
  **Icon brief** (Assimilator — Feat): A complete carapace with every gem socket blazing at full depth, perfect symmetrical veining, an apex organism glow.
- **Plated Guard** · _feat_ · `icons/equipment/shield/heater-crystal-blue.webp`  
  ◆ You thicken. Gain a +2 circumstance bonus to AC until the start of your next turn. You cannot use Carapace Block while it lasts — the plate is busy.  
  **Icon brief** (Assimilator — Feat): Overlapping carapace plates thickening into a bulwark on the forearm, raised as a guard, the plates visibly layering.
- **Rampart** · _feat_ · `icons/equipment/shield/Scutum-steel-worn.webp`  
  Once per round, when an adjacent ally takes physical damage, they gain resistance equal to half your Carapace's Hardness (maximum 5) against it.  
  **Icon brief** (Assimilator — Feat): A carapace arm extending a shell over an adjacent ally, the blow meant for them glancing off the shared plate.
- **Reach of the Thing** · _feat_ · `icons/creatures/tentacles/tentacle-earth-green.webp`  
  Free action , once per round, before a Strike: that Carapace Strike gains reach 10 feet . Something extends that was not there a moment ago.  
  **Icon brief** (Assimilator — Feat): An arm of jointed chitin unfolding an extra segment mid-strike, the fist suddenly reaching across the gap.
- **Regurgitate** · _feat_ · `icons/magic/acid/dissolve-bone-ribs-skull.webp`  
  Free action , once per day: Shed one Substrate and immediately Feed a Substrate you are carrying, at Depth 1. The whole thing takes no time and is extremely unpleasant to watch.  
  **Icon brief** (Assimilator — Feat): A gem being spat out of a gaping maw while another gem slides in to replace it, in one grotesque motion.
- **Second Hunger** · _feat_ · `icons/creatures/abilities/mouth-teeth-crooked-blue.webp`  
  Free action , once per encounter: gain 2 Mass in one track for 1 minute, which you must spend immediately to deepen a bound Substrate. When it ends, that Substrate returns to its real Depth.  
  **Icon brief** (Assimilator — Feat): A ravenous second mouth opening on the carapace, gulping borrowed glowing mass, a gem swelling briefly.
- **Second Stomach** · _feat_ · `icons/consumables/food/berries-ration-round-red.webp`  
  Your Gem Mass increases by 1 .  
  **Icon brief** (Assimilator — Feat): A second translucent sac forming beside the first in a carapaced belly, small gems glittering inside.
- **Shared Symbiosis** · _feat_ · `icons/magic/life/heart-glowing-red.webp`  
  Once per day, ◆◆ (touch) : a willing ally gains one of your Mutations at Depth 1 for 10 minutes. They also gain a small piece of the thing's opinions.  
  **Icon brief** (Assimilator — Feat): A carapaced hand on an ally's shoulder, a small tendril of chitin creeping onto them and blooming into a tiny mutation.
- **Shed Skin** · _feat_ · `icons/commodities/leather/scale-chitin-grey.webp`  
  🜲 Reaction — Trigger: you gain a condition of value 2 or lower. Effect: end it. Your Carapace takes damage equal to five times the condition's value .  
  **Icon brief** (Assimilator — Feat): A sloughing layer of cracked carapace peeling away like a snakeskin, a condition's chains falling off with it.
- **Spit** · _feat_ · `icons/magic/acid/projectile-beams-salvo-green.webp`  
  ◆ A ranged unarmed Strike , range 20 feet, 1d6 damage of your Instinct's type. It uses your Carapace Strike's attack bonus and counts toward your multiple attack penalty.  
  **Icon brief** (Assimilator — Feat): A symbiont mouth spitting a glob of instinct-coloured fluid in an arc, splattering and sizzling on impact.
- **Sympathetic Growth** · _feat_ · `icons/magic/life/ankh-gold-blue.webp`  
  Once per day, ◆ (touch) : an ally gains one resistance you have, at half value , for 10 minutes. A piece of the thing goes with them, and it comes back.  
  **Icon brief** (Assimilator — Feat): A sprig of carapace growing from a fingertip onto an ally's arm, forming a small protective plate that pulses with the same colour.
- **Taste for It** · _feat_ · `icons/creatures/abilities/mouth-teeth-human.webp`  
  You can identify any Substrate by touch. When you deal damage to a creature, you may Recall Knowledge about it as a free action once per encounter, with a +2 circumstance bonus .  
  **Icon brief** (Assimilator — Feat): A tendril-tongue licking a gem, a faint label of identification glowing above it, a drop of an enemy's blood on the tip.
- **The Thing That Wears You** · _feat_ · `icons/creatures/abilities/mouth-teeth-long-red.webp`  
  Once per day, ◆◆◆: the Carapace separates for 1 minute. It acts on your initiative − 5 with your Strikes, your Mutations and your Assimilator DC, and it has your Hit Points as its own. While it is away you are unarmoured, unmutated, and a person again. You had forgotten.  
  **Icon brief** (Assimilator — Feat): An empty human shape stepping away from a hulking living carapace that now stands on its own, eyes lit, tendrils still linking them.
- **Total Assimilation** · _feat_ · `icons/magic/life/ankh-shadow-green.webp`  
  Prerequisite: Assimilate. One ability taken with Assimilate becomes permanent . You may replace it by using Assimilate on something better.  
  **Icon brief** (Assimilator — Feat): A trait taken from a fallen creature — a scale, eye or wing — fusing permanently into carapace plating, the seam sealing in glowing scar.
- **Twin Maw** · _feat_ · `icons/creatures/abilities/mouth-teeth-fire-orange.webp`  
  ◆◆ Make two Carapace Strikes against the same creature. Both count toward your multiple attack penalty as normal, and if both hit, combine their damage before applying resistance .  
  **Icon brief** (Assimilator — Feat): Two carapace fists striking one target together, their two impacts merging into a single combined burst.
- **Two Instincts** · _feat_ · `icons/magic/symbols/elements-air-earth-fire-water.webp`  
  You gain a second Instinct clause of your choice. Both operate at half value (round down, minimum 1). This does not stack with Electrum's Alloyed Instinct — take the better.  
  **Icon brief** (Assimilator — Feat): Two smaller coloured symbiont cores side by side in a carapace, each glowing at half strength.
- **Unbreakable Shell** · _feat_ · `icons/equipment/shield/heater-steel-engraved-lance-rest.webp`  
  Once per day, when your Carapace would be reduced below its Broken Threshold , it is instead reduced to exactly that threshold.  
  **Icon brief** (Assimilator — Feat): A carapace cracked right to the edge of shattering, a glowing line holding the fracture exactly at its limit.
- **Wall of Me** · _feat_ · `icons/environment/settlement/city-wall.webp`  
  ◆◆, once per encounter. Extrude a 10-foot line of Carapace in your space or adjacent to it. It provides standard cover , has Hardness equal to your level and Hit Points equal to five times your level , and lasts 1 minute or until destroyed. While it stands, your own Carapace's Hardness is reduced by 2.  
  **Icon brief** (Assimilator — Feat): A line of living chitin wall erupting from the ground beside a carapaced figure, ridged and veined, blocking an incoming arrow.

### assimilator-journals (1)

- **The Assimilator: Handbook** · _journal_ · `icons/sundries/books/book-embossed-roots-green.webp`  
  Something alive is wearing you, and it grows by eating . Feed it a ruby and it learns to burn; feed it iron and the limbs get heavier; feed it nickel and neither of you knows what you will have on Tuesday. Your build is not a list of choices made at creation. It is a stomach, and its contents are visible on you. Mechanically: 10 Hit Points per level, expert in all three saves, unarmoured expert,…  
  **Icon brief** (Assimilator — Handbook): A leather book whose cover is overgrown with living chitin and small embedded gems, a tendril curling out from between the pages.

### assimilator-macros (1)

- **Assimilator: Open the Gullet** · _script_ · `icons/consumables/food/dried-meat-jerky-fish-red.webp`  
  Macro:  
  **Icon brief** (Assimilator — Macro): A carapaced gullet opening like a flower, gems and metal ingots arranged around it ready to be fed in.

### assimilator-substrates (36)

#### Black

- **Substrate: Jet** · _effect_ · `icons/commodities/gems/gem-faceted-cushion-teal-black.webp`  
  Essence: Death &middot; Mutation: Carrion Bloom Fossilised organic matter — which is what the symbiont is doing to you, slowly. Depth 1 Your Strikes may deal void . +1 item bonus to saves against death effects. 2 +1d4 void. Gain 2 temporary Hit Points when you reduce a creature to 0 Hit Points. 3 +1d6 void. A creature you kill cannot be returned to life by magic below 6th rank. 4 +1d6 void. Once…  
  **Icon brief** (Assimilator — Substrate): A piece of black fossilised jet, with faint leaf-imprints of ancient organic life in it; a tendril creeping over it as death-grey void mist rises.
- **Substrate: Lead** · _effect_ · `icons/commodities/metal/ingot-worn-steel.webp`  
  Essence: Suppression &middot; Mutation: Null Weight Heavy, dull, and magic stops working properly in the room. This is the anti-magic Substrate. Depth 1 +1 circumstance bonus to saves against magic. Divinations of 3rd rank or lower cannot locate you. 2 Once per round, when a Mutation damages a creature, it takes −1 status to its next save . 3 Creatures within 10 feet take −1 status to spell…  
  **Icon brief** (Assimilator — Substrate): A dull grey lead ingot, heavy and matte; floating spell runes around it dimming and sinking toward it.
- **Substrate: Manganese** · _effect_ · `icons/commodities/metal/ingot-worn-steel.webp`  
  Essence: Corrosion &middot; Mutation: Rot Touch A dark violet-black bloom that leaves pitting on everything it has touched. Depth 1 Your Strikes deal 1 persistent acid on a critical hit. 2 A creature you damage has all its resistances reduced by 2 until the end of its next turn. 3 Reduced by 5 . Objects you Strike take a cumulative −1 item penalty (to a maximum of −3) until Repaired. 4 Reduced by…  
  **Icon brief** (Assimilator — Substrate): A dark violet-black manganese crystal bloom, its surface pitted and corroded, acid droplets etching the stone it rests on.
- **Substrate: Onyx** · _effect_ · `icons/commodities/gems/gem-faceted-round-black.webp`  
  Essence: Darkness &middot; Mutation: Shadow Mantle The plate stops returning light. Edges become genuinely hard to locate. Depth 1 Darkvision. +1 item bonus to Stealth in dim light or darkness. 2 Once per day, create a 20-foot emanation of magical darkness for 1 minute. You see through it normally. 3 In dim light or darkness you may Hide and Sneak without cover or concealment , and gain +1…  
  **Icon brief** (Assimilator — Substrate): A polished black onyx stone that seems to swallow light; a carapace plate beside it turning edge-less and lightless.
#### Blue

- **Substrate: Cobalt** · _effect_ · `icons/commodities/metal/ingot-teal.webp`  
  Essence: Energy / Conductivity &middot; Mutation: Arcane Channel A lash of blue-white energy that is not attached to anything and comes back anyway. Depth 1 You gain a 30-foot ranged unarmed Strike dealing 1d6 damage of your Instinct's type. 2 Range 60 feet ; damage 2d6 . 3 Your Mutations' energy damage counts as magical ; +1 circumstance bonus to counteract checks. 4 Range 120 feet ; damage 4d6…  
  **Icon brief** (Assimilator — Substrate): A deep-blue cobalt nugget crackling with a lash of blue-white energy that arcs away and loops back to it.
- **Substrate: Lapis Lazuli** · _effect_ · `icons/commodities/gems/gem-rough-cushion-blue.webp`  
  Essence: Knowledge &middot; Mutation: Reading Eye A ring of small dark lenses around the skull, which track independently. Depth 1 Once per round, Recall Knowledge about a creature you can see as a free action. 2 When you succeed at Recall Knowledge about a creature, allies gain +1 circumstance to attacks against it for 1 round. 3 You automatically learn one resistance, weakness or immunity of…  
  **Icon brief** (Assimilator — Substrate): A lapis lazuli stone flecked with gold, set in a ring of small dark lenses that each watch a different direction.
- **Substrate: Sapphire** · _effect_ · `icons/commodities/gems/gem-faceted-radiant-blue.webp`  
  Essence: Ice / Focus &middot; Mutation: Glacial Lattice Faceted blue growth along the spine and jaw; the breath fogs indoors. Depth 1 Your Strikes may deal cold . +1 item bonus to saves against effects that would break your concentration. 2 +1d4 cold. Critical hits reduce the target's Speeds by 5 feet until the end of its next turn. 3 +1d6 cold. Critical hits make the target slowed 1 until the…  
  **Icon brief** (Assimilator — Substrate): A faceted blue sapphire, frost forming on its edges, faint icy breath-fog curling around it.
- **Substrate: Tin** · _effect_ · `icons/commodities/metal/ingot-silver.webp`  
  Essence: Sensitivity &middot; Mutation: Sensory Bloom Fine hairs, pits and antennae across the plate. It is deeply unsettling to watch them move. Depth 1 Imprecise tremorsense 30 feet. 2 You detect the presence of magic within 30 feet as an imprecise sense . 3 Tremorsense 60 feet . Invisible creatures within 30 feet are concealed to you rather than undetected. 4 Precise tremorsense 30 feet. You…  
  **Icon brief** (Assimilator — Substrate): A tin ingot sprouting fine sensitive hairs and antennae that twitch and quiver, ripples of sensing spreading out.
#### Gold

- **Substrate: Citrine** · _effect_ · `icons/commodities/gems/gem-faceted-rough-yellow.webp`  
  Essence: Fortune &middot; Mutation: Gilded Chance A faint gold shimmer that arrives half a second before anything good happens. Depth 1 Once per day, reroll one failed check and take the second result. 2 Twice per day. The reroll gains a +2 circumstance bonus . 3 Once per encounter, when an enemy within 30 feet critically succeeds at a save against you, it gets a success instead. 4 Once per day,…  
  **Icon brief** (Assimilator — Substrate): A bright yellow citrine crystal with a gold shimmer flashing around it just before a falling coin lands lucky side up.
- **Substrate: Electrum** · _effect_ · `icons/commodities/metal/ingot-silver.webp`  
  Essence: Resonance &middot; Mutation: Alloyed Instinct Two metals that never fully mixed, and a symbiont that never fully decided. Depth 1 Choose a second colour. Electrum also counts as a Substrate of that colour for any effect that counts your bound Substrates of a colour; its Mass still counts toward Gold. 2 Electrum may stand in for either Substrate of any one Bond you know. 3 You gain your…  
  **Icon brief** (Assimilator — Substrate): An electrum nugget of two metals swirling but not fully mixed — pale gold and silver — two instinct colours flickering in it.
- **Substrate: Gold** · _effect_ · `icons/commodities/metal/ingot-gold.webp`  
  Essence: Amplification &middot; Mutation: Gilded Core Everything already there gets brighter and slower and more certain of itself. Depth 1 At daily preparations, choose one other bound Substrate. It counts as one Depth higher . This can never exceed your level's Depth cap. 2 You may choose the Substrate again at the start of each encounter, instead of only at daily preparations. 3 Choose two…  
  **Icon brief** (Assimilator — Substrate): A gold nugget glowing warm, every other gem placed near it brightening and swelling.
- **Substrate: Topaz** · _effect_ · `icons/commodities/gems/gem-rough-cushion-orange.webp`  
  Essence: Power &middot; Mutation: Regal Aspect The plate thickens into something ceremonial. It looks worn rather than grown. Depth 1 +1 item bonus to Intimidation. Your critical hits deal +2 damage . 2 Your unarmed Strikes gain the critical specialization effect of the brawling group. 3 A creature you critically hit is frightened 1 . 4 When you critically hit, one other bound Substrate counts as…  
  **Icon brief** (Assimilator — Substrate): A deep amber-orange topaz set like a royal jewel in ceremonial carapace plating, regal and heavy.
#### Gray

- **Substrate: Hematite** · _effect_ · `icons/commodities/gems/gem-fragments-rough-grey.webp`  
  Essence: Blood / Iron &middot; Mutation: Ferrous Blood Iron-grey, blood-red when scratched. The bridge between Red, Green and Gray. Depth 1 +1 item bonus to Athletics. You are immune to persistent bleed . 2 Gain temporary Hit Points equal to your level at the start of each encounter. 3 +2 status bonus to Fortitude saves. You cannot be drained . 4 Once per day, when you are reduced to 0 Hit…  
  **Icon brief** (Assimilator — Substrate): A metallic iron-grey hematite stone, a scratch across it bleeding blood-red streak.
- **Substrate: Moonstone** · _effect_ · `icons/commodities/gems/gem-faceted-round-white.webp`  
  Essence: Adaptation &middot; Mutation: Reactive Evolution Pale, and the sheen inside moves to whichever side was last struck. Depth 1 Once per encounter, as a reaction after taking damage of a type, gain resistance 2 to that type for 1 minute. 2 Resistance 5 , twice per encounter. 3 Resistance 8 , it lasts until the encounter ends, and you may hold two types at once. 4 Resistance 12 , unlimited…  
  **Icon brief** (Assimilator — Substrate): A pale moonstone with an inner blue sheen sliding to one side, as if toward where it was just struck.
- **Substrate: Silver** · _effect_ · `icons/commodities/metal/ingot-silver.webp`  
  Essence: Suppression / Supernatural Integration &middot; Mutation: Argent Edge White is purity. Gray is the thing you actually use on a werewolf. Depth 1 Your Strikes count as silver . 2 +1d4 damage against aberrations, fiends, undead and spirits. 3 +1d6 instead. Your Strikes affect incorporeal creatures as though they had the ghost touch rune. 4 +1d6. A supernatural creature you critically hit…  
  **Icon brief** (Assimilator — Substrate): A gleaming silver ingot with a crescent-moon glint, a faint wolf's claw mark repelled from it.
- **Substrate: Steel** · _effect_ · `icons/commodities/metal/ingot-steel.webp`  
  Essence: Structure &middot; Mutation: True Plate Straightforward. Nothing about this is strange and that is its whole appeal. Depth 1 Carapace Hardness +2 . Your unarmed Strikes' damage die increases one step. 2 Hardness +5. 3 Hardness +8. Your unarmed Strikes gain the versatile P and versatile S traits. 4 Hardness +12. +1 damage die on your unarmed Strikes. Depth is this effect's badge. The…  
  **Icon brief** (Assimilator — Substrate): A plain, solid steel bar, perfectly straight and polished; carapace plates beside it hardened and riveted.
#### Green

- **Substrate: Chromium** · _effect_ · `icons/commodities/metal/ingot-steel.webp`  
  Essence: Armour / Regeneration &middot; Mutation: Lacquer Shell A hard, bright, corrosion-proof lacquer over everything. It buffs out. Depth 1 Carapace Hardness +2 . Resistance 2 to acid. 2 Hardness +5 , resistance 5 to acid. Your Carapace repairs 1 Hit Point per hour on its own. 3 Hardness +8 , resistance 8 to acid. You are immune to rust, corrosion and effects that damage your items with acid.…  
  **Icon brief** (Assimilator — Substrate): A brilliant chrome nugget with a mirror-bright lacquer finish, acid droplets beading and rolling off it.
- **Substrate: Emerald** · _effect_ · `icons/commodities/gems/gem-cut-square-green.webp`  
  Essence: Regeneration &middot; Mutation: Knitting Flesh Open seams that close while you watch, leaving pale green scar tissue that also closes. Depth 1 Fast healing 1 while you have at least 1 Hit Point and are below your maximum. 2 Fast healing 2. Once per day, regrow a severed part over 1 hour. 3 Fast healing 5. You stabilize automatically when dying. 4 Fast healing 10. Once per day, when…  
  **Icon brief** (Assimilator — Substrate): A green emerald with a fleshy seam across it closing while you watch, pale green scar tissue knitting over.
- **Substrate: Jade** · _effect_ · `icons/commodities/gems/gem-raw-rough-green.webp`  
  Essence: Vitality &middot; Mutation: Deep Root Dense, cool, and very slightly translucent. It is thicker over the organs. Depth 1 +1 item bonus to Fortitude saves. 2 Resistance 5 to poison. You are immune to disease. 3 Once per day, when you roll a success on a Fortitude save, get a critical success instead. 4 Once per round instead of once per day. You cannot be drained or enfeebled . Depth is…  
  **Icon brief** (Assimilator — Substrate): A dense, cool, slightly translucent green jade piece shaped like a protective plate over a heart.
- **Substrate: Zinc** · _effect_ · `icons/commodities/metal/ingot-steel.webp`  
  Essence: Biological Adaptation &middot; Mutation: Shifting Tissue The surface changes texture depending on what last hurt it, and does not change back. Depth 1 At daily preparations, choose one energy damage type. Gain resistance 2 to it. 2 Resistance 5. Change the chosen type as a single action, once per day. 3 Resistance 8. Once per round, as a reaction when you take energy damage, change the…  
  **Icon brief** (Assimilator — Substrate): A dull zinc ingot whose surface has changed texture in patches — scorched, frosted, sparking — each mark of what hit it.
#### Orange

- **Substrate: Amber** · _effect_ · `icons/commodities/gems/gem-rough-square-yellow.webp`  
  Essence: Stored Energy &middot; Mutation: Reservoir A translucent sac at the sternum that fills visibly and drains visibly. Depth 1 When you take energy damage, store 1 charge (max 3). Spend 1 as a free action to add 1d4 of that type to a Strike. 2 Max 5 charges . Spending 2 adds 1d6 + 2 instead. 3 You also store a charge whenever you deal energy damage, once per round. 4 Spend 3 charges as a…  
  **Icon brief** (Assimilator — Substrate): A translucent honey-amber sac-like gem, energy visibly filling it from the bottom like a gauge.
- **Substrate: Bronze** · _effect_ · `icons/commodities/metal/ingot-stamped-bronze.webp`  
  Essence: Momentum / Combat &middot; Mutation: Battle Frame Utilitarian, scarred, and it keeps re-forming the parts that break. Depth 1 You are trained in improvised weapons as martial weapons, and take no penalty for using them. 2 If you Stride at least 10 feet, your next Strike this turn gains a +1 circumstance bonus to hit . 3 Once per round, make a Strike and then a Shove, Trip or Grapple as a…  
  **Icon brief** (Assimilator — Substrate): A battered bronze ingot with scars and nicks, a broken piece re-forming itself, an improvised weapon beside it.
- **Substrate: Carnelian** · _effect_ · `icons/commodities/gems/gem-rough-oval-orange.webp`  
  Essence: Momentum &middot; Mutation: Kinetic Spurs Spurs and vanes that unfold backward when you run and fold flat when you stop. Depth 1 +5 feet Speed. 2 If you moved at least 10 feet this turn before attacking, your Strike deals +1d4 . 3 +10 feet Speed , and the bonus becomes +1d6 . 4 Once per round, after a Strike, Stride up to half your Speed as a free action. Depth is this effect's badge.…  
  **Icon brief** (Assimilator — Substrate): A red-orange carnelian stone with spurs and vanes fanning backward from it as if in a strong wind.
- **Substrate: Mercury** · _effect_ · `icons/consumables/potions/vial-ornet-silver-black.webp`  
  Essence: Fluidity &middot; Mutation: Liquid Form Silver liquid moving constantly beneath translucent skin. The limbs are not fixed in number. Depth 1 You Squeeze at full Speed and are not off-guard while squeezing. 2 Resistance 5 to bludgeoning, piercing and slashing. 3 Once per round, as a reaction when you are hit, reduce the damage by your level as the blow passes through you. 4 You move…  
  **Icon brief** (Assimilator — Substrate): A pool of quicksilver shifting and splitting into several moving limbs, beneath a translucent membrane.
#### Purple

- **Substrate: Amethyst** · _effect_ · `icons/commodities/gems/gem-faceted-rough-purple.webp`  
  Essence: Psychic &middot; Mutation: Thought-Spines Violet spines across the crown, and other people's dreams start including you. Depth 1 Telepathy 30 feet with willing creatures with whom you share a language. 2 Your Strikes may deal mental ; +1d4 mental . 3 +1d6 mental. On a critical hit the target is stupefied 1 until the end of its next turn. 4 +1d6 mental. Once per round, a creature you…  
  **Icon brief** (Assimilator — Substrate): A violet amethyst geode bristling with crystal spines, faint dream-wisps drifting out of it.
- **Substrate: Nickel** · _effect_ · `icons/commodities/metal/ingot-silver.webp`  
  Essence: Mutation &middot; Mutation: Unstable Growth You do not know what it will be tomorrow. Neither does it. Depth 1 At daily preparations, gain one Aberration — roll or choose: (1) A limb , (2) An organ , (3) A mode , (4) A plate , (5) A gland , (6) A maw . One Aberration. 2 Two Aberrations. 3 Once per encounter, as a single action, re-roll all your Aberrations . 4 Three Aberrations, and one…  
  **Icon brief** (Assimilator — Substrate): A nickel nugget sprouting an unpredictable growth — a tiny eye, limb or fin — with a question mark of light.
- **Substrate: Platinum** · _effect_ · `icons/commodities/metal/ingot-silver.webp`  
  Essence: Transcendence &middot; Mutation: Ascendant Plate It stops being a colour and starts being a quality of light. Extremely rare. Depth 1 +1 circumstance bonus to saves against magic. 2 Resistance 5 to your Instinct's damage type. You no longer need to breathe. 3 Once per day, gain a fly Speed equal to half your land Speed for 1 minute. 4 Permanent fly Speed equal to your land Speed . You…  
  **Icon brief** (Assimilator — Substrate): A platinum ingot dissolving into a quality of pure white-silver light rather than a colour, a halo rising off it.
- **Substrate: Quartz** · _effect_ · `icons/commodities/gems/gem-faceted-diamond-pink.webp`  
  Essence: Arcane Resonance &middot; Mutation: Prism Node Clear prisms growing through the plate at angles that don't match the body underneath. Depth 1 +1 circumstance bonus to saves against magic, and you know when a spell is cast within 30 feet. 2 Once per day, counteract one magical effect (counteract rank = half your level; modifier = your class DC − 10). 3 When you counteract an effect, or a…  
  **Icon brief** (Assimilator — Substrate): A cluster of clear quartz prisms jutting at odd angles, splitting a beam of magic into a rainbow.
#### Red

- **Substrate: Copper** · _effect_ · `icons/commodities/metal/ingot-copper.webp`  
  Essence: Heat / Conduction &middot; Mutation: Conductive Filament Copper filaments running everywhere under the plate, visibly glowing when it works. Depth 1 When a Mutation of yours deals energy damage, the target takes 1 more of that type at the start of its next turn. 2 When you take fire or electricity damage, your next Strike before the end of your next turn deals +1d4 of that type. 3 Energy…  
  **Icon brief** (Assimilator — Substrate): A coil of copper filament glowing orange-red with conducted heat, energy running along the wire.
- **Substrate: Garnet** · _effect_ · `icons/commodities/gems/gem-rough-cushion-red.webp`  
  Essence: Blood &middot; Mutation: Crimson Tendrils Pulsating crimson flesh; blood-like tendrils that reach toward open wounds. Depth 1 Your Strikes deal 1 persistent bleed on a critical hit. You may Treat Wounds on yourself. 2 +1d4 damage against any creature that has already lost Hit Points this encounter. Critical hits deal 1d6 persistent bleed . 3 At the start of your turn, gain temporary Hit…  
  **Icon brief** (Assimilator — Substrate): A deep red garnet pulsing like a heart, crimson tendrils reaching from it toward a fresh wound.
- **Substrate: Iron** · _effect_ · `icons/commodities/metal/ingot-iron.webp`  
  Essence: Brutality &middot; Mutation: Dense Frame Black-red plates growing up through the skin; the limbs get heavier and longer. Depth 1 +1 item bonus to Athletics. Your unarmed Strikes deal +1 bludgeoning . 2 +2 circumstance bonus to Athletics checks to Shove, Trip or Grapple a creature you have already damaged this encounter. 3 Your unarmed Strikes gain the shove trait, and forced movement you…  
  **Icon brief** (Assimilator — Substrate): A heavy black-red iron chunk with blocky plates growing out of it, long and brutal.
- **Substrate: Ruby** · _effect_ · `icons/commodities/gems/gem-faceted-rough-red.webp`  
  Essence: Flame &middot; Mutation: Furnace Veins Glowing red veins; cracks of internal fire that open wider as the fight goes on. Depth 1 Your Carapace Strikes may deal fire instead of their normal damage type. You shed dim light in a 10-foot radius and cannot suppress it. 2 +1d4 fire. On a critical hit, 1d4 persistent fire . 3 +1d6 fire. Fire damage you deal treats fire resistance as 5 lower . 4…  
  **Icon brief** (Assimilator — Substrate): A blood-red ruby cracked with glowing internal fire, flames licking from the fissures.
#### White

- **Substrate: Aluminium** · _effect_ · `icons/commodities/metal/ingot-silver.webp`  
  Essence: Lightness &middot; Mutation: Hollow Frame Almost nothing. The plate is there and it weighs less than the clothes underneath. Depth 1 Your Carapace has no Bulk and imposes no penalties. +5 feet Speed . 2 +10 feet Speed. You take no damage from falls of less than 30 feet. 3 You Leap twice as far. Once per day, Fly 30 feet as a single action. 4 Permanent fly Speed 20 feet . You may end your…  
  **Icon brief** (Assimilator — Substrate): A feather-light aluminium shard floating above an open palm, weightless, airy blue-white.
- **Substrate: Diamond** · _effect_ · `icons/commodities/gems/gem-faceted-diamond-silver-.webp`  
  Essence: Hardness &middot; Mutation: Adamant Skin Colourless, flawless, and it does not deform. Neither do you, now. Depth 1 Carapace Hardness +2 . 2 Hardness +5. Reduce persistent damage you take by 2. 3 Hardness +8. Once per encounter, a critical hit against you deals normal damage instead. 4 Hardness +12. Once per round instead of once per encounter. Depth is this effect's badge. The whole…  
  **Icon brief** (Assimilator — Substrate): A colourless, flawless diamond, a hammer cracking on it instead, unchanged.
- **Substrate: Magnesium** · _effect_ · `icons/magic/light/explosion-star-glow-silhouette.webp`  
  Essence: Radiance &middot; Mutation: Flare Core It burns white and it does not care what it is burning. Depth 1 You shed bright light in a 20-foot radius at will. +1 item bonus to saves against blindness and dazzle. 2 Once per encounter, as a single action: creatures in a 15-foot emanation must succeed at a Fortitude save against your class DC or be dazzled for 1 round. 3 On a failed save they…  
  **Icon brief** (Assimilator — Substrate): A strip of magnesium burning with blinding white flame, sparks and harsh light.
- **Substrate: Pearl** · _effect_ · `icons/commodities/gems/pearl-white-oval.webp`  
  Essence: Purification &middot; Mutation: Clear Tide Layers, laid down over an irritant. You are the irritant. Depth 1 +1 item bonus to saves against poison and disease. Once per day, reduce one condition's value by 1. 2 Once per encounter, as a single action, end one condition of value 1 on yourself or an adjacent ally. 3 Range 30 feet , and it may instead reduce one affliction's stage by 1. 4…  
  **Icon brief** (Assimilator — Substrate): A pearl in cross-section showing nacre layers around a dark irritant grain, a faint cleansing glow.

## The Stargazer

### stargazer-auguries (16)

- **Alms of Fate** · _spell_ · `icons/commodities/currency/coins-assorted-mix-copper-silver-gold.webp`  
  On each target's next damaging effect before the end of your next turn, they reroll all 1s and 2s on the damage dice and must keep the new results. Heightened (5th) 3 allies. (9th) Each target also maximises one damage die of their choice. The next damage roll each target makes is rewritten as it lands; at 9th the die with the most to gain is maximised.  
  **Icon brief** (Stargazer — Augury): A pair of silver dice tumbling from a starlit hand, their 1 and 2 faces dissolving into stardust and reforming as higher numbers mid-air; indigo sky behind.
- **Borrowed Second** · _spell_ · `icons/magic/time/clock-analog-gray.webp`  
  Each target immediately Steps or Strides up to its Speed as a free action and gains a +1 circumstance bonus to AC until the start of your next turn. Heightened (5th) 3 targets. (9th) 5 targets.  
  **Icon brief** (Stargazer — Augury): A pocket watch with its second hand torn free and glowing, a silver footprint stepping out of the dial, a faint ghostly shield shimmering beside it.
- **Coiling Doubt** · _spell_ · `icons/magic/death/skeleton-snake-skull-pink.webp`  
  Critical Success Unaffected. Success The next attack roll or skill check the target attempts is rolled twice, taking the lower. Failure As success, but the first attack roll or skill check each round for 3 rounds . Critical Failure As failure for 1 minute , and the target is stupefied 2 for the same minute.  
  **Icon brief** (Stargazer — Augury): A dark violet thread coiling like a serpent around a falling d20, two dim die faces shown side by side with the lower one lit, a sour green-purple haze.
- **Crown of Fire** · _spell_ · `icons/magic/control/control-influence-crown-gold.webp`  
  +2 status bonus to Intimidation and Performance. Each target can Demoralize at 60 feet with no auditory or visual requirement and no penalty for a shared-language failure. Once per round, when a target critically succeeds at any check, one ally within 30 feet of it gains a +1 status bonus to their next roll. Heightened (+2) +1 ally.  
  **Icon brief** (Stargazer — Augury): A crown of burning stars hovering over an empty space, its flames shaped like shouting mouths, rays of orange-gold light thrown outward across a midnight sky.
- **Death Foretold** · _spell_ · `icons/magic/acid/dissolve-bone-skull.webp`  
  You show each of them the hour of its own death, in detail, with the date. Critical Success Unaffected. Success Frightened 1. Failure Frightened 2. Critical Failure Frightened 3, stunned 1 , and fleeing for 1 round. Heightened (4th) A creature that fails also takes 2d6 mental damage , doubled on a critical failure. (+2) +2d6.  
  **Icon brief** (Stargazer — Augury): A tarnished calendar page torn from the sky, a single date circled in blood-red light, a black hourglass with its last grain falling behind it.
- **Deep Dream** · _spell_ · `icons/magic/control/sleep-bubble-purple.webp`  
  +2 status bonus to Will saves and to Perception checks to disbelieve illusions. Once during the duration, a critical failure on a Will save becomes a failure. While the Augury lasts, a target is never off-guard merely for being unaware of a creature at the start of an encounter. Heightened (+2) +1 ally.  
  **Icon brief** (Stargazer — Augury): A closed eye drifting in a deep indigo nebula, a crescent moon cradling it, ripples of pale dream-light peeling away a thin illusory veil.
- **First Blood** · _spell_ · `icons/skills/melee/blood-slash-foam-red.webp`  
  Cast during exploration. The next time each rolls initiative within the hour, it gains a +2 status bonus to that roll, is not off-guard during the first round, and its first Strike of the encounter that hits deals an extra 1d6 spirit damage . Heightened (+2) +1d6.  
  **Icon brief** (Stargazer — Augury): A red star rising over a dawn horizon, a single drop of glowing blood falling from it, a racing silver arrow marking the first move of a fight.
- **Fixed Point** · _spell_ · `icons/skills/ranged/target-bullseye-archer-orange.webp`  
  Name attack rolls, saving throws, or skill checks. Until the end of your next turn, the first roll of that type made by each chosen creature is treated as a 10 on the die, before modifiers. Heightened (6th) Name two roll types. After you cast it, you are asked which roll types to name.  
  **Icon brief** (Stargazer — Augury): A d20 pinned in place by a silver nail of starlight, frozen showing a glowing 10, hourglass sand stopped mid-fall around it.
- **Guiding Star** · _spell_ · `icons/magic/light/explosion-star-teal-purple.webp`  
  Each target gains a +1 status bonus to attack rolls, damage rolls, Perception checks and skill checks . Heightened (4th) 3 allies. (7th) 4 allies. (10th) 5 allies, and the bonus is +2 .  
  **Icon brief** (Stargazer — Augury): A single bright five-pointed star above a dark landscape, its long silver ray pointing down a path like a compass needle, small stars aligning along the beam.
- **Hunted by the Sky** · _spell_ · `icons/magic/fire/projectile-arrow-fire-gem-yellow.webp`  
  The target cannot be concealed or hidden from you. You and your allies gain a +1 circumstance bonus to Seek and to Perception checks to find it, and the first attack made against it each round gains a +1 circumstance bonus. Your Snarl against it is −3 , or −4 once you have Surer Thread . Heightened (6th) 2 creatures.  
  **Icon brief** (Stargazer — Augury): A constellation shaped like an open eye locked onto a lone fleeing silhouette, cold starbeams spotlighting it so no shadow can hide it.
- **Iron Auspice** · _spell_ · `icons/magic/air/air-pressure-shield-blue.webp`  
  +2 status bonus to Fortitude saves, to Athletics checks to Shove, Trip and Grapple, and to checks to resist forced movement. Each target gains temporary Hit Points equal to three times your level , and once during the duration treats a critical failure on a Fortitude save as a failure. Heightened (+2) +1 ally.  
  **Icon brief** (Stargazer — Augury): An iron-grey astrological sigil forged like an anvil-shaped shield, stars hammered into its surface as rivets, sparks flying off it.
- **Perfect Ledger** · _spell_ · `icons/sundries/books/book-clasp-spiral-green.webp`  
  Each target's next Recall Knowledge before the end of your next turn is a free action , gains a +2 circumstance bonus, and on a success reveals one additional piece of information. On a critical success it also reveals the creature's lowest saving throw and all of its weaknesses . Heightened (5th) Every Recall Knowledge each target makes until the end of your next turn is a free action.  
  **Icon brief** (Stargazer — Augury): An open ledger book on which a creature's silhouette is written out in glowing silver ink, its weak points marked with small red stars.
- **Poured Knowing** · _spell_ · `icons/magic/acid/pouring-gas-smoke-liquid.webp`  
  +2 status bonus to Arcana, Nature, Occultism, Religion and Society. Each target's counteract checks during the duration use your Stargazer DC and proficiency rank if higher than their own, and count their counteract rank as 1 higher . Heightened (+2) +1 ally.  
  **Icon brief** (Stargazer — Augury): A crystal ewer tipped from the sky, pouring a stream of liquid starlight full of tiny glyphs and runes into an open waiting cup.
- **Shell of Hours** · _spell_ · `icons/equipment/finger/ring-shell-white-blue.webp`  
  Each regains 2d8 Hit Points immediately and gains a +2 status bonus to saves against disease and poison and to recovery checks. Once during the duration, the first time a target would be reduced to 0 Hit Points it is reduced to 1 Hit Point instead and the Augury ends for that target. Heightened (+2) +2d8 and +1 ally.  
  **Icon brief** (Stargazer — Augury): A translucent eggshell made of interlocking clock faces enclosing a glowing heart, a crack in one face sealing itself with golden light.
- **The Hour Is Not Come** · _spell_ · `icons/magic/life/heart-cross-purple-orange.webp`  
  Trigger You or an ally within 30 feet is reduced to 0 Hit Points. Effect It was not going to happen today. The target is reduced to 1 Hit Point instead, gains temporary Hit Points equal to your level , and does not gain the wounded condition from this instance. A creature cannot benefit from this Augury again for 10 minutes. Heightened (5th) The target also regains 2d8 Hit Points. (+2) +2d8. When…  
  **Icon brief** (Stargazer — Augury): A clock hand stopped a hair before midnight, held back by a silver thread pulled taut; a falling figure's shadow caught mid-drop beneath it.
- **Two Roads** · _spell_ · `icons/magic/lightning/bolt-forked-green.webp`  
  Before the end of your next turn, the first skill check each attempts is rolled twice ; each takes the higher result. Heightened (5th) 3 allies, and it applies to saving throws as well. (9th) 4 allies.  
  **Icon brief** (Stargazer — Augury): A path forking into two starlit roads under a night sky, a d20 hovering at the fork showing two results, the brighter road glowing.

### stargazer-class (1)

- **Stargazer** · _class_ · `icons/environment/cosmos/astronomy-planetary-orbits.webp`  
  You have already seen how this ends. Every morning you read the sky — which of thirteen signs is up, and whether it is kind — and every round you bend somebody else's luck by a little: a Guide for an ally's roll, a Snarl for an enemy's. You cannot fight, and you do not need to. Key attribute Wisdom &middot; Hit Points 8 + Constitution modifier per level &middot; Stargazer DC your focus spells and…  
  **Icon brief** (Stargazer — Class): A brass astrolabe framed against a deep indigo night sky, a single silver thread spooling from its center to a distant star, thirteen faint sigils circling the rim.

### stargazer-class-features (59)

#### Actions

- **Chart the Course** · _feat_ · `icons/tools/navigation/compass-brass-blue-red.webp`  
  Name one creature within 60 feet that you can see — two creatures from 11th level . Until the start of your next turn, the first time a named creature rolls a d20, you may use Fortune's Thread on that roll without spending your reaction . If you named two creatures you may do this once for each of them. You can have only one Chart the Course active at a time. Target the creatures and use this:…  
  **Icon brief** (Stargazer — Class feature): A star chart unrolled with a glowing dotted line drawn between two marked stars, a silver compass pinning one point, a target ring around the other.
- **Fortune's Thread** · _feat_ · `icons/tools/hand/needle-thread-spool.webp`  
  Trigger A creature within 30 feet that you can see is about to roll an attack roll, a saving throw, a skill check, or a Perception check. Effect Choose one: Guide — the triggering creature gains a +1 circumstance bonus to the roll. Snarl — the triggering creature takes a −1 circumstance penalty to the roll. Snarl can only be applied to an attack roll, skill check, or Perception check, never a…  
  **Icon brief** (Stargazer — Class feature): Two threads crossing between a pair of fingers: a gold thread pulled upward bright, a violet thread snagged downward, a d20 hanging where they cross.
- **Portent** · _feat_ · `icons/magic/perception/orb-crystal-ball-scrying.webp`  
  When you complete a Night Vigil, roll a d20 and record the result. This is your Portent , and you know its value. Speak the Portent [free-action] (prediction) Frequency once per day Trigger A creature within 60 feet that you can see is about to roll a d20 for an attack roll, a saving throw, or a skill check. Effect The creature does not roll. Its d20 result is your recorded Portent, and the roll…  
  **Icon brief** (Stargazer — Class feature): A d20 sealed inside a crystal orb at dawn, its rolled number glowing faintly through the glass, a night-vigil candle burned low beside it.
- **Rewrite the Ending** · _feat_ · `icons/magic/time/hourglass-brown-orange.webp`  
  Frequency once per week Trigger You or an ally within 60 feet dies, or the party is defeated or captured. Effect Time unwinds to the moment initiative was rolled for this encounter. All damage, conditions, deaths, expended spells, expended items and expended resources since that moment are restored, for every creature. The encounter has not happened. You alone remember it. As part of this free…  
  **Icon brief** (Stargazer — Class feature): A great hourglass shattered and reassembling itself in reverse, sand flowing upward, fallen swords and a broken shield rising back into place around it.
- **The Last Thing You See** · _feat_ · `icons/magic/perception/eye-slit-pink.webp`  
  Trigger A creature within 30 feet that you can see deals damage to you. Effect You show it the hour of its own death — not a threat, a date . It attempts a Will save against your Stargazer DC. Critical Success It is unaffected and is temporarily immune for 10 minutes. Success Frightened 1. Failure Frightened 2. Critical Failure Frightened 3 and stunned 1 . When something within 30 feet hurts you,…  
  **Icon brief** (Stargazer — Class feature): A staring teal eye whose pupil holds a tiny skull and a written date; a crack of cold light shooting back toward an attacking claw.
- **Unmake the Moment** · _feat_ · `icons/magic/light/circle-window-clock-blue.webp`  
  Frequency once per day (recharges on your next Night Vigil) Trigger Your turn begins. Effect Time rewinds to the start of your last turn . Everything done since then by every creature is undone: damage dealt, conditions applied, spells cast, movement made, resources spent, reactions used. Creatures reduced to 0 Hit Points return to the Hit Points they had. Everyone except you loses all memory of…  
  **Icon brief** (Stargazer — Class feature): A clock face with its hands spinning backward, a faint afterimage of the last few seconds peeling off it like a ghost layer, silver motion trails.
#### Core

- **Armor Expertise** · _feat_ · `icons/equipment/chest/breastplate-banded-blue.webp`  
  Your proficiency ranks for unarmored defense and light armor increase to expert.  
  **Icon brief** (Stargazer — Core proficiency): A padded leather jerkin embroidered with silver constellations, a star-shaped clasp at the collar, glints of reinforcement.
- **Astronomy Lore** · _lore_ · `icons/tools/navigation/spyglass-telescope-waves-blue.webp`  
  Celestial events, calendars, navigation by star, prophecy, and — at the GM's discretion — Recall Knowledge about anything that has been foretold .  
  **Icon brief** (Stargazer — Core proficiency): An open almanac with a moon-phase calendar, a quill resting across it, small stars lifting off the page like dust.
- **Astronomy Lore (15th)** · _feat_ · `icons/tools/navigation/spyglass-telescope-blue.webp`  
  Your proficiency rank in Astronomy Lore increases to legendary , and you gain an extra skill feat, which must apply to Astronomy Lore or Occultism.  
  **Icon brief** (Stargazer — Core proficiency): A complete orrery of every planet, spinning in perfect harmony, a laurel wreath of stars encircling it — mastery of all skies.
- **Astronomy Lore (3rd)** · _feat_ · `icons/tools/navigation/spyglass-telescope-brass-blue.webp`  
  Astronomy Lore is your core skill. Your proficiency rank in it increases to expert , and you gain an extra skill feat, which must apply to Astronomy Lore or Occultism.  
  **Icon brief** (Stargazer — Core proficiency): A single brass telescope pointed at a cluster of stars, one star circled in chalk, a small notebook of notes beneath.
- **Astronomy Lore (7th)** · _feat_ · `icons/tools/navigation/spyglass-telescope-brass.webp`  
  Your proficiency rank in Astronomy Lore increases to master , and you gain an extra skill feat, which must apply to Astronomy Lore or Occultism.  
  **Icon brief** (Stargazer — Core proficiency): Three nested celestial rings of an armillary sphere, brass and silver, aligned around a glowing center, notes fluttering around.
- **Augury (11th)** · _feat_ · `icons/magic/light/explosion-star-blue-large.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): A star-chart card with eleven pinholes of light, the eleventh newly kindled, a silver hand placing it in a fanned deck of sky cards.
- **Augury (13th)** · _feat_ · `icons/magic/light/explosion-star-blue-small.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): A ring of thirteen candles in an occult circle, the thirteenth just lit with indigo flame, an augury sigil forming in its smoke.
- **Augury (15th)** · _feat_ · `icons/magic/light/explosion-star-blue-yellow.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): A tarot-like card bearing a new constellation drawn in fresh silver ink, fifteen faint stars along its border, glowing at the edges.
- **Augury (17th)** · _feat_ · `icons/magic/light/explosion-star-blue.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): An open scroll unrolling into the night sky, a new glyph written in starlight at its end, seventeen small marks along its margin.
- **Augury (19th)** · _feat_ · `icons/magic/light/explosion-star-glow-blue-purple.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): A full circle of nine augury sigils around a central eye, every one glowing, the last one at the top blazing white.
- **Augury (1st)** · _feat_ · `icons/magic/light/explosion-star-large-blue-yellow.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): A single glowing sigil drawn on a blank star map, a hand's fingertip still trailing silver light from the stroke.
- **Augury (5th)** · _feat_ · `icons/magic/light/explosion-star-large-pink.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): Two augury sigils on a star map linked by a fine thread, the second just ignited, small sparks scattering.
- **Augury (7th)** · _feat_ · `icons/magic/light/explosion-star-large-teal-purple.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): Three augury sigils in a triangle on dark parchment, connected by silver lines, the newest pulsing indigo.
- **Augury (9th)** · _feat_ · `icons/magic/light/explosion-star-large-teal.webp`  
  You learn one Augury of your choice. You know nine permanently by 19th level — at 1st, 5th, 7th, 9th, 11th, 13th, 15th, 17th and 19th.  
  **Icon brief** (Stargazer — Class feature): Four augury sigils arranged like compass points around a small astrolabe, the fourth catching light.
- **Constellation Mastery** · _feat_ · `icons/magic/light/explosion-star-orange-purple.webp`  
  You no longer read the sky. You argue with it. Trade the Day. During your Night Vigil you may swap today’s aspect with the aspect of any of the next three days in your forecast. The two days exchange aspects; the signs do not move. The day you traded away is still coming. A scheduled Zenith cannot move. Forewarned becomes Foreordained. You and the allies you brief treat a negative aspect as…  
  **Icon brief** (Stargazer — Class feature): Two calendar tiles being swapped by a hand in the sky, each bearing a different sign's aspect glyph, a forecast row of days stretching away.
- **Expert Stargazer** · _feat_ · `icons/magic/light/explosion-star-orange.webp`  
  Your proficiency rank for your Stargazer DC increases to expert.  
  **Icon brief** (Stargazer — Core proficiency): A silver star with a single banded ring around it, tiny compass marks along the ring, glowing over an indigo field.
- **Great Fortitude** · _feat_ · `icons/magic/life/heart-cross-blue.webp`  
  Your proficiency rank for Fortitude saves increases to expert.  
  **Icon brief** (Stargazer — Core proficiency): A solid granite pillar with a star carved into its face, unbroken under falling meteors that shatter against it.
- **Greater Resolve** · _feat_ · `icons/skills/wounds/anatomy-organ-brain-pink-red.webp`  
  Your proficiency rank for Will saves increases to legendary.  
  **Icon brief** (Stargazer — Core proficiency): An unblinking eye inside a triple-banded gold-and-silver ring, storms of violet mental energy breaking around it.
- **Incredible Senses** · _feat_ · `icons/magic/perception/eye-ringed-glow-angry-large-teal.webp`  
  Your proficiency rank for Perception increases to legendary.  
  **Icon brief** (Stargazer — Core proficiency): A wide-open eye whose iris is a full star chart, rays of perception reaching every corner of a dark sky.
- **Legendary Stargazer** · _feat_ · `icons/magic/light/explosion-star-pink.webp`  
  Your proficiency rank for your Stargazer DC increases to legendary.  
  **Icon brief** (Stargazer — Core proficiency): A silver star crowned with three gold rings and a laurel of tiny stars, blazing at the center of a spiral galaxy.
- **Lightning Reflexes** · _feat_ · `icons/magic/fire/explosion-flame-lightning-strike.webp`  
  Your proficiency rank for Reflex saves increases to expert.  
  **Icon brief** (Stargazer — Core proficiency): A shooting star streaking past, a hand snapping aside just in time, motion blur in silver and blue.
- **Master Stargazer** · _feat_ · `icons/magic/light/explosion-star-small-blue-yellow.webp`  
  Your proficiency rank for your Stargazer DC increases to master.  
  **Icon brief** (Stargazer — Core proficiency): A silver star circled by two concentric rings with engraved zodiac ticks, brighter than the stars around it.
- **Night Vigil** · _feat_ · `icons/magic/time/day-night-sun-moon.webp`  
  The Sky turns without you. One of thirteen skies is up each day, its aspect is Quiet, Benefic, Retrograde, Malefic or Exalted, rolled at the weights in &sect;8.2. Almost nobody can tell which. During your daily preparations, spend 10 minutes observing the sky. (Indoors, underground or under cloud there is no sky to observe, and your chart is not a substitute — see Clouded Sky .) You gain three…  
  **Icon brief** (Stargazer — Class feature): A lone telescope on a hilltop at night, a lantern beside it, thirteen faint signs arcing across the sky above with one lit brightly.
- **Resolve** · _feat_ · `icons/commodities/biological/organ-brain-pink-purple.webp`  
  Your proficiency rank for Will saves increases to master.  
  **Icon brief** (Stargazer — Core proficiency): A calm eye within two concentric silver rings, a wave of violet fear-mist parting harmlessly around it.
- **Second Star** · _feat_ · `icons/magic/light/explosion-star-small-orange-purple.webp`  
  Your focus pool increases to 2 Focus Points . (The third, as for every published class, comes from a class feat — Conjunction , 8th.)  
  **Icon brief** (Stargazer — Class feature): Two stars twinned on a dark sky, the second newly kindling beside the first, a faint focus-ring of light around both.
- **Star Chart** · _feat_ · `icons/sundries/gaming/card-astronomy-pink.webp`  
  You carry an astrolabe, a star-map, a tattoo, or a memorised sky. You gain a focus pool of 1 Focus Point and the Auguries you learn. Auguries are focus spells with the prediction trait; their rank is always half your level rounded up, and they use your Stargazer DC and your Wisdom modifier for spell attack rolls and DCs. You Refocus by reading the sky, or your chart, for 10 minutes. You also know…  
  **Icon brief** (Stargazer — Class feature): A brass astrolabe set on an unrolled star map, its rete pointing to a glowing sigil, a focus point of light pooled at its center.
- **Stargazer's Path** · _feat_ · `icons/magic/light/beam-deflect-path-yellow.webp`  
  Four Paths. Each grants an ability at 1st , 5th , 13th and 17th level.  
  **Icon brief** (Stargazer — Path): A crossroads of four starlit roads seen from above, each ending at a different emblem: a loom, an open book, a herald's horn, a broken thread.
- **Surer Thread** · _feat_ · `icons/magic/light/explosion-star-small-orange.webp`  
  Fortune's Thread's bonus and penalty increase to &plusmn;2 .  
  **Icon brief** (Stargazer — Class feature): A thread of fate doubled and twisted tight, gold and violet strands braided, glowing with a stronger sheen than a single strand.
- **Threefold Thread** · _feat_ · `icons/magic/light/explosion-star-small-pink.webp`  
  Fortune's Thread affects three creatures with a single reaction, in any combination of Guide and Snarl. Twin Fates still affects two.  
  **Icon brief** (Stargazer — Class feature): Three threads of fate fanning from one fingertip to three distant points, gold and violet mixed, all pulled taut at once.
- **Twin Fates** · _feat_ · `icons/magic/light/explosion-star-small-teal-purple.webp`  
  Once per 10 minutes, when you use Fortune's Thread, you may instead make it a true fortune or misfortune effect for up to two of its targets : each rolls twice and takes the higher result (Guide) or the lower result (Snarl). This replaces the bonus or penalty for those targets, and Snarl's restriction to attack rolls, skill checks and Perception still applies. If a fortune effect and a misfortune…  
  **Icon brief** (Stargazer — Class feature): Two d20s hanging from a single forked thread, one gold glowing with the higher roll, one violet showing the lower.
- **Vigilant Senses** · _feat_ · `icons/magic/perception/eye-ringed-glow-angry-small-red.webp`  
  Your proficiency rank for Perception increases to master.  
  **Icon brief** (Stargazer — Core proficiency): An eye open in the dark with two bands of silver around it, faint shapes in the shadows outlined by thin starlight.
- **Weapon Expertise** · _feat_ · `icons/magic/light/swords-light-glowing-white.webp`  
  Your proficiency ranks for unarmed attacks and simple weapons increase to expert.  
  **Icon brief** (Stargazer — Core proficiency): A simple wooden staff and a bare fist crossed, both etched with small silver stars, a banded ring of expertise behind.
- **Widen the Sky** · _feat_ · `icons/magic/light/explosion-star-small-teal.webp`  
  Fortune's Thread's range increases to 60 feet , and when you use it you may affect two creatures with the same reaction, in any combination — two Guides, two Snarls, or one of each. Both must be within range and you must be able to see both. It is still a single reaction, and Snarl's restriction to attack rolls, skill checks and Perception still applies.  
  **Icon brief** (Stargazer — Class feature): A thread of fate splitting into two from one hand, reaching across a wider arc of night sky, its range drawn as a wide silver circle.
#### Paths

- **Deja Vu** · _feat_ · `icons/magic/time/arrows-circling-green.webp`  
  Frequency once per 10 minutes Trigger You fail, but do not critically fail, a check. Effect Reroll it. This is a fortune effect. Offered as a button when it triggers.  
  **Icon brief** (Stargazer — Path): A d20 with a translucent afterimage of itself offset behind it, a curved arrow looping the failed roll back for another throw.
- **Doubled Strand** · _feat_ · `icons/tools/hand/sewing-needle-thread.webp`  
  Chart the Course names two creatures instead of one, and three from 11th level. You may use its free Fortune's Thread once for each of them.  
  **Icon brief** (Stargazer — Path): A star chart with two separate dotted courses plotted at once, two compasses pinning two marked stars, threads running to both.
- **Every Sky Ever Read** · _feat_ · `icons/sundries/books/book-backed-blue-gold.webp`  
  Once per hour, ask the GM one yes-or-no question about the next hour. The answer is true . (If the GM genuinely has not decided, the answer is “not yet written,” and the use is not spent.)  
  **Icon brief** (Stargazer — Path): A towering stack of star charts and almanacs whose top page glows with a single question mark answered by a bright star.
- **Foregone Conclusion** · _feat_ · `icons/sundries/documents/letter-modern-seal.webp`  
  Once per round, when you Snarl an attack roll and the attack misses, the attacker is off-guard until the end of its turn.  
  **Icon brief** (Stargazer — Path): An arrow bending away from its target as a violet thread snags it, the attacker's silhouette left open and exposed, a small cracked shield icon.
- **Herald's Omen** · _feat_ · `icons/sundries/survival/horn-drinking-corked.webp`  
  You learn Coiling Doubt , and it does not count against your Auguries known. In addition, once per round, when a creature critically fails a roll you affected with Snarl , it takes persistent mental damage equal to your Wisdom modifier .  
  **Icon brief** (Stargazer — Path): A herald's horn blowing violet smoke shaped like a coiled serpent, a falling d20 cracking where the smoke touches it.
- **Knotted Thread** · _feat_ · `icons/commodities/cloth/thread-and-needle.webp`  
  When you Guide an ally with Fortune's Thread, they also gain a +1 circumstance bonus to AC against the next attack made against them before the start of your next turn.  
  **Icon brief** (Stargazer — Path): A gold thread tied in a protective knot that flares into a small shield of light, warding off an incoming blade.
- **Perfect Recall** · _feat_ · `icons/sundries/books/book-backed-silver-gold.webp`  
  You can Recall Knowledge using Astronomy Lore in place of any other Knowledge skill, at a −2 circumstance penalty; the penalty goes away at 7th level when Astronomy Lore reaches Master. Your first Recall Knowledge against any creature each combat is a free action . Toggle In place of another skill on the check to take the penalty.  
  **Icon brief** (Stargazer — Path): A memory palace of stars — a glowing constellation map inside a silhouetted head's outline, one star flaring as a fact is recalled.
- **Second Sight** · _feat_ · `icons/magic/time/arrows-circling-pink.webp`  
  Deja Vu can instead trigger on a failed check by an ally within 30 feet that you can see.  
  **Icon brief** (Stargazer — Path): A second faint eye opening beside the first, its gaze reaching an ally's falling d20 and looping it back for a reroll.
- **Sentence Passed** · _feat_ · `icons/tools/instruments/horn-flared-wood.webp`  
  Once per 10 minutes, 1 creature within 60 feet, Will save against your Stargazer DC. Failure For 1 minute the target treats every natural 20 as a natural 10 and cannot benefit from fortune effects. Critical Failure As failure, and it is doomed 1 .  
  **Icon brief** (Stargazer — Path): A judge's gavel made of starlight striking a d20, its 20 face cracking into a dull 10, dark chains of doom around it.
- **Skein of Fates** · _feat_ · `icons/commodities/cloth/thread-spindle-black.webp`  
  Fortune's Thread affects one additional creature with a single reaction — three from 13th, and four once Threefold Thread arrives at 17th. The extra target does not extend Twin Fates or Tapestry .  
  **Icon brief** (Stargazer — Path): A loose skein of many threads of fate wound in a ball, strands unspooling toward several points at once, gold and violet.
- **Tapestry** · _feat_ · `icons/commodities/cloth/thread-spindle-green.webp`  
  Once per 10 minutes, Fortune's Thread affects every ally within 60 feet (Guide) or every enemy within 60 feet (Snarl). One reaction, one choice, everyone. Offered in Fortune's Thread's picker when it is ready.  
  **Icon brief** (Stargazer — Path): A vast woven tapestry of the battlefield in gold and violet threads, every figure stitched to the weaver's loom at once.
- **The Almanac** · _feat_ · `icons/sundries/books/book-backed-silver-red.webp`  
  Night Vigil's forecast reaches seven days instead of three, and you may determine what the sky was on any past day you were alive for. The Vigil card offers a button to read a past day.  
  **Icon brief** (Stargazer — Path): A thick leather almanac open to a seven-day spread of sky forecasts, back pages flipping to past dates, a bookmark ribbon of starlight.
- **The Announcement** · _feat_ · `icons/tools/instruments/horn-industrial-steel.webp`  
  You can Demoralize using Astronomy Lore instead of Intimidation, at a range of 60 feet, with no auditory or visual requirement — you are not shouting, you are reading out a date. Use this to Demoralize your target with Astronomy Lore.  
  **Icon brief** (Stargazer — Path): An open scroll held out, a date read aloud in glowing letters that ripple outward like a shockwave of dread.
- **The Broken Thread** · _feat_ · `icons/sundries/survival/mirror-plain.webp`  
  I have already lost you once. Your Path grants an ability at 1st, 5th, 13th and 17th level.  
  **Icon brief** (Stargazer — Path): A single thread of fate snapped in two, the frayed ends glowing, a clock with its hands reversing behind the break.
- **The Ephemeris** · _feat_ · `icons/sundries/books/book-backed-wood-tan.webp`  
  I have read every sky. Ask me anything. Your Path grants an ability at 1st, 5th, 13th and 17th level.  
  **Icon brief** (Stargazer — Path): An ephemeris table — columns of star positions in silver ink — with an eye at its center that has read every line.
- **The Herald** · _feat_ · `icons/tools/instruments/horn-megaphone-loudspeaker.webp`  
  I do not curse them. I announce what is coming. Your Path grants an ability at 1st, 5th, 13th and 17th level.  
  **Icon brief** (Stargazer — Path): A herald's long horn against the night sky, a banner hanging from it embroidered with an omen sigil, dark stars falling behind.
- **The Long Way Round** · _feat_ · `icons/magic/nature/root-vine-sword-broken.webp`  
  Unmake the Moment may rewind to the start of any creature’s last turn, not only your own — declare which as you use it. In addition, once per week, you may use Unmake the Moment while dead , if you died during the round it would undo.  
  **Icon brief** (Stargazer — Path): A long silver thread winding back on itself in a loop through several clock faces, one of them belonging to someone else, rewinding.
- **The Weaver** · _feat_ · `icons/commodities/cloth/thread-spindle-grey-green.webp`  
  Fate is a fabric, and I have hands. Your Path grants an ability at 1st, 5th, 13th and 17th level.  
  **Icon brief** (Stargazer — Path): A loom strung with gold and violet threads, its weave forming a constellation, a shuttle of starlight passing through.
- **Unmade Again** · _feat_ · `icons/skills/melee/shield-damaged-broken-blue.webp`  
  Unmake the Moment can be used twice per day , and you are no longer drained 1 when it resolves. You are still stunned 1.  
  **Icon brief** (Stargazer — Path): Two clock faces spinning backward one after the other, a double rewind arrow wrapping both, silver sparks flying off.
- **Written Down** · _feat_ · `icons/sundries/books/book-black-grey.webp`  
  When you critically succeed at a Recall Knowledge check, you and all allies who can hear you gain a +1 circumstance bonus to all d20 rolls against that creature type for 1 minute. You may also use Fortune's Thread on a Recall Knowledge check after the roll but before the GM answers .  
  **Icon brief** (Stargazer — Path): A quill writing a creature's true name in glowing ink, the letters lifting off the page and drifting to allies as small stars.

### stargazer-effects (28)

- **Effect: Alms of Fate** · _effect_ · `icons/commodities/currency/coins-assorted-mix-copper-silver-gold.webp`  
  Your next damaging effect before the end of the Stargazer's next turn rerolls every 1 and 2 on its damage dice, and keeps the new results.  
  **Icon brief** (Stargazer — Effect): Damage dice hovering over a weapon, the low faces flickering and flipping to higher numbers, a faint coin of starlight above.
- **Effect: Borrowed Second** · _effect_ · `icons/magic/time/clock-stopwatch-white-blue.webp`  
  +1 circumstance bonus to AC until the start of the Stargazer's next turn.  
  **Icon brief** (Stargazer — Effect): A faint silver second hand circling a creature like a halo, a thin translucent barrier shimmering in front of it.
- **Effect: Coiling Doubt** · _effect_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  The next attack roll or skill check is rolled twice, taking the lower.  
  **Icon brief** (Stargazer — Effect): A single coil of violet thread tightening around a creature's hand just before a roll, a cracked d20 at its fingertips.
- **Effect: Coiling Doubt (Lingering)** · _effect_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  The first attack roll or skill check each round is rolled twice, taking the lower.  
  **Icon brief** (Stargazer — Effect): A violet serpent-thread wound loosely around a creature's wrist, a pulse of doubt flaring each round, two dice shown, the lower lit.
- **Effect: Crown of Fire** · _effect_ · `icons/magic/fire/flame-burning-hand-orange.webp`  
  +2 status bonus to Intimidation and Performance. You can Demoralize at 60 feet with no auditory or visual requirement and no penalty for a shared-language failure.  
  **Icon brief** (Stargazer — Effect): A small crown of burning stars floating over the creature's head, flame-rays pulsing out like a roar.
- **Effect: Crown's Blessing** · _effect_ · `icons/magic/control/control-influence-crown-gold.webp`  
  Crown of Fire: +1 status bonus to your next roll.  
  **Icon brief** (Stargazer — Effect): A single ember falling from a crown of fire onto an ally's open palm, glowing gold, a tiny +1 spark rising from it.
- **Effect: Deep Dream** · _effect_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  +2 status bonus to Will saves and to Perception checks to disbelieve illusions.  
  **Icon brief** (Stargazer — Deep Dream): A closed eye wrapped in drifting indigo dream-mist, silver constellations reflected on its lid, an illusory mask dissolving into stardust in front of it.
- **Effect: Deep Dream (Reprieve)** · _effect_ · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp`  
  Once during Deep Dream: a critical failure on a Will save is a failure. Spent when it happens.  
  **Icon brief** (Stargazer — Deep Dream reprieve): A sleeping mind drawn as a crescent moon over indigo water, one bright silver star catching a falling shard of a broken mirror just before it hits the surface.
- **Effect: Fate's Favourite** · _effect_ · `icons/sundries/gaming/dice-runed-brown.webp`  
  Your next d20 roll is a natural 20.  
  **Icon brief** (Stargazer — Fate's Favourite): A d20 frozen mid-tumble, its 20 face blazing gold, a single shooting star streaking down to land on that face against a deep indigo sky.
- **Effect: First Blood (Initiative)** · _effect_ · `icons/skills/melee/strike-sword-blood-red.webp`  
  +2 status bonus to the next initiative roll within the hour.  
  **Icon brief** (Stargazer — First Blood (initiative)): A dawn star rising ahead of a row of dim stars, a silver arrowhead of light pointing forward, the first of a line to move.
- **Effect: First Blood (Strike)** · _effect_ · `icons/skills/melee/strike-sword-blood-red.webp`  
  The first Strike of the encounter that hits deals extra spirit damage. Spent when it lands.  
  **Icon brief** (Stargazer — First Blood (strike)): A blade edge touched by a single falling star, a pale spectral spark bursting at the point of first contact, faint blue spirit light trailing.
- **Effect: Guiding Star** · _effect_ · `icons/magic/light/explosion-star-glow-yellow.webp`  
  +1 status bonus to attack rolls, damage rolls, Perception checks and skill checks (+2 from the 10th-rank Augury), until the start of the Stargazer's next turn.  
  **Icon brief** (Stargazer — Guiding Star): A single brilliant eight-pointed star shining down a beam of soft gold light, a silver path of smaller stars leading toward it across the night.
- **Effect: Hunted by the Sky** · _effect_ · `icons/magic/perception/eye-slit-orange.webp`  
  Hunted: it cannot be concealed or hidden from the Stargazer; the Stargazer and allies gain +1 circumstance to Seek it; the first attack against it each round gains +1 circumstance; the Stargazer's Snarl against it is −3, or −4 with Surer Thread.  
  **Icon brief** (Stargazer — Hunted by the Sky): A dark silhouette pinned in a cone of cold starlight from above, a ring of constellation lines closing around it like a net, nowhere to hide.
- **Effect: Iron Auspice** · _effect_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  +2 status bonus to Fortitude saves and to Athletics checks to Shove, Trip and Grapple; temporary Hit Points equal to three times the Stargazer's level.  
  **Icon brief** (Stargazer — Iron Auspice): A body outline plated in dark iron starmetal, a glowing red-gold planet (Mars-like) above it, a layer of shimmering temporary armour around the edges.
- **Effect: Iron Auspice (Reprieve)** · _effect_ · `icons/magic/defensive/shield-barrier-glowing-blue.webp`  
  Once during Iron Auspice: a critical failure on a Fortitude save is a failure. Spent when it happens.  
  **Icon brief** (Stargazer — Iron Auspice reprieve): An iron shield-plate stamped with a star, cracked down the middle but held together by a single silver thread pulled tight across the crack.
- **Effect: Knotted Thread** · _effect_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  +1 circumstance bonus to AC against the next attack before the start of the Stargazer's next turn.  
  **Icon brief** (Stargazer — Knotted Thread): A silver fate-thread tied into a tight knot that a sword-point strikes and glances off, a small shield of light flaring at the knot.
- **Effect: Perfect Ledger** · _effect_ · `icons/sundries/books/book-open-turquoise.webp`  
  +2 circumstance bonus to the next Recall Knowledge before the end of the Stargazer's next turn, which is a free action. A critical success also reveals the creature's lowest saving throw and all its weaknesses.  
  **Icon brief** (Stargazer — Perfect Ledger): An open ledger of star charts with one entry glowing gold, a quill of light underlining a creature's sketched outline and its weak points circled.
- **Effect: Poured Knowing** · _effect_ · `icons/sundries/books/book-embossed-blue.webp`  
  +2 status bonus to Arcana, Nature, Occultism, Religion and Society.  
  **Icon brief** (Stargazer — Poured Knowing): A silver ewer tipped over a head-shaped outline, a stream of tiny glowing glyphs and runes pouring in, five symbols (arcane rune, leaf, eye, sun, scroll) orbiting.
- **Effect: Remembered Ending** · _effect_ · `icons/magic/time/hourglass-tilted-glowing-gold.webp`  
  You were in the erased timeline: +2 circumstance bonus to your first d20 roll of the re-run encounter.  
  **Icon brief** (Stargazer — Remembered Ending): A torn page of a battle map, the erased half ghosted in faint silver, a single gold star kept in a hand as the scene redraws.
- **Effect: Remembered Initiative** · _effect_ · `icons/magic/time/hourglass-tilted-glowing-gold.webp`  
  You were in the erased timeline: +2 circumstance bonus to your initiative roll.  
  **Icon brief** (Stargazer — Remembered Initiative): A broken hourglass whose sand flows back up, one grain glowing gold and leaping ahead of the rest like a starting signal.
- **Effect: Sentence Passed** · _effect_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  For 1 minute this creature treats every natural 20 as a natural 10 and cannot benefit from fortune effects.  
  **Icon brief** (Stargazer — Sentence Passed): A d20 with its 20 face crossed out and overwritten as a dull 10, a black gavel-shaped star above, the die's glow snuffed to grey.
- **Effect: Shell of Hours** · _effect_ · `icons/magic/life/heart-cross-strong-flame-green.webp`  
  +2 status bonus to saves against disease and poison. Once : the first time this creature would be reduced to 0 Hit Points it is reduced to 1 Hit Point instead, and the Augury ends for it.  
  **Icon brief** (Stargazer — Shell of Hours): A translucent egg-like shell made of clock faces wrapped around a small figure, green poison droplets beading off it, one hand of the clock stopped at the brink.
- **Effect: Shouted Warning** · _effect_ · `icons/magic/time/clock-stopwatch-white-blue.webp`  
  A Stargazer who has seen this round already shouted a warning: +2 circumstance bonus to your next roll this round.  
  **Icon brief** (Stargazer — Shouted Warning): An open mouth-shape of starlight sending out concentric silver sound rings, a raised exclamation-star in the middle, an incoming blade dimly visible.
- **Effect: Star Chart Dark** · _effect_ · `icons/magic/time/hourglass-tilted-glowing-gold.webp`  
  Your Star Chart is dark: no Night Vigil, Fortune's Thread, Chart the Course, Portent, Auguries or Focus Points until a full 8-hour Night Vigil under open sky. Your drained and doomed cannot be reduced before then.  
  **Icon brief** (Stargazer — Star Chart dark): A star chart scroll gone black, its constellations faded to ash-grey dots, a covered moon behind heavy clouds, a single candle snuffed beside it.
- **Effect: Star-Marked** · _effect_ · `icons/magic/unholy/orb-glowing-purple.webp`  
  Marked by a Stargazer's Star-Marked Enemy: Coiling Doubt and Snarl reach it wherever it is known to be, until their next daily preparations.  
  **Icon brief** (Stargazer — Star-Marked): A creature's shadow branded with a glowing silver star sigil, a thin line of light linking it to a distant watching star far overhead.
- **Effect: The Hour Is Not Come (Immune)** · _effect_ · `icons/magic/life/heart-glowing-red.webp`  
  Cannot benefit from The Hour Is Not Come again for 10 minutes.  
  **Icon brief** (Stargazer — The Hour Is Not Come — spent): A pocket watch closed and chained shut, its face greyed out, a small ten-minute arc of dim silver light marking when it can open again.
- **Effect: Two Roads** · _effect_ · `icons/magic/control/silhouette-hold-change-blue.webp`  
  The first skill check before the end of the Stargazer's next turn is rolled twice, keeping the higher — saving throws too, from the 5th-rank Augury.  
  **Icon brief** (Stargazer — Two Roads): A starlit path forking in two, two d20s rolling down each branch, the brighter one's road lit gold while the other fades.
- **Effect: Written in Advance** · _effect_ · `icons/sundries/books/book-embossed-blue.webp`  
  Your next skill check within the hour is an automatic success, not a critical success.  
  **Icon brief** (Stargazer — Written in Advance): A page on which a check mark is already inked before the hand reaches it, a quill of starlight hovering, the ink glowing silver.

### stargazer-feats (40)

#### 10th

- **Fate's Favourite** · _feat_ · `icons/sundries/gaming/dice-runed-brown.webp`  
  Once per day, treat one d20 roll you make as a natural 20 . You saw this. Post this to chat before the roll: your next d20 is a natural 20.  
  **Icon brief** (Stargazer — Fate's Favourite): A hand releasing a d20 that already shows a golden 20 before it lands, a halo of stars around it and a chat-scroll banner reading the prophecy.
- **Two Warnings** · _feat_ · `icons/commodities/cloth/thread-spindle-red.webp`  
  You gain a second reaction each round, usable only for Fortune's Thread , The Last Thing You See , or The Hour Is Not Come .  
  **Icon brief** (Stargazer — Two Warnings): Two silver warning bells ringing together under a star, each sending out its own wave of light.
- **Unspent Thread** · _feat_ · `icons/commodities/cloth/thread-spindle-violet.webp`  
  If you have not used your reaction by the start of your turn, your first Chart the Course that turn is a free action .  
  **Icon brief** (Stargazer — Unspent Thread): A spool of fate-thread still full and glowing, a silver compass needle springing off it to chart a course on a star map.
- **Wide Vigil** · _feat_ · `icons/equipment/neck/necklace-astrology-moon-gold.webp`  
  Forewarned has no limit on the number of allies you may brief, and briefing takes 1 minute.  
  **Icon brief** (Stargazer — Wide Vigil): A lantern of starlight held high, its warm circle widening outward to cover many small shield-emblems of allies.
#### 12th

- **Cascade** · _feat_ · `icons/commodities/cloth/thread-spindle-grey.webp`  
  You gain Twin Fates (§4.13) now, affecting one of its targets. From 15th level, when the class feature arrives, Twin Fates affects up to three of its targets instead of two.  
  **Icon brief** (Stargazer — Cascade): A single silver fate-thread splitting into a branching waterfall of threads, gold and purple strands cascading down onto several small target marks at once.
- **Long Now** · _feat_ · `icons/magic/time/clock-spinning-gold-pink.webp`  
  Your Auguries whose Duration line reads 1 minute last 10 minutes . A duration inside a degree of success, such as Coiling Doubt 's critical failure, does not change.  
  **Icon brief** (Stargazer — Long Now): An hourglass stretched tall and thin, its sand falling very slowly, a single minute-mark on its side multiplied into ten silver lines.
- **Prophesied Ally** · _feat_ · `icons/commodities/cloth/thread-spindle-pink.webp`  
  Choose one ally during your Night Vigil. Fortune's Thread used on that ally does not consume your reaction, once per round. Your Night Vigil card offers the choice.  
  **Icon brief** (Stargazer — Prophesied Ally): A silver fate-thread tied between a star and a shield-shaped ally emblem, a loop of thread looping freely without breaking.
#### 14th

- **Echo of the Unmade** · _feat_ · `icons/magic/defensive/illusion-evasion-echo-purple.webp`  
  When you use Unmake the Moment , you may also grant one ally the memory of the erased round. They keep it; everyone else does not.  
  **Icon brief** (Stargazer — Echo of the Unmade): A shattered moment of glass reassembling, one shard kept glowing in a second hand, a faint ghost-echo of the erased round inside it.
- **Inevitable** · _feat_ · `icons/magic/defensive/shield-barrier-blades-teal.webp`  
  Once per day, when a creature critically succeeds at a check against you, it gets a success instead. This is a misfortune effect. Offered as a button when it triggers.  
  **Icon brief** (Stargazer — Inevitable): A rising golden spark of triumph pressed down by a heavy dark star, the critical burst flattened into an ordinary flicker.
- **Star-Marked Enemy** · _feat_ · `icons/magic/water/strike-ice-blades.webp`  
  Choose one creature you can see. Until your next daily preparations, Coiling Doubt and Snarl against it do not require line of sight, only knowledge of its location. For Snarl, this replaces Fortune's Thread's requirement that you can see the creature. Target the creature and post this to chat to mark it.  
  **Icon brief** (Stargazer — Star-Marked Enemy): A silver star brand burned onto a red target emblem, a thread of light linking it across a wall to a far-off watching eye.
#### 16th

- **Foretold Escape** · _feat_ · `icons/sundries/gaming/gaming-set-dice.webp`  
  Once per day, when an attack roll against you would deal damage that reduces you to 0 Hit Points, you may Speak the Portent on that attack roll even though it has already been rolled, even if your Portent is spent, and even if a fortune or misfortune effect altered it — using a value of 1. It cannot be used on your own saving throw, or on damage no attack roll dealt.  
  **Icon brief** (Stargazer — Foretold Escape): An attacking blade stopping a hair's breadth short as a silver fate-thread loops around it, the target's outline stepping aside under a protective star.
- **Private Sign** · _feat_ · `icons/magic/nature/symbol-moon-stars-white.webp`  
  Add a fourteenth sign to the wheel: your own. Choose one Augury from §5.2 for it to grant and one existing sign's domain for it to govern; it should be an Augury you would not otherwise take. It rises only over you, on days the sky is Starless, and uses the standard aspect scaling. Its aspect is rolled in advance with the day, as part of the seven-day queue. Your two choices are asked when you…  
  **Icon brief** (Stargazer — Private Sign): A thirteen-sign zodiac wheel with a fourteenth, unique glyph added in personal violet ink, its star shining only over a single small point.
- **Written in Advance** · _feat_ · `icons/tools/scribal/ink-quill-pink.webp`  
  Spend 10 minutes. The next skill check you attempt within the hour is an automatic success (not a critical success). You already did this. Post this to chat after the 10 minutes.  
  **Icon brief** (Stargazer — Written in Advance): A book open to a page whose ink is already dry, the quill resting beside it and a sand-timer showing ten minutes already spent.
#### 18th

- **The Long Vigil** · _feat_ · `icons/sundries/lights/candle-lit-angelic.webp`  
  Rewrite the Ending 's cooldown drops to 3 days if you have not used it at all during the current adventure.  
  **Icon brief** (Stargazer — The Long Vigil): A lantern burning through many nights, its flame shaped like a star, a calendar of moons with only three crossed off before it can be lit again.
- **Two Skies** · _feat_ · `icons/equipment/neck/necklace-astrology-moon-blue.webp`  
  During your Night Vigil, read the sky twice . Both signs are ascendant for you and the allies you brief: you gain both Auguries of the Day. The second sign and its aspect are rolled in advance with the day, as part of the seven-day queue.  
  **Icon brief** (Stargazer — Two Skies): Two zodiac signs rising at once over the same horizon, one silver and one gold, their light overlapping in the middle.
- **Unbroken Chain** · _feat_ · `icons/magic/fire/flame-burning-chain.webp`  
  Unmake the Moment recharges on a 10-minute rest rather than on your Night Vigil, but no more than once per hour.  
  **Icon brief** (Stargazer — Unbroken Chain): A chain of silver links each shaped like a tiny clock face, unbroken, looping back on itself in a ring around a cracked moment of glass.
#### 1st

- **Astrological Sign** · _feat_ · `icons/sundries/gaming/dice-pair-white-green.webp`  
  Once per day, when you record your Portent, you may treat its value as any number within 3 of what you rolled. Your Night Vigil card offers the values when you have this feat.  
  **Icon brief** (Stargazer — Astrological Sign): A zodiac wheel with a d20 at its centre, a small silver dial nudging the die's number up or down by a few notches.
- **Cold Read** · _feat_ · `icons/magic/control/fear-fright-mask-orange.webp`  
  You can attempt a Deception check to invent a prophecy convincingly. The GM rolls a secret Astronomy Lore check for you at the same time; on a critical success, you were accidentally right , and the GM should treat what you said as true. Post this to chat: it rolls your Deception, and a secret Astronomy Lore check for the GM.  
  **Icon brief** (Stargazer — Cold Read): A theatrical mask half smiling, its hand gesturing at a crystal ball, behind which a real constellation accidentally lights up and matches the gesture.
- **Companion of the Watch** · _feat_ · `icons/creatures/birds/raptor-owl-flying-moon.webp`  
  You gain a familiar. It has the celestial trait and you gain one extra familiar ability, which must be an ability that gathers or carries information. Your familiar is made for you when you take this feat, with the celestial trait. The extra ability is counted on your sheet; pick one that gathers or carries information.  
  **Icon brief** (Stargazer — Companion of the Watch): A small celestial owl with star-speckled feathers perched on a brass telescope, a tiny scroll of notes tied to its leg.
- **Sky Reader** · _feat_ · `icons/sundries/flags/banner-standard-moon.webp`  
  Your Night Vigil takes 1 minute instead of 10, and Forewarned takes 1 minute instead of 10.  
  **Icon brief** (Stargazer — Sky Reader): A brass sextant swung quickly across the night sky, motion streaks and a tiny sand-timer showing the reading done in a moment.
- **Star-Touched Cantrip** · _feat_ · `icons/magic/nature/leaf-elm-sparkle-glow-green.webp`  
  You learn one additional occult cantrip, and may swap it during daily preparations. Your Night Vigil card offers the swap.  
  **Icon brief** (Stargazer — Star-Touched Cantrip): A small spark-spell cupped in a palm, sprinkled with stardust and gaining a single tiny silver star at its heart.
#### 20th

- **Cartographer of Endings** · _feat_ · `icons/tools/navigation/map-chart-tan.webp`  
  Once per day, ask the GM one yes-or-no question about the next 24 hours . The answer is true.  
  **Icon brief** (Stargazer — Cartographer of Endings): A map drawn on a night sky with a single road ending at a glowing gold point, a question mark of stars above answered by one bright yes/no star.
- **Fixed Sky** · _feat_ · `icons/sundries/gaming/dice-runed-tan.webp`  
  One of your Portents is always a 20 , and you may speak that one only once per week . Any other Portents you record, from Twin Portent or Second Portent , are still rolled and spoken daily.  
  **Icon brief** (Stargazer — Fixed Sky): A single star nailed in place with a silver pin at the centre of a rotating sky, the d20 beneath it locked on 20 while the other stars wheel.
- **The Sky Answers** · _feat_ · `icons/magic/fire/orb-lightning-sun.webp`  
  Once per day, when you would use Rewrite the Ending , you may instead use Unmake the Moment without spending its frequency, and Rewrite the Ending is not expended.  
  **Icon brief** (Stargazer — The Sky Answers): A night sky opening like a curtain to drop a single bright star into a waiting hand, a quill and a broken hourglass side by side below.
#### 2nd

- **Augury Adept** · _feat_ · `icons/magic/light/projectile-stars-blue.webp`  
  You learn one additional Augury.  
  **Icon brief** (Stargazer — Augury Adept): An augury scroll with one new sign-glyph blooming into light among the older ones, a silver star pinning it to the chart.
- **Patient Watcher** · _feat_ · `icons/magic/time/hourglass-tilted-glowing-gold.webp`  
  When you Refocus, you may also change one of your known Auguries. Post this to chat, or Refocus, to swap an Augury.  
  **Icon brief** (Stargazer — Patient Watcher): A meditating hand turning one card of a ring of augury cards face-down and another face-up, a quiet moon overhead.
- **Reckoning of Days** · _feat_ · `icons/environment/cosmos/planet-moon-blue.webp`  
  You can attempt an Astronomy Lore check to determine the sky of yesterday or of a day more than three days out, as far as the end of the seven-day queue, at the DCs in §8.4. Post this to chat to choose the day and roll.  
  **Icon brief** (Stargazer — Reckoning of Days): A row of seven small sky-discs like a calendar strip, one past day and one far-future day lit, an astrolabe sighting along them.
- **Thread of Warning** · _feat_ · `icons/commodities/cloth/thread-spindle-red-pink.webp`  
  Fortune's Thread can trigger on an initiative roll , even though positions are not yet set and you may not be able to see the roller. Fortune's Thread offers its next initiative roll , at any range.  
  **Icon brief** (Stargazer — Thread of Warning): A taut silver tripwire of fate thread across the start of a battle line, plucked and ringing with light before anyone moves.
- **Twin Portent** · _feat_ · `icons/commodities/currency/coin-embossed-cobra-gold.webp`  
  Roll two d20s at your Night Vigil and record both as separate Portents. You must spend both before your next Vigil or lose them, and Speak the Portent 's frequency becomes twice per day.  
  **Icon brief** (Stargazer — Twin Portent): Two d20s glowing side by side in a starry bowl, each with a different number, joined by a forked silver ribbon.
#### 4th

- **Borrowed Eyes** · _feat_ · `icons/magic/nature/moon-crescent.webp`  
  You can perform a Night Vigil through the senses of your familiar or a willing ally under an open sky, as long as you are within 1 mile of them. On a clouded night, your Vigil card asks the GM to let you read through them.  
  **Icon brief** (Stargazer — Borrowed Eyes): An owl's eye reflecting a starry sky, a silver thread of sight running from it to a distant closed human eye, constellations travelling along the thread.
- **Omen of Blades** · _feat_ · `icons/magic/holy/projectiles-blades-salvo-yellow.webp`  
  When you Snarl an attack roll and the attack still hits, you may spend 1 Focus Point to reduce the damage by 2 plus 2 per your Stargazer DC proficiency rank (so 4 at Trained, 6 at Expert, 8 at Master, 10 at Legendary). Offered as a button when a Snarled attack hits.  
  **Icon brief** (Stargazer — Omen of Blades): A sword striking through a purple omen-orb, its edge dulled and slowed as the purple glow absorbs part of the blow, notches counting the damage saved.
- **Read the Room** · _feat_ · `icons/magic/perception/mask-stone-eyes-orange.webp`  
  Once per encounter, Sense Motive as a free action . Post this to chat to Sense Motive; once per encounter.  
  **Icon brief** (Stargazer — Read the Room): A single watching eye whose iris is a tiny constellation, faint coloured auras of intent rising from shadowy figures around it.
- **Widened Chart** · _feat_ · `icons/commodities/cloth/thread-spindle-white-grey.webp`  
  Chart the Course has a range of 120 feet and no longer requires you to see the creature, only to know where it is.  
  **Icon brief** (Stargazer — Widened Chart): A star chart unrolled very wide, a dotted line of course drawn from one edge to a target mark hidden behind a cloud.
#### 6th

- **Long Thread** · _feat_ · `icons/commodities/cloth/thread-spindle-light-green.webp`  
  Fortune's Thread's range increases by 30 feet.  
  **Icon brief** (Stargazer — Long Thread): A silver fate-thread uncoiling far across a starry field from a spindle, a ruler-like measure of extra distance glowing along its length.
- **Prophecy's Weight** · _feat_ · `icons/magic/control/fear-fright-mask-yellow.webp`  
  You can Demoralize using Astronomy Lore, at 60 feet, with no auditory or visual requirement. (The Herald gets this at 5th; this feat exists for everyone else.) Use this to Demoralize your target with Astronomy Lore.  
  **Icon brief** (Stargazer — Prophecy's Weight): A pointing hand of starlight casting a long shadow of a doom-glyph over a cowering foe, ominous constellation lines pressing down.
- **Second Chance at Fate** · _feat_ · `icons/skills/trades/gaming-gambling-dice-gray.webp`  
  Once per day, when a creature within 30 feet critically fails a check, you may have it reroll and use the new result. This is a fortune effect. You might want it to succeed. Offered as a button when it triggers.  
  **Icon brief** (Stargazer — Second Chance at Fate): A d20 showing a cracked 1 being rerolled by a silver hand, a second die mid-air glowing with a new chance.
- **Sky Anchor** · _feat_ · `icons/sundries/books/book-turquoise-moon.webp`  
  You can perform a Night Vigil with no sky at all. Clouded Sky never applies to you.  
  **Icon brief** (Stargazer — Sky Anchor): An anchor cast from silver starlight sinking through thick grey clouds, its chain fastened to an unseen star beyond them.
#### 8th

- **Conjunction** · _feat_ · `icons/magic/light/projectiles-star-purple.webp`  
  Your focus pool increases to 3 Focus Points , the game's maximum.  
  **Icon brief** (Stargazer — Conjunction): Three planets aligning in a straight line across a dark sky, their light merging into one brilliant point, three focus pips glowing beneath.
- **Doubled Reading** · _feat_ · `icons/magic/nature/root-vine-beanstalk-moon.webp`  
  Once per day you may take the better of two Auguries of the Day by reading both today's sign and tomorrow's. Your Night Vigil card offers tomorrow's Augury.  
  **Icon brief** (Stargazer — Doubled Reading): Two zodiac wheels overlapping like a Venn diagram — today's silver, tomorrow's pale gold — the brighter overlap chosen.
- **Second Portent** · _feat_ · `icons/equipment/neck/necklace-simple-bead-dice.webp`  
  You may Speak the Portent twice per day. If you also have Twin Portent , you may speak three times, and you record three Portents.  
  **Icon brief** (Stargazer — Second Portent): Two prophecy scrolls unrolling side by side, each sealed with a star-wax seal showing a different number.

### stargazer-journals (1)

- **The Stargazer: Handbook** · _journal_ · `icons/environment/cosmos/astronomy-planetary-orbits.webp`  
  You read the sky, and the sky is not kind. Every dawn one of thirteen signs rises with an aspect — Quiet, Benefic, Retrograde, Malefic or Exalted — and it tilts one narrow domain for everyone under it, the ogre in the cave included. Nobody else at the table knows what today is. You do. Mechanically: 8 Hit Points per level, expert Perception, expert Will, trained Fortitude and Reflex, simple…  
  **Icon brief** (Stargazer — Handbook): A heavy blue tome embossed with a thirteen-sign zodiac wheel in silver, a ribbon bookmark of fate-thread, faint stars glowing through its cover.

### stargazer-macros (1)

- **Read the Sky** · _script_ · `icons/tools/navigation/sextant-steel-blue.webp`  
  Macro:  
  **Icon brief** (Stargazer — Read the Sky (macro)): A brass sextant aimed at a single rising zodiac sign on the horizon, the sign's glyph lit and its aspect colour glowing around it.

## Created at runtime by scripts

These have no compendium entry; their icon is hard-coded in the script.

- **Sympathetic Growth (effect)** · The Assimilator · `icons/magic/life/heart-area-circle-red-green.webp` · `scripts/assimilator/feats.mjs`  
  Effect an Assimilator lends an ally: half of one of its resistances, for 10 minutes.  
  **Icon brief** (Assimilator — Sympathetic Growth): A living membrane of red-and-green tissue grafting from one hand onto another, a shared resistance glyph pulsing in both.
- **Wall of Me (hazard actor)** · The Assimilator · `icons/environment/settlement/city-wall.webp` · `scripts/assimilator/feats.mjs`  
  A wall of the Assimilator's own flesh placed on the map (HP 5×level, Hardness = level).  
  **Icon brief** (Assimilator — Wall of Me): A wall built of fleshy chitin plates and sinew instead of bricks, veins pulsing across its surface, an eye or two blinking in the mortar.
- **Assimilated: … (effect)** · The Assimilator · `icons/magic/life/cross-worn-green.webp` · `scripts/assimilator/feats.mjs`  
  A trait/resistance taken from a creature, held for the day or permanently.  
  **Icon brief** (Assimilator — Assimilated): A stolen trait drawn as a glowing glyph being absorbed into green-veined skin, tendrils wrapping it, a faint outline of the creature it came from.
- **The Thing That Wears … (NPC actor)** · The Assimilator · `icons/creatures/abilities/mouth-teeth-long-red.webp` · `scripts/assimilator/feats.mjs`  
  The symbiont split off as its own creature, using the Carapace Strike.  
  **Icon brief** (Assimilator — The Thing That Wears): A mass of glistening carapace and long red teeth peeling away from an empty humanoid outline, standing on its own.
- **Eat the World: … (effect)** · The Assimilator · `icons/magic/unholy/orb-hands-pink.webp` · `scripts/assimilator/feats.mjs`  
  An eaten item turned into a temporary Mass grant and ability.  
  **Icon brief** (Assimilator — Eat the World): A pink-purple orb clutched in clawed hands, the shape of an eaten object dissolving inside it into raw growth-energy.
- **Cosmo (spellcasting entry)** · The Saint · `icons/magic/light/explosion-star-glow-orange.webp` · `scripts/cosmo.mjs`  
  The Saint's Technique spellcasting entry, created on the sheet.  
  **Icon brief** (Saint — Cosmo): A burning orange-gold star of cosmo exploding outward from a clenched fist, a faint constellation of lines behind it.
- **Sky tracker blank icon** · The Saint · `icons/magic/light/explosion-star-glow-silhouette.webp` · `scripts/sky/tracker.mjs`  
  Fallback icon for the sky tracker when no sign is set (Starless sky).  
  **Icon brief** (Saint — Starless sky): An empty dark sky with only the faint outline of a star — no constellation, a hollow silhouette waiting to be filled.
- **Reiatsu (spellcasting entry)** · The Soulbound · `icons/magic/light/explosion-star-glow-blue.webp` · `scripts/soulbound/reiatsu.mjs`  
  The Soulbound's Release Technique / Kidō spellcasting entry.  
  **Icon brief** (Soulbound — Reiatsu): A towering pillar of blue spiritual pressure flaring upward from a sword's guard, the air distorting around it.
- **Star Chart (spellcasting entry)** · The Stargazer · `icons/magic/light/explosion-star-glow-blue.webp` · `scripts/stargazer/star-chart.mjs`  
  The Stargazer's Augury spellcasting entry.  
  **Icon brief** (Stargazer — Star Chart): An unrolled star chart of indigo vellum, constellations linked by silver lines, a blue star blazing where today's Augury is marked.
- **Fixed Point (…) (effect)** · The Stargazer · `icons/magic/time/hourglass-tilted-gray.webp` · `scripts/stargazer/auguries.mjs`  
  A fixed-point effect pinning one roll type in place.  
  **Icon brief** (Stargazer — Fixed Point): A tilted grey hourglass pinned in place by a silver nail of starlight, its sand frozen mid-fall.
- **Omen of Blades (effect)** · The Stargazer · `icons/magic/unholy/orb-glowing-purple.webp` · `scripts/stargazer/feats.mjs`  
  An omen placed on a target by spending Focus.  
  **Icon brief** (Stargazer — Omen of Blades): A purple omen-orb hovering before a creature, a sword's edge slowed and dulled as it passes through the glow.
- **…'s Watcher (familiar actor)** · The Stargazer · `icons/creatures/birds/owl-flying-white.webp` · `scripts/stargazer/feats.mjs`  
  The Stargazer's watching familiar (an owl).  
  **Icon brief** (Stargazer — Watcher familiar): A white owl in flight with star-speckled wings, its eyes reflecting two tiny constellations.
- **Foregone Conclusion (effect)** · The Stargazer · `icons/magic/unholy/orb-glowing-purple.webp` · `scripts/stargazer/paths.mjs`  
  Effect marking an attacker whose outcome was foreseen.  
  **Icon brief** (Stargazer — Foregone Conclusion): An attacker's outline caught in a purple orb, its swing already drawn as a faded afterimage of the outcome.
- **Written Down: … (effect)** · The Stargazer · `icons/sundries/books/book-embossed-blue.webp` · `scripts/stargazer/paths.mjs`  
  A briefing written down and shared with allies in earshot.  
  **Icon brief** (Stargazer — Written Down): A small blue notebook open on a page of prophecy notes, copies of the page fluttering out to allies.
- **Fortune's Thread: Guide / Twin Fates (fortune)** · The Stargazer · `icons/magic/light/explosion-star-glow-yellow.webp` · `scripts/stargazer/threads.mjs`  
  A fortune thread woven onto an ally.  
  **Icon brief** (Stargazer — Fortune's Thread (guide)): A golden fate-thread looped gently around an ally's wrist, a bright yellow star at the knot pulling the roll upward.
- **Fortune's Thread: Snarl / Twin Fates (misfortune)** · The Stargazer · `icons/magic/unholy/orb-glowing-purple.webp` · `scripts/stargazer/threads.mjs`  
  A misfortune thread woven onto an enemy.  
  **Icon brief** (Stargazer — Fortune's Thread (snarl)): A purple-black thread snarled into a tangle around an enemy's hand, a dim purple orb weighing the roll down.
- **Portent: … (effect)** · The Stargazer · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp` · `scripts/stargazer/threads.mjs`  
  A stored portent value to be swapped in for a roll.  
  **Icon brief** (Stargazer — Portent): A teal-ringed eye with a number glowing in its pupil, the stored portent waiting to replace a roll.
- **Immune: The Last Thing You See (effect)** · The Stargazer · `icons/magic/perception/eye-ringed-glow-angry-small-teal.webp` · `scripts/stargazer/threads.mjs`  
  Temporary immunity after resisting The Last Thing You See.  
  **Icon brief** (Stargazer — immune to The Last Thing You See): A teal eye closed behind a raised hand, a cracked vision-shard falling away harmlessly.
