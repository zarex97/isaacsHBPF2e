# Pathfinder 2e — Every Canon Class, and What Makes It Distinct

**Purpose of this document:** design reference for homebrew. Before building a new class, you need to know which mechanical niches are already occupied and *how* they're occupied, so your new class isn't a reskin of something Paizo already printed.

**Scope:** all 29 currently published PF2e classes (Remaster-era), as listed on Archives of Nethys as of September 2026. Includes the *Battlecry!* classes (Commander, Guardian) and the *Impossible Magic* classes (Necromancer, Runesmith, plus the remastered Magus and Summoner).

**Homebrew addendum:** the four built classes of *Isaac's Homebrew* — **Saint**, **Soulbound**, **Assimilator** and **Stargazer** — are added after the canon entries, in the same format, under [Homebrew Classes](#homebrew-classes-isaacs-homebrew). Each has an **Overlap check** in place of the canon entries' adjacency note: which canon classes it borders, and where it crosses into their ground. They are described as their guides write them. Design critique is kept out of this document on purpose and lives in `homebrew-class-critique.md` beside it.

*Naming note:* the canon adjacency notes below were written while the Soulbound's working title was **Soul Reaper**. Soul Reaper is now one of the Soulbound's three Lineages, so read "the Soul Reaper" in those notes as "the Soulbound".

**How to read each entry:**
- **How it plays** — the actual turn-to-turn loop, the resource you're managing, what your action economy looks like.
- **What makes it different** — the mechanical territory it owns, and the classes it's most likely to be confused with.

---

## Quick Reference Table

| Class | Key Attribute | HP/Level | Core Engine | Subclass Name |
|---|---|---|---|---|
| Alchemist | Int | 8 | Versatile vials → free consumables | Research Field |
| Animist | Wis | 8 | Attuned apparitions → divine spells + vessel spells | Practice |
| Barbarian | Str | 12 | Rage | Instinct |
| Bard | Cha | 8 | Occult spontaneous + compositions | Muse |
| Champion | Str/Dex | 10 | Defensive reaction + sanctification | Cause |
| Cleric | Wis | 8 | Divine prepared + font | Doctrine |
| Commander | Int | 8 | Prepared tactics + banner | (none; folio) |
| Druid | Wis | 8 | Primal prepared | Order |
| Exemplar | Str/Dex | 10 | Divine spark rotating between ikons | Epithet/Ikons |
| Fighter | Str/Dex | 10 | Best proficiency + press feats | (none) |
| Guardian | Str | 12 | Taunt + Intercept Attack + armor resistance | (none) |
| Gunslinger | Dex | 8 | Reload cycle + deeds | Way |
| Inventor | Int | 8 | Innovation + Overdrive/Unstable | Innovation |
| Investigator | Int | 8 | Devise a Stratagem (pre-rolled attack) | Methodology |
| Kineticist | Con | 8 | Impulses (no spell slots) | Element(s) |
| Magus | Str/Dex | 8 | Spellstrike + Arcane Cascade | Hybrid Study |
| Monk | Str/Dex | 10 | Stances + Flurry of Blows | (none) |
| Necromancer | Int | 8 | Occult prepared + disposable thralls | Fatal Method / Grim Fascination |
| Oracle | Cha | 8 | Divine spontaneous + Cursebound escalation | Mystery |
| Psychic | Int/Cha | 6 | Few slots, huge amped cantrips | Conscious/Subconscious Mind |
| Ranger | Str/Dex | 10 | Hunt Prey + edge | Hunter's Edge |
| Rogue | Dex (varies) | 8 | Sneak Attack + off-guard generation | Racket |
| Runesmith | Int | 8 | Trace/Etch runes → Invoke Rune | (none) |
| Sorcerer | Cha | 6 | Most slots, spontaneous, any tradition | Bloodline |
| Summoner | Cha | 10 | Shared HP eidolon, split action economy | Eidolon |
| Swashbuckler | Dex | 10 | Panache → finisher | Style |
| Thaumaturge | Cha | 8 | Exploit Vulnerability + implements | Implement |
| Witch | Int | 6 | Familiar-taught spells + hexes | Patron |
| Wizard | Int | 6 | Prepared arcane + drain/thesis | School/Thesis |
| *Saint (HB)* | Str/Dex | 10 | Rankless focus Techniques + the day's Sky | Gold Cloth |
| *Soulbound (HB)* | Str/Dex | 10 | Released weapon + focus that refills by fighting | Lineage × Spirit |
| *Assimilator (HB)* | Str/Dex | 10 | Substrates fed to Depth → Mutations | Instinct (emergent) |
| *Stargazer (HB)* | Wis | 8 | Reaction ±d20 + daily forecast + Auguries | Stargazer's Path |

---

## Alchemist

**Key Attribute:** Intelligence · **HP:** 8 · **Source:** Player Core 2

**How it plays.** The alchemist is the only class whose combat power lives almost entirely in disposable objects it manufactures for free. Each day you refill a pool of *versatile vials* (scaling with level and Intelligence), and any vial can be converted, with the two-action Quick Alchemy activity, into any alchemical item whose formula you know — a bomb, an elixir, a mutagen, a poison — that lasts only until the end of your next turn. Your turn loop is therefore: convert a vial, throw or drink the result, repeat. You regain vials during combat by spending an action to retrieve them, so there is a genuine tempo decision every round between refueling and acting. Bombs use your class DC and your attack proficiency, so they scale independently of weapon runes; elixirs and mutagens let you act as an emergency healer or a party buff battery. Chirurgeons treat Crafting as Medicine and become the party's out-of-combat medic; bombers get splash and area denial; mutagenists drink their own products to become a temporary bruiser; toxicologists apply debilitating poisons to allies' weapons.

**What makes it different.** No other class converts a renewable daily resource into arbitrary *items* that anyone at the table can use. That is the key: alchemist output is transferable. You can hand a healing elixir to the fighter or coat the rogue's dagger in poison. Where a Kineticist's power is locked inside their own body and a Wizard's inside their own actions, the Alchemist is a logistics engine for the whole party. The trade-off is severe action taxation — most of your good turns cost the full three actions — which is the tension the class is built around.

**Adjacency note (for the Soul Reaper).** Alchemist proves that a class can carry its power in transferable resources. If a homebrew produces something other characters can use, that is genuinely novel design space — but it also means the class must be individually weaker to compensate.

---

## Animist

**Key Attribute:** Wisdom · **HP:** 8 · **Source:** War of Immortals

**How it plays.** The animist is a divine caster who negotiates with spirits — *apparitions* — rather than commanding a deity. Each day you attune to a set of apparitions drawn from your known list; the apparitions you're attuned to determine which spells are added to your prepared repertoire and which *vessel spells* (the animist's focus spells) you can cast. One apparition is your primary attunement, granting a stronger benefit, and you can shift which apparition is primary over the course of the day, so your loadout is not a single locked decision at breakfast. In play this makes you a rotating toolkit: a healer with one apparition set, a battlefield controller with another, a debuffer with a third. Your *practice* (subclass) determines your armor and weapon training and whether you lean toward frontline spirit-warrior, medium-style channeling, or ritual support.

**What makes it different.** The animist's signature is *mid-day flexibility with pre-committed structure*. Prepared casters lock their list in the morning; spontaneous casters have a fixed repertoire forever. The animist prepares a frame and then re-weights it as the day develops, which is a third answer to PF2e's central casting question. The apparitions also give the class a strong roleplaying pressure other casters lack: you have a small crowd of opinionated entities riding along with you, each with its own wants, so your daily attunement is a negotiation and not just an inventory decision. Thematically it is the class that most directly handles "I am a channel for other beings" — worth noting when designing anything spirit-adjacent.

