import React, { useEffect, useState} from "react"
import Header from "src/components/public/Header"
import { MenuItems } from "data/MenuItems"
import NavbarVertical from "src/components/public/NavbarVertical"
import { useRouter } from "next/router"
import Schedule from "src/components/notice/Schedule"
import Result from "src/components/notice/Result"
import Anouncement from "src/components/notice/Anouncement"
import Media from "src/components/notice/Media"
import Photo from "src/components/notice/Photo"
import Reference from "src/components/notice/Reference"

const Group = () => {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    MenuItems.forEach((item) => {
      if (item.path === `/notice/${slug}`) {
        setTitle(item.title)
        setSubtitle(item.subtitle)
        return;
      }
    })
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
              {slug === "schedule" && <Schedule />}
              {slug === "result" && <Result />}
              {slug === "anouncement" && <Anouncement />}
              {slug === "media" && <Media />}
              {slug === "photo" && <Photo />}
              {slug === "reference" && <Reference />}
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}
export default Group