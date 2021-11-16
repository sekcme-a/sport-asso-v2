import React, {useEffect, useContext,useState} from "react"
import { firestore as db, storage } from "src/components/firebase"
import CachedIcon from '@mui/icons-material/Cached';
import Statuss from "src/components/info/Status"
import router from "next/router";
import style from "styles/admin/status.module.css"
import { UserContext } from "src/context";

const Status = () => {
  const [data, setData] = useState([])
  const [text, setText] = useState("")
  const [prevData, setPrevData] = useState([])
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const { user, userrole } = useContext(UserContext);
  useEffect(() => {
    if (user && (userrole==="admin")) {
      setIsAdminLoggedIn(true)
    } else
      setIsAdminLoggedIn(false)
  }, [userrole])

  useEffect(async () => {
    let tempText="";
    await db.collection("data").doc("status").get().then((doc) => {
      const res = JSON.parse(doc.data().data)
      setData(res)
      res.forEach((item) => {
        tempText += `${item.spot}///${item.name}///${item.img}`
        if (item.data) {
          if (item.data[0] !== "") {
            for (let i = 0; i < item.data.length; i++) {
              tempText += `///${item.data[i]}`
            }
            tempText += "\n"
          } else tempText+="\n"
        } else {
          tempText += "\n"
        }
      })
      setText(tempText)
    })
  }, [])
  
  const onChange = (event) => {
    setText(event.target.value)
  }

  const onPreviewClick = async () => {
    let temp="[";
    const items = text.split("\n");
    items.forEach((item) => {
      if (item) {
        const splitedItem = item.split("///")
        temp += `{"spot":"${splitedItem[0]}",`
        temp += `"name":"${splitedItem[1]}",`
        temp += `"img":"${splitedItem[2]}",`
        if (splitedItem.length === 3)
          temp+=`"data":[""]},`
        if(splitedItem.length>3)
          temp += `"data":[`
        if (splitedItem.length === 4) {
          temp += `"${splitedItem[3]}"]},`
        }
        else {
          for (let i = 3; i < splitedItem.length; i++) {
            if (i === 3)
              temp +=`"${splitedItem[i]}",`
            else if (i === splitedItem.length - 1)
              temp += `"${splitedItem[i]}"]},`
            else
              temp += `"${splitedItem[i]}",`
          }
        }
      }
    })
    temp = temp.substring(0, temp.length - 1)
    temp += "]"
    try {
      const res = JSON.parse(temp)
      setData(res)
      setPrevData(res)
    } catch (e) {
      alert("형식에 맞게 작성되지않았습니다!\n"+e)
    }
  }

  const onImgChange = async (e) => {
    let CompressedFile;
    let imgName;
    if (e.target.files[0] !== undefined) {
      imgName = e.target.files[0].name;
      storage.ref().child(`status/${imgName}`).put(e.target.files[0]).then(function (snapshot) {
        alert("이미지가 추가됬습니다.")
      })
    }
    
  }

  const onSaveClick = async () => {
    let temp="[";
    const items = text.split("\n");
    items.forEach((item) => {
      if (item) {
        const splitedItem = item.split("///")
        temp += `{"spot":"${splitedItem[0]}",`
        temp += `"name":"${splitedItem[1]}",`
        temp += `"img":"${splitedItem[2]}",`
        temp += `"data":[`
        for (let i = 3; i < splitedItem.length; i++) {
          if (i === splitedItem.length - 1)
            temp += `"${splitedItem[i]}"]},`
          else
            temp += `"${splitedItem[i]}",`
        }
      }
    })
    temp = temp.substring(0, temp.length - 1)
    temp += "]"
    try {
      const res = JSON.parse(temp)
      await db.collection("data").doc("status").set({ data: temp })
      alert("성공적으로 변경되었습니다.")
      router.push("/")
    } catch (e) {
      alert("형식에 맞게 작성되지않았습니다!\n"+e)
    }
  }
  return (
    <div className={style.container}>
      {isAdminLoggedIn ?
        <>
          <h4 className={style.title}>임원현황 편집</h4>
          사진삽입 : <input type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*" /><br />
          <textarea className={style.textarea} name="imgURL" onChange={onChange} value={text}cols="150" rows="40" ></textarea><br/>
          <h4 className={style.saveButton}onClick={onSaveClick}>저장</h4>
          <br/>
          <h4 className={style.preview}>미리보기</h4>
          <div className={style.reload} onClick={() => { onPreviewClick() }}><CachedIcon /></div>
          <Statuss data={prevData} />
        </>
        :
        <h4>권한없음</h4>
      }
    </div>
  )
}

export default Status;