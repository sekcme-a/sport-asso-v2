import React from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from "next/image"
import Link from "next/link"

import SwiperCore, {
  EffectCoverflow,Pagination, Loop, Autoplay
} from 'swiper';

SwiperCore.use([EffectCoverflow,Pagination,Loop,Autoplay]);

const SwiperImg = () => {
  return (
    <div className="swiperImg">
      <div className="swiperImg-info">
        <h4>PHOTO GALLERY</h4>
        <Link href="/notice/photo">
          <div className="button">더보기</div>
        </Link>
      </div>
      <div className="swiperImg-container">
        <Swiper effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'} coverflowEffect={{
          "rotate": 20,
          "stretch": 0,
          "depth": 200,
          "modifier": 1,
          "slideShadows": true,
        }} pagination={false} autoplay={{
          "delay":2500, "disableOnInteraction": false
        }} loop={true} className="mySwiper">
          {/* <SwiperSlide><img src="https://swiperjs.com/demos/images/nature-1.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-2.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-3.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-4.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-5.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-6.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-7.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-8.jpg" /></SwiperSlide><SwiperSlide><img src="https://swiperjs.com/demos/images/nature-9.jpg" /></SwiperSlide> */}
          {/* <SwiperSlide><Image
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              height={300}
              width={300}
              alt="대한생활체육회 로고"
            /></SwiperSlide>
          <SwiperSlide><Image
              src="https://swiperjs.com/demos/images/nature-2.jpg"
              height={300}
              width={300}
              alt="대한생활체육회 로고"
            /></SwiperSlide> */}
          <SwiperSlide><img src="https://swiperjs.com/demos/images/nature-1.jpg" alt="자연이미지"/></SwiperSlide>
          <SwiperSlide><img src="https://swiperjs.com/demos/images/nature-2.jpg" alt="자연이미지"/></SwiperSlide>
          <SwiperSlide><img src="https://swiperjs.com/demos/images/nature-3.jpg" alt="자연이미지"/></SwiperSlide>
          <SwiperSlide><img src="https://swiperjs.com/demos/images/nature-4.jpg" alt="자연이미지"/></SwiperSlide>
          <SwiperSlide><img src="https://swiperjs.com/demos/images/nature-5.jpg" alt="자연이미지"/></SwiperSlide>
          
        </Swiper>
      </div>
    </div>
  )
}
export default SwiperImg