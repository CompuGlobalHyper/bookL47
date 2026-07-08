export default function generateHourlyPrice(start, end) {

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
    const totalPrice = totalTime * 60

    return totalPrice   
}