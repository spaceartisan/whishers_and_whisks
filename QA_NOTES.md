# v1.34 Quality Checks

Source baseline: user-uploaded `whishers_and_whisks-main.zip`.

## Automated checks

- `node --check game.js` — passed.
- `node tests/save-compatibility.test.cjs` — 0 failures.
- HTML duplicate ID validation — 0 duplicates.
- CSS syntax validation using tinycss2 — 0 parse errors.
- Local HTML assets referenced by `<script>` and `<link>` — present.
- `accessory_positions.json`, `baker_paw_positions.json`, `william_de_crow_dialogue.json`, and all five accessory PNGs — identical to the uploaded baseline.
- ZIP archive CRC/integrity verified.

## Save compatibility approach

The localStorage key is unchanged: `whiskersAndWhisksSaveV1`. No saved fields were renamed, and the newer schema adds only compatible metadata. Older and sparse saves receive defaults for missing keys. Progressed saves retain coins, bakes, friendships, achievements, owned cosmetics, equipment, fishing, slots, William activity, and petting totals. The original raw save is backed up locally before upgrading its schema. Save JSON import/export is also available in the Book.

## Manual testing still recommended

The sandbox Chromium browser blocks local-site navigation by policy, so genuine rendered gameplay screenshots and iOS sound verification could not be performed in this environment. Please check the iPhone-installed PWA after deploying, especially portrait scrolling, touch input, audio, and an actual upgraded save. The automated checks do **not** prove that all layouts work visually on every device.
