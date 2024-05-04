import React from 'react'
import './Header.css'
import { IoMdMenu } from "react-icons/io";

function Header() {
  return (
    <>
     <header className="header">
        <div className="header-content">
          <div className='app-icon'><IoMdMenu /></div>
          <div className="app-name">Startup</div>
        </div>
      </header>
    </>
  )
}

export default Header

/* <div className="route-info">
            <div className="route-title">Nyabugogo - Kimironko</div>
            <div className="route-details">Next stop: Kicyiru Eta park | Distance: 2.8 km | Time: 23 minutes</div>
          </div>*/