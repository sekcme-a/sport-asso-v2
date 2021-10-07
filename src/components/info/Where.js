import React, { useState, useEffect ,useRef }from "react";
import Script from 'next/script'
import style from "styles/info/Where.module.css"
import Link from "next/link"

const Where = () => {
   const kakaoMap = useRef(null)

  useEffect(() => {
    if (window.daum0) {
      if (kakaoMap && kakaoMap.current) {
        const x = 126.570667;
        const y = 33.450701;
        const coords = new window.daum.maps.LatLng(y, x); // 지도의 중심좌표
        const options = {
          center: coords,
          level: 2,
        };
        const map = new window.daum.maps.Map(kakaoMap.current, options);
        const marker = new window.daum.maps.Marker({
          position: coords,
          map,
        });
        // 맵의 중앙으로 이동
        map.relayout();
        map.setCenter(coords);
        // 마커를 중앙으로 이동
        marker.setPosition(coords);

        // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
        const mapTypeControl = new window.daum.maps.MapTypeControl();

        // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
        // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
        map.addControl(
          mapTypeControl,
          window.kakao.maps.ControlPosition.TOPRIGHT
        );
        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        const zoomControl = new window.daum.maps.ZoomControl();
        map.addControl(
          zoomControl,
          window.daum.maps.ControlPosition.RIGHT
        );
      }
    }
  }, [kakaoMap]);
  return (
    <>
      <Script type="text/javascript"
        strategy="beforeInteractive"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=10143b83ffc3b3f9b4dfefb69908cb81&libraries=services`} />
        <div style={{ width: "400px", height: "300px" }}>
          <div ref={kakaoMap} style={{ width: "100%", height: "100%" }} />
        </div>
      <div className={style.howToComeText}>
          <h5>주소 : 서울특별시 영등포구 버드나루로88, 인따르시아빌딩 101호</h5>
          <h5>(사)대한생활체육회</h5>
        <h6>영등포시장역 2번 출구에서 653m</h6>
        <Link passHref={true} href="https://map.naver.com/v5/search/%EC%98%81%EB%93%B1%ED%8F%AC%EA%B5%AC%EB%B2%84%EB%93%9C%EB%82%98%EB%A3%A8%EB%A1%9C88%EC%9D%B8%EB%94%B0%EB%A5%B4%EC%8B%9C%EC%95%84%EB%B9%8C%EB%94%A9/place/1106183029?c=14127007.9607278,4512689.6688369,15,0,0,0,dh">
          <a className={style.openNaverMap}>
            네이버 지도로 보기
          </a>
        </Link>
      </div>
    </>
  );
};

export default Where;