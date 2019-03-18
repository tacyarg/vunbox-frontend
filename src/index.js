import React from 'react'
import ReactDOM from 'react-dom'
import './static/scss/app.scss'
import Actions from './libs/actions'
import lodash from 'lodash'
import moment from 'moment'

import Header from './components/Header'
import StatsTable from './components/Table'
import Footer from './components/Footer'
import GlobalStats from './components/GlobalStats'
import Menu from './components/Menu'

import Graph from './components/Graph'

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
        // REDUCTIONS
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
        // {
        //   label: 'Case: Most Profitable',
        //   action: 'listCaseMostProfitable',
        //   columns: ['Case Name', 'Users Spent', 'Users Profited'],
        //   rows: ['name', 'spent', 'profit'],
        // },
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
        // {
        //   label: 'User: Trade Profit',
        //   action: 'tradesProfit',
        //   columns: ['User', 'Profit'],
        //   rows: ['username', 'tradesProfit'],
        // },
        // {
        //   label: 'User: Trade Value',
        //   action: 'tradesTotalValue',
        //   columns: ['User', 'Value'],
        //   rows: ['username', 'tradesTotalValue'],
        // },
        // {
        //   label: 'User: Trade Count',
        //   action: 'tradesCount',
        //   columns: ['User', 'Count'],
        //   rows: ['username', 'tradesCount'],
        // },
        // {
        //   label: 'User: Trades Incoming Count',
        //   action: 'incomingTradesCount',
        //   columns: ['User', 'Count'],
        //   rows: ['username', 'incomingTradesCount'],
        // },
        // {
        //   label: 'User: Trades Incoming Value',
        //   action: 'incomingTradesTotal',
        //   columns: ['User', 'Value'],
        //   rows: ['username', 'incomingTradesTotal'],
        // },
        // {
        //   label: 'User: Trades Outgoing Count',
        //   action: 'outgoingTradesCount',
        //   columns: ['User', 'Count'],
        //   rows: ['username', 'outgoingTradesCount'],
        // },
        // {
        //   label: 'User: Trades Outgoing Value',
        //   action: 'outgoingTradesTotal',
        //   columns: ['User', 'Value'],
        //   rows: ['username', 'outgoingTradesTotal'],
        // },
      ],
      graphData: null,
    }
  }

  componentDidMount() {
    const { actions } = this.props
    const { currentTab } = this.state

    this.changeTab(currentTab)
    this.getDailySnapshots()
    // poll global stats.
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
        // {
        //   label: 'Total Spent',
        //   value: globalStats.caseTotalSpent,
        //   money: true,
        // },
        {
          label: `BEST UNBOXING: ${globalStats.bestItemUnboxed.name}`,
          value: globalStats.bestItemUnboxed.price,
          money: true,
        },
        // {
        //   label: 'Total Trades',
        //   value: globalStats.tradesCount,
        // },
        // {
        //   label: 'Trade Value',
        //   value: globalStats.tradesTotalValue,
        //   money: true,
        // },
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

  randomData = () => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 10000))
  }

  getDailySnapshots = async () => {
    const { actions } = this.props
    let list = await actions.listDailySnapshots()
    list = lodash.sortBy(list, 'id')

    console.log(list)

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
    const {
      tabs,
      currentTab,
      loading,
      firstEvent,
      globalStats,
      graphData,
    } = this.state

    return (
      <body className="has-navbar-fixed-top">
        <Header />
        <section className="section">
          <div className="container is-widescreen">
            <GlobalStats stats={globalStats} />
            <hr class="divider" />
            {graphData ? (
              <Graph
                title="Daily Openings"
                type="axis-mixed"
                data={graphData}
              />
            ) : null}

            {/* <article className="message is-small is-warning">
              <div className="message-header">
                <p>Data Validity</p>
              </div>
              <div className="message-body">
                The first event captured was on{' '}
                <strong>{firstEvent.toDateString()}</strong>. All data displayed
                is from the aforementioned day onward, updated in realtime, no
                events prior to this date are available from wax.
              </div>
            </article> */}
            <div className="columns">
              <div className="column is-one-fifth">
                <Menu
                  tabs={tabs}
                  currentTab={currentTab}
                  changeTab={this.changeTab}
                />
              </div>
              <div className="column">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <StatsTable {...this.state} />
                )}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </body>
    )
  }
}

const main = async () => {
  // const actions = await Actions('http://localhost:9001/')
  const actions = await Actions('https://api.vunbox.com/')
  return ReactDOM.render(
    <Layout actions={actions} />,
    document.getElementById('app')
  )
}

main()
