import React from 'react'
import { Level, Heading } from 'react-bulma-components'

const style = { textAlign: 'center' }

class GlobalStats extends React.Component {
  render() {
    const { stats } = this.props

    return (
      <Level renderAs="nav">
        {stats.map(({ label, money, value }) => {
          return (
            <Level.Item style={style} key={label}>
              <div>
                <Heading renderAs="p" heading>
                  {label}
                </Heading>
                {money ? (
                  <Heading renderAs="p">${value.toLocaleString()}</Heading>
                ) : (
                  <Heading renderAs="p">{value.toLocaleString()}</Heading>
                )}
              </div>
            </Level.Item>
          )
        })}
      </Level>
    )
  }
}

export default GlobalStats
