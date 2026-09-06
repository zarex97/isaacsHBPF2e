# Breath Slayer Class Feats — Compendium v4
### Aligned with **Breathing Forms Compendium v4**. Replaces feat compendium v3.

> Implements `Docs/breath-slayer-balance-analysis.md` §7.3 (chassis changes) and §7.4 (feat-level
> corrections). See `breath-slayer-v4-changelog.md` for the recommendation-by-recommendation audit.

**Design rules (unchanged):** anchors cited for every feat (±2 levels); feats sit outside the BCS
2100 budget. **Changed:** Breath Point pool growth has moved entirely onto the chassis, so no feat
grants pool any more.

---

## 1. CHASSIS AMENDMENTS

*The class guide holds the chassis; these are the lines to port into it. Everything here replaces a
feat that v3 charged for, or fixes a level that was demonstrably late against its own anchor.*

### 1.1 New and moved chassis features

| Lvl | Feature | What it does | Anchor / why |
|---|---|---|---|
| **1** | **Concentrated Breathing** | While you are in a Breathing Stance and wielding a nichirin blade, your Strikes deal **+2 precision damage per weapon damage die**. This increases to **+3 at 9th level** and **+4 at 17th level**. | `Sneak Attack` (1d6 → 4d6 at 17) · `Rage` (+2 → +18 giant at 15) · `Precise Strike` (+2 → +6 at 17). **This is the class's floor.** Without it, a Breath Slayer with an empty pool is a martial with no class feature. |
| **1** | **Focused Breathing** *(was feat 1)* | You learn your primary style's **First Form** and gain a **focus pool of 1 Breath Point**. | Saint class ledger: `1 \| Cosmo (focus pool + Signature Technique) \| 10`. Techniques are chassis there; Forms are chassis here. |
| **5** | **Second Breath** *(was feat 4)* | You learn your primary style's **Second Form**, and your pool increases to **2 Breath Points**. | Saint: `5 \| Technique gained \| 10`. |
| **9** | **Nichirin Resonance** | Your pool increases to **3 Breath Points** (cap). Your nichirin Strikes and Forms may deal **spirit** damage instead of their normal type, chosen each time you Strike or use a Form; they ignore physical resistance up to **half your level**; and your blade counts as **cold iron and silver** against all creatures. | Absorbs the old **Crimson Blade** (feat 10) wholesale. Anchors: `Inner Upheaval`'s free choice of force/spirit/vitality/void at **monk 1**, `Overwhelming Breath` (monk 12), `Overwhelming Spellstrike` (magus 12). Every Form deals slashing, fire, electricity or sonic — all commonly resisted at high level; a demon-slayer whose blade *doesn't* answer that is a design hole, and spirit damage fixes it in one line. |
| **12** | **Total Concentration** *(was feat 18)* | When you Refocus, you regain **all** your Breath Points instead of 1. | `Meditative Focus` is **monk 12**, verbatim — and `Bloodline Focus` (**sorcerer 12**) is the same effect at the same level. v3 cited "Meditative Wellspring (monk 18)" — **that feat does not exist**. The class whose whole identity is its focus pool was getting full recovery six levels after two other classes. |
| **15** | **Breath of Instinct** | **Frequency** once per minute. You use a Form that takes 1 action without spending a Breath Point. | `Qi Center` (monk 18) — a free 1-action stance qi spell once per minute. Ours is three levels earlier and restricted to 1-action Forms, which are the small ones. |

### 1.2 Chassis features this removes or supersedes

| Old item | Fate |
|---|---|
| Feat 1 **Focused Breathing** | → chassis 1 |
| Feat 4 **Second Form** | → chassis 5 |
| Feat 8 **Rapid Concentration** | **Deleted.** Obsoleted by Total Concentration at 12; its `Battle Breathing` alternative survives as a standalone feat 8. |
| Feat 10 **Mark Precursor: Crimson Blade** | → absorbed into chassis 9 (Nichirin Resonance) |
| Feat 18 **Perfect Slayer's Focus** | → chassis 12 (Total Concentration) |

### 1.3 The feat tax, before and after

| Build | v3 slots on the Form ladder | v4 slots |
|---|---|---|
| Single-style | 5 (feats 1 / 4 / 8 / 12 / 20) | **3** (feats 8 / 12 / 20) |
| Full multi-style | 10 of ~11 | **8 of 11** |

