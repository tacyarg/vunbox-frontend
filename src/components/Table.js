import React from 'react'
import { Table } from 'react-bulma-components'

class StatsTable extends React.Component {
  render() {
    const { columns, rows } = this.props
    return (
      <Table bordered={true}>
        {/* table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" */}

        <thead>
          <tr>
            <th>Position</th>
            {columns.map(name => {
              return <th key={name}>{name}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const props = Object.keys(row)
            return (
              <tr key={index}>
                <th>{++index}</th>
                {props.map(key => {
                  return <th key={index + key}>{row[key]}</th>
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }
}

export default StatsTable
