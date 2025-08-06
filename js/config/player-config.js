// js/config/player-config.js

export const STORAGE_KEY = "dragonRPG_player";

export const defaultPlayerConfig = {
  coins: {
    gold: 100,
    silver: 100,
    bronze: 100,
  },
  health: 100,
  xp: 10,
  power: 10,
  agility: 10,
  level: 10,
  tools: [], // array of owned tool IDs
  equippedCombatToolId: null, // currently equipped weapon
  equippedShieldId: null, // currently equipped shield
  equippedArmorId: null, // currently equipped armor
};