**Adjacency note (for the Soul Reaper).** Animist already occupies 'I host and negotiate with spirits' as a divine caster. A homebrew whose weapon is an opinionated spirit needs a different mechanical expression: one bound spirit rather than a rotating stable, and combat expression rather than spell access.

---

## Barbarian

**Key Attribute:** Strength · **HP:** 12 · **Source:** Player Core 2

**How it plays.** You spend one action to Rage and then hit things very hard for the rest of the encounter. Rage grants temporary Hit Points, bonus damage on melee Strikes, and a −1 penalty to AC; you can't Rage again for 1 round after it ends, and you can't use concentrate actions while raging unless a feat says otherwise. With 12 HP per level and the largest temporary HP cushion in the game, you are the class that expects to be hit and to keep swinging. Your *instinct* defines your flavor and your added damage rider: dragon (elemental breath and bonus energy), giant (huge weapons and reach), animal (unarmed savagery), fury (pure weapon skill), spirit (attacks that harm the incorporeal), superstition (enormous save bonuses against magic, but you can't be the target of allied spells).

**What makes it different.** Barbarian is the game's high-variance damage sponge: it trades AC for HP and raw numbers, and its resource — Rage — is an encounter-long on/off switch rather than a per-round decision. Compare the Swashbuckler, which also has an on/off state but requires you to *earn* it every combat and spend it on finishers; Rage is granted freely and simply persists. Compare the Fighter, which buys accuracy; the Barbarian buys damage-per-hit and durability instead. The class's real design identity is the anti-caster instinct (superstition) and the fact that its ceiling is achieved by ignoring defense on purpose.

**Adjacency note (for the Soul Reaper).** Rage is the closest existing analogue to a released power state: one action, lasts the encounter, big damage, real defensive cost. If a homebrew release state gives more than Rage does for the same cost, it is overtuned. Rage is also the reason a release should not simply hand out flat numeric bonuses; PF2e's math has very little room for them.

---

## Bard

**Key Attribute:** Charisma · **HP:** 8 · **Source:** Player Core

**How it plays.** A full occult spontaneous caster whose distinguishing feature is *compositions*: focus spells and cantrips, most of them one action, that buff the entire party in an aura. Courageous Anthem gives allies a status bonus to attacks and damage; other compositions grant temporary HP, movement, or debuffs to enemies. Because the signature buff is a single action and scales automatically, the bard is the most action-efficient support in the game — you can buff and cast a real spell in the same turn, every turn. Your *muse* shapes the rest: enigma leans into knowledge and true strike effects, maestro deepens the composition suite, polymath grabs spells from other traditions, warrior gives you martial training and lets you fight in the front rank.

**What makes it different.** The bard owns "constant, repeatable, action-cheap party buffing." Almost nothing else in PF2e grants a scaling status bonus to the whole party for one action every round. Clerics heal reactively, Commanders grant conditional reactions and repositioning, Marshals (an archetype) give a weaker aura — none of them provide the bard's stacking-with-everything +1/+1 that turns the party's entire damage output upward. The occult list also makes them the premier mind-affecting debuffer. Design note: if you build a homebrew that wants to buff allies constantly and cheaply, you are competing directly with the bard, and that is a hard fight.

**Adjacency note (for the Soul Reaper).** A soul-themed class can safely touch morale, fear, and presence effects as flavor, but it should not provide a repeatable scaling attack bonus to allies. That lane belongs to the bard, and duplicating it makes one of the two classes redundant at every table that has both.

---

## Champion

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Player Core 2

**How it plays.** A heavy-armor frontliner defined by a single powerful reaction that fires when an enemy harms an ally near you. Depending on your *cause*, that reaction punishes the attacker (Retributive Strike), softens the damage and lets your ally escape (Glimpse of Redemption), or frees the ally to move and strike (Liberating Step). You also get Lay on Hands, a focus spell that heals in one action and grants an AC bonus, and *sanctification* — a holy or unholy commitment that changes both your damage output and your restrictions. Champions must uphold their tenets or lose access to their powers until they atone, which is the only mechanical behavioral contract still baked into a Remaster class.

**What makes it different.** Champion is the game's premier *damage-reduction* defender: it doesn't stop enemies from attacking allies, it makes attacking allies cost the enemy something. Contrast with the Guardian, published later, which draws attacks toward itself and physically eats them. Champion is reactive punishment; Guardian is redirection and absorption. Champion also carries the best armor proficiency in the game combined with real divine magic and a healing button, which makes it the most self-sufficient defensive package. Its cost is offense: champion damage is unremarkable, and its action economy is spent on positioning to keep allies inside its reaction range.

**Adjacency note (for the Soul Reaper).** Champion demonstrates how PF2e handles a class with sworn duties and an oath-shaped identity. If a homebrew has a code (a duty to guide souls, a prohibition on harming the innocent), Champion's tenet structure is the precedent — but note that only Champion still enforces one mechanically, and modern design tends to keep such codes narrative rather than punitive.

---

## Cleric

**Key Attribute:** Wisdom · **HP:** 8 · **Source:** Player Core

**How it plays.** A prepared divine caster with the game's most important extra resource: the *divine font*, a pile of bonus heal (or harm) spells equal to 1 + your Charisma modifier per day, on top of normal slots. That single feature makes the cleric the default healer of PF2e — three-action Heal is an area burst that patches the whole party between fights and mid-fight. Your *doctrine* splits the class in two: cloistered clerics get better spell progression, more focus spells, and a domain-driven caster identity; warpriests get armor, weapon training, and a slower but real martial presence. You also get your deity's favored weapon and domain focus spells that thematically narrow your divine access.

**What makes it different.** No other class has the font. Every other healer in the game — Oracle, Animist, Bard with occult healing, Alchemist with elixirs — pays real resources to heal. The cleric heals for free, in bulk, in an area, and can still cast its actual spell list. Its second differentiator is deity-locked identity: your spell access, your weapon, and your restrictions all come from a specific entity in the setting, which is a much tighter roleplaying frame than the Oracle's mystery or the Animist's apparitions. In balance terms, the cleric is the class most likely to break an encounter budget by simply refusing to let anyone die.

**Adjacency note (for the Soul Reaper).** Anything that ushers souls to rest brushes against divine territory. The safest separation is scope: clerics channel a deity's power outward to heal and harm the living, whereas a soul-warden class should act on *spirits, remnants and the recently dead* — a specialist where the cleric is a generalist, with far less raw healing throughput.

---

## Commander

**Key Attribute:** Intelligence · **HP:** 8 · **Source:** Battlecry!

**How it plays.** You carry a *banner* that grants allies within 30 feet a status bonus to Will saves and DCs against fear, and you prepare a small set of *tactics* each day from a larger folio. Tactics are pre-drilled maneuvers your squadmates (2 + Int modifier allies you instructed during daily preparations) can execute when you signal them — repositioning the party, granting Strikes, coordinating flanks, opening reactive attacks. Drilled Reactions lets you hand an ally an extra reaction once per round, which is the single most valuable thing the class does: it breaks PF2e's one-reaction-per-round rule for your whole party. You're a lightly armored Intelligence martial with expert Perception, standing where you can see the field and spending your turn making everyone else's turn better.

**What makes it different.** The Commander is the only class that manipulates *other players' action economy* as its core loop, and the only one that prepares its abilities in a folio-and-drill structure rather than through slots or focus. Bards buff numbers; Commanders grant actions and reactions. Because tactics require willing allies who were briefed in advance, the class also creates real out-of-combat texture — your daily prep is a party meeting. Note the hard limiter: a character can respond to only one tactic per round regardless of source, which stops the class from multiplying itself.

**Adjacency note (for the Soul Reaper).** Commander shows the ceiling on granting other characters actions. Keep a homebrew well clear of that: giving allies extra reactions or free Strikes is one of the strongest things a class can do in PF2e, and it is now explicitly the Commander's territory.

---

## Druid

**Key Attribute:** Wisdom · **HP:** 8 · **Source:** Player Core

**How it plays.** A prepared primal caster with the broadest utility list in the game — healing, elemental damage, terrain manipulation, summoning, and shapeshifting all live on the primal list. Your *order* is a genuine build fork rather than a flavor tag. Animal order gives you an animal companion and turns you into a pet class with spells attached. Leaf order pushes healing and plant control. Storm order gives you a damaging aura and flight-adjacent mobility. Untamed order gives you Untamed Form (the Remaster name for wild shape), a focus spell that turns you into a battle-form creature with fixed attack and AC numbers, letting a caster spend a round transforming and then fight as a martial for the rest of the encounter. Druids also take an anathema — respecting the natural order, refusing to wear metal armor — that shapes gear choices.

**What makes it different.** Battle forms are the druid's exclusive territory in the Remaster core: no other class turns into a bear as a repeatable, focus-fueled combat mode. Beyond that, the druid is the primal generalist — the class you bring when you don't know what problem you'll face. Its distinction from the cleric is tradition and structure: the cleric heals better and burstier, the druid controls terrain and battlefield shape better. Its distinction from the ranger, the other nature class, is total: druid is a caster with a nature aesthetic, ranger is a martial with tracking.

**Adjacency note (for the Soul Reaper).** Untamed Form is the incumbent transformation mechanic and it works by replacing your statistics wholesale with a battle form's fixed numbers. A homebrew release state should avoid battle-form statistics entirely and instead modify the weapon and grant new actions, which keeps gear and runes relevant.

---

## Exemplar

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** War of Immortals (Rare)

**How it plays.** You carry a fragment of divinity — your *spark* — that lives inside one of your three *ikons* at a time. Ikons are personal legendary objects: a weapon, a piece of gear, or a part of your own body (your eyes, your scars, your voice). Each ikon has an *immanence* (a passive benefit that's active only while your spark is inside it) and a *transcendence* (a powerful action you can take through it, which immediately ejects your spark into a different ikon). The result is a rotation puzzle: your turn is spent deciding which passive you want running, which mighty deed you want to perform now, and where the spark will land afterward. Shift Immanence lets you move the spark without spending it. Your *epithet* adds a rider to every transcendence you use.

**What makes it different.** This is the closest existing class to a "signature legendary weapon" fantasy, and anyone homebrewing a soul-weapon class must reckon with it. The exemplar's distinguishing mechanic is the *forced rotation*: power is not a pool you spend down, it's a single token you keep moving, so the class is about sequencing rather than budgeting. Compare the Kineticist, which also has no spell slots but uses a gate/overflow structure, and the Magus, which has real slots. The Exemplar is also explicitly mythic in tone — its power comes from being personally legendary, not from a god, a patron, or study.

**Adjacency note (for the Soul Reaper).** Exemplar is the closest existing 'legendary personal weapon' class and the one a soul-weapon homebrew must most carefully distinguish itself from. Its structure is rotation between three ikons; a homebrew should instead use a single escalating weapon with release states, which is a genuinely different decision space.

---

## Fighter

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Player Core

**How it plays.** You have the best weapon proficiency in the game at every level — expert at 1st, legendary by 19th, one full step ahead of everyone else — and a feat list built around exploiting it. Your turn is usually a two-action attack activity plus positioning: Double Slice, Power Attack, Snagging Strike, Combat Grab, Knockdown, Lunge. Attack of Opportunity at 1st level makes you the default answer to enemies who want to move around the battlefield or cast in melee. Fighters have no subclass; instead, your weapon group choice and feat selection *are* your subclass, and the class supports sword-and-board, two-handed, dual-wield, archery, and grappling builds with roughly equal quality.

**What makes it different.** Fighter owns *accuracy*. In a system where a +1 to hit is enormous and crits double damage, being permanently one proficiency step ahead is the single strongest martial feature in PF2e. Every other martial has to buy its damage with a resource, a state, or a condition; the fighter just hits more often and crits more often, with no bookkeeping. That is also its design weakness as a comparison point: fighter is the baseline. When you build a homebrew martial, the correct question is not "is it as accurate as a fighter" (it shouldn't be) but "what does it get instead of the fighter's accuracy?"

**Adjacency note (for the Soul Reaper).** Fighter sets the accuracy baseline. A homebrew martial should be trained at 1st and expert at 5th, reaching master around 13th and stopping there — matching Fighter's progression is a red flag unless the class gives up something equally large.

---

## Guardian

**Key Attribute:** Strength · **HP:** 12 · **Source:** Battlecry!

**How it plays.** You wear heavy armor, and while wearing medium or heavy armor you gain resistance to physical damage equal to 1 + half your level — a flat, always-on damage reduction unlike anything else in the game. Taunt (one action) marks an enemy; if that enemy takes a hostile action that hits your allies but not you, it takes a penalty and becomes off-guard. Intercept Attack (reaction) lets you Step to an ally within 10 feet and take their physical damage instead of them. You get an extra reaction on initiative (Ever Ready) and, at 7th level, another one at the start of every turn, usable only for guardian reactions — so you're a defender with two or three defensive reactions per round.

**What makes it different.** Guardian is the game's only true *aggro-and-absorb* tank. Every other "defender" in PF2e either punishes attackers (Champion) or controls positioning (Fighter with Attack of Opportunity). The Guardian actually redirects damage onto itself and then survives it through resistance and 12 HP per level. Its currency is reactions, and it is the only class that reliably has more than one per round. Its cost is offense — it's a weak damage dealer with no rider on its Strikes — and its identity depends entirely on standing between enemies and allies, which makes it a poor fit for skirmishing parties.

**Adjacency note (for the Soul Reaper).** Guardian claims the reaction-heavy protector role and the flat physical resistance gimmick. A homebrew that grants damage resistance as a passive class feature is competing here, and Guardian pays for its resistance with weak offense and heavy armor dependence.

---

## Gunslinger

**Key Attribute:** Dexterity · **HP:** 8 · **Source:** Guns & Gears (Uncommon)

**How it plays.** Firearms and crossbows in PF2e hit hard, crit brutally (fatal dice), and must be reloaded, so the gunslinger's core loop is a cadence problem: reload, aim, fire, reload. Singular Expertise gives you flat bonus damage with guns; your *way* provides a deed (a special action), an initiative-round free reload, and a signature style — the Way of the Drifter mixes melee and gunplay, the Sniper rewards patience and Aim actions from range, the Vanguard uses the gun as a bludgeon, the Triggerbrand hybridizes. Slinger's Reload activities fold reloading into another action, which is how you escape the cadence trap.

**What makes it different.** The gunslinger is built on a weapon category no other class is designed around, and its whole feat list exists to solve reload economy — a problem unique to it. It also has legendary proficiency with guns and crossbows only, making it the only class besides the fighter to reach legendary weapon proficiency. Where the fighter is broadly accurate, the gunslinger is narrowly devastating: enormous crit damage from fatal, with a fragile 8 HP frame and heavy reliance on positioning. If your homebrew involves a specific weapon type as its identity, this is the class that already proved the template.

**Adjacency note (for the Soul Reaper).** Gunslinger is the model for building a class around one weapon. If your homebrew has a signature bonded weapon, look at how Gunslinger handles the failure case: what happens when the weapon is lost, disarmed, or unusable, and how the class stays functional anyway.

---

## Inventor

**Key Attribute:** Intelligence · **HP:** 8 · **Source:** Guns & Gears (Uncommon)

**How it plays.** You build one *innovation* — a weapon, a suit of armor, or a construct companion — and modify it over time with initial and later modifications. Overdrive (one action) is a Crafting check that grants bonus damage for the rest of the encounter, so your first turn usually starts the engine. Then you push your luck: many inventor feats are *unstable*, meaning you can use them, but afterward you take damage and can't use unstable actions again until you succeed at a flat check to reset. The class's fantasy is genuinely "my gear is experimental and might explode," and the mechanics honor it.

**What makes it different.** The unstable mechanic is unique: a self-damaging, risk-gated set of powerful actions with a flat-check recovery, rather than a per-day or per-encounter budget. The innovation system is also the only feature that lets you build and permanently upgrade one specific piece of equipment as a class feature rather than through the treasure economy. Compared to the Alchemist, the other Intelligence gadget class: the alchemist mass-produces disposables for the party, the inventor perfects one irreplaceable thing for itself. Compared to the Summoner, the construct innovation is a companion but a much simpler one, with none of the shared-HP tension.

**Adjacency note (for the Soul Reaper).** Unstable is the cleanest self-cost mechanic in the game. Any homebrew transformation that should hurt to use — a release state with backlash, a strain after a big form — should be priced against unstable actions: real damage, a real lockout, and a flat check to recover.

---

## Investigator

**Key Attribute:** Intelligence · **HP:** 8 · **Source:** Player Core 2

**How it plays.** Devise a Stratagem is the class: you spend an action to roll a d20 *before* you decide what to do, and if you attack that target this turn you may substitute the pre-rolled result and add Intelligence to damage. Knowing the roll in advance transforms every turn into an information problem — high roll means commit to the attack, low roll means Recall Knowledge, reposition, or use a skill instead. Your *methodology* grants a signature skill and an ability tied to it, plus Pursue a Lead, which gives a persistent bonus on checks relating to a subject you're investigating. Out of combat, the investigator is the best pure skill class in the game.

**What makes it different.** Pre-rolling the attack is unique in PF2e and it changes the psychology of a turn more than any other single mechanic. It also makes the investigator the only martial-adjacent class rewarded for *not* attacking three times: your first attack is the good one, and everything after should be skills. The overlap risk is with the Rogue, which shares 8 HP, skill focus, and precision damage — the split is that the rogue generates off-guard to enable Sneak Attack and takes many attacks, while the investigator takes one calculated attack and spends the rest of the turn on knowledge and utility.

**Adjacency note (for the Soul Reaper).** Investigator holds the pre-roll niche and the Intelligence martial niche. A soul-reading class that gains information about targets should express that as *conditions or riders*, not as a repeatable foreknowledge of the die, which is uniquely powerful and uniquely Investigator's.

---

## Kineticist

**Key Attribute:** Constitution · **HP:** 8 · **Source:** Rage of Elements

**How it plays.** You have no spell slots at all. Instead you choose one or more elements (air, earth, fire, metal, water, wood) and gain *impulses*: at-will magical actions that never run out. Your basic Elemental Blast is a repeatable ranged or melee attack, and your kinetic gate determines how many elements you channel and how they interact. *Overflow* impulses are your big plays — they're powerful, and using one shuts your gate until you spend an action to Channel Elements again, which is the class's only real resource tension. Constitution as the key attribute is unique and means your offense and your durability come from the same number.

**What makes it different.** The kineticist is the proof that PF2e can build a caster-feeling class with zero daily resources, and that makes it the go-to comparison for any homebrew that wants "unlimited signature powers." Its guardrails are worth studying: at-will impulses are individually weaker than spells of equivalent rank, the strongest ones cost you your gate state, and the class has no access to the utility breadth of a spell list. If your homebrew grants unlimited use of anything, the kineticist's power level is the ceiling you should be measuring against, not a spellcaster's slots.

**Adjacency note (for the Soul Reaper).** Kineticist is the benchmark for at-will powers. If a homebrew grants unlimited signature abilities, they must be measurably weaker than same-level spells and the strongest of them must cost a state (the way overflow closes the gate). Constitution as key attribute is also taken.

---

## Magus

**Key Attribute:** Strength or Dexterity · **HP:** 8 · **Source:** Impossible Magic

**How it plays.** Spellstrike is the whole class: you charge a spell into your weapon and deliver it with a Strike, so one attack roll resolves both. It's a two-action activity that must be recharged (one action, or via Arcane Cascade), which means the magus operates on a two-round rhythm — big alpha turn, recharge turn, big alpha turn. Arcane Cascade is a stance you enter after casting that adds bonus damage. You're a prepared arcane caster with roughly half a caster's slots, so every slot is precious and most of them exist to feed Spellstrikes. Your *hybrid study* decides the shape: laughing shadow for mobility, starlit span for Spellstriking at range, sparkling targe for shield-and-spell defense, inexorable iron for two-handed brutality.

**What makes it different.** Magus owns "one attack roll, two damage sources." Nothing else compresses a spell and a Strike into a single roll, and that compression — which doubles the spell damage on a critical hit — is the class's entire reason to exist. The trade is fragility (8 HP with martial expectations) and a punishing action economy that forces you to plan two turns ahead. For homebrew purposes: if your class puts magic *into* a weapon strike, you are in magus territory and you need a clearly different resolution mechanic, not just a different flavor.

**Adjacency note (for the Soul Reaper).** Magus is the single largest overlap risk for any sword-and-magic class. The line to hold: Magus fuses a *spell* into a Strike using a shared attack roll and real spell slots. A homebrew should either not cast spells at all, or keep magic and weapon strikes as separate actions with a different rhythm.

---

## Monk

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Player Core

**How it plays.** Flurry of Blows gives you two unarmed Strikes for one action, so your baseline turn produces more attacks than anyone else's. *Stances* are the monk's structural gimmick: one-action states that change your unarmed attack (crane stance for defense and jumping, tiger for bleeding lunges, mountain for AC and stability, dragon, wolf, and many more), with the constraint that entering one locks you out of entering another for a round. Monks have the best unarmored AC progression, the fastest movement, and a suite of ki-style focus spells (wholeness of body, wind jump, ki strike) available through feats. High mobility plus many small hits makes them excellent at chasing casters and exploiting weaknesses.

**What makes it different.** Monk owns *stances* as an organizing principle and owns the attack-count niche. Its damage per hit is low, so it wins by volume and by mobility — being where the enemy doesn't want you. Its distinction from the Fighter is proficiency versus positioning; from the Barbarian, precision versus mass. Design note for anyone building a martial-arts-adjacent class: stances are already a crowded design space (monk, magus, ranger, guardian, barbarian and swashbuckler all use them), so a stance-based homebrew needs a different reason to exist than "these are my fighting styles."

**Adjacency note (for the Soul Reaper).** Monk owns stances, unarmored AC scaling, and high mobility. A lightly armored spirit-swordsman will inevitably resemble a monk unless its stances are replaced by something structurally different — for instance, a one-way escalating release ladder instead of freely swappable stances.

---

## Necromancer

**Key Attribute:** Intelligence · **HP:** 8 · **Source:** Impossible Magic

**How it plays.** A prepared occult caster whose signature resource is *thralls*: level −1 mindless undead with 1 Hit Point that automatically fail every check and are automatically hit by everything. They exist to be spent. Create Thrall is a free grave cantrip; Command a Thrall (one action) makes one Stride, Strike using your spell attack modifier, or Interact. Thralls flank, they clog terrain, they trigger traps, they soak one hit each, and many of your *grave spells* consume them for stronger effects. Mastery of Life and Death lets you flip void and vitality damage freely and target both living and undead with effects normally restricted to one. Your *fatal method* decides whether you're a puppeteer building a thrall economy or a reaper in armor with a weapon.

**What makes it different.** The class solved minion-summoning without wrecking the action economy: thralls aren't minions, aren't summoned, and cost you an action each to command, so they scale horizontally (board presence, flanking, bodies) rather than vertically (damage). It's also the class that directly owns "manipulating the boundary between life and death" and "commanding the dead" in PF2e. **This is the most important overlap to watch for a soul-themed homebrew** — the Necromancer already owns souls-as-resource, void/vitality flipping, and undead command. Any soul-manipulating class you build must stake out different ground: the Necromancer manipulates *corpses and the dead as objects*, so a homebrew should look at souls as *identity, judgment, and passage* instead.

**Adjacency note (for the Soul Reaper).** The most important entry in this document for your purposes. Necromancer owns corpses, thralls, void/vitality flipping and undead command. A soul-reaper class must therefore treat souls as *people to be judged, guided, or cut free* rather than as material to animate, and should not command minions of any kind.

---

## Oracle

**Key Attribute:** Charisma · **HP:** 8 · **Source:** Player Core 2

**How it plays.** A spontaneous divine caster carrying a *mystery* — a domain of divine knowledge that grants you revelation spells and a matching curse. The Remaster reworked the curse into *cursebound*: casting revelation spells increases your cursebound value, which grants escalating benefits alongside escalating drawbacks, and you reduce it by refocusing. So the oracle's turn-to-turn tension is "how far do I push into my curse this fight?" Mysteries include battle (you become a martial), life (healing), flames, ash, bones, cosmos, lore, tempest — each with a distinct benefit-and-cost package. You're a full caster with fewer spells known than a sorcerer but with powerful, thematic focus spells layered on top.

**What makes it different.** Cursebound is a *voluntary escalating debuff for power* — the only mechanic of its kind in PF2e. Nothing else asks you to accept increasingly worse conditions in exchange for increasingly stronger effects within a single encounter. That escalation structure is directly relevant to any homebrew wanting a "power-up transformation with a cost," and the Oracle is the balance benchmark for it. Compared to the Cleric, the Oracle is worse at reliable healing and better at thematic burst; compared to the Sorcerer, it trades breadth for a strong per-mystery identity.

**Adjacency note (for the Soul Reaper).** Cursebound is the balance benchmark for any escalating power-up: each step forward grants a real benefit and imposes a real, worsening penalty that you cannot simply ignore, and clearing it takes a full Refocus. Copy the shape of that trade, not just the flavor.

---

## Psychic

**Key Attribute:** Intelligence or Charisma · **HP:** 6 · **Source:** Dark Archive

**How it plays.** The psychic has fewer spell slots than any other full caster, and compensates with *amped cantrips*. You have a pool of Focus Points and a set of psi cantrips; spending a Focus Point amps a cantrip, turning an at-will effect into something comparable to a real spell. So the psychic's loop is: cast amped cantrips as your main offense, refocus between fights, and hold your very limited slots for genuine emergencies. Unleash Psyche is the big button — for a short window your amps get significantly stronger, after which you're drained and slowed while you recover. Your *conscious mind* determines your cantrips and spell list; your *subconscious mind* determines how Unleash Psyche behaves.

**What makes it different.** Psychic is the only caster whose *cantrips* are the primary weapon, which makes it the most sustainable caster in a long day and the weakest in a single decisive nova. Unleash Psyche is also a clean model of a burst-transformation with a recovery penalty. And uniquely, psychic magic is *subtle*: no somatic components, no obvious casting, which makes it the game's stealth caster. At 6 HP with occult flavor, it is the most fragile class in the game.

**Adjacency note (for the Soul Reaper).** Unleash Psyche is the template for a timed super mode: a short window of significantly increased power, followed by an enforced recovery period with real penalties. Any once-per-day transformation should look at Unleash Psyche's duration, magnitude and aftermath before setting its own numbers.

---

## Ranger

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Player Core

**How it plays.** Hunt Prey (one action) designates a target; against that target you ignore part of your range increment penalty, track better, and gain the benefit of your *hunter's edge*. Flurry edge reduces your multiple attack penalty against your prey, making you the best multi-attacker in the game. Precision edge adds a burst of damage to your first hit each round. Outwit gives skill bonuses and AC against your prey. Rangers get a strong feat list of ambush, mobility, and companion options, and Animal Companion is a first-class ranger option, so "hunter plus beast" is fully supported.

**What makes it different.** The ranger owns *single-target focus*: an action tax up front that pays off across the encounter against one designated enemy. Nothing else has that structure. Its identity crisis in PF2e is real and worth understanding as a designer — flurry rangers overlap with monks and fighters, precision rangers overlap with rogues, companion rangers overlap with druids — and the class holds together because of the prey mechanic plus the best exploration-mode feat suite in the game. If you homebrew a "mark a target" ability, you're competing here.

**Adjacency note (for the Soul Reaper).** Hunt Prey is the incumbent 'designate one target' action. A homebrew marking mechanic needs a different payoff structure — for example, marking a soul rather than a body, and getting effects that ignore physical defenses rather than accuracy or damage bonuses.

---

## Rogue

**Key Attribute:** Dexterity (or a different one, depending on racket) · **HP:** 8 · **Source:** Player Core

**How it plays.** Sneak Attack adds precision damage whenever your target is off-guard, so the entire class is about *generating* the off-guard condition: flanking, Feinting, Hiding and striking from concealment, Tumbling Through, or using debuffs. Rogues get more skill increases than anyone (one per level), Surprise Attack for first-round off-guard, and debilitations at higher levels that let a successful Sneak Attack apply a lasting condition. Your *racket* changes your key attribute and your enabler: ruffian uses Strength and intimidation, scoundrel uses Charisma and Feint, thief uses Dexterity for damage, mastermind uses Intelligence and Recall Knowledge.

**What makes it different.** Rogue owns *conditional precision damage plus unmatched skill breadth*. The rackets are also the game's cleanest example of a subclass that changes the key attribute, which is a useful precedent if you want one homebrew class to support multiple stat builds. Its overlap with the Investigator is close but distinct in tempo; its overlap with the Swashbuckler is close but distinct in resource (rogue needs a *condition on the enemy*, swashbuckler needs a *state on itself*). The class is also the game's clearest statement that skills are a legitimate power budget: a rogue trades armor, hit points and weapon proficiency for the ability to be genuinely competent at nearly everything outside combat, and PF2e treats that as a fair exchange.

**Adjacency note (for the Soul Reaper).** Rogue owns precision damage tied to the off-guard condition and owns skill volume. A homebrew that adds flat bonus damage on conditional hits is competing with Sneak Attack, and Sneak Attack is a full d6 per two levels precisely because rogues have no other combat feature.

---

## Runesmith

**Key Attribute:** Intelligence · **HP:** 8 · **Source:** Impossible Magic

**How it plays.** You don't cast spells. You *apply* runes — either etched in advance during exploration (lasting indefinitely, limited to two at low level) or traced in combat (one action adjacent, two actions at 30 feet, lasting until the end of your next turn). Applied runes do something passively; then Invoke Rune (one action, from up to 30 feet, up to two runes at once) detonates them for their bigger effect and consumes them. So your loop is apply-apply-invoke, and skilled play means pre-etching before a fight and tracing to fill gaps mid-fight. Diacritic runes attach to other runes to modify them. You're a medium-armor martial with real weapon proficiency, so you're also swinging in melee between rune applications.

**What makes it different.** Runesmith is a *delayed-payload* class: you set up effects that pay out later, on your schedule, at a distance. Nothing else in PF2e uses a place-then-trigger economy as its core. It's also notable for having no subclass at all — your runic repertoire *is* your build. For a homebrew designer, the runesmith is the best modern template for "how to make a magic-adjacent class that isn't a spellcaster": a bounded known list, a class DC instead of a spell DC, and a distinct application-and-trigger action structure.

**Adjacency note (for the Soul Reaper).** Runesmith is the best template for non-spellcasting magic: a bounded known list, class DC instead of spell DC, and a distinctive apply-then-trigger action loop. A soul class that marks, binds, or severs is treading nearby ground and should avoid a place-and-detonate structure.

---

## Sorcerer

**Key Attribute:** Charisma · **HP:** 6 · **Source:** Player Core

**How it plays.** The most spell slots of any class, cast spontaneously from a fixed repertoire, with a *bloodline* that determines which of the four traditions you use. That last part is the important one: a draconic sorcerer is an arcane caster, an angelic sorcerer is divine, a fey sorcerer is primal, an aberrant sorcerer is occult. Signature spells let you heighten a chosen spell freely, which solves the spontaneous caster's usual rigidity problem. Bloodline focus spells and blood magic riders add small thematic effects whenever you cast one. Your turn is simple and powerful: cast the right spell, every round, more times per day than anyone else.

**What makes it different.** Sorcerer is the volume caster and the only class that can be *any* of the four traditions depending on subclass, which makes it structurally the most flexible caster chassis in the game. Against the wizard: sorcerer has more slots and less adaptability, wizard has fewer slots and can re-tool daily. Against the bard and oracle: sorcerer has less built-in support machinery and more raw casting. It is also the cleanest example of "magic as inheritance rather than study or devotion," which matters if your homebrew's power source is bloodline-like.

**Adjacency note (for the Soul Reaper).** Sorcerer demonstrates how a subclass can change the entire magical tradition a class uses. That is a useful pattern if a homebrew wants radically different subclass identities — but it also means 'my power is innate and inherited' is well covered already.

---

## Summoner

**Key Attribute:** Charisma · **HP:** 10 · **Source:** Impossible Magic

**How it plays.** You and your *eidolon* are one creature with two bodies. You share a Hit Point pool, share a multiple attack penalty, and — critically — share three actions between you. Each round you can take actions with yourself, with your eidolon, or split them; but the shared MAP means the eidolon attacking twice makes your attacks worse too. Act Together (one action) lets both of you do something at once, which is the class's key efficiency valve. You're a very limited spellcaster — one spell slot per rank — with your tradition set by your eidolon's type (angel, dragon, beast, construct, fey, undead, plant, elemental). Your eidolon does the fighting; you support, buff, and reposition.

**What makes it different.** The shared action economy is unique and it is *the* precedent for any homebrew where a second entity fights alongside you. Compare an Animal Companion (needs a Command action, has its own separate HP) or a Necromancer's thralls (disposable, no HP to speak of): the eidolon is a full second body with your survivability tied to it. Two bodies, one turn, one HP bar. If your homebrew has a manifested spirit that fights, the summoner is the class you must consciously differentiate from — the cleanest ways being to make the manifestation a *weapon* rather than a creature, or to make it temporary rather than persistent.

**Adjacency note (for the Soul Reaper).** Summoner is the class to consciously avoid if your homebrew manifests a spirit. The safest separation is to make the manifestation a *weapon or a state* rather than a creature with its own body and turn — the moment a second entity takes its own actions, you are rebuilding the eidolon.

---

## Swashbuckler

**Key Attribute:** Dexterity · **HP:** 10 · **Source:** Player Core 2

**How it plays.** You gain *panache* by doing something stylish — the trigger depends on your *style* (Battledancer uses Performance, Braggart uses Demoralize, Fencer uses Feint, Gymnast uses Athletics maneuvers, Wit uses Bon Mot). While you have panache you gain a speed bonus and access to *finishers*, which are big two-action attacks that spend your panache. So each combat is a cycle: earn panache with a skill action, spend it on a finisher, earn it again. Precise Strike adds flat damage while you have panache, and Opportune Riposte gives you a reactive attack when an enemy misses you.

**What makes it different.** Swashbuckler is the only class whose damage requires you to succeed at a *skill check* first. That makes it a martial that plays like a combo character and forces engagement with skill actions no other damage dealer needs. Compare the Barbarian (state granted for free), the Rogue (needs a condition on the enemy), and the Magus (needs a recharge). Swashbuckler's state must be re-earned constantly and is consumed by its own payoff, which is a genuinely different rhythm and a good model for any homebrew that wants a build-and-spend resource within a single combat.

**Adjacency note (for the Soul Reaper).** Swashbuckler is the model for an earn-and-spend in-combat resource, and it proves such a resource can be earned by doing something other than dealing damage. It also shows the necessary guardrail: the payoff (a finisher) ends your turn's attack sequence and empties the tank.

---

## Thaumaturge

**Key Attribute:** Charisma · **HP:** 8 · **Source:** Dark Archive

**How it plays.** Exploit Vulnerability (one action) is a Recall Knowledge check that identifies a target's weakness and then *applies* personal antithesis damage to it for the rest of the encounter, so your first turn is almost always "learn what this thing is, then punish it." You carry *implements* — a weapon, an amulet, a lantern, a mirror, a chalice, a tome, a wand, a bell, regalia — each granting a passive benefit plus an *initiate benefit* activated in combat, and you add more implements as you level. Esoteric Antithesis lets you invent a monster's weakness on the fly. You're a Charisma martial with light armor and a monster-hunter toolkit.

**What makes it different.** The thaumaturge owns "knowledge as a weapon": it's the only class that converts Recall Knowledge into direct damage, and the only one whose power comes from folklore, superstition, and symbolic objects rather than a tradition of magic. It is also the class with the most *held-item juggling* in the game, which is a real cost. For homebrew: if you want a class whose gimmick is identifying and exploiting the supernatural, this is the incumbent, and it's also the best example of a class DC-driven martial with occult flavor and no spellcasting.

**Adjacency note (for the Soul Reaper).** Thaumaturge already owns occult monster-hunting, symbolic objects, and knowledge-as-damage. A soul class overlaps in aesthetic but should stay away from Recall Knowledge-driven damage and from held-implement juggling, both of which are Thaumaturge's defining costs and rewards.

---

## Witch

**Key Attribute:** Intelligence · **HP:** 6 · **Source:** Player Core

**How it plays.** Your *patron* — some entity whose nature you may not fully understand — teaches you spells through your familiar. Mechanically you're a prepared caster whose tradition is set by the patron, and whose familiar is a required piece of equipment: it carries your spellbook-equivalent, gains familiar abilities each day, and if it's lost you're in trouble. *Hexes* are focus cantrips and focus spells with the hex trait, usable once per target per day, that debuff, curse, or support. Lessons add hexes and expand your spell access.

**What makes it different.** The witch owns the familiar-as-lifeline design: a small vulnerable creature that is mechanically load-bearing for your class, reconfigurable daily, and useful in exploration. The hex structure — targeted, once-per-target, focus-fueled — is also distinct from any other focus spell suite. Against the wizard: same prepared structure and Intelligence key, but the witch gets a familiar, hexes, and a chosen tradition, while the wizard gets more slots, schools, and a thesis. Against the sorcerer and oracle: same "power from elsewhere" flavor, opposite preparation structure. The witch's narrative hook is also unusually strong: your patron's identity and motives are deliberately left unresolved, so the class arrives with a built-in mystery the table can develop over a campaign rather than a fixed cosmology handed down at character creation.

**Adjacency note (for the Soul Reaper).** Witch shows how to make a class dependent on a second entity without giving that entity a combat role: the familiar is load-bearing, vulnerable and useful outside combat, but it does not fight. That is a viable model for a talking spirit bound to a weapon.

---

## Wizard

**Key Attribute:** Intelligence · **HP:** 6 · **Source:** Player Core

**How it plays.** The archetypal prepared arcane caster: a spellbook you can add to indefinitely, a full slot progression, and the ability to re-tool your entire loadout every morning. Your *arcane school* (in the Remaster: curriculum-based schools such as battle magic, civic wizardry, protean form, unified magical theory, and others) grants extra spell slots restricted to that school's spells plus school focus spells. Your *thesis* gives a structural perk — spell substitution to swap prepared spells mid-day, improved familiar attunement, staff nexus for extra staff charges, metamagical experimentation for free spellshape feats.

**What makes it different.** Wizard owns *adaptability*: the largest accessible spell library in the game plus the ability to reconfigure daily means a prepared wizard who knows what's coming is the strongest problem-solver in PF2e. The school slots also mean the wizard actually has more total slots than it appears. Its weaknesses — 6 HP, no armor, terrible when surprised — are the price. Against the sorcerer: study versus blood, flexibility versus volume. Against the witch: no familiar dependency, but no hexes either. One structural detail worth stealing for homebrew: the wizard's curriculum slots are extra resources that can only be spent on a narrow theme. Restricted bonus resources are an efficient way to give a class more to do each day without inflating raw power, because the restriction keeps the extra capacity inside the class's intended lane.

**Adjacency note (for the Soul Reaper).** Wizard defines the top of the casting curve. Any homebrew with spell-like abilities should be measured downward from here: fewer effects, narrower list, tighter action costs. If your class can solve as many problems as a wizard while also fighting in melee, it is too strong.

---

## Homebrew Classes (Isaac's Homebrew)

The four classes the module ships, from their current guides: Saint v4 (`Docs/saint-gold-cloth-guide-v4.md` plus the feats in `content/saint-feats`), Soulbound v1.4, Assimilator v1.3 and Stargazer v3.1. The Saint, Soulbound and Assimilator are costed at the standard 2100 BCS points. The Stargazer is costed at **2860, on purpose**, and that is stated in its entry rather than left for a reader to find. Two further ideas, the Breath Slayer (Kimetsu no Yaiba) and the Tarotist, appear in the HTML codex as unrated concepts and are not summarized here.

---

## Saint *(homebrew)*

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Isaac's Homebrew, guide v4

**How it plays.** An unarmed martial who wears a **Gold Cloth**: medium armor (+4 AC, Dex cap +1) summoned or dismissed with one Interact action. Fists are 1d6 agile finesse, made magical with +1 damage per die by Cosmo Strike, which stands in for handwraps. The Saint has no Flurry, so a normal turn is three ordinary unarmed Strikes plus at most one **Technique**. Techniques are rankless focus spells keyed to a Class DC, one gained at each of 1st, 6th, 11th and 16th. Every one heightens every two levels, so all four reach roughly 20d6 single-target or 10d8 area by 20th. The pool is 1 Focus Point, 2 at 7th and 3 at 13th. The subclass is one of **twelve Cloths**, one per zodiac sign. Each has a passive, its own four-Technique ladder and two boons, and they cover defense (Aries), control (Gemini, Virgo), removal (Cancer, Aquarius), several kinds of offense (Leo, Scorpio, Capricorn, Pisces) and a weapon-bearer (Libra, whose twelve paired weapons run 2–4 levels ahead of the rune curve). The engine is **the Sky**, a world-wide day-state that rolls one sign a day. On your sign (1 day in 13) you are *Ascendant*: your Ascendant Boon is active and your Techniques heighten as if you were 4 levels higher. On an Exalted day of your sign, the *Zenith*, which comes about 1 day in 130 or whenever the GM schedules it, you get your Zenith Boon and +8 levels. The guide states the tuning curve outright: about 15% under a monk on ordinary days, about 30% over on Ascendant days, about double on a Zenith. Later features bend that curve: Seventh Sense (15th) forces a one-minute Zenith once a day, and feats such as Second Ascension, Golden Cosmo, The Thirteenth and Two Skies make your day come more often.

**What makes it different.** No other class's power depends on a **calendar the whole table shares**. Its peaks are telegraphed days, not choices made inside an encounter. Compare the Exemplar, which also runs on a single token of divinity but moves it every turn, and the Oracle, which escalates by choice inside a fight. The Saint's escalation is decided by the world before the session starts. Its other distinction is the rankless Technique ladder, where early Techniques never fall out of use. Few canon focus spells keep up like that.

**Overlap check.** *Monk*: the same unarmed, focus-fueled martial with high Fortitude and Reflex. The Saint gives up Flurry, stances and the best unarmored AC, and takes medium armor and the Sky instead. *Exemplar*: a mythic warrior whose power is a state rather than a pool. *Champion*: a sworn warrior of a goddess with a defensive passive (Shelter of the Cloth), but no oath is enforced by mechanics. *Barbarian*: by the canon entry's own measure, a boon that gives more than Rage on the same terms is overtuned. Several Ascendant boons are free, all-day and much larger than Rage, and the 1-in-13 frequency is what is meant to pay for that. *Magus*: none of the Saint's Techniques fuse a spell into a Strike roll, so it stays out of Spellstrike's ground.

---

## Soulbound *(homebrew)*

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Isaac's Homebrew, guide v1.4

**How it plays.** A lightly armored weapon martial whose **spirit weapon** is bonded, unbreakable, transfers runes for free and has built-in *ghost touch*. You open the fight sealed. Your first one-action **Release** each encounter costs no Reiatsu and lasts the whole encounter, changing the weapon's statistics and unlocking a **Release Technique**. **Reiatsu** is a focus pool of 1/2/3 at 1st/5th/11th, plus one genuinely new rule, **Rising Pressure**: the first time each round you deal damage with the spirit weapon or take damage from an enemy, you regain a point, up to your pool size per encounter. That works out to 2, 4 or 6 Techniques a fight, none of them on round one. There are two subclass axes. The **Lineage** is what you are. A *Soul Reaper* gets six chosen kidō and the Zanjutsu sword-technique family. A *Hollow* gets physical resistance equal to half its level from 1st, extra Speed, and fast healing from 5th. A *Quincy* gets a reishi bow, *Blut* (a free toggle between physical resistance and resistance-piercing) and *Seal the Art*, which suppresses an enemy's ongoing buff or release state. The **Spirit** (fifteen, five per Lineage, each a named Bleach character's power) is what you become. Every Spirit climbs a one-way ladder: Release at 1st, Refined at 9th, and at 13th **Full Release** (Bankai, Segunda Etapa or Vollständig), a one-minute, once-a-day state that makes the Release Technique free once per round and radiates fear. **Kidō** are focus effects, not spells, and the list deliberately holds no utility magic. The 20th-level feat **Final Release** gives ten rounds of *Severance* and one decaying finishing Art, worth 20d6 in round one and 8d6 in round seven, and then takes the class's powers away for a week.

**What makes it different.** It is the only focus user whose pool **refills inside the fight, and only by fighting**. That reverses the usual tempo: the class is at its weakest in round one and its strongest in round four. The release ladder runs one way and pays out in new actions rather than flat bonuses. That separates it from the Monk's and Magus's swappable stances, from the Exemplar's rotation, and from the Oracle's escalation, which runs into penalties.

**Overlap check.** *Magus*: a sword plus a magical toolkit, but kidō and Strikes stay separate actions and there are no spell slots, so Spellstrike's ground is avoided. *Barbarian*: Release is a one-action, encounter-long power state, which is the shape of Rage. Unlike Rage it costs no AC and no Reiatsu, and this document's own Barbarian note calls that overtuned. The guide's answer is that Release grants form changes and new actions rather than numbers. *Guardian*: the Hollow Lineage's passive physical resistance borders on the Guardian's signature, without the heavy armor that pays for it. *Necromancer and Summoner*: deliberately avoided. Los Lobos's wolves have no statistics and take no actions, and Konsō treats souls as people to be laid to rest, not material. *Animist*: both are spirit-themed, but the Soulbound has one bound spirit and expresses it in combat, not as spell access.

---

## Assimilator *(homebrew)*

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Isaac's Homebrew, guide v1.3

**How it plays.** An unarmed, unarmored bruiser worn by a symbiont. It has no weapon proficiency and no armor proficiency, ever. It fights with a single 1d8 **Carapace Strike** (handwraps work and are bought normally) and wears **Living Plate**, which acts as explorer's clothing that takes armor runes. It starts with three Expert saves and Expert unarmored defense, the Monk's chassis without Flurry. Power comes from **Assimilation**. You *Feed* for 10 minutes on **Substrates** (thirty-six named gems and metals, split across two Mass pools), and each becomes a **Mutation** whose **Depth** (1–4) rises the more of it you eat. The Depth cap rises at 5th, 11th and 17th, and that is the class's whole level-up, because every rider keys off Depth. Depth 1–2 specimens can be bought; Depth 3–4 "quickened" specimens come only from the GM, as adventure rewards. The subclass, **Instinct**, is not chosen. It is whichever of nine colors you have fed the most Mass, and its clause applies to every Mutation you carry. **Bonds** (five slots) are extra effects for holding two Substrates at Depth 2 together. The plate has Hardness and Hit Points, and the **Carapace Block** reaction soaks physical damage into it. If it breaks, every Depth 3+ Mutation switches off until it is repaired. Shedding a Substrate destroys it, so rebuilding the character costs material rather than a retraining action.

**What makes it different.** The build is **the inventory**: your power curve is the specific material you have eaten, and the GM controls the top of it. No canon class makes its subclass emergent from what it consumes, and no canon martial has a breakable piece of itself that switches off its high-level features.

**Overlap check.** *Monk*: the same chassis. The Assimilator trades Flurry, stances, ki and Legendary unarmored defense for Mutations and Hardness. *Alchemist*: also an economy of material and formulas, but the Alchemist's output is disposable and transferable, while the Assimilator's is permanent and stays in its own body. The Mutagenist research field is the nearest canon fantasy. *Inventor*: one upgradeable thing (here, your own body) with a self-damaging failure mode. *Guardian*: Hardness-based damage soak is the Guardian's resistance gimmick in another form. *Druid*: Assimilate's borrowed senses and movement modes border on battle forms but never replace your statistics.

---

## Stargazer *(homebrew)*

**Key Attribute:** Wisdom · **HP:** 8 · **Source:** Isaac's Homebrew, guide v3.1 · **Budget:** 2860 BCS points (36% over the standard 2100, by the owner's instruction)

**How it plays.** An occult support with **no spell slots**: five cantrips, nine known **Auguries** (focus spells keyed to a Spell DC that reaches Legendary), and a pool of 1, 2 or 3 points. The class runs on its reaction. **Fortune's Thread** triggers when a creature within 30 feet is *about to roll*: Guide it (+1 circumstance) or Snarl it (−1, never on saving throws). It rises to ±2 at 9th, two creatures at 5th and three at 17th, and **Chart the Course** (one action) buys extra free Threads on creatures named in advance. Every dawn, **Night Vigil** reveals the world Sky's sign and aspect for today and the next three days, grants that sign's *Augury of the Day*, and lets the Stargazer brief allies so a bad sky affects them one step less. **Portent** is a d20 rolled at dawn that, once a day, replaces any creature's attack, save or skill die. The Auguries include fear on up to five creatures from 1st level (*Death Foretold*), a reaction that refuses an ally's death (*The Hour Is Not Come*), and a buff that matches Courageous Anthem from 10th. Defensively, the class has Legendary Perception (13th), Legendary Will (17th), Trained Reflex until 13th, and a fear reaction against anything that damages it. Rewinds come at three scales: a GM-run prophetic dream, **Unmake the Moment** (11th: once a day, rewind to the start of your last turn) and **Rewrite the Ending** (19th: once a week, rewind an encounter to its initiative roll).

**What makes it different.** It moves **specific d20s after seeing what they are for**, with no action. Canon support classes buy flat, party-wide numbers instead. It is also the only class whose information reaches days ahead, and the only one with time rewinds. Its own guide is blunt: it reaches the Bard's buffing throughput from 5th, passes it on the luck line at 17th, and is the strongest character in a party of on-budget classes.

**Overlap check.** *Bard*: the incumbent at constant party buffing, and the canon Bard entry warns that competing there is "a hard fight". The Stargazer competes anyway, using circumstance rather than status bonuses so the two stack instead of colliding. *Investigator*: Portent is a pre-rolled die, which the canon entry calls "uniquely Investigator's". The Stargazer's version is once a day and aimed at others rather than at its own attacks, but it is the same idea, and the class also copies the Investigator's Perception line exactly. *Witch*: Coiling Doubt and the Herald path's misfortune effects sit beside Ill Omen and the hexes. *Oracle*: divine-knowledge flavor, without cursebound. *Commander*: the Stargazer improves other characters' turns without spending its own actions, the Commander's ground approached from the reaction side.

---

## Design Takeaways for Homebrew

Reading across all 29, PF2e classes are differentiated along five axes. A new class needs a defensible answer on each:

1. **Resource shape.** Daily slots (casters), a per-encounter state you earn (Swashbuckler, Barbarian), a rotating token (Exemplar), an at-will gate (Kineticist), a refillable pool that regenerates in 10 minutes (focus spells), a prepared list of maneuvers (Commander), or nothing at all (Fighter).
2. **Action-economy trick.** Compression (Magus's Spellstrike, Monk's Flurry), extra reactions (Guardian), granting allies actions (Commander), splitting actions with a second body (Summoner), pre-rolling (Investigator), delayed payload (Runesmith).
3. **Where power lives.** In your proficiency (Fighter), your items (Alchemist, Inventor, Thaumaturge), your companion (Summoner, Druid), your body (Kineticist, Monk), your knowledge (Investigator, Thaumaturge), or an external patron (Cleric, Witch, Oracle).
4. **Cost structure.** What does the class pay to be good? AC (Barbarian), fragility (Magus, Psychic), setup actions (Ranger, Thaumaturge), self-harm (Inventor's unstable), escalating drawbacks (Oracle's cursebound), behavioral restrictions (Champion's tenets).
5. **Party role it monopolizes.** Nothing should be strictly better than the incumbent at their own job. Be better at a *different* job.

### The four homebrew classes on the five axes

| | Resource shape | Action-economy trick | Where power lives | Cost structure | Role it reaches for |
|---|---|---|---|---|---|
| **Saint** | Small focus pool + a world calendar (the Sky) | Free Technique casts from boons on its day | The Cloth and the day | Under-curve 12 days in 13 | Striker / controller by Cloth |
| **Soulbound** | Focus that refills by hitting and being hit | Release is free; Full Release frees the Technique each round | The spirit weapon | Weak round one; Will capped at Expert | Striker, with a Lineage defense or denial lean |
| **Assimilator** | Mass and Depth, bought with material | Reactions (Carapace Block, Symbiotic Reflex) | What it has eaten | A plate that breaks; a build that costs money to change | Bruiser / soak |
| **Stargazer** | One reaction + daily information | Moves other creatures' dice for no action | Foreknowledge | 8 HP, Trained Reflex to 13th, no attack | Support (Bard-tier) + information |

Three of the four (Saint, Soulbound, Assimilator) share one chassis almost line for line: 10 HP, Strength or Dexterity, Expert Fortitude and Reflex at 1st, focus or feature engines and no spell slots. `homebrew-class-critique.md` takes that up.

