import React from 'react'
import { Loader } from 'react-bulma-components'

import lodash from 'lodash'

import { TimeSeries, Index } from 'pondjs'
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  BarChart,
  styler,
  Legend,
} from 'react-timeseries-charts'

const customColorsList = [
  "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c",
  "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5",
  "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f",
  "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
]

const columnNames = [
  { key: 'spent', color: '#d62728', width: 2 },
  { key: 'awarded', color: '#ff7f0e', width: 2 },
  { key: 'openings', color: '#9edae5' },
]

const style = styler(columnNames)

class SnapshotChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openings: null,
    }
  }

  componentDidMount() {
    this.getDailySnapshots()
  }

  getDailySnapshots = async () => {
    const { actions } = this.props
    const list = await actions.listDailySnapshots()
    const sorted = lodash.sortBy(list, 'id')

    const openings = new TimeSeries({
      name: 'Daily Openings',
      columns: ['index', 'openings'],
      points: sorted.map(row => [
        Index.getIndexString('1d', new Date(row.id)),
        row.caseOpenings,
      ]),
    })

    const spent = new TimeSeries({
      name: 'Daily Spent',
      columns: ['index', 'spent'],
      points: sorted.map(row => [
        Index.getIndexString('1d', new Date(row.id)),
        row.caseTotalSpent,
      ]),
    })

    const awarded = new TimeSeries({
      name: 'Daily Awarded',
      columns: ['index', 'awarded'],
      points: sorted.map(row => [
        Index.getIndexString('1d', new Date(row.id)),
        row.caseTotalAwarded,
      ]),
    })

    this.setState({
      openings,
      spent,
      awarded,
    })
  }

  render() {
    const { openings, spent, awarded } = this.state
    return (
      <>
        <Legend
          categories={columnNames.map(({ key }) => ({ key, label: key }))}
          style={style}
          type="dot"
        />
        {openings && spent && awarded ? (
          <Resizable>
            <ChartContainer
              timeRange={openings.range()}
              // format="day"
              utc={true}
            >
              <ChartRow height="150">
                <YAxis
                  id="openings"
                  label="Openings / Day"
                  min={0}
                  max={openings.max('openings')}
                  // format=".2f"
                  width="70"
                  // type="linear"
                />
                <Charts>
                  <BarChart
                    axis="openings"
                    spacing={1}
                    columns={['openings']}
                    series={openings}
                    style={style}
                  />
                  <LineChart
                    axis="spent"
                    breakLine={false}
                    series={awarded}
                    columns={['awarded']}
                    style={style}
                    interpolation="curveBasis"
                  />
                  <LineChart
                    axis="spent"
                    breakLine={false}
                    series={spent}
                    columns={['spent']}
                    style={style}
                    interpolation="curveBasis"
                  />
                </Charts>
                <YAxis
                  id="spent"
                  label="Value / Day"
                  min={0}
                  max={spent.max('spent')}
                  // format=".2f"
                  width="70"
                  // type="linear"
                />
              </ChartRow>
            </ChartContainer>
          </Resizable>
        ) : (
          <Loader />
        )}
      </>
    )
  }
}

export default SnapshotChart
