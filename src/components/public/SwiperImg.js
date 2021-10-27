import React, {useEffect, useState} from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from "next/image"
import Link from "next/link"
import { firestore as db } from "src/components/firebase"

import SwiperCore, {
  EffectCoverflow,Pagination, Loop, Autoplay
} from 'swiper';

SwiperCore.use([EffectCoverflow,Pagination,Loop,Autoplay]);

const SwiperImg = () => {
  const [imgList, setImgList] = useState([])
  useEffect(async () => {
    let temp = [];
    const fetchedList = await (db.collection("photo")
        .orderBy("createdAt", "desc")
      .limit(12))
    fetchedList.get().then((data) => {
      data.forEach((doc) => {
        temp = [
          ...temp,
          {
            url: doc.data().thumbnail,
            name: doc.data().title,
            id: doc.id,
          }
        ]
      })
      setImgList(temp)
    })
  },[])
  return (
    <div className="swiperImg">
      <div className="swiperImg-info">
        <h4>PHOTO GALLERY</h4>
        <Link href="/notice/[subtitle]/[page]" as="/notice/photo/1">
          <div className="button">더보기</div>
        </Link>
      </div>
      <div className="swiperImg-container">
        {imgList.length!==0 &&
          <Swiper effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'} coverflowEffect={{
            "rotate": 20,
            "stretch": 0,
            "depth": 200,
            "modifier": 1,
            "slideShadows": true,
          }} pagination={false} autoplay={{
            "delay": 2500, "disableOnInteraction": false
          }} loop={true} className="mySwiper">
            {imgList.map((data, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link href='/article/[filename]/[id]' as={`/article/photo/${data.id}`}>
                    <div className="SwiperImgContainer">
                      <img src={data.url} alt={data.name} />
                    </div>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        }
      </div>
    </div>
  )
}
export default SwiperImg