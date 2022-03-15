import React from "react"
import Image from "next/image"
import styles from "styles/info/Greet.module.css"
import Head from 'next/head'

const Greet = () => {
  return (
    <>
      <Head>
        <title>대한생활체육회|중앙 조직도</title>
        <meta name="description" content="(사)대한생활체육회 중앙 조직도 - 국민의 건강과 행복의 장을 여는 대한생활체육회" />
        <meta property="og:title" content="대한생활체육회|중앙 조직도" />
        <meta property="og:description" content="(사)대한생활체육회 중앙 조직도 - 국민의 건강과 행복의 장을 여는 대한생활체육회"></meta>
      </Head>
      <div>
        <Image
                src="/chart4.jpg"
                height={4500}
                width={2200}
                alt="중앙 조직도"
          />
      </div>
    </>
  )
}

export default Greet;