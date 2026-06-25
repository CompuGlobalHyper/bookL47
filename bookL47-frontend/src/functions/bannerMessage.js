export default function setBannerMessage(callback, text, error, secs) {
    callback((prev) => {
        return ({...prev, text: text, error: error})
    })
    setTimeout(() => {
        callback((prev) => {
            return ({...prev, text: "", error: false})
        })
    }, secs * 1000)
}