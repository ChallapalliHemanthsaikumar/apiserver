const { google,drive_v3 } = require("googleapis");
const path = require('path');
const fs = require('fs');
const multer = require('multer')
const readline = require('readline');
const {unlink } =  require('fs/promises');

let foldername  = 'codersarts'; // foldername change what you want 


// const SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.labels'];
// const CLIENT_ID = '597708240994-0pa30bacqfau9jo4jqubo7qij4c5f7dr.apps.googleusercontent.com';
// const CLIENT_SECERT = "0Hz5fKsAKu0U_ZVbzXuPtD1h";
// let REFRESH_TOKEN = '1//04pNbUWUjVEGHCgYIARAAGAQSNwF-L9IrSCYKejF6HV3vbwIRZkXIL0fLxlvmk26Trcxol2zCAnH2_hXbGRVoR4NR-I5klpg6cVI';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground'




// const auth = new google.auth.GoogleAuth({
//   keyFile:"./hidden.json",
//   scopes:SCOPES,
//   // clientOptions:{
//   //   CLIENT_ID,CLIENT_SECERT,REDIRECT_URI
//   // }
// });

// //const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECERT,REDIRECT_URI);

// // console.log(oAuth2Client)
// google.options({
//   auth
// })

// const gmail = google.gmail({
//   version:'v1',
//   auth
// });
 
// const drive =google.drive({
//   version:'v3',
//   auth
// });

// gmail = gmail.with_subject("pallapatrihemanth@gmail.com")

//console.log(auth);
//console.log(drive);


let drive = null;
let folderid = null;
exports.list = (drives) => {
 // console.log(drive)
   drive = drives; 




   const response = createfolder();
// Using the NPM module 'async'
if(response){
  console.log("folder Created");
}


 
}


// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,CLIENT_SECERT,REDIRECT_URI
// );

async function createfolder(){
  
  drive.files.list({
    q: "mimeType = 'application/vnd.google-apps.folder'",
    fields: 'files(id, name)',
    spaces: 'drive',
   
  }, function (err, res) {
    if (err) {
      // Handle error
      console.error(err);
      
    } else {
      // res.files.map(function (file) {
      //   console.log('Found file: ', file.name, file.id);
      // });
      console.log(res.data)
      res.data.files.map(item => {
        if(item.name === foldername){
          folderid = item.id;
          
        }
      })

      if(folderid === null){

        var fileMetadata = {
         'name': foldername,
         'mimeType': 'application/vnd.google-apps.folder'
       };
       drive.files.create({
         resource: fileMetadata,
         fields: 'id'
       }, function (err, file) {
         if (err) {
           // Handle error
           console.error(err);
         } else { 
           // console.log(file)
           // console.log('Folder Id: ', file.id);
           return true;
         }
       });
     }else{
       return true;
     } 
     


    }
  });

}

async function gmailwatch(){
  try{
    const result = await gmail.users.getProfile({
      userId:'me'
    })
    console.log(result);
    // console.log(gmail.users)
    // const response = await gmail.users.labels.list({
    //   userId:'pallapatrihemanth@gmail.com',
    // })
    // console.log(response.data.labels)
    }catch(err){
    console.error (err)
  }

} 
//gmailwatch()


// oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

// const drive = google.drive({version:"v3",oAuth2Client})


const filepath = (filename) =>{

  return path.join(__dirname,filename)
}




async function uploadFile(file){
  const { filename,mimetype,size,originalname} = file; 
  
  console.log(drive)

  let path = filepath(filename);
  

  try{
      
    const resp = createfolder();
    if(resp){


     const response =  await drive.files.create({
      requestBody:{
        name: originalname,
        mimeType: mimetype,
        parents: [folderid]
      },
      media:{
        mimeType: mimetype,
        body:fs.createReadStream(`./${filename}`)
      }
     
    })
    console.log(response.data);

    return response;
     
  }

   
    

  }catch(error){
      console.log(error.message)
    }
  
}
//  uploadFile();
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, './')
},
filename: function (req, file, cb) {
  cb(null, Date.now() + '-' +file.originalname )
}
})




exports.uploadingFile = async(req,res) => {
  let upload = multer({ storage: storage }).single('myfile')
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
        return res.status(500).send(err)
    } else if (err) {
        return res.status(500).send(err)
    }

   console.log(req.file);
      const response = uploadFile(req.file).then(response => {return res.status(200).send(response)});

    deletefile(req.file);




})

async function deletefile(file){
  const {originalname} = file;
  try {

    unlink(`./${file.filename}`);
    console.log(`successfully deleted ${file.filename} `);
  } catch (error) {
    console.error('there was an error:', error.message);
  }




}



  
 




  // uploadFile(name,imageurl,type,size).then(response => 
  //   res.status(200).send(response.data));

  
  

}

exports.getList = (req,res) => {
  getFile().then(response => res.status(200).send(response.data));
}

exports.downloadFile = (req,res) =>{
  console.log(req.body);
  const { id} = req.body;

  Downloadfile(id).then( response =>{ 
    console.log(response)
    res.status(200).send(response)});

  
}



async function getFile(){
  try{
    const response = await drive.files.list();
    console.log(response.data.files)
    // response.data.files.map(item => deletefile(item.id))
     return response;
  }
  catch(err){
   console.log("Hello",err)}// downloadFile(response)
   
}



  // getFile()

 
async function deletefile(file)
{
  try{
    const response = await drive.files.delete(
      {
        fileId:file
      } 
          )
          
  }catch(err){
    console.log(err)
  }
}


 


async function Downloadfile(id){
  
  try{

   await drive.permissions.create({
    fileId: id,
    requestBody:{
      role:'reader',
      type:'anyone'
    }
   })
   const result = await drive.files.get({
    fileId: id,
    fields:"webContentLink"
   })
   return result.data
  }catch(error){
    console.log(error.message)
  }



}

// module.exports = {
//   list
// }