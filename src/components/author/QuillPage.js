// import dynamic from 'next/dynamic'
// import React, { useState, useEffect } from 'react'

// const QuillNoSSRWrapper = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <p>로딩중 ...</p>,
// })

// const modules = {
//   toolbar: [
//     [{ header: '1' }, { header: '2' }],
//     [{ size: [] }],
//     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//     [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
//     [
//       { list: 'ordered' },
//       { list: 'bullet' },
//       { indent: '-1' },
//       { indent: '+1' },
//     ],
//     ['link'],
//     ['clean'],
//   ],
//   clipboard: {
//     // toggle to add extra line breaks when pasting HTML:
//     matchVisual: false,
//   },
// }
// /*
//  * Quill editor formats
//  * See https://quilljs.com/docs/formats/
//  */
// const formats = [
//   'header',
//   'size',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'align',
// ]

// const QuillPage = (props) => {

//   const onChange = (notes) => {
//     props.setTextData(notes)
//   }

//   return (
//     <>
//       <QuillNoSSRWrapper onChange={onChange} modules={modules} formats={formats} theme="snow" />
//     </>
//   )
// }
// export default QuillPage