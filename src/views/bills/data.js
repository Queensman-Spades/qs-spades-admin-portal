/*eslint-disable*/
// import { Edit } from "react-feather"
// import { useDispatch, useSelector } from "react-redux"
// import { Button } from "reactstrap"
// import { setSelectedRows } from "./store"
import moment from 'moment'
import { saveAs } from 'file-saver';
// import zip from 'jszip'
import { Download } from 'react-feather'
import { Button } from 'reactstrap'
// import { nhost } from '../../App';

// ** Table Zero Config Column
const basicColumns = () => {
  
// const downloadImage = async (image_array) => {

//   //   console.log(image_array)
//   // 	// await download('http://localhost:1337/v1/storage/files/6029c603-fc71-4b6e-8b60-4faa9a4fc124', 'dist');
  
//   // 	// fs.writeFileSync('dist/foo.jpg', await download('http://unicorn.com/foo.jpg'));
  
//   // 	// download('unicorn.com/foo.jpg').pipe(fs.createWriteStream('dist/foo.jpg'));
//     image_array.map(item => {
//       const url = nhost.storage.getPublicUrl({ fileId: item.image_id })
//       const extension = item.mimeType.split("/")[1]
//       // const imgData = new Blob([url], {type: item.mimeType})
//       // const file = new File([imgData], "DALL·E 2022-07-29 13.52.56 - intergalactic space collision viewed through airplane window.png", {type: item.mimeType})
//       // console.log(imgData)
//       // saveAs(file);
//       saveAs(url, `${item.id}.${extension}`);
  
//     })
//   //   // console.log({urls})
    
//   // 	// await Promise.all(urls.map(url => download(url, 'dist')));
//   }

  const basicColumns = [
    {
      name: 'ID',
      sortable: true,
      minWidth: "10px",
      wrap: true,
      selector: row => row?.id
    },
    {
      name: 'Added By',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.inserted_by
    },
    {
      name: 'Amount',
      sortable: true,
      minWidth: "100px",
      wrap: true,
      selector: row => row?.amount
    },
    {
      name: 'Images',
      sortable: true,
      minWidth: "50px",
      wrap: true,
      selector: row => row?.image_ids?.length ?? "None"
    },
    {
      name: 'Property Address',
      sortable: true,
      minWidth: "250px",
      wrap: true,
      selector: row => row?.property.address
    },
    {
      name: 'Created At',
      sortable: true,
      minWidth: "200px",
      wrap: true,
      selector: row => row?.created_at,
      cell: (row) => (
        moment(row.created_at).format("YYYY-DD-MM h:mm a")
      )
    }
    // {
    //   name: "Actions",
    //   minWidth: "200px",
    //   allowOverflow: true,
    //   // omit: store.selectableRows,
    //   cell: (row) => {
    //     if (row?.image_ids?.length > 0) {
    //       return (
    //         <Button color="warning" className="btn-icon" size="sm" onClick={() => {
    //           // dispatch(setEditModal(true))
    //           downloadImage(row?.image_ids)
    //           // dispatch(setSelectedRows(row))
    //         }}>
    //           <Download size={15} className="me-1" />
    //           Download
    //         </Button>
    //         )
    //     }
    //   }
    // }
  ]
  return basicColumns
}

export default basicColumns
