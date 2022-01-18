import { firestore as db } from "src/components/firebase"

export const uploadToFirebase = (colList, docList, data) => {
  if (Array.isArray(colList)) {
    if (docList === null) {
      //firebase가 제공하는 무작위 ID를 doc name으로 저장
      colList.forEach((col) => {
        for (let i = 0; i < col.length; i++)
          db.collection(col[i]).add(data)
      })
    } else {
      for (let i = 0; i < colList.length; i++) {
        db.collection(colList[i]).doc(docList).set(data)
      }
    }
  } else if (Array.isArray(docList)) {
      for (let i = 0; i < docList.length; i++) {
        db.collection(colList).doc(docList[i]).set(data)
      }
  } else {
      db.collection(colList).doc(docList).set(data)
  }
}