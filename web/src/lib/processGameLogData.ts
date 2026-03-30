export type DamageTotals = {
  actor: string;
  given: number;
  taken: number;
};

type LineContext = {
  lineNumber: number;
  damageTotals: Map<string, { given: number; taken: number }>;
};

type LineProcessResult = {
  html: string;
};

type LineProcessor = (input: {
  rawLine: string;
  currentHtml: string;
  ctx: LineContext;
}) => LineProcessResult;

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export type DamageToken = {
  token: string;
  minDamage: number | null;
  maxDamage: number | null;
};

// Single source of truth for damage tokens + their damage ranges.
// minDamage/maxDamage are placeholders for now; fill them as you determine the mapping.
export const DAMAGE_TOKENS: readonly DamageToken[] = [
  { token: 'misses', minDamage: 0, maxDamage: 0 },
  { token: 'scratches', minDamage: 1, maxDamage: 1 },
  { token: 'grazes', minDamage: 1, maxDamage: 1 },
  { token: 'hits', minDamage: 1, maxDamage: 1 },
  { token: 'injures', minDamage: 1, maxDamage: 1 },
  { token: 'wounds', minDamage: 1, maxDamage: 1 },
  { token: 'mauls', minDamage: 1, maxDamage: 1 },
  { token: 'decimates', minDamage: 1, maxDamage: 1 },
  { token: 'devastates', minDamage: 1, maxDamage: 1 },
  { token: 'maims', minDamage: 1, maxDamage: 1 },
  { token: 'MUTILATES', minDamage: 1, maxDamage: 1 },
  { token: 'DISEMBOWELS', minDamage: 1, maxDamage: 1 },
  { token: 'DISMEMBERS', minDamage: 1, maxDamage: 1 },
  { token: 'MASSACRES', minDamage: 1, maxDamage: 1 },
  { token: 'MANGLES', minDamage: 1, maxDamage: 1 },
  { token: '***DEMOLISHES***', minDamage: 1, maxDamage: 1 },
  { token: '***DEVASTATES***', minDamage: 1, maxDamage: 1 },
  { token: '===OBLITERATES===', minDamage: 1, maxDamage: 1 },
  { token: '>>>ANNIHILATES<<<', minDamage: 1, maxDamage: 1 },
  { token: '<<<ERADICATES>>>', minDamage: 1, maxDamage: 1 },
  { token: 'does UNSPEAKABLE things to', minDamage: 500, maxDamage: 750 },
] as const;

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenToDamageRegexPart(token: string) {
  // Allow optional spaces inside marker tokens (e.g. "*** DEMOLISHES ***").
  const star = token.match(/^\*{3}([A-Z]+)\*{3}$/);
  if (star) return String.raw`\*{3}\s*${escapeRegExp(star[1])}\s*\*{3}`;

  const eq = token.match(/^={3}([A-Z]+)={3}$/);
  if (eq) return String.raw`={3}\s*${escapeRegExp(eq[1])}\s*={3}`;

  const rAngle = token.match(/^>{3}([A-Z]+)<{3}$/);
  if (rAngle) return String.raw`>{3}\s*${escapeRegExp(rAngle[1])}\s*<{3}`;

  const lAngle = token.match(/^<{3}([A-Z]+)>{3}$/);
  if (lAngle) return String.raw`<{3}\s*${escapeRegExp(lAngle[1])}\s*>{3}`;

  // Normal word token.
  return String.raw`\b${escapeRegExp(token)}\b`;
}

const DAMAGE_TOKEN_PARTS = DAMAGE_TOKENS.map((d) => tokenToDamageRegexPart(d.token));

const DAMAGE_EVENT_REGEX = new RegExp(
  String.raw`^\s*(.+?)\s+(${DAMAGE_TOKEN_PARTS.join('|')})\s+((?:you|[A-Z][A-Za-z'-]+|a|an|the)\b.*?)[!.]?$`
);

function normalizeDamageTokenForLookup(token: string) {
  // Marker tokens are allowed to contain optional spaces; normalize by stripping spaces.
  if (/[=<>*]/.test(token)) return token.replace(/\s+/g, '');
  return token;
}

const DAMAGE_TOKEN_BY_TOKEN = new Map<string, DamageToken>(
  DAMAGE_TOKENS.map((t) => [normalizeDamageTokenForLookup(t.token), t])
);

