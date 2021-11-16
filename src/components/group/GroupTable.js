import React, {useState, useEffect} from 'react'
import style from "styles/group/Group.module.css"
import {firestore, storage as db} from "src/components/firebase"

const GroupTable = (props) => {
  let id = -1;
  let num = 0;
  const [GroupData, setGroupData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(async() => {
    const res = props.data
    setGroupData(res)
    setLoading(false)
  }, [props])
  
  const getId = (groupName) => {
    for (let i = 0; i < GroupData.length; i++){
      if (GroupData[i].groupName === groupName) {
        id = i;
        break;
      }
    }
  }
  const lookClose = (img) => {
    let obj;
    let storageRef = db.ref()
    storageRef.child(`profile/${img}`).getDownloadURL().then((url) => {
      obj = window.open(url, "", "width=400, height=600, location=no, fullscreen=no,")
      // setImgUrl(url)
    }).catch((e)=>{console.log(e)})
  
  }
  return (
    <>
      {loading ? <h4> </h4> :
        <div className={style.nationTable}>
          {getId(props.groupName)}
          <div className={style.nationItem}>
            <p className={style.nationItemTitle}>회장</p>
            <p className={style.nationItemContent}>{GroupData[id].leader}{GroupData[id].img && <container className={style.groupLookClose} onClick={() => { lookClose(GroupData[id].img) }}>자세히보기</container>}</p>
          </div>
          {GroupData[id].titleData!==undefined && GroupData[id].titleData.map((item, index) => {
            return (
              <div className={style.nationItem} key={index}>
                {item === "홈페이지" ? (
                  <>
                    <p className={style.nationItemTitle}>홈페이지</p>
                    <a href={`https://${GroupData[id].contentData[num]}`}>{GroupData[id].contentData[num]}</a>
                    <div className={style.hide}>{num++}</div>
                  </>
                ) : (
                  <>
                    <p className={style.nationItemTitle}>{item}</p>
                    <p className={style.nationItemContent}>{GroupData[id].contentData[num]}</p>
                    <div className={style.hide}>{num++}</div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      }
    </>
  )
}

export default GroupTable;