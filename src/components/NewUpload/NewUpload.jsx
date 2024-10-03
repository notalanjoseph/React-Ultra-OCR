import { useRef } from 'react'
import "./NewUpload.css"
import {assets} from "../../assets/assets"


const NewButton = ({ name, handleClick }) => {
  return (
    <button type="button" onClick={handleClick}>
      <img id={name} src={assets[name]} alt={name} />
    </button>
  )
};


const NewUpload = ({ handleImage }) => {
  const fileInputRef = useRef(null);

  const onGalleryClick = () => {
    fileInputRef.current.click();
  };

  //const onCameraClick = () => {
  //  window.location.href = "https://www.google.com";
  //};


  return (
    <div id="NewUpload">
      <NewButton name="upload" handleClick={ () => fileInputRef.current.click() }/>

      <input 
        type="file" 
        style={{ display: 'none' }} 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImage} 
      />

    </div>
  )
};

// React automatically passes the event object to the handleImage()

export default NewUpload;