function normalizeActor(rawActor: string) {
  const trimmed = rawActor.trim();
  if (!trimmed) return trimmed;

  const youMatch = trimmed.match(/^(you|your)\b/i);
  if (youMatch) return 'you';

  // If the actor starts with a possessive name, strip the "'s" suffix.
  // Examples: "Rae's flaming blade", "Malgor's poisonous bite"
  const possessiveMatch = trimmed.match(/^([A-Z][A-Za-z'-]+)'s\b/);
  if (possessiveMatch) return possessiveMatch[1];

  // Common forms: "Malgor's poisonous bite", "Marijna", "A huge barbarian"
  const nameMatch = trimmed.match(/^([A-Z][A-Za-z'-]+)(?:'s)?\b/);
  if (nameMatch) return nameMatch[1];

  return trimmed;
}

function normalizeTarget(rawTarget: string) {
  const trimmed = rawTarget.trim().replace(/[!.]+$/, '').trim();
  if (!trimmed) return trimmed;

  if (/^(you|your)\b/i.test(trimmed)) return 'you';

  // If the target starts with a possessive name, strip the "'s" suffix.
  const possessiveMatch = trimmed.match(/^([A-Z][A-Za-z'-]+)'s\b/);
  if (possessiveMatch) return possessiveMatch[1];

  return trimmed;
}

function isCountableEntity(name: string) {
  if (name === 'you') return true;
  if (/^(A|An|The)\b/.test(name)) return false;
  return /^[A-Z]/.test(name);
}

function getDamageEvent(rawLine: string) {
  const match = rawLine.match(DAMAGE_EVENT_REGEX);
  if (!match || typeof match.index !== 'number') return null;

  const rawActor = match[1] ?? '';
  const rawToken = match[2] ?? '';
  const rawTarget = match[3] ?? '';
  if (!rawActor || !rawToken || !rawTarget) return null;

  const tokenIndex = rawLine.indexOf(rawToken, match.index);
  if (tokenIndex < 0) return null;

  const actor = normalizeActor(rawActor);
  const target = normalizeTarget(rawTarget);
  if (!actor || !target) return null;

  const damageToken = DAMAGE_TOKEN_BY_TOKEN.get(normalizeDamageTokenForLookup(rawToken));
  if (!damageToken || damageToken.minDamage == null || damageToken.maxDamage == null) return null;

  const avg = (damageToken.minDamage + damageToken.maxDamage) / 2;

  return {
    actor,
    target,
    token: rawToken,
    tokenIndex,
    damageToken,
    avg,
  };
}

export const colorDamage: LineProcessor = ({ rawLine }) => {
  const ev = getDamageEvent(rawLine);
  if (!ev) return { html: escapeHtml(rawLine) };

  const before = rawLine.slice(0, ev.tokenIndex);
  const after = rawLine.slice(ev.tokenIndex + ev.token.length);

  return {
    html:
      escapeHtml(before) +
      `<span class="text-red-500 font-semibold">${escapeHtml(ev.token)}</span>` +
      escapeHtml(after),
  };
};

export const countDamageTotals: LineProcessor = ({ rawLine, currentHtml, ctx }) => {
  const ev = getDamageEvent(rawLine);
  if (!ev) return { html: currentHtml };

  // Ignore entities that don't start with a capital letter (except normalized buckets).
  if (!isCountableEntity(ev.actor) || !isCountableEntity(ev.target)) {
    return { html: currentHtml };
  }

  const actorTotals = ctx.damageTotals.get(ev.actor) ?? { given: 0, taken: 0 };
  actorTotals.given += ev.avg;
  ctx.damageTotals.set(ev.actor, actorTotals);

  const targetTotals = ctx.damageTotals.get(ev.target) ?? { given: 0, taken: 0 };
  targetTotals.taken += ev.avg;
  ctx.damageTotals.set(ev.target, targetTotals);

  return { html: currentHtml };
};

// Capture from the first quote to the last quote on the line (greedy),
// so contractions like "I'll" don't prematurely end the match.
const COMM_SAYS_REGEX = /^.*?\bsays,\s+('.*')$/;
const COMM_YELLS_REGEX = /^.*?\byells,\s+('.*')$/;
const COMM_TELLS_GROUP_REGEX = /^.*?\btells the group,\s+('.*')$/;

function applyQuotedHighlight(input: {
  rawLine: string;
  regex: RegExp;
  className: string;
}) {
  const match = input.rawLine.match(input.regex);
  if (!match || typeof match.index !== 'number') return null;

  const quoted = match[1] ?? '';
  if (!quoted) return null;

  const quotedIndex = input.rawLine.indexOf(quoted, match.index);
  if (quotedIndex < 0) return null;

  const before = input.rawLine.slice(0, quotedIndex);
  const after = input.rawLine.slice(quotedIndex + quoted.length);

  return (
    escapeHtml(before) +
    `<span class="${input.className}">${escapeHtml(quoted)}</span>` +
    escapeHtml(after)
  );
}

export const colorComm: LineProcessor = ({ rawLine, currentHtml }) => {
  // If an earlier rule already produced markup, don't try to re-process this line.
  if (currentHtml !== escapeHtml(rawLine)) return { html: currentHtml };

  const saysHtml = applyQuotedHighlight({
    rawLine,
    regex: COMM_SAYS_REGEX,
    className: 'text-yellow-300',
  });
  if (saysHtml) return { html: saysHtml };

  const yellsHtml = applyQuotedHighlight({
    rawLine,
    regex: COMM_YELLS_REGEX,
    className: 'text-cyan-400',
  });
  if (yellsHtml) return { html: yellsHtml };

  const tellsGroupHtml = applyQuotedHighlight({
    rawLine,
    regex: COMM_TELLS_GROUP_REGEX,
    className: 'text-fuchsia-500',
  });
  if (tellsGroupHtml) return { html: tellsGroupHtml };

  return { html: currentHtml };
};

export function processGameLogData(input: { text: string; pipeline?: LineProcessor[] }) {
  const pipeline = input.pipeline ?? [colorDamage, colorComm, countDamageTotals];
  const damageTotals = new Map<string, { given: number; taken: number }>();

  const lines = input.text.split(/\r?\n/);
  const processedLines = lines.map((rawLine, i) => {
    const ctx: LineContext = { lineNumber: i + 1, damageTotals };

    let current: LineProcessResult = { html: escapeHtml(rawLine) };
    for (const processor of pipeline) {
      current = processor({ rawLine, currentHtml: current.html, ctx });
    }

    return current.html;
  });

  return {
    html: processedLines.join('\n'),
    damageTotals: Array.from(damageTotals.entries()).map(([actor, totals]) => ({
      actor,
      given: totals.given,
      taken: totals.taken,
    })),
  };
}

