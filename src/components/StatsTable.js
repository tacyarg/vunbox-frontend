import React from 'react'
import { Table } from 'react-bulma-components'

class StatsTable extends React.Component {
  renderWithType = (data, type) => {
    switch (type) {
      case 'integer':
        return Number(data).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })
      case 'currency':
        return (
          '$' +
          Number(data).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        )
      case 'link':
        return <a href={data}>Download Link</a>
      default:
        return data.toString()
    }
  }

  render() {
    const { columns, rows } = this.props
    return (
      <Table bordered={true}>
        <thead>
          <tr>
            {columns.map(([key, value]) => {
              return <th key={key}>{key}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr key={index}>
                {columns.map(([key, value, type]) => {
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
    )
  }
}

export default StatsTable
