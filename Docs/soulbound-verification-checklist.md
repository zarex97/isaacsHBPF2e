# The Soulbound — Live Verification Checklist

*Every feature, feat, kidō, Spirit rung and Severing Art in `Docs/soulbound-guide-v1.md` (v1.4), one
row each, to be driven **in the live world `pf`** and marked off only when the thing actually
happened at the table.*

*Opened 14 September 2026. Module v99.0.0 (working tree, junctioned into Foundry Data), Foundry
14.364, pf2e 8.4.1, world `pf`, user Gamemaster.*

---

## 0 — How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the guide's sentence happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Notes** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling), recorded so the row is not mistaken for a gap |

**The standard is the Saint's:** *every sentence in the guide should happen by itself.* "It is on the
sheet" is not a pass. A row passes when the number, the condition, the area, the frequency and the
cost all arrive without a human remembering them.

**Evidence** names what proved it — the rig check, the chat card, the resolved rule value, the
console read. A row with no evidence is ☐ no matter how obviously correct the JSON looks.

---

## 1 — Order of work

The user's order, and it is also the cheapest order because each pass reuses the previous one's
character:

1. **§2 Chassis** — shared by all fifteen Spirits; a chassis bug is fifteen bugs.
2. **§3 Soul Reaper Lineage** + **§4 Kidō** — the Lineage with the most moving parts.
3. **§5 A Soul Reaper Spirit, all four rungs**, levelling 1 → 20 and *buying the class feats on the
   way* (levels 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20), testing each as it is bought.
4. **§6 The remaining four Soul Reaper Spirits.**
5. **§7 Hollow**, **§8 Quincy** — same shape.
6. **§9 Feats** not reachable by one character (Lineage-gated, mutually exclusive).
7. **§10 Final Release / Severance**, fifteen endings.

---

## 2 — Chassis (guide §3, §4)

| # | Item | Lvl | What must happen by itself | Status | Evidence / Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| C-01 | Hit Points | 1 | 10 + Con per level | ✅ | 10/30/50…200 across L1–20 |
| C-02 | Perception | 1→5 | Trained, **Expert at 5** (Alertness) | ✅ | rank 1→2 at L5 |
| C-03 | Fortitude | 1→11 | Expert at 1, **Master at 11** (Juggernaut) | ✅ | 2→3 at L11 |
| C-04 | Reflex | 1→15 | Expert at 1, **Master at 15** (Evasion) | ✅ | 2→3 at L15 |
| C-05 | Will | 1→3 | Trained at 1, **Expert at 3** (Iron Will), **never Master** | ✅ | 1→2 at L3, still 2 at L20 |
| C-06 | Reiatsu DC | 1→9→17 | Trained / **Expert at 9** / **Master at 17**, never Legendary | ✅ | 1→2 at L9→3 at L17, never 4 |
| C-07 | Attacks | 1→5→13 | Simple + martial + unarmed trained; martial **Expert at 5**, **Master at 13** | ✅ | Martial is Expert at 5 and Master at 13. Simple and unarmed advance with it, which **is** what the ledger buys — see the withdrawal of SB-10 |
| C-08 | Crit specialization | 5 | Weapon Expertise grants critical specialization | ☐ | |
| C-09 | Weapon specialization | 7→15 | +2 / +3 / +4, greater at 15 | ☐ | |
| C-10 | Defenses | 1→13 | Light + unarmoured trained; **Expert at 13** (Spirit Weave); medium never | ✅ | 1→2 at L13; medium stays 0 at every level |
| C-11 | Initial skills | 1 | Religion, **Spirit Lore**, Lineage skill, +3 + Int | ✅ | Religion + Society trained, `spirit-lore` present at L1 |
| C-12 | Class feat levels | — | Feats at **1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20** — eleven, one list | ☐ | v1.4 §1: no separate "soul reaper feat" line |
| C-13 | **Spirit Weapon** — profiles | 1 | Blade 1d8 S versatile P two-hand d10 · Great Blade 1d10 S **two-handed usage, sweep** · Paired Blades 1d6 S agile finesse twin · Spirit Bow 1d8 P propulsive, range 60, reload 0 **(Quincy only)** | ✅ | Blade source is `1d8 slashing` + `two-hand-d10` + `versatile-p`; all four profiles offered by the ChoiceSet |
| C-14 | Spirit Weapon — proficiency | 1 | Always counts as a martial weapon you're proficient with, in every released form | ☐ | |
| C-15 | **Bonded** | 1 | Manifest/dismiss free action once per round; can't be taken while dismissed; Interact to recall from 30 ft; re-forms after 10 min if broken | ☐ | |
| C-16 | **Soul-Etched** | 1 | Rune transfer in/out during daily preparations, free, no Crafting check | ☐ | |
| C-17 | **Spirit-Cutting** | 1 | Strikes may deal **spirit** damage instead; affect incorporeal as *ghost touch* | ☐ | |
| C-18 | **Voice in the Blade** | 1 | **+1 circumstance** to saves vs. **possession** and **mental**; can't be Stolen or permanently Disarmed | ☐ | v1.4 §3 |
| C-19 | **Reiatsu pool** | 1/5/11 | Max **1 / 2 at 5th / 3 at 11th**, *regardless of how many kidō are known* | ⚠️ | **The reported bug.** Drives correct today at L1–20 for a Quincy who knows only Gritz + Miracle (`max` 1/1/1/1/2/2/2/2/3/3/3/3/3). pf2e derives `focus.max` as +1 per non-cantrip focus spell clamped to `cap`; `scripts/soulbound/reiatsu.mjs` overrides it in a `prepareDerivedData` wrap. Not reproduced — see §11 |
| C-20 | **Steady the Breath** | 1 | Refocus restores 1 point per 10 minutes | ☐ | |
| C-21 | **Rising Pressure** — grant | 1 | First time each round you deal spirit-weapon damage to an enemy **or** take damage from one, +1 point | ☐ | |
| C-22 | Rising Pressure — once per round | 1 | A second trigger in the same round pays nothing | ☐ | |
| C-23 | Rising Pressure — pool ceiling | 1 | Never exceeds max | ☐ | |
| C-24 | Rising Pressure — **per-encounter cap** | 1 | Total granted in one encounter ≤ max pool (3 at 11th+) | ☐ | Guide §1.3 calls this load-bearing. The live `quincy` carries `gained: 2, round: 2` — check the **third** grant lands at L11+ |
| C-25 | Rising Pressure — ledger reset | 1 | A new encounter resets the count | ☐ | Also check a Soulbound **added to a combat after it started** |
| C-26 | **Spirit Sense** | 1 | Undead/haunts/spirits/incorporeal within **60 ft** are **hidden**, not undetected, through thin barriers; see and target incorporeal normally | ☐ | |
| C-27 | **Konsō** | 1 | 10-minute exploration activity, Religion or Spirit Lore vs. its DC, four outcomes | ☐ | |
| C-28 | **Flash Step** | 3 | 1 action, move + reiatsu, **once per round**, Stride up to Speed, doesn't trigger reactions | ☐ | |
| C-29 | **Greater Flash Step** | 11 | Until your next turn, the first attack against you each round needs a **DC 5 flat check** | ✅ | **SB-11 fixed.** The afterimage was granted outright at 11th and worn for ever. `Flash Step` now applies it, predicated on `feature:greater-flash-step`. Live: no afterimage at L3, one at L13 lasting 1 round to turn-start |
| C-30 | **Departed Flesh** | 3 | Immune to disease; no food/drink; success vs. poison becomes critical success | ☐ | |
| C-31 | **Release** | 1 | 1 action, auditory/concentrate/reiatsu; **first Release each encounter is free**, re-releasing costs 1 point; lasts the encounter; can't Release while dismissed; **is not a stance** | ✅ | **SB-6 fixed.** Driven live at L13: sealed actor has no form effect, Release applies `Effect: Released` + the Spirit's form, first Release each encounter is free, a second after re-sealing costs 1 point (3→2), and a third on an empty pool is **refused** |
| C-32 | **Refined Release** | 9 | The Spirit's Refined benefit turns on; base rank 5 | ✅ | Senbonzakura 15→20 ft at L9, live. **SB-7 fixed**: the size now travels with the technique as an `sb-refined-area-<n>` tag, so Getsuga is 60, La Gota 40, and the three whose Refined is not a widening gain nothing |
| C-33 | **Full Release** — cost | 13 | 2 actions, **once per day**, requires released form **and ≥1 Reiatsu Point** | ✅ | **SB-6 fixed.** The L13 feature no longer grants the effect; the action does, and it refuses when sealed or when the pool is empty. pf2e's own `frequency` still counts the daily use |
| C-34 | Full Release — die step | 13 | Spirit weapon damage die +1 step | ✅ | **SB-6 fixed.** `Effect: Full Release` now carries the `damage-dice-faces` upgrade. Live: 1d8 / `two-hand-d10` → **1d10 / `two-hand-d12`**, and back when it ends. Predicated on `not soulbound:full-release:no-die-step`, which `Effect: Tensa Zangetsu` sets |
| C-35 | Full Release — free technique | 13 | Release Technique costs nothing, **once per round** | ✅ | **SB-6 fixed.** `Unbound Technique` — an action granted by `Effect: Full Release`, frequency 1/round. Live: the card reads *"Unbound Technique paid for Senbonzakura — no Focus Point spent. 0 left"*, the pool does not move, and the next use is refused |
| C-36 | Full Release — pressure emanation | 13 | **15-ft emanation**; enemy ending its turn there: Will vs. Reiatsu DC or **frightened 1** (2 on crit fail); success = immune 10 min | ✅ | **SB-15 and SB-22 fixed, and promoted to a real aura.** It was a `turn-end` *area rider*, which sweeps whoever stands there when the **caster's** turn ends; the guide says an enemy that ends **its** turn in it. It is a pf2e `Aura` now, radius 15 (20 Perfected), enemies only. Live: the ghoul ended its turn and came out **frightened 2** |
| C-37 | Full Release — end state | 13 | **Fatigued** until 10 minutes' rest; no second use that day | ✅ | **SB-6 fixed.** A `deleteItem` hook drops the rung and applies **fatigued** when `Effect: Full Release` goes, by timer or by hand. Verified live at L13 |
| C-38 | **Perfected Full Release** | 17 | 2 minutes, **no fatigue**, emanation 20 ft | ✅ | **SB-6 fixed.** `fullReleaseShape` is now stamped onto the effect as it is created. Live at L17: duration **2 minutes**, rider emanation **20 ft**, and **no fatigue** when it ends |
| C-39 | **Unsealed** | 19 | Full Release **twice per day**; immune to fear while in it; first crit each round with the spirit weapon refunds 1 point **ignoring the per-encounter cap** | ❌ | **SB-6.** Frequency does rise to 2/day on the feat, but there is no daily use to spend |
| C-40 | Technique heightening | — | Every reiatsu effect auto-heightens to **half level rounded up**, no rank, Reiatsu DC + key attribute | ☐ | |

---

## 3 — Soul Reaper Lineage (guide §5.1)

| # | Item | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SR-01 | Granted skill | 1 | **Society** trained | ✅ | Society trained at L1 |
| SR-02 | **Kidō Adept** | 1 | **Two** chosen kidō at 1st, on top of free **Shō** | ✅ | Two `Kidō Learned` at L1 plus Shō. **SB-3 fixed**: the L1 prompt offers exactly the seven rank-1 kidō |
| SR-03 | Kidō Adept — ladder | 5/9/13/17 | One more chosen kidō at each; **six chosen** in total | ✅ | **SB-2 and SB-3 fixed.** Live: Rikujōkōrō appears at 7th, Kin and Sōren at 9th, Kurohitsugi at 15th, and six prompts produce **six distinct** kidō — a repeat is refused |
| SR-04 | **Zanjutsu** | 5 | Access to the Zanjutsu feat family **plus one technique free** | ✅ | **SB-4 fixed.** The 5th-level prompt offers only **Hitotsume: Nadegiri** and **Sōkotsu** |
| SR-05 | **Zanjutsu Mastery** — dice | 15 | Zanjutsu technique dice +1 step (d6→d8, d8→d10) | ☐ | |
| SR-06 | Zanjutsu Mastery — refund | 15 | Once per round, a crit with the spirit weapon refunds 1 point, **ignoring the per-encounter cap** | ☐ | |
| SR-07 | Release ladder naming | — | Shikai → Bankai | ☐ | |

## 3b — Hollow Lineage (guide §5.2)

| # | Item | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| H-01 | Granted skill | 1 | **Athletics** trained | ☐ | |
| H-02 | **Hierro** | 1 | Resistance to **physical** = half level, minimum 1 | ☐ | |
| H-03 | **Sonido** | 1/11 | **+5 ft untyped** to all Speeds, **+10 at 11th** | ☐ | v1.4 §6: untyped, not status |
| H-04 | **Cero and Bala** | 1 | Exactly these two; `Additional Kidō` is closed | ☐ | |
| H-05 | **Regeneración** | 5/11/17 | Fast healing **2 / 4 / 6** | ☐ | |
| H-06 | Regeneración — off switches | 5 | Off while **dying**; suppressed until end of next turn by **spirit**, **holy** or **vitality** damage | ☐ | |
| H-07 | **Segunda Piel** | 15 | Hierro also resists **spirit**; holy/vitality no longer suppress Regeneración (spirit still does) | ☐ | |

## 3c — Quincy Lineage (guide §5.3)

| # | Item | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Q-01 | Granted skill | 1 | **Crafting** trained | ☐ | |
| Q-02 | **Heilig Bogen** | 1 | Spirit Bow profile available; no ammunition; die −1 step in a dead-reishi zone | ☐ | |
| Q-03 | **Blut** — economy | 1 | Free action, **once per round**, choose Vene **or** Arterie, lasts until start of next turn, **never both** | ✅ | Live on a 20th-level Quincy: the Blut action prompts Vene/Arterie, and choosing one removes the other |
| Q-04 | **Blut Vene** | 1 | Resistance to physical = half level, minimum 1 | ✅ | Blut Vene gives **physical resistance 10** at 20th — half level |
| Q-05 | **Blut Arterie** | 1 | Strikes ignore resistance to **physical and spirit**; target's cover one step less; **no bonus to attack, damage or DC** | ✅ | **SB-36 fixed.** Live: the bypass selects on a Strike and not a spell, for physical and spirit; cover is pierced one step by a shared ephemeral effect |
| Q-06 | **Heizen and Gritz** | 1 | Exactly these two; `Additional Kidō` is closed | ☐ | |
| Q-07 | **Seal the Art** | 5 | 2 actions, 1 point, 30 ft; counteract with Reiatsu DC proficiency + key attribute, **counteract rank = half level rounded up** | ⚠️ | Live: the action posts, offers the suppressible effects, and rolls **Counteract — DC 16, critical success**. Its **1 Reiatsu Point is now actually spent** — nothing charged it before, because pf2e only deducts focus for a *spell* and this is an action |
| Q-08 | Seal the Art — release states | 5 | A release state is **suppressed until the end of the target's next turn**, not ended, and can't be re-entered in that time | ☐ | |
| Q-09 | **Sklaverei** | 15 | Successful counteract refunds 1 point **ignoring the cap**, target **off-guard** until end of its next turn; crit success vs. a release state suppresses for **1 minute** | ✅ | **SB-20 fixed.** Live at 15th: a successful counteract left the target **off-guard** and refunded the point, so the pool went 2 → 2 — spent one, got one back, ignoring Rising Pressure's ceiling |

---

## 4 — Kidō (guide §6)

| # | Kidō | Act. | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| K-01 | **Shō — Thrust** *(cantrip)* | 1 | 1 | 30 ft, basic Reflex, **1d4 + key attribute** force; crit fail also pushed 5 ft; **H(+2) +1d4**; costs nothing | ☐ | |
| K-02 | **Byakurai — Pale Lightning** | 1 | 1 | 60 ft, **spell attack**, 2d6 electricity, doubled on crit, **ignores lesser cover**; H(+1) +1d6 | ☐ | |
| K-03 | **Shakkahō — Crimson Bloom** | 2 | 1 | 60 ft, **10-ft burst**, basic Reflex, 2d6 fire; H(+1) +1d6 | ☐ | |
| K-04 | **Sōkatsui — Sundering Wave** | 2 | 1 | **30-ft line**, basic Reflex, 2d4 spirit; failures **pushed 10 ft**; H(+1) +1d4 | ☐ | |
| K-05 | **Sōren Sōkatsui — Twin Wave** | 2 | 9 | **60-ft line**, basic Reflex, 7d6 spirit; failure → **1d6 persistent fire**; base rank 5, H(+1) +1d6 | ☐ | |
| K-06 | **Kurohitsugi — Black Coffin** | 2 | 15 | 60 ft, **10-ft burst**, basic Reflex, 9d6 void; crit fail **immobilized** until end of its next turn (Escape vs. Reiatsu DC); base rank 8 | ☐ | |
| K-07 | **Sai — Restrain** | 1 | 1 | 30 ft, Reflex. Fail: **immobilized 1 round**. Crit fail: **1 minute**, save at end of each of its turns | ☐ | |
| K-08 | **Hainawa — Crawling Rope** | 1 | 1 | 30 ft, Reflex. Fail: **−10 ft status** to Speeds 1 round, **can't Step**. Crit fail: also **off-guard** | ☐ | |
| K-09 | **Rikujōkōrō — Six Rods** | 2 | 7 | 30 ft, Fortitude. Fail: **immobilized + no manipulate actions**, 1 round. Crit fail: 2 rounds. Base rank 4 | ☐ | |
| K-10 | **Danku — Splitting Void** | R | 1 | Trigger: you or an ally within 15 ft would take damage from a ranged attack, spell or area. **Resistance = your level** vs. that damage | ☐ | |
| K-11 | **Kin — Silence the Chain** | 2 | 9 | 30 ft, Will. Fail: **stupefied 2** 1 min, no spells/kidō 1 round. Crit fail: stupefied 3, 2 rounds. Base rank 5 | ☐ | |
| K-12 | **Kaidō — Mend the Weave** | 2 | 1 | Touch, **5 HP per half level rounded up**, min 5; at 9th also removes one of clumsy/enfeebled/stupefied | ☐ | |
| K-13 | **Bala** *(cantrip)* | 1 | 1 | 60 ft, ranged spell attack, **1d4 + key attribute** force, doubled on crit; **agile for MAP only (−4/−8)**; H(+2) +1d4; costs nothing | ☐ | v1.4 §8 |
| K-14 | **Cero** | 2 | 1 | **60-ft line**, basic Reflex, 2d6 force; H(+1) +1d6 | ☐ | |
| K-15 | **Heizen** *(cantrip)* | 1 | 1 | **15-ft line**, basic Reflex, **1d6** force, no attribute modifier; H(+2) +1d6; costs nothing | ☐ | |
| K-16 | **Gritz** | 2 | 1 | 30 ft, Reflex. Fail: **immobilized 1 round**. Crit fail: **restrained 1 minute**, save at end of each of its turns | ☐ | |
| K-17 | Cost discipline | — | Every costed kidō costs **exactly 1** Reiatsu Point; every cantrip costs **0** | ☐ | Guide §1.4: no 2-point effects anywhere |
| K-18 | Not spells | — | Kidō use the **Reiatsu DC**, can't be counteracted as spells, can't be slot-heightened | ✅ | **SB-8 fixed.** The Reiatsu entry's tradition is overridden to `null`, so a Technique's traits no longer include **arcane** and `spell:trait:arcane` is gone. The Saint's Cosmo picks a real tradition and is untouched |
| K-19 | Traits | — | Every kidō carries **kidō** + **reiatsu** + one of **destruction / binding / mending** | ☐ | |
| K-20 | Lineage lock | — | `Additional Kidō` is **Soul Reaper only**; a Hollow/Quincy can never exceed two | ☐ | |

