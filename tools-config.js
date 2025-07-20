/* tools-config.js */
// Configuration for all purchasable tools in the game
// Define tool IDs, names, power levels, and costs
export const toolsConfig = [
  {
    id: "wooden_sword",
    name: "Wooden Sword",
    power: 5,
    cost: { gold: 0, silver: 5, bronze: 0 },
  },
  {
    id: "iron_sword",
    name: "Iron Sword",
    power: 15,
    cost: { gold: 0, silver: 20, bronze: 0 },
  },
  {
    id: "steel_axe",
    name: "Steel Axe",
    power: 25,
    cost: { gold: 1, silver: 0, bronze: 0 },
  },
  {
    id: "healing_potion",
    name: "Healing Potion",
    power: 0,
    cost: { gold: 0, silver: 10, bronze: 0 },
    effect: { heal: 50 },
  },
  // Add or adjust tools here as needed
];
