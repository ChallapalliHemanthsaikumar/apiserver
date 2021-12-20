const fs = require('fs');
const readline = require('readline');
const multer = require('multer')
const base64url = require('base64url');
const {unlink } =  require('fs/promises');
const {google} = require('googleapis');

const formData = require("express-form-data");
const MIMEText = require('mimetext')


const email = {
  name: "Hemanth Chowdary",
  addr:"hemanth@codersarts.com"
}
// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly','https://mail.google.com','https://www.googleapis.com/auth/gmail.compose','https://www.googleapis.com/auth/gmail.modify','https://www.googleapis.com/auth/gmail.send'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Gmail API.
//   authorize(JSON.parse(content), listLabels);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.web;
//   const oAuth2Client = new google.auth.OAuth2(
//       client_id, client_secret, redirect_uris[0]);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getNewToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getNewToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }


 let gmail  = null;
// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listLabels(auth) {
//    gmail = google.gmail({version: 'v1', auth});
//    listlabels();

//  //  sendmail();
// //  gmail.users.labels.list({
// //     userId: 'me',
// //   }, (err, res) => {
// //     if (err) return console.log('The API returned an error: ' + err);
// //     const labels = res.data.labels;
// //     if (labels.length) {
// //       console.log('Labels:');
// //       labels.forEach((label) => {
// //         console.log(`- ${label.name}`);
// //       });
// //     } else {
// //       console.log('No labels found.');
// //     }
// //   });
// }


exports.lists = (gmails) => {
  //    gmail = google.gmail({version: 'v1', auth});
  //  listlabels();

//   sendmail();
//  gmail.users.labels.list({
//     userId: 'me',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const labels = res.data.labels;
//     if (labels.length) {
//       console.log('Labels:');
//       labels.forEach((label) => {
//         console.log(`- ${label.name}`);
//       });
//     } else {
//       console.log('No labels found.');
//     }
//   });
  
  gmail = gmails;
  listlabels(); 
}



let messagelist = [];
let sentmessagelist = [];
async function  listlabels(){

    const response =  await gmail.users.messages.list({
        userId:'me',
        labelIds:["SENT"]
        
    })
    const result = await gmail.users.messages.list({
         userId:'me',
         labelIds:["CATEGORY_PERSONAL"],
         
         
        
    })
   
 //   console.log(response.data)
    
 
 try{   
   if(result.data.messages){
    await result.data.messages.map(item => {return  getmessage(item.id,item.threadId)} );
   }
   if(response.data.messages){
     await response.data.messages.map(item => { return getsentmessage(item.id,item.threadId)});
   }
    }
 catch(err){
   console.log(err)
 }
     
    
    // const wait = await gmail.users.messages.get({
    //     userId:'me',
       
    // })
   // console.log(wait.data.snippet) 

 //  console.log(result.data)
}


async  function getsentmessage(id,threadId){
  const reset =await  gmail.users.messages.get({
      userId:'me',
      id:id
  })

function parts(reset){
  
  if(!reset.data.payload.parts){
   // console.log(reset.data.payload.parts)
   return "undefined";
 }else{
  //console.log(reset.data.payload.parts)
 // console.log(reset.data.payload)
   return   reset.data.payload.parts.map(item =>
    {  return { partid:item.partId,
                mimeType:item.mimeType,
                filename:item.filename,
                headers:item.headers,
                body:item.body,
                }
    
    }) 
 }
}

function find(reset,checker){
  //console.log(reset.data.payload.headers.find(item =>{return (item.name===checker)}))
  if(reset.data.payload.headers.find(item =>{return (item.name===checker)})){
    
    return  reset.data.payload.headers.find(item =>{return (item.name===checker)}).value

  }else{
 //   console.log(reset.data.payload.headers.find(item =>{return (item.name===checker)}).value)
    return "undefined"
  }
}
//console.log(reset.data)
 try{
  let sentmessagedata ={ 
      id:id,
      ContentType:reset.data.payload.headers.find(item => { return (item.name==="Content-Type")}).value,
      From: reset.data.payload.headers.find(item => {   return  (item.name==="From") }).value ,
      To: reset.data.payload.headers.find(item => {   return (item.name==="To") }).value ,
      Subject:reset.data.payload.headers.find(item => { return (item.name==="Subject") }).value ,
      messageId: find(reset,"Message-ID"), 
        
      replyTo: find(reset,"In-Reply-To") ,
      References:find(reset,"References"),
      message:reset.data.snippet,
      internalDate: reset.data.internalDate,
      threadId:threadId, 
     

          parts:[ parts(reset)
          
          ]
        
      
     
  }   

 // console.log(sentmessagedata)
  sentmessagelist.push(sentmessagedata)


}
catch(err){
  console.log("error")

}
//     console.log(sentmessagelist)
    



      // console.log(resut.data.payload.headers.find(item => { return ((item.name==="Subject")||(item.name==="To")) }))
      // console.log(resut.data.payload.headers.find(item => { return (item.name==="To") }));  
}


