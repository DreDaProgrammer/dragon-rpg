/* player-config.js */
export const STORAGE_KEY = "dragonRPG_player";

export const defaultPlayerConfig = {
  coins: {
    gold: 1000,
    silver: 1000,
    bronze: 1000,
  },
  health: 1000,
  xp: 10,
  power: 100,
  agility: 150,
  level: 10,
  tools: [], // array of tool IDs
};

export const coins = defaultPlayerConfig.coins;
export const health = defaultPlayerConfig.health;
export const xp = defaultPlayerConfig.xp;
export const agility = defaultPlayerConfig.agility;
export const level = defaultPlayerConfig.level;
export const tools = defaultPlayerConfig.tools;
