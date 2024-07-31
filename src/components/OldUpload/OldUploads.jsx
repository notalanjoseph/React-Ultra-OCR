import "./OldUploads.css"
import {assets} from "../../assets/assets"

const OldUploads = ({ image }) => {

/*  
  const [image, setImage] = useState(assets.user_icon);

  const handleNewImage = () => {
    setImage(NewUploadImage);
  };
*/

  return (
    <div id="OldUploads">
      

        { // image is initially null.
        image ? (
          <div className="OldUpload">
            <img 
              src={URL.createObjectURL(image)} 
              alt="Uploaded"
              style={{ width: '200px', height: '200px' }} 
            />
          </div>
        )
        : (
          <div className="OldUpload">
            click on gallery to upload an image
          </div>
          )
        }

{/*
      <div className="OldUpload">
        <img src={image} alt="user icon" />
      </div>
*/}
    </div>
  )
}

export default OldUploads

