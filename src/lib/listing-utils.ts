export function formatPrice(price, unit) {
  // يعرض: "5.0 م دج" أو "500 ألف دج"
  if (price >= 1_000_000) return `${(price/1_000_000).toFixed(1)} م ${unitLabel}`;
  if (price >= 1_000) return `${(price/1_000).toFixed(0)} ألف ${unitLabel}`;
  return `${price.toLocaleString("ar-DZ")} ${unitLabel}`;
}
