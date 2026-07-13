export function removeTrailingHeadingPeriod(value) {
  return typeof value === "string" ? value.replace(/\.\s*$/, "") : value;
}
