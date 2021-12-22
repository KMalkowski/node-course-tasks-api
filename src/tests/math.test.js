const {fahrenheitToCelsius, celsiusToFahrenheit, add} = require('../math')

test('Hello Bro!', ()=>{

})

// test('This should faild', ()=>{
//     throw new Error('error')
// })

test('converting 32 fahrenheitToCelsius, should be 0', ()=>{
    expect(fahrenheitToCelsius(32)).toBe(0);
})

test('converting 0 celsiusToFahrenheit, should be 32', ()=>{
    expect(celsiusToFahrenheit(0)).toBe(32);
})

// test('Async test demo', (done)=>{
//     setTimeout(()=>{
//         expect(2).toBe(1);
//         done();
//     }, 2)
// })

test('should add 2 numbers', (done)=>{
    add(2, 3).then((sum)=>{
        expect(sum).toBe(5);
        done()
    })
})

test('should add to numbers async/await', async ()=>{
    const sum = await add(3, 3)
    expect(sum).toBe(6)
})

