/* eslint-disable */

/**
 * clean.js
 * 删除dist文件夹下所有内容以准备构建
 */

"use strict"

const fs = require('fs')
const path = require('path')

const DIST_PATH = path.join(__dirname, '../dist')

function deleteFileRecursive(_path) {
  let files = fs.readdirSync(_path)
  files.forEach(file => {
    let filePath = path.join(_path, file)
    if (fs.statSync(filePath).isDirectory()) {
      deleteFileRecursive(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  })
  fs.rmdirSync(_path)
}

deleteFileRecursive(DIST_PATH)
fs.mkdirSync(DIST_PATH)

console.log(`[Clean] Task finished.`)