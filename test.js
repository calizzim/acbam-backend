const Taxes = require('./app/native/classes/Taxes')
let taxHelper = new Taxes()
console.log(taxHelper.getTaxes(100000, "California", "single", 20))
console.log(taxHelper._getTaxes(15197, 100000, "California", "single"))
