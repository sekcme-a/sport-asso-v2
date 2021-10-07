import Head from 'next/head'
import Image from 'next/image'
import HomeHeader from "src/components/public/HomeHeader"
import SwiperImg from "src/components/public/SwiperImg"
import About from "src/components/public/About"

export default function Home() {
  return (
    <div>
      <Head>
        <title>대한생활체육회</title>
        <meta name="description" content="대한생활체육회 소개, 체육회 현황, 대회정보 및 자료제공" />
        <meta property="og:title" content="대한생활체육회" />
        <meta property="og:description" content="대한생활체육회 소개, 체육회 현황, 대회정보 및 자료제공"></meta>
      </Head>
      <HomeHeader />
      <About />
      <SwiperImg />
    </div>
  )
}
