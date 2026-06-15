export const AVATAR_EMOJIS = {
  pirate: '🏴‍☠️',
  mage: '🧙',
  adventurer: '🧗',
  knight: '⚔️',
  'treasure hunter': '🗺️',
};

export const AVATAR_OPTIONS = [
  { slug: 'pirate', label: 'Pirate', emoji: '🏴‍☠️' },
  { slug: 'mage', label: 'Mage', emoji: '🧙' },
  { slug: 'adventurer', label: 'Adventurer', emoji: '🧗' },
  { slug: 'knight', label: 'Knight', emoji: '⚔️' },
  { slug: 'treasure hunter', label: 'Treasure Hunter', emoji: '🗺️' },
];

export function normalizeAvatar(value) {
  if (!value) return 'adventurer';
  const key = String(value).trim().toLowerCase();
  if (AVATAR_EMOJIS[key]) return key;
  const match = AVATAR_OPTIONS.find((option) => option.label.toLowerCase() === key);
  return match?.slug || 'adventurer';
}

export function getAvatarEmoji(value) {
  return AVATAR_EMOJIS[normalizeAvatar(value)] || AVATAR_EMOJIS.adventurer;
}
