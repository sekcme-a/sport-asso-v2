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
              <li key={index}>
                <Link
                  className="dropdown-link"
                  href={item.path}
                  as={item.path}
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