const ROOM_TIERS = {
  small: [1, 2, 3, 4],
  medium: [5, 6],
  large: [7]
};

const ROOM_BASE_PRICES = {
  small: 30,
  medium: 35,
  large: 40
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

function generateHours(start, end) {

    function getMinutes(time) {
        const [ h, m ] = time.split(":")
        const result = Number(h) * 60 + Number(m)
        return result
    }
    const startInt = getMinutes(start)
    const endInt = getMinutes(end)
    console.log(startInt)
    console.log(endInt)

    const totalTime = (endInt - startInt) / 60
    console.log(totalTime)
    return totalTime  
}

function getTotal(cart) {
  return cart.reduce((acc, item) => {
    return acc + item.price
  }, 0)
}

function createFee(price) {
  return (price * 0.029 + 0.30).toFixed(2);
}

module.exports = {generateHours, getTotal, createFee}