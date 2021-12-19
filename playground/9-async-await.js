const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
}

const doWork = async () => {
    const sum = await add(33, 55)
    const sum1 = await add(12, 44)
    return sum1 + sum
}

doWork().then((result)=>{
    console.log(result)
})