import React, { useEffect, useState} from "react"
import { firestore as db } from "src/components/firebase"
import Link from "next/link"
import style from "styles/notice/Notice.module.css"

const LoadPost = (props) => {
  const [listData, setListData] = useState([])
  let fetchedList;
  let tempData = [];
  useEffect(async () => {
    setListData(tempData)
    if (props.page === 1 && props.folderName) {
      fetchedList = await (db.collection(props.folderName)
        .orderBy("createdAt", "desc")
        .limit(12))
      if (fetchedList !== undefined) {
        fetchedList.get().then((data) => {
          data.forEach((doc) => {
            const d = new Date(doc.data().createdAt.toMillis())
            const date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
            tempData = ([
              ...tempData,
              {
                title: doc.data().title,
                uid: doc.data().uid,
                author: doc.data().author,
                createdAt: date,
                id: doc.id,
              }
            ])
          })
          setListData(tempData)
        })
      }
    }
  },[props])


  return (
    <ul className={style.noticeContainer}>
      {listData.map((item, index) => {
        return (
          <Link key={index} href='/article/[filename]/[id]'as={`/article/${props.folderName}/${item.id}`}>
            <li className={style.noticeTable}>
              <h4 className={style.noticeTitle}>{item.title}</h4>
              <h6 className={style.noticeInfo}>{`${item.author} | ${item.createdAt}`}</h6>
            </li>
          </Link>
        )
      })}
    </ul>
  )
}

export default LoadPost;