---

## 5 — Spirits (guide §7)

Four rungs each: **Form** (1st) · **Release Technique** (1st) · **Refined** (9th) · **Full Release**
(13th). A Spirit passes only when all four do.

### 5A — Soul Reaper Spirits

| # | Spirit / rung | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-01 | **Senbonzakura** — Shikai Form | 1 | Strikes gain **reach 15**, lose two-hand and twin, hands empty, **ignore cover** between you and target | ⚠️ | **SB-6 fixed for the gate.** `reach-15` is absent while sealed and arrives with Release. Still open: the form never **removes** two-hand/twin as the guide requires, and the cover-ignoring clause is a roll option nothing consumes |
| S-02 | Senbonzakura — Release Technique | 1 | 2 actions, **15-ft emanation**, basic Reflex, 2d6 slashing; area is **difficult terrain for enemies** until start of your next turn; H(+1) +1d6 | ✅ | Cast live at rank 10: 20-ft emanation, basic Reflex **DC 37**, **11d6 slashing** (guide's 11d6 target), 1 Reiatsu Point spent, three enemies auto-targeted, lingering difficult-terrain rider authored |
| S-03 | Senbonzakura — Refined | 9 | Emanation **20 ft**; crit fail → **off-guard** until start of your next turn | ✅ | Refined widening added: 20-ft emanation via `alternateArea` on `feature:refined-release` (SB-28) |
| S-04 | **Senbonzakura Kageyoshi** — Bankai | 13 | Second **20-ft emanation** placed within 60 ft; at the start of each of your turns every enemy in **either** takes **5d6** slashing (basic Reflex) | ✅ | **Finished.** Two emanations in **one** rider, so a creature in both is caught once — guide §7A says *in either*. Live on a clean combat: unplaced, only the enemy beside the caster took 5d6; with the second sent 90 feet away, that enemy **and** the two at the far end were caught, each once |
| S-05 | Bankai — Sustain / move | 13 | Sustain once per round to move the second emanation up to 30 ft **or** switch mode | ✅ | **Finished.** The Sustain offers **Send them** (places or moves the second emanation, within 60 ft) alongside Gokei, Senkei and Neither — one action, once per round, exactly as the guide gives them |
| S-06 | Bankai — **Gokei** | 13 | Second emanation becomes a **10-ft burst** on one enemy; **double** damage; no cover or concealment against it | ✅ | **Finished.** Gokei reshapes the second area into a **10-foot burst** at **double** damage rather than adding a third. Live: `5d6 × 2 = 36` and `× 2 = 26` on the two at the anchor, and nobody else |
| S-07 | Bankai — **Senkei** | 13 | 20-ft cage around you and one enemy; neither can leave; your Strikes vs. it ignore **all** resistances; **one extra Strike each round at current MAP**; **you lose reach and cover-ignoring**; can't target anyone outside | ✅ | **Finished.** Senkei takes `reach-15` back off the spirit weapon, and a `bypass` makes your Strikes **ignore all resistances**. The cage's movement restriction and the extra Strike arrive as a turn-start prompt — neither is a number pf2e can enforce |
| S-08 | **Zangetsu** — Shikai Form | 1 | Damage die +1 step; gains **two-handed d12** if not already two-handed; **begin every encounter already released, free and no action** | ✅ | Live: sealed **1d8 / two-hand-d10** → released **1d10 / two-hand-d12**, so the die step carries the two-hand trait with it. `soulbound:release:never-sealed` is set and `combatStart` spends the free first Release for it |
| S-09 | Zangetsu — **Getsuga Tenshō** | 1 | 2 actions, **30-ft line**, basic Reflex, 2d6 spirit; H(+1) +1d6 | ☐ | |
| S-10 | Zangetsu — Refined **Kuroi Getsuga** | 9 | Line **60 ft**, **ignores resistance to spirit**, crit fail → **1d6 persistent spirit** | ✅ | Refined widening added: 60-ft line (SB-28) |
| S-11 | **Tensa Zangetsu** — Bankai | 13 | **No die step** (overrides Full Release); **+10 ft status** to all Speeds; **Flash Step twice per round** | ✅ | Live at L13: **no further die step** in Full Release (1d10 stays 1d10), **+10 status to Speeds** (25→35), **Flash Step frequency 2** |
| S-12 | Tensa Zangetsu — compressed Getsuga | 13 | Getsuga Tenshō becomes **1 action**, line **60 ft** (90 with Refined) | ✅ | **SB-16 and SB-17 fixed.** Live at L13 in Tensa: Getsuga is **90 feet** (60 without Refined Release) and **1 action**. Both alterations were dead — one named a slug that does not exist, the other a property pf2e has no handler for |
| S-13 | Tensa Zangetsu — free Step | 13 | First hit each round with the spirit weapon → **Step** as a free action | ⚠️ | A `strike-resolved` prompt on a hit with the spirit weapon now says you may Step. A Step's direction is the player's, so it is a prompt at the right moment rather than a move chosen for them; the once-per-round limit is on the card, not enforced |
| S-14 | **Hyōrinmaru** — Shikai Form | 1 | Damage type becomes **cold** (spirit still selectable); **on a crit, −5 ft status** to target Speeds until end of your next turn | ✅ | Damage type becomes cold; a critical hit applies `Effect: Frosted Stride` through a `strike-resolved` rider |
| S-15 | Hyōrinmaru — **Ryūsenka** | 1 | 2 actions, Strike; hit → +1d6 cold **and** Fortitude or **immobilized** until end of its next turn (Escape vs. Reiatsu DC); crit → +2d6 cold and **off-guard**; H(+2) +1d6 | ☐ | |
| S-16 | Hyōrinmaru — Refined **Guncho Tsurara** | 9 | Ryūsenka may be a **ranged** Strike within 60 ft; the blade returns immediately | ☐ | |
| S-17 | **Daiguren Hyōrinmaru** — Bankai | 13 | **Fly Speed** = Speed; **cold resistance = level** | ✅ | `Resistance` cold = `@actor.level` and a fly Speed matching land Speed, both authored as rule elements |
| S-18 | Bankai — petal-flowers | 13 | **Three charges**; **once per round** spend one | ✅ | **SB-18 fixed.** Live: three petals spend one at a time down to **zero** and the Bankai survives; a fourth is refused *"not enough charges"*; a second in the same round is refused *"already spent this round"*. Before, spending the third **deleted the whole Bankai** |
| S-19 | Petal — **Sennen Hyōrō** | 13 | **20-ft burst** within 60 ft, Reflex; fail 5d6 cold + **immobilized**; crit fail **restrained 1 minute**; H(+1) +1d6 | ⚠️ | Authored: 20-ft burst within 60 ft, basic Reflex, 5d6 cold, immobilized on a failure and restrained on a critical failure. Shares the petal pool proven on S-20; its own riders not yet driven |
| S-20 | Petal — **Hyōryū Senbi** | 13 | **60-ft line**, basic Reflex, 5d6 cold; fail → **slowed 1** until end of its next turn; H(+1) +1d6 | ✅ | Driven live: the card posts a **60-foot line, basic Reflex**, the cast spends **one petal and one Reiatsu Point**, and a second cast in the same round is **refused and costs nothing** — the refusal lands before the point is spent |
| S-21 | Petal — **Zanhyō Ningyō** | 13 | Reaction when hit: reduce damage by **twice your level**; the doll shatters | ⚠️ | Authored as a `damage-applied` reaction whose prompt now also spends a petal, granting `Effect: Remnant Ice Doll` — resistance to all damage `@actor.level*2`, which is the guide's twice-your-level reduction |
| S-22 | Bankai — Perfected | 17 | **Restores one spent petal-flower at the start of each of your turns** | ✅ | Live: a turn start at 13th gives nothing back; at 17th the pool climbs 1 → 2 → 3 and stops at three. Declared on the effect (`chargeRefresh`), not written into code |
| S-23 | **Ryūjin Jakka** — Shikai Form | 1 | Damage type **fire**; weapon gains **deadly d8**; **fire resistance = half level** | ✅ | Live at L13: **fire resistance 6** (half level), damage type fire, `deadly-d8` |
| S-24 | Ryūjin Jakka — **Ennetsu Jigoku** | 1 | 2 actions, **15-ft emanation**, basic Reflex, 2d6 fire; fail → **1d4 persistent fire**; H(+1) +1d6, +1 persistent die every **other** increment | ☐ | |
| S-25 | Ryūjin Jakka — Refined | 9 | Emanation **20 ft**; ground inside becomes **difficult terrain** until end of your next turn | ✅ | Refined widening added: 20-ft emanation (SB-28) |
| S-26 | **Zanka no Tachi** — Bankai | 13 | Die **+2 steps**; **you lose your fire resistance**; at the start of each of your turns every creature **other than you** within 30 ft — **allies included** — takes **1d6 fire, no save** | ✅ | Live: **two** die-step upgrades, and the fire resistance **disappears** under Zanka no Tachi — the Shikai's `Resistance` is predicated `{not: self:effect:zanka-no-tachi}`. The ambient 30-ft burn reaches everyone but the caster after **SB-15** |
| S-27 | Aspect — **Higashi** | 13 | Strikes ignore **all** resistances and immunities; a creature you damage **can't regain HP** and its regeneration/fast healing is suppressed until end of your next turn | ☐ | |
| S-28 | Aspect — **Nishi** | 13 | **Fire immunity**; **resistance to all = half level**; a creature that damages you with an unarmed attack, melee weapon or Grapple takes **4d6 fire** | ✅ | Live: choosing **Nishi** grants fire immunity and **resistance to all damage 6** at L13, plus the 4d6 retributive rider |
| S-29 | Aspect — **Minami** | 13 | **20-ft emanation**; enemy ending its turn there: Reflex or **grabbed** by ash-figures (Escape vs. Reiatsu DC); the figures are **not creatures** and take no actions | 🔧 | **SB-15 fixed**: Minami's 20-ft ash aura fans out now. Awaiting a live drive |
| S-30 | Aspect — **Kita** | 13 | 2 actions, once per round, **60-ft line**, basic Reflex, **5d6 fire** that **cannot be reduced by fire resistance, Blut Vene or Hierro**; H(+1) +1d6 | ✅ | Settled with the author: **stays `affects: \"enemies\"`**, unlike Zanka no Tachi's ambient burn |
| S-31 | Aspect switching | 13 | **Sustain once per round** to change aspect; the chosen one lasts until another is chosen | ✅ | New `Zanka no Tachi — Sustain`, once per round, granted by the Bankai effect. Live: the dialog offers exactly **Higashi / Nishi / Minami / Kita** and no way to stand in none of them — the guide says an aspect lasts until you select another — and picking Kita removes Nishi |
| S-32 | **Kyōka Suigetsu** — Shikai **Kanzen Saimin** | 1 | On Release, and when a creature that can see first observes you released: Will vs. Reiatsu DC or **hypnotized 1 minute** | ✅ | **SB-21 fixed.** Live at 13th: Releasing rolled **Will vs DC 27** for every enemy that could see, and the mirror landed on the failures |
| S-33 | Kanzen Saimin — the lie | 1 | Hypnotized creature perceives you **5 ft** from where you stand; its attacks need a **DC 5 flat check**; you are **hidden** from it whenever not adjacent | ✅ | `Effect: Hypnotized` carries the flat check as a `strike-resolved` rider on the hypnotized creature, so it rolls when *it* attacks |
| S-34 | Kanzen Saimin — save ladder | 1 | Crit success → immune 24 h · success → immune 10 min · crit fail → hypnotized 1 h **and auto-hypnotized once per encounter thereafter** · **blind creatures unaffected** | ✅ | Live, all four degrees: failure → hypnotized **1 minute**; critical failure → **1 hour** and `permanentVictim: true` in the register — the *seen it once, falls to it forever* clause; success → `immuneUntil` set ten minutes out; a blinded creature never rolls |
| S-35 | Kyōka Suigetsu — **Shikake** | 1 | 2 actions, 30 ft, Will. Fail: target treats a chosen creature in its reach **as you**, and **you as an ally**, until end of its next turn. Crit fail: 2 rounds. Illusion/mental/visual | ✅ | Driven: authored correctly all along — `Effect: Shikake` for 1 round on a failure, 2 on a critical failure, and the Refined off-guard predicated on `feature:refined-release`, which **SB-12** repaired |
| S-36 | Kyōka Suigetsu — Refined | 9 | Shikai flat check rises to **DC 6**; Shikake's failure also makes the target **off-guard to the misidentified creature** | ✅ | Live: the flat check was stamped at **DC 6** because the caster had Refined Release. The effect lives on the *observer*, where no predicate can see the hypnotist's features, so the DC is stamped on at creation |
| S-37 | **Kanzen Saimin: Sōten Kisshun** — Full Release | 13 | All enemies within **60 ft** who can see you re-attempt the Shikai save, **including the previously immune**; only a **critical hit** ends it; Sustain once per round to force one hypnotized creature to save or be **confused** until the end of its turn | ✅ | Live: the Full Release sets `soulbound:kyoka:total`, and the sweep re-rolled **7 saves including the 4 who were immune** — guide §7A's *"including those who previously succeeded or became immune"* |

### 5B — Hollow Spirits

| # | Spirit / rung | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-38 | **Pantera** — Resurrección Form | 1 | Two **claw** unarmed attacks 1d8 S, agile, finesse, brawling; **Speed +10 ft, stacking with Sonido** (40 ft total at 1st) | ☐ | v1.4 §7 |
| S-39 | Pantera — **Garra de la Pantera** | 1 | 2 actions, **30-ft cone**, basic Reflex, 2d6 piercing; area **difficult terrain for enemies** until start of your next turn; H(+1) +1d6 | ☐ | |
| S-40 | Pantera — Refined | 9 | Claws become **1d10**; after Garra you may **Step** as a free action | ✅ | **SB-28 fixed.** Live: claws read **1d8 at 1st and 1d10 at 9th**. Step after Garra is a `self` prompt rider |
| S-41 | **Pantera — Segunda Etapa** | 13 | Speed **+10 more**; claws gain **deadly d10**; once per round a claw crit grants an extra claw Strike at current MAP | ☐ | |
| S-42 | Segunda Etapa — Garra upgrade | 13 | Cone **60 ft**; crit fail → **2d6 persistent bleed** | ☐ | |
| S-43 | **Murciélago** — Resurrección Form | 1 | **Fly Speed** = Speed; weapon becomes **Luz de la Luna** 1d10 P, versatile S, **reach**, re-forms in hand instantly | ☐ | |
| S-44 | Murciélago — **Cero Oscuras** | 1 | 2 actions, 90 ft, **ranged spell attack** with Reiatsu DC proficiency + key attribute, **3d6** spirit, doubled on crit; H(+1) +1d6 | ☐ | |
| S-45 | Murciélago — Refined | 9 | Crit → target **off-guard** until start of your next turn; gains a **5-ft burst** at the target dealing **half** damage to others (basic Reflex) | ☐ | |
| S-46 | **Murciélago — Segunda Etapa** | 13 | Fly **+20 ft**; **resistance to all except spirit = half level**; **Regeneración doubles** and restores lost limbs | ☐ | |
| S-47 | Segunda Etapa — **Lanza del Relámpago** | 13 | 2 actions, once per round, 120 ft; ranged spell attack **5d6 electricity** (doubled on crit); **whether or not you hit**, a **15-ft burst** for **5d6 fire**, basic Reflex; H(+1) +1d6 to both | ☐ | |
| S-48 | **Arrogante** — Resurrección Form | 1 | Weapon becomes **Gran Caída** 1d12 S, two-handed, sweep, forceful; immune to disease, poison, and **doomed never rises past 1** | ✅ | **SB-27 fixed.** Live: `doomed.max` reads **1** at 1st and 9th, while Pantera and Los Lobos in the same world read 4 |
| S-49 | Arrogante — **Respira** | 1 | 2 actions, **15-ft emanation**, basic Fortitude, 2d6 void; fail → **enfeebled 1** 1 min; crit fail → **enfeebled 2 + clumsy 1**; **lingers**: 1d6 void, no save, to an enemy entering or ending its turn there until start of your next turn; H(+1) +1d6, lingering +1d6 every **other** increment | ☐ | |
| S-50 | Arrogante — Refined | 9 | Emanation **20 ft**; objects and unattended structures **broken** (already-broken destroyed); crit fail also **can't regain HP** until end of its next turn | 🔧 | **SB-28 fixed**: 20-ft emanation, `Effect: Respira — Cannot Heal` on a critical failure, broken objects as a Note. Awaiting a live drive |
| S-51 | **Respira Absoluta** — Segunda Etapa | 13 | Respira becomes **permanent and free**: a **20-ft emanation**; enemies ending their turn take **3d6 void** (basic Fortitude), **enfeebled 1** 1 round on a failure | 🔧 | **SB-15 fixed**: Respira Absoluta's 20-ft aura fans out now. Awaiting a live drive |
| S-52 | Respira Absoluta — decay | 13 | A creature in the emanation targeting you with an attack or spell must make a **DC 5 flat check** or it has **no effect**; on a success it's temp-immune for 1 minute | ☐ | |
| S-53 | **Los Lobos** — Resurrección Form | 1 | Weapon splits into **two pistols**: 1d6 P, agile, range 60, reload 0, no ammunition, both wieldable; **Speed +5 ft** | ☐ | |
| S-54 | Los Lobos — **Cero Metralleta** | 1 | 2 actions, **60-ft cone** *or* **120-ft line**, basic Reflex, 2d6 force; H(+1) +1d6 | ✅ | **SB-28 fixed.** Live: the spell offers **60-ft cone / 120-ft line** through `areaTargetingShapes`, which no content had used before |
| S-55 | Los Lobos — Refined | 9 | **Sustain** at the start of your next turn to fire again in a **different direction** with **no** Reiatsu cost | ✅ | **SB-28/SB-29 fixed.** Live: absent at 1st, and at 9th `Cero Metralleta — Sustain` arrives as **1 action, 1/round** |
| S-56 | **Colmillo** — Segunda Etapa | 13 | **Eight wolves** appear within 30 ft; they are **not creatures** — no statistics, no actions, cannot be attacked, do not flank | ☐ | |
| S-57 | Colmillo — the action | 13 | 1 action, requires ≥1 wolf; expend any number; each moves to a point within 60 ft and detonates in a **10-ft burst** for **3d6** force (basic Reflex); **a creature in more than one burst takes only the highest**; H(+1) +1d6 | ⚠️ | `Effect: Colmillo` holds eight wolves as a counter with `min: 0`, which was already right. The spend is not yet declared on the technique |
| S-58 | Colmillo — regrowth | 13 | **+1 wolf at the start of each of your turns**, max eight | ✅ | Live machinery: `chargeRefresh` on `Effect: Colmillo` regains one a turn with no Perfected clause, exactly as guide §7B gives Los Lobos |
| S-59 | **Tiburón** — Resurrección Form | 1 | Weapon becomes 1d12 S, two-handed, sweep; **swim Speed** = Speed; breathe water; create water freely | ☐ | |
| S-60 | Tiburón — **La Gota** | 1 | 2 actions, **30-ft cone**, basic Reflex, 2d6 slashing; failures **pushed 10 ft** away; H(+1) +1d6 | ☐ | |
| S-61 | Tiburón — Refined **Cascada** | 9 | Cone **40 ft**; crit fail → **prone**; area becomes **difficult terrain** until start of your next turn | 🔧 | Refined 40-ft cone added ahead of the Hirviendo line, order pinned by a test (SB-28). Awaiting a live drive |
| S-62 | **Hirviendo** — Segunda Etapa | 13 | **20-ft emanation** of water, difficult terrain for enemies; once per round a spirit-weapon hit **pushes 5 ft**; La Gota may be a **60-ft line** | ☐ | |
| S-63 | Segunda Etapa — **Trident** | 13 | 2 actions, once per round, **three** ranged Strikes at one creature within 60 ft, **MAP does not increase until all three are made** | ☐ | |
| S-64 | Segunda Etapa — **Hirviendo** (free action) | 13 | Once per round: **all water and ice** in the emanation — including other creatures' water/cold terrain — is **destroyed**; each enemy there takes **2d6 fire** | ☐ | |

### 5C — Quincy Spirits

| # | Spirit / rung | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-65 | **Antithesis** — Schrift Form | 1 | Spirit Bow profile granted if absent, die **+1 step**, range increment **100 ft**; gains **Seele Schneider** 1d8 S finesse melee whose Strikes **ignore resistance to slashing** | ✅ | **SB-37 fixed.** Live: the Spirit Bow is granted when absent, at **range increment 100** and a die step up; Seele Schneider bypasses slashing resistance |
| S-66 | Antithesis — Release Technique | 1 | **Reaction**; trigger: you or an ally within 30 ft takes damage from a creature you can see. The **triggering creature takes 2d6 spirit**, and the damaged target gains **resistance = your level** against that damage; H(+2) +1d6 | ☐ | |
| S-67 | Antithesis — Refined **Licht Regen** | 9 | 2 actions, **30-ft cone**, basic Reflex, **6d6** piercing; crit fail → **off-guard** until start of your next turn; base rank 5, H(+1) +1d6 | ✅ | **SB-37**: authored correctly all along and granted by nothing. Live: a 9th-level Antithesis now knows `licht-regen` |
| S-68 | **Quincy: Letzt Stil** — Vollständig | 13 | Die **+2 steps**; Strikes ignore **all** resistance to physical and spirit and treat cover one step less, **stacking with Blut Vene** (the one exception to Blut exclusivity) | 🔧 | Cover one step less added, sharing `Effect: Cover Pierced` with Blut Arterie. Awaiting a live drive |
| S-69 | Letzt Stil — Licht Regen | 13 | Becomes a **60-ft cone**; **once per round free** | 🔧 | `freeCast` once per round added. Awaiting a live drive |
| S-70 | Letzt Stil — **the cost** | 13 | When it ends you lose **Schrift Form, Release Technique, Licht Regen, Vollständig and your entire pool** until **24 hours of rest** | ✅ | **Fixed.** Live: sealed and spent, `release()` refuses and the state stays sealed; delete the effect and it works again. `focus.cap` reads 0 while spent |
| S-71 | **The Heat** — Schrift Form | 1 | Damage type **fire**; **deadly d8**; **fire resistance = half level** | ☐ | |
| S-72 | The Heat — **Burner Finger** | 1 | 2 actions, choose **One–Five**, all for the same single point | ☐ | |
| S-73 | Burner Finger **One** | 1 | 60 ft, one creature, ranged spell attack, **3d6** fire doubled on crit; H(+1) +1d6 | ☐ | |
| S-74 | Burner Finger **Two** | 1 | 60 ft, **two** creatures, **2d6** each; H(+1) +1d6 | ☐ | |
| S-75 | Burner Finger **Three** | 1 | **30-ft line**, basic Reflex, 2d6 fire; H(+1) +1d6 | ☐ | |
| S-76 | Burner Finger **Four** | 1 | **15-ft emanation**, basic Reflex, 2d6 fire; failures take **1d4 persistent fire**; H(+1) +1d6 | 🔧 | 1d4 persistent fire on a failure, declared on the Four overlay alone (SB-41) |
| S-77 | Burner Finger **Five** | 1 | **30-ft cone**, basic Reflex, 2d6 fire; ground **difficult terrain** until start of your next turn; H(+1) +1d6 | 🔧 | Difficult terrain for 1 round, on the Five overlay alone |
| S-78 | The Heat — Refined **Deeper Burn** | 9 | **All five** options treat your rank as **one higher**; **Five**'s terrain keeps burning until end of your next turn, dealing **2d6 fire** to a creature entering or ending its turn there | 🔧 | **SB-40**: `lingering` is now a predicated list, so Five's ground burns for 2d6 a round longer at Refined; Deeper Burn adds a die to Burner Finger only |
| S-79 | **Deus Ex Machina** — Vollständig | 13 | **Fly Speed** = Speed; **fire immunity**; Burner Finger **Five** becomes a **60-ft cone** | ✅ | Live: Deus Ex Machina gives **fire immunity and fly 25**; Burner Finger Five widens to a 60-ft cone via `alternateArea` |
| S-80 | Deus Ex Machina — persistent | 13 | Once per round, a creature you damage with fire takes **2d6 persistent fire** whose flat check is **DC 20**, not 15 | ☐ | |
| S-81 | **The Balance** — Schrift Form | 1 | Weapon becomes **Freund Schild** 1d8 S, versatile P, **parry**; **+1 circumstance AC while you have ≥1 Reiatsu Point** | ☐ | The bonus must switch **off** at 0 points |
| S-82 | The Balance — Release Technique | 1 | **Reaction**; trigger: you take damage from a creature or effect you can perceive. Reduce it by **twice your level**, then one enemy within 60 ft takes **2d6 spirit** and a **−1 status penalty to saves** until end of its next turn; H(+2) +1d6 | ☐ | |
| S-83 | The Balance — Refined | 9 | Penalty applies to **AC and saves**; if the trigger would drop you to 0 HP you stay at **1 HP** — **once per day** | 🔧 | **Fixed**: a second `Effect: The Balance — Held (Refined)` carrying the AC penalty, chosen on the Quincy's side because the effect lands on the enemy |
| S-84 | **The Balance, at Night** — Vollständig | 13 | Reduction rises to **three times your level** | ☐ | |
| S-85 | At Night — ally redirect | 13 | Once per round an ally's damage within 60 ft may be redirected to you and reduced **as a free action without spending your reaction**, even if your reaction is spent | ☐ | |
| S-86 | At Night — **Sight of the Balance** | 13 | At the start of each of your turns choose an enemy within 60 ft: **−2 status** to its next save, and the next ally attacking it gains **+1 status** to that attack | ☐ | |
| S-87 | **The Thunderbolt** — Schrift Form | 1 | Weapon becomes 1d8 S, versatile P, damage type **electricity**; **electricity resistance = half level**; **Flash Step ignores difficult terrain and may pass through creatures** (not end there) | ☐ | |
| S-88 | The Thunderbolt — **Galvano Blast** | 1 | 2 actions, **60-ft line**, basic Reflex, 2d6 electricity; fail **stunned 1**, crit fail **stunned 2**; **incapacitation**; H(+1) +1d6 | ☐ | |
| S-89 | The Thunderbolt — Refined **Galvano Javelin** | 9 | 90 ft, ranged spell attack, **6d6** electricity doubled on crit, **stunned 1 on a hit** (incapacitation); base rank 5, H(+1) +1d6 | ✅ | **SB-37**: complete and unreachable. Live: a 9th-level Thunderbolt now knows `galvano-javelin` |
| S-90 | **Thunderbolt Form** — Vollständig | 13 | **Fly Speed** = Speed; **electricity immunity**; **10-ft emanation** dealing **3d6** electricity (basic Reflex) to a creature ending its turn there | ✅ | Live: Thunderbolt Form gives **electricity immunity and fly 25** |
| S-91 | Thunderbolt Form — arc | 13 | Once per round on a spirit-weapon hit, one other creature within 15 ft of the target takes **3d6** electricity (basic Reflex) | 🔧 | The arc is a `strike-resolved` prompt on a spirit-weapon hit |
| S-92 | **The Miracle** — Schrift Form | 1 | Weapon becomes **1d12 slashing, two-handed, forceful, shove**; **max HP + your level**; **+1 circumstance** to saves vs. effects that would reduce you to 0 HP | 🔧 | +1 circumstance on a toggled save, since no roll option says *this would drop me* |
| S-93 | The Miracle — **The Miracle** | 1 | **Free action**, trigger: you take damage from an enemy, **once per round**. Gain **2 Miracle points** (max 10) | ☐ | |
| S-94 | Miracle points — resistance | 1 | **Resistance to all damage = current Miracle points** | ✅ | Live: resistance to all damage reads **2** with 2 Miracle points — the badge itself |
| S-95 | Miracle points — spend | 1 | Free action at the start of your turn: spend any number; **+1d6** weapon damage per point until end of turn | 🔧 | The spend is a `turn-start` prompt; the +1d6 per point is the player's to apply |
| S-96 | Miracle points — cost and reset | 1 | Costs a Reiatsu Point **only the first time each encounter**; points are **lost when the encounter ends** | ☐ | |
| S-97 | The Miracle — Refined **Blitz of the Hero** | 9 | Max Miracle points **15**; spending grants **+5 ft status** to Speeds per point, **max +20 ft**, until end of turn | ✅ | **Fixed.** Live: the ceiling reads **10 at 1st, 15 at Refined** |
| S-98 | **Bailar de Valquiria** — Vollständig | 13 | **Fast healing = current Miracle points** | ☐ | |
| S-99 | Bailar — the refusal to die | 13 | Reduced to 0 HP with ≥5 Miracle points → stay at **1 HP**, lose 5 points, weapon die **+1 step for the rest of the encounter**; repeatable while points last | ✅ | **SB-39 fixed.** Live: 7 points, a killing blow, and it stands at **1 HP with 2 points left** |
| S-100 | Bailar — uncapped | 13 | Miracle points **no longer capped**, still only **2 per round** | ✅ | **Fixed.** Live: uncapped under Bailar |

---

## 6 — Feats (guide §8)

### 6.1 — First level

| # | Feat | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- |
| F-01 | **Additional Kidō** **[SR]** | One more kidō; **up to three times**; Hollow/Quincy cannot take it | ☐ | |
| F-02 | **Sheathed Draw** | On initiative, manifest **and** Release as a **single free action** | ✅ | **SB-20 fixed.** Joined to the `combatStart` handler that already released Zangetsu: both clauses mean *you are in your released form when the fight begins*, and both spend the free first Release rather than a point |
| F-03 | **Reader of Threads** | Recall Knowledge on spirits/haunts/undead with Spirit Lore as a **free action once per round**; +1 extra fact on a success | ✅ | **SB-20 fixed.** A free action once per round on the sheet, plus a `Note` on the Spirit Lore and Religion check that says you learn one more thing on a success |
| F-04 | **Zanjutsu Footwork** | Crit with the spirit weapon → **Step** as a free action | ✅ | **SB-20 fixed.** A critical hit with the spirit weapon now prompts the free Step. Direction is the player's, so it arrives at the right moment rather than moving them |
| F-05 | **Pesquisa** **[H]** | Spirit Sense to **120 ft**; learn each detected creature's approximate level relative to yours | ☐ | |
| F-06 | **Hirenkyaku Drill** **[Q]** | Flash Step at 1st, **once per encounter** until 3rd | ☐ | |
| F-07 | **Twin Fang** | With twin or agile, the **second Strike each round** reduces MAP by 1 | ☐ | |

### 6.2 — Second and fourth level

| # | Feat | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| F-08 | **Pressure Flare** | 2 | 1 action, enemies within 15 ft: Will vs. Reiatsu DC or **frightened 1**; **once per encounter, no cost** | ☐ | |
| F-09 | **Guard the Threshold** | 2 | Reaction: ally within 15 ft damaged by an **undead, spirit or incorporeal** creature → reduce by **2 + your level** | ☐ | |
| F-10 | **Kidō Focus** | 2 | Spend **1 extra action** on a kidō → target takes **−1 circumstance** to its save | ✅ | **SB-20 fixed.** A **toggleable** roll option, read by `runSave` — the module rolls these saves itself, so this is the only place a −1 circumstance could land. Restricted to kidō |
| F-11 | **Rapid Bala** **[H]** | 2 | Spend 1 extra action to use **Bala** again; both apply and raise MAP normally | ✅ | **SB-20 fixed.** A two-action activity, which is how pf2e writes `Double Shot` — the action cost *is* the mechanism for an action-economy feat |
| F-12 | **Gintō Reserve** **[Q]** | 2 | **3 Gintō** at daily preparations; each is a free action to use **Gritz** for **no** Reiatsu Point; unspent are lost at next preparations | ☐ | |
| F-13 | **Shunpo Strike** | 4 | 2 actions: Flash Step then Strike; **doesn't count against Flash Step's frequency** | ✅ | A two-action activity. "Doesn't count against Flash Step's frequency" is automatic: it is a separate item, so using it never decrements Flash Step's |
| F-14 | **Reiatsu Barrier** | 4 | Reaction when hit: spend 1 point for **resistance = your level** vs. that damage | ☐ | |
| F-15 | **Chain Anchor** | 4 | Crit with the spirit weapon → target **can't Step away** until end of its next turn | ✅ | **SB-20 fixed.** A `strike-resolved` critical-success rider applying `Effect: Chain Anchor` for 1 round |
| F-16 | **Deep Breath** | 4 | First **Steady the Breath** each day restores **2** points | ✅ | **SB-20 fixed.** New **Steady the Breath** action — the class's own name for Refocus. Live: 1 point normally, **2** on the first of the day with the feat, **1** again the same day |
| F-17 | **Cero Doble** **[H]** | 4 | Cero may be a **30-ft cone**; crit fails **pushed 10 ft** away | ✅ | **SB-20 fixed.** A **toggleable** roll option on the sheet — pf2e's own answer to a cast-time choice — read by the `alternateArea` seam. Cero offers a 30-ft cone while it is on, with the 10-ft push on a critical failure, gated the same way |

### 6.3 — Sixth through twelfth

| # | Feat | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| F-18 | **Kidō Combination** | 6 | Free action right after a **destruction** kidō: a **binding** kidō at the same target for **1 fewer point (min 0)**; once per encounter | ✅ | **SB-20 fixed.** The `freeCast` machinery predicated on `soulbound-kido-bakudo`, once per fight — "1 fewer Reiatsu Point (minimum 0)" for a binding kidō is exactly a free cast |
| F-19 | **Reactive Strike** | 6 | pf2e's published `Reactive Strike` reaction, automating as-is | ☐ | |
| F-20 | **Cut the Cord** | 6 | Strikes ignore the **first 5 points** of resistance to spirit | ☐ | |
| F-21 | **Borrowed Nature** | 6 | Permanent second Lineage choice; learn its **free cantrip** at no cost; gain **Don the Other Face** | ✅ | **SB-23 fixed.** It promised the borrowed Lineage's free cantrip and granted nothing; three predicated `GrantItem` rules now hand over Shō, Bala or Heizen |
| F-22 | Don the Other Face | 6 | 1 action, 1 point, **once per encounter**, 1 minute, **−1 status to Will** while on | ✅ | **SB-23 fixed.** `Don the Other Face` was **once per round**; the guide says once per encounter. It applies the Aspect through the action bridge now, chosen by `soulbound-borrowed:<lineage>` |
| F-23 | Aspect — **Soul Reaper's Discipline** | 6 | Learn **one** kidō permanently; while the Face is on **every kidō you know costs nothing** | ✅ | The Aspect makes every kidō free while worn — the `freeCast` machinery again — and Deeper Crossing adds a die to destruction kidō |
| F-24 | Aspect — **Hollow's Mask** | 6 | Temp HP = **level**; physical resistance = **quarter level** (min 1); **+5 ft status** Speeds | ✅ | Temp HP = level, physical resistance = quarter level, +5 ft; all three double under Deeper Crossing |
| F-25 | Aspect — **Quincy's Discipline** | 6 | **Blut** free action once per round, Vene at **quarter** level; ranged Strikes **ignore cover** | ✅ | Grants **Blut**, and `Effect: Blut Vene` now resists at a **quarter** of your level for a borrower, half once Deeper Crossing deepens it, and half for a real Quincy |
| F-26 | **Blut Discipline** **[Q]** | 6 | Switch Blut as a free action **twice** per round | ☐ | |
| F-27 | **Descorrer** **[H]** | 6 | Once per hour, Garganta: you + up to 5 allies teleport up to **500 ft** to a seen or visited place | ✅ | A two-action activity with a **once-per-hour** frequency, which is the whole of what pf2e can enforce about a Garganta |
| F-28 | **Rising Tide** | 8 | The first Rising Pressure grant each round also gives **temp HP = half level (min 2)**, until start of your next turn, not stacking with itself | ✅ | **SB-20 fixed.** Paid out by `Rising Pressure` itself — *"the first time each round that Rising Pressure grants you a point"* is a moment only that function knows, which is why the feat sat unread. Temp HP = half level, minimum 2 |
| F-29 | **Pressure Crush** | 8 | 2 actions, 1 point, **20-ft emanation**, Fortitude; failure → **clumsy 1** and **−5 ft status** Speeds for **1 minute** | ☐ | |
| F-30 | **Zanjutsu: Hakuda** **[SR]** | 8 | **1d6 fist**, agile, finesse, nonlethal; one unarmed Strike may be made as part of **any** Zanjutsu technique | ✅ | **SB-20 fixed.** A real `Strike` rule element. Live: **Hakuda, 1d6 bludgeoning, agile / finesse / nonlethal / unarmed**, with the agile MAP at −4/−8. It was a roll option nothing read |
| F-31 | **Perfected Technique** | 10 | Once per encounter, Release Technique costs **nothing** | ✅ | **SB-20 fixed.** The `freeCast` machinery, as used by the Full Release's Unbound Technique. Live: `FreeCast.find` returns it for a Release Technique, frequency 1 per `PT10M` — pf2e has no *encounter* period, and `PT10M` is its stand-in |
| F-32 | **Ghost Step** | 10 | Flash Step passes through creatures' spaces (not ending there) and **ignores difficult terrain** | ✅ | **SB-20 fixed.** A prompt on Flash Step itself, so the permission arrives at the moment it applies |
| F-33 | **Reishi Mastery** **[Q]** | 10 | Seal the Art counteract rank **+1**; **free on a critical success** | ✅ | **SB-20 fixed.** `resolveCounteract` adds 1 to the counteract rank and charges no point on a critical success — which is why the cost had to move to *after* the roll |
| F-34 | **Soul Sever** | 12 | Reducing a creature to 0 HP with the spirit weapon performs **Konsō** as a free action, no check, permanently preventing undeath | ✅ | **SB-20 fixed.** A prompt when your damage takes something to zero, predicated on `rider:target:hp-zero` |
| F-35 | **Kidō Mastery** | 12 | **Destruction** kidō deal **one additional die** of their damage type | ☐ | |
| F-36 | **Segunda Piel Temprana** **[H]** | 12 | Each time you are **critically hit**, Hierro resists **spirit** for 1 round | ✅ | **SB-20 fixed.** A `strike-received` critical-success rider granting spirit resistance = half level for 1 round |
| F-37 | **Deeper Crossing** | 12 | Don the Other Face **twice per encounter**; Aspect deepens (2nd kidō + 1 extra destruction die · temp HP 2× level, resistance half level, +10 ft · Vene half level + **one Seal the Art per encounter**) | ✅ | **SB-20 fixed.** Raises `Don the Other Face` to twice per encounter by `ItemAlteration`, and the three Aspect effects now scale on `soulbound:deeper-crossing` — Hollow's Mask goes to twice level in temp HP, half-level resistance and +10 feet |

### 6.4 — Zanjutsu techniques **[SR]** (guide §8.4)

| # | Technique | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| F-38 | **Sōkotsu** | 5 | 2 actions, **two** Strikes at one creature, **the second doesn't raise MAP**, each hit +1d6; H(+2) +1d6; base rank 2 | ☐ | |
| F-39 | **Hitotsume: Nadegiri** | 5 | 2 actions, Stride up to Speed then one Strike +1d6; on a hit target **off-guard until end of your turn**; H(+2) +1d6; base rank 2 | ☐ | |
| F-40 | **Shitonegaeshi** | 8 | **1 action**, Strike +1d6; on a hit **Step free** and the target **can't Step** until end of its next turn; H(+2) +1d6; base rank 4 | ☐ | |
| F-41 | **Nadegiri** | 10 | 2 actions, one Strike against **each enemy in reach**, all at current MAP, **MAP doesn't rise until all are made**; base rank 6 | ☐ | |
| F-42 | **Ikkotsu** | 12 | 2 actions, one Strike **+4d6**; crit → **stunned 1** (incapacitation); H(+1) +1d6; base rank 6 | ☐ | |
| F-43 | **Zanjutsu: Kendō** | 14 | 2 actions, **before rolling** choose: ignore all resistances and immunities to its damage type **or** treat AC as 2 lower; hit **+5d6**; H(+1) +1d6; base rank 8 | ☐ | |
| F-44 | Zanjutsu — cost & requirement | 5+ | Each costs **1 point** and requires the spirit weapon **Released** | ☐ | |
| F-45 | Zanjutsu Mastery interaction | 15 | SR-05's die step actually reaches these techniques | ☐ | |

### 6.5 — Fourteenth through twentieth

| # | Feat | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| F-46 | **Instant Full Release** | 14 | Full Release costs **1 action** | ✅ | **SB-17 fixed.** Live: adding the feat takes Full Release from **2 actions to 1**. Its `action-cost` alteration named a property pf2e has no handler for, so the feat's whole text did nothing |
| F-47 | **Twin Pressure** | 14 | The Full Release emanation's Will save also applies to enemies that **enter** it | ✅ | **SB-20 fixed.** Live: with the feat the aura's events become `["enter", "turn-end"]`; without it, `["turn-end"]`. It could not have been written as content — the events list belongs to an effect the feat does not own — so it is stamped on where the aura is built |
| F-48 | **Vollständig Endurance** **[Q]** | 14 | No fatigue when Vollständig ends; spend 1 point to extend by 1 round, **up to three times** | ✅ | **SB-20 fixed.** Declares `soulbound:no-full-release-fatigue`, which the `deleteItem` fatigue path reads alongside Perfected Full Release |
| F-49 | **Unbroken Chain** | 16 | While released, spend 1 point to stay at **1 HP** instead of 0; **once per day** | ✅ | **SB-20 fixed.** Live: dropping to 0 HP while released left the character at **1 HP**, spent a point (2→1) and used the day's charge; a second drop the same day went through to 0. `preUpdateActor` is the only place it can live — by `updateActor` the hit points are already zero and dying is already being applied |
| F-50 | **Reiatsu Flood** | 16 | Rising Pressure's **per-encounter cap +1** | ✅ | Always worked: `capFor()` in `rising-pressure.mjs` reads the feat **by slug**, which is why it was the one apparently-inert feat that was not |
| F-51 | **Beyond the Blade** | 18 | Release Technique dice **+2 steps** (d6→d10, d8→d12) | ☐ | |
| F-52 | **Second Nature** | 18 | The **6th-level** Aspect is always on — no action, no point, no duration, **no Will penalty**; Donning still upgrades to the 12th-level numbers twice per encounter | ✅ | **SB-20 fixed.** Three `GrantItem` rules predicated on the Lineage chosen by Borrowed Nature, so the Aspect is simply worn — and the −1 Will penalty on all three Aspects is predicated `{not: soulbound:second-nature}`, which is the guide's *"and no Will penalty"* |
| F-53 | **Final Release** | 20 | 3 actions, **once per week**, requires released form | ☐ | See §7 |

---

## 7 — Final Release and Severance (guide §9)

| # | Item | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- |
| R-01 | **Severance** — duration | **10 rounds**, identical for all fifteen Spirits | ✅ | Live: `Effect: Severance` runs 10 rounds and the eleventh ends it |
| R-02 | Severance — rider | Spirit-weapon Strikes deal an extra **4d6 spirit** | ✅ | Live: the 4d6 spirit rider is on spirit-weapon Strikes |
| R-03 | Severance — immunities | Immune to **fear and death effects**, and to **frightened** and **doomed** | ✅ | Live: immune to death-effects, fear-effects, frightened and doomed |
| R-04 | Severance — free everything | **No pool**; Release Technique and every kidō cost **nothing** with **no frequency limit** | 🔧 | **SB-45 fixed**: `freeCast` gained an `unlimited` allowance — it had refused any item with no frequency to decrement, which is every effect. Frequency caps overridden too |
| R-05 | Severance — borrowed Full Release | Grants the Spirit's Full Release ability **and its 20-ft emanation**, without spending the daily use and **without fatigue** | 🔧 | **SB-45 fixed**: `soulbound:no-full-release-fatigue` is published at last; the module already read it |
| R-06 | Severance — movement | Speed **+20 ft**; Flash Step **twice per round** | ✅ | Live: Speed **45** at 25 base, and Flash Step frequency **2** |
| R-07 | **Waning** | Severing Art dice = **22 − 2 × round**, rounds 1–7 (20/18/16/14/12/10/8 d6) | ✅ | **SB-42 fixed.** Live, round by round: **20/18/16/14/12/10/8**. The table was pure, exported, unit-tested and called by nothing; every Art was authored at a flat 20d6 |
| R-08 | Waning — lockout | The Art **cannot be used** in rounds **8, 9, 10** | ✅ | **SB-43 fixed.** Live: rounds 8, 9 and 10 give **0**, and the cast is refused rather than rolled |
| R-09 | The Art ends Severance | Using it is 2 actions, costs nothing, and **ends Severance whether you want it to or not** | ✅ | **SB-43 fixed.** Live: casting Mugetsu ends Severance — after the cast reaches the table, never before |
| R-10 | **The price** | When Severance ends by either route you lose **Released Form, Release Technique, Full Release and your whole pool** until **a week of downtime**; you keep HP, proficiencies, skills, Lineage features and feats | ✅ | **SB-45 fixed.** Live: the release state goes to **sealed**, the cap to **0**, the Art off the sheet, and a fresh Release is refused |
| R-11 | **Shūkei: Hakuteiken** (Senbonzakura) | One creature in reach, Strike, Waning dice as **slashing**; ignores **all** resistance and immunity; on a hit target **can't regain HP** and regen/fast healing suppressed **1 minute** | 🔧 | Shape, Strike and the ignore-all bypass were right; **SB-46** adds the wound that will not close |
| R-12 | **Mugetsu** (Zangetsu) | **60-ft cone**, basic Reflex, **spirit**; ignores **all** resistance and immunity to spirit | ✅ | 60-ft cone, basic Reflex, spirit, and a `bypass` ignoring all resistance and immunity to spirit |
| R-13 | **Hyōten Hyakkasō** (Hyōrinmaru) | **30-ft emanation**, basic Fortitude, **cold**; failures **restrained** (Escape vs. Reiatsu DC) and **4d6 persistent cold with no flat check** while restrained | 🔧 | Restrained at an Escape vs. Reiatsu DC and 4d6 persistent cold were right; the flat check is now one no d20 reaches |
| R-14 | **Ittō Kasō** (Ryūjin Jakka) | **20-ft burst** within 60 ft, basic Reflex, **fire**, Waning dice **+2d6**; ignores fire resistance **and immunity**; failures **can't regain HP 1 minute**, regen/fast healing suppressed; a creature dropped to 0 is **cremated** (10th-rank effect to return) | 🔧 | **SB-46**: +2d6, the fire bypass and the wound that will not close |
| R-15 | Ittō Kasō — **self-cost** | You take damage equal to **half your current HP**, **unpreventable, unreducible, unresistable, unredirectable**, applied **after** the Art resolves | ✅ | **SB-47 fixed.** Live: a 20th-level Ryūjin Jakka at **200 → 100**. Needed a new `fractionOfCurrentHp` damage form applied with `skipIWR`, and `event: action-used` so it is paid once rather than per victim |
| R-16 | **Kanzen Saimin: Owari** (Kyōka Suigetsu) | **60-ft emanation**, basic Will, **mental**; failures **confused 1 minute**; crit fail also perceives **its own allies as you** for that minute and **damage cannot shake it loose** | ⚠️ | Confused 1 minute is applied; the critical-failure clause — perceiving its own allies as you — is prose |
| R-17 | **Desgarrón** (Pantera) | **60-ft cone**, basic Reflex, **slashing**; failures **4d6 persistent bleed** | ✅ | 60-ft cone, basic Reflex, slashing, 4d6 persistent bleed on a failure |
| R-18 | **Cero Oscuras: Ceniza** (Murciélago) | **120-ft line**, basic Reflex, **spirit**; a creature dropped to 0 **crumbles to ash** (10th-rank effect to return) | ⚠️ | 120-ft line, basic Reflex, spirit — all correct; *crumbles to ash* is left to the table |
| R-19 | **La Hora Final** (Arrogante) | **30-ft emanation**, basic Fortitude, **void**; failures **enfeebled 3** 1 minute and **drained 1** for 24 hours | ✅ | Enfeebled 3 for a minute and drained 1 for 24 hours, exactly |
| R-20 | **Aullido** (Los Lobos) | **40-ft burst** within 120 ft, basic Reflex, **force**; requires ≥1 wolf; expends **all** wolves and **none regrow this encounter**; with **five or more** spent, crit fails also **prone + stunned 1** | ⚠️ | 40-ft burst and the prone-and-stunned clause exist; the wolf requirement, the expenditure and the five-or-more gate are not automated |
| R-21 | **Ola Azul** (Tiburón) | **60-ft line**, basic Reflex, **slashing**; failures pushed **30 ft** and **prone**; crit fails pushed **60 ft** | ✅ | Pushed 30 on a failure, 60 on a critical failure, prone on both |
| R-22 | **Sprenger** (Antithesis) | **20-ft burst** within 60 ft, basic Reflex, **force**; crit fails **restrained 1 minute** (Escape vs. Reiatsu DC) | ✅ | 20-ft burst, basic Reflex, force; restrained a minute on a critical failure |
| R-23 | **Burning Full Fingers** (The Heat) | **60-ft cone**, basic Reflex, **fire**; failures **4d6 persistent fire** with a **DC 20** flat check | ✅ | 60-ft cone, 4d6 persistent fire at a **DC 20** flat check |
| R-24 | **The Reckoning** (The Balance) | One creature within 60 ft, basic Fortitude, **spirit**; ignores **all** resistance and immunity; target **doomed 1**, or **doomed 2** if you used your Release Technique **≥3 times this encounter** | ⚠️ | Doomed 1 is applied; the escalation to 2 needs an encounter-scoped count of Release Technique uses that nothing keeps |
| R-25 | **Electrocution** (The Thunderbolt) | **30-ft emanation**, basic Reflex, **electricity**; failures **stunned 2** (**incapacitation**) | ✅ | 30-ft emanation, stunned 2, and the `incapacitation` trait actually present |
| R-26 | **Apotheosis** (The Miracle) | **30-ft emanation**, basic Fortitude, **force**; you gain temp HP = **twice your level**; **at the start of your next turn it detonates again for half the Waning dice** | 🔧 | **Fixed**: temp HP = twice your level via `TempHP`, and a `turn-start` re-detonation for half, reading `origin.severance.dice` so it is worth what the round it lands in says |

---

## 8 — Cross-cutting invariants

| # | Invariant | Status | Notes |
| :-- | :-- | :-- | :-- |
| X-01 | No technique or kidō anywhere costs more than **1 Reiatsu Point** | ☐ | |
| X-02 | Release is **not a stance** and does not conflict with stance actions | ☐ | |
| X-03 | Every area/save effect targets correctly and posts per-target rows | ☐ | Needs `pf2e-toolbelt` Target Helper |
| X-04 | Every "at 9th level" widening is granted by **Refined Release**, not by a heightening line | ✅ | **SB-7 fixed.** One `sb-refined-area-<n>` tag per technique whose Refined benefit changes its area; no tag means no change, which the blanket `+5` could not express |
| X-05 | Two-Lineage stacking (Borrowed Nature) never grants a borrowed **Release**, Release Technique, Full Release or Severing Art | ☐ | |
| X-06 | Image paths on every Soulbound document resolve | ☐ | 37 broken paths were left outstanding on the Saint side |
| X-07 | `npm test` green: validate + riders + soulbound + build + round-trip | ☐ | |

---

## 9 — Running the rig

```js
// In the world `pf`, as GM:
const api = game.modules.get("isaacs-hb-pf2e").api;
await api.rig.run({ lineage: "Soul Reaper", spirit: "Senbonzakura", profile: "Spirit Weapon (Blade)" });
```

`scripts/soulbound/rig.mjs` builds a character, levels it through **1 / 5 / 9 / 11 / 13 / 17 / 20**
and asserts the chassis, the Lineage and the Spirit's presence at each checkpoint. It is the floor,
not the ceiling: it proves items **arrive**, and almost nothing about whether they **fire**. Every row
above marked ✅ on rig evidence alone is really ⚠️.

The repeatable setup is `Docs/tools/foundry-live-session.md` and `build/live-session.mjs`.

---

## 10 — Findings log

*14 September 2026, world `pf`, module v99.0.0 served from the working tree.*

| ID | Rows | Severity | Observed |
| :-- | :-- | :-- | :-- |
| **SB-6** | C-31 … C-39, S-01, S-04, every Spirit's Form and Full Release | **blocker** | **The release ladder is inert** |
| **SB-7** | X-04, C-32, S-03 and five Spirits | major | `Refined Release` adds +5 ft of area to *every* Release Technique |
| **SB-2** | SR-03 | major | The kidō choice has no duplicate guard |
| **SB-3** | SR-02, SR-03 | major | The kidō choice has no level gate |
| **SB-4** | SR-04 | major | The Zanjutsu free-technique choice has no level gate |
| ~~SB-10~~ | C-07 | **withdrawn** | Simple and unarmed advancing with martial is what §2's own convention prices |
| **SB-8** | K-18 | minor | Kidō and Techniques post as **Arcane** |
| **SB-9** | S-02 | cosmetic | A Refined technique's card still quotes its pre-Refined area |
| **SB-1** | C-19 | not reproduced | The reported Reiatsu cap of 2 |

### SB-6 — the release ladder is never entered *(blocker)*

The class's spine, and the thing all fifteen Spirits hang off.

**The effects themselves are authored, and well.** `Effect: Full Release` carries the whole fear
emanation as a rider — 15-foot emanation, `turn-end`, Will save at the Reiatsu DC, frightened 1,
frightened 2 on a critical failure, and `Effect: Steeled Against Pressure` on a success for the
10-minute immunity. `Effect: Senbonzakura Kageyoshi` carries the Bankai's 5d6 `turn-start` emanation.
`Effect: Greater Flash Step` carries the DC 5 flat check. None of that is missing.

**What is missing is the gate.**

- **`Release`** (`content/soulbound-class-features/actions/release.json`) had `rules: []` and no module
  flags. It was a chat card and nothing else.
- **`Release.enter()`** in `scripts/soulbound/release.mjs` was called from **nowhere**. The only hook
  registered for the ladder was `deleteCombat`, which calls `exit`. The state was never entered, only
  left. `Blut.set()`, and every function in `modes.mjs`, `charges.mjs` and `hypnosis.mjs`, had the same
  problem: written, unit-tested, exported on the module API, and never called.
- So each Spirit's Released Form was granted **permanently, at 1st level, with unlimited duration**
  instead. `Senbonzakura — Shikai` had one rule, `GrantItem → Effect: Senbonzakura — Shikai`, and that
  effect's `ItemAlteration` adds `reach-15` with no predicate at all. **A sealed 1st-level
  Senbonzakura had 15-foot reach.**
- The same pattern granted `Effect: Full Release` and `Effect: Senbonzakura Kageyoshi` unconditionally
  at 13th. This is worse than doing nothing: `turn-start` and `turn-end` riders fire from
  `pf2e.startTurn` / `pf2e.endTurn` for any item on the actor, so **a 13th-level Soulbound was dealing
  the Bankai's 5d6 emanation at the start of every turn and projecting the fear aura at the end of
  every enemy turn — permanently, for free, with no Full Release ever declared.**
- A `grep` across `content/soulbound-*` finds **no predicate anywhere** referencing a release state.

Genuinely unwritten, beyond the gate: Full Release's **damage-die step**, its **"the Release Technique
costs nothing, once per round"** clause, and the **fatigue** when it ends.

**Why the rig missed it.** `rig.mjs` asserts that items *arrive* — `hasFeature(actor, "Full Release")`,
`full.system.frequency.max === 1`. Arriving is exactly what these do. The rig never performs an action.

**Fix, decided 14 Sep 2026: wire it properly.** In progress — see §12.

### SB-7 — Refined Release widens the wrong things

`Refined Release` is a single blanket alteration:

```json
{ "key": "ItemAlteration", "itemType": "spell", "mode": "add",
  "predicate": ["item:tag:sb-tier-release"], "property": "area-size", "value": 5 }
```

Guide v1.4 §9 is right that a 9th-level widening is not a rank step and belongs on Refined Release.
But the widening is not the same for every Spirit, and for three of them the Refined benefit is not a
widening at all:

| Release Technique | Authored | Guide's Refined (9th) | +5 gives | |
| :-- | :-- | :-- | :-- | :-- |
| Senbonzakura | emanation 15 | **20 ft** | 20 | ✅ |
| Ennetsu Jigoku | emanation 15 | **20 ft** | 20 | ✅ |
| Respira | emanation 15 | **20 ft** | 20 | ✅ |
| Getsuga Tenshō | line 30 | **60 ft** | 35 | ❌ |
| La Gota | cone 30 | **40 ft** (Cascada) | 35 | ❌ |
| Garra de la Pantera | cone 30 | *claws to 1d10 + a free Step* | 35 | ❌ gains area it should not have |
| Cero Metralleta | cone 60 | *Sustain to re-fire* | 65 | ❌ gains area it should not have |
| Galvano Blast | line 60 | *adds Galvano Javelin* | 65 | ❌ gains area it should not have |

### SB-2 / SB-3 / SB-4 — the choice prompts are unbounded

Driven live on fresh Soul Reapers:

- **SB-3.** At **level 1**, "Choose a kidō" offers all eleven Soul Reaper kidō, including
  **Rikujōkōrō** (guide: 7th), **Sōren Sōkatsui** and **Kin** (9th) and **Kurohitsugi — Black Coffin**
  (15th). `Kidō Learned (Nth)`'s filter is only `sb-tier-kido` + not-cantrip + not-Hollow +
  not-Quincy.
- **SB-2.** Nothing stops two slots picking the same kidō. A test character answered every prompt with
  **Sai — Restrain** and finished 5th level knowing **Sai ×3**. An earlier run produced a 20th-level
  Soul Reaper holding **Kurohitsugi twice** — five distinct kidō where guide §5.1 promises six.
- **SB-4.** At **level 5**, "Which sword art did you drill first?" offers all six Zanjutsu techniques.
  A test character took **Zanjutsu: Kendō**, a 14th-level technique, as its free 5th-level pick.

### ~~SB-10~~ — simple and unarmed proficiency *(withdrawn)*

I raised this as a 320-point overrun and I was wrong. §2's costing note says it outright:

> *Weapon and armour groups follow the sheet's convention — the **highest** group pays the
> Expert/Master steps, every additional group costs a flat 10.*

`Attack — Martial T@1 / E@5 / M@13 = 170` is the paying line; `Attack — Simple = 10` and
`Attack — Unarmed = 10` are the two additional groups at the flat rate, and under BCS's convention
they advance alongside the one that paid. §3.1's "Trained in simple weapons, martial weapons, unarmed
attacks" lists *initial* proficiencies, and §3.2's "weapon expertise (martial expert)" names the
highest group, not the only one that moves. The module is right and the ledger balances at 2100 as
written. Nothing to change.

### SB-8 / SB-9 — presentation

- The Reiatsu spellcasting entry is created with `tradition: { value: "" }`, and pf2e renders an empty
  tradition as **Arcane** on the chat card. Guide §6 opens with "Kidō are **not spells**". Beyond
  flavour it is reachable: anything keyed on the arcane tradition will now find a kidō.
- A Refined technique's card still prints its unrefined prose — "Each creature in a **15-foot**
  emanation" sitting above an `Area 20-foot emanation` line.

### What did hold up

- The whole chassis ladder: HP, Perception, all three saves, Reiatsu DC (expert at 9, master at 17,
  never legendary), martial weapons, light and unarmoured defence, medium never — exact at every level
  from 1 to 20.
- The reiatsu pool: **1 / 2 at 5th / 3 at 11th**, including for a Quincy who knows only two costed
  focus effects, which is the case the override exists for.
- **Senbonzakura**, cast live at 20th level: 20-foot emanation, basic Reflex **DC 37**, **11d6
  slashing** — the guide's rank-10 target exactly — one Reiatsu Point spent, and three enemies picked
  out of the area automatically with allies and neutrals excluded by name. The Technique layer works.
- The rig's own 42 assertions, all passing.

---

## 11 — SB-1: the reported pool cap

**What the guide says.** §4.2 and v1.4 change #5: the pool is **1 / 2 at 5th / 3 at 11th**, *set by
level, regardless of how many kidō are known*.

**What pf2e does.** `SpellPF2e#prepareActorData` adds **+1 per non-cantrip `focus`-trait spell**, and
`CreaturePF2e#prepareDerivedData` clamps that to `system.resources.focus.cap`. A Quincy who knows
**Gritz** and one Release Technique therefore derives a maximum of exactly **2**, forever — which is
precisely the reported symptom, and precisely the case v1.4 #5 was written to forbid.

**What the module does about it.** `scripts/soulbound/reiatsu.mjs` `install()` wraps
`prepareDerivedData` and sets `focus.max = focus.cap`, plus a one-shot sweep at `ready`, because actors
are prepared before the `setup` hook the wrap installs from.

**Driven live, 14 Sep 2026.** A fresh Quincy / The Miracle, built and levelled 1→20:

| Level | 1 | 2 | 3 | 4 | 5 | 6 | 9 | 10 | 11 | 12 | 13 | 17 | 20 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `focus.max` | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 2 | **3** | 3 | 3 | 3 | 3 |
| `focus.cap` | 1 | 1 | 1 | 1 | 2 | 2 | 2 | 2 | **3** | 3 | 3 | 3 | 3 |

The world's own `quincy` (level 20, The Miracle) reads `max 3, cap 3` both before and after a reload.
**The cap is not reproducing on the current build.** Two possibilities remain:

1. The character was **level 5–10**, where a maximum of 2 is the guide's own number.
2. It was seen on an earlier build, before the `prepareDerivedData` override landed. The world's
   `quincy` still carries `flags.isaacs-hb-pf2e.risingPressure = { round: 2, gained: 2 }` — a ledger
   that stopped after **two** grants, which is exactly what Rising Pressure does when `focus.max` is 2.

**Open question for the author: what level was that Quincy?** That single fact closes this.

**Recurrence guard, regardless:** the rig asserts `focus.cap` and never `focus.max`, which is why a bug
in exactly this place could ship. C-19 stays ⚠️ until the rig asserts `max` as well.

---

## 12 — SB-6, in progress

**Decided 14 Sep 2026: wire it properly.**

### Done and verified live

- **`scripts/soulbound/actions.mjs`** — the missing bridge. One `createChatMessage` listener, guarded by
  the riders pipeline's own `isAbilityUse`, routing a used item to a handler **by slug**. `Release` and
  `Full Release` are wired; `Blut`, the mode switches and the charge spends are the same shape and are
  next.
- **`Release.release()` / `Release.fullRelease()`** — the two actions, with the requirements the sheet
  cannot express: sealed-or-not, the free-first-per-encounter ledger, the 1-point cost afterwards, and
  a refusal when the pool cannot pay.
- **`formEffectsFor()`** — content declares what it wears, code never learns fifteen names:

  ```json
  "flags": { "isaacs-hb-pf2e": { "releaseForm": {
      "rung": "released", "effect": "Effect: Senbonzakura — Shikai" } } }
  ```

  All **thirty** Spirit form features converted (15 at 1st, 15 at 13th); each lost its unconditional
  `GrantItem` and gained the flag. Their other grants — a Bankai's extra Techniques, Zangetsu's
  `never-sealed` roll option — are untouched.
- **`applyFullReleaseShape()`** — `fullReleaseShape(level)` is now stamped onto the effect as it is
  created, so 17th level gets 2 minutes and a 20-foot emanation from the one pure function the rig
  already asserts against. The emanation lives in rider flags, where an `ItemAlteration` cannot reach.
- **`Effect: Full Release`** gained the **damage-die step** it never had, predicated on
  `not soulbound:full-release:no-die-step`, which **`Effect: Tensa Zangetsu`** now sets — guide §7A's
  "your damage die does **not** increase".
- **Fatigue on end**, via `deleteItem`, suppressed by `Perfected Full Release` read off the sheet.
- **Zangetsu is never sealed** — `combatStart` releases any actor carrying
  `soulbound:release:never-sealed`, spending the free first Release rather than a point.

The live trace, on a fresh 13th-level Senbonzakura:

| | state | spirit weapon | effects |
| :-- | :-- | :-- | :-- |
| sealed | `sealed` | 1d8, two-hand-d10 — **no reach-15** | — |
| after **Release** | `released` | **reach-15** | Released, Senbonzakura — Shikai |
| after **Full Release** | `full` | **1d10**, two-hand-**d12** | + Full Release, Senbonzakura Kageyoshi |
| when it ends | `released` | back to 1d8 | **fatigued** |

At 17th: 2 minutes, 20-foot emanation, **no fatigue**. Re-sealing and Releasing again costs 1 point
(3→2); a third Release on an empty pool is refused and the character stays sealed.

### Still open under SB-6

| | |
| :-- | :-- |
| C-35 | "Your Release Technique costs no Reiatsu Points, but only once per round" is still unwritten |
| — | Release Techniques are not yet **gated** on being released (guide §4.7 says they need it) |
| — | `Blut.set()`, `Modes`, `Charges` and `Hypnosis` still have no caller — same bridge, more handlers |
| C-36 | The fear emanation is applied at the right time now, but its save has not been driven live |

---

## 13 — SB-11 and SB-12, found while fixing SB-6

Both are the same shape as SB-6 and neither was in the original sweep.

### SB-11 — Greater Flash Step was worn, not earned

`Greater Flash Step` (11th, passive) had one rule: `GrantItem → Effect: Greater Flash Step`. The effect
is authored correctly — a `strike-received` rider that offers the DC 5 flat check — but the guide gives
it *"until the start of your next turn"* **after you Flash Step**, and it was simply always on. Every
Soulbound in the world was carrying one.

`Flash Step` now applies it, as an `action-used` rider predicated on `feature:greater-flash-step`, so
the 11th-level feature turns it on rather than wearing it. Live: no afterimage at 3rd, one at 13th
lasting one round to turn-start.

### SB-12 — six Refined riders predicated on an option that does not exist

`Senbonzakura`, `Ennetsu Jigoku`, `Getsuga Tenshō`, `La Gota`, `Cero Oscuras` and `Shikake` all gate
their Refined benefit on **`self:feature:refined-release`**. pf2e emits `feature:<slug>` for a feature
and uses `self:` only for effects and a handful of actor facts; there is no `self:feature:` anywhere in
the system. Read against a real 13th-level Soul Reaper:

```
feature:refined-release            ← exists
self:feature:refined-release       ← does not, and never did
```

So every one of those Refined benefits was inert. **A test was pinning it in place** — `test-soulbound`
asserted the broken spelling as the expected value, which is why 382 green checks said nothing about
it. The guard in `test-riders` that fails the build on `item:time:` now fails on `self:feature:` too,
and was proved to fail by planting one.

### The migration nobody would have run

Fixing a pack does not fix a character. **An owned item is a copy taken when it was granted**, so every
Soulbound already in the world kept the old rider flags, the old predicates, and the Released Forms
that used to be granted outright.

`api.release.repairAll()` brings them into line:

1. **Re-reads every authored module flag from the packs** onto owned items, matched by
   `_stats.compendiumSource` and falling back to name. Only the module's own flag subtree is replaced —
   never `system.rules`, because that wipes the `flag` pf2e writes onto a `GrantItem` at grant time and
   produces *"already has item"* on every actor update for ever.
2. **Teaches each form feature what it wears**, so a legacy character that is stripped of its
   permanently-worn form can still Release into it.
3. **Takes off anything not actually Released into**, respecting the character's current state — a
   character standing in a Full Release keeps everything.

Run live on world `pf`: `quincy` and `arrancar` each lost a permanently-worn Schrift/Resurrección, a
Vollständig/Segunda Etapa, an `Effect: Full Release` and an afterimage, and kept everything else.

---

## 14 — SB-13, SB-14, SB-15: the auras

Three findings from driving Senbonzakura's Bankai through a real combat round. The third is the one
that mattered.

### SB-15 — six auras never left the caster *(blocker)*

`targetsFor` in `scripts/riders/apply.mjs` checked `rider.self` **before** `rider.area`:

```js
if (rider.self) return context.originToken ? [context.originToken] : [];
if (!rider.area) return context.target ? [context.target] : [];
```

A `turn-start` / `turn-end` / `aura-tick` rider is dispatched once with the origin's own token as the
target, and the area is what fans it out from there. Every Soulbound aura also says `self: true` —
which reads perfectly, *this aura is mine* — so the short-circuit returned the caster and the area was
never built at all. Driven live, a 13th-level Senbonzakura **rolled its own Reflex save against its own
DC and took its own 5d6**, while the ghoul standing five feet away took nothing.

All six of the class's auras were dead this way, and each is the point of its tier:

| | |
| :-- | :-- |
| `Effect: Senbonzakura Kageyoshi` | the Bankai's 20-ft turn-start emanation |
| `Effect: Full Release` | the 15-ft fear emanation, every Spirit's 13th level |
| `Effect: Zanka no Tachi` | Yamamoto's ambient 30-ft burn |
| `Effect: Minami` | the ash that grabs |
| `Effect: Respira Absoluta` | Baraggan's permanent aging aura |
| `Effect: Thunderbolt Form` | Candice's live current |

A second, quieter half: the fan-out read `rider.area.affects` and `rider.area.includesSelf`, but all six
write those in a sibling **`areaTargeting`** object — the spelling an item uses for cast-time targeting,
and so the one an author reaches for. Even without the short-circuit, every `affects: "enemies"` in the
class was decoration. Both spellings are read now, the sibling winning as the more specific.

The three Saint auras (the Pisces skies, Scorpio's Zenith) were authored the other way and always
worked, which is why nothing ever looked wrong.

**After the fix**, same combat, same round: four enemies each roll a basic Reflex at DC 27 for the
Bankai and a Will save at DC 27 for the fear aura, frightened lands, later saves in the round show
*Frightened 1 −1* and *Frightened 2 −2* applying — and the caster's hit points do not move.

### SB-13 — the Bankai's emanation had no save

Guide §7A: *"each enemy in either emanation takes 5d6 slashing damage (basic Reflex)"*. The rider was a
bare `damage` apply. Full damage, no roll, every turn.

### SB-14 — no self-rolled basic save doubled on a critical failure

A basic save is four degrees: nothing, half, full, **double**. pf2e applies that ladder for a *spell's*
own save; a rider that rolls its own save has to carry it, and every one in the content carried it by
hand. Not one doubled. Written out three times per ability, the missing fourth line is invisible.

`basic: true` on a save rider now expands each nested damage rider that does not name its own outcomes
into the ladder:

```json
{ "apply": { "type": "save", "statistic": "reflex", "dc": "reiatsu", "basic": true,
             "riders": [{ "apply": { "type": "damage", "formula": "5d6", "perStep": "1d6",
                                     "damageType": "slashing" } }] } }
```

A damage rider that *does* name outcomes is left alone — an ability off the basic ladder is a real
thing and says so — and conditions are never scaled. The validator rejects `basic: true` when every
damage rider already names its outcomes, which is what a hand-written ladder with the flag bolted on
looks like.

### Still open on Senbonzakura

The **second emanation** — placed within 60 feet, moved up to 30 feet by the Sustain, reshaped by Gokei
into a 10-foot burst at double damage — does not exist. It needs a persistent placed region that ticks
at the *caster's* turn start; `targeting/lingering.mjs` has regions and `tokenMoveIn`/`tokenTurnEnd`
events, but not that trigger. Senkei's cage, resistance bypass and extra Strike are prose on the card.

---

## 15 — SB-16 and SB-17: two names that matched nothing

Both found by driving Tensa Zangetsu, and both invisible from either side on its own.

### SB-16 — `sluggify` drops accents, it does not transliterate them

`build/lib/pack.mjs` reduces anything outside `[a-z0-9]` to a separator, so **"Getsuga Tenshō" is built
as `getsuga-tensh`** — the macron vanishes rather than becoming an `o`. `Effect: Tensa Zangetsu`
predicated two alterations on `item:slug:getsuga-tensho`, which reads perfectly next to the name and
matches nothing. The two things that make Tensa the speed Bankai — the one-action Getsuga and its
60-foot line — were both dead.

`validateSlugPredicates` now holds every `item:slug:` in the content against the slugs the build
actually writes, with an explicit allow-list for the ones pf2e owns (`grapple`, which `Effect: Nishi`
correctly names). Proved by restoring the old spelling and watching the build fail.

### SB-17 — there is no `ItemAlteration` for an action cost

pf2e's handler map is closed: `ac-bonus`, `area-size`, `damage-dice-faces`, `frequency-max`,
`range-increment` and twenty-odd more. Nothing for `time` or `actions`. An unknown property is rejected
at schema validation, which from the content's side is silent — the rule is dropped and the item keeps
its printed cost. **Two abilities were written as though the handler existed, and each is the whole
text of its ability:**

| | |
| :-- | :-- |
| `Effect: Tensa Zangetsu` | `{"property": "time", "value": "1"}` — *"Getsuga Tenshō becomes 1 action"* |
| `Instant Full Release` (feat 14) | `{"property": "action-cost", "value": 1}` — *"Full Release takes 1 action instead of 2"* |

`scripts/soulbound/action-cost.mjs` supplies the one capability pf2e lacks, declaratively:

```json
"flags": { "isaacs-hb-pf2e": { "actionCost": [{ "slug": "getsuga-tensh", "value": 1 }] } }
```

It runs inside the existing `prepareDerivedData` wrap — `wrap()` refuses two wrappers on one target by
design, which is why it lives beside the pool correction — writes both `system.time.value` (spells) and
`system.actions.value` (feats and actions), and never *raises* a cost. `validateAlterationProperties`
rejects any `ItemAlteration` property pf2e does not have, and points at the flag. Also proved by
planting one.

### And a fourth test that was pinning a bug

`test-soulbound` asserted `rules.some((r) => r.property === "time" && r.value === "1")` — the presence
of the inert rule, called compression. That is now four checks found asserting the broken thing:
`self:feature:refined-release`, the Bankai's damage at a path that survived the missing save,
`item:slug:getsuga-tensho`, and this one. **A test written from the content rather than from the table
locks in whatever the content happened to say.**

### The Getsuga line, settled deterministically

`add 30` raced Refined Release's `override 60` and lost — the override ran last, so the line never
passed 60. It is two predicated overrides now: 60 without `feature:refined-release`, 90 with it. Live
at 13th in Tensa: **90 feet, one action**.

---

## 16 — SB-18: the charge pool, and the badge that deleted the Bankai

`charges.mjs` — the third machine written, unit-tested, exported on the API and never called. The
counter badges were authored and simply never moved, so **all three petal Techniques were usable every
round, for ever**: three times the damage the Bankai is costed for, with nothing on the sheet to show
it.

### Two entry points, because there are two ways an ability reaches the table

A Technique that is **cast** is refused before it resolves — `Charges.beforeCast`, in the cast pipeline
beside the release gate, so an empty pool stops the cast rather than letting it through uncharged. A
Technique that is a **reaction** never passes through `cast` at all — Zanhyō Ningyō is triggered by
damage landing on you — so its spend is a new `charge` rider on the prompt being accepted.

Both read the same `Charges.spend`. The pool, the rate and the schedule are all declared in content:

```json
"chargeSpend":   { "effect": "Effect: Daiguren Hyōrinmaru", "spend": 1, "perRound": 1 }
"chargeRefresh": { "regain": 1, "requires": "feature:perfected-full-release" }
```

which is what lets Los Lobos regain a wolf every turn from 13th with no Perfected clause at all — the
same machine, a different schedule, said in content rather than in code.

### SB-18 — a labelled counter cannot reach zero, and deletes its effect trying

`Effect: Daiguren Hyōrinmaru` declared `min: 0` for its three petal-flowers and carried
`labels: ["1","2","3"]` beside it. pf2e's `EffectPF2e#_preUpdate`:

```ts
if (changed.system.badge.labels) { changed.system.badge.min = null; changed.system.badge.max = null; }
const minValue = badgeWithoutOperators.min ?? 1;
if (this.actor && currentValue < minValue) { await this.actor.deleteEmbeddedDocuments("Item", [this.id]); }
```

Labels null the minimum, the minimum then defaults to **1**, and going below it **deletes the effect**.
So spending the third petal did not empty the pool — it deleted the Bankai, taking the fly Speed, the
cold resistance and the host of all three petal Techniques with it. Reproduced live: the effect was
simply gone, and the next read threw.

`validateCounterBadges` now rejects `min: 0` beside `labels` as the contradiction it is. It found a
second one the moment it was written — **`Effect: Rising Cosmo`** on the Saint side, harmless only
because nothing ever decrements it; its minimum is 1, since +1/+2/+3 has no zeroth state.

### Driven live, end to end

| | |
| :-- | :-- |
| fresh Bankai | 3 petals, `min: 0` |
| spend ×3 | 2 → 1 → **0**, and the Bankai survives |
| a fourth | refused — *"not enough charges"* |
| two in one round | second refused — *"already spent this round"* |
| turn start at 13th | nothing back |
| turn starts at 17th | 1 → 2 → 3, then stops |

### A harness limit worth recording

An **aimed** area — a line or a burst placed at a point — resolves on a real canvas click, so
`spellcasting.cast()` from a script simply never returns for Hyōryū Senbi or Sennen Hyōrō. An
emanation is auto-centred and only wants the "Confirm targets" dialog, which is why Senbonzakura drove
cleanly. The charge half was verified through `Charges.beforeCast` directly; aiming a placement without
a mouse needs the synthetic-pointer route in `Docs/tools/foundry-live-session.md`.

---

## 17 — SB-19: twenty-four areas that caught your own party

`configFor` defaults `affects` to **`"all"`** when an item carries no `areaTargeting` flag, and **24 of
the class's 33 area effects carried none.** Every kidō line and burst, Getsuga Tenshō, Galvano Blast,
both of Hyōrinmaru's petal areas — and **thirteen of the fifteen Severing Arts** — caught the caster's
own party.

The guide settles it in one sentence, in the design note on Zanka no Tachi:

> **Design note.** This is the most complex Bankai in the class and **the only one that damages your
> own party.** That is deliberate and canon — Yamamoto's Bankai is a liability to everyone standing
> near it.

So exactly one area in the class affects everyone: Zanka no Tachi's ambient burn, which was already
authored `affects: "all", includesSelf: false`. Every other area is now `enemies` and says so, and a
test fails the build if a new one does not.

**One judgement call, flagged for the author.** `Kita: Tenchi Kaijin` is Zanka no Tachi's own 60-foot
line, so it could be read as sharing the Bankai's friendly fire. It is set to **enemies**, because the
guide attaches the allies-included clause specifically to the ambient heat ("each creature other than
you within 30 feet — allies included") and says nothing of the kind about Kita. Say the word and it
becomes `all`.

## 18 — Driving an aimed area

An **emanation** needs no click and drove cleanly all along. A **line, cone or placed burst** resolves
on a real canvas click, and three routes were tried before one worked — the full account, including
the two that look like they work and do not, is in `Docs/tools/foundry-live-session.md` §8.

The short version: a synthetic `pointermove` **does** put `canvas.mousePosition` exactly on the target,
and a synthetic `pointerdown` **does not** confirm the placement; stubbing `placeRegion` turns the
module's re-aim loop into an infinite one. So scripts cast against hand-picked targets with the
module's own `areaTargeting` setting turned off for the duration. Area targeting is proven on
emanations; everything downstream of it is proven on every shape.

**Hyōryū Senbi, driven that way:** the card posts a 60-foot line at basic Reflex, the cast spends
**one petal and one Reiatsu Point**, and a second cast in the same round is **refused and costs
nothing** — the refusal lands before the point is spent, which is the whole reason the check sits
where it does.

---

## 19 — SB-20: twenty-three of forty-seven feats do nothing

Audited statically across all 47 Soulbound feats. A feat counts as having a mechanism when it carries a
rule that is not merely a `RollOption`, a module flag the engine acts on, or a slug the scripts read.

**Twenty-three had none of the three.** The usual shape is a single `RollOption` naming the feat —
`soulbound:ghost-step`, `soulbound:soul-sever`, `soulbound:twin-pressure` — which reads like a hook and
is one nothing is attached to. Across the whole class, **45 of 49 roll options are set and never read.**

`Reiatsu Flood` was the one apparent exception that turned out to work: `capFor()` in
`rising-pressure.mjs` reads it **by slug**, not by its roll option.

### Fixed in this pass

| Feat | Lvl | How |
| :-- | :-- | :-- |
| **Perfected Technique** | 10 | The `freeCast` flag, the same machinery as the Full Release's Unbound Technique. pf2e has no *encounter* frequency period — the list is turn/round/PT1M/PT10M/PT1H/PT24H/day/P1W/P1M/P1Y — so `PT10M` is the stand-in |
| **Zanjutsu: Hakuda** | 8 | A real `Strike`. Live: **1d6 bludgeoning, agile / finesse / nonlethal / unarmed**, MAP −4/−8 |
| **Chain Anchor** | 4 | `strike-resolved` critical-success rider → `Effect: Chain Anchor` |
| **Segunda Piel Temprana** | 12 | `strike-received` critical-success rider → spirit resistance = half level for a round |
| **Rising Tide** | 8 | Paid out inside `Rising Pressure`'s own grant — the only place that knows "the first time each round that Rising Pressure grants you a point" |

**A trap worth naming:** `fist: true` on a `Strike` means *replace the character's basic fist*, and it
**ignores the rule's `damage` field entirely** — Cosmo Strike has to alter the fist's die separately,
by its fixed id. Hakuda is a new attack the guide grants, so it is a plain `Strike` that declares its
own damage. Written with `fist: true`, it produced no strike at all and the fist stayed 1d4.

### Still inert — eighteen feats

| Lvl | Feat | What it needs |
| :-- | :-- | :-- |
| 1 | Reader of Threads | a free-action Recall Knowledge, once per round |
| 1 | Sheathed Draw | manifest **and** Release as one free action on initiative |
| 1 | Zanjutsu Footwork | a free Step on a critical hit |
| 2 | Kidō Focus | spend an extra action for −1 circumstance to the save |
| 2 | Rapid Bala | a second Bala for one more action |
| 4 | Cero Doble | Cero as a 30-ft cone, with a push — the `alternateArea` seam already exists for *Photon Burst* |
| 4 | Deep Breath | the first Steady the Breath each day restores 2 |
| 4 | Shunpo Strike | Flash Step then Strike, outside Flash Step's frequency |
| 6 | Descorrer | a once-per-hour Garganta for you and five allies |
| 6 | Kidō Combination | a binding kidō for one fewer point after a destruction kidō |
| 10 | Ghost Step | Flash Step through creatures and difficult terrain |
| 10 | Reishi Mastery | Seal the Art's counteract rank +1, free on a critical success |
| 12 | Deeper Crossing | the deepened Aspect, twice per encounter |
| 12 | Soul Sever | a free Konsō on a kill |
| 14 | Twin Pressure | the Full Release aura triggering on **enter** as well as turn-end |
| 14 | Vollständig Endurance | no fatigue, and 1 point to extend by a round, three times |
| 16 | Unbroken Chain | stay at 1 HP for a point, once per day |
| 18 | Second Nature | the 6th-level Aspect, always on |

Several are cheap with machinery that now exists — `Twin Pressure` is one aura event, `Vollständig
Endurance` hooks the fatigue path written for SB-6, `Unbroken Chain` is the Saint's `deaths.mjs`
shape, `Cero Doble` is the `alternateArea` seam. Others (Descorrer, Soul Sever, Reader of Threads) are
exploration or narrative and may be worth leaving as cards.

---

## 20 — SB-21: Kyōka Suigetsu, the fourth machine with no caller

`hypnosis.mjs` could remember an observer's immunity window, decide whether they roll at all, and
convert a save into a window since Phase 3. Nothing ever called it, so **Complete Hypnosis never
happened**: Releasing rolled nothing, and `Effect: Hypnotized` was applied to nobody.

`Hypnosis.sweep` now runs from `Release.enter`, read off the sheet rather than by naming a Spirit —
`soulbound:kyoka:hypnotist` for the Shikai, `soulbound:kyoka:total` for the Full Release. The second is
the whole of that tier: it makes the sweep ignore the immunity register instead of re-rolling only the
people who were never immune.

**Driven live at 13th level.** Releasing rolled Will against **DC 27** for every enemy that could see,
and all four degrees behaved:

| Outcome | Result |
| :-- | :-- |
| failure | hypnotized **1 minute** |
| critical failure | hypnotized **1 hour**, and `permanentVictim: true` written to the register |
| success | `immuneUntil` set ten minutes out |
| blinded | never rolled |

Then the **Full Release**: seven Will saves, **including the four who were immune** — which is the
clause §7A exists for.

Three decisions worth stating, because none of them is in the JSON:

- **Enemies only.** The Shikai clause says "a creature"; the Full Release clause says "all enemies
  within 60 feet". Hypnotising your own party is canon Aizen and unplayable, so both follow the Full
  Release's word, consistent with SB-19.
- **The flat check's DC is stamped on at creation.** Refined Release raises it from 5 to 6, and the
  effect lives on the *observer*, where no predicate can see the hypnotist's features — the same answer
  as `applyFullReleaseShape`.
- **The register is keyed by actor UUID**, so two tokens of one linked actor share a window. For a
  linked actor that is the same creature, which is right; it is written down here because it is a
  choice, not an accident.

---

## 21 — SB-22: "become frightened 1" was adding one every round

The Full Release aura ticked each round and walked a creature to **frightened 8**, from a class whose
highest printed value is 2.

`Actor#increaseCondition` is additive:

```ts
const addend = value ?? 1;
return Math.clamp(currentValue + addend, 1, max);
```

and every durationless condition rider went through it. **Sixty** such riders exist across both
classes, and **fifty-seven** read as *become X* — stunned 2, prone, blinded, doomed 1, frightened 1.
The three that genuinely accumulate (two Pisces skies and an Aquarius one) all declare a **`max`**,
which is the existing signal for "cumulative to N" — so that is what now distinguishes them, and **no
content file had to change**.

A durationless condition rider now sets the condition to at least its value and never above what is
already there; one that declares a `max` still accumulates as before. This is a shared-engine change
and it touches the Saint too, in the same direction: *stunned 2* applied twice is stunned 2, not
stunned 4.

## 22 — The pressure emanation is an aura now

Fixing `Twin Pressure` meant fixing something underneath it. The Full Release's fear emanation was a
`turn-end` **area rider**, which fires when the **caster's** turn ends and sweeps whoever is standing
in the area at that moment. The guide says:

> An enemy that **ends its turn** in the emanation must succeed at a Will save…

— a per-creature trigger, which is what pf2e's `Aura` rule element is for. It is one now: radius 15
(20 with Perfected Full Release), `affects: "enemies"`, granting the module's own `Effect: Aura Tick`,
with the save carried by an `aura-tick` rider.

That also makes **`Twin Pressure`** a single word — `events: ["enter", "turn-end"]` — where before it
was a `RollOption` nothing read and could not have been written as content at all, because the events
list belongs to an effect the feat does not own. It is stamped on where the aura is built, beside the
Perfected radius.

**Live at 17th:** radius 20 without the feat and `["turn-end"]`; with it, `["enter", "turn-end"]`. In
combat, the ghoul ended its turn inside and came out **frightened 2**.

---

## 23 — SB-20, second tranche

| Feat | Lvl | How |
| :-- | :-- | :-- |
| **Sheathed Draw** | 1 | Joined to the `combatStart` handler that already released Zangetsu. Both clauses say *you are in your released form when the fight begins*, and both spend the free first Release rather than a point |
| **Zanjutsu Footwork** | 1 | A critical hit with the spirit weapon prompts the free Step |
| **Cero Doble** | 4 | A **toggleable** roll option — pf2e's own answer to a cast-time choice, since "may be shaped as" is a choice and not a rule — read by the `alternateArea` seam written for *Photon Burst*. Cero offers a 30-ft cone while it is on, with the 10-ft push on a critical failure gated the same way |
| **Vollständig Endurance** | 14 | Declares `soulbound:no-full-release-fatigue`, read by the `deleteItem` fatigue path beside Perfected Full Release |
| **Reishi Mastery** | 10 | +1 counteract rank, and no point on a critical success |

### The Quincy counteract cluster

Three clauses turn on one roll, and all three were roll options nothing read — so they are all in
`resolveCounteract`, which is the only place that knows the outcome:

- **Seal the Art costs 1 Reiatsu Point**, and *nothing spent it*. pf2e deducts focus for a **spell**;
  Seal the Art is an `action`, so the cost was prose. It is charged now.
- **Reishi Mastery** raises the counteract rank by 1 **and makes it free on a critical success** —
  which is precisely why the charge has to wait for the roll rather than happen on the cast.
- **Sklaverei** refunds a point on a success, ignoring Rising Pressure's ceiling, and leaves the target
  **off-guard**.

**Live at 15th**: the action posted, offered its suppressible effects, rolled *Counteract — DC 16,
critical success*, left the victim **off-guard**, and the pool read **2 → 2** — one point spent, one
refunded by Sklaverei.

### SB-22, confirmed at the table

With the fear aura ticking every round on a creature that keeps failing:

| | before any tick | round 1 | round 2 | round 3 |
| :-- | :-: | :-: | :-: | :-: |
| frightened | 2 | 2 | 2 | 2 |

It used to climb 2 → 4 → 6 → 8.

---

## 24 — SB-20 closed: all forty-seven feats do something

The audit that opened this — 23 of 47 with no mechanism — now returns **zero**, and
`build/test-soulbound.mjs` carries the standing guard so the number cannot drift back. A feat counts as
mechanical when any of these holds:

- a rule that is not merely a flat `RollOption`, **including a toggleable one** — pf2e's own way of
  putting a cast-time choice on the sheet (`Cero Doble`, `Kidō Focus`);
- a module flag the engine acts on;
- an **activity with an action cost or a frequency**, which is the whole mechanism for an
  action-economy feat — pf2e writes `Double Shot` exactly this way (`Rapid Bala`, `Shunpo Strike`,
  `Descorrer`, `Reader of Threads`);
- something that reads it, by slug or by the option it sets (`Reiatsu Flood`, `Unbroken Chain`).

### The last tranche

| Feat | Lvl | How |
| :-- | :-- | :-- |
| **Reader of Threads** | 1 | a `Note` on Spirit Lore and Religion: one more fact on a success |
| **Kidō Focus** | 2 | a toggle, read by `runSave` — the module rolls these saves itself, so it is the only place a −1 circumstance can land |
| **Rapid Bala** | 2 | a two-action activity |
| **Deep Breath** | 4 | a new **Steady the Breath** action, and the ledger that counts the first of the day |
| **Shunpo Strike** | 4 | a two-action activity; "outside Flash Step's frequency" is automatic, being a separate item |
| **Descorrer** | 6 | a two-action activity, once per hour |
| **Kidō Combination** | 6 | `freeCast` on binding kidō, once a fight — "1 fewer point (minimum 0)" *is* a free cast |
| **Ghost Step** | 10 | a prompt on Flash Step, at the moment it applies |
| **Deeper Crossing** | 12 | `frequency-max` 2 on Don the Other Face, and the Aspects scale on its option |
| **Soul Sever** | 12 | a prompt when your damage takes something to zero |
| **Unbroken Chain** | 16 | `preUpdateActor`, rewriting the incoming hit points |
| **Second Nature** | 18 | three predicated grants, so the Aspect is simply worn |

### SB-23 — the Borrowed Nature family was inert too

Not feats, so the feat audit missed them:

- **`Borrowed Nature`** promised the borrowed Lineage's free cantrip and granted **nothing**. Three
  predicated `GrantItem` rules now hand over Shō, Bala or Heizen.
- **`Don the Other Face`** had `rules: []` — it applied no Aspect at all — and a frequency of **once
  per round** where the guide says once per encounter. It goes through the action bridge now, choosing
  by `soulbound-borrowed:<lineage>`.
- **`Effect: Soul Reaper's Discipline`** and **`Effect: Quincy's Discipline`** carried a roll option and
  a −1 Will penalty and nothing else. The first now makes every kidō free while worn; the second grants
  Blut, and `Effect: Blut Vene` resists at a **quarter** of your level for a borrower, half once
  deepened, half for a real Quincy.
- The −1 Will penalty on all three Aspects is predicated `{not: soulbound:second-nature}` — the guide's
  *"no action, no Reiatsu Point, no duration, and **no Will penalty**"*.

### Driven live

| | |
| :-- | :-- |
| Steady the Breath, no feat | 1 point |
| first of the day, with Deep Breath | **2** |
| again the same day | 1 |
| Unbroken Chain, dropping to 0 while released | **1 HP**, pool 2 → 1, the day's use spent |
| dropping to 0 again the same day | 0 HP — refused |

### A migration limit worth knowing

`repairAll()` refreshes authored **flags** on owned items, not `system.rules`, and it cannot invent
grants that did not exist when a character was made. So a *new* grant on a class feature — **Steady the
Breath** is the first — does not reach a character built before it. Re-adding the class feature, or
re-levelling, picks it up. Deliberately not automated: re-granting by diffing pack rules against owned
items is exactly the wholesale-rules-replacement that produces *"already has item"* on every update
for ever.

---

## 25 — Senbonzakura finished, and the Soul Reapers with it

### The second emanation

The Bankai is the only ability in either class with an area that is **placed and then stays there**,
ticking from wherever it was last sent. Two small engine additions carry it:

- **An area may name an `anchor`** — a key under the caster's `areaAnchors` flag holding the point it
  was placed at. Everything else is centred on the caster, which is why `shapeFromArea` took the
  origin's centre for both the anchor and the direction.
- **A rider may carry several shapes at once.** Written as two riders they were two separate turn
  events, and a creature standing in both rolled twice and took damage twice; guide §7A says *"each
  enemy in **either** emanation"*. One rider with two shapes goes into a single Region, and
  `catchTokens` returns each token once.

**Gokei** then reshapes the second shape rather than adding a third: a 10-foot burst at double damage,
selected by predicate. **Senkei** takes the reach back and carries a `bypass` for every resistance.

**The Sustain does all three jobs** — "Sustain once per round to move the second emanation up to 30
feet, **or** to switch modes" — so *Send them* is one more button beside Gokei, Senkei and Neither.

### Driven live on a clean combat

| | what was caught |
| :-- | :-- |
| unplaced | only the enemy beside the caster, `5d6 = 20` |
| second emanation sent 90 ft away | that enemy **and** the two at the far end, each once |
| Gokei | the two at the anchor only, `5d6 × 2 = 36` and `× 2 = 26` |

### A fixture lesson, and a guard that was reverted

Before that clean run, the same test showed each creature rolling **twice** per turn, and
`pf2e.startTurn` firing twice for the caster every cycle. I added a de-duplication guard to
`Sources.onTurn` on the strength of it — and then found that `game.combat.round` and `.turn` read
*stale* inside the hook, rounds advanced 8 → 9 → 10 while `current.turn` stayed 0, and
`current.combatantId` never moved off the caster.

That combat had been created, deleted and stepped through dozens of times across the session. On a
**freshly created** combat the order is exactly `["Ghoul Soldier", "ZZ SR — TechGate"]`, one start each
per cycle, and every creature rolls once. **The guard was reverted**: it was built on an observation
that turned out to be damage to the test fixture, not behaviour of the system, and shipping it would
have silently suppressed real ticks.

**For next time:** delete stale combats before measuring anything that keys off turn order, and check
`combat.current.combatantId` actually advances before trusting a turn-based count.

---

## §26 — the Hollow's Regeneración: three bugs stacked in one clause

Guide §5.2 puts the whole point of the Lineage in one sentence, and then says so out loud:

> It is deactivated while you have the dying condition, and suppressed until the end of your next turn
> whenever you take spirit damage or damage from a holy or vitality effect.
>
> *That last clause is the point: Soul Reapers and Quincy exist to shut this down, and both can, from
> 1st level.*

Nothing in that clause worked. Three separate defects, each of which hid the next.

### SB-24 — the predicate named an effect that did not exist

`Regeneración` was predicated `{not: "self:effect:regeneracion-suppressed"}`, and **nothing in the module
ever applied such an effect** — no content document, no script. The predicate read perfectly and was
never false, so a Hollow's fast healing could not be switched off by anything.

Fixed by creating the effect and `scripts/soulbound/regeneracion.mjs`, called from the `applyDamage` wrap
in `riders/sources.mjs` — the only place the damage **type** still exists. By the time hit points have
changed, all that is left is a number.

### SB-25 — the doubling was an option nobody read

`soulbound:murcielago:high-speed-regeneration` was published by Segunda Etapa and read by nothing. Split
into two predicated `FastHealing` rules, base and `2*(…)`, mutually exclusive so it can never heal twice.

**Confirmed live at 17th:** `6* / 12` plain, `6 / 12*` with the option, `6 / 12` (both off) while dying.

### SB-26 — `holy` is a trait, not a damage type

The repair to SB-24 asked for `holy` among the damage **types**. There is no `holy` in pf2e's
`DAMAGE_TYPES` — the remaster made it a *trait* — so `5[holy]` parses as **untyped** and a type check for
it can never match. The guide's wording is exact and was read too quickly: "damage from a **holy or
vitality effect**" is one type and one property of the effect.

`suppressorsFor` now returns `{types, traits}` and `traitsOf` reads `item:trait:` / `origin:item:trait:`
from the roll options — **never `self:trait:`**, which is the *target's* traits: a Hollow that happened to
be holy would otherwise suppress its own regeneration on every hit it took.

| At the table | spirit | vitality | holy (trait) | holy on *self* | slashing |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 11th | suppressed | suppressed | suppressed | — | — |
| 15th, **Segunda Piel** | suppressed | — | — | — | — |

### The thread running through all three

**Two of these three were the same bug as SB-16, in two new places.** `sluggify` reduces anything outside
`[a-z0-9]` to a separator, so "Regeneración" builds as `regeneraci-n`:

- in **code** — `scripts/soulbound/regeneracion.mjs` compared `system.slug === "regeneracion"` and matched
  nothing. Now matched on an authored **tag** (`soulbound-regeneracion`), which is ASCII by construction
  and, unlike an explicit slug, does not change the document's derived id and break every existing
  character's link to it.
- in **content** — the new effect was named "Effect: Regeneración Suppressed", so pf2e published
  `self:effect:regeneraci-n-suppressed` while the predicate asked for `regeneracion-suppressed`. Its
  `system.slug` is now pinned.

Both guards are now in place, because an accented name will keep happening:

- `validateSlugPredicates` checks **`self:effect:<x>`** as well as `item:slug:<x>`, against the built
  effect slugs with the leading `effect-` stripped the way pf2e strips it.
- `test-soulbound` checks that every `system.slug === "…"` comparison **in the scripts** names a document
  the build actually writes.

Both were confirmed to fail on the un-fixed content before being accepted.

### Note on a bad probe

The first live reading of this was `fastHealing: []` at every level, reported as "no fast healing at all".
That was wrong. **`FastHealingRuleElement` writes nothing to the actor** — it has no
`beforePrepareData`/`afterPrepareData` at all, only an `onUpdateEncounter` that posts a chat card at the
start of the turn. `system.attributes.fastHealing` is a property pf2e does not maintain, so reading it
proves nothing either way. The rule instances on `actor.rules` are the thing to inspect.

Likewise `{(5[spirit])}` parses as **untyped** — the inner parentheses strip the annotation. The correct
damage formula is `{5[spirit]}`.

---

## §27 — the Refined Release rung, audited Spirit by Spirit

Every Spirit has three rungs: the Released Form at 1st, **Refined Release at 9th**, and the Full Release
at 13th. The 1st and 13th were authored everywhere. The 9th was not.

**A first pass counted this wrong and the number is worth correcting rather than quietly dropping.**
Grepping the content for `feature:refined-release` returned six files and suggested nine Spirits had no
Refined rung at all. That over-counted: two of the "missing" rungs are 9th-level *unlocks* delivered as
rank-5 spells rather than alterations of a lower Technique, and both were complete —

- **S-67 Licht Regen** — 30-foot cone, 6d6 piercing, basic Reflex, critical failure off-guard, H(+1) +1d6
- **S-89 Galvano Javelin** — 90 feet, 6d6 electricity doubled on a critical hit, stunned 1 on a hit, and
  the `incapacitation` trait actually present

— so a predicate was never the right thing to look for in their case. The honest count is **seven Spirits
whose Refined rung had no mechanics at all** (Pantera, Arrogante, Los Lobos, Hyōrinmaru, The Heat, The
Balance, The Miracle), plus six sub-clauses missing from Spirits that otherwise had the rung: *not one* of
the five Refined area widenings existed, and Murciélago's splash burst did not either.

### SB-28 — the widenings

Five Techniques whose Refined rung enlarges the area sat at their printed size with nothing to change it:

| Row | Technique | printed | Refined |
| :-- | :-- | :-- | :-- |
| S-03 | Senbonzakura | 15-ft emanation | **20 ft** |
| S-10 | Getsuga Tenshō | 30-ft line | **60 ft** |
| S-25 | Ennetsu Jigoku | 15-ft emanation | **20 ft** |
| S-50 | Respira | 15-ft emanation | **20 ft** |
| S-61 | La Gota | 30-ft cone | **40 ft** |

All five now carry an `alternateArea` predicated on `feature:refined-release`. **The order is
load-bearing** — `alternateArea` is first-match-wins — so La Gota keeps its Hirviendo 60-foot line ahead
of the Refined cone: at 13th both predicates pass, and the Full Release shape has to win. A test pins
that order rather than just the contents.

### The rest of the rung

| Row | What was missing | How it is done now |
| :-- | :-- | :-- |
| S-40 | Pantera's claws never became 1d10 | `ItemAlteration` `damage-dice-faces`, `override: 10`, on the Resurrección effect. pf2e requires a **null** value for `upgrade`/`downgrade` — those step one die size — and only `override` takes a number, which is also the guide's literal "become 1d10" |
| S-40 | no Step after Garra | a `self: true` prompt rider |
| S-50 | crit fail could still heal | `Effect: Respira — Cannot Heal`, expiring at the end of the target's next turn |
| S-50 | broken objects and structures | a `Note`, because it is the GM's call on scenery and pretending otherwise would be worse |
| S-54 | Cero Metralleta had only its cone | `areaTargetingShapes` — which had existed since the Saint's *Photon Burst* and **no content had ever used it** |
| S-55 | no Refined Sustain at all | a granted 1-action `Cero Metralleta — Sustain`, once per round, that **casts** rather than merely permitting a cast |

On S-55: leaving the player to Sustain *and then* cast would charge them the Technique's printed two
actions on top of the Sustain's one — three actions for what guide §7B gives as one. So it routes through
the action to state bridge and casts with `consume: false`, the same seam `FreeCast` uses. Aiming is
untouched, so "a different direction" stays the caster's to choose, and both shapes are offered again.

### SB-27 — Arrogante's doomed cap could never have worked

> immune to disease, poison, and **doomed never rises past 1** — guide §7B

First a roll option nothing read; then, as the repair, an `ActiveEffectLike` lowering
`system.attributes.doomed.max`. **That was also inert**, and for a reason no amount of care with the rule
element could have fixed:

```
this.prepareSynthetics();                       // every ActiveEffectLike applies here
…
attributes.doomed.max = attributes.dying.max;   // and is overwritten here, unconditionally
```

— `CreaturePF2e#prepareDerivedData`. No priority, mode or ordering wins against a plain assignment
further down the same method. The only seam later than it is a wrapper on `prepareDerivedData`, which the
module already owns for the reiatsu pool, so the cap is declared on the item like `actionCost`:

```json
"flags": { "isaacs-hb-pf2e": { "attributeCaps": [{ "path": "attributes.doomed.max", "value": 1 }] } }
```

It only ever **lowers** a ceiling. **Live:** Arrogante reads `doomed.max 1` at 1st and 9th while Pantera
and Los Lobos, in the same world, still read 4.

### SB-29 — a predicated `GrantItem` needs `reevaluateOnUpdate`, and still lands a turn late

`preUpdateActor` returns immediately unless the flag is set, so without it the predicate is tested **once**
at creation and never again. Seventy-one of the module's seventy-three predicated grants already said so;
the Los Lobos Sustain was one of the two that did not. The other, `Effect: Om`, is `inMemoryOnly` — those
are rebuilt every data preparation, and pf2e excludes them from `reevaluateOnUpdate` on purpose. A
validator now requires the flag and exempts that case.

Worth knowing even with the flag set: `preUpdateActor` tests against the **pre-update** roll options, so a
grant gated on 9th level does not appear on the update that reaches 9th — it appears on the next one. The
reliable path is the one the release ladder already takes: the form effect is **deleted and re-created**
on each Release, and `preCreate` evaluates the predicate against current options.

**Live:** at 1st, no Sustain. At 9th, `Cero Metralleta — Sustain`, 1 action, 1/round.

### SB-30 — `Release.exit(actor)` with no rung silently did nothing

`exit(actor, state)` built its name set from `EFFECTS[state]`; called without a rung that set was empty,
so it deleted nothing and left the release flag untouched — indistinguishable from a Release that had
failed to clear, and it cost a long detour here. It now defaults to the state the actor is actually in.

### Three things the console said along the way

Not chased yet, recorded so they are not lost:

- **`Bala`** — "Multiple Attack Penalty rules element failed to validate: value must resolve to less than
  or equal to zero", on *every* Soulbound actor in the world. The rule is being dropped.
- **`Flash Step`** and **`Full Release`** — "element-validation failure at `system.traits.value`:
  `reiatsu` is not a valid choice".
- Several module items point at icon paths Foundry rejects (`leaf-petals-pink.webp`,
  `rose-thorned-red.webp`, `eye-ringed-glow-angry-purple.webp`, `explosion-star-large-blue.webp`).

### A note on probes, again

Three readings in this pass were wrong before the content was:

- `system.attributes.speed` does not exist in this version — speeds are at **`system.movement.speeds`**,
  and the wrong path reads as "this character has no speeds".
- Techniques are **spells**, not actions or feats; looking for them in `itemTypes.action` finds nothing
  and reads as "the Technique was never granted".
- `release()` returning false after a dozen scripted release cycles is the **encounter ledger** doing its
  job — the second Release in an encounter costs a Reiatsu Point, and the pool was empty. Reset
  `flags.isaacs-hb-pf2e.releaseLedger` before measuring anything that releases repeatedly.

---

## §28 — Bala's agile clause, and the console it was hiding in

### SB-31 — a MultipleAttackPenalty is a penalty, not a discount

> Bala counts as **agile** for the purpose of your multiple attack penalty (−4/−8 rather than −5/−10).
> — guide §6.4

Authored as `value: 1`, which reads perfectly as "reduce the penalty by one". pf2e reads the value as
the **penalty itself**:

```
if (value < 0) { penalties.push({ label, penalty: value, predicate }); }
else if (value !== 0) { this.failValidation("value: must resolve to less than or equal to zero"); }
```

and `calculateMAPs` turns a synthetic into `{map1: penalty, map2: penalty * 2}`. So "counts as agile" is
**−4**, and the rule as written was dropped on every data preparation, on every Soulbound in the world.
`Twin Fang` was wrong in exactly the same way and had never said so out loud, because it only warns for a
character who has taken the feat.

A second defect sat underneath it. **A MAP synthetic lives on the actor, keyed by domain** — not on the
item that declared it — so the unpredicated rule would have made *every* spell attack the character ever
makes agile, a Murciélago's Cero Oscuras included. Bala's is now scoped to `item:slug:bala`.

**Live:** Bala reads −4/−8; Cero and Cero Oscuras read −5/−10.

### SB-32 — a corrected pack reaches nobody who already exists

Fixing the content fixed no existing character, because an owned item is a **copy**. `repair` had always
refused to touch `system.rules`, and for a good reason it states plainly: pf2e writes a `flag` onto a
`GrantItem` at grant time and a `selection` onto a `ChoiceSet` when the player answers it, both *inside*
that array, so replacing it wholesale throws that state away.

But that reason only covers rules which carry such state. `rulesAreSafeToRefresh` is the narrow version:
refresh the array only when neither the owned nor the packed version contains a `GrantItem` or a
`ChoiceSet`. `img` is refreshed unconditionally, being pure presentation.

**Live:** `repairAll` cleared all eight stale actors, `arrancar` and `quincy` among them.

### SB-33 — `reiatsu` was registered for spells only

`pf2e-homebrew` registers traits per category, and pf2e validates an item's traits against the one
category matching its **type**. `reiatsu` was declared under `spellTraits` — true of the sixty-two kidō,
and silent about the eleven feats and four actions that also carry it, from which pf2e stripped it. The
same was true of `cosmo` on one Saint action.

The categories are not independent: `classTraits` reaches feats, actions, spells and effects;
`featTraits` reaches feats, actions and effects; `spellTraits` reaches spells alone. That last line is the
whole trap, and a validator now models the propagation rather than guessing it.

### SB-34 — eighty-nine of the module's ninety-six icons did not exist

Chasing the last warnings out of the console turned up something much larger. Every `img` in both classes
pointed into Foundry's icon library, and **eighty-nine of those paths were invented**:
`leaf-petals-pink.webp`, `wolf-howl-moon-grey.webp`, `sword-katana-black.webp`. They read exactly like
real files. Only seven had ever warned, because Foundry validates an icon at the moment something renders
it — the other eighty-two sat on a silent fallback, indistinguishable from a deliberate choice.

The names were the right instinct even though the files were not: each one says precisely what it wants
to be. So rather than remap two hundred and forty items onto whatever Foundry happens to ship — where a
wolf becomes a purple wolf and petals become maple leaves — **the names were kept and the art was drawn
to match them**. `build/make-icons.mjs` reads both halves of each filename:

```
wolf-howl-moon-grey              ->  glyph `wolf`,             palette `grey`
blade-two-handed-glowing-orange  ->  glyph `blade-two-handed`, palette `orange`
```

so the ninety-six stay coherent by construction and adding one is a filename rather than a drawing. They
ship with the module as SVG, which is also what makes them checkable: a path under
`modules/isaacs-hb-pf2e/` is a file in this repository, and a validator now requires it to be there.
Paths into Foundry's own library are left alone, because someone else's install is not ours to assume.

Two bugs surfaced in the drawing itself, both worth naming because neither looked like arithmetic:

- **The generator silently did nothing.** Its entry guard compared `import.meta.url` against
  `` `file://${process.argv[1]}` ``, which is not the URL Node produces on Windows — it escapes the drive
  letter. The script exited 0 and wrote no files. `pathToFileURL` is the only correct way to ask.
- **A black figure on gold wings.** `shade(hex, 1.35)` took a channel past 255, and
  `(0xdc * 1.35).toString(16)` is *three* hex digits, which makes the colour string one character too
  long — so the browser discarded it and painted black. It was the colour arithmetic, not the drawing.

### A note on `git revert --no-commit`

Reverting one commit to recover seven icon names rolled back that commit's **whole tree** — the MAP
guards, the trait registration and the repair went with it, and the loss only surfaced when a validator
that had been proven working an hour earlier failed to fire. `git checkout HEAD -- <path>` is the tool
for taking back part of a commit; `git revert` has no such thing as partial.

---

## §29 — the Quincy pass

### SB-36 — Blut Arterie was one roll option and nothing else

> **Blut Arterie** — your Strikes ignore resistance to physical and spirit, and the target's cover is one
> step less. It gives **no bonus to attack, damage or DC**. — guide §5.3, Q-05

`Effect: Blut Arterie` contained a single `RollOption` publishing `soulbound:blut-arterie`, which nothing
read. Every Quincy in the world has had this since the class shipped, and none of it did anything.

The resistance half is a `bypass` entry, predicated `item:type:weapon` so it reaches Strikes and not
Techniques — `bypassEntriesOn` already scans every item on an actor, so an effect can carry one.

Cover needed more thought. pf2e models cover as an **effect on the target** with a circumstance AC bonus,
and its own precedent for piercing it — `Effect: Alchemist Goggles` — is an `EphemeralEffect` applied to
the target for the roll, suppressing the `cover` modifier. Suppressing is too much here: "one step less"
is not "none". So `Effect: Cover Pierced` carries three `AdjustModifier` rules in `subtract` mode, and
because the effect lands **on the target** it can read that target's own `self:cover-level:*` options:

| the target has | subtract | leaving |
| :-- | :-- | :-- |
| greater (+4) | 2 | standard |
| standard (+2) | 1 | lesser |
| lesser (+1) | 1 | none |

One effect, shared with **Letzt Stil**, which gives the same clause at 13th (S-68).

**Live:** the bypass selects on a Strike and not on a spell, for physical and spirit, with the cover rule
attached.

### SB-37 — two Techniques nobody could ever have

`Licht Regen` and `Galvano Javelin` were authored completely, down to the `incapacitation` trait, and
**nothing granted them**. Each Spirit granted its 1st-level Technique and its 13th-level Vollständig and
skipped the 9th entirely.

This corrects §27, which called them "complete". They were complete and unreachable, which is worse than
incomplete, because every check that looks at the document passes.

The same audit found the **fifteen Severing Arts** in the same state — authored, and granted by nothing,
since `Effect: Severance` never named them. Each Spirit now grants its own, predicated on
`soulbound:severance` with `reevaluateOnUpdate`, so the Art exists only inside those ten rounds.

`validateActionsAreReachable` had said this about **actions** since the Saint's Om went missing from a
Virgo's sheet. It now says it about **Techniques** too. (Kidō are excluded: those are chosen, not
granted.)

**Live:** a 9th-level Antithesis now knows `licht-regen`; a 9th-level Thunderbolt knows `galvano-javelin`.

### SB-38 — a spirit weapon per Release, kept

pf2e **detaches** a physical grantee when its granter is deleted, and does so deliberately:

```
this.onDeleteActions?.granter ??
    (setHasElement(PHYSICAL_ITEM_TYPES, grantee.type) ? "detach" : "cascade")
```

— you do not want a granted sword vanishing out of a character's inventory. A spirit weapon is the exact
opposite case: it exists only while the form is worn, and the form is deleted and re-created on **every**
Release. So each Release left another copy. Nine form effects, one for every Spirit that grants a weapon;
a Miracle Quincy driven through five Releases was carrying five Swords and Shields.

All nine now say `onDeleteActions.granter: "cascade"`, and a validator requires it.

**Live:** three Release-and-seal cycles, and the weapons come and go cleanly each time.

### SB-39 — the refusal to die, generalised at last

`unbroken-chain.mjs` said in its own docstring:

> *`The Miracle`'s Vollständig has the same shape at a different price … so this is written to read its
> conditions from the feat rather than to know one feat's name. A second refusal-to-die declares itself
> and needs no code here.*

It then matched one hard-coded slug. Fine while exactly one ability refused to die; wrong the moment
**Bailar de Valquiria** (five Miracle points, repeatable — S-99) and **The Balance**'s Refined clause did
too. The price is now declared on the item, and the resource may be the reiatsu pool *or* a counter badge
on an effect. Declarations are taken cheapest first, so a character carrying both spends the Reiatsu
Point before the five Miracle points.

**Live:** a 13th-level Miracle in Bailar with 7 points, taken to 0 HP, stood at **1 Hit Point with 2
points left**.

### SB-40 — `lingering` had a predicate nothing read

Two Techniques gate their patch of ground on `feature:refined-release` — `La Gota`'s Cascada and
`Ennetsu Jigoku`'s embers — and both laid it at **every** level, because `Lingering.create` took the flag
whole and never looked at the field. The predicate is now honoured, and `lingering` may be a **list**,
which is what *Burner Finger Five* needed: difficult ground always, and ground that is also *burning* for
a round longer at Refined Release. One spec cannot say two durations.

### SB-41 — spell overlays were validated by nothing

A spell **variant** is a first-class item at cast time — pf2e builds it with
`mergeObject(source, overlay, { overwrite: true })`, so an overlay's flags replace the base's and the
rider engine reads them like any other item's. Nothing checked them. A rider with an invented apply type
sat inside `Burner Finger Four` and validation passed without a word.

That mattered immediately, because the five fingers are exactly where the per-option clauses belong:
Four's persistent fire and Five's terrain must not be inherited by the other three.

### Two things that were correct and looked broken

- **`fullRelease` refused at 13th** for all five Quincy — because a freshly created actor has
  `focus.value: 0` and a Full Release costs a point. Correct behaviour, empty pool.
- **A count-based test broke** on every Spirit at once when the Severing Arts were granted. Three of them
  asserted `GrantItem.length === 3`. A count is a number to edit rather than a claim to check, so they
  now assert what each grant *is*: a form from 1st, a Vollständig gated to 13th, a Severing Art behind
  Severance.

### Where the Quincy pass stands

| Row | | Row | |
| :-- | :-- | :-- | :-- |
| Q-05 Blut Arterie | fixed, live | S-83 Balance Refined (AC) | fixed |
| S-65 bow, die, range 100 | fixed, live | S-84/85/86 at Night | fixed |
| S-67 Licht Regen | reachable, live | S-89 Galvano Javelin | reachable, live |
| S-68 Letzt Stil cover | fixed | S-91 Thunderbolt arc | fixed |
| S-69 free Licht Regen | fixed | S-92 Miracle save | fixed |
| S-70 the cost | fixed, live | S-95/97/100 Miracle points | fixed, live |
| S-76/77/78/79 Burner Finger | fixed | S-99 refusal to die | fixed, live |

Still open: the **Severance pass** proper (R-01..R-26) — the fifteen Arts are now reachable, but their
Waning dice, the lockout after round 7, and the price when Severance ends are unverified.

---

## §30 — Severance, and the Waning table that was connected to nothing

### SB-42 — every Severing Art always rolled twenty dice

Guide §9 builds the capstone around a decision:

> **The tension is the point.** The longer you survive in Severance, the more the general state has given
> you, and the less your ending is worth. Round one is 70 damage and none of the buff. Round seven is 28
> damage and six rounds of a 4d6 rider, doubled Flash Step, and free kidō. There is no dominant line,
> which is what makes it a decision instead of a script.

`waningDice(round)` implemented that table exactly, was exported, and was unit-tested. **Nothing called
it.** All fifteen Arts were authored at a flat `20d6` — the round-one value — so the decision did not
exist: a Soulbound sat through nine rounds of the general state and still ended the fight for seventy
points. §9.0.1 is explicit that the decay *is* the balance lever, and the lever was not attached.

The dice are now stamped in `prepareDerivedData`, not at cast time, so the **card is honest**: a player in
round three sees 16d6 on the Art before deciding whether to spend their one shot. That costs a
re-preparation when the round turns, which the clock hook now does for exactly the actors in a Severance.

Ittō Kasō is "the Waning dice **+2d6**" (R-14), so the extra survives the rewrite rather than being
overwritten by it.

**Live, one round at a time:** 20 / 18 / 16 / 14 / 12 / 10 / 8 across rounds one to seven, then **0** in
rounds eight, nine and ten.

### SB-43 — the Art never ended Severance, and could be used after it decayed

R-08 and R-09 lived only in the prose. `waningDice` returned 0 for round eight and nobody asked, so the
Art stayed on the sheet and rolled its printed twenty dice in round ten; and using it ended nothing.

Both now sit in the cast pipeline beside the other three gates. `Severance.beforeCast` refuses an Art
outside a Severance or past the seventh round; `afterCast` ends it — **after the cast has actually
reached the table**, never before, because ending the capstone on an attempt the caster backed out of
would take it away for nothing.

### SB-44 — `game.combat` is the viewed encounter, not the actor's

The first live drive reported "round 10" for a Severance that had just begun. `Severance.begin` stamped
its flag from `game.combat?.round ?? 1`, and **`game.combat` is `game.combats.viewed`** — the encounter
belonging to whichever scene the *client* happens to be looking at. It came back empty, the fallback
wrote 1, and every subsequent round read from round one for the rest of the fight.

`encounterFor(actor)` asks the combatant for its own encounter instead. No view can change that answer.

The round is also stamped **on the source document** now rather than set afterwards: a `setFlag` on a
freshly created embedded item is a second write, and anything reading in between — including a
`prepareDerivedData` triggered by the creation itself — misses it. The Waning table reads this flag on
every preparation.

### SB-45 — three more clauses that were prose

- **R-04** "your Release Technique and every kidō cost nothing and have **no frequency limit**". `freeCast`
  refused any item whose `system.frequency.value` was absent or zero — which is every effect that is not
  itself a once-per-day feat — so an allowance with no ceiling could not be expressed at all. It now
  takes `unlimited: true`, and there is nothing to decrement.
- **R-05** the borrowed Full Release, at its 20-foot shape and **without fatigue**. The module already had
  `soulbound:no-full-release-fatigue` and `Effect: Severance` never published it.
- **R-10** the price. `Effect: Severed` zeroed the pool and published `soulbound:severed`, which nothing
  read — so a severed character could Release again and put the whole form back on, which is the opposite
  of a cost. `release()` now refuses while severed, and `Severance.end` takes the Released Form **off**,
  which is the first item on R-10's list and the one the effect had never touched.

`end` also nudges the actor so the Art leaves the sheet. It is granted by the **Spirit feature**,
predicated on `soulbound:severance`, so deleting the Severance effect does not cascade it away and pf2e
only re-tests a predicated grant on an actor *update* — the Art otherwise sat there after the state was
over, inviting a use that `beforeCast` would then refuse.

**Live, the whole arc:** Severance begins at round 1 with speed 45, immunity to death and fear effects and
to frightened and doomed, Flash Step twice per round, and Mugetsu on the sheet. Round 2 shows 18d6.
Casting it leaves **Severance gone, Severed applied, the release state sealed, the reiatsu cap 0, the Art
off the sheet**, and a fresh Release refused.

### A note on the harness

The ChoiceSet resolver had been answering nothing this whole campaign. It clicked
`button[data-choice]`, which looks exactly right and matches **nothing** — the choices are Svelte-rendered
buttons carrying no dataset at all. A job waiting on a prompt hung precisely as though no resolver had
been installed, which is how it went unnoticed. The selector is `button.select-button`.

---

## §31 — the fifteen Arts, clause by clause

Most of R-11..R-26 was authored and correct: every shape, damage type and save matches the guide, and
the conditions that were there carried the right values — Hyōten Hyakkasō's restrained at an Escape
against the Reiatsu DC, La Hora Final's enfeebled 3 for a minute and drained 1 for a day, Burning Full
Fingers' persistent fire at a **DC 20** flat check, Ola Azul's 30- and 60-foot pushes, Electrocution's
stunned 2 with the `incapacitation` trait. Four clauses were not.

### SB-46 — the wound that will not close (R-11, R-14)

Shūkei: Hakuteiken and Ittō Kasō both stop a target healing, for a minute. Neither said so in anything
but prose. One shared effect now does it, and its second half publishes
`self:effect:regeneracion-suppressed` — the option the Hollow's `Regeneración` already predicates on —
so a Hollow caught by either Art stops regenerating rather than merely being told it has.

### R-13 — persistent cold "with no flat check"

The engine has no "no check" mode and pf2e's persistent damage always offers one. A DC no d20 can reach
is the honest encoding: it is visible on the sheet rather than implied, and it says so on the card.

### R-26 — Apotheosis

Temporary Hit Points equal to twice your level, and a second detonation at the start of your next turn
for **half the Waning dice**. Both live on an effect the caster wears: `TempHP` is a rule element, and
the re-detonation is a `turn-start` rider carrying the same 30-foot emanation.

"Half" is `multiplier: 0.5`, which halves the **total** — `10d6` would be a different distribution from
half of 20d6 — and the dice come from a new resolvable, `origin.severance.dice`. That one matters: by the
time the second blast lands the round has turned, so it is worth what the table says in the round it
actually goes off, not what the first one rolled.

### SB-47 — R-15, and a trap I walked into twice

Ittō Kasō's price is the drawback that pays for its extra dice and its immunity-piercing fire:

> You take damage equal to **half your current Hit Points**, unpreventable, unreducible, unresistable,
> unredirectable, applied **after** the Art resolves.

There was no way to express it. `hpFraction` on a death rider is a *threshold*, not an amount; every
damage rider wants a formula, and this number is not known until it lands. `fractionOfCurrentHp` is the
new form, applied with `skipIWR` and `final` — which is the whole "unresistable" clause.

Then it did not fire, and the reason is worth keeping:

**A rider with no `event` defaults to `save-rolled`.** For "for each creature that fails its save, you
regain 3 Hit Points" — Sekishiki Kisōen — that is exactly right. For a cost paid once it is doubly wrong:
charged once per creature who rolled, and *not at all* against an empty cone. The same trap had already
caught Pantera's free Step (S-40), authored earlier in this same campaign, which would have been offered
once per creature the cone caught.

`event: "action-used"` fires on the cast itself, once. A validator now refuses a top-level `self` rider
that has **neither an event nor outcomes**, since that combination can only mean the author expected it
to happen once and it will not. Nested riders are exempt: they run inside their parent's pass and have no
event of their own.

**Live:** a 20th-level Ryūjin Jakka at 200 Hit Points casts Ittō Kasō in round one — **200 → 100**, and
Severance ends.

### Still prose

Four clauses are described and not automated, and are listed here rather than left to be rediscovered:

- **R-16** Kanzen Saimin: Owari's critical failure — the victim perceives *its own allies* as you, and
  damage cannot shake it loose. The confusion itself is applied; this rewrite of who-looks-like-whom has
  no mechanical handle short of retargeting another creature's attacks.
- **R-18** Cero Oscuras: Ceniza — a creature dropped to 0 crumbles to ash and needs a 10th-rank effect to
  return. What happens to a corpse is the table's, not the module's.
- **R-20** Aullido's wolves — requires at least one, expends all of them, none regrow this encounter, and
  the prone-and-stunned clause applies only when five or more were spent. The `chargeSpend` machinery
  could carry this; it does not yet.
- **R-24** The Reckoning's escalation to doomed 2 "if you used your Release Technique three or more times
  this encounter" — an encounter-scoped counter nothing keeps.

### A harness note

The first drive of this section built a **Soul Reaper carrying Arrogante's Severing Art**. A ChoiceSet
auto-clicker was running alongside the rig's own resolver, answered first, and took whatever was at the
top of each list. Only one of the two may be installed at a time.
