
import React, { useState, useEffect, useContext } from "react"
import style from "styles/vote/vote.module.css"
import { firestore as db } from "src/components/firebase"

const voteSchedule = () => {
  const [name, setName] = useState("")
  const [first, setFirst] = useState("")
  const [second, setSecond] = useState("")
  const [third, setThird] = useState("")
  const [fourth, setFourth] = useState("")

  const onNameChange = (e) => {
    setName(e.target.value)
  }
  const onFirstChange = (e) => {
    setFirst(e.target.value)
  }
  const onSecondChange = (e) => {
    setSecond(e.target.value)
  }
  const onThirdChange = (e) => {
    setThird(e.target.value)
  }
  const onFourthChange = (e) => {
    setFourth(e.target.value)
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    if (name === "") {
      alert("이름 필수입력")
    } else {
      const one = first.split(",")
      const two = second.split(",")
      const three = third.split(",")
      const four = fourth.split(",")
      let checkList = [];
      for (let i = 0; i < one.length; i++){
        if (checkList.includes(one[i])&&one[i]!=="") {
          alert("중복된 날짜가 있습니다!")
          return
        } else
          checkList.push(one[i])
      }
      for (let i = 0; i < two.length; i++){
        if (checkList.includes(two[i])&&two[i]!=="") {
          alert("중복된 날짜가 있습니다!")
          return
        } else
          checkList.push(two[i])
      }
      for (let i = 0; i < three.length; i++){
        if (checkList.includes(three[i])&&three[i]!=="") {
          alert("중복된 날짜가 있습니다!")
          return
        } else
          checkList.push(three[i])
      }
      for (let i = 0; i < four.length; i++){
        if (checkList.includes(four[i])&&four[i]!=="") {
          alert("중복된 날짜가 있습니다!")
          return
        } else
          checkList.push(four[i])
      }
      const hashMap = {
        name: name,
        first: one,
        second: two,
        third: three,
        fourth: four
      }
      db.collection("vote").doc(name).set(hashMap).then(
        alert("제출 성공!")
      )

    }
  }
  return (
    <div className={style.container}>
      <h4 className={style.guide}>날짜를 xx,xx,xx,xx형식으로 입력해주세요. 예) 12,15,16,18<br/>날짜 중복 불가</h4>
      이름 : <input type="text" name="name" value={name} onChange={onNameChange} placeholder="이름 입력" required /><br/><br/>
      1지망 날짜(100%가능)<br /><input className={style.input} type="text" name="first" value={first} onChange={onFirstChange} placeholder="xx,xx,xx,xx형식으로 입력" /><br/><br/>
      2지망 날짜(다른 일정을 변경해서 가능)<br /><input className={style.input} type="text" name="second" value={second} onChange={onSecondChange} placeholder="xx,xx,xx,xx형식으로 입력" /><br/><br/>
      3지망 날짜(가능할수도 불가능할수도 있음)<br /><input className={style.input} type="text" name="third" value={third} onChange={onThirdChange} placeholder="xx,xx,xx,xx형식으로 입력" /><br/><br/>
      불가능 날짜<br /><input className={style.input} type="text" name="fourth" value={fourth} onChange={onFourthChange} placeholder="xx,xx,xx,xx형식으로 입력" /><br/><br/>
      <input type="submit" value=" 제출 " onClick={onSubmit}></input><br/>
    </div>
  )
}

export default voteSchedule