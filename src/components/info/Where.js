import React, { useState, useEffect }from "react";
import { RenderAfterNavermapsLoaded } from 'react-naver-maps';
import style from "styles/info/Where.module.css"
import { NaverMap, Marker } from 'react-naver-maps';

const Where = () => {
  const [navermaps, setNavermaps] = useState()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNavermaps(window.naver.maps)
    console.log(navermaps)
    }
  },[])
  
  return (
    <>
        <div className="content-container where">
          <RenderAfterNavermapsLoaded
            ncpClientId={'ph27ta09c5'}
            error={<p>네이버 지도 불러오기 실패</p>}
            loading={<p>네이버 지도 불러오는 중...</p>}
          >
            <div className={style.naverMapWhere} >
              {navermaps &&
                <NaverMap
                  mapDivId={'maps-getting-started-uncontrolled'} // default: react-naver-map
                  style={{
                    width: "100%", // 네이버지도 가로 길이
                    height: "50vh" // 네이버지도 세로 길이
                  }}
                  defaultCenter={{ lat: 37.52608, lng: 126.90923 }} // 지도 초기 위치
                  defaultZoom={13} // 지도 초기 확대 배율
                >
                  <Marker
                    key={1}
                    position={new navermaps.LatLng(37.52608, 126.90923)}
                    animation={2}
                    onClick={() => { alert('여기는 (사)대한생활체육회 사무실입니다.'); }}
                  />
                </NaverMap>
              }
            </div>
          </RenderAfterNavermapsLoaded>
          <div className={style.howToComeText}>
            <h3 >오시는 길</h3>
            <h5>주소 : 서울특별시 영등포구 버드나루로88, 인따르시아빌딩 101호</h5>
            <h5>(사)대한생활체육회</h5>
            <h6>영등포시장역 2번 출구에서 653m</h6>
            <a className={style.openNaverMap} href="https://map.naver.com/v5/search/%EC%98%81%EB%93%B1%ED%8F%AC%EA%B5%AC%EB%B2%84%EB%93%9C%EB%82%98%EB%A3%A8%EB%A1%9C88%EC%9D%B8%EB%94%B0%EB%A5%B4%EC%8B%9C%EC%95%84%EB%B9%8C%EB%94%A9/place/1106183029?c=14127007.9607278,4512689.6688369,15,0,0,0,dh">네이버 지도로 보기</a>
          </div>
        </div>
    </>
  )
}

export default Where;