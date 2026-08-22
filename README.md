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

