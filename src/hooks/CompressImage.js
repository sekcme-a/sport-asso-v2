import React from 'react';
import imageCompression from 'browser-image-compression';

export const CompressImage = async (img) => {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return new Promise(async function (resolve, reject) {
    try {
    const compressedFile = await imageCompression(img, options)
    resolve(compressedFile)
    } catch(e) {console.log(e)}

  })
}