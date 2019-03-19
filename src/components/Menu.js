import React from 'react'
import { Menu } from 'react-bulma-components'

class TabMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  isActive = action => {
    const { currentTab } = this.props
    return currentTab === action ? 'is-active' : null
  }

  render() {
    // const { tabs } = this.state
    const { label, tabs, changeTab } = this.props

    return (
      <Menu>
        <Menu.List title={label}>
          {tabs.map(({ label, action }) => {
            return (
              <Menu.List.Item
                key={label}
                className={this.isActive(action)}
                onClick={e => changeTab(action)}
              >
                {label}
              </Menu.List.Item>
            )
          })}
        </Menu.List>
      </Menu>
    )
  }
}

export default TabMenu
