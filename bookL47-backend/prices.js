const ROOM_TIERS = {
  small: [1, 2, 3, 4],
  medium: [5, 6],
  large: [7]
};

const ROOM_BASE_PRICES = {
  small: 25,
  medium: 30,
  large: 35
};

const getRoomPrices = (roomId) => {
  let tier;

  if (ROOM_TIERS.small.includes(roomId)) tier = "small";
  else if (ROOM_TIERS.medium.includes(roomId)) tier = "medium";
  else tier = "large";

  const regular = ROOM_BASE_PRICES[tier];

  return {
    regular,
    life: regular - 5
  };
};