import React, { useEffect, useState} from "react"
import Header from "src/components/public/Header"
import { MenuItems } from "data/MenuItems"
import NavbarVertical from "src/components/public/NavbarVertical"
import { useRouter } from "next/router"
import Greet from "src/components/info/Greet"
import Purpose from "src/components/info/Purpose"
import Chart from "src/components/info/Chart"
import Status from "src/components/info/Status"
// import Where from "src/components/info/Where"
import WhereDemo from "src/components/info/WhereDemo"

const Info = () => {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    MenuItems.forEach((item) => {
      if (item.path === `/info/${slug}`) {
        setTitle(item.title)
        setSubtitle(item.subtitle)
        return;
      }
    })
    console.log(slug)
  },[slug])

  return (
    <>
      <Header nav={`${title}`} />
      <div className="body">
        <div className="body-container">
          <div className="content-container">
            <div className="menu-container">
              <h3 className="menu-result">{subtitle}</h3>
              <div className="menu-border"></div>
            </div>
            <div className="content">
              {slug === "greet" && <Greet />}
              {slug === "purpose" && <Purpose />}
              {slug === "chart" && <Chart />}
              {slug === "status" && <Status />}
              {slug === "where" && <WhereDemo />}
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}
export default Info