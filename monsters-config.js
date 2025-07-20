/* monsters-config.js */
// Configuration for all monsters in the game

export const monstersConfig = [
  {
    id: "goblin",
    name: "Goblin",
    power: 10,
    agility: 8,
    location: "forest",
    xpReward: 20,
    coinReward: { gold: 0, silver: 5, bronze: 10 },
  },
  {
    id: "wolf",
    name: "Wolf",
    power: 15,
    agility: 12,
    location: "mountain",
    xpReward: 30,
    coinReward: { gold: 0, silver: 10, bronze: 0 },
  },
  {
    id: "cave_troll",
    name: "Cave Troll",
    power: 25,
    agility: 4,
    location: "cave",
    xpReward: 50,
    coinReward: { gold: 0, silver: 15, bronze: 5 },
  },
  {
    id: "wyvern",
    name: "Wyvern",
    power: 40,
    agility: 20,
    location: "mountain",
    xpReward: 80,
    coinReward: { gold: 1, silver: 0, bronze: 0 },
  },
  {
    id: "owlbear",
    name: "Owlbear",
    power: 30,
    agility: 10,
    location: "forest",
    xpReward: 60,
    coinReward: { gold: 0, silver: 20, bronze: 0 },
  },
  {
    id: "swamp_ghoul",
    name: "Swamp Ghoul",
    power: 20,
    agility: 6,
    location: "swamp",
    xpReward: 45,
    coinReward: { gold: 0, silver: 10, bronze: 5 },
  },
  {
    id: "ancient_specter",
    name: "Ancient Specter",
    power: 35,
    agility: 15,
    location: "ruins",
    xpReward: 100,
    coinReward: { gold: 2, silver: 0, bronze: 0 },
  },
  // Add or adjust monsters here
];
