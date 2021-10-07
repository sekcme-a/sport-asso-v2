import { style } from "@mui/system";
import React from "react";
import styles from "styles/home/Header.module.css"

const Header = (props) => {
  return (
    <div className={`${styles.header} ${styles.banner}`}>
      <div className={`${styles.header} ${styles.banner__nav}`}>
        <div className={styles.banner__container}>
          <h1>{props.nav}</h1>
          <p>______ . ______</p>
          <h2>국민의 건강과 행복의 장을 여는 대한생활체육회</h2>
        </div>
      </div>
    </div>
  )
}

export default Header;