# Homebrew Class Critique — Saint, Soulbound, Assimilator, Stargazer

*Companion to `pf2e-class-summaries.md`. The summaries describe each class as its guide writes it. This
document says where I think the design is wrong, at risk, or self-contradictory. It is written to be
argued with, not agreed with.*

**Read from:** Saint guide v4 (`Docs/saint-gold-cloth-guide-v4.md`) plus the shipped feats in
`content/saint-feats`; Soulbound v1.4; Assimilator v1.3; Stargazer v3.1; Breath Slayer v5 for the
concept note. Numbers are quoted from those documents. Where the shipped content and a guide disagree,
I say which one I used.

**Severity:** 🔴 likely to break play or a table's trust in the class · 🟠 a real balance or design
problem to fix before broad use · 🟡 worth a decision, or a cleanup.

---

## 0 — Cross-cutting issues

### 🔴 0.1 Three of the four are the same chassis

Saint, Soulbound and Assimilator are all: 10 HP, Strength or Dexterity, Expert Fortitude and Reflex at
1st (the Assimilator adds Will), Trained Perception, a Class DC that reaches Master at 17th, martial
attack progression, a focus-or-feature engine, and no spell slots. Add the Breath Slayer and it is
four. Each class is distinct at the level of its gimmick, but a player choosing between them is
choosing between **skins on one frame**. Three consequences:

- **They compete for the same seat.** A party with two of them has two frontline focus-martials and
  no reason to have both.
- **The codex makes it visible.** Their estimated bars come out within a point of each other on almost
  every axis (Melee 4, Defenses 3–4, Skills 1–2). Next to the canon roster, where Monk, Champion and
  Investigator look nothing alike, that is a red flag.
- **Skills and out-of-combat play are uniformly thin.** All three take 3 + Int skills, which is the canon
  minimum for martials, and none of them has a skill engine. The canon document's own conclusion is
  that skills are a legitimate power budget; the homebrew line never spends any.

*Suggestion:* before building a fifth, decide what the next class is **not**. A low-HP skill class, a
caster with slots, a pet class, or a class without Strength or Dexterity as its key attribute would
each fill a gap rather than add a fourth sibling.

### 🟠 0.2 BCS parity is doing more work than it can carry

Each guide ends at "**2100 ✅**", and the chassis sums are honest. But each guide also says, in its
own words, where the parity stops measuring anything:

- The Saint's and Stargazer's feats are "**unpriced in the BCS, so this list is generous by design**".
- The Assimilator prices "**only the chassis**". Its subclass power is Substrates and Bonds, which live
  in a separate lexicon and are not costed at all.
- The Saint's whole headline ("~30% stronger", "~100% stronger") sits in **boons**, and boons are not
  on the ledger.

So "2100" certifies the proficiencies and leaves the dangerous parts unpriced. That is acceptable for
a design tool, but **"costed on the same budget" should never be offered as evidence of balance**, and
the guides lean on it as if it were. The Stargazer is the honest exception: it says 2860 and means it.

### 🟠 0.3 The Sky is a world subsystem that two classes pull in opposite directions

The Sky started as the Saint's engine. The Stargazer v3 then **re-weighted it**: Quiet went from 50 to
20, Retrograde from 15 to 30, and Exalted from 0 to 10. That was done to make the Stargazer's
Forewarned matter more. Effects:

- The world became **hostile on 40% of days** for every creature, a change made for one class.
- **Unscheduled Zeniths now happen** (about 1 day in 130 for each Saint). The Stargazer guide flags
  this as a buff to an already-played class "delivered as a side effect". It is still unratified.
- **Forewarned does nothing for a Saint** (Unfailing Cosmo already ignores bad aspects), so in a party
  with both classes the Stargazer's party feature skips the one character built around the sky.
- **Name collisions:** the Saint and the Stargazer both have an 18th-level feat called *Two Skies* with
  different rules; *Unbroken Chain* exists in both the Soulbound (16) and the Stargazer (18); and
  *Constellation of One* had to be renamed out of the Stargazer. In a shared Foundry compendium, name
  collisions turn into search and UUID-link bugs.

