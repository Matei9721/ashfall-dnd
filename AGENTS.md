# Repository constitution

## What this repo is

Ashfall is a dependency-free, at-the-table DM site for one original D&D campaign. Keep it quick to open, easy to use during a session, and safe to show to players when the spoiler shield is on.

## Sources of truth

- `Ashfall_DM_Campaign_Guide_v6.docx` is the current source for campaign-guide text and canon.
- `content.js` is generated from that guide by `scripts/build_site.py`. Do not edit it by hand.
- Keep `Ashfall_DM_Campaign_Guide_v5.docx` as the previous version. Do not overwrite or delete it.
- `index.html`, `styles.css`, and `app.js` are the hand-edited site files.

## Working rules

- Keep the app plain HTML, CSS, and JavaScript unless the user asks for a framework or build system.
- Use relative asset paths so the app works locally and under the repository's GitHub Pages path.
- Preserve existing campaign canon, wording, spoiler boundaries, and player-safe views. Discuss substantial story or character changes before making them.
- Preserve the browser storage and Export/Import behaviour. Do not silently clear or replace a DM's saved session state.
- After changing the DOCX, run `python scripts/build_site.py` and review the generated `content.js` in the same change.
- Do not commit, push, publish, or change remote repository settings unless the user explicitly asks.

## Checks

- Run `node --check app.js` and `node --check content.js` after JavaScript changes.
- Run `git diff --check` before handing work back.
- For visible app changes, serve the repo over localhost and check both desktop and a narrow mobile viewport. Check the console, navigation, spoiler shield, and saved tracker behaviour relevant to the change.