async function deletefile(file){
 
  try {

    unlink(`./${file}`);
    console.log(`successfully deleted ${file} `);
  } catch (error) {
    console.error('there was an error:', error.message);
  }




}


async  function getmessage(id,threadId){
    const resut =await  gmail.users.messages.get({
        userId:'me',
        id:id
    })

  // console.log(resut.data.payload)
   
    let messagedata ={ 
        id:id,
        ContentType:resut.data.payload.headers.find(item => {  if(item.name==="Content-Type"){
            return item.value
        } }).value,
        From: resut.data.payload.headers.find(item => {  if(item.name==="From"){ return item.value } }).value,
        To: resut.data.payload.headers.find(item => {  if(item.name==="To"){return item.value} }).value,
        Subject:resut.data.payload.headers.find(item => { return (item.name==="Subject") }).value,
        messageId: resut.data.payload.headers.find(item => { return (item.name ==="Message-ID")}).value,
        message:resut.data.snippet,
        threadId:threadId, 
        internalDate: resut.data.internalDate,
        parts:[
          resut.data.payload.parts.map(item =>
          {  return { partid:item.partId,
                      mimeType:item.mimeType,
                      filename:item.filename,
                      headers:item.headers,
                      body:item.body,
                      }
          
          })
        ]
    }
         messagelist.push(messagedata)



        // console.log(resut.data.payload.headers.find(item => { return ((item.name==="Subject")||(item.name==="To")) }))
        // console.log(resut.data.payload.headers.find(item => { return (item.name==="To") }));
        

      


  
     
}

exports.getattachement = async(req,res) =>{
  const { messageid,attachmentid,filename} = req.body
  console.log(req.body)
  try{
  const attachment = await gmail.users.messages.attachments.get({
    userId:'me',
    messageId:messageid,
    id:attachmentid
  });
    
//     fs.writeFile(filename,attachment.data.data,'base64',function(err){
//    if(err){ return console.log(err)}
    
//  })
//  fs.readFile(`./${filename}`,(err,data)=>{
//    if(err){
//      console.log(err)
//    }else{
//      console.log(data)
//      //res.status(200).send(body=data)
    
//    }
// })
 res.status(200).send(attachment);
  //res.status(200).download(`./${filename}`)
  

}
  catch(err){
    console.log(err);
  }

  
  


}


async function sendmail(To,Subject,Write){

  const message = new MIMEText()
message.setSender([{name:email.name,addr:email.addr}])
message.setRecipient(To)
message.setSubject(Subject)
//message.setAttachments([sampleBillAttachment, anotherBillAttachment])
message.setMessage(Write)


  const response = await gmail.users.messages.send({

    userId:'me',
    requestBody:{
      raw: message.asEncoded()
    },
   
  })

  console.log(response)
}


exports.listmessage= async(req,res)=>{
 
    //return messagelist;
    res.status(200).send(messagelist);

  }
//listlabels();


//  uploadFile();

async function sendattachmentmail(To,Subject,Write,name,type,size,filedata,attachment){

  const message = new MIMEText()
  message.setSender([{name:email.name,addr:email.addr}])
  message.setRecipient(To)
  message.setSubject(Subject)
  const anotherBillAttachment = {
    type: type,
    filename: name,
    base64Data:  fs.readFileSync(`./${name}`,"base64")
  }
  message.setAttachments([anotherBillAttachment])
  message.setMessage(Write)
  

    const response = await gmail.users.messages.send({
  
      userId:'me',
      requestBody:{
        raw: message.asEncoded()
      },
     
    })
    return response
  
 //   console.log(response)







}



