// config/monsters-config.js
// Configuration for all monsters in the game, now with 5 attacks each and “counter” codes

export const monstersConfig = [
  {
    id: "goblin",
    name: "Goblin",
    power: 10,
    agility: 8,
    location: "forest",
    xpReward: 20,
    coinReward: { gold: 0, silver: 5, bronze: 10 },
    attacks: [
      { name: "Slash", counter: "d" },
      { name: "Dagger Stab", counter: "s" },
      { name: "Headbutt", counter: "ArrowUp" },
      { name: "Pounce", counter: "ArrowLeft" },
      { name: "Tail Whip", counter: "ArrowRight" },
    ],
  },
  {
    id: "wolf",
    name: "Wolf",
    power: 15,
    agility: 12,
    location: "mountain",
    xpReward: 30,
    coinReward: { gold: 0, silver: 10, bronze: 0 },
    attacks: [
      { name: "Bite", counter: "d" },
      { name: "Claw Swipe", counter: "s" },
      { name: "Howl", counter: "ArrowUp" },
      { name: "Pounce", counter: "ArrowLeft" },
      { name: "Feral Bite", counter: "ArrowRight" },
    ],
  },
  {
    id: "cave_troll",
    name: "Cave Troll",
    power: 25,
    agility: 4,
    location: "cave",
    xpReward: 50,
    coinReward: { gold: 0, silver: 15, bronze: 5 },
    attacks: [
      { name: "Club Smash", counter: "d" },
      { name: "Crushing Blow", counter: "s" }, // replaced Ground Pound
      { name: "Rock Throw", counter: "ArrowUp" },
      { name: "Stomp", counter: "ArrowLeft" },
      { name: "Roar", counter: "ArrowRight" },
    ],
  },
  {
    id: "wyvern",
    name: "Wyvern",
    power: 40,
    agility: 20,
    location: "mountain",
    xpReward: 80,
    coinReward: { gold: 1, silver: 0, bronze: 0 },
    attacks: [
      { name: "Fire Breath", counter: "d" },
      { name: "Tail Swipe", counter: "s" },
      { name: "Wing Buffet", counter: "ArrowUp" },
      { name: "Dive Attack", counter: "ArrowLeft" },
      { name: "Venom Spit", counter: "ArrowRight" },
    ],
  },
  {
    id: "owlbear",
    name: "Owlbear",
    power: 30,
    agility: 10,
    location: "forest",
    xpReward: 60,
    coinReward: { gold: 0, silver: 20, bronze: 0 },
    attacks: [
      { name: "Rending Claw", counter: "d" },
      { name: "Beak Peck", counter: "s" },
      { name: "Bear Hug", counter: "ArrowUp" },
      { name: "Roar", counter: "ArrowLeft" },
      { name: "Charge", counter: "ArrowRight" },
    ],
  },
  {
    id: "swamp_ghoul",
    name: "Swamp Ghoul",
    power: 20,
    agility: 6,
    location: "swamp",
    xpReward: 45,
    coinReward: { gold: 0, silver: 10, bronze: 5 },
    attacks: [
      { name: "Claw Slash", counter: "d" },
      { name: "Ghastly Wail", counter: "s" },
      { name: "Necrotic Touch", counter: "ArrowUp" },
      { name: "Swamp Grab", counter: "ArrowLeft" },
      { name: "Acid Spit", counter: "ArrowRight" },
    ],
  },
  {
    id: "centaur",
    name: "Centaur",
    power: 35,
    agility: 15,
    location: "ruins",
    xpReward: 100,
    coinReward: { gold: 2, silver: 0, bronze: 0 },
    attacks: [
      { name: "Spear Thrust", counter: "d" },
      { name: "Hoof Stomp", counter: "s" },
      { name: "Arc Strike", counter: "ArrowUp" },
      { name: "Arrow Shot", counter: "ArrowLeft" },
      { name: "Charge", counter: "ArrowRight" },
    ],
  },
  {
    id: "dragon",
    name: "Dragon",
    power: 500,
    agility: 50,
    location: "lair",
    xpReward: 500,
    coinReward: { gold: 100000, silver: 0, bronze: 0 },
    attacks: [
      { name: "Inferno Breath", counter: "d" },
      { name: "Claw Swipe", counter: "s" },
      { name: "Wing Buffet", counter: "ArrowUp" },
      { name: "Tail Smash", counter: "ArrowLeft" },
      { name: "Roaring Crush", counter: "ArrowRight" },
    ],
  },
];