The Saint receives six Techniques as chassis features for 60 BCS points and keeps all eleven class
feat slots free. The Breath Slayer no longer pays five feats for the abilities that *are* the class.

---

## 2. THE FORM LADDERS (reference)

### Primary ladder

| Source | Lvl | Grants | Pool |
|---|---|---|---|
| **Chassis: Focused Breathing** | 1 | Primary style's **First Form** | 1 |
| **Chassis: Second Breath** | 5 | Primary's **Second Form** | 2 |
| **Chassis: Nichirin Resonance** | 9 | — | 3 (cap) |
| **Feat: Third Form** | 8 | Primary's third listed form | — |
| **Feat: Fourth Form** | 12 | Primary's fourth listed form | — |
| **Feat: Hidden Form** | 20 | Primary's **Final/Forbidden Form** | — |

### Secondary ladder *(requires Flowing Stance Shift, feat 4)*

| Feat | Lvl | Grants | Prerequisite |
|---|---|---|---|
| **Borrowed Form** | 6 | Secondary style's **First + Second Form** | Flowing Stance Shift |
| **Adopted Form** | 10 | Secondary's third form | Borrowed Form; primary **Third Form** |
| **Assimilated Form** | 14 | Secondary's fourth form | Adopted Form; primary **Fourth Form** |

*Borrowed Form grants two forms because a single low-rank form at level 6 underpays the slot (anchor:
`Multifarious Muse`-style versatility feats), and because both of those rungs are now free on the
primary ladder anyway. The primary-ladder prerequisites still enforce "your true style leads."*
**No slayer ever learns a second Final Form**, and no feat on this ladder grants pool.

---

## Level 1

**Slayer's Conditioning** — *Anchor: Fleet*
+5-foot status bonus to Speed while in a Breathing Stance and wearing no heavier than light armor.

