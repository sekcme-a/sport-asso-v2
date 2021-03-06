import React, {useState, useEffect} from 'react'
import GroupTable from "src/components/group/GroupTable"
// import { GroupData } from "src/data/GroupData"
import PhoneIcon from '@mui/icons-material/Phone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import style from "styles/group/Group.module.css"
import { firestore as db, storage } from "src/components/firebase"

const Group = (props) => {
  const [focused, setFocused] = useState("null")
  const [GroupData, setGroupData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(async () => {
    let type;
    if(props.type==="NationData") type="nation"
    if(props.type==="InternationData") type="international"
    if(props.type==="SportsData") type="sports"
    if(props.type==="SanhaData") type="sanha"
    if (props.data === undefined) {
      await db.collection("data").doc(type).get().then(async (doc) => {
        const res = JSON.parse(doc.data().data)
        setGroupData(res)
        setLoading(false)
      })
    } else {
      const res = props.data
      setGroupData(res)
      setLoading(false)
    }
  },[props])

  const onClick = (groupName) => {
    if (groupName === focused)
      setFocused("null")
    else {
      setFocused(groupName);
    }
  }

  return (
    <>
      {loading ? <h4>로딩중입니다..</h4> :
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
                  {focused === item.groupName && (<GroupTable groupName={item.groupName} data={GroupData}/>)}
                </>
              )
          })}
        </div>
      }
    </>
  )
}

export default Group