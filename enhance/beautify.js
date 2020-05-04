/**
 * beautify.js
 * 美化C代码
 */

let level = 0
let FORWARD_LEN = 100
function finishTabifier(code) {
  code = code.replace(/\n\s*\n/g, '\n')
  code = code.replace(/^[\s\n]*/, '')
  code = code.replace(/[\s\n]*$/, '')
  level = 0
}

function tabs() {
  return ' '.repeat(level * 2)
}
let out = tabs(), li = level, c = ''
let infor = false, instring = false, incomment = false
function cleanCStyle(code) {
  let i = 0
  function cleanAsync() {
    let iStart = i;
    for (; i < code.length && i < iStart + FORWARD_LEN; i++) {
      c = code.charAt(i);
      if (incomment) {
        if (incomment == '//' && c == '\n') {
          incomment = false
        } else if ('/*' == incomment && '*/' == code.substr(i, 2)) {
          incomment = false
          c = '*/\n'
          i++
        }
        if (!incomment) {
          while (code.charAt(++i).match(/\s/));
          i--
          c += tabs()
        }
        out += c;
      } else if (instring) {
        if (instring == c && ('\\' != code.charAt(i - 1) || '\\' == code.charAt(i - 2))
        ) {
          instring = false;
        }
        out += c;
      } else if (infor && '(' == c) {
        infor++
        out += c
      } else if (infor && ')' == c) {
        infor--
        out += c
      } else if ('else' == code.substr(i, 4)) {
        out = out.replace(/\s*$/, '') + ' e';
      } else if (code.substr(i).match(/^for\s*\(/)) {
        infor = 1
        out += 'for (';
        while ('(' != code.charAt(++i));;
      } else if ('//' == code.substr(i, 2)) {
        incomment = '//'
        out += '//'
        i++
      } else if ('/*' == code.substr(i, 2)) {
        incomment = '/*'
        out += '\n' + tabs() + '/*'
        i++
      } else if ('"' == c || "'" == c) {
        if (instring && c == instring) {
          instring = false
        } else {
          instring = c
        }
        out += c
      } else if ('{' == c) {
        level++
        out = out.replace(/\s*$/, '') + ' {\n' + tabs()
        while (code.charAt(++i).match(/\s/));
        i--
      } else if ('}' == c) {
        out = out.replace(/\s*$/, '');
        level--;
        out += '\n' + tabs() + '}\n' + tabs();
        while (code.charAt(++i).match(/\s/));; i--;
      } else if (';' == c && !infor) {
        out += ';\n' + tabs();
        while (code.charAt(++i).match(/\s/));; i--;
      } else if ('\n' == c) {
        out += '\n' + tabs();
      } else {
        out += c;
      }
    }

    if (i < code.length) {
      setTimeout(cleanAsync, 0);
    } else {
      level = li;
      out = out.replace(/[\s\n]*$/, '');
      finishTabifier(out);
    }
  }

  code = code.replace(/^[\s\n]*/, '')
  code = code.replace(/[\s\n]*$/, '')
  code = code.replace(/[\n\r]+/g, '\n')

  cleanAsync()
}

module.exports = {
  cleanCStyle
}