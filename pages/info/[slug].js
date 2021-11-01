import React, { useEffect, useContext, useState} from "react"
import Header from "src/components/public/Header"
import { MenuItems } from "data/MenuItems"
import NavbarVertical from "src/components/public/NavbarVertical"
import { useRouter } from "next/router"
import Greet from "src/components/info/Greet"
import Purpose from "src/components/info/Purpose"
import Chart from "src/components/info/Chart"
import Status from "src/components/info/Status"
import Where from "src/components/info/Where"
import Timeline from "src/components/info/Timeline"
import { UserContext } from "src/context";


const Info = () => {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const { user, userrole } = useContext(UserContext);

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
  }, [slug])
  
  useEffect(() => {
    if (user && userrole==="admin") {
      setIsAdminLoggedIn(true)
    } else
      setIsAdminLoggedIn(false)
  }, [userrole])

  const onStatusClick = () => {
    router.push(`/admin/setting/status`)
  }

  return (
    <>
      <Header nav={`${title}`} />
      <div className="body">
        <div className="body-container">
          <div className="content-container">
            <div className="menu-container">
              <h3 className="menu-result">{subtitle}</h3>
              {isAdminLoggedIn &&(
                <>
                  {slug === "status" && <div className="add-post" onClick={onStatusClick}>편집</div>}
                </>
              )}
              <div className="menu-border"></div>
            </div>
            <div className="content">
              {slug === "greet" && <Greet />}
              {slug === "purpose" && <Purpose />}
              {slug === "chart" && <Chart />}
              {slug === "status" && <Status />}
              {slug === "where" && <Where />}
              {slug === "timeline" && <Timeline />}
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}
export default Info