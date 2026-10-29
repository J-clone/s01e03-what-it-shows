<img src="assets/icon.svg" width="64" height="64" alt="">

# S01E03 what it shows

MEGA.dev Challenge S01E03. The support desk merged 412 reports about wrong dates into one ticket,
#4471, and marked it known. They describe three separate problems.

| problem | reports | ticket | state |
|---|---|---|---|
| `parser`: day-first dates read month first | 379 | [#1](https://github.com/J-clone/s01e03-what-it-shows/issues/1) | fixed |
| `hint`: booking-v3 form prints `MM/DD/YYYY` to day-first tenants | 33 | [#2](https://github.com/J-clone/s01e03-what-it-shows/issues/2) | won't fix, form retired |
| `shift`: off by a day or a time zone, no swap | 5 | [#3](https://github.com/J-clone/s01e03-what-it-shows/issues/3) | open |

Counts follow the desk's own view: the 5 `shift` reports also count under `parser`, where the desk
files them by tenant.

## The kb page

- Source: [`support-kb/src/routes/kb/incidents/4471-problems/+page.svx`](support-kb/src/routes/kb/incidents/4471-problems/+page.svx)
- The logic behind it: [`support-kb/src/lib/kb/problems.ts`](support-kb/src/lib/kb/problems.ts) and [`ProblemTable.svelte`](support-kb/src/lib/kb/ProblemTable.svelte)
- As the desk sees it: [`support-kb/build/kb/incidents/4471-problems.html`](support-kb/build/kb/incidents/4471-problems.html), and a screenshot, [`support-kb/rendered/4471-problems.png`](support-kb/rendered/4471-problems.png)

The page is signed `J-clone`, desk ref `DR-9J5P-6K81`.

## Build

```sh
cd support-kb
npm install
npm run build   # writes build/
```

`support-kb/` is the kb export `kb-export-267efc5e.zip`, unchanged in the first commit. The build
setup (`package.json`, `svelte.config.js`, `vite.config.js`, `src/app.html`,
`src/routes/+layout.js`) was added so the pages render.
