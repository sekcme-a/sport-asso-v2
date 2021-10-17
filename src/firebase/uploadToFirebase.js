import { firestore as db } from "src/components/firebase"

/*
uploadToFirebase([저장할 collection경로],[저장할 document경로],저장할 데이터)
저장할 collection경로나 document경로 둘중 하나만 배열로 보낼수 있으며,
배열없이 보낼수도 있다.
예를 들어 uploadToFirebase([korea,japan,china],here,Data)
는 korea/here 와 japan/here 와 china/here 에 Data가 저장된다.

만약 저장할 document경로를 null로 지정한다면,
firebase가 제공하는 무작위 ID 키 를 document 경로로 지정한다.

*/
export const uploadToFirebase = (colList, docList, data) => {
  if (Array.isArray(colList)) {
    if (docList === null) {
      //firebase가 제공하는 무작위 ID를 doc name으로 저장
      colList.forEach((col) => {
        for (let i = 0; i < col.length; i++)
          db.collection(col[i]).add(data)
      })
      // for (let i = 0; i < colList.length; i++) {
      //   console.log(`here${colList[i]}`)
      //   db.collection(colList[i]).add(data)
      // }
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