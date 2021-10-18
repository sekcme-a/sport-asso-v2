import React, {useEffect, useState} from "react"
import { MenuItems } from "data/MenuItems"
import { useRouter } from "next/router"
import Header from "src/components/public/Header"
import Head from "next/head"
import NavbarVertical from "src/components/public/NavbarVertical"
import style from "styles/article.module.css"
import { firestore as db } from "src/components/firebase"
import Link from "next/link"
import dynamic from 'next/dynamic'
import DownloadIcon from '@mui/icons-material/Download';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'align',
]


const ShowArticle = () => {
  const router = useRouter();
  const { ...data } = router.query
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [postTitle, setPostTitle] = useState("")
  const [postFilesData, setPostFilesData] = useState([])
  const [postContent, setPostContent] = useState("")
  const [hasPostFile, setHasPostFile] = useState(false)
  const [author, setAuthor] = useState("")
  const [createdAt, setCreatedAt] = useState("")

  useEffect(async () => {
    setHasPostFile(false)
    MenuItems.forEach((item) => {
      if (item.path === `/notice/${data.filename}`) {
        setTitle(item.title)
        setSubtitle(item.subtitle)
        return;
      }
    })
    if (data.filename) {
      db.collection(data.filename).doc(data.id).get().then((doc) => {
        let tempFilesListData = []
        setPostFilesData(tempFilesListData)
        let tempData;
        const tempFileData = doc.data().files.split("URLENDPOINT")
        const d = new Date(doc.data().createdAt.toMillis())
        const date = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()
        setCreatedAt(date)
        setAuthor(doc.data().author)
        for (let i = 0; i < tempFileData.length; i++) {
          tempData = tempFileData[i].split("URLSTARTPOINT")
          tempFilesListData = [
            ...tempFilesListData,
            {
              name: tempData[0],
              url: tempData[1],
            }
          ]
        }
        setPostFilesData(tempFilesListData)
        // if (postFilesData !== undefined) {
        //   postFilesData.forEach((data) => {
        //     if(data.name!=="")
        //       setHasPostFile(true)
        //   })
        // }
        setPostTitle(doc.data().title)
        setPostContent(doc.data().post)
      })
    }
  }, [data.filename])

  useEffect(() => {
    if (postFilesData !== undefined) {
      postFilesData.forEach((data) => {
        if(data.name!=="")
          setHasPostFile(true)
      })
    }
  },[postFilesData])
  
  return (
    <>
      <Head>
        <title>{`대한생활체육회|${subtitle} - ${postTitle}`}</title>
        <meta name="description" content={`${postTitle} - 국민의 건강과 행복의 장을 여는 대한생활체육회`} />
        <meta property="og:title" content={`대한생활체육회|${subtitle}`}/>
        <meta property="og:description" content={`(사)대한생활체육회 단체소개-${subtitle} - 국민의 건강과 행복의 장을 여는 대한생활체육회`}></meta>
      </Head>

      <Header nav={`${title}`} />
      <div className="body">
        <div className="body-container">
          <div className="content-container">
            {/* <div className="menu-container">
              <h3 className="menu-result">{postTitle}</h3>
              <div className="menu-border"></div>
            </div> */}
            <div className={`content ${style.articleContainer}`}>
              <h4 className={style.postTitle}>{postTitle}</h4>
              <h6 className={style.postAuthor}>{author} | {createdAt}</h6>
              {hasPostFile && (
                <ul className={style.fileContainer}>
                  <p>첨부파일</p>
                  {postFilesData.map((data, index) => {
                    if (data.url !== undefined) {
                      return (
                        <Link href={data.url}>
                          <li key={index} className={style.fileName}>
                            <DownloadIcon className={style.downloadIcon}/>
                            {data.name}
                          </li>
                        </Link>
                      )
                    }
                  })}
                </ul>
              )}
              <QuillNoSSRWrapper value={postContent} readOnly={true} theme="bubble" />
              
            </div>
            <div className={style.buttonContainer}>
              <Link href={`/notice/${data.filename}`}>
                <div className={style.button} >돌아가기</div>
              </Link>
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}

export default ShowArticle