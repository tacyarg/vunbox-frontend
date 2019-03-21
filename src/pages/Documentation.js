import React from 'react'
import axios from 'axios'

import {
  Section,
  Container,
  Box,
  Loader,
  Content,
} from 'react-bulma-components'

const link = 'https://gist.githubusercontent.com/tacyarg/8afff2b07a0f57ad4366eab356d79628/raw/api.md'
const Markdown = require('react-markdown')

class Doumentation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      markdown: '',
    }
  }

  componentDidMount() {
    this.populate()
  }

  async populate() {
    // const gist = 'https://api.github.com/gists/8afff2b07a0f57ad4366eab356d79628'
    // const json = await axios(gist)
    // const link = json.data.files['api.md'].raw_url
    const { data } = await axios(link)
    this.setState({
      markdown: data,
    })
  }

  render() {
    const { markdown } = this.state
    return (
      <Section>
        <Container breakpoint="widescreen">
          <Box>
            {markdown ? (
              <Content>
                <Markdown source={markdown} />
              </Content>
            ) : (
              <Loader />
            )}
          </Box>
        </Container>
      </Section>
    )
  }
}

export default Doumentation
