/** Coach-rank tags. Only a System Leader may assign these on Add Categories. */
export const SYSTEM_LEADER_ONLY_CATEGORY_NAMES = [
  "System Leader",
  "Club Leader",
  "Club Leader Jr",
  "Club Captain",
  "Wellness Coach",
];

const BLOCKED = new Set(
  SYSTEM_LEADER_ONLY_CATEGORY_NAMES.map((n) => n.toLowerCase())
);

export function isSystemLeaderClubType(clubType) {
  return String(clubType || "").trim() === "System Leader";
}

export function isSystemLeaderOnlyCategoryName(name) {
  return BLOCKED.has(String(name || "").trim().toLowerCase());
}

export function assignableClientCategories(categories = [], clubType) {
  if (!Array.isArray(categories)) return [];
  if (isSystemLeaderClubType(clubType)) return categories;
  return categories.filter(
    (cat) => !isSystemLeaderOnlyCategoryName(cat?.name)
  );
}
