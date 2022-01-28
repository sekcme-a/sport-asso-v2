import React, { useState } from "react";
import { MenuItems } from "src/data/MenuItems";
import Link from "next/link";

function DropdownPc(props) {
  const [click, setClick] = useState(false)
  const handleClick = () => setClick(!click)

  return (
    <>
      <ul onClick={handleClick}
        className={click ? 'dropdown-menu clicked' : 'dropdown-menu'} >
        {MenuItems.map((item, index) => {
          return (
            <>
              {(item.title === props.mainTitle) && ((item.type === "sub") && (
                item.highlight === "link" ?
                  <li key={index}>
                    <Link href="http://ksfaa.co.kr">
                      <a className="dropdown-link" target='_blank' onClick={() => setClick(false)}>
                        {item.subtitle}
                      </a>
                    </Link>
                  </li>
                  : 
                item.path.includes("notice") ?
                  <li key={index}>
                    <Link
                      className="dropdown-link"
                      href={"/notice/[subtitle]/[page]"}
                      as={`${item.path}/1`}
                      passHref
                      onClick={() => setClick(false)}
                    >
                      <div className="dropdown-link">
                        {item.subtitle}
                      </div>
                    </Link>
                  </li>
                  :
                  <li key={index}>
                    <Link
                      className="dropdown-link"
                      href={item.path}
                      passHref
                      onClick={() => setClick(false)}
                    >
                      <div className="dropdown-link">
                        {item.subtitle}
                      </div>
                    </Link>
                  </li>
            ))}
            
            </>
          )
        })}
        {}
      </ul>

    </>
  )
}

export default DropdownPc;