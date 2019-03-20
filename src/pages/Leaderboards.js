import React from 'react'
import {
  Section,
  Container,
  Box,
  Columns,
  Loader,
} from 'react-bulma-components'

import StatsTable from '../components/StatsTable'
import GlobalStats from '../components/GlobalStats'
import Menu from '../components/Menu'

import lodash from 'lodash'

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      globalStats: [],
      firstEvent: new Date(1551362112986),
      loading: false,
      currentTab: 'listTopSites',
      columns: ['key', 'value'],
      rows: [],
      tabs: [
        {
          label: 'Site: Most Openings',
          action: 'listTopSites',
          columns: ['Site URL', 'Openings'],
          rows: ['group', 'reduction'],
        },
        {
          label: 'Case: Most Openings',
          action: 'listCaseMostOpenings',
          columns: ['Case Name', 'Openings'],
          rows: ['name', 'caseOpenings'],
        },
        {
          label: 'Case: Best ROI',
          action: 'listCaseBestRoi',
          columns: ['Case Name', 'Price', 'ROI'],
          rows: ['name', 'price', 'roi'],
        },
        {
          label: 'Case: Most Awarded',
          action: 'listCaseMostAwarded',
          columns: ['Case Name', 'Awarded'],
          rows: ['name', 'caseTotalAwarded'],
        },
        {
          label: 'User: Most Openings',
          action: 'caseOpenings',
          columns: ['User', 'Openings'],
          rows: ['username', 'caseOpenings'],
        },
        {
          label: 'User: Most Awarded',
          action: 'caseTotalAwarded',
          columns: ['User', 'Awarded'],
          rows: ['username', 'caseTotalAwarded'],
        },
      ],
    }
  }

  componentDidMount() {
    const { actions } = this.props
    const { currentTab } = this.state

    this.changeTab(currentTab)

    this.getGlobalStats()
    setInterval(this.getGlobalStats, 5000)
  }

  getGlobalStats = async () => {
    const { actions } = this.props
    const globalStats = await actions.getGlobalStats()
    // console.log(globalStats)
    return this.setState({
      globalStats: [
        {
          label: 'Case Openings',
          value: globalStats.caseOpenings,
        },
        {
          label: 'Case Awarded',
          value: globalStats.caseTotalAwarded,
          money: true,
        },
        {
          label: `BEST UNBOXING: ${globalStats.bestItemUnboxed.name}`,
          value: globalStats.bestItemUnboxed.price,
          money: true,
        },
      ],
    })
  }

  changeTab = action => {
    const { loading, tabs } = this.state
    if (loading) return
    const { actions } = this.props
    this.setState({ loading: true })
    return actions[action]()
      .then(data => {
        const tab = tabs.find(tab => {
          return tab.action === action
        })

        this.setState({
          currentTab: action,
          loading: false,
          rows: data.map(row => {
            return tab.rows.reduce((memo, key) => {
              return { ...memo, [key]: lodash.get(row, key).toLocaleString() }
            }, {})
          }),
          columns: tab.columns,
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({ loading: false })
      })
  }

  render() {
    const { tabs, currentTab, loading, globalStats } = this.state

    return (
      <Section>
        <Container breakpoint="widescreen">
          <Box>
            <GlobalStats stats={globalStats} />
            <hr className="divider" />
            <Columns>
              <Columns.Column narrow>
                <Menu
                  label="Leaderboards"
                  tabs={tabs}
                  currentTab={currentTab}
                  changeTab={this.changeTab}
                />
              </Columns.Column>
              <Columns.Column>
                {loading ? <Loader /> : <StatsTable {...this.state} />}
              </Columns.Column>
            </Columns>
          </Box>
        </Container>
      </Section>
    )
  }
}

export default Layout
