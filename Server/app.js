const express = require('express')
const app = express(); 
const bodyParser = require('body-parser')
const cors = require('cors');
const { PredictionServiceClient } = require("@google-cloud/automl").v1;
const fs = require("fs");
const multer = require('multer');



const port = 4000 
app.listen(port); 
console.log(`listening on port ${port}`)


const corsOrigin = 'http://localhost:3000'

app.use(express.static(__dirname + '../..'));
app.use(cors({
    origin:[corsOrigin],
    methods:['GET','POST'], 
    credentials: true })); 

app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 


const imageUploadPath = './photos'
const storage =  multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, imageUploadPath)
  }, 
  filename:  function(req, file, cb ) {
    cb(null, `${file.originalname}`)
  }
}) 
const imageUpload = multer({storage: storage}); 

app.post('/image-upload', imageUpload.array('my-image-file'), (req, res) => {
  setTimeout(function(){
    console.log("Executed after 1 second");
    
    const projectId = "mrl5-359709";
    const location = "us-central1";
    const modelId = "ICN4965940968315420672";
    const filePath = `./photos/Audi red sedan14.jpg`;
    
    
    // Imports the Google Cloud AutoML library
    // Instantiates a client
    const client = new PredictionServiceClient({
      keyFilename: "mr-l5-m2.json",
    });
    // Read the file content for translation.
    
    const content = fs.readFileSync(filePath);
    async function predict() {
      
      // Construct request
      // params is additional domain-specific parameters.
      // score_threshold is used to filter the result
      
      const request = {
        name: client.modelPath(projectId, location, modelId),
        payload: {
          image: {
            imageBytes: content,
          },
        },
      };
      
      const [response] = await client.predict(request);
      for (const annotationPayload of response.payload) {
        console.log(`type of vehicle: ${annotationPayload.displayName}`);
        const carType = annotationPayload.displayName;
      }
    } 
    predict();
  }, 1000);
    
})
