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
      alert("형식에 맞게 작성되지않았습니다!\n"+e)
    }
  }

  const onImgChange = async (e) => {
    let imgName;
    if (e.target.files[0] !== undefined) {
      imgName = e.target.files[0].name;
      storage.ref().child(`profile/${imgName}`).put(e.target.files[0]).then(function (snapshot) {
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
          <Link href={`https://firebasestorage.googleapis.com/v0/b/sports-asso-v2.appspot.com/o/%EC%9E%84%EC%9B%90%ED%94%84%EB%A1%9C%ED%95%84%ED%85%9C%ED%94%8C%EB%A6%BF.pptx?alt=media&token=b0bef777-e3f5-4f1c-b076-24383f07d4b0`}>
            <h4 className="guideBookDownloadButton" >임원프로필템플릿 다운로드</h4>
          </Link>
          {slug === "nation" && <h4 className={style.title}>전국체육회현황 편집</h4>}
          {slug === "international" && <h4 className={style.title}>국제체육회현황 편집</h4>}
          {slug === "sports" && <h4 className={style.title}>종목별 운영현황 편집</h4>}
          {slug === "sanha" && <h4 className={style.title}>산하단체 편집</h4>}
          <h5>체육회명///이미지명///전화번호///회장명///제목1///내용1///제목2///내용2  순으로 입력해주세요.</h5>
          사진삽입 : <input type="file" name="selectedImg[]" onChange={onImgChange} accept="image/*" /><br />
          <textarea className={style.textarea} name="imgURL" onChange={onChange} value={text} cols="150" rows="40" ></textarea><br />
          <h4 className={style.saveButton} onClick={onSaveClick}>저장</h4>
          <br />
          <h4 className={style.preview}>미리보기</h4>
          <div className={style.reload} onClick={() => { onPreviewClick() }}><CachedIcon /></div>
          {slug === "nation" && <Group data={data} type="NationData" />}
          {slug === "international" && <Group data={data} type="InternationData" />}
          {slug === "sanha" && <Group data={data} type="SanhaData" />}
          {slug === "sports" && <Group data={data} type="SportsData" />}
        </>
        :
        <h4>권한없음</h4>
      }
    </div>
  )
}

export default GroupSetting;