/* player-config.js */
export const STORAGE_KEY = "dragonRPG_player";

export const defaultPlayerConfig = {
  coins: {
    gold: 0,
    silver: 0,
    bronze: 0,
  },
  health: 100,
  xp: 0,
  agility: 5,
  level: 1,
  tools: [], // array of tool IDs
};
