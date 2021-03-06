import React, { useState, useContext ,useEffect } from "react";
import Link from "next/link";
import { MenuItems } from "src/data/MenuItems"
import DropdownPc from "src/components/public/DropdownPc"
import Image from "next/image"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { UserContext } from "src/context";
import { auth } from "../firebase";
import Router from "next/router"

const Navbar = () => {
  const [click, setClick] = useState(false)
  const [dropdownmo, setDropdownmo] = useState(false)
  const [onMouseTitle, setOnMouseTitle] = useState("")
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

  const { user, username } = useContext(UserContext);

  const handleClick = () => setClick(!click)
  const closeMobileMenu = () => setClick(false)

  const onMouseEnter = (title) => {
    setOnMouseTitle(title)
    setDropdownmo(true)
  }
  
  const onMouseLeave = () => {
    setDropdownmo(false)
  }

  const logoutClick = () => {
    auth.signOut()
    setIsUserLoggedIn(false)
    Router.push("/")
  }

  useEffect(() => {
    if (user) {
      setIsUserLoggedIn(true)
    } else
      setIsUserLoggedIn(false)
  }, [user])
  


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
        <Link href="http://ksfaa.co.kr"><a className="nav-item log-out" target="_blank">회원가입 및 회원증 확인</a></Link>
        {isUserLoggedIn && <li className="nav-item log-out" onClick={logoutClick}>로그아웃</li>}
      </ul>
    </div>
  );
};

export default Navbar;
