// What a merged ticket really holds: one problem per fix. causes.ts sorts by tenant and channel;
// this adds what only reading the body tells, the reports the desk read as a one-day move.
import { groupByCause, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

// `shift`: the date moves back one day. Month and day are not swapped, so neither cause fits.
export type Problem = CauseGroup['cause'] | 'shift';

export type ProblemGroup = Omit<CauseGroup, 'cause'> & { problem: Problem };

export function groupByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const moved = reports.filter((r) => oneDayMove.includes(r.id));
  const rest = reports.filter((r) => !oneDayMove.includes(r.id));
  const groups: ProblemGroup[] = groupByCause(rest, tenantOf).map(({ cause, ...g }) => ({ ...g, problem: cause }));
  // Grouped with no tenant, so all of them land in one group.
  if (moved.length) groups.push(...groupByCause(moved, () => undefined).map(({ cause, ...g }) => ({ ...g, problem: 'shift' as const })));
  return groups.sort((a, b) => b.reports.length - a.reports.length);
}

// How many reports intake tagged with a cause other than the one they have.
export function mistagged(g: ProblemGroup): number {
  return g.reports.length - (g.taggedAs[g.problem] ?? 0);
}

export function channels(g: ProblemGroup): Record<Report['channel'], number> {
  return g.reports.reduce((n, r) => ({ ...n, [r.channel]: n[r.channel] + 1 }), { app: 0, email: 0, form: 0 });
}
