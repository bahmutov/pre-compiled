console.log('function with default parameter')
function addOne(x, one = 1) {
  return x + one
}
console.log('2 + 1', addOne(2))
