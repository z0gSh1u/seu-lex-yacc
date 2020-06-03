;(function () {
  function html2Escape(sHtml) {
    return sHtml.replace(/[<>&"]/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
    })
  }
  let data = window._seulex_data
  function genHead() {
    let ret = `
    <table class="table">
        <thead>
          <tr>
            <th style="vertical-align: middle;" rowspan="2">STATE</th>
            <th colspan="${data.ACTIONHead.length}">ACTION</th>
            <th colspan="${data.GOTOHead.length}">GOTO</th>
          </tr>
          <tr>
  `
    for (let alpha of data.ACTIONHead) ret += `<th>${alpha}</th>`
    for (let alpha of data.GOTOHead) ret += `<th>${alpha}</th>`
    ret += `</tr></thead>`
    return ret
  }
  function genTail() {
    return `</table>`
  }
  function genBody() {
    let res = `<tbody>`
    for (let i = 0; i < data.ACTIONTable.length; i++) {
      let row = `<tr><td>${i}</td>`
      for (let j of data.ACTIONTable[i]) row += `<td>${j}</td>`
      for (let j of data.GOTOTable[i]) row += `<td>${j}</td>`
      row += '</tr>'
      res += row
    }
    res += '</tbody>'
    return res
  }
  let html = genHead() + genBody() + genTail()
  document.getElementById('container').innerHTML = html
})()
