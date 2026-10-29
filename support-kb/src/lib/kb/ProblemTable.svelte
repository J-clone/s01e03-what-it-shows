<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { channels, groupByProblem, mistagged, type Problem } from '#lib/kb/problems';
  import { tenantOf } from '#lib/kb/locales';

  // `filed`: the issue number each problem has now in `repo` (owner/name on GitHub).
  let { ticket, repo, filed = {} }: { ticket: number; repo: string; filed?: Partial<Record<Problem, number>> } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByProblem(merged, tenantOf, notes.oneDayMove));
  const ways = (g: (typeof groups)[number]) =>
    Object.entries(channels(g))
      .filter(([, n]) => n)
      .map(([c, n]) => `${c} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>came in by</th><th>tenants</th><th>seen</th><th>intake tagged it wrong</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const issue = filed[g.problem]}
      <tr class:open={!issue}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td class="small">{ways(g)}</td>
        <td>{g.tenants}</td>
        <td class="small">{g.firstSeen} → {g.lastSeen}</td>
        <td>{mistagged(g)}</td>
        <td>{#if issue}<a href="https://github.com/{repo}/issues/{issue}">{repo}#{issue}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.problem)}
  {@const moved = g.problem === 'shift' ? 0 : g.reports.filter((r) => notes.oneDayMove.includes(r.id)).length}
  {#if moved}
    <p class="small">{moved} of the <code>{g.problem}</code> reports read as a one-day move: counted under <code>{g.problem}</code>, where the desk files them by tenant, and under <code>shift</code>.</p>
  {/if}
{/each}

{#each groups as g (g.problem)}
  <details>
    <summary><code>{g.problem}</code>: the {g.reports.length} reports</summary>
    <p class="ids">{g.reports.map((r) => r.id).sort().join(' ')}</p>
  </details>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .small { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
  .ids { font: 0.8rem var(--mono); color: var(--muted); }
</style>
