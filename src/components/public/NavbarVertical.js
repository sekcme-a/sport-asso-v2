import React, { useState } from "react";
import Link from "next/link";
import { MenuItems } from "data/MenuItems";

const NavbarVertical = (props) => {
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
  return (
    <div className="NavVerticalContainer">
      <div className="NavVertical">
        <div className="navLoc">
          <h4>{props.loc}</h4>
        </div>
        <div className="navList">
        {MenuItems.map((item, index) => {
            return (
              <>
                {(item.title === props.loc) && item.subtitle && (
                  <div key={index} className="navItem">
                    <div className="navLink">
                      {item.path.includes("notice") ?
                        <Link href={"/notice/[subtitle]/[page]"} as={`${item.path}/1`} >{item.subtitle}</Link>
                        :
                        <Link href={item.path}>{item.subtitle}</Link>
                      }
                    </div>
                  </div>
                )}
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NavbarVertical;