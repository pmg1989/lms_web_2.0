const fs = require('fs')
const path = require('path')
const copydir = require('copy-dir')
const { version } = require('./package.json')

const removeFolder = (folderPath, removeDirectory = true) => {
  let files = []
  if (fs.existsSync(folderPath)) {
    files = fs.readdirSync(folderPath)
    files.forEach((file) => {
      const curPath = `${folderPath}/${file}`
      if (fs.statSync(curPath).isDirectory()) {
        removeFolder(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    removeDirectory && fs.rmdirSync(folderPath)
  }
}

const start = () => {
  const from = path.join(`${__dirname}/dist/deploy`)

  const dist = path.join(`${__dirname}/dist/${version}`)
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist)
  } else {
    removeFolder(dist, false)
  }

  copydir.sync(from, dist)

  removeFolder(from)
}

start()
