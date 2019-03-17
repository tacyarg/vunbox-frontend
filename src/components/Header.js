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
      {/* <div class="navbar-end">
        <a class="navbar-item">Daily Snapshots</a>
      </div> */}
    </nav>
  </header>
)

export default Header
