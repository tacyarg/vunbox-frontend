import React from 'react'
import { Section, Container, Box } from 'react-bulma-components'

import Graph from '../components/Graph'

import lodash from 'lodash'
import moment from 'moment'

class Snapshots extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // graphData: {
      //   datasets: [],
      //   yMarkers: [],
      // },
    }
  }

  componentDidMount() {
    this.getDailySnapshots()
  }

  getDailySnapshots = async () => {
    const { actions } = this.props
    let list = await actions.listDailySnapshots()
    list = lodash.sortBy(list, 'id')

    this.setState({
      graphData: {
        labels: list.map(row => {
          return moment(row.id).format('dddd')
        }),
        datasets: [
          {
            name: 'Total Openings',
            values: list.map(row => row.caseOpenings),
            chartType: 'bar',
          },
          // {
          //   name: 'Est. Site Rake',
          //   values: list.map(row => row.caseTotalRake.toFixed(2)),
          //   chartType: 'line',
          // },
          // {
          //   name: 'Total Awarded',
          //   values: list.map(row => row.caseTotalAwarded.toFixed(2)),
          //   chartType: 'bar',
          // },
          // {
          //   name: 'Total Spent',
          //   values: list.map(row => row.caseTotalSpent.toFixed(2)),
          //   chartType: 'bar',
          // },
          // {
          //   name: 'Avg. Awarded',
          //   values: list.map(row => {
          //     return row.caseTotalAwarded / row.caseOpenings
          //   }),
          //   chartType: 'line',
          // },
        ],
        yMarkers: [
          {
            label: 'Weekly Average',
            value: lodash.meanBy(list, 'caseOpenings'),
            // options: { labelPos: 'left' }, // default: 'right'
          },
        ],
      },
    })
  }

  render() {
    const { graphData } = this.state
    return (
      <Section>
        <Container breakpoint="widescreen">
          <Box>
            {graphData ? (
              <Graph
                title="Daily Openings"
                type="axis-mixed"
                data={graphData}
              />
            ) : null}
          </Box>
        </Container>
      </Section>
    )
  }
}

export default Snapshots
