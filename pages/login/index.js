import React, { useState, useCallback, useContext , useEffect } from "react"
import {firebase, auth, googleAuthProvider, firestore} from "src/components/firebase"
import * as pv from "src/hooks/usePasswordValidation"
import Image from "next/image"
import debounce from 'lodash.debounce';
import { UserContext } from "src/context";
import Router from "next/router"
import Link from "next/link"



import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';


const LoginUI = () => {
  const [name, setName] = useState("")
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginId, setLoginId] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [uid, setUid] = useState("")

  const { user, username } = useContext(UserContext)
  const [isUser, setIsUser] = useState(false)

  //-2. 이름이 2~15글자 사이인지 확인
  const isNameOk = () => {
    let passed = pv.passwordValidation(name, {
      length: [2, 15]
    })
    if (passed === false) {
      alert("이름은 2~15글자 사이여야 합니다.")
      return false;
    }
    return true;
  }


  
  //0.비밀번호가 8~20글자 사이, 영문과 숫자가 포함되어있는지 확인
  const isPasswordOk = () => {
    let passed = pv.passwordValidation(password, {
      length: [8, 20],
      numeric: 1,
      alpha: 1
    })
    if (passed === false) {
      alert("비밀번호는 8~20글자 사이, 영문과 숫자가 포함되어야 합니다.")
      return false;
    }
    return true;
  }

  //1.비밀번호와 확인 비밀번호가 같은지 확인
  const isConfirmPasswordCorrect = () => {
    if (password === confirmPassword)
      return true;
    else {
      alert("재확인 비밀번호가 틀렸습니다.")
      return false;
    }
  }

  //회원가입 클릭
  const signIn = (event) => {

  }




  //input들이 작성될때 변수에 저장
  const onChange = (event) => {
    if (event.target.name === "name") {
      setName(event.target.value)
    }
    else if (event.target.name === "id") {
      setId(event.target.value)
    }
    else if (event.target.name === "password") {
      setPassword(event.target.value)
    }
    else if (event.target.name === "confirmPassword") {
      setConfirmPassword(event.target.value)
    }
    else if (event.target.name === "loginId") {
      setLoginId(event.target.value)
    }
    else if (event.target.name === "loginPassword") {
      setLoginPassword(event.target.value)
    }
  }

  //로그인
  const onLoginClick = async (event) => {
    event.preventDefault();
  }

  useEffect(() => {
    if (user)
      setIsUser(true)
    else
      setIsUser(false)
  },[user])

  const gotoHome = () => {
    Router.push("/")
  }
  const gotoSetName = () => {
    Router.push("/setting/name")
  }
  return (
    <>
      {isUser ? (username ? gotoHome() : gotoSetName()) : (
      
      <div className="login-background">
      <div className="login-body">
        <div id="2fa-captcha" className="captcha"></div>
        <div className="login-container">
          <input type="checkbox" id="flip" />
          <div className="cover">
            <div className="front">
              <img src="/logo-circle-small.png" alt="대한생활체육회 로고" />
              <div className="loginText">
                <span className="text-1">국민의 건강과<br />행복의 장을 여는</span>
                <span className="text-2">대한생활체육회</span>
              </div>
            </div>
            <div className="back">
              <img className="backImg" src="/logo-circle-small.png" alt="대한생활체육회 로고" />
              <div className="loginText">
                <span className="text-1">Complete miles of journey <br /> with one step</span>
                <span className="text-2">Let get started</span>
              </div>
            </div>
          </div>
          <div className="forms">
            <div className="form-content">
              <div className="login-form">
                <div className="title">Login</div>
                <form action="#">
                  <div className="input-boxes">
                    <div className="input-box">
                      <i>
                        <EmailIcon />
                      </i>
                      <input type="text" onChange={onChange} name="loginId" placeholder="이메일을 입력하세요" required />
                    </div>
                    <div className="input-box">
                      <i><LockIcon /></i>
                      <input type="password" onChange={onChange} name="loginPassword" placeholder="비밀번호를 입력하세요" required />
                    </div>
                    <div className="text"><Link href="/login">비밀번호를 잊으셨나요?</Link></div> {/*미완성*/}
                    <div className="loginButton input-box">
                      <input type="submit" onClick={onLoginClick} value="로그인" />
                    </div>
                    {/* <div className="loginButton input-box">
                      <div className="input">구글로 로그인</div>
                    </div> */}
                      <SignInButton />
                    <div className="text sign-up-text">계정이 아직 없으신가요? <label htmlFor="flip">회원가입</label></div>
                  </div>
                </form>
              </div>
              <div className="signup-form">
                <div className="title">Signup</div>
                <form action="#">
                  <div className="input-boxes">
                    <div className="input-box">
                      <i><PersonIcon /></i>
                      <input onChange={onChange} name="name" type="text" placeholder="이름을 입력하세요" required />
                    </div>
                    <div className="input-box">
                      <i><EmailIcon /></i>
                      <input onChange={onChange} name="id" type="text" placeholder="이메일을 입력하세요" required />
                    </div>
                    <div className="input-box">
                      <i>
                        <LockIcon />
                      </i>
                      <input onChange={onChange} name="password" type="password" placeholder="비밀번호를 입력하세요" required />
                    </div>
                    <div className="input-box">
                      <i><LockIcon /></i>
                      <input onChange={onChange} name="confirmPassword" type="password" placeholder="비밀번호 재확인" required />
                    </div>
                    {/* <div className="input-box">
                      <i className="fas fa-user-check"></i>
                      <input onChange={onChange} name="verificationCode" type="text" placeholder="인증번호를 입력하세요" required />
                    </div> */}
                    <div className="loginButton input-box">
                      <input onClick={signIn} type="submit" value="회원가입" />
                    </div>
                    <div className="text sign-up-text">이미 계정이 있으신가요? <label htmlFor="flip">로그인</label></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div >
      )}
    </>
  )
function SignInButton() {
  // const { user, username } = useContext(UserContext)
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  }
  return (
    <div className="btn-google" onClick={signInWithGoogle}>
      구글로 로그인
    </div>
  )
}

}

export default LoginUI;