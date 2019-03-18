import React from 'react'
// import ParcelLogo from "../img/parcel-logo.svg";

const Header = () => (
  <header>
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          <h1 className="title is-family-monospace	">
            vUnbox<small>.com</small>
          </h1>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <strong>{`Started: ${new Date(
            1551362112986
          ).toDateString()}`}</strong>
        </div>
      </div>
    </nav>
  </header>
)

export default Header
