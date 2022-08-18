
import './App.css';
import axios from 'axios'
import React, { useState } from 'react' 


function App() {
  const [image, setImage] = useState(null) 

  const handleUpload = () => { 
    axios.post('http://localhost:4000/image-upload', image, (req, res) => {
      console.log(res); 
    }
  )}

  const getFileInfo = (e) => {
    const formData = new FormData(); 
    formData.append('my-image-file', e.target.files[0], e.target.files[0].name); 
    setImage(formData);
  }

  return (
    <div className="App">
      <h1> Image Upload </h1>
      <input type='file' onChange={getFileInfo}></input>
      <button onClick={handleUpload}> upload image </button>
    </div>
  );

}

export default App;

