import React, { useState, useEffect, useContext } from "react"
import style from "styles/vote/vote.module.css"
import { firestore as db } from "src/components/firebase"

const resultSchedule = () => {
  const [resultList, setResultList] = useState([])
  const [dataList, setDataList] = useState([])
  useEffect(() => {
    const fetchedList = db.collection("vote")
    let tempData =[]
    if (fetchedList !== undefined) {
      fetchedList.get().then((data) => {
        data.forEach((doc) => {
          tempData = ([
            ...tempData,
            {
              name: doc.data().name,
              first: doc.data().first,
              second: doc.data().second,
              third: doc.data().third,
              fourth: doc.data().fourth,
            }
          ])
        })
        setResultList(tempData)
      })
    }
  }, [])

  useEffect(() => {
    let data = new Array()
    for (let i = 1; i <= 31; i++){
      let firstOk = [];
      let secondOk = [];
      let thirdOk = [];
      let fourthOk = [];
      let firstText = ""
      let secondText = ""
      let thirdText = ""
      let fourthText = ""
      let point = 0;
      for (let j = 0; j < resultList.length; j++){
        if (resultList[j].first.includes(i.toString())) {
          firstOk.push(resultList[j].name)
          firstText += `${resultList[j].name} / `
          point+=4
        }
        if (resultList[j].second.includes(i.toString())) {
          secondOk.push(resultList[j].name)
          secondText += `${resultList[j].name} / `
          point+=3
        }
        if (resultList[j].third.includes(i.toString())) {
          thirdOk.push(resultList[j].name)
          thirdText += `${resultList[j].name} / `
          point+=1
        }
        if (resultList[j].fourth.includes(i.toString())) {
          fourthOk.push(resultList[j].name)
          fourthText += `${resultList[j].name} / `
          point+=0.1
        }
        data[i] = {
          firstList: firstOk,
          secondList: secondOk,
          thirdList: thirdOk,
          fourthList: fourthOk,
          firstText: firstText,
          secondText: secondText,
          thirdText: thirdText,
          fourthText: fourthText,
          resPoint: point,
          date: i
        }
      }
    }
    setDataList(data)
  }, [resultList])
  
  const onModePoint = () => {
    let asdf = new Array;
    console.log("haer")
    console.log(dataList)
    asdf = dataList.sort(function (a, b) {
      return b.resPoint-a.resPoint;
    })
    setDataList(asdf)
  }
  
  return (
    <div className={style.bg}>
      <div className={style.con}>
        <div className={style.button} onClick={onModePoint}>점수순</div>
        <div className={style.button}>불참 적은순</div>
        <div className={style.button}>1지망 많은순</div>
      {dataList.map((data, index) => {
        if (data.resPoint !== 0) {
          return (
            <div className={style.resContainer}>
              <h3>{`${data.date}일`}</h3>
              <h5>1지망:{` ${data.firstList.length}명 [${data.firstText}]`}</h5>
              <h5>2지망:{` ${data.secondList.length}명 [${data.secondText}]`}</h5>
              <h5>3지망:{` ${data.thirdList.length}명 [${data.thirdText}]`}</h5>
              <h5>4지망(불참):{` ${data.fourthList.length}명 [${data.fourthText}]`}</h5>
            </div>
          )
        }
      })}
        </div>
    </div>
  )
}

export default resultSchedule