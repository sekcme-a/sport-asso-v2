import React, { useEffect, useState} from "react"
import Header from "src/components/public/Header"
import { MenuItems } from "data/MenuItems"
import NavbarVertical from "src/components/public/NavbarVertical"
import { useRouter } from "next/router"
import GroupTable from "src/components/group/Group"
import Head from "next/head"

const Group = () => {
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    MenuItems.forEach((item) => {
      if (item.path === `/group/${slug}`) {
        setTitle(item.title)
        setSubtitle(item.subtitle)
        return;
      }
    })
  },[slug])

  return (
    <>
      <Head>
        <title>{`대한생활체육회|${subtitle}`}</title>
        <meta name="description" content={`(사)대한생활체육회 단체소개-${subtitle} - 국민의 건강과 행복의 장을 여는 대한생활체육회`} />
        <meta property="og:title" content={`대한생활체육회|${subtitle}`}/>
        <meta property="og:description" content={`(사)대한생활체육회 단체소개-${subtitle} - 국민의 건강과 행복의 장을 여는 대한생활체육회`}></meta>
      </Head>

      <Header nav={`${title}`} />
      <div className="body">
        <div className="body-container">
          <div className="content-container">
            <div className="menu-container">
              <h3 className="menu-result">{subtitle}</h3>
              <div className="menu-border"></div>
            </div>
            <div className="content">
              {slug === "international" && <GroupTable type="InternationData" />}
              {slug === "nation" && <GroupTable type="NationData" />}
              {slug === "sports" && <GroupTable type="SportsData" />}
              {slug === "sanha" && <GroupTable type="SanhaData" />}
            </div>
          </div>
          <NavbarVertical loc={title} />
        </div>
      </div>
    </>
  )
}
export default Group