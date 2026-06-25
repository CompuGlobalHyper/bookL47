export default function setBannerMessage(text, error, stateFunction, time) {
    stateFunction((prev) => {
        return ({...prev, text: text, error: error})
    })
    setTimeout(() => {
        stateFunction((prev) => {
            return ({...prev, text: text, error: error})
        })
    }, time)
}