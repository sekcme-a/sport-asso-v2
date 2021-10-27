import React, {useEffect, useState} from 'react'
import style from "styles/notice/loadPhoto.module.css"
import { firestore as db } from "src/components/firebase"
import Link from "next/link"

const LoadPhoto = (props) => {
  const [listData, setListData] = useState([])
  const [pg, setPg] = useState(1)
  let fetchedList;
  let prevList;
  let tempData = [];
  useEffect(async () => {
    setPg(parseInt(props.page))
  },[props])
  useEffect(async () => {
    if (pg === 1) {
      fetchedList = await (db.collection("photo")
        .orderBy("createdAt", "desc")
        .limit(6))
      if (fetchedList !== undefined) {
        fetchedList.get().then((data) => {
          data.forEach((doc) => {
            tempData = ([
              ...tempData,
              {
                title: doc.data().title,
                uid: doc.data().uid,
                id: doc.id,
                thumbnail: doc.data().thumbnail
              }
            ])
          })
          setListData(tempData)
        })
      }
    }
    if(pg!==1){
      prevList = await (db.collection("photo")
        .orderBy("createdAt", "desc")
        .limit(6 * (pg - 1)))
      
      await prevList.get().then(async (snap) => {
        let lastVis = snap.docs[snap.docs.length - 1]

        fetchedList = await db.collection("photo")
          .orderBy("createdAt","desc")
          .startAfter(lastVis)
          .limit(6)
      })

      if (fetchedList !== undefined) {
        fetchedList.get().then((data) => {
          data.forEach((doc) => {
            tempData = ([
              ...tempData,
              {
                title: doc.data().title,
                uid: doc.data().uid,
                id: doc.id,
                thumbnail: doc.data().thumbnail
              }
            ])
          })
          setListData(tempData)
        })
      }
    }
  },[pg])



  return (
    <ul className={style.imageContainer}>
      {listData.map((item, index) => {
        return (
          <Link key={index} href='/article/[filename]/[page]/[id]' as={`/article/photo/${pg}/${item.id}`}>
            <li className={style.imgTable}>
              <div className={style.imgTitle}><h4>{item.title}</h4></div>
              {item.thumbnail && (
                <img src={item.thumbnail} alt={item.title} className={style.imgImg}/>
              )}
            </li>
          </Link>
        )
      })}
      {/* <Link className="notice-link" href='/article/[filename]/[id]'as={`/article/photo/${item.id}`>
        <li className="img-table">
          <div className="img-title"><h4>{props.title}</h4></div>
          {props.img && (<img className="img-img" src={`img/${props.img[0]}`} alt={props.title}/>)}
        </li>
      </Link> */}
    </ul>
  )
}

export default LoadPhoto