exports.sendmail = async(req,res)=>{
  

 
  
  const  {
    To,
    Subject,
    Write,
    name,type,size,
    filedata,
    attachment
} = req.body;





      
  

   try{
   if(!attachment){
   
    sendmail(To,Subject,Write).then(response => res.status(200).send(response))

   }else{


    
  fs.writeFileSync(name,filedata,"binary",function(err){
        if(err){ res.status(500).send("fail")}
      })
     sendattachmentmail(To,Write,Subject,name,type,size,filedata,attachment).then(response =>{

      deletefile(name)
     res.status(200).send("success");

     })
   // res.status(200).send("success");
   }
  
 
 
 
 
 
 
 
 
 
 
 
 
  }catch(err){
    console.log(err)
  }

 
}


async function sendreplymailservice(To,Write,threadId,id,messageid,sendersubject){
  
  const message = new MIMEText()
message.setSender([{name:email.name,addr:email.addr}])
message.setRecipient(To)
message.setSubject(sendersubject)
//message.setAttachments([sampleBillAttachment, anotherBillAttachment])
message.setMessage(Write)


const customHeaders = {
  'References': messageid,
  'In-Reply-To':messageid
}
message.setHeaders(customHeaders)
 console.log(message.headers)
  const response = await gmail.users.messages.send({

    userId:'me',
    threadId:threadId,
    requestBody:{
      raw: message.asEncoded()
    },
   
  })

  return response;
}


async function sendreplyattachmentmail(To,Write,name,type,size,filedata,attachment,threadId,id,messageId,sendersubject){
  
  const message = new MIMEText()
  message.setSender([{name:email.name,addr:email.addr}])
  message.setRecipient(To)
  message.setSubject(sendersubject)
  const anotherBillAttachment = {
    type: type,
    filename: name,
    base64Data:  fs.readFileSync(`./${name}`,"base64")
  }
  message.setAttachments([anotherBillAttachment])
  message.setMessage(Write)
 
  const customHeaders = {
    'References': messageId,
    'In-Reply-To':messageId
  }
  message.setHeaders(customHeaders)
   console.log(message.headers)

    const response = await gmail.users.messages.send({
  
      userId:'me',
      
      requestBody:{
        raw: message.asEncoded()
      },
     
    })
    return response;
  
 //   console.log(response)







}

















exports.sendreplymail = async(req,res) =>{
 
  const  {
    To,
    Subject,
    Write,
    name,type,size,
    filedata,
    attachment,
    threadId,id,
    messageid,
    sendersubject
} = req.body;


console.log( To[0],
  Subject,
  Write,
  name,type,size,
  
  attachment,
  threadId,id,
  messageid,
  sendersubject)


      
  

   try{
   if(!attachment){
   
    sendreplymailservice(To[0],Write,threadId,id,messageid,sendersubject).then(response => res.status(200).send(response))

   }else{


    
  fs.writeFileSync(name,filedata,"binary",function(err){
        if(err){ res.status(500).send("fail")}
      })
     sendreplyattachmentmail(To[0],Write,name,type,size,filedata,attachment,threadId,id,messageid,sendersubject).then(response =>{

      deletefile(name)
     res.status(200).send("success");

     })
   // res.status(200).send("success");
   }
  
 
 
 
 
 
 
 
 
 
 
 
 
  }catch(err){
    console.log(err)
  }

 
}



exports.sendlistmessage = async(req,res) =>{
 
   

  res.status(200).send(sentmessagelist)
}


exports.refreshlist = async(req,res) =>{
  try{  
    
    messagelist =[];
    const result = await gmail.users.messages.list({
      userId:'me',
      labelIds:["CATEGORY_PERSONAL"],
      
      
     
  })
  await result.data.messages.map(item => {return  getmessage(item.id,item.threadId)} );



    sentmessagelist =[];
    const response =  await gmail.users.messages.list({
      userId:'me',
      labelIds:["SENT"]
      
  })
    await response.data.messages.map(item => { return getsentmessage(item.id,item.threadId)});

  }
catch(err){
  console.log("err")
}
res.status(200).send("success");
}

// module.exports = {
//   lists
// };