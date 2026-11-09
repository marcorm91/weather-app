const fs = require('node:fs')
const path = require('node:path')

// Keep existing local credentials untouched. Fresh clones get an empty template.
const configDirectory = path.join(__dirname, '..', 'src', 'resources', 'services', 'keys')
try {
  fs.copyFileSync(path.join(configDirectory, 'config.example.js'), path.join(configDirectory, 'config.js'), fs.constants.COPYFILE_EXCL)
} catch (error) {
  if (error.code !== 'EEXIST') throw error
}
