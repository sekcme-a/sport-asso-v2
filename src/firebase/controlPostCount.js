import { firestore as db } from "src/components/firebase"

// controlPostCount("변경된 파일명(media, photo등)", "add/remove")
export const controlPostCount = async (name, set) => {


  return new Promise(async function (resolve, reject) {
    let postCount = 0;
    if (set === "add") {
      await db.collection('postCount').doc(name).get().then((doc) => {
        db.collection('postCount').doc(name).set({
          count: doc.data().count+1
        })
      })
      resolve(true)
    } else if (set === "remove") {
      await db.collection('postCount').doc(name).get().then((doc) => {
        db.collection('postCount').doc(name).set({
          count: doc.data().count-1
        })
      })
      resolve(true)
    } else {
      console.log("second value must be add or remove")
      resolve(false)
    }
  })
}