*Suggestion:* give the Sky an owner. Pick canonical weights in one place (an ADR), and make any
class that wants different odds do it **per actor**, through its own features, not through the world.

### 🟡 0.4 Canon fidelity is sometimes allowed to outrank table health

The Soulbound especially (Kyōka Suigetsu, Ryūjin Jakka's friendly fire, the Ittō Kasō self-cost) and
the Saint (death-on-zero, permanent severing) keep a canon behavior and then add a design note saying
"this is a table-consent question". That is honest, but a class that **needs a consent conversation to
be playable** should ship the safe version as the rule and the canon version as a variant, not the
other way round.

### 🟡 0.5 Documentation drift

- `saint-feat-compendium.md` (repository root) is stale against the shipped feats. It still uses spell
  **rank** language for *Second Cloth Technique*, *Cosmo Overflow* and *Cosmo Legend*, which v4 and
  `content/saint-feats` have replaced with heightening steps. Its appendix lists feats it does not
  contain (*Golden Cosmo*, *The Thirteenth*, *Two Skies*), and one, *Prophecy's Weight*, is actually a
  Stargazer feat. Constellation of One's balance note promises an "inherited +1" that the text above it
  does not give.
- Three shipped Saint feats (*Golden Cosmo*, *The Thirteenth*, *Two Skies*) carry the note "*the rules
  here are a first pass … most likely thing in this module to want a second look*". They ship anyway.
- The Stargazer's §0A says *Death Foretold* "heightens to five creatures", but §5.2 prints it as **up to 5
  targets at 1st level**. Those are very different spells; see 4.2.

---

## 1 — Saint

**What works.** The rankless heightening ladder is the best idea in the module: early Techniques never
die, and later slots buy new *shapes*, not bigger numbers. The calendar-as-power fantasy is genuinely
new to PF2e and gives the GM a dramatic lever (the scheduled Zenith). Libra's "Measured against the item
table" section is a model of how to justify above-curve gear.

### 🔴 1.1 Ascendant and Zenith boons do not scale with level

The boons are flat effects that switch on at 1st level exactly as at 20th. On a 1st-level Ascendant
day:

- **Cancer**: once per round, as a **free action**, a creature at half HP or less saves or takes
  **8d6 void** and is slowed 1. That is about 28 damage, against level-1 creatures with roughly 15–20 HP.
  Also, "any creature you reduce to 0 HP dies", with no save.
- **Leo**: a Haste-style **extra action every turn**. Haste is a rank-3 spell lasting 1 minute; this is
  all day.
- **Scorpio**: at 8 needles, save or die (incapacitation helps only against higher-level foes).
- **Aries Zenith**: a reaction with **no frequency limit** that sends *every* ranged attack, spell attack
  and hostile spell within 60 feet "nowhere". For a day, the party is close to immune to casters and
  archers.

The 1-in-13 frequency is meant to pay for this, but a level-1 boon that ends encounters is not paid for
by rarity. **It also stops being rare**: see 1.3.

*Suggestion:* give each boon a level-scaled number (for example, Cancer's 8d6 becomes "2d6 + 1d6 per 2
levels") and keep the flat versions only for the Zenith.

### 🔴 1.2 Capricorn's passive severs permanently, from 1st level, on every unarmed crit

*The Sharpest Sword*: every critical hit with an unarmed Strike makes the target **permanently** lose a
limb, natural attack or sense until *regenerate*. There is no save, no incapacitation and no frequency.
Crits are common (a natural 20, or 10 over AC, which is easy against minions), so this is a permanent
maiming engine against bosses and an absurd one against anything that recurs. The same applies to
PC-like enemies the GM wants to bring back. *Excalibur: The Sword That Cuts Everything* and the Zenith
reaction add more severing on top.

*Suggestion:* let a crit force a Fortitude save against Severed with incapacitation, and add
"once per creature per day". Keep the permanent version at Ascendant or above.

### 🟠 1.3 The feat list dismantles the class's own premise

The guide's thesis is "ordinary 12 days in 13". The shipped feats then add *Golden Cosmo* (10th: half
boon when an adjacent sign rises, +2 days in 13), *Second Ascension* (12th: three Ascendant minutes a
week), *The Thirteenth* (18th: Starless days count as yours, +1/13), *Two Skies* (18th: a second sign,
+1/13), Seventh Sense's *Burn Your Cosmo* (15th, daily) and *Zenith Reach* (16th, twice daily). A
high-level Saint is lit something like **4–5 days in 13 plus a daily minute**, and at 20th
*Constellation of One* makes the Ascendant boon permanent. The −15% floor stops existing well before
20th, but the boons were sized against a 7.7% uptime. Either the boons are too big for the late game or
the feats should not exist. **Pick one.**

### 🟠 1.4 Internal ladder inconsistencies

- **Taurus** (tagged "*OFFENSE, minor*") gets *Pleiades Nova* at **6th**: **five** Strikes for **two
  actions** with no MAP increase, rising to seven. **Leo** (tagged "*the striker*") gets *Lightning
  Plasma* at **11th**: **three** Strikes for **three actions**. The "minor" offense Cloth's 6th-level
  Technique is far stronger than the striker Cloth's 11th-level one.
- **Gemini's** *Another Dimension* is a **1st-level**, 2-action, single-target banishment for 1 minute
  (10 on a crit fail). Incapacitation limits it against bosses, but against on-level and lower creatures
  it removes one enemy from most fights for one focus point. Canon *Banishment* is rank 5.
- **Libra** stacks above-curve weapons (+2 potency at 6th, worth 935 gp), arts, *The Twelve Arms* for
  the party, and its Ascendant boon's "first natural 1 each hour counts as 10". It is the most complex
  Cloth by far, and its "plainest Techniques" counterweight does not cover all of that.

### 🟠 1.5 The normal-day turn is thin

Off-day, the Saint has three plain 1d6 fist Strikes a turn, no Flurry, and **one focus point until
7th** (with Refocus's one point per 10 minutes, that is roughly one Technique per fight). For about 92%
of days at low level, the class's moment-to-moment play is a Monk minus Flurry. The guide calls the
floor "a feature"; I'd call it the most likely complaint at the table. The Soulbound solved the same
problem with Rising Pressure, and the Saint could borrow a lighter version (for example, regain 1 Focus
Point the first time each encounter you are crit or drop below half HP).

### 🟡 1.6 A Dexterity Saint is fighting its own armor

The Cloth is medium armor with a **Dex cap of +1**, but the class lets you key Dexterity, and its fists
are finesse. A Dex-keyed Saint either loses AC in the Cloth or dismisses the Cloth and drops to Trained
unarmored defense. State a Dex-friendly Cloth mode, or key the class on Strength.

### 🟡 1.7 One player's day is the table's spotlight problem

On an Ascendant or Zenith day, a single PC is "briefly unstoppable". In a party of four this
concentrates the spotlight in a way PF2e's party-balanced math is built to avoid. Scheduling Zeniths
helps the narrative; it does not help the other three players that session.

---

## 2 — Soulbound

**What works.** *Rising Pressure* is a genuinely new PF2e mechanic and probably the best-justified
engine in the module: a capped in-fight refill that turns the class's tempo upside down. The
monotonicity guarantee (Full Release frees the existing Technique rather than replacing it) is elegant.
The guide is unusually honest about its own risks (§11).

### 🟠 2.1 Release is a free power-up, so it is a round-one tax with no decision

Release costs one action and no Reiatsu, lasts the encounter, and has **no downside**. The guide argues
that charging for it would make everyone Release on round one and feel taxed, but that is exactly
what happens now: the first action of every fight is Release, and it is never a choice. By the
canon document's own test ("If a homebrew release state gives more than Rage does for the same cost,
it is overtuned"), Release gives more than Rage (flight, reach 15, die steps, hypnosis, a new
Technique) and costs less (no AC penalty, no lockout).

*Suggestion:* make the first Release part of rolling initiative (as *Sheathed Draw* already allows),
so no action is taxed, **or** give each released form a real drawback (Rage-style) so staying sealed is
sometimes right.

### 🔴 2.2 Some 1st-level Released Forms are far above curve

- **Kyōka Suigetsu**: on a free Release, every creature that sees you makes a Will save or is
  hypnotized for **1 minute**. Against hypnotized enemies you are **hidden whenever you are not
  adjacent** (an 11 flat check for them to target you) and they take a DC 5 flat check otherwise. There
  is no incapacitation, it applies to every viewer, it starts at 1st level, and a critical failure makes
  it recur forever. This is the strongest 1st-level defensive effect in the module. The guide flags it
  as a "social" risk, but it is a mechanical one first.
- **Murciélago**: a **fly Speed at 1st level** on Release, plus a 1d10 reach weapon. PF2e gates
  at-will flight hard (ancestry flight starts around 9th; *Fly* is rank 4), and the Saint's guide gives
  Sagittarius flight only on its Ascendant day.
- **The Miracle** (Vollständig): Miracle points become uncapped while gaining 2 per round, so in a long
  fight the Soulbound gains **resistance to all damage** equal to the points, plus **fast healing**
  equal to the points, plus death prevention for 5 points each time. Ten rounds in, that is 20
  resistance to everything and 20 fast healing. In a class built to get better as fights get longer, an
  uncapped scaling defense is the one thing that should not exist.

### 🟠 2.3 The Hollow's free defense sits on Guardian territory

*Hierro* gives physical resistance equal to half your level **from 1st, always on, on light armor**,
and adds fast healing at 5th, extra Speed and Sonido. The Guardian pays for 1 + half-level resistance
with heavy armor and weak offense; the Hollow pays with "two fixed kidō". The guide's own fallback
(one-third of level) is probably the right starting number, not the emergency lever.

### 🟡 2.4 Breadth is a maintenance cost

Fifteen Spirits on two subclass axes, plus Borrowed Nature's six cross-Lineage directions, plus fifteen
Severing Arts: that is a lot of surface area for one class. The guide answers "five shared ladders",
and the numbers do sit on them, but the **riders** don't (hypnosis, aspects, petal charges, wolf
pools, Miracle points). For a first table, ship the five-Spirit playtest set the guide itself
recommends and hold the rest.

