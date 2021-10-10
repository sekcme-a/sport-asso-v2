import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MenuItems } from "src/data/MenuItems"
import DropdownPc from "src/components/public/DropdownPc"
import Image from "next/image"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Navbar = () => {
  const [click, setClick] = useState(false)
  const [dropdownmo, setDropdownmo] = useState(false)
  const [onMouseTitle, setOnMouseTitle] = useState("")

  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  const onMouseEnter = (title) => {
    setOnMouseTitle(title)
    setDropdownmo(true)
  }
  
  const onMouseLeave = () => {
    setDropdownmo(false)
  }


  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link href="/" passHref>
          <Image
            src="/logo.png"
            height={60}
            width={190}
            alt="대한생활체육회 로고"
            className="navbar-logo-img"
          />
        </Link>
      </div>
      <ul className="navbar-content">
        {MenuItems.map((item, index) => {
          return (
            <>
              {(item.type === "main") && ((item.child) ? (
                <li className="nav-item"
                  key={index}
                  onMouseEnter={() => onMouseEnter(item.title)}
                  onMouseLeave={onMouseLeave}>
                  {item.title} <ArrowDropDownIcon className="arrowdropdown" />
                  {dropdownmo && (item.title===onMouseTitle &&<DropdownPc mainTitle={onMouseTitle} />)}
                </li>
              ) : (
                  <li className="nav-item" key={index}>
                    <Link href={item.path} className="nav-links" onClick={closeMobileMenu}>{item.title}</Link>
                  </li>
              ))}
            </>
          )
        })}
      </ul>
    </div>
  );
};

export default Navbar;
