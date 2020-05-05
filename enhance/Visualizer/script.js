document.addEventListener('DOMContentLoaded', function () {
  let g = new dagreD3.graphlib.Graph({ multigraph: true }).setGraph({})
  // A few global attributes
  if (data.attributes && data.attributes.rankdir) {
    g.graph().rankDir = data.attributes.rankdir
  }
  const disabledShade = '#ccc'
  // 设置点
  for (let node of data.nodes) {
    let defaultBg = 'white',
      defaultFg = '#333',
      fg,
      bg
    node.color && (bg = node.color)
    let value = {
      rx: 3,
      ry: 3,
      shape: 'circle',
      label: node.label,
      labelStyle: `fill: ${fg || defaultFg}`,
      style: `fill: ${bg || defaultBg}; stroke: ${fg || defaultFg}`,
      description: node.description || node.label,
      ttText: node.tooltip || node.description || node.label,
    }
    g.setNode(node.label, value)
  }
  // 设置边
  for (let edge of data.edges) {
    let arrowProps = {
      arrowhead: 'vee',
      label: edge.label === 'epsilon' ? 'ε' : edge.label,
    }
    if (edge.attributes && edge.attributes.disabled) {
      g.setEdge(edge.source, edge.target, {
        arrowheadStyle: `stroke: ${disabledShade}; fill: ${disabledShade};`,
        style: `stroke: ${disabledShade}; fill: transparent;`,
        ...arrowProps,
      })
    } else {
      g.setEdge(edge.source, edge.target, arrowProps)
    }
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
  tippy('g.node', { size: 'small', interactive: true })
})