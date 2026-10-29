// What a merged ticket really holds: one problem per fix. causes.ts sorts by tenant and channel;
// this adds what only reading the body tells, the reports the desk read as a one-day move.
import { groupByCause, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

// `shift`: the date is off by a day or a time zone. Month and day are not swapped.
export type Problem = CauseGroup['cause'] | 'shift';

export type ProblemGroup = Omit<CauseGroup, 'cause'> & { problem: Problem };

// The desk's own view, one group per cause, plus `shift` for the one-day moves. Like the desk, a
// one-day move stays counted where it is filed (footnote it with readAs), and counts under `shift`.
export function groupByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const moved = reports.filter((r) => oneDayMove.includes(r.id));
  const groups: ProblemGroup[] = groupByCause(reports, tenantOf).map(({ cause, ...g }) => ({ ...g, problem: cause }));
  // Grouped with no tenant, so all of them land in one group.
  if (moved.length) groups.push(...groupByCause(moved, () => undefined).map(({ cause, ...g }) => ({ ...g, problem: 'shift' as const })));
  return groups;
}

// How many reports intake tagged with a cause other than the one they have.
export function mistagged(g: ProblemGroup): number {
  return g.reports.length - (g.taggedAs[g.problem] ?? 0);
}

export function channels(g: ProblemGroup): Record<Report['channel'], number> {
  return g.reports.reduce((n, r) => ({ ...n, [r.channel]: n[r.channel] + 1 }), { app: 0, email: 0, form: 0 });
}
