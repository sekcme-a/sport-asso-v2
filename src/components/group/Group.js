import React, {useState, useEffect} from 'react'
import GroupTable from "src/components/group/GroupTable"
import { GroupData } from "src/data/GroupData"
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import style from "styles/group/Group.module.css"

const Group = (props) => {
  const [focused, setFocused] = useState("null")

  const onClick = (groupName) => {
    if (groupName === focused)
      setFocused("null")
    else {
      setFocused(groupName);
    }
  }

  return (
    <>
      <div className={style.nationBox}>
        {GroupData.map((item, index) => {
          if (item.dataType === props.type)
            return (
              <>
                <div className={style.nationTitle} key={index}>
                  <h4>{item.groupName}</h4>
                  <div className={style.nationSpread} onClick={() => { onClick(item.groupName) }}>
                    <i><PhoneIcon /></i>
                    <h6>{item.phone}</h6>
                    {focused === item.groupName ? (<i onClick={() => { onClick(item.groupName) }}><ArrowDropUpIcon /></i>) : (
                      <i><ArrowDropDownIcon /></i>
                    )}
                  </div>
                </div>
                {focused === item.groupName && (<GroupTable groupName={item.groupName} />)}
              </>
            )
        })}
      </div>
    </>
  )
}

export default Group