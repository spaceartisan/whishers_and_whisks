# Whiskers & Whisks

A small, cozy, single-player cat bakery game designed for phones and static hosting.

## Play locally

Open `index.html` in a browser, or serve the folder with any simple static web server.

## GitHub Pages

Upload the contents of this folder to a GitHub repository and enable GitHub Pages for the branch/folder containing `index.html`. No build step or server is required.

## Save data

Progress is stored locally in the browser using `localStorage`.

## v1.1 tactile recipe update

Recipes can now define their own preparation flow. Bread and cinnamon rolls include a tap-to-knead step, strawberry pie includes a paw-press crust step, and the baker cat's paws are visible throughout more of the baking interactions.


## Developer console

For testing progression, open the browser developer console and run `giveGold(9999)`. The value is saved immediately to the normal local save.

- Equipment levels can be purchased in the Gear shop tab; each level permanently increases coin payouts from served recipes.

## v1.6 Lucky Cat Slots

A Lucky Cat casino screen adds a three-reel slot machine using bakery coins. Bets of 5, 10, or 25 coins are available; matching pairs return the wager and three-of-a-kind awards symbol-specific multipliers up to a 50× crown jackpot.

## v1.7 Vacation Lake

Vacation mode adds a calm fishing loop. Casting consumes one bait, fish can be reeled in without a failure timer, and catches pay bakery coins. Rod upgrades unlock progressively rarer fish, reel upgrades increase catch value and shorten the wait for a bite, and bait can be purchased in 1-, 5-, or 20-piece packs.


## Relax mode

The **Quiet Corner** is a zero-pressure petting mode. Drag gently across the lounging cat to pet them. The cat responds with small animations, heart reactions, and a soft purr while touched. There are deliberately no rewards, scores, timers, or progression attached to this mode.


## Mobile compatibility

The layout is iPhone-first but includes Android Chrome viewport, touch, safe-area, and narrow-screen compatibility handling.

- Vacation Lake now tracks a persistent Top 3 Biggest Fish leaderboard by catch weight.

## v1.12 Pantry & Bake Quality

The Cozy Shop now has a **Pantry** tab. Biscuit the shop cat gives free Pantry Basics when petted, while four paid ingredient grades can be stocked in bake baskets. Each completed recipe consumes one basket of the selected grade. Better ingredients increase recipe payouts, grant more friendship, and add a quality bonus to the final bake roll.

Bake results now have five bakery-themed quality levels: **Homey**, **Cozy**, **Fancy**, **Purrfect**, and **Cat's Meow**. Higher-quality results add an additional coin multiplier and are recorded with the bake in the recipe book. Existing saves automatically receive five Pantry Basics baskets.


## v1.15 desktop scrolling

Shop and Recipe Book now use their own scrollable content areas on short desktop windows. The Shop category strip also supports horizontal scrolling and shows a thin horizontal scrollbar for mouse/desktop users while remaining swipe-friendly on phones.


## Manual baker layout editing

Accessory placement is controlled by `accessory_positions.json`. Each accessory has an `x` and `y` value in pixels relative to the baker cat wrapper:

- Increase `x` to move the accessory right; decrease it to move left.
- Increase `y` to move the accessory down; decrease it to move up.
- Save the JSON file and reload the page to see the change. The game requests this file with browser caching disabled, which makes localhost tuning easier.

The baker's two front paws are controlled the same way in `baker_paw_positions.json`. Its `left` and `right` entries use `x` and `y` pixels relative to the baker body.

The accessory artwork is no longer drawn in CSS. Editable transparent PNGs live in `assets/accessories/`:

- `chef.png`
- `bow.png`
- `flower.png`
- `glasses.png`
- `crown.png`

They are 128×128 transparent canvases. Keep the same filenames when replacing them. Keeping the 128×128 canvas is recommended so the existing in-game sizing stays predictable. The Shop accessory icons use these same PNGs, so artwork edits show there too.


## Accessory placement and size

Edit `accessory_positions.json` to tune each baker accessory without touching CSS or JavaScript. Each accessory supports `x`, `y`, and `scale`. Increasing `x` moves it right, increasing `y` moves it down, and increasing `scale` makes the PNG larger (`1.0` normal, `1.5` 50% larger, `2.0` double size). Refresh the locally served page after saving.


## v1.22 additions
- Relax mode now mirrors the currently equipped bakery decor theme.
- Added William de Crow mode, a no-pressure friend hangout with interactive crow reactions, crumb sharing, and shiny-object moments.
- Bottom navigation now includes the Crow mode.
## William de Crow dialogue

William's tap dialogue is stored in `william_de_crow_dialogue.json`. The current bank contains 475 simple crow/bakery jokes and 25 statistics/DOE comments. The game explicitly uses `stats_probability: 0.05`, so the statistics comments remain about 5% even if you add or remove lines later.



### William de Crow dance
The Crow mode includes a Dance button that runs a roughly 15-second cat-and-crow dance animation, then returns both characters to idle automatically.


## v1.26 Book activity records
The Recipe Book now also records side-activity totals: slot spins, actual slot wins, fish caught, items given to William, items received from William, William dance parties, and the number of times William has delivered one of his statistics/DOE comments. Existing saves keep their prior slot-spin and fish-catch totals; the newly introduced William/slot-win counters begin at zero and accumulate from this version forward.


## v1.28 Relax records and naming
Relax mode now allows the lounging cat to be given a custom persistent name. The Recipe Book records both the number of Relax petting sessions and the cumulative amount of active time spent petting the cat. Petting time is committed to the local save whenever a petting session ends or the page is hidden.


## v1.28 Achievements
The Book now includes a persistent achievement system with more than 50 milestones spanning baking, friendship, shopping, slots, fishing, Relax mode, William de Crow, and cross-mode play. Existing saves are evaluated retroactively where the necessary counters already exist.
