let setMessage = () => {}

setMessage((prev) => {
    return ({...prev, text: "", error: true})
})
setTimeout(() => {
    setMessage((prev) => {
        return ({...prev, text: "", error: false})
    })
}, 5000)