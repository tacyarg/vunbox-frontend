import React from 'react'
import { Footer, Container, Content } from 'react-bulma-components'

const LayoutFooter = () => (
  <Footer>
    <Container>
      <Content style={{ textAlign: 'center' }}>
        <p>
          Maintained By{' '}
          <a href="https://chips.gg/" target="_blank">
            <strong>Chips.gg</strong>
          </a>
        </p>
        <p>contact@chips.gg</p>
        {/* <p>
          <img
            src="https://chips.gg/static/chips-white-logo.svg"
            alt="A solution for building secure virtual asset exchange platforms."
            width="112"
            height="28"
          />
        </p> */}
      </Content>
    </Container>
  </Footer>
)

export default LayoutFooter
