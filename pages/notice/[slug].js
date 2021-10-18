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
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [cusSlug, setCusSlug] = useState("")
  const [page, setPage] = useState(1)

  const { user } = useContext(UserContext);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    MenuItems.forEach((item) => {
      if (item.path === `/notice/${slug}`) {
        setTitle(item.title)
        setSubtitle(item.subtitle)
        setCusSlug(slug)
        return;
      }
    })
  }, [slug])
  
  useEffect(() => {
    if (user) {
      setIsUserLoggedIn(true)
    } else
      setIsUserLoggedIn(false)
  }, [user])
  
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
                {isUserLoggedIn && <div className="add-post" onClick={onAddPostClick}>글 작성</div>}
              <div className="menu-border"></div>
            </div>
            <div className="content">
              {slug === "schedule" && <Schedule />}
              {slug === "result" && <Result />}
              {slug === "anouncement" && <Anouncement />}
              {slug === "media" && <Media />}
              {slug === "photo" && <Photo />}
              {slug === "reference" && <Reference />}
              {slug === "photo" ? (
                  <LoadPhoto page={page}/>
              ):(<LoadPost folderName={cusSlug} page={page}/>)}
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}
export default Group