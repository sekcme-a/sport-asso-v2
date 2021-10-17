import React, {useEffect, useState} from "react"
import { MenuItems } from "data/MenuItems"
import { useRouter } from "next/router"
import Header from "src/components/public/Header"
import Head from "next/head"
import NavbarVertical from "src/components/public/NavbarVertical"
import style from "styles/article.module.css"
import { firestore as db } from "src/components/firebase"
import Link from "next/link"
const ShowArticle = () => {
  const router = useRouter();
  const { ...data } = router.query
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [postFilesData, setPostFilesData] = useState([])
  const [postContent, setPostContent] = useState("")
  const [hasPostFile, setHasPostFile] = useState(false)

  useEffect(async () => {
    MenuItems.forEach((item) => {
      if (item.path === `/notice/${data.filename}`) {
        setTitle(item.title)
        setSubtitle(item.subtitle)
        return;
      }
    })
    if (data.filename !== null) {
      db.collection(data.filename).doc(data.id).get().then((doc) => {
        const tempFileData = doc.data().files.split("URLENDPOINT")
        let tempData;
        for (let i = 0; i < tempFileData.length; i++) {
          tempData = tempFileData[i].split("URLSTARTPOINT")
          setPostFilesData([
            ...postFilesData,
            {
              name: tempData[0],
              url: tempData[1]
            }
          ])
        }
        if (tempFileData[0] !== "") {
          setHasPostFile(true)
        }
        setPostTitle(doc.data().title)
        setPostContent(doc.data().post)
      })
    }
  }, [])

  
  return (
    <>
      <Head>
        <title>{`대한생활체육회|${subtitle}`}</title>
        <meta name="description" content={`(사)대한생활체육회 단체소개-${subtitle} - 국민의 건강과 행복의 장을 여는 대한생활체육회`} />
        <meta property="og:title" content={`대한생활체육회|${subtitle}`}/>
        <meta property="og:description" content={`(사)대한생활체육회 단체소개-${subtitle} - 국민의 건강과 행복의 장을 여는 대한생활체육회`}></meta>
      </Head>

      <Header nav={`${title}`} />
      <div className="body">
        <div className="body-container">
          <div className="content-container">
            <div className="menu-container">
              <h3 className="menu-result">{subtitle}</h3>
              <div className="menu-border"></div>
            </div>
            <div className="content">
              <h4 className={style.postTitle}>{postTitle}</h4>
              {hasPostFile && (
                <ul className={style.fileContainer}>
                  <p>첨부파일</p>
                  {console.log(postFilesData)}
                  {postFilesData.map((data, index) => {
                    if (data.url !== undefined) {
                      return (
                        <Link href={data.url}>
                          <div key={index} className={style.fileName}>{data.name}</div>
                        </Link>
                      )
                    }
                  })}
                </ul>
              )}
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}

export default ShowArticle