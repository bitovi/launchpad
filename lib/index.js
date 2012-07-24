module.exports = {
	local : require('./local/' + process.platform),
	browserstack : require('./browserstack')
}