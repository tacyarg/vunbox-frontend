import React, { Component } from 'react'
import { string, object } from 'prop-types'
import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm'

class Graph extends Component {
  componentDidMount() {
    const { title, data, type, height = 200, onSelect, ...rest } = this.props
    this.graph = new Chart(this.chart, {
      title,
      data,
      type,
      height,
      is_navigable: !!onSelect,
      lineOptions: {
        // heatline: 1, // default: 0
        // dotSize: 8, // default: 4
        regionFill: 1,
      },
      barOptions: {
        spaceRatio: 0.2, // default: 1
        // stacked: 1    // default 0, i.e. adjacent
      },
      axisOptions: {
        xIsSeries: true, // default: false
        xAxisMode: 'tick', // default: 'span'
      },
      // valuesOverPoints: 1,
      // colors: ['red'],
      ...rest,
    })
    if (onSelect) {
      this.graph.parent.addEventListener('data-select', onSelect)
    }
  }
  componentWillReceiveProps(props) {
    this.graph.update(props.data)
  }
  render() {
    return <div ref={chart => (this.chart = chart)} />
  }
}

export default Graph

Graph.propTypes = {
  type: string.isRequired,
  data: object.isRequired,
}
