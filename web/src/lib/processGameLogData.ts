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

const DAMAGE_REGEX =
  /^.*?(\*{3}\s*DEMOLISHES\s*\*{3}|\*{3}\s*DEVASTATES\s*\*{3}|={3}\s*OBLITERATES\s*={3}|>{3}\s*ANNIHILATES\s*<{3}|<{3}\s*ERADICATES\s*>{3}|\b(?:misses|wounds|MUTILATES|scratches|mauls|DISEMBOWELS|grazes|decimates|DISMEMBERS|hits|devastates|MASSACRES|injures|maims|MANGLES)\b)(?=\s+(?:you|[A-Z][A-Za-z'-]+|a|an|the)\b.*[!.]?$)/;

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