**Demon Lore** — *Anchor: Monster Hunter (ranger 1)*
Trained in Demon Lore (or Fiend/Undead Lore, GM's call). When you Recall Knowledge about a fiend or
undead, a success also reveals one weakness or resistance; a critical success also reveals its lowest
save.

**Water-Wheel Footwork** — *Anchor: Nimble Dodge (rogue 1)*
**Reaction.** *Trigger:* You are targeted by a melee attack while in a stance. You gain a +2
circumstance bonus to AC against the triggering attack.

**Deep Breath** — *Anchor: small recovery utility, feat 1 tier*
**Frequency** once per 10 minutes. 1 action: gain temporary Hit Points equal to half your level
(minimum 1) for 1 minute, and attempt an assisted flat check (DC 10) to end one source of persistent
bleed on yourself.

**Flowing Step** — ✦ NEW — *Anchor: a once-per-round 5-foot upgrade; strictly below `Nimble Roll` (rogue 8)*
Once per round while in a Breathing Stance, your Step covers **10 feet** instead of 5.
*(Fills the slot vacated by Focused Breathing. Every Breathing Style rewards footwork; this is the
cheapest way to buy into that at level 1 without touching damage.)*

---

## Level 2

**Nichirin Draw** — *Anchor: Quick Draw (rogue/ranger 2)*
Draw your nichirin blade and Strike as a single action. If you were hidden or undetected by the
target, the Strike deals +1d6 precision damage (once per combat).

**Slayer's Senses** — *Anchor: sense feats, investigator/rogue 2 tier*
Choose smell or hearing. **Smell:** imprecise scent, 30 feet. **Hearing:** within 15 feet, dim-light
concealment doesn't apply against you. You can take this feat twice (second time at 6th level) for
both.

**Guard Break** — *Anchor: Snagging Strike (fighter 1), taxed one level for stance synergy*
While in a stance, make a Strike; on a hit the target is off-guard against the next attack made
against it before the start of your next turn.

**Twin-Blade Discipline** — ✦ MOVED from feat 6, flourish removed — *Anchor: Double Slice (fighter 1)*
**Requirement:** You are wielding a nichirin blade in each hand and are in a stance.
2 actions: Strike once with each blade. Both Strikes use your current multiple attack penalty, then
your MAP increases as though you had made one Strike.
> *v3 charged **five levels** of tax over `Double Slice` and then bolted a flourish tag on top, which
> blocked it from combining with any other flourish. One level of tax for the stance synergy is
> enough; the flourish tag is gone.*

---

## Level 4

**Flowing Stance Shift** — *Anchor: versatility feats; strictly weaker than Stance Savant (monk 12)*
Learn a second Breathing Style's **stance only** — no style rider, no granted skill. This opens the
secondary Form ladder (Borrowed / Adopted / Assimilated Form at 6 / 10 / 14). Entering any stance
costs 1 action as normal.

**Breath-Enforced Blade** — *Anchor: Ki Strike's damage-type flexibility*
While in a stance, your nichirin Strikes can deal your style's damage type instead of the weapon's,
chosen per Strike. With a secondary stance active, use that style's type.
*(Note: chassis **Nichirin Resonance** at 9th level supersedes this for most purposes by adding
spirit. This feat is the level-4 down payment.)*

**Anticipate Lunge** — *Anchor: `Stand Still` (monk 4). Note that fighters and champions get
`Reactive Strike` — a broader trigger, and it doesn't count toward MAP — at **level 1**.*
**Reaction.** *Trigger:* A creature within your reach Strides, Steps, or Flies away from you while
you're in a stance. Make a nichirin Strike against it.

**Cutting Gale** — ✦ MOVED from feat 8 — *Anchor: Swipe (fighter/barbarian **4**)*
2 actions, flourish. Make one nichirin Strike against each of two adjacent enemies. Your multiple
attack penalty increases only after both Strikes resolve.
> *v3 claimed "heavily discounted `Whirlwind` (fighter 14)." The real anchor is `Swipe` at level 4 —
> and Cutting Gale is already better than Swipe, because it rolls two attacks instead of one. Sitting
> it at 8 made it four levels late for something strictly stronger than a level-4 feat.
> The `Whirlwind Strike` version now exists properly, at 14, as **Whirling Gale**.*

---

## Level 6

**Borrowed Form** — *(secondary ladder; see §2)*

**Flowing Water Counter** — ✦ TRIGGER NARROWED — *Anchor: Dueling Riposte (fighter 8)*
**Reaction.** *Trigger:* A melee Strike against you **critically fails** while you're in a stance.
Step, then Strike the triggering creature at your current multiple attack penalty.
> *v3 triggered on **fail or critical fail**, two levels earlier than `Dueling Riposte`, and threw in
> a free Step. This was the one place the document was over-generous. The wider trigger now costs a
> feat of its own — **Perfected Water Counter**, level 12.*

**Twin-Blade Discipline** *(if not taken at 2)* — see Level 2.

**Scent of Blood** — *Anchor: Blind-Fight (fighter 8), discounted for narrow scope*
**Prerequisite:** Slayer's Senses (smell). Creatures below half Hit Points within your scent range
are automatically detected unless they mask their scent.

**Ragged Breath** — ✦ NEW — *Anchor: `Retributive Focus` (champion 18), `Surging Focus` (cleric 8), `Linked Focus` (wizard 4)*
**Frequency** once per day. **Requirement:** You have **0 Breath Points** and are in a Breathing
Stance. 1 action: draw a shuddering breath and regain **1 Breath Point**.
> *Every "regain 1 Focus Point" feat in the game is **once per day**, from wizard 4 through champion
> 18 — and `Retributive Focus` carries the same empty-pool requirement this feat does. Level 6 with
> a once-per-day frequency sits inside that band. Fills the slot Twin-Blade Discipline vacated, and
> answers the analysis's §4.1 finding that the class's sustained floor collapses to zero the moment
> the pool is dry.*

---

## Level 8

**Third Form** — *(primary ladder)*
Learn your primary style's third listed form.

**Battle Breathing** — *Anchor: focus-economy feats at the 8–12 tier*
You gain a +1 circumstance bonus to the attack roll or DC of the **first Form you use in each
combat**.
> *v3's `Rapid Concentration` (2 points back on Refocus) is deleted — chassis **Total Concentration**
> at 12 returns the whole pool, so a partial-recovery feat at 8 is a trap that stops mattering four
> levels later.*

**Cutting Gale** *(if not taken at 4)* — see Level 4.

**Unshakeable Core** — *Anchor: save-rider feats at 8*
A success on a Will save against a fear effect is a critical success instead. While in any Breathing
Stance, allies within 10 feet gain a +1 circumstance bonus to saves against fear.

**Suffocating Pressure** — ✦ NEW — *Anchor: `Demoralize` / `Intimidating Glare`, upgraded to class DC*
**Frequency** once per round. 1 action (concentrate, emotion, fear, mental). While in a Breathing
Stance, choose one creature within 30 feet that can see you. It attempts a Will save against your
class DC.
- **Failure** It is frightened 1.
- **Critical Failure** It is frightened 2 and can't reduce its frightened value below 1 until the end
  of your next turn.

If the creature was **already frightened** when you used this action, it is also **off-guard to you**
until the end of your next turn, regardless of its save.
> *A pure-condition feat: no damage, and it feeds Concentrated Breathing and the Flower/Thunder
> riders by manufacturing off-guard without a flanking partner.*

---

## Level 10

**Adopted Form** — *(secondary ladder)*

**Total Concentration: Battle Trance** — *Anchor: focus-economy, monk 10–12*
**Frequency** once per day. When you roll initiative, regain 1 Breath Point (up to your maximum).

**Read the Opening** — *Anchor: Devise-a-Stratagem-adjacent economy*
1 action. Choose one enemy you can see. Your next nichirin Strike against it this turn gains a +1
circumstance bonus to the attack roll (+2 if you have hit it with a Form this combat).

**Twin-Blade Cascade** — ✦ NEW — *Anchor: the analysis's own "leave it at 6 and let it make three Strikes"*
**Prerequisite:** Twin-Blade Discipline.
Twin-Blade Discipline becomes **3 actions** and makes **three** Strikes, alternating blades. All three
use your current multiple attack penalty, then your MAP increases as though you had made one Strike.
> *`Impossible Flurry` (ranger 18) is six Strikes for three actions, free and at-will. Three Strikes
> at flat MAP for three actions, gated behind a feat, sits comfortably at 10.*

---

## Level 12

**Fourth Form** — *(primary ladder)*
Learn your primary style's fourth listed form.

**Stance Savant** — *Anchor: `Reflexive Stance` (monk 12) — identical effect, identical level*
**Trigger:** You roll initiative. Enter a Breathing Stance you know.
> *v3 cited "Stance Savant (monk 12)". No feat by that name exists in the Remaster; the feat that
> does exactly this, at exactly this level, is `Reflexive Stance`. The homebrew name is kept.*

**Persistent Ember** — *Anchor: Bloody Debilitation-tier persistent riders*
**Prerequisite:** Flame, Thunder, or Moon style (primary or secondary). Your Forms' persistent damage
dice increase one step, and a creature taking your style's persistent damage at the start of its turn
is off-guard to you until the end of your next turn.
> *Ruling for v4: this increases the **die size** of persistent damage from Forms. It does **not**
> apply a second time to the Flame stance's flat per-die persistent fire.*

**Resonant Opening** — *Anchor: debuff-extension feats at 10–12*
**Prerequisite:** Sound, Flower, or Mist style (primary or secondary). When one of your Forms makes a
creature off-guard, dazzled, or deafened, that condition lasts 1 additional round. Once per creature
per combat.

**Perfected Water Counter** — ✦ NEW — *Anchor: `Dueling Riposte` (fighter 8) widened four levels later*
**Prerequisite:** Flowing Water Counter.
Flowing Water Counter's trigger widens to **any melee Strike against you that fails or critically
fails**, and the riposte Strike does not increase your multiple attack penalty.

---

## Level 14

**Assimilated Form** — *(secondary ladder)*

**Transparent World** — *Anchor: Blind-Fight fully online + an info rider; upgrades the L11 chassis feature*
Your Transparent World Glimpse works continuously while you're in a stance: you ignore concealment
entirely, and invisible creatures are merely hidden to you. Once per round, when you hit a creature,
you learn its remaining HP category (healthy / bloodied / near death).

**Two-Style Flow** — *Anchor: strictly weaker `Fuse Stance` (monk 20) precursor*
**Prerequisite:** Flowing Stance Shift. Once per round, swap between your two known stances as a free
action.

**Whirling Gale** — ✦ NEW — *Anchor: `Whirlwind Strike` (fighter/barbarian **14**), exact parity*
**Prerequisite:** Cutting Gale.
3 actions, flourish. Make one nichirin Strike against **each enemy within your reach**. Your multiple
attack penalty increases only after all the Strikes resolve.
> *This is what v3's Cutting Gale claimed to be. It now exists, at the level `Whirlwind Strike`
> actually sits.*

> ⚠ **Slot congestion note (carried over from v3):** the full multi-style build wants Assimilated
> Form *and* Two-Style Flow at 14 and can only take one. This is deliberate — the dual-style path is
> supposed to cost something — but flag it to your players at level 4, when they commit.

---

## Level 16

**Selfless Guard** — *Anchor: champion-reaction / Bodyguard tier at 14–16*
**Reaction.** **Frequency** once per 10 minutes. *Trigger:* An ally within your Speed is targeted by
an attack you can see. Stride to the ally; if you end your movement adjacent to them, you become the
target of the attack instead.

**Breath of Endurance** — *Anchor: physical-perfection tier (monk 16)*
You age slowly, need only 4 hours of sleep, and gain a +2 circumstance bonus to Fortitude saves
against fatigued and drained effects. At half Hit Points or lower, you gain resistance to bleed
damage equal to half your level.
> *Ruling: Final/Forbidden Form self-costs are **unavoidable** and unaffected by this feat. That
> includes Moonbow's drained, Rengoku's fire damage, and Equinoctial Vermilion Eye's blindness.*

**Slayer's Reprisal** — ✦ NEW — *Anchor: `Furious Vengeance` (barbarian **16**), exact level parity*
**Reaction.** **Frequency** once per 10 minutes. *Trigger:* An ally within 30 feet is reduced to 0
Hit Points, or a creature within your reach critically hits you, while you're in a Breathing Stance.
**Effect:** Use a Form you know that takes 1 or 2 actions, spending a Breath Point as normal. You
can't use a Final/Forbidden Form this way.
> *`Furious Vengeance` is free, at-will, and unlimited, but triggers only on a critical hit against
> you and only yields one Strike. Ours has the broader trigger and yields a whole Form, so it pays
> with a Breath Point and a once-per-10-minutes frequency.*

---

## Level 18

**Awakened Mark** — *Anchor: Exalt-tier chassis upgrade*
**Prerequisite:** Demon Slayer Mark. At half Hit Points or lower your Mark manifests: you gain
**both** Mark benefits (+10-foot status bonus to Speed **and** the once-per-day free Form), and your
Forms' status bonuses increase by 1.
> *Updated for v4: the free-Form benefit now costs nothing rather than "2 FP," since no Form costs 2
> points any more. It still cannot be applied to a Final/Forbidden Form.*

**Unbroken Cadence** — ✦ NEW — *Anchor: `Impossible Flurry` (ranger 18) sets the level-18 ceiling*
You can use **two actions with the flourish trait** in the same turn instead of one. You still can't
use the same Form twice in a turn.
> *Powerful, and correctly priced: every flourish Form still costs a Breath Point, so the pool caps
> what this can do to three Forms in an encounter.*

**Breath of the Departed** — ✦ NEW — *Anchor: level-18 last-stand effects; genre-defining*
**Frequency** once per day. **Trigger:** You are reduced to 0 Hit Points while in a Breathing Stance.
**Effect:** Before you fall unconscious, use a Form you know that takes 1, 2, or 3 actions. You spend
a Breath Point if you have one; **if you have none, you use the Form anyway**. Then the triggering
effect resolves as normal.
> *This is the only place in the class where a Form fires on an empty pool, and it costs a feat at
> 18, a once-per-day frequency, and being at 0 HP.*

---

## Level 20

**Hidden Form** — *(the capstone; see Forms v4)*
**Prerequisite:** Fourth Form. Learn your primary style's **Final/Forbidden Form** (1 Breath Point,
once per 10 minutes, with its style's self-cost).

**Breath of the First** — *Anchor: Fuse Stance (monk 20)*
**Prerequisite:** Two-Style Flow. Merge your two stances into a single named stance of your creation
with both stances' benefits and both styles' damage types. You count as being in both styles' stances
for Forms and feat prerequisites.

---

## 3. Complete Feat Table (v4)

| Lvl | Feats available |
|---|---|
| 1 | Slayer's Conditioning, Demon Lore, Water-Wheel Footwork, Deep Breath, **Flowing Step** ✦ |
| 2 | Nichirin Draw, Slayer's Senses, Guard Break, **Twin-Blade Discipline** ↓ |
| 4 | Flowing Stance Shift, Breath-Enforced Blade, Anticipate Lunge, **Cutting Gale** ↓ |
| 6 | *Borrowed Form*, Flowing Water Counter ⚖, Scent of Blood, **Ragged Breath** ✦ |
| 8 | **Third Form**, Battle Breathing, Unshakeable Core, **Suffocating Pressure** ✦ |
| 10 | *Adopted Form*, Battle Trance, Read the Opening, **Twin-Blade Cascade** ✦ |
| 12 | **Fourth Form**, Stance Savant, Persistent Ember, Resonant Opening, **Perfected Water Counter** ✦ |
| 14 | *Assimilated Form*, Transparent World, Two-Style Flow, **Whirling Gale** ✦ |
| 16 | Selfless Guard, Breath of Endurance, **Slayer's Reprisal** ✦ |
| 18 | Awakened Mark, **Unbroken Cadence** ✦, **Breath of the Departed** ✦ |
| 20 | **Hidden Form**, Breath of the First |

**Bold** = primary Form ladder · *Italic* = secondary (multi-style) ladder · ✦ new in v4 ·
↓ moved down a tier in v4 · ⚖ rebalanced in v4.

**Deleted in v4:** Focused Breathing (→ chassis 1), Second Form (→ chassis 5), Rapid Concentration
(obsolete), Mark Precursor: Crimson Blade (→ chassis 9), Perfect Slayer's Focus (→ chassis 12).

---

## 4. Audit Summary

- **The feat tax is fixed.** A single-style slayer now spends **3** of 11 feat slots on the Form
  ladder instead of 5, and the class is playable out of the box without a pre-committed build. This
  brings the Breath Slayer into line with your own Saint ledger, where six Techniques are chassis
  features and every feat slot stays free.
- **The class has a floor.** `Concentrated Breathing` means a Breath Slayer with an empty pool is
  still contributing +8/+12/+16 per Strike at 4 weapon dice, instead of contributing nothing. That
  was the single largest gap against the five high-DPR builds.
- **Focus economy matches the monk.** Full-pool Refocus at 12 (`Meditative Focus` parity, not six
  levels late), a `Qi Center` analogue at 15, and an in-combat emergency point at feat 6.
- **Resistance is answered on the chassis, at 9.** Every style's damage type — slashing, fire,
  electricity, sonic — is commonly resisted at high level. Spirit damage on demand solves it in one
  line, fits the demon-slaying fantasy exactly, and costs no feat.
- **Level 20 is still a genuine choice** between the two capstone fantasies: your style's ultimate
  technique (**Hidden Form**) or transcendent dual-style mastery (**Breath of the First**). A slayer
  cannot have both.
- **The full multi-style build** now costs **8 of 11 slots** (down from 10): Flowing Stance Shift +
  Borrowed + Adopted + Assimilated + primary Third + primary Fourth + Two-Style Flow + Breath of the
  First. It still forgoes the Final Form, and it still collides with itself at 14 — deliberately.
- **Secondary Form feats still grant no pool**, and neither does anything else outside the chassis,
  so per-encounter output is hard-capped at **3 Forms** regardless of how many forms are known.

### Playtest watch list

1. **Unbroken Cadence** (18) — two flourishes per turn is the biggest action-economy swing in the
   class. It is pool-limited, but watch it alongside `Awakened Mark`'s free Form.
2. **Suffocating Pressure** (8) — off-guard on demand against an already-frightened target is a
   strong enabler for `Concentrated Breathing` and the Flower/Thunder riders. If it trivialises
   flanking at your table, restrict the off-guard clause to once per creature per combat.
3. **Ragged Breath** (6) and **Battle Trance** (10) are both once-per-day single-point recoveries and
   stack cleanly. A slayer with both, plus chassis Total Concentration at 12, has a lot of pool
   economy for a martial — verify at your table that the ceiling is "5 Forms in the hard fight of the
   day," not "5 Forms every fight."
4. **Twin-Blade Cascade** (10) — three Strikes at flat MAP for three actions. Compare against a
   Flurry ranger's turn at the same level before ruling on it.
5. **The level-14 collision** between `Assimilated Form` and `Two-Style Flow`. If your table finds it
   punishing rather than interesting, the cleanest fix is moving `Two-Style Flow` to 16.
