import React, {useEffect, useContext, useState} from "react"
import { firestore as db, storage } from "src/components/firebase"
import CachedIcon from '@mui/icons-material/Cached';
import { useRouter } from "next/router"
import Group from "components/group/Group"
import style from "styles/admin/status.module.css"
import { UserContext } from "src/context";
import Link from "next/link"

const GroupSetting = () => {
  const [data, setData] = useState([])
  const [text, setText] = useState("")
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const { user, userrole } = useContext(UserContext);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (user && (userrole==="admin")) {
      setIsAdminLoggedIn(true)
    } else
      setIsAdminLoggedIn(false)
  }, [userrole])

  useEffect(async () => {
    let tempText = "";
    if (slug) {
      await db.collection("data").doc(slug).get().then((doc) => {
        const res = JSON.parse(doc.data().data)
        setData(res)
        res.forEach((item) => {
          tempText += `${item.groupName}///${item.img}///${item.phone}///${item.leader}`
          if (item.titleData) {
            for (let i = 0; i < item.titleData.length; i++) {
              tempText += `///${item.titleData[i]}///${item.contentData[i]}`
            }
            tempText += "\n"
          } else {
            tempText += "\n"
          }
        })
        setText(tempText)
      })
    }
  }, [slug])
  
  const onChange = (event) => {
    setText(event.target.value)
  }

  const onPreviewClick = async () => {
    let temp="[";
    const items = text.split("\n");
    items.forEach((item) => {
      if (item) {
        const splitedItem = item.split("///")
        temp += `{"groupName":"${splitedItem[0]}",`
        temp += `"img":"${splitedItem[1]}",`
        temp += `"phone":"${splitedItem[2]}",`
        temp += `"leader":"${splitedItem[3]}",`
        if (splitedItem.length > 4) {
          temp += `"titleData":[`
          for (let i = 4; i < splitedItem.length; i+=2){
            temp+=`"${splitedItem[i]}",`
          }
          temp = temp.substring(0, temp.length-1)
          temp += `],"contentData":[`
          for (let i = 5; i < splitedItem.length; i += 2){
            temp+=`"${splitedItem[i]}",`
          }
          temp = temp.substring(0, temp.length - 1)
          temp+=`],`
        }
        if (slug === "nation") temp+=`"dataType": "NationData"},`
        if (slug === "international") temp+=`"dataType": "InternationData"},`
        if (slug === "sanha") temp+=`"dataType": "SanhaData"},`
        if (slug === "sports") temp+=`"dataType": "SportsData"},`
      }
    })
    temp = temp.substring(0, temp.length - 1)
    temp += "]"
    try {
      const res = JSON.parse(temp)
      setData(res)
    } catch (e) {
      alert("????????? ?????? ???????????????????????????!\n"+e)
    }
  }

  const onImgChange = async (e) => {
    let imgName;
    if (e.target.files[0] !== undefined) {
      imgName = e.target.files[0].name;
      storage.ref().child(`profile/${imgName}`).put(e.target.files[0]).then(function (snapshot) {
        alert("???????????? ??????????????????.")
      })
    }
  }

  const onSaveClick = async () => {
    let temp="[";
    const items = text.split("\n");
    items.forEach((item) => {
      if (item) {
        const splitedItem = item.split("///")
        temp += `{"groupName":"${splitedItem[0]}",`
        temp += `"img":"${splitedItem[1]}",`
        temp += `"phone":"${splitedItem[2]}",`
        temp += `"leader":"${splitedItem[3]}",`
        if (splitedItem.length > 4) {
          temp += `"titleData":[`
          for (let i = 4; i < splitedItem.length; i+=2){
            temp+=`"${splitedItem[i]}",`
          }
          temp = temp.substring(0, temp.length-1)
          temp += `],"contentData":[`
          for (let i = 5; i < splitedItem.length; i += 2){
            temp+=`"${splitedItem[i]}",`
          }
          temp = temp.substring(0, temp.length - 1)
          temp+=`],`
        }
        if (slug === "nation") temp+=`"dataType": "NationData"},`
        if (slug === "international") temp+=`"dataType": "InternationData"},`
        if (slug === "sanha") temp+=`"dataType": "SanhaData"},`
        if (slug === "sports") temp+=`"dataType": "SportsData"},`
      }
    })
    temp = temp.substring(0, temp.length - 1)
    temp += "]"
    try {
      const res = JSON.parse(temp)
      await db.collection("data").doc(slug).set({ data: temp })
      alert("??????????????? ?????????????????????.")
      router.push("/")
    } catch (e) {
      alert("????????? ?????? ???????????????????????????!\n"+e)
    }
  }

  return (
    <div className={style.container}>
      {isAdminLoggedIn ?
        <>
          <Link href={`https://firebasestorage.googleapis.com/v0/b/sports-asso-v2.appspot.com/o/%EC%9E%84%EC%9B%90%ED%94%84%EB%A1%9C%ED%95%84%ED%85%9C%ED%94%8C%EB%A6%BF.pptx?alt=media&token=b0bef777-e3f5-4f1c-b076-24383f07d4b0`}>
            <h4 className="guideBookDownloadButton" >???????????????????????? ????????????</h4>
          </Link>
          {slug === "nation" && <h4 className={style.title}>????????????????????? ??????</h4>}
          {slug === "international" && <h4 className={style.title}>????????????????????? ??????</h4>}
          {slug === "sports" && <h4 className={style.title}>????????? ???????????? ??????</h4>}
          {slug === "sanha" && <h4 className={style.title}>???????????? ??????</h4>}
          <h5>????????????///????????????///????????????///?????????///??????1///??????1///??????2///??????2  ????????? ??????????????????.</h5>
          ???????????? : <input type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*" /><br />
          <textarea className={style.textarea} name="imgURL" onChange={onChange} value={text} cols="150" rows="40" ></textarea><br />
          <h4 className={style.saveButton} onClick={onSaveClick}>??????</h4>
          <br />
          <h4 className={style.preview}>????????????</h4>
          <div className={style.reload} onClick={() => { onPreviewClick() }}><CachedIcon /></div>
          {slug === "nation" && <Group data={data} type="NationData" />}
          {slug === "international" && <Group data={data} type="InternationData" />}
          {slug === "sanha" && <Group data={data} type="SanhaData" />}
          {slug === "sports" && <Group data={data} type="SportsData" />}
        </>
        :
        <h4>????????????</h4>
      }
    </div>
  )
}

export default GroupSetting;