### 🟡 2.5 Will capped at Expert, by design, with a +1 circumstance hand-back

The genre argument is fine. But a 10-HP frontliner whose Will never reaches Master will be dominated
and confused at 15th–20th far more often than its party, and *Voice in the Blade*'s +1 only covers
possession and mental effects "the GM names". Expect this to feel bad late and to be the thing players
ask to change.

---

## 3 — Assimilator

**What works.** The cleanest *identity* of the four: "your build is a stomach" is instantly legible,
"the same ruby under three Instincts is three creatures" is a lovely design move, and the breakable
Carapace is the only real failure state among these classes, which gives the GM a dramatic tool.
Choosing not to give out free runes keeps it inside PF2e's item math.

### 🔴 3.1 The GM is the class's power curve

Depth 3–4 specimens are "**never shop inventory**" and come only from the GM; most of the class's power
lives at Depth 3–4, which is "the spike, deliberately late". That means:

- **A player's mid- and high-level power is a treasure decision**, made by someone balancing a whole
  party. A generous GM produces a much stronger Assimilator than a stingy one, and neither is wrong
  under the rules.
- **Pre-written adventures don't know this class exists.** They will not seed quickened specimens.
- *The Vein provides* (one free Substrate per Mass increase) protects the Depth 1–2 floor, not the
  Depth 3–4 spike.

