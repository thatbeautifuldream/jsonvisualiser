const JSON_UNESCAPE_SEQUENCES: Record<string, string> = {
  b: "\b",
  f: "\f",
  n: "\n",
  r: "\r",
  t: "\t",
  '"': '"',
  "\\": "\\",
};

const JSON_UNESCAPE_PATTERN = /\\([bfnrt"\\])/g;

export function unescapeJsonText(input: string) {
  let replacementCount = 0;

  const value = input.replace(JSON_UNESCAPE_PATTERN, (_, sequence: string) => {
    replacementCount += 1;
    return JSON_UNESCAPE_SEQUENCES[sequence] ?? _;
  });

  return {
    value,
    replacementCount,
  };
}
