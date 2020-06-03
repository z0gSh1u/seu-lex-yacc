document.addEventListener('DOMContentLoaded', function () {
  let g = new dagreD3.graphlib.Graph({ multigraph: true }).setGraph({})
  // 设置点
  for (let node of data.nodes) {
    let defaultBg = 'white',
      defaultFg = '#333',
      bg
    node.color && (bg = node.color)
    let value = {
      rx: 3,
      ry: 3,
      shape: window._seulex_shape,
      label: node.label,
      labelStyle: `fill: ${defaultFg}`,
      style: `fill: ${bg || defaultBg}; stroke: ${defaultFg}`,
      description: node.label,
      ttText: node.label,
    }
    g.setNode(node.key, value)
  }
  // 设置边
  for (let edge of data.edges) {
    let arrowProps = {
      arrowhead: 'vee',
      label: edge.label,
    }
    g.setEdge(edge.source, edge.target, arrowProps, edge.name)
  }
  // 渲染
  let render = new dagreD3.render()
  let svg = d3.select('svg')
  let inner = svg.append('g')
  let zoom = d3.zoom().on('zoom', function () {
    inner.attr('transform', d3.event.transform)
  })
  render(inner, g)
  svg.call(zoom)
  let { height, width } = svg.node().getBoundingClientRect()
  svg.call(
    zoom.transform,
    d3.zoomIdentity.translate(
      (width - g.graph().width) / 2,
      (height - g.graph().height) / 2
    )
  )
})
