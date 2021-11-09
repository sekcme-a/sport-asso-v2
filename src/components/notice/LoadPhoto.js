import React, {useEffect, useState} from 'react'
import style from "styles/notice/loadPhoto.module.css"
import { firestore as db } from "src/components/firebase"
import Link from "next/link"
import Pagination from "src/components/notice/Pagination"

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
      setTimeout(async()=>{
        fetchedList = await (db.collection("photo")
          .orderBy("createdAt", "desc")
          .limit(9))
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
      },450)
    }
    if(pg!==1){
      prevList = await (db.collection("photo")
        .orderBy("createdAt", "desc")
        .limit(9 * (pg - 1)))
      
      await prevList.get().then(async (snap) => {
        let lastVis = snap.docs[snap.docs.length - 1]

        fetchedList = await db.collection("photo")
          .orderBy("createdAt","desc")
          .startAfter(lastVis)
          .limit(9)
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
    <>
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
      </ul>
      <Pagination docName="photo" page={pg} />
    </>
  )
}

export default LoadPhoto