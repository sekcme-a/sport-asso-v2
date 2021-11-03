import React, { useState, useEffect, useContext } from "react"
import dynamic from 'next/dynamic'
import { MenuItems } from 'src/data/MenuItems'
import { Router, useRouter } from "next/router"
import { useLeavePageConfirm } from "src/hooks/useLeavePageConfirm"
import { UserContext } from "src/context";
import { CompressImage } from "src/hooks/CompressImage"
import CachedIcon from '@mui/icons-material/Cached';
import { FileUpload } from "src/firebase/FileUpload"
import { firestore as db } from "src/components/firebase"
import { uploadToFirebase } from "src/firebase/uploadToFirebase"
// import { useBeforeunload } from "react-beforeunload"

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

const Createpost = () => {
  const [title, setTitle] = useState("")
  const [checkedList, setCheckedList] = useState([])

  const [fileUrl, setFileUrl] = useState("")
  const [fileList, setFileList] = useState([])

  const [imgHTML, setImgHTML] = useState("")
  const [imgList, setImgList] = useState([])

  const [textData, setTextData] = useState("")

  const router = useRouter();

  const onChange = (notes) => {
    setTextData(notes)
  }

  const [post, setPost] = useState("")

  const { user, username, userrole } = useContext(UserContext)

  useLeavePageConfirm()

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
      imgCustomHTML = `image<${e.target.files[0].name}-${imgId} width="400" height="400" alt="${e.target.files[0].name}">image`
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
            x = await FileUpload("images", imgList[i].imgData, user.uid)
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
      // fileList.forEach(async (file) => {
      //   if (file !== undefined) {
      //     x = await FileUpload("files", file.file, user.uid)
      //     filesURL = filesURL.concat( `${file.file.name}URLSTARTPOINT${x}URLENDPOINT`)
      //   }
      // })
      for (let i = 0; i < fileList.length; i++){
        if (fileList[i] !== undefined) {
          x = await FileUpload("files", fileList[i].file, user.uid)
          // filesURL = filesURL.concat(`${fileList[i].file.name}URLSTARTPOINT${x}URLENDPOINT`)
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
    let thumbnailURL = "";
    let temp;
    if (title) {
      if (lists.length !== 0) {
        imgsURL = await uploadImages();
        if (imgsURL[0]) {
          temp = imgsURL[0].split("URLSTARTPOINT")
          thumbnailURL = temp[1]
        }
        // filesURL = await uploadFiles();
        postText = changePostText(imgsURL)
        // uploadToFirebase([업로드collection경로],[업로드document경로(자동ID로할꺼면null)],업로드할 내용 hashmap)
        const postHashMap = {
          title: title,
          createdAt: new Date(),
          author: username,
          files: await uploadFiles(),
          uid: user.uid,
          post: postText,
        }
        const imageHashMap = {
          title: title,
          createdAt: new Date(),
          author: username,
          files: await uploadFiles(),
          uid: user.uid,
          post: postText,
          thumbnail: thumbnailURL,
        }
        let uploadToPhoto = false
        for (let i = 0; i < lists.length; i++){
          if (lists[i]==="photo")
            uploadToPhoto = true
        }
        if (uploadToPhoto) {
          if (imageHashMap.thumbnail === "") {
            alert("포토갤러리에는 적어도 1개 이상의 사진이 업로드되어야합니다!")
            return;
          }
        }
        for (let i = 0; i < lists.length; i++) {
          if (lists[i] === "photo") {
            db.collection("photo").add(imageHashMap)
          }
          else {
            db.collection(lists[i]).add(postHashMap)
          }
        }
        setTitle("")
        setFileList([])
        setPost([])
        setTextData("")
        setImgHTML("")
        alert("업로드가 완료됬습니다!")
        router.push(`/`)
      }
      else {
        alert("업로드할 위치를 정해주세요.")
      }
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
    setPost(text)
  }

  const onTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const onCheckboxChange = (isCheck, path) => {
    let i = 0;
    if (isCheck)
      setCheckedList([...checkedList, {
        path: path
      }])
    else {
      for (let j = 0; j < checkedList.length; j++){
        if (checkedList[j]) {
          if (checkedList[j].path === path) {
            delete checkedList[j]
          }
        }
      }
    }
  }

  return (
    <div className="post-container">
      {userrole === "admin" || userrole === "author" ? (
        <>
          <form name="post">
            <div className="post-title">
              제목 : <input type="text" name="title" value={title} onChange={onTitleChange} placeholder="제목을 입력하세요" required />
            </div>
            <h4>업로드 위치</h4>
            {MenuItems.map((item, index) => {
              if (item.path) {
                if (item.path.includes("notice")) {
                  return (
                    <div>
                        <input key={index} onChange={e=>{onCheckboxChange(e.currentTarget.checked,item.path)}} type="checkbox" name="postTo" value={item.subtitle} />{item.subtitle}<br />
                    </div>
                  )
                }
              }
            })}
            첨부파일 : <input type="file" name="selectedFile[]" onChange={onFileChange} /><br />
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
          </form>
          <QuillNoSSRWrapper onChange={onChange} modules={modules} formats={formats} theme="snow" />
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
export default Createpost

// import React from "react"

// const Createpost = () => {
//   return (
//     <>
      
//     </>
//   )
// }

// export default Createpost;