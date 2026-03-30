type LineContext = {
  lineNumber: number;
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

export type DamageType = {
  token: string;
  minDamage: number | null;
  maxDamage: number | null;
};

// Single source of truth for damage tokens + their damage ranges.
// minDamage/maxDamage are placeholders for now; fill them as you determine the mapping.
export const DAMAGE_TYPES: readonly DamageType[] = [
  { token: 'misses', minDamage: null, maxDamage: null },
  { token: 'wounds', minDamage: null, maxDamage: null },
  { token: 'MUTILATES', minDamage: null, maxDamage: null },
  { token: '***DEMOLISHES***', minDamage: null, maxDamage: null },
  { token: 'scratches', minDamage: null, maxDamage: null },
  { token: 'mauls', minDamage: null, maxDamage: null },
  { token: 'DISEMBOWELS', minDamage: null, maxDamage: null },
  { token: '***DEVASTATES***', minDamage: null, maxDamage: null },
  { token: 'grazes', minDamage: null, maxDamage: null },
  { token: 'decimates', minDamage: null, maxDamage: null },
  { token: 'DISMEMBERS', minDamage: null, maxDamage: null },
  { token: '===OBLITERATES===', minDamage: null, maxDamage: null },
  { token: 'hits', minDamage: null, maxDamage: null },
  { token: 'devastates', minDamage: null, maxDamage: null },
  { token: 'MASSACRES', minDamage: null, maxDamage: null },
  { token: '>>>ANNIHILATES<<<', minDamage: null, maxDamage: null },
  { token: 'injures', minDamage: null, maxDamage: null },
  { token: 'maims', minDamage: null, maxDamage: null },
  { token: 'MANGLES', minDamage: null, maxDamage: null },
  { token: '<<<ERADICATES>>>', minDamage: null, maxDamage: null },
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

const DAMAGE_TOKEN_PARTS = DAMAGE_TYPES.map((d) => tokenToDamageRegexPart(d.token));

const DAMAGE_REGEX = new RegExp(
  String.raw`^.*?(${DAMAGE_TOKEN_PARTS.join('|')})(?=\s+(?:you|[A-Z][A-Za-z'-]+|a|an|the)\b.*[!.]?$)`
);

export const colorDamage: LineProcessor = ({ rawLine }) => {
  const match = rawLine.match(DAMAGE_REGEX);
  if (!match || typeof match.index !== 'number') {
    return { html: escapeHtml(rawLine) };
  }

  const token = match[1] ?? '';
  if (!token) return { html: escapeHtml(rawLine) };

  const tokenIndex = rawLine.indexOf(token, match.index);
  if (tokenIndex < 0) return { html: escapeHtml(rawLine) };

  const before = rawLine.slice(0, tokenIndex);
  const after = rawLine.slice(tokenIndex + token.length);

  return {
    html:
      escapeHtml(before) +
      `<span class="text-red-500 font-semibold">${escapeHtml(token)}</span>` +
      escapeHtml(after),
  };
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
  const pipeline = input.pipeline ?? [colorDamage, colorComm];

  const lines = input.text.split(/\r?\n/);
  const processedLines = lines.map((rawLine, i) => {
    const ctx: LineContext = { lineNumber: i + 1 };

    let current: LineProcessResult = { html: escapeHtml(rawLine) };
    for (const processor of pipeline) {
      current = processor({ rawLine, currentHtml: current.html, ctx });
    }

    return current.html;
  });

  return {
    html: processedLines.join('\n'),
  };
}

