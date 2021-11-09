import React, {useEffect, useState} from 'react'
import style from "styles/notice/loadPhoto.module.css"
import { firestore as db } from "src/components/firebase"
import Link from "next/link"
import Pagination from "src/components/notice/Pagination"

const LoadPhoto = (props) => {
  const [listData, setListData] = useState([])
  let fetchedList;
  let prevList;
  let tempData = [];
  useEffect(async () => {
    if (props.page === 1) {
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
    }
    if(props.page!==1){
      prevList = await (db.collection("photo")
        .orderBy("createdAt", "desc")
        .limit(9 * (props.page - 1)))
      
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
  },[props.page])



  return (
    <>
      <ul className={style.imageContainer}>
        {listData.map((item, index) => {
          return (
            <Link key={index} href='/article/[filename]/[page]/[id]' as={`/article/photo/${props.page}/${item.id}`}>
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
      <Pagination docName="photo" page={props.page} />
    </>
  )
}

export default LoadPhoto