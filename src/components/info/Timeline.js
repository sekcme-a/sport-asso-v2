import React from "react"
import style from "styles/info/Timeline.module.css"

const Timeline = () => {
  return (
    <div className={style.timelineContainer}>
      <div className={style.wrapper}>
          <div className={style.centerLine}>
            <a href="#" className={style.scrollIcon}><i className="fas fa-caret-up"></i></a>
          </div>
          <div className={`${style.row} ${style.row1}`}>
            <section>
            <i className={style.icon}></i>
              <div className={style.details}>
                <span className={style.title}>Title of Section 1</span>
                <span>1st Jan 2021</span>
              </div>
              <p>Lorem ipsum dolor sit ameters consectetur adipisicing elit. Sed qui veroes praesentium maiores, sint eos vero sapiente voluptas debitis dicta dolore.</p>
            </section>
          </div>
          <div className={`${style.row} ${style.row2}`}>
            <section>
              <i className={style.icon}></i>
              <div className={style.details}>
                <span className={style.title}>Title of Section 2</span>
                <span>2nd Jan 2021</span>
              </div>
              <p>Lorem ipsum dolor sit ameters consectetur adipisicing elit. Sed qui veroes praesentium maiores, sint eos vero sapiente voluptas debitis dicta dolore.</p>
            </section>
          </div>
          <div className={`${style.row} ${style.row1}`}>
            <section>
              <i className={style.icon}></i>
              <div className={style.details}>
                <span className={style.title}>Title of Section 3</span>
                <span>3rd Jan 2021</span>
              </div>
              <p>Lorem ipsum dolor sit ameters consectetur adipisicing elit. Sed qui veroes praesentium maiores, sint eos vero sapiente voluptas debitis dicta dolore.</p>
            </section>
          </div>
          <div className={`${style.row} ${style.row2}`}>
            <section>
              <i className={style.icon}></i>
              <div className={style.details}>
                <span className={style.title}>Title of Section 4</span>
                <span>4th Jan 2021</span>
              </div>
              <p>Lorem ipsum dolor sit ameters consectetur adipisicing elit. Sed qui veroes praesentium maiores, sint eos vero sapiente voluptas debitis dicta dolore.</p>
            </section>
          </div>
          <div className={`${style.row} ${style.row1}`}>
            <section>
              <i className={style.icon}></i>
              <div className={style.details}>
                <span className={style.title}>Title of Section 4</span>
                <span>4th Jan 2021</span>
              </div>
              <p>Lorem ipsum dolor sit ameters consectetur adipisicing elit. Sed qui veroes praesentium maiores, sint eos vero sapiente voluptas debitis dicta dolore.</p>
            </section>
          </div>
        </div>
    </div>
  )
}

export default Timeline;