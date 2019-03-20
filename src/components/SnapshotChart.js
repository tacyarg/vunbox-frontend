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
} from 'react-timeseries-charts'

const style = styler([
  { key: 'spent', color: '#fd0d0d', width: 2 },
  { key: 'awarded', color: '#12a8e1', width: 2 },
  { key: 'openings', color: '#5bc0de' },
])

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
                  {/* <LineChart
                    axis="spent"
                    breakLine={false}
                    series={awarded}
                    columns={['awarded']}
                    style={style}
                    // interpolation="curveBasis"
                  /> */}
                  {/* <LineChart
                  axis="spent"
                  breakLine={false}
                  series={spent}
                  columns={['spent']}
                  style={style}
                  interpolation="curveBasis"
                /> */}
                </Charts>
                {/* <YAxis
                  id="spent"
                  label="Awarded / Day"
                  min={0}
                  max={spent.max('spent')}
                  // format=".2f"
                  width="70"
                  // type="linear"
                /> */}
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