*Suggestion:* guarantee a Depth 3–4 specimen per Skin, the way *The Vein* guarantees the floor, and make
found specimens variety rather than progression.

### 🟠 3.2 Hardness stacking is already past the guide's own comfort line

The guide's own example "Wall" build reaches **Hardness 28 at 11th, 56 standing still**, and Carapace
Block subtracts that from **each** physical hit. Shield Hardness at that level is around 10. The
Carapace's HP (10 + 5/level = 65 at 11th) breaks it after 2–3 big blocks, but it repairs in an hour of
feeding. The guide already names the cap it would use (half level + 10). **Ship the cap.** A number you
already expect to cut is a number that will cause an argument once it is in play.

### 🟠 3.3 Complexity is at the ceiling of the game, and it front-loads nothing

Thirty-six Substrates, thirty Bonds, nine Instincts, two Mass pools, Depth, Shedding, Hardness and
break states: "four dials, each simple" is true per dial, but the combination is at or past the
Alchemist's difficulty (the only canon class rated 5). Meanwhile 1st–4th level is "a martial with a
gimmick". The player pays the full complexity cost from session one and gets the payoff at 11th and
17th, which is when most campaigns have ended.

### 🟠 3.4 Mass feats are a tax that crowds out the feat list

*Second Stomach*, *Iron Gullet* (1st), *Mass Growth* (8th), *Greater Mass Growth* (12th), *Legendary Mass*
(16th), and then *Perfect Organism* (20th), which makes Mass and Depth meaningless. The guide says "a feat
that raises Mass is the most valuable thing on most of these lists, and that's correct". In PF2e terms, a
feat that is the right answer on most levels is a **tax**: it makes every other feat on that level a
trap. Fold Mass growth into the chassis and let the feats be choices.

