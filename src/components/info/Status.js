import React, {useEffect, useState} from "react";
import { firestore as db, storage } from "src/components/firebase"
import style from "styles/info/Status.module.css"
import Image from "next/image"
import Head from "next/head"

const Status = (props) => {
  let title;
  let subtitle;
  let prevSpot; //직위
  const [statusData, setStatusData] = useState([])
  const [loading, setLoading] = useState(true)
  // const [imgList, setImgList] = useState([])

  useEffect(async () => {
    // setLoading(true)
    console.log(props.data)
    if (props.data === undefined) {
      await db.collection("data").doc("status").get().then(async (doc) => {
        const res = JSON.parse(doc.data().data)
        setStatusData(res)
        for (let i = 0; i < res.length; i++) {
          await storage.ref(`status/${res[i].img}`).getDownloadURL().then((url) => {
            res[i] = {
              ...res[i],
              url: url
            }
          })
        }
        setStatusData(res)
        setLoading(false)
      })
    } else {
      const res = props.data
      let success = true;
      for (let i = 0; i < res.length; i++) {
          await storage.ref(`status/${res[i].img}`).getDownloadURL().then((url) => {
            res[i] = {
              ...res[i],
              url: url
            }
          }).catch((e) => {
            success = false
            alert(`이미지명을 다시 확인해주세요!\n${e}`)
            return
          })
        }
      if (success) {
        setStatusData(res)
        setLoading(false)
      }
    }
  },[props.data])
  //총원수 및 임원 수 구하기.
  const getTotal = () => {
    let spot = [];
    let number = [];
    let exist = false;
    let totalNumber = 0;
    let result = "총원";
    statusData.forEach((item) => {
      exist = false;
      if (spot.length !== 0) {
        for (let i = 0; i < spot.length; i++){
          if (item.spot === spot[i]) {
            exist = true;
            number[i]++;
          }
        }
        if (exist === false) {
          number[spot.length] = 1;
          spot[spot.length] = item.spot;
        }
      } else {
        spot[0] = item.spot;
        number[0] = 1;
      }
      totalNumber++;
    })
    result += ` ${totalNumber}명 (`;
    for (let i = 0; i < spot.length; i++){
      result += `${spot[i]} ${number[i]}명`
      if (i !== (spot.length - 1))
        result += ", "
    }
    result += ")"
    return result;
  }

  const getImg = async (imgName) => {
    storage.ref(`status/${imgName}`).getDownloadURL().then((url) => {
      console.log(url)
      return url
    })
    // return new Promise(async function (resolve, reject) {
    //   await storage.ref(`status/${imgName}`).getDownloadURL().then((url) => {
    //     resolve(url)
    //   })
    // })
    // return "/asdf"
  }

  return (
    <>
      <Head>
        <title>대한생활체육회|임원현황</title>
        <meta name="description" content="(사)대한생활체육회 임원현황 - 국민의 건강과 행복의 장을 여는 대한생활체육회" />
        <meta property="og:title" content="대한생활체육회|임원현황" />
        <meta property="og:description" content="(사)대한생활체육회 임원현황 - 국민의 건강과 행복의 장을 여는 대한생활체육회"></meta>
      </Head>
      <div className={style.customBodyStatus}>
      </div>
      <div className={style.body}>
        <div className={style.bodyContainer}>
          <div className={style.contentContainer}>
            <div className={style.menuContainer}>
              <h4 className={style.menuResult}>{subtitle}</h4>
              <div className={style.menuBorder}></div>
            </div>
            <div className={style.statusResultContainer}>
              <h3>대한생활체육회 임원 현황</h3>
              <h5>▶{getTotal()}</h5>
            </div>
            <div className={style.statusContainer}>
              {statusData.map((item, index) => {
                return (
                  <>
                    {prevSpot !== item.spot && (
                      <>
                        <div className={style.position}>{item.spot}</div>
                        <div className={style.hide}>{prevSpot = item.spot}</div>
                      </>
                    )}
                    <div key={index} className={style.card}>
                      <div className={style.box}>
                        <div className={style.content}>
                          <div className={style.idPhotoContainer}>
                            {/* <img className={style.idPhoto} src={item.img} alt="증명사진" /> */}
                            <div className={style.idPhoto}>
                              {loading ?
                                <h6>이미지 로딩중..</h6>
                              :
                                <Image
                                  className="idPhoto"
                                  src={item.url}
                                  height={200}
                                  width={150}
                                  alt="사진"
                                />
                              }
                              {/* <img className="idPhoto" src={`https://firebasestorage.googleapis.com/v0/b/sports-asso-v2.appspot.com/o/status%2Fansqudgml.png?alt=media&token=7336fd19-59e2-493b-9d74-c500f0afca38`} alt="사진"/> */}
                            </div>
                          </div>
                          <div className={style.idTextContainer}>
                            <h6>{`직위 : ${item.spot}`}</h6>
                            <h6>{`성명 : ${item.name}`}</h6>
                            {Array.from(item.data).map((text, index) => {
                              return (
                                <>
                                  {(text.includes("추가")) ? (<h6 key={index}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {text.replace("추가 : ", "")}</h6>
                                  ) : (
                                    <>
                                        {item.data[0] === text ? <h6 key={index}>{`프로필 : ${text}`}</h6>
                                          : <h6 key={index}>{text}</h6>
                                      }
                                    </>
                                  )}
                                </>
                              )
                            })}
                            {/* <h6>{item.data[1]}</h6> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
              )})}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Status;