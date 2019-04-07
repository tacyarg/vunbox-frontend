import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

import NotFound from './pages/NotFound'
import Leaderboards from './pages/Leaderboards'
import Snapshots from './pages/Snapshots'
import Documentation from './pages/Documentation'

const App = ({ actions }) => (
  <>
    <Header />
    <Switch>
      <Redirect exact from="/" to="/snapshots" />

      <Route
        path="/leaderboards"
        render={props => {
          return <Leaderboards actions={actions} />
        }}
      />
      <Route
        path="/snapshots"
        render={props => {
          return <Snapshots actions={actions} />
        }}
      />
      <Route
        path="/documentation"
        render={props => {
          return <Documentation actions={actions} />
        }}
      />

      <Route component={NotFound} />
    </Switch>
    <Footer />
  </>
)

export default App
