import React, { useState } from "react";
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
    <>
      <nav className="navbar">
        <Link href="/" as="/" passHref>
          <Image
            src="/logo.png"
            className="navbar-logo-img"
            height={60}
            width={190}
            alt="대한생활체육회 로고"
          />
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          {MenuItems.map((item, index) => {
            return (
              <>
                {(item.type === "main") && ((item.child) ? (
                  <li className="nav-item"
                    key={index}
                    onMouseEnter={()=>onMouseEnter(item.title)}
                    onMouseLeave={onMouseLeave}>
                    <div className="nav-links" onClick={closeMobileMenu}>
                      {item.title} <ArrowDropDownIcon className="arrowdropdown"/>  {/*Dropdown*/}
                    </div>
                    {dropdownmo && (item.title===onMouseTitle &&<DropdownPc mainTitle={onMouseTitle} />)}
                  </li>
                ) : (
                  <li className="nav-item" key={index}>
                      <Link href={item.path} as={item.path} className="nav-links" onClick={closeMobileMenu}>{item.title}</Link>
                  </li>
                ))}
              </>
            )
          })}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
