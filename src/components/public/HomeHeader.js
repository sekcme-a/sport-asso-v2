import React,{ useContext, useEffect, useState } from "react";
import { UserContext } from "src/context";
import Link from "next/link"

const HomeHeader = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const { user, userrole } = useContext(UserContext);
  useEffect(() => {
    if (user && (userrole==="admin")) {
      setIsAdminLoggedIn(true)
    } else
      setIsAdminLoggedIn(false)
  }, [userrole])

  const onClick = () => {
    const res = window.open(`https://firebasestorage.googleapis.com/v0/b/sports-asso-v2.appspot.com/o/%EB%8C%80%ED%95%9C%EC%83%9D%ED%99%9C%EC%B2%B4%EC%9C%A1%ED%9A%8C%20%EC%96%B4%EB%93%9C%EB%AF%BC%EA%B0%80%EC%9D%B4%EB%93%9C.pdf?alt=media&token=67596abd-325f-413a-a46b-e60aa689c547`,
      "", " location=no, fullscreen=yes,")
  }
  return (
    <div className="banner">
      {isAdminLoggedIn && <h4 className="guideBookDownloadButton" onClick={onClick}>관리자 가이드북 다운로드</h4>}
      <div className="banner__content">
        <div className="container">
          
          <div className="banner__text">
            <h3>국민의 건강과<br /> 행복의 장을 여는</h3>
            <h1><p />대한생활체육회</h1>
            <p>
              Korea Sports For All Athletic Association
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;