### 🟡 3.5 No ranged answer and a Strength-AC problem

The only ranged option is a feat (*Spit*: 20 feet, 1d6). Against flyers or ranged foes, the class's
own build example says it has "nothing to say". And because no armor can ever be worn, a
**Strength**-keyed Assimilator has no way to cover a low Dexterity: its AC is 10 + Dex + proficiency
with nothing else. The Monk shares this, but the Monk reaches Legendary unarmored defense; the
Assimilator stops at Master.

### 🟡 3.6 Two damaged-economy notes

The class pays the full item tax (handwraps **and** armor runes) **and** buys Substrates out of the same
wealth. The guide flags it ("check that the item budget actually stretches"); it probably doesn't at
standard wealth. Also, *Eat the World* (20th) destroys a magic item for a day's benefit, which will
collide with party loot ownership at many tables.

---

## 4 — Stargazer

**What works.** The class has a real identity: the reactive luck engine is fun and *aimed*, and the
information economy (forecast, Portent) is novel. Snarl excluding saving throws is exactly the right
call, and the guide is admirably candid about where it lands (§9). The Foundry design note (armed
Threads, ADR-0004) solves the hardest automation problem sensibly.

### 🔴 4.1 It is 36% over budget, and the codex reader won't know unless told

2860 against 2100, by the owner's instruction, with the guide's own verdict that it is "**the strongest
character in the party**" next to the other homebrew. That is a legitimate choice for a table that
wants it, but it should not sit in a class picker next to on-budget classes **unlabelled**. The codex
entry states the overage in its ratings note for that reason. If the class is meant for general use,
the guide's own trim table (§2.5) is the place to start; the two proficiency jumps (+380) are the
cleanest cut.

### 🟠 4.2 *Death Foretold* at 1st level

As printed in §5.2: up to **five** creatures, Will save; frightened 2 on a failure; frightened 3,
**stunned 1** and fleeing on a critical failure; no incapacitation; one focus point. Canon *fear* is one
target at rank 1. At 1st level this can end an encounter on one action pair, which the guide admits
("often simply the whole fight"). Start it at one or two targets and heighten to five, as §0A
apparently intended.

### 🟠 4.3 The core reaction taxes the table's clock

Fortune's Thread triggers on "**about to roll**", for any creature within 30–60 feet and any of four
roll types. At the table, every d20 becomes a pause. The guide's mitigation (declare a standing policy)
is good and should be **the rule as written**, not playtest advice. In Foundry, the armed-Thread
implementation already does this, so the paper rule and the VTT rule currently differ.

### 🟠 4.4 Rewinds cost the GM more than the player

