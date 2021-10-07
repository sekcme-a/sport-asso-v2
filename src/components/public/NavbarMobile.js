import React, { useEffect, useState } from "react";
import { MenuItems } from "data/MenuItems"
import Image from "next/image"
import Link from "next/link";
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Navbar = () => {
  const [click, setClick] = useState(false)
  const [titleClick, setTitleClick] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState("")


  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  const onTitleClick = (title) => {
    if (titleClick && selectedTitle===title) {
      setTitleClick(false)
    } else if (titleClick && selectedTitle!==title) {
      setTitleClick(true)
      setSelectedTitle(title)
    } else if (titleClick === false && selectedTitle !== title) {
      setSelectedTitle(title)
      setTitleClick(true)
    } else if (titleClick === false) {
      setTitleClick(true)
    }
  }

  useEffect(() => {
    setClick(false)
  },[])

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo-img">
          <Link href="/" as="/" passHref>
            <Image
              src="/logo.png"
              height={60}
              width={190}
              alt="대한생활체육회 로고"
            />
          </Link>
        </div>
        <div className="menu-icon" onClick={handleClick}>
          {click ? <CloseIcon />:<MenuIcon />}
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          {MenuItems.map((item, index) => {
            return (
              <>
                {(item.type === "main") && ((item.child) ? (
                  <>
                    {titleClick ? (item.title === selectedTitle ? (
                      <li key={index} className="nav-item nav-title-clicked" onClick={()=>onTitleClick(item.title)}>
                        <div className="nav-links title">{`${item.title} `}<ArrowDropUpIcon className="arrowdropdown"/></div>
                      </li>
                    ) : (
                      <li key={index} className="nav-item" onClick={()=>onTitleClick(item.title)}>
                        <div className="nav-links title">{`${item.title} `}<ArrowDropDownIcon className="arrowdropdown"/></div>
                      </li>
                    )
                    ) :
                      <li key={index} className="nav-item" onClick={()=>onTitleClick(item.title)}>
                        <div className="nav-links title">{`${item.title} `}<ArrowDropDownIcon className="arrowdropdown"/></div>
                      </li>
                    }
                  </>
                ) : (
                    <li key={index} className="nav-item">
                      <div className="nav-links">
                        <Link href={item.path} onClick={closeMobileMenu}>{item.title}</Link>
                      </div>
                    </li>
                ))}
                {titleClick && (selectedTitle === item.title && (item.type==="sub" &&
                  <li key={index} className="nav-item nav-subItem">
                    <div className="nav-links">
                      <Link href={item.path} onClick={closeMobileMenu}>{item.subtitle}</Link>
                    </div>
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
