import React, {useEffect, useState} from "react"
import { firestore as db, storage } from "src/components/firebase"
import CachedIcon from '@mui/icons-material/Cached';
import Statuss from "src/components/info/Status"
import router from "next/router";
import { useRouter } from "next/router"

const Status = () => {
  const [data, setData] = useState([])
  const [text, setText] = useState("")

  useEffect(async () => {
    let tempText="";
    await db.collection("data").doc("status").get().then((doc) => {
      const res = JSON.parse(doc.data().data)
      setData(res)
      res.forEach((item) => {
        tempText += `${item.spot}///${item.name}///${item.img}`
        if (item.data) {
          for (let i = 0; i < item.data.length; i++){
            tempText +=`///${item.data[i]}`
          }
          tempText += "\n"
        } else {
          tempText += "/// \n"
        }
      })
      setText(tempText)
    })
  //   const json=`[{
  //   "spot": "중앙이사",
  //   "name": "이신건",
  //   "img": "/IDPhoto/dltlsrjs.png",
  //   "data": ["프로필 : 전남신체장애인복지회","광양시지부장"]
  // },
  // {
  //   "spot": "중앙이사",
  //   "name": "허홍천",
  //   "img": "/IDPhoto/gjghdcjs.png",
  //   "data": ["프로필 : 한국 귀환 동포(중국) 청년연합회 회장"]
  // }]`
  //   const obj = JSON.parse(json)
  //   console.log(obj[0].spot)
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
        temp += `"data":[`
        if (splitedItem.length === 4) {
          temp += `"프로필 : ${splitedItem[3]}"]},`
        }
        else {
          for (let i = 3; i < splitedItem.length; i++) {
            if (i === 3)
              temp +=`"프로필 : ${splitedItem[i]}",`
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
    const res = JSON.parse(temp)
    setData(res)
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
    await db.collection("data").doc("status").set({ data: temp })
    alert("성공적으로 변경되었습니다.")
    router.push("/")
  }
  return (
    <>
      사진삽입 : <input type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*"/><br />
      <textarea name="imgURL" onChange={onChange} value={text}cols="150" rows="40" ></textarea><br/>
      <h4 onClick={onSaveClick}>저장</h4>
      <div className="post-preview" onClick={() => { onPreviewClick() }}><CachedIcon /></div>
      <Statuss data={data} />
    </>
  )
}

export default Status;