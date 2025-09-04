console.time('benchmark')
Array.from({ length: 1e6 }).forEach((_, i) => console.log(i))
console.timeEnd('benchmark')