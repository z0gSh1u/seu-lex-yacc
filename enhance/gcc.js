/**
 * seulex - GCC调用器
 * by z0gSh1u @ 2020-5
 */
const ChildProcess = require('child_process')
module.exports.callGCC = function callGCC(cfile, params) {
  ChildProcess.exec(
    `gcc ${cfile} -o ${cfile.substring(0, cfile.length - 1) + 'exe'} ${params}`
  )
}
