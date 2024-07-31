import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import OldUploads from './components/OldUpload/OldUploads';
import NewUpload from './components/NewUpload/NewUpload';
import './App.css'

const App = () => {
  
  const [image, setImage] = useState(null);

  const handleImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected image:", file);
      setImage(file);
    }
  };

  return ( 
    <div id="App">
      <Sidebar/>
      <OldUploads image={image} />
      <NewUpload handleImage={handleImage} />
    </div>
  )
};

export default App;