*Unmake the Moment* rewinds the whole table one round; enemies "act again as the GM chooses" and nobody
else remembers. Mechanically it is clean; in play, the GM re-adjudicates a round, players lose
outcomes they enjoyed, and a VTT has to restore every actor (the module snapshots state to do this).
*The Long Way Round* (rewind any creature's turn, usable while dead) makes it more frequent and less
predictable. I'd keep Unmake the Moment and cut the extensions.

### 🟠 4.5 The Sky changes were made for this class (see 0.3)

The 40%-hostile world and unscheduled Zeniths were introduced to raise Forewarned's value. The guide
itself says Forewarned "was not repriced" and is the most likely underpriced feature. A class that
needs the world rebalanced to make its party feature matter is a class whose party feature should be
rebalanced instead.

### 🟡 4.6 Overlaps it should own up to

Portent is a pre-rolled die, the niche the canon document calls "uniquely Investigator's". The
Stargazer also copies the Investigator's Perception line exactly, and competes with the Bard on buffing
throughput, which the canon document warns is "a hard fight". Each is defensible alone; together they
make a class that takes a little of three incumbents' signatures.

### 🟡 4.7 Information powers need GM commitment

*Every Sky Ever Read* (a true yes/no question each hour), *Cartographer of Endings*, *Cold Read*'s
"accidentally right", and the three-day forecast all require the GM to have decided the future in
advance. Fine for a prepared GM; a burden for an improvising one. Say so in the class's GM notes.

---

## 5 — The two concepts in the codex

### 5.1 Breath Slayer (Kimetsu no Yaiba)

Not one of the four, but it has a full v5 guide and sits in the codex as "?". Two notes:

- 🟠 **It is the fourth 10-HP Strength/Dexterity focus-or-feature martial** (see 0.1). Its v5 combo wheel
  is the most distinctive mechanic of the five, which is a reason to build it, but chassis-wise it is
  another sibling.
- 🟡 **Its turn is a puzzle every action.** Wheel position, last Form, Flowing/Reaching/Broken, Crest
  nomination and Count thresholds. It will be the slowest class to play at the table, and most of the
  skill lives in arithmetic rather than in tactics.

### 5.2 Tarotist (gacha Major Arcana)

Risks to settle before any rules are written:

- 🔴 **The Stargazer already owns "a random daily power"**: its *Augury of the Day* is literally a
  d13 that hands you one of twelve effects each morning. Two classes built on a random morning grant,
  both with a tarot/astrology aesthetic, will read as one idea twice. Decide which class owns
  divination-by-randomness, or make the Tarotist's randomness *in combat* (draw as an action) rather
  than daily.
- 🟠 **Pathfinder already has a tarot**: the **Harrow** deck (54 cards, suits, alignments) and the
  Harrower archetype. Using the real-world Major Arcana is fine, but Golarion players will ask why it
  is not the Harrow. Decide whether the class is setting-neutral or Golarion-flavored.
- 🟠 **Variance needs a floor.** The Stargazer guide's own rule applies here: a grant you cannot plan
  around "has to be worth having on the day it lands". With 22 cards, some are bound to be weak in a
  given adventure (The Lovers in a dungeon crawl). Give the class a reliable baseline action that never
  depends on the draw, plus at least one control lever (one redraw, or a signature card always in hand),
  or the class will have dead days.
- 🟡 **Twenty-two effects is twenty-two things to balance**, each needing to be roughly equal so a draw
  is not a jackpot or a blank. Consider structuring the deck as three tiers (minor, major, "trump") so a
  hand has a predictable shape even when its contents are random.

---

## 6 — If I could change only five things

1. **Scale the Saint's boons with level** and **put a save and frequency on Capricorn's severing** (1.1, 1.2).
2. **Cap the Soulbound's 1st-level outliers**: Kyōka Suigetsu's hypnosis needs incapacitation and
   one viewer per Release, Murciélago's flight moves to Refined (9th), and The Miracle's points get a
   cap (2.2).
3. **Guarantee the Assimilator's Depth 3–4 specimens** from the chassis, and ship the Hardness cap (3.1, 3.2).
4. **Label or trim the Stargazer's overage**, and start *Death Foretold* at one or two targets (4.1, 4.2).
5. **Give the Sky an owner**: canonical weights in an ADR, per-actor modifiers instead of world changes,
   and no two feats with the same name across classes (0.3).
