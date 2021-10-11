import 'styles/globals.css'
import 'styles/navbar/Navbar.css'
import 'styles/navbar/NavbarMobile.css'
import 'styles/navbar/Dropdown.css'
import 'styles/home/HomeHeader.css'
import 'styles/home/SwiperImg.css'
import 'styles/home/About.css'
import 'styles/Container.css'
import 'styles/navbar/NavbarVertical.css'
import 'styles/Login.css'
import 'swiper/css'
import "swiper/css/bundle";
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Navbar from "src/components/public/Navbar"
import NavbarMobile from "src/components/public/NavbarMobile"
import Footer from "src/components/public/Footer"
import { useState, useEffect } from "react"
import Head from 'next/head'
import { UserContext } from "src/context"
import { useUserData } from "src/hooks/useUserData"


//{ Component, pageProps }
function MyApp({ Component, pageProps }) {
  const [mobileMode, setMobileMode] = useState("false")

  const userData = useUserData();
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 690)
        setMobileMode(true)
      else
        setMobileMode(false)
    }
    handleResize();
    window.addEventListener("resize", handleResize);
  },[])
  return (
    <UserContext.Provider value={userData}>
      {console.log(userData)}
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {mobileMode ? <NavbarMobile /> : <Navbar />}
      <Component {...pageProps} />
      <Footer />
    </UserContext.Provider>
  )
}

export default MyApp
