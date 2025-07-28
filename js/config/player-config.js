/* player-config.js */
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
  tools: [], // array of tool IDs
};

export const coins = defaultPlayerConfig.coins;
export const health = defaultPlayerConfig.health;
export const xp = defaultPlayerConfig.xp;
export const agility = defaultPlayerConfig.agility;
export const level = defaultPlayerConfig.level;
export const tools = defaultPlayerConfig.tools;
