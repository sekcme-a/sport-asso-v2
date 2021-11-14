import React, { useState, useEffect, useContext } from "react"
import dynamic from 'next/dynamic'
import { useRouter } from "next/router"
import { useLeavePageConfirm } from "src/hooks/useLeavePageConfirm"
import { UserContext } from "src/context";
import { CompressImage } from "src/hooks/CompressImage"
import CachedIcon from '@mui/icons-material/Cached';
import { FileUpload } from "src/firebase/FileUpload"
import { FileDelete } from "src/firebase/FileDelete"
import { firestore as db } from "src/components/firebase"
import { controlPostCount } from "src/firebase/controlPostCount"

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

const Editpost = () => {
  const router = useRouter();
  const { ...data } = router.query
  const [title, setTitle] = useState("")
  const [checkedList, setCheckedList] = useState([])

  const [fileUrl, setFileUrl] = useState("")
  const [fileList, setFileList] = useState([])
  const [prevFileList, setPrevFileList] = useState([])

  const [imgHTML, setImgHTML] = useState("")
  const [imgList, setImgList] = useState([])

  const [textData, setTextData] = useState("")

  const [uid, setUid] = useState("")

  const onChange = (notes) => {
    setTextData(notes)
  }

  const [post, setPost] = useState("")

  const { user, username, userrole } = useContext(UserContext)

  useLeavePageConfirm()

  useEffect(async () => {
    let tempTextData;
    let tempString;
    let tempArr = [];
    let tempFileData = [];
    if (data.filename) {
      await db.collection(data.filename).doc(data.id).get().then((doc) => {
        setTitle(doc.data().title)
        setUid(doc.data().uid)
        tempTextData = doc.data().post
        if (doc.data().files !== "") {
          tempString = doc.data().files
        }
      })
      tempTextData = tempTextData.replaceAll(`<img src=`,`&lt;img src=`)
      tempTextData = tempTextData.replaceAll(`.jpg">`,`.jpg" &gt;`)
      tempTextData = tempTextData.replaceAll(`.png">`,`.png" &gt;`)
      tempTextData = tempTextData.replaceAll(`.git">`,`.git" &gt;`)
      tempTextData = tempTextData.replaceAll(`.jpeg">`,`.jpeg" &gt;`)
      tempTextData = tempTextData.replaceAll(`.bmp">`,`.bmp" &gt;`)
      if (tempString !== undefined) {
        tempArr = tempString.split("URLENDPOINT")
        for (let i = 0; i < tempArr.length; i++) {
          let res = tempArr[i].split("URLSTARTPOINT")
          if (res[0] !== "") {
            tempFileData = [
              ...tempFileData,
              {
                name: res[0],
                url: res[1]
              }
            ]
          }
        }
      }
    }
    setPrevFileList(tempFileData)
    setTextData(tempTextData)
  },[data.filename])

  const onFileChange = (e) => {
    if (e.target.files[0] !== undefined) {
      if (e) {
        setFileList([
          ...fileList,
          {
            file: e.target.files[0]
          }
        ])
      }
    }
  }
  const onImgChange = async (e) => {
    const imgId = Math.floor(Math.random() * 100000000000000000000000000001)
    let CompressedFile;
    let imgCustomHTML
    if(e.target.files[0] !==undefined)
      imgCustomHTML = `image<${e.target.files[0].name}-${imgId} width="400" height="300" alt="${e.target.files[0].name}">image`
    setImgHTML(imgCustomHTML)
    if (e.target.files[0] !== undefined) {
      if (checkIsImage(e.target.files[0].name)) {
        if (!checkIsImageSize(e.target.files[0].size)) {
          CompressedFile = await CompressImage(e.target.files[0])
        } else {
          CompressedFile = e.target.files[0]
        }
        const reader = new FileReader();
        reader.readAsDataURL(CompressedFile)
        reader.onloadend = () => {
          setImgList([
            ...imgList,
            {
              imgData: CompressedFile,
              imgHTML: imgCustomHTML,
              base64data: reader.result,
            }
          ])
        }
      }
    }
  }


  //이미지의 크기가 2MB이하인지 확인 후, 아니라면 압축할지 물어본뒤 압축진행.
  const checkIsImageSize = (img) => {
    const maxSize = 2 * 1024 * 1024; //3MB
    if (img > maxSize) {
      return false;
    }
    else
      return true
  }

  //업로드한게 이미지가 맞는지 확인
  const checkIsImage = (file) => {
    const pathpoint = file.lastIndexOf('.')
    const filepoint = file.substring(pathpoint+1,file.length)
    const filetype = filepoint.toLowerCase();
    if (filetype == 'jpg' || filetype == 'png' || filetype == 'git' || filetype == 'jpeg' || filetype == 'bmp') {
      return true;
    } else {
      alert("이미지 파일만 선택할 수 있습니다.\n (.jpg .gif .png .jpeg .bmp)")
      return false;
    }
  }

  const onFileListDeleteClick = (file) => {
    let FL = [...fileList]
    let i = 0;
    FL.forEach((item) => {
      if(item!==undefined)
        if (item.file.name === file)
          delete FL[i]
      i++
    })
    setFileList([...FL])
  }

  const uploadImages = async () => {
    let text = textData
    let x;
    let imgsURL = []
    return new Promise(async function (resolve, reject) {
      for (let i = 0; i < imgList.length; i++) {
        let newImgHTML = imgList[i].imgHTML
        if (typeof (newImgHTML) === "string") {
          const splitedHTML = newImgHTML.split("width")
          newImgHTML = splitedHTML[0]
          newImgHTML = newImgHTML.replace('image<', 'image&lt;')
          newImgHTML = newImgHTML.replace('>image', '&gt;image')
          if (text.includes(newImgHTML)) {
            x = await FileUpload("images", imgList[i].imgData, uid)
            imgsURL.push(`${imgList[i].imgData.name}URLSTARTPOINT${x}`)
          }
        }
      }
      resolve(imgsURL)
    })
  }

  const uploadFiles = async () => {
    let x;
    let filesURL="";
    return new Promise(async function (resolve, reject) {
      for (let i = 0; i < prevFileList.length; i++){
        if (prevFileList[i] !== undefined) {
          filesURL += `${prevFileList[i].name}URLSTARTPOINT${prevFileList[i].url}URLENDPOINT`
        }
      }
      for (let i = 0; i < fileList.length; i++){
        if (fileList[i] !== undefined) {
          x = await FileUpload("files", fileList[i].file, uid)
          filesURL += `${fileList[i].file.name}URLSTARTPOINT${x}URLENDPOINT`
        }
      }
      resolve(filesURL)
    })
  }


  const uploadTo = () => {
    let itemList = []
    let cac = []
    checkedList.forEach((item) => {
      if (item !== undefined) {
        if (typeof (item.path) === "string") {
          cac = item.path.split('/')
          if (!itemList.includes(cac[2]))
            itemList.push(cac[2])
        }
      }
    })
    return itemList
  }

  const onSubmit = async (event) => {
    //날짜 가져오기 2021/12/25 이렇게 (겁나중요)
    // const ts1 = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()
    event.preventDefault();
    const lists = uploadTo()
    let imgsURL = []
    let filesURL;
    let postText;
    let thumbnailStart;
    let thumbnailEnd = 99999999999;
    let thumbnailURL
    let tempInt;
    let temp;
    if (title) {
      imgsURL = await uploadImages();
      postText = changePostText(imgsURL)
      thumbnailStart = postText.indexOf(`<img src="`) + 10
      tempInt = postText.indexOf(`.jpg">`)
      thumbnailEnd = postText.indexOf(` alt="`)-1
      if (postText.charAt(thumbnailEnd) === `"`)
        thumbnailEnd -= 1
      if (postText.indexOf(`<img src="`) === -1)
        thumbnailURL = ""
      else
        thumbnailURL = postText.substring(thumbnailStart,thumbnailEnd)
      // filesURL = await uploadFiles();
      // uploadToFirebase([업로드collection경로],[업로드document경로(자동ID로할꺼면null)],업로드할 내용 hashmap)
      const resultOfUploadFiles = await uploadFiles();
      const postHashMap = {
        title: title,
        createdAt: new Date(),
        author: username,
        files: resultOfUploadFiles,
        uid: user.uid,
        post: postText,
      }
      const imageHashMap = {
        title: title,
        createdAt: new Date(),
        author: username,
        files: resultOfUploadFiles,
        uid: user.uid,
        post: postText,
        thumbnail: thumbnailURL,
      }
      let uploadToPhoto = false
      if (data.filename==="photo") {
        if (imageHashMap.thumbnail === "") {
          alert("포토갤러리에는 적어도 1개 이상의 사진이 업로드되어야합니다!")
          return;
        }
      }
      if(data.filename==="photo")
        db.collection(data.filename).doc(data.id).set(imageHashMap)
      else
        db.collection(data.filename).doc(data.id).set(postHashMap)

      setTitle("")
      setFileList([])
      setPost([])
      setTextData("")
      setImgHTML("")
      alert("업로드가 완료됬습니다!")
      router.push(`/`)
    } else
      alert("제목을 입력해주세요.")
  }


  const changePostText = (imgsURL) => {
    let text = textData;
    imgList.forEach((img) => {
      let newImgHTML = img.imgHTML
      if (typeof (newImgHTML) === "string") {
        const splitedHTML = newImgHTML.split("width")
        newImgHTML = splitedHTML[0]
        newImgHTML = newImgHTML.replace('image<', 'image&lt;')
        newImgHTML = newImgHTML.replace('>image', '&gt;image')
        while (text.includes(newImgHTML)) {
          for (let i = 0; i < imgsURL.length; i++) {
            const imgsURLSplit = imgsURL[i].split("URLSTARTPOINT")
            if (newImgHTML.includes(imgsURLSplit[0])) {
              text = text.replace(newImgHTML, `<img src="${imgsURLSplit[1]}" alt="${imgsURLSplit[0]}"`)
              text = text.replace('&gt;image', '>')
            }
          }
        }
      }
    })
    text = text.replaceAll(`&lt;img src=`,`<img src=`)
    text = text.replaceAll(`.jpg" &gt;`,`.jpg">`)
    text = text.replaceAll(`.png" &gt;`,`.png">`)
    text = text.replaceAll(`.git" &gt;`,`.git">`)
    text = text.replaceAll(`.jpeg" &gt;`,`.jpeg">`)
    text = text.replaceAll(`.bmp" &gt;`,`.bmp">`)
    return text
  }

  const onPreviewClick = () => {
    let text = textData
    imgList.forEach((img) => {
      let newImgHTML = img.imgHTML
      const splitedHTML = newImgHTML.split("width")
      newImgHTML = splitedHTML[0]
      newImgHTML = newImgHTML.replace('image<', 'image&lt;')
      newImgHTML = newImgHTML.replace('>image', '&gt;image')
      while (text !== text.replace(newImgHTML, `<img src="${img.base64data}"`)) {
        text = text.replace(newImgHTML, `<img src="${img.base64data}"`)
        text = text.replace('&gt;image','>')
      }
    })
    // while (text.includes("image&lt;"))
    //   text = text.replace("image&lt;", `<img src="`)
    // while (text.includes("&gt;image"))
    //   text = text.replace("&gt;image", ">")
    text = text.replaceAll(`&lt;img src=`,`<img src=`)
    text = text.replaceAll(`.jpg" &gt;`,`.jpg">`)
    text = text.replaceAll(`.png" &gt;`,`.png">`)
    text = text.replaceAll(`.git" &gt;`,`.git">`)
    text = text.replaceAll(`.jpeg" &gt;`,`.jpeg">`)
    text = text.replaceAll(`.bmp" &gt;`,`.bmp">`)
    setPost(text)
  }

  const onTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const onPrevFileListDeleteClick = (url) => {
    let tempFileList = [...prevFileList]
    for (let i = 0; i < prevFileList.length; i++){
      if (tempFileList[i] !== undefined) {
        if (tempFileList[i].url === url) {
          FileDelete("files", tempFileList[i].name, uid)
          delete tempFileList[i]
          console.log(tempFileList)
          break;
        }
      }
    }
    setPrevFileList(tempFileList)
  }

  const onDeleteClick = async () => {
    prevFileList.forEach((item) => {
      if (item !== undefined) {
        onPrevFileListDeleteClick(item.url)
      }
    })
    fileList.forEach((item) => {
      if (item !== undefined) {
        onFileListDeleteClick(item.file.name)
      }
    })
    await db.collection(data.filename).doc(data.id).delete().then(() => {
      controlPostCount(data.filename, "remove")
      alert("성공적으로 삭제되었습니다!")
      router.push(`/`)
    }).catch((e) => {
      console.log(e)
    })
  }

  return (
    <div className="post-container">
      {userrole === "admin" || userrole === "author" ? (
        <>
          <form name="post">
            <div className="post-title">
              제목 : <input type="text" name="title" value={title} onChange={onTitleChange} placeholder="제목을 입력하세요" required />
            </div>
            첨부파일 : <input type="file" name="selectedFile[]" onChange={onFileChange} /><br />
            {prevFileList && prevFileList.map((item, index) => {
              if (item !== undefined) {
                return (
                  <h4 key={index} className="file-list">{item.name}<h4 className="file-list-delete" onClick={() => { onPrevFileListDeleteClick(item.url) }}>X</h4></h4>
                )
              }
            })}
            {fileList && fileList.map((item, index) => {
              if (item !== undefined) {
                return (
                  <h4 key={index} className="file-list">{item.file.name}<h4 className="file-list-delete" onClick={() => { onFileListDeleteClick(item.file.name) }}>X</h4></h4>
                )
              }
            })}
            사진삽입 : <input type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*"/><br />
            <textarea name="imgURL" value={imgHTML}cols="60" rows="10" readOnly ></textarea><br/>
            <input type="submit" value="업로드" onClick={onSubmit}></input>
            <h4 onClick={onDeleteClick}>삭제</h4>
          </form>
          <QuillNoSSRWrapper onChange={onChange} modules={modules} value={textData} formats={formats} theme="snow" />
          미리보기
          <div className="post-preview" onClick={() => { onPreviewClick() }}><CachedIcon /></div>
          <QuillNoSSRWrapper value={post} readOnly={true} theme="bubble" />
        </>
      ) : (
        <>
          <h4>권한없음</h4>
        </>
      )}
    </div>
  )
}
export default Editpost