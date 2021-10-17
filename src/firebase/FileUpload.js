import { storage } from "src/components/firebase"

export const FileUpload = async (loc, fileData, uid) => {
  const createFileName = (name) => {
    return new Promise(function (resolve, reject) {
      let unique = false;
    let addId = 2;
    storage.ref(`${loc}/${uid}`).listAll().then(snap => {
      while (unique === false) {
        unique = true;
        snap.items.forEach(itemRef => {
          if (itemRef.name === name)
            unique = false;
        })
        if (unique === false)
          name = `${name}-${addId}`
        else if (unique === true)
          resolve(name);
        addId++
      }
    })
    })
  }
  return new Promise(async function (resolve, reject) {
    const fileName = await createFileName(fileData.name)
    const fileRef = storage.ref().child(`${loc}/${uid}/${fileName}`)
    await fileRef.put(fileData)
    const url = await fileRef.getDownloadURL()
    resolve(url)
  })
}