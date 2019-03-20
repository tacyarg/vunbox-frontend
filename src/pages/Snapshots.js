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
          ['Case Openings', 'caseOpenings'],
          ['Total Spent', 'caseTotalSpent'],
          ['Total Awarded', 'caseTotalAwarded'],
          ['Total Trades', 'tradesCount'],
          ['Total Trade Value', 'tradesTotalValue'],
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
          ['URL', 'link'],
          // ['Total Spent', 'caseTotalSpent'],
          // ['Total Awarded', 'caseTotalAwarded'],
          // ['Total Trades', 'tradesCount'],
          // ['Total Trade Value', 'tradesTotalValue'],
        ],
        rows: list,
      },
    })
  }

  isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s)
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
              <Table bordered={true}>
                <thead>
                  <tr>
                    {content.columns.map(([key, value]) => {
                      return <th key={key}>{key}</th>
                    })}
                  </tr>
                </thead>
                <tbody>
                  {content.rows.map((row, index) => {
                    // const props = Object.keys(row)
                    return (
                      <tr key={index}>
                        {content.columns.map(([key, value]) => {
                          try {
                            return (
                              <th key={key + value}>
                                {this.isUrl(row[value]) ? (
                                  <a href={row[value]}>Download Link</a>
                                ) : (
                                  row[value].toLocaleString()
                                )}
                              </th>
                            )
                          } catch (e) {
                            return <th key={key + value}>{row[value]}</th>
                          }
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )}
          </Box>
        </Container>
      </Section>
    )
  }
}

export default Snapshots
