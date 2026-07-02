// Formats a numeric amount as Sri Lankan Rupees, e.g. 2400 -> "Rs 2,400.00".
// Values are shown as-is from the backend/database (no currency conversion).
export function formatLKR(value) {
  const n = Number(value) || 0;
  return `Rs ${n.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
