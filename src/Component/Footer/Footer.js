import React from 'react'
import './Footer.css'
import { CiHeart } from "react-icons/ci";
import { CiCircleInfo } from "react-icons/ci";
import { MdNotificationsNone } from "react-icons/md";

function Footer() {
  return (
    <>
    <footer className="footer">
        <div className="location-icon"><CiHeart /></div>
        <div className="location-name"><CiCircleInfo /></div>
        <div className="location-name"><MdNotificationsNone /></div>
      </footer>
    </>
  )
}

export default Footer