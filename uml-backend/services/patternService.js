export function detectPatterns(text) {
  if (!text) return [];

  const patterns = [];

  const cleanText = text.toLowerCase();

  // 🔥 STRONG DETECTION RULES

  // Factory
  if (
    cleanText.includes("factory") ||
    cleanText.includes("create") ||
    cleanText.includes("paymentfactory")
  ) {
    patterns.push({ pattern: "Factory Pattern" });
  }

  // Strategy
  if (
    cleanText.includes("strategy") ||
    cleanText.includes("discountstrategy") ||
    cleanText.includes("calculate")
  ) {
    patterns.push({ pattern: "Strategy Pattern" });
  }

  // Observer
  if (
    cleanText.includes("observer") ||
    cleanText.includes("notifier") ||
    cleanText.includes("emailnotifier") ||
    cleanText.includes("smsnotifier")
  ) {
    patterns.push({ pattern: "Observer Pattern" });
  }

  // Singleton
  if (
    cleanText.includes("singleton") ||
    cleanText.includes("getinstance")
  ) {
    patterns.push({ pattern: "Singleton Pattern" });
  }

  // Adapter
  if (
    cleanText.includes("adapter") ||
    cleanText.includes("wrap")
  ) {
    patterns.push({ pattern: "Adapter Pattern" });
  }

  // ❗ Remove duplicates
  const unique = [];
  const seen = new Set();

  for (const p of patterns) {
    if (!seen.has(p.pattern)) {
      seen.add(p.pattern);
      unique.push(p);
    }
  }

  return unique;
}