import React from 'react'

class GlobalStats extends React.Component {
  render() {
    const { stats } = this.props

    return (
      <nav className="level">
        {stats.map(row => {
          return (
            <div className="level-item has-text-centered" key={row.label}>
              <div>
                <p className="heading">{row.label}</p>
                {row.money ? (
                  <p className="title">${row.value.toLocaleString()}</p>
                ) : (
                  <p className="title">{row.value.toLocaleString()}</p>
                )}
              </div>
            </div>
          )
        })}
      </nav>
    )
  }
}

export default GlobalStats