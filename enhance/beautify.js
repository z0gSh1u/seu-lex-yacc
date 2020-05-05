/**
 * 美化C代码
 * by Twileon @ 2020-05
 */
let layer = 0 // 大括号层数
const TAB_SPACES = 2
function tabs() {
  return ' '.repeat(layer * TAB_SPACES) // 制表符函数
}
let result = tabs(), // 返回值
  cursor = '', // 指针
  isFor = false, // 指针是否在for循环的条件中     for(;;){}
  isString = false, // 指针是否在string中
  isAnnotation = false // 指针是否在注释中
function beautifyCCode(cCode) {
  let i = 0
  cCode = cCode.replace(/^[\s\n]*/, '') // 删除段尾的空白字符
  cCode = cCode.replace(/[\s\n]*$/, '') // 删除段开头的空白字符
  cCode = cCode.replace(/[\n\r]+/g, '\n') // 删除多个连续空行
  for (; i < cCode.length; i++) {
    cursor = cCode.charAt(i) // 指针位置
    if (isAnnotation) {
      if (isAnnotation == '//' && cursor == '\n') {
        isAnnotation = false // 单行纯注释不做改动
      } else if (isAnnotation == '/*' && cCode.substr(i, 2) == '*/') {
        isAnnotation = false
        cursor = '*/\n'
        i++ // 多行注释末尾自动换行
      }
      if (!isAnnotation) {
        while (cCode.charAt(++i).match(/\s/)); // 注释的下一行开头如果是空白字符，则用制表符代替
        i--
        cursor += tabs()
      }
      result += cursor
    } else if (isString) {
      if (
        isString == cursor &&
        (cCode.charAt(i - 1) != '\\' || cCode.charAt(i - 2) == '\\')
      ) {
        // 如果是有\注释的引号，则不纳入字符串
        isString = false
      }
      result += cursor
    } else if (isFor && cursor == '(') {
      // 进入for循环条件
      isFor++
      result += cursor
    } else if (isFor && cursor == ')') {
      // 退出for循环条件
      isFor--
      result += cursor
    } else if (cCode.substr(i, 4) == 'else') {
      // 进入else
      result = result.replace(/\s*$/, '') + ' e'
    } else if (cCode.substr(i).match(/^for\s*\(/)) {
      // 匹配for循环标识符
      isFor = 1
      result += 'for ('
      while (cCode.charAt(++i) != '(');
    } else if (cCode.substr(i, 2) == '//') {
      // 进入单行注释
      isAnnotation = '//'
      result += '//'
      i++
    } else if (cCode.substr(i, 2) == '/*') {
      // 进入多行注释
      isAnnotation = '/*'
      result += '\n' + tabs() + '/*'
      i++
    } else if (cursor == '"' || cursor == "'") {
      // 进入字符串
      if (isString && cursor == isString) {
        // 退出字符串
        isString = false
      } else {
        isString = cursor
      }
      result += cursor
    } else if (cursor == '{') {
      // 进入更深一层的花括号
      layer++
      result = result.replace(/\s*$/, '') + ' {\n' + tabs()
      while (cCode.charAt(++i).match(/\s/));
      i--
    } else if (cursor == '}') {
      // 退出一层花括号
      result = result.replace(/\s*$/, '')
      layer--
      result += '\n' + tabs() + '}\n' + tabs()
      while (cCode.charAt(++i).match(/\s/));
      i--
    } else if (cursor == ';' && !isFor) {
      // 非for循环条件中的分号处理
      result += ';\n' + tabs()
      while (cCode.charAt(++i).match(/\s/));
      i--
    } else if (cursor == '\n') {
      // 换行符美化对齐
      result += '\n' + tabs()
    } else {
      // 一般情况
      result += cursor
    }
  }
  return result
}
module.exports = { beautifyCCode }
