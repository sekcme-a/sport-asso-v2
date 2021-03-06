import React, { useEffect,useContext, useState} from "react"
import Header from "src/components/public/Header"
import { MenuItems } from "data/MenuItems"
import NavbarVertical from "src/components/public/NavbarVertical"
import { Router, useRouter } from "next/router"
import Schedule from "src/components/notice/Schedule"
import Result from "src/components/notice/Result"
import Anouncement from "src/components/notice/Anouncement"
import Media from "src/components/notice/Media"
import Photo from "src/components/notice/Photo"
import Reference from "src/components/notice/Reference"
import { UserContext } from "src/context";
import LoadPost from "src/components/notice/LoadPost"
import LoadPhoto from "src/components/notice/LoadPhoto"

const Group = () => {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [isAdminOrAuthorLoggedIn, setIsAdminOrAuthorLoggedIn] = useState(false)
  const [cusSlug, setCusSlug] = useState("")
  const [page, setPage] = useState(1)

  const { user, userrole } = useContext(UserContext);

  const router = useRouter();
  const { ...slug } = router.query;

  useEffect(() => {
    MenuItems.forEach((item) => {
      if (item.path ===`/notice/${slug.subtitle}`) {
        setTitle(item.title)
        setSubtitle(item.subtitle)
        if(cusSlug!==slug.subtitle)
          setCusSlug(slug.subtitle)
        if(page!==slug.page)
          setPage(slug.page)
        return;
      }
    })
  }, [slug])
  
  useEffect(() => {
    if (user && (userrole==="admin" || userrole==="author")) {
      setIsAdminOrAuthorLoggedIn(true)
    } else
      setIsAdminOrAuthorLoggedIn(false)
  }, [userrole])
  
  const onAddPostClick = () => {
    router.push(`/author/createpost`)
  }

  return (
    <>
      <Header nav={`${title}`} />
      <div className="body">
        <div className="body-container">
          <div className="content-container">
            <div className="menu-container">
              <h3 className="menu-result">{subtitle}</h3>
                {isAdminOrAuthorLoggedIn && <div className="add-post" onClick={onAddPostClick}>??? ??????</div>}
              <div className="menu-border"></div>
            </div>
            <div className="content">
              {slug.subtitle === "schedule" && <Schedule />}
              {slug.subtitle === "result" && <Result />}
              {slug.subtitle === "anouncement" && <Anouncement />}
              {slug.subtitle === "media" && <Media />}
              {slug.subtitle === "photo" && <Photo />}
              {slug.subtitle === "reference" && <Reference />}
              {slug.subtitle === "photo" ? (
                <LoadPhoto page={parseInt(slug.page)}/>
              ):(cusSlug && <LoadPost folderName={slug.subtitle} page={parseInt(slug.page)}/>)}
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}
export default Group