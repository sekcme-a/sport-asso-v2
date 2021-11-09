import React, { useEffect, useState} from "react"
import { firestore as db } from "src/components/firebase"
import Link from "next/link"
import style from "styles/notice/Notice.module.css"
import Pagination from "src/components/notice/Pagination"

const LoadPost = (props) => {
  const [listData, setListData] = useState([])
  let fetchedList;
  let prevList;
  let tempData = [];

  useEffect(() => {
    const fetchData = async () => {
      console.log(props.folderName, props.page)
      setListData(tempData)
      if (props.page === 1) {
        setTimeout(() => {
          fetchedList = (db.collection(props.folderName)
            .orderBy("createdAt", "desc")
            .limit(9))
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
              console.log(listData)
            })
          }
        },0)
      }
      else if (props.page !== 1) {
        prevList = (db.collection(props.folderName)
          .orderBy("createdAt", "desc")
          .limit(9 * (props.page - 1)))
        
        await prevList.get().then(async (snap) => {
          let lastVis = snap.docs[snap.docs.length - 1]
          if (lastVis !== undefined) {
            fetchedList = db.collection(props.folderName)
              .orderBy("createdAt", "desc")
              .startAfter(lastVis)
              .limit(9)
          }
        })
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
            console.log(listData)
          })
        }
      }
    }
    fetchData();
  },[props])


  return (
    <>
      <ul className={style.noticeContainer}>
        {listData.map((item, index) => {
          return (
            <Link key={index} href='/article/[filename]/[page]/[id]'as={`/article/${props.folderName}/${props.page}/${item.id}`}>
              <li className={style.noticeTable}>
                <h4 className={style.noticeTitle}>{item.title}</h4>
                <h6 className={style.noticeInfo}>{`${item.author} | ${item.createdAt}`}</h6>
              </li>
            </Link>
          )
        })}
      </ul>
      <Pagination docName={props.folderName} page={props.page} />
    </>
  )
}

export default LoadPost;