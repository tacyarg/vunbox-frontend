import React from 'react'

class Menu extends React.Component {
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
      <aside className="menu">
        <p className="menu-label">{label}</p>
        <ul className="menu-list">
          {tabs.map(({ label, action }) => {
            return (
              <li key={label}>
                <a
                  className={this.isActive(action)}
                  onClick={e => {
                    return changeTab(action)
                  }}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </aside>
    )
  }
}

export default Menu
