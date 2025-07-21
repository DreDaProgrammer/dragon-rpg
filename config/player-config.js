/* player-config.js */
export const STORAGE_KEY = "dragonRPG_player";

export const defaultPlayerConfig = {
  coins: {
    gold: 1000,
    silver: 1000,
    bronze: 1000,
  },
  health: 100,
  xp: 0,
  agility: 5,
  level: 1,
  tools: [], // array of tool IDs
};
