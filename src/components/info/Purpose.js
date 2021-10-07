import React from "react"
import styles from "styles/info/Purpose.module.css"
import Head from 'next/head'

const Greet = () => {
  return (
    <>
      <Head>
        <title>대한생활체육회|체육회소개-설립목적,연혁</title>
        <meta name="description" content="(사)대한생활체육회 설립목적 및 연혁 - 스포츠가 최고의 국민건강 복지다" />
        <meta property="og:title" content="대한생활체육회|체육회소개-설립목적,연혁" />
        <meta property="og:description" content="(사)대한생활체육회 설립목적 및 연혁 - 스포츠가 최고의 국민건강 복지다"></meta>
      </Head>
      <h4 className={styles.title}>설립 목적</h4>
      <h5 className={styles.subtitle}>[스포츠가 최고의 국민건강 복지다]</h5>
      <ul className={styles.list}>
        <li>생활체육 내외의 스포츠 클럽 활동을 지원,육성하여 국민건강 복지증진에 기여</li>
        <li>전국 각 생활체육단위 스포츠클럽 활동지원 육성</li>
        <li>생활체육 스포츠 클럽 리그 및 각종 공식대회 개최</li>
        <li>전국 생활인 및 체육동호인 1인 1기 스포츠 참여 운동 전개</li>
        <li>생활체육 스포츠 전문지도자 및 심판 양성교육</li>
        <li>생활 체육관련 시설 위탁운영 및 학원. 연수원운영, 체육지도자 파견</li>
        <li>회원의 권익 향상을 위한 회원카드 발급 및 복리증진</li>
        <li>민간자격의 자격기본법에 의한 생활체육행정사 및 각 종목별단체의 자격제도의 관리 운영에 관한 사항</li>
        <li>생활체육 육성을 위한 국제적 영향력을 행사한다.</li>
      </ul>
    </>
  )
}

export default Greet;