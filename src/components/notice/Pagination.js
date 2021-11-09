import React, { useEffect, useState } from "react"
import { firestore as db } from "src/components/firebase"
import style from "styles/notice/pagination.module.css"
import Link from "next/link"
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const Pagination = (props) => {
  const [pageList, setPageList] = useState([])
  const [warpPage, setWarpPage] = useState([])
  useEffect(async() => {
    let firstPage;
    let endPage
    let tempPageList = []
    let tempWarpPage=[]
    await db.collection('postCount').doc(props.docName).get().then((doc) => {
      let pageCount;
      if (doc.data().count % 9 !== 0)
        pageCount = doc.data().count/9 + 1
      else
        pageCount = doc.data().count / 9
      if (props.page < 4 && pageCount<=7) {
        firstPage = 1
        endPage = pageCount
        tempWarpPage.push(0)
        tempWarpPage.push(0)
      } else if (props.page < 4 && pageCount > 7) {
        firstPage = 1
        endPage = 7
        tempWarpPage.push(0)
        tempWarpPage.push(8)
      } else if (props.page >= 4 && pageCount <= 7) {
        firstPage = 1
        endPage = pageCount
        tempWarpPage.push(0)
        tempWarpPage.push(0)
      } else if (props.page >= 4 && pageCount > 7 && pageCount > props.page + 3) {
        firstPage = props.page-3
        endPage = props.page + 3
        tempWarpPage.push(props.page-4)
        tempWarpPage.push(props.page+4)
      } else if (props.page >= 4 && pageCount > 7 && pageCount <= props.page + 3) {
        firstPage = pageCount -6
        endPage = pageCount
        tempWarpPage.push(pageCount -7)
        tempWarpPage.push(0)
      }
      for (let i = firstPage; i <= endPage; i++){
        tempPageList.push(i)
      }
      setPageList(tempPageList)
      setWarpPage(tempWarpPage)
    })
  },[props])
  return (
    <ul className={style.pagination}>
      {warpPage && (warpPage[0] !== 0 &&
        <Link href='/notice/[filename]/[page]' as={`/notice/${props.docName}/${warpPage[0]}`}>
          <li className={style.page}><ArrowLeftIcon /></li>
        </Link>
      )}
      {pageList.map((page, index) => {
        return (
          <>
            {
              page === props.page ? (
                <li key={index} className={`${style.currentPage} ${style.page}`}>{page}</li>
              ):(
              <Link key={index} href='/notice/[filename]/[page]' as={`/notice/${props.docName}/${page}`}>
                <li className={style.page}>{page}</li>
              </Link>
            )}
          </>
        )
      })}
      {warpPage && (warpPage[1] !== 0 &&
        <Link href='/notice/[filename]/[page]' as={`/notice/${props.docName}/${warpPage[1]}`}>
          <li className={style.page}><ArrowRightIcon /></li>
        </Link>
      )}
    </ul>
  )
}

export default Pagination;