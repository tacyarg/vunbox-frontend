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
          ['Case Openings', 'caseOpenings', 'integer'],
          ['Total Trades', 'tradesCount', 'integer'],
          ['Total Spent', 'caseTotalSpent', 'currency'],
          ['Total Awarded', 'caseTotalAwarded', 'currency'],          
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
  
  renderWithType = (data, type) => {
    switch(type) {
      case 'integer':
        return Number(data).toLocaleString(undefined, {
          maximumFractionDigits: 0
        })
      case 'currency':
        return '$' + Number(data).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      case 'link':
        return (
          <a href={data}>Download Link</a>
        )
      default:
        return data.toString()
    }
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
                    return (
                      <tr key={index}>
                        {content.columns.map(([key, value, type]) => {
                          return (
                            <th key={key + value}>
                              {this.renderWithType(row[value], type)}
                            </th>
                          )
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
