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
      currentTab: 'listSiteMostOpenings',
      columns: [],
      rows: [],
      tabs: [
        {
          label: 'Site: Most Openings',
          action: 'listSiteMostOpenings',
          columns: [
            ['Site URL', 'id'],
            ['Openings', 'caseOpenings', 'integer'],
          ],
        },
        {
          label: 'Site: Most Rake',
          action: 'listSiteMostRake',
          columns: [
            ['Site URL', 'id'],
            ['Openings', 'caseTotalSpent', 'currency'],
            ['Est. Rake', 'caseTotalRake', 'currency'],
          ],
        },
        {
          label: 'Case: Most Openings',
          action: 'listCaseMostOpenings',
          columns: [
            ['Case Name', 'name'],
            ['Openings', 'caseOpenings', 'integer'],
          ],
        },
        {
          label: 'Case: Best ROI',
          action: 'listCaseBestRoi',
          columns: [
            ['Case Name', 'name'],
            ['Price', 'price', 'currency'],
            ['ROI', 'roi'],
          ],
        },
        {
          label: 'Case: Most Awarded',
          action: 'listCaseMostAwarded',
          columns: [
            ['Case Name', 'name'],
            ['Awarded', 'caseTotalAwarded', 'currency'],
          ],
        },
        {
          label: 'User: Most Openings',
          action: 'caseOpenings',
          columns: [
            ['User', 'username'],
            ['Openings', 'caseOpenings', 'integer'],
          ],
        },
        {
          label: 'User: Most Awarded',
          action: 'caseTotalAwarded',
          columns: [
            ['User', 'username'],
            ['Awarded', 'caseTotalAwarded', 'currency'],
          ],
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

        console.log(data)

        this.setState({
          currentTab: action,
          loading: false,
          rows: data,
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
