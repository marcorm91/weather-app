const createAemetProxy = require('../server/aemetProxy.cjs')

module.exports = function setupProxy(app) {
  app.use('/aemet', createAemetProxy())
}
