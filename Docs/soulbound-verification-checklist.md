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
| C-07 | Attacks | 1→5→13 | Simple + martial + unarmed trained; martial **Expert at 5**, **Master at 13** | ❌ | **SB-10.** Martial is right, but **simple and unarmed advance with it** (E@5, M@13). Guide §2's ledger buys them Trained-only (10 pts each) and §10.1 lists only martial advancing — 320 BCS points off budget |
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
| C-29 | **Greater Flash Step** | 11 | Until your next turn, the first attack against you each round needs a **DC 5 flat check** | ☐ | |
| C-30 | **Departed Flesh** | 3 | Immune to disease; no food/drink; success vs. poison becomes critical success | ☐ | |
| C-31 | **Release** | 1 | 1 action, auditory/concentrate/reiatsu; **first Release each encounter is free**, re-releasing costs 1 point; lasts the encounter; can't Release while dismissed; **is not a stance** | ❌ | **SB-6.** The Release action has `rules: []` and no module hook; `Release.enter()` is called from nowhere. No release state is recorded, `Effect: Released` has `rules: []` and is never applied, and the free-first/1-point economy does not exist |
| C-32 | **Refined Release** | 9 | The Spirit's Refined benefit turns on; base rank 5 | ⚠️ | Fires by **level**, not by Release. Area half proven live: Senbonzakura 15→20 ft at L9. But see **SB-7** — it adds +5 ft to *every* Release Technique |
| C-33 | **Full Release** — cost | 13 | 2 actions, **once per day**, requires released form **and ≥1 Reiatsu Point** | ❌ | **SB-6.** The L13 feature grants `Effect: Full Release` unconditionally on levelling — no action, no cost, no requirement, no once-per-day |
| C-34 | Full Release — die step | 13 | Spirit weapon damage die +1 step | ❌ | **SB-6.** `Effect: Full Release` has `rules: []` — no die step. Zangetsu and the two-step Spirits override this |
| C-35 | Full Release — free technique | 13 | Release Technique costs nothing, **once per round** | ❌ | **SB-6.** No rules — the technique still costs a point and has no per-round limit |
| C-36 | Full Release — pressure emanation | 13 | **15-ft emanation**; enemy ending its turn there: Will vs. Reiatsu DC or **frightened 1** (2 on crit fail); success = immune 10 min | ❌ | **SB-6.** No rules — no emanation, no Will save, no frightened |
| C-37 | Full Release — end state | 13 | **Fatigued** until 10 minutes' rest; no second use that day | ❌ | **SB-6.** No rules — no fatigue, and nothing to end |
| C-38 | **Perfected Full Release** | 17 | 2 minutes, **no fatigue**, emanation 20 ft | ❌ | **SB-6.** `fullReleaseShape(17)` returns the right numbers in code, but nothing consumes it |
| C-39 | **Unsealed** | 19 | Full Release **twice per day**; immune to fear while in it; first crit each round with the spirit weapon refunds 1 point **ignoring the per-encounter cap** | ❌ | **SB-6.** Frequency does rise to 2/day on the feat, but there is no daily use to spend |
| C-40 | Technique heightening | — | Every reiatsu effect auto-heightens to **half level rounded up**, no rank, Reiatsu DC + key attribute | ☐ | |

---

## 3 — Soul Reaper Lineage (guide §5.1)

| # | Item | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SR-01 | Granted skill | 1 | **Society** trained | ✅ | Society trained at L1 |
| SR-02 | **Kidō Adept** | 1 | **Two** chosen kidō at 1st, on top of free **Shō** | ✅ | Two `Kidō Learned` features at L1, plus Shō free — but see SB-2/SB-3 for what they offer |
| SR-03 | Kidō Adept — ladder | 5/9/13/17 | One more chosen kidō at each; **six chosen** in total | ❌ | **SB-2** and **SB-3**. Six features arrive on schedule, but the ChoiceSet has no level gate (Kurohitsugi, a 15th-level kidō, is offered at 1st) and no duplicate guard — a live test picked **Sai — Restrain three times** and the sheet kept all three |
| SR-04 | **Zanjutsu** | 5 | Access to the Zanjutsu feat family **plus one technique free** | ❌ | **SB-4.** One technique is granted, but the ChoiceSet offers all six regardless of level: a 5th-level character was granted **Zanjutsu: Kendō**, a 14th-level technique |
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
| Q-03 | **Blut** — economy | 1 | Free action, **once per round**, choose Vene **or** Arterie, lasts until start of next turn, **never both** | ☐ | |
| Q-04 | **Blut Vene** | 1 | Resistance to physical = half level, minimum 1 | ☐ | |
| Q-05 | **Blut Arterie** | 1 | Strikes ignore resistance to **physical and spirit**; target's cover one step less; **no bonus to attack, damage or DC** | ☐ | |
| Q-06 | **Heizen and Gritz** | 1 | Exactly these two; `Additional Kidō` is closed | ☐ | |
| Q-07 | **Seal the Art** | 5 | 2 actions, 1 point, 30 ft; counteract with Reiatsu DC proficiency + key attribute, **counteract rank = half level rounded up** | ☐ | |
| Q-08 | Seal the Art — release states | 5 | A release state is **suppressed until the end of the target's next turn**, not ended, and can't be re-entered in that time | ☐ | |
| Q-09 | **Sklaverei** | 15 | Successful counteract refunds 1 point **ignoring the cap**, target **off-guard** until end of its next turn; crit success vs. a release state suppresses for **1 minute** | ☐ | |

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
| K-18 | Not spells | — | Kidō use the **Reiatsu DC**, can't be counteracted as spells, can't be slot-heightened | ⚠️ | **SB-8.** Kidō and Techniques post with the **Arcane** tradition on the chat card. Guide §6 says they are not spells and have no tradition; the Reiatsu entry is created with `tradition: {value: ""}`, which pf2e renders as Arcane |
| K-19 | Traits | — | Every kidō carries **kidō** + **reiatsu** + one of **destruction / binding / mending** | ☐ | |
| K-20 | Lineage lock | — | `Additional Kidō` is **Soul Reaper only**; a Hollow/Quincy can never exceed two | ☐ | |

---

## 5 — Spirits (guide §7)

Four rungs each: **Form** (1st) · **Release Technique** (1st) · **Refined** (9th) · **Full Release**
(13th). A Spirit passes only when all four do.

### 5A — Soul Reaper Spirits

| # | Spirit / rung | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-01 | **Senbonzakura** — Shikai Form | 1 | Strikes gain **reach 15**, lose two-hand and twin, hands empty, **ignore cover** between you and target | ❌ | **SB-6.** `Senbonzakura — Shikai` grants `Effect: Senbonzakura — Shikai` at **level 1, unlimited duration, no predicate**. reach-15 and `soulbound:senbonzakura:scattered` are on while sealed. Also: the effect adds reach but never **removes** two-hand/twin as the guide requires, and cover-ignoring is a roll option nothing consumes |
| S-02 | Senbonzakura — Release Technique | 1 | 2 actions, **15-ft emanation**, basic Reflex, 2d6 slashing; area is **difficult terrain for enemies** until start of your next turn; H(+1) +1d6 | ✅ | Cast live at rank 10: 20-ft emanation, basic Reflex **DC 37**, **11d6 slashing** (guide's 11d6 target), 1 Reiatsu Point spent, three enemies auto-targeted, lingering difficult-terrain rider authored |
| S-03 | Senbonzakura — Refined | 9 | Emanation **20 ft**; crit fail → **off-guard** until start of your next turn | ⚠️ | Area 15→20 at L9 confirmed live. The off-guard-on-crit-fail rider is authored and predicated on `self:feature:refined-release` — not yet driven against a real save |
| S-04 | **Senbonzakura Kageyoshi** — Bankai | 13 | Second **20-ft emanation** placed within 60 ft; at the start of each of your turns every enemy in **either** takes **5d6** slashing (basic Reflex) | ❌ | **SB-6.** `Senbonzakura Kageyoshi` grants `Effect: Senbonzakura Kageyoshi` unconditionally at L13, and that effect has `rules: []` |
| S-05 | Bankai — Sustain / move | 13 | Sustain once per round to move the second emanation up to 30 ft **or** switch mode | ☐ | |
| S-06 | Bankai — **Gokei** | 13 | Second emanation becomes a **10-ft burst** on one enemy; **double** damage; no cover or concealment against it | ☐ | |
| S-07 | Bankai — **Senkei** | 13 | 20-ft cage around you and one enemy; neither can leave; your Strikes vs. it ignore **all** resistances; **one extra Strike each round at current MAP**; **you lose reach and cover-ignoring**; can't target anyone outside | ☐ | |
| S-08 | **Zangetsu** — Shikai Form | 1 | Damage die +1 step; gains **two-handed d12** if not already two-handed; **begin every encounter already released, free and no action** | ☐ | |
| S-09 | Zangetsu — **Getsuga Tenshō** | 1 | 2 actions, **30-ft line**, basic Reflex, 2d6 spirit; H(+1) +1d6 | ☐ | |
| S-10 | Zangetsu — Refined **Kuroi Getsuga** | 9 | Line **60 ft**, **ignores resistance to spirit**, crit fail → **1d6 persistent spirit** | ☐ | |
| S-11 | **Tensa Zangetsu** — Bankai | 13 | **No die step** (overrides Full Release); **+10 ft status** to all Speeds; **Flash Step twice per round** | ☐ | |
| S-12 | Tensa Zangetsu — compressed Getsuga | 13 | Getsuga Tenshō becomes **1 action**, line **60 ft** (90 with Refined) | ☐ | |
| S-13 | Tensa Zangetsu — free Step | 13 | First hit each round with the spirit weapon → **Step** as a free action | ☐ | |
| S-14 | **Hyōrinmaru** — Shikai Form | 1 | Damage type becomes **cold** (spirit still selectable); **on a crit, −5 ft status** to target Speeds until end of your next turn | ☐ | |
| S-15 | Hyōrinmaru — **Ryūsenka** | 1 | 2 actions, Strike; hit → +1d6 cold **and** Fortitude or **immobilized** until end of its next turn (Escape vs. Reiatsu DC); crit → +2d6 cold and **off-guard**; H(+2) +1d6 | ☐ | |
| S-16 | Hyōrinmaru — Refined **Guncho Tsurara** | 9 | Ryūsenka may be a **ranged** Strike within 60 ft; the blade returns immediately | ☐ | |
| S-17 | **Daiguren Hyōrinmaru** — Bankai | 13 | **Fly Speed** = Speed; **cold resistance = level** | ☐ | |
| S-18 | Bankai — petal-flowers | 13 | **Three charges**; **once per round** spend one | ☐ | |
| S-19 | Petal — **Sennen Hyōrō** | 13 | **20-ft burst** within 60 ft, Reflex; fail 5d6 cold + **immobilized**; crit fail **restrained 1 minute**; H(+1) +1d6 | ☐ | |
| S-20 | Petal — **Hyōryū Senbi** | 13 | **60-ft line**, basic Reflex, 5d6 cold; fail → **slowed 1** until end of its next turn; H(+1) +1d6 | ☐ | |
| S-21 | Petal — **Zanhyō Ningyō** | 13 | Reaction when hit: reduce damage by **twice your level**; the doll shatters | ☐ | |
| S-22 | Bankai — Perfected | 17 | **Restores one spent petal-flower at the start of each of your turns** | ☐ | |
| S-23 | **Ryūjin Jakka** — Shikai Form | 1 | Damage type **fire**; weapon gains **deadly d8**; **fire resistance = half level** | ☐ | |
| S-24 | Ryūjin Jakka — **Ennetsu Jigoku** | 1 | 2 actions, **15-ft emanation**, basic Reflex, 2d6 fire; fail → **1d4 persistent fire**; H(+1) +1d6, +1 persistent die every **other** increment | ☐ | |
| S-25 | Ryūjin Jakka — Refined | 9 | Emanation **20 ft**; ground inside becomes **difficult terrain** until end of your next turn | ☐ | |
| S-26 | **Zanka no Tachi** — Bankai | 13 | Die **+2 steps**; **you lose your fire resistance**; at the start of each of your turns every creature **other than you** within 30 ft — **allies included** — takes **1d6 fire, no save** | ☐ | |
| S-27 | Aspect — **Higashi** | 13 | Strikes ignore **all** resistances and immunities; a creature you damage **can't regain HP** and its regeneration/fast healing is suppressed until end of your next turn | ☐ | |
| S-28 | Aspect — **Nishi** | 13 | **Fire immunity**; **resistance to all = half level**; a creature that damages you with an unarmed attack, melee weapon or Grapple takes **4d6 fire** | ☐ | |
| S-29 | Aspect — **Minami** | 13 | **20-ft emanation**; enemy ending its turn there: Reflex or **grabbed** by ash-figures (Escape vs. Reiatsu DC); the figures are **not creatures** and take no actions | ☐ | |
| S-30 | Aspect — **Kita** | 13 | 2 actions, once per round, **60-ft line**, basic Reflex, **5d6 fire** that **cannot be reduced by fire resistance, Blut Vene or Hierro**; H(+1) +1d6 | ☐ | The only unresistable damage in the class |
| S-31 | Aspect switching | 13 | **Sustain once per round** to change aspect; the chosen one lasts until another is chosen | ☐ | |
| S-32 | **Kyōka Suigetsu** — Shikai **Kanzen Saimin** | 1 | On Release, and when a creature that can see first observes you released: Will vs. Reiatsu DC or **hypnotized 1 minute** | ☐ | |
| S-33 | Kanzen Saimin — the lie | 1 | Hypnotized creature perceives you **5 ft** from where you stand; its attacks need a **DC 5 flat check**; you are **hidden** from it whenever not adjacent | ☐ | |
| S-34 | Kanzen Saimin — save ladder | 1 | Crit success → immune 24 h · success → immune 10 min · crit fail → hypnotized 1 h **and auto-hypnotized once per encounter thereafter** · **blind creatures unaffected** | ☐ | |
| S-35 | Kyōka Suigetsu — **Shikake** | 1 | 2 actions, 30 ft, Will. Fail: target treats a chosen creature in its reach **as you**, and **you as an ally**, until end of its next turn. Crit fail: 2 rounds. Illusion/mental/visual | ☐ | |
| S-36 | Kyōka Suigetsu — Refined | 9 | Shikai flat check rises to **DC 6**; Shikake's failure also makes the target **off-guard to the misidentified creature** | ☐ | |
| S-37 | **Kanzen Saimin: Sōten Kisshun** — Full Release | 13 | All enemies within **60 ft** who can see you re-attempt the Shikai save, **including the previously immune**; only a **critical hit** ends it; Sustain once per round to force one hypnotized creature to save or be **confused** until the end of its turn | ☐ | ⚠️ extrapolated in the guide |

### 5B — Hollow Spirits

| # | Spirit / rung | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-38 | **Pantera** — Resurrección Form | 1 | Two **claw** unarmed attacks 1d8 S, agile, finesse, brawling; **Speed +10 ft, stacking with Sonido** (40 ft total at 1st) | ☐ | v1.4 §7 |
| S-39 | Pantera — **Garra de la Pantera** | 1 | 2 actions, **30-ft cone**, basic Reflex, 2d6 piercing; area **difficult terrain for enemies** until start of your next turn; H(+1) +1d6 | ☐ | |
| S-40 | Pantera — Refined | 9 | Claws become **1d10**; after Garra you may **Step** as a free action | ☐ | |
| S-41 | **Pantera — Segunda Etapa** | 13 | Speed **+10 more**; claws gain **deadly d10**; once per round a claw crit grants an extra claw Strike at current MAP | ☐ | |
| S-42 | Segunda Etapa — Garra upgrade | 13 | Cone **60 ft**; crit fail → **2d6 persistent bleed** | ☐ | |
| S-43 | **Murciélago** — Resurrección Form | 1 | **Fly Speed** = Speed; weapon becomes **Luz de la Luna** 1d10 P, versatile S, **reach**, re-forms in hand instantly | ☐ | |
| S-44 | Murciélago — **Cero Oscuras** | 1 | 2 actions, 90 ft, **ranged spell attack** with Reiatsu DC proficiency + key attribute, **3d6** spirit, doubled on crit; H(+1) +1d6 | ☐ | |
| S-45 | Murciélago — Refined | 9 | Crit → target **off-guard** until start of your next turn; gains a **5-ft burst** at the target dealing **half** damage to others (basic Reflex) | ☐ | |
| S-46 | **Murciélago — Segunda Etapa** | 13 | Fly **+20 ft**; **resistance to all except spirit = half level**; **Regeneración doubles** and restores lost limbs | ☐ | |
| S-47 | Segunda Etapa — **Lanza del Relámpago** | 13 | 2 actions, once per round, 120 ft; ranged spell attack **5d6 electricity** (doubled on crit); **whether or not you hit**, a **15-ft burst** for **5d6 fire**, basic Reflex; H(+1) +1d6 to both | ☐ | |
| S-48 | **Arrogante** — Resurrección Form | 1 | Weapon becomes **Gran Caída** 1d12 S, two-handed, sweep, forceful; immune to disease, poison, and **doomed never rises past 1** | ☐ | |
| S-49 | Arrogante — **Respira** | 1 | 2 actions, **15-ft emanation**, basic Fortitude, 2d6 void; fail → **enfeebled 1** 1 min; crit fail → **enfeebled 2 + clumsy 1**; **lingers**: 1d6 void, no save, to an enemy entering or ending its turn there until start of your next turn; H(+1) +1d6, lingering +1d6 every **other** increment | ☐ | |
| S-50 | Arrogante — Refined | 9 | Emanation **20 ft**; objects and unattended structures **broken** (already-broken destroyed); crit fail also **can't regain HP** until end of its next turn | ☐ | |
| S-51 | **Respira Absoluta** — Segunda Etapa | 13 | Respira becomes **permanent and free**: a **20-ft emanation**; enemies ending their turn take **3d6 void** (basic Fortitude), **enfeebled 1** 1 round on a failure | ☐ | |
| S-52 | Respira Absoluta — decay | 13 | A creature in the emanation targeting you with an attack or spell must make a **DC 5 flat check** or it has **no effect**; on a success it's temp-immune for 1 minute | ☐ | |
| S-53 | **Los Lobos** — Resurrección Form | 1 | Weapon splits into **two pistols**: 1d6 P, agile, range 60, reload 0, no ammunition, both wieldable; **Speed +5 ft** | ☐ | |
| S-54 | Los Lobos — **Cero Metralleta** | 1 | 2 actions, **60-ft cone** *or* **120-ft line**, basic Reflex, 2d6 force; H(+1) +1d6 | ☐ | |
| S-55 | Los Lobos — Refined | 9 | **Sustain** at the start of your next turn to fire again in a **different direction** with **no** Reiatsu cost | ☐ | |
| S-56 | **Colmillo** — Segunda Etapa | 13 | **Eight wolves** appear within 30 ft; they are **not creatures** — no statistics, no actions, cannot be attacked, do not flank | ☐ | |
| S-57 | Colmillo — the action | 13 | 1 action, requires ≥1 wolf; expend any number; each moves to a point within 60 ft and detonates in a **10-ft burst** for **3d6** force (basic Reflex); **a creature in more than one burst takes only the highest**; H(+1) +1d6 | ☐ | |
| S-58 | Colmillo — regrowth | 13 | **+1 wolf at the start of each of your turns**, max eight | ☐ | |
| S-59 | **Tiburón** — Resurrección Form | 1 | Weapon becomes 1d12 S, two-handed, sweep; **swim Speed** = Speed; breathe water; create water freely | ☐ | |
| S-60 | Tiburón — **La Gota** | 1 | 2 actions, **30-ft cone**, basic Reflex, 2d6 slashing; failures **pushed 10 ft** away; H(+1) +1d6 | ☐ | |
| S-61 | Tiburón — Refined **Cascada** | 9 | Cone **40 ft**; crit fail → **prone**; area becomes **difficult terrain** until start of your next turn | ☐ | |
| S-62 | **Hirviendo** — Segunda Etapa | 13 | **20-ft emanation** of water, difficult terrain for enemies; once per round a spirit-weapon hit **pushes 5 ft**; La Gota may be a **60-ft line** | ☐ | |
| S-63 | Segunda Etapa — **Trident** | 13 | 2 actions, once per round, **three** ranged Strikes at one creature within 60 ft, **MAP does not increase until all three are made** | ☐ | |
| S-64 | Segunda Etapa — **Hirviendo** (free action) | 13 | Once per round: **all water and ice** in the emanation — including other creatures' water/cold terrain — is **destroyed**; each enemy there takes **2d6 fire** | ☐ | |

### 5C — Quincy Spirits

| # | Spirit / rung | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-65 | **Antithesis** — Schrift Form | 1 | Spirit Bow profile granted if absent, die **+1 step**, range increment **100 ft**; gains **Seele Schneider** 1d8 S finesse melee whose Strikes **ignore resistance to slashing** | ☐ | |
| S-66 | Antithesis — Release Technique | 1 | **Reaction**; trigger: you or an ally within 30 ft takes damage from a creature you can see. The **triggering creature takes 2d6 spirit**, and the damaged target gains **resistance = your level** against that damage; H(+2) +1d6 | ☐ | |
| S-67 | Antithesis — Refined **Licht Regen** | 9 | 2 actions, **30-ft cone**, basic Reflex, **6d6** piercing; crit fail → **off-guard** until start of your next turn; base rank 5, H(+1) +1d6 | ☐ | |
| S-68 | **Quincy: Letzt Stil** — Vollständig | 13 | Die **+2 steps**; Strikes ignore **all** resistance to physical and spirit and treat cover one step less, **stacking with Blut Vene** (the one exception to Blut exclusivity) | ☐ | |
| S-69 | Letzt Stil — Licht Regen | 13 | Becomes a **60-ft cone**; **once per round free** | ☐ | |
| S-70 | Letzt Stil — **the cost** | 13 | When it ends you lose **Schrift Form, Release Technique, Licht Regen, Vollständig and your entire pool** until **24 hours of rest** | ☐ | |
| S-71 | **The Heat** — Schrift Form | 1 | Damage type **fire**; **deadly d8**; **fire resistance = half level** | ☐ | |
| S-72 | The Heat — **Burner Finger** | 1 | 2 actions, choose **One–Five**, all for the same single point | ☐ | |
| S-73 | Burner Finger **One** | 1 | 60 ft, one creature, ranged spell attack, **3d6** fire doubled on crit; H(+1) +1d6 | ☐ | |
| S-74 | Burner Finger **Two** | 1 | 60 ft, **two** creatures, **2d6** each; H(+1) +1d6 | ☐ | |
| S-75 | Burner Finger **Three** | 1 | **30-ft line**, basic Reflex, 2d6 fire; H(+1) +1d6 | ☐ | |
| S-76 | Burner Finger **Four** | 1 | **15-ft emanation**, basic Reflex, 2d6 fire; failures take **1d4 persistent fire**; H(+1) +1d6 | ☐ | |
| S-77 | Burner Finger **Five** | 1 | **30-ft cone**, basic Reflex, 2d6 fire; ground **difficult terrain** until start of your next turn; H(+1) +1d6 | ☐ | |
| S-78 | The Heat — Refined **Deeper Burn** | 9 | **All five** options treat your rank as **one higher**; **Five**'s terrain keeps burning until end of your next turn, dealing **2d6 fire** to a creature entering or ending its turn there | ☐ | |
| S-79 | **Deus Ex Machina** — Vollständig | 13 | **Fly Speed** = Speed; **fire immunity**; Burner Finger **Five** becomes a **60-ft cone** | ☐ | |
| S-80 | Deus Ex Machina — persistent | 13 | Once per round, a creature you damage with fire takes **2d6 persistent fire** whose flat check is **DC 20**, not 15 | ☐ | |
| S-81 | **The Balance** — Schrift Form | 1 | Weapon becomes **Freund Schild** 1d8 S, versatile P, **parry**; **+1 circumstance AC while you have ≥1 Reiatsu Point** | ☐ | The bonus must switch **off** at 0 points |
| S-82 | The Balance — Release Technique | 1 | **Reaction**; trigger: you take damage from a creature or effect you can perceive. Reduce it by **twice your level**, then one enemy within 60 ft takes **2d6 spirit** and a **−1 status penalty to saves** until end of its next turn; H(+2) +1d6 | ☐ | |
| S-83 | The Balance — Refined | 9 | Penalty applies to **AC and saves**; if the trigger would drop you to 0 HP you stay at **1 HP** — **once per day** | ☐ | |
| S-84 | **The Balance, at Night** — Vollständig | 13 | Reduction rises to **three times your level** | ☐ | |
| S-85 | At Night — ally redirect | 13 | Once per round an ally's damage within 60 ft may be redirected to you and reduced **as a free action without spending your reaction**, even if your reaction is spent | ☐ | |
| S-86 | At Night — **Sight of the Balance** | 13 | At the start of each of your turns choose an enemy within 60 ft: **−2 status** to its next save, and the next ally attacking it gains **+1 status** to that attack | ☐ | |
| S-87 | **The Thunderbolt** — Schrift Form | 1 | Weapon becomes 1d8 S, versatile P, damage type **electricity**; **electricity resistance = half level**; **Flash Step ignores difficult terrain and may pass through creatures** (not end there) | ☐ | |
| S-88 | The Thunderbolt — **Galvano Blast** | 1 | 2 actions, **60-ft line**, basic Reflex, 2d6 electricity; fail **stunned 1**, crit fail **stunned 2**; **incapacitation**; H(+1) +1d6 | ☐ | |
| S-89 | The Thunderbolt — Refined **Galvano Javelin** | 9 | 90 ft, ranged spell attack, **6d6** electricity doubled on crit, **stunned 1 on a hit** (incapacitation); base rank 5, H(+1) +1d6 | ☐ | |
| S-90 | **Thunderbolt Form** — Vollständig | 13 | **Fly Speed** = Speed; **electricity immunity**; **10-ft emanation** dealing **3d6** electricity (basic Reflex) to a creature ending its turn there | ☐ | |
| S-91 | Thunderbolt Form — arc | 13 | Once per round on a spirit-weapon hit, one other creature within 15 ft of the target takes **3d6** electricity (basic Reflex) | ☐ | |
| S-92 | **The Miracle** — Schrift Form | 1 | Weapon becomes **1d12 slashing, two-handed, forceful, shove**; **max HP + your level**; **+1 circumstance** to saves vs. effects that would reduce you to 0 HP | ☐ | |
| S-93 | The Miracle — **The Miracle** | 1 | **Free action**, trigger: you take damage from an enemy, **once per round**. Gain **2 Miracle points** (max 10) | ☐ | |
| S-94 | Miracle points — resistance | 1 | **Resistance to all damage = current Miracle points** | ☐ | |
| S-95 | Miracle points — spend | 1 | Free action at the start of your turn: spend any number; **+1d6** weapon damage per point until end of turn | ☐ | |
| S-96 | Miracle points — cost and reset | 1 | Costs a Reiatsu Point **only the first time each encounter**; points are **lost when the encounter ends** | ☐ | |
| S-97 | The Miracle — Refined **Blitz of the Hero** | 9 | Max Miracle points **15**; spending grants **+5 ft status** to Speeds per point, **max +20 ft**, until end of turn | ☐ | |
| S-98 | **Bailar de Valquiria** — Vollständig | 13 | **Fast healing = current Miracle points** | ☐ | |
| S-99 | Bailar — the refusal to die | 13 | Reduced to 0 HP with ≥5 Miracle points → stay at **1 HP**, lose 5 points, weapon die **+1 step for the rest of the encounter**; repeatable while points last | ☐ | |
| S-100 | Bailar — uncapped | 13 | Miracle points **no longer capped**, still only **2 per round** | ☐ | |

---

## 6 — Feats (guide §8)

### 6.1 — First level

| # | Feat | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- |
| F-01 | **Additional Kidō** **[SR]** | One more kidō; **up to three times**; Hollow/Quincy cannot take it | ☐ | |
| F-02 | **Sheathed Draw** | On initiative, manifest **and** Release as a **single free action** | ☐ | |
| F-03 | **Reader of Threads** | Recall Knowledge on spirits/haunts/undead with Spirit Lore as a **free action once per round**; +1 extra fact on a success | ☐ | |
| F-04 | **Zanjutsu Footwork** | Crit with the spirit weapon → **Step** as a free action | ☐ | |
| F-05 | **Pesquisa** **[H]** | Spirit Sense to **120 ft**; learn each detected creature's approximate level relative to yours | ☐ | |
| F-06 | **Hirenkyaku Drill** **[Q]** | Flash Step at 1st, **once per encounter** until 3rd | ☐ | |
| F-07 | **Twin Fang** | With twin or agile, the **second Strike each round** reduces MAP by 1 | ☐ | |

### 6.2 — Second and fourth level

| # | Feat | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| F-08 | **Pressure Flare** | 2 | 1 action, enemies within 15 ft: Will vs. Reiatsu DC or **frightened 1**; **once per encounter, no cost** | ☐ | |
| F-09 | **Guard the Threshold** | 2 | Reaction: ally within 15 ft damaged by an **undead, spirit or incorporeal** creature → reduce by **2 + your level** | ☐ | |
| F-10 | **Kidō Focus** | 2 | Spend **1 extra action** on a kidō → target takes **−1 circumstance** to its save | ☐ | |
| F-11 | **Rapid Bala** **[H]** | 2 | Spend 1 extra action to use **Bala** again; both apply and raise MAP normally | ☐ | |
| F-12 | **Gintō Reserve** **[Q]** | 2 | **3 Gintō** at daily preparations; each is a free action to use **Gritz** for **no** Reiatsu Point; unspent are lost at next preparations | ☐ | |
| F-13 | **Shunpo Strike** | 4 | 2 actions: Flash Step then Strike; **doesn't count against Flash Step's frequency** | ☐ | |
| F-14 | **Reiatsu Barrier** | 4 | Reaction when hit: spend 1 point for **resistance = your level** vs. that damage | ☐ | |
| F-15 | **Chain Anchor** | 4 | Crit with the spirit weapon → target **can't Step away** until end of its next turn | ☐ | |
| F-16 | **Deep Breath** | 4 | First **Steady the Breath** each day restores **2** points | ☐ | |
| F-17 | **Cero Doble** **[H]** | 4 | Cero may be a **30-ft cone**; crit fails **pushed 10 ft** away | ☐ | |

### 6.3 — Sixth through twelfth

| # | Feat | Lvl | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- |
| F-18 | **Kidō Combination** | 6 | Free action right after a **destruction** kidō: a **binding** kidō at the same target for **1 fewer point (min 0)**; once per encounter | ☐ | |
| F-19 | **Reactive Strike** | 6 | pf2e's published `Reactive Strike` reaction, automating as-is | ☐ | |
| F-20 | **Cut the Cord** | 6 | Strikes ignore the **first 5 points** of resistance to spirit | ☐ | |
| F-21 | **Borrowed Nature** | 6 | Permanent second Lineage choice; learn its **free cantrip** at no cost; gain **Don the Other Face** | ☐ | |
| F-22 | Don the Other Face | 6 | 1 action, 1 point, **once per encounter**, 1 minute, **−1 status to Will** while on | ☐ | |
| F-23 | Aspect — **Soul Reaper's Discipline** | 6 | Learn **one** kidō permanently; while the Face is on **every kidō you know costs nothing** | ☐ | |
| F-24 | Aspect — **Hollow's Mask** | 6 | Temp HP = **level**; physical resistance = **quarter level** (min 1); **+5 ft status** Speeds | ☐ | |
| F-25 | Aspect — **Quincy's Discipline** | 6 | **Blut** free action once per round, Vene at **quarter** level; ranged Strikes **ignore cover** | ☐ | |
| F-26 | **Blut Discipline** **[Q]** | 6 | Switch Blut as a free action **twice** per round | ☐ | |
| F-27 | **Descorrer** **[H]** | 6 | Once per hour, Garganta: you + up to 5 allies teleport up to **500 ft** to a seen or visited place | ☐ | |
| F-28 | **Rising Tide** | 8 | The first Rising Pressure grant each round also gives **temp HP = half level (min 2)**, until start of your next turn, not stacking with itself | ☐ | |
| F-29 | **Pressure Crush** | 8 | 2 actions, 1 point, **20-ft emanation**, Fortitude; failure → **clumsy 1** and **−5 ft status** Speeds for **1 minute** | ☐ | |
| F-30 | **Zanjutsu: Hakuda** **[SR]** | 8 | **1d6 fist**, agile, finesse, nonlethal; one unarmed Strike may be made as part of **any** Zanjutsu technique | ☐ | |
| F-31 | **Perfected Technique** | 10 | Once per encounter, Release Technique costs **nothing** | ☐ | |
| F-32 | **Ghost Step** | 10 | Flash Step passes through creatures' spaces (not ending there) and **ignores difficult terrain** | ☐ | |
| F-33 | **Reishi Mastery** **[Q]** | 10 | Seal the Art counteract rank **+1**; **free on a critical success** | ☐ | |
| F-34 | **Soul Sever** | 12 | Reducing a creature to 0 HP with the spirit weapon performs **Konsō** as a free action, no check, permanently preventing undeath | ☐ | |
| F-35 | **Kidō Mastery** | 12 | **Destruction** kidō deal **one additional die** of their damage type | ☐ | |
| F-36 | **Segunda Piel Temprana** **[H]** | 12 | Each time you are **critically hit**, Hierro resists **spirit** for 1 round | ☐ | |
| F-37 | **Deeper Crossing** | 12 | Don the Other Face **twice per encounter**; Aspect deepens (2nd kidō + 1 extra destruction die · temp HP 2× level, resistance half level, +10 ft · Vene half level + **one Seal the Art per encounter**) | ☐ | |

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
| F-46 | **Instant Full Release** | 14 | Full Release costs **1 action** | ☐ | |
| F-47 | **Twin Pressure** | 14 | The Full Release emanation's Will save also applies to enemies that **enter** it | ☐ | |
| F-48 | **Vollständig Endurance** **[Q]** | 14 | No fatigue when Vollständig ends; spend 1 point to extend by 1 round, **up to three times** | ☐ | |
| F-49 | **Unbroken Chain** | 16 | While released, spend 1 point to stay at **1 HP** instead of 0; **once per day** | ☐ | |
| F-50 | **Reiatsu Flood** | 16 | Rising Pressure's **per-encounter cap +1** | ☐ | `capFor()` already reads the feat — confirm it pays out a 4th point |
| F-51 | **Beyond the Blade** | 18 | Release Technique dice **+2 steps** (d6→d10, d8→d12) | ☐ | |
| F-52 | **Second Nature** | 18 | The **6th-level** Aspect is always on — no action, no point, no duration, **no Will penalty**; Donning still upgrades to the 12th-level numbers twice per encounter | ☐ | |
| F-53 | **Final Release** | 20 | 3 actions, **once per week**, requires released form | ☐ | See §7 |

---

## 7 — Final Release and Severance (guide §9)

| # | Item | What must happen | Status | Notes |
| :-- | :-- | :-- | :-- | :-- |
| R-01 | **Severance** — duration | **10 rounds**, identical for all fifteen Spirits | ☐ | |
| R-02 | Severance — rider | Spirit-weapon Strikes deal an extra **4d6 spirit** | ☐ | |
| R-03 | Severance — immunities | Immune to **fear and death effects**, and to **frightened** and **doomed** | ☐ | |
| R-04 | Severance — free everything | **No pool**; Release Technique and every kidō cost **nothing** with **no frequency limit** | ☐ | |
| R-05 | Severance — borrowed Full Release | Grants the Spirit's Full Release ability **and its 20-ft emanation**, without spending the daily use and **without fatigue** | ☐ | |
| R-06 | Severance — movement | Speed **+20 ft**; Flash Step **twice per round** | ☐ | |
| R-07 | **Waning** | Severing Art dice = **22 − 2 × round**, rounds 1–7 (20/18/16/14/12/10/8 d6) | ☐ | |
| R-08 | Waning — lockout | The Art **cannot be used** in rounds **8, 9, 10** | ☐ | |
| R-09 | The Art ends Severance | Using it is 2 actions, costs nothing, and **ends Severance whether you want it to or not** | ☐ | |
| R-10 | **The price** | When Severance ends by either route you lose **Released Form, Release Technique, Full Release and your whole pool** until **a week of downtime**; you keep HP, proficiencies, skills, Lineage features and feats | ☐ | |
| R-11 | **Shūkei: Hakuteiken** (Senbonzakura) | One creature in reach, Strike, Waning dice as **slashing**; ignores **all** resistance and immunity; on a hit target **can't regain HP** and regen/fast healing suppressed **1 minute** | ☐ | |
| R-12 | **Mugetsu** (Zangetsu) | **60-ft cone**, basic Reflex, **spirit**; ignores **all** resistance and immunity to spirit | ☐ | |
| R-13 | **Hyōten Hyakkasō** (Hyōrinmaru) | **30-ft emanation**, basic Fortitude, **cold**; failures **restrained** (Escape vs. Reiatsu DC) and **4d6 persistent cold with no flat check** while restrained | ☐ | |
| R-14 | **Ittō Kasō** (Ryūjin Jakka) | **20-ft burst** within 60 ft, basic Reflex, **fire**, Waning dice **+2d6**; ignores fire resistance **and immunity**; failures **can't regain HP 1 minute**, regen/fast healing suppressed; a creature dropped to 0 is **cremated** (10th-rank effect to return) | ☐ | |
| R-15 | Ittō Kasō — **self-cost** | You take damage equal to **half your current HP**, **unpreventable, unreducible, unresistable, unredirectable**, applied **after** the Art resolves | ☐ | |
| R-16 | **Kanzen Saimin: Owari** (Kyōka Suigetsu) | **60-ft emanation**, basic Will, **mental**; failures **confused 1 minute**; crit fail also perceives **its own allies as you** for that minute and **damage cannot shake it loose** | ☐ | |
| R-17 | **Desgarrón** (Pantera) | **60-ft cone**, basic Reflex, **slashing**; failures **4d6 persistent bleed** | ☐ | |
| R-18 | **Cero Oscuras: Ceniza** (Murciélago) | **120-ft line**, basic Reflex, **spirit**; a creature dropped to 0 **crumbles to ash** (10th-rank effect to return) | ☐ | |
| R-19 | **La Hora Final** (Arrogante) | **30-ft emanation**, basic Fortitude, **void**; failures **enfeebled 3** 1 minute and **drained 1** for 24 hours | ☐ | |
| R-20 | **Aullido** (Los Lobos) | **40-ft burst** within 120 ft, basic Reflex, **force**; requires ≥1 wolf; expends **all** wolves and **none regrow this encounter**; with **five or more** spent, crit fails also **prone + stunned 1** | ☐ | |
| R-21 | **Ola Azul** (Tiburón) | **60-ft line**, basic Reflex, **slashing**; failures pushed **30 ft** and **prone**; crit fails pushed **60 ft** | ☐ | |
| R-22 | **Sprenger** (Antithesis) | **20-ft burst** within 60 ft, basic Reflex, **force**; crit fails **restrained 1 minute** (Escape vs. Reiatsu DC) | ☐ | |
| R-23 | **Burning Full Fingers** (The Heat) | **60-ft cone**, basic Reflex, **fire**; failures **4d6 persistent fire** with a **DC 20** flat check | ☐ | |
| R-24 | **The Reckoning** (The Balance) | One creature within 60 ft, basic Fortitude, **spirit**; ignores **all** resistance and immunity; target **doomed 1**, or **doomed 2** if you used your Release Technique **≥3 times this encounter** | ☐ | |
| R-25 | **Electrocution** (The Thunderbolt) | **30-ft emanation**, basic Reflex, **electricity**; failures **stunned 2** (**incapacitation**) | ☐ | |
| R-26 | **Apotheosis** (The Miracle) | **30-ft emanation**, basic Fortitude, **force**; you gain temp HP = **twice your level**; **at the start of your next turn it detonates again for half the Waning dice** | ☐ | |

---

## 8 — Cross-cutting invariants

| # | Invariant | Status | Notes |
| :-- | :-- | :-- | :-- |
| X-01 | No technique or kidō anywhere costs more than **1 Reiatsu Point** | ☐ | |
| X-02 | Release is **not a stance** and does not conflict with stance actions | ☐ | |
| X-03 | Every area/save effect targets correctly and posts per-target rows | ☐ | Needs `pf2e-toolbelt` Target Helper |
| X-04 | Every "at 9th level" widening is granted by **Refined Release**, not by a heightening line | ❌ | **SB-7.** `Refined Release` is one blanket `ItemAlteration` adding **+5 to `area-size` on every `sb-tier-release` item**. Right for Senbonzakura, Ennetsu Jigoku and Respira; wrong for Getsuga Tenshō (should be 30→**60** line), La Gota (30→**40** cone) and Garra de la Pantera, Cero Metralleta and Galvano Blast (whose Refined benefits are **not** area increases at all) |
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
| **SB-10** | C-07 | author's call | Simple and unarmed proficiencies advance with martial |
| **SB-8** | K-18 | minor | Kidō and Techniques post as **Arcane** |
| **SB-9** | S-02 | cosmetic | A Refined technique's card still quotes its pre-Refined area |
| **SB-1** | C-19 | not reproduced | The reported Reiatsu cap of 2 |

### SB-6 — the release ladder is inert *(blocker)*

The class's spine, and the thing all fifteen Spirits hang off.

- **`Release`** (`content/soulbound-class-features/actions/release.json`) has `rules: []` and no module
  flags. It is a chat card and nothing else.
- **`Release.enter()` / `Release.exit()`** in `scripts/soulbound/release.mjs` are called from
  **nowhere**. The only hook the module registers for them is `deleteCombat`, which calls `exit`. The
  state is never entered, only left.
- **`Effect: Released`** exists in the pack with `rules: []` and is never applied to anybody.
- Because nothing gates on a release state, each Spirit's Released Form is granted **permanently, at
  1st level, with unlimited duration** instead. `Senbonzakura — Shikai` has exactly one rule,
  `GrantItem → Effect: Senbonzakura — Shikai`, and that effect's `ItemAlteration` adds `reach-15` to
  the spirit weapon **with no predicate at all**. A sealed 1st-level Senbonzakura has 15-foot reach.
- The same pattern grants **`Effect: Full Release` unconditionally at 13th** and **`Effect:
  Senbonzakura Kageyoshi` unconditionally at 13th**. Both effects have `rules: []` — so the Bankai is
  permanently "on" and does nothing at all.
- A `grep` across `content/soulbound-*` finds **no predicate anywhere** referencing a release state.
- `Modes`, `Charges` and `Hypnosis` — the state machines for Gokei/Senkei, Zanka no Tachi's four
  aspects, Hyōrinmaru's petal-flowers and Kyōka Suigetsu's hypnosis — register **no hooks at all** and
  are reachable only from `game.modules.get("isaacs-hb-pf2e").api`.

**Why the rig missed it.** `rig.mjs` asserts that items *arrive* — `hasFeature(actor, "Full Release")`,
`full.system.frequency.max === 1`. Arriving is exactly what these do. The rig never performs an action.

**The fix is a design decision, not a patch**, because it sets the pattern for all fifteen Spirits: the
Released-Form effects have to move off the class features and onto the `Release` action (a `riders`
entry with `event: "action-used"` — the machinery `Pressure Flare` and `Seal the Art` already use),
`Effect: Released` and `Effect: Full Release` need their rules written, and every Release Technique
needs a requirement predicated on the state. **Worth agreeing the shape before building it.**

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

### SB-10 — simple and unarmed proficiency *(a call for the author, not a bug)*

Observed across L1–20: `simple` and `unarmed` track `martial` exactly — Expert at 5, Master at 13.
Guide §2's ledger buys `Attack — Unarmed T@1 = 10` and `Attack — Simple T@1 = 10`, and §10.1's
comparison lists only "Martial E@5 → M@13". Advancing all three to Master costs **320 more BCS points**
than the 2100 the ledger balances to.

It is also what every published martial does, and holding simple at Trained would make
`Zanjutsu: Hakuda`'s fist and `Shō`'s attribute-adding filler feel odd. **Two honest options:** change
the module to match the ledger, or change the ledger to match PF2e convention and find the 320 points
elsewhere. This one is yours to decide.

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
