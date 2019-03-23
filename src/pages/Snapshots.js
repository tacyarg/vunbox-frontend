import React from 'react'
import {
  Section,
  Container,
  Box,
  Tabs,
  Table,
  Loader,
} from 'react-bulma-components'

import SnapshotChart from '../components/SnapshotChart'
import moment from 'moment'
import StatsTable from '../components/StatsTable'

class Snapshots extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTab: 'Snapshots',
      tabs: [['Snapshots', 'listSnapshots'], ['Backups', 'listBackups']],
      content: {
        columns: [],
        rows: [],
      },
      loading: true,
    }
  }

  componentDidMount() {
    const { tabs } = this.state
    this.selectTab(tabs[0])
  }

  selectTab = async ([tab, action]) => {
    this.setState({
      loading: true,
    })

    // populate data
    await this[action]()

    return this.setState({
      currentTab: tab,
      loading: false,
    })
  }

  listSnapshots = async () => {
    const { actions } = this.props
    let list = await actions.listDailySnapshots()

    list = list.map(row => {
      return { ...row, id: moment(row.id).format('MMMM Do YYYY, h:mm a') }
    })

    this.setState({
      content: {
        columns: [
          ['Created', 'id'],
          ['Case Openings', 'caseOpenings', 'integer'],
          ['Case Total Spent', 'caseTotalSpent', 'currency'],
          ['Case Total Awarded', 'caseTotalAwarded', 'currency'],
          ['Total Trades', 'tradesCount', 'integer'],
          ['Total Trade Value', 'tradesTotalValue', 'currency'],
        ],
        rows: list,
      },
    })
  }

  listBackups = async () => {
    const { actions } = this.props
    let list = await actions.listDailyBackups()

    this.setState({
      content: {
        columns: [
          ['Name', 'id'],
          ['URL', 'link', 'link'],
          // ['Total Spent', 'caseTotalSpent'],
          // ['Total Awarded', 'caseTotalAwarded'],
          // ['Total Trades', 'tradesCount'],
          // ['Total Trade Value', 'tradesTotalValue'],
        ],
        rows: list,
      },
    })
  }

  render() {
    const { loading, tabs, currentTab, content } = this.state
    const { actions } = this.props
    return (
      <Section>
        <Container breakpoint="widescreen">
          <Box>
            <SnapshotChart actions={actions} />
            <hr className="divider" />
            <Tabs type="boxed">
              {tabs.map(([name, action]) => {
                return (
                  <Tabs.Tab
                    key={name}
                    active={currentTab === name}
                    onClick={e => this.selectTab([name, action])}
                  >
                    {name}
                  </Tabs.Tab>
                )
              })}
            </Tabs>
            {loading ? (
              <Loader />
            ) : (
              <StatsTable columns={content.columns} rows={content.rows} />
            )}
          </Box>
        </Container>
      </Section>
    )
  }
}

export default Snapshots
