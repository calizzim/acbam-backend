const PropertyTaxes = require('../classes/PropertyTaxes')
const propertyTaxes = new PropertyTaxes()

module.exports = {
  zipcodeOrCounty: async (database, formName, name, value, token) => {
    let state = (await database.models.salaryInfo.findById(token.id)).state
    let taxes = propertyTaxes.getTaxrateZipcode(value)
    if(taxes) return null
    taxes = propertyTaxes.getTaxrateCounty(state,value)
    if(taxes) return null
    let message
    if(/\d/.test(value.slice(0,1))) message = 'this zipcode is invalid'
    else message = state + ' does not have a county with this name'
    return { zipcodeOrCounty: message }
  }
}