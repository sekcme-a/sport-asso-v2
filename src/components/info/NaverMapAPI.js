import React from 'react'
import { NaverMap, Marker } from 'react-naver-maps';

const NaverMapAPI = (props) => {
  const navermaps = window.naver.maps;

  return (
    <NaverMap
      mapDivId={'maps-getting-started-uncontrolled'} // default: react-naver-map
      style={{
        width: props.width, // 네이버지도 가로 길이
        height: props.height // 네이버지도 세로 길이
      }}
      defaultCenter={{ lat: 37.52608, lng: 126.90923 }} // 지도 초기 위치
      defaultZoom={13} // 지도 초기 확대 배율
    >
      <Marker
        key={1}
        position={new navermaps.LatLng( 37.52608, 126.90923)}
        animation={2}
        onClick={() => {alert('여기는 (사)대한생활체육회 사무실입니다.');}}
      />
    </NaverMap>
  )
}

export default NaverMapAPI