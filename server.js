const express = require('express');
const cors = require('cors');
// const connectDB = require('./config/db');
// const https = require("https");
const path = require('path');
// const fs = require('fs');

const app = express();
// const axios = require('axios');
require('dotenv').config();

// const MatchCurrent = require('./models/MatchCurrent');
// const MatchHistory = require('./models/MatchHistory');

// Connect Database
// connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('static'));
app.use(express.static(path.join(__dirname, 'static')));

// async function downloadImage(url, destination) {
//  try {

//     // Check if the file already exists
//     if (fs.existsSync(destination)) {
//         console.log('Image already exists. Skipping download.', destination);
//         return;
//     }
    
//     const headers = {
//       'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
//       'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
//     }
//     const response = await axios({
//       method: 'GET',
//       url,
//       headers: headers,
//       responseType: 'stream',
//     });

//     // Create a write stream
//     const writer = fs.createWriteStream(destination);

//     // Pipe the response stream into the write stream
//     response.data.pipe(writer);

//     // Return a promise that resolves when the write stream is finished
//     return new Promise((resolve, reject) => {
//       writer.on('finish', resolve);
//       writer.on('error', reject);
//     });
//  } catch (error) {
//     console.error('Error downloading image:', error);
//  }
// }

// async function getImageNames(folderPath) {
//  // Read the directory
//  const files = await fs.readdirSync(folderPath);

//  // Filter out image files
//  const imageFiles = await files.filter(file => {
//     const ext = path.extname(file).toLowerCase();
//     return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
//  });

//  return imageFiles;
// }


// Define an asynchronous function
// var response2;
// async function myAsyncFunction() {
//     // Perform asynchronous tasks here
//     try {
//       const basicUrl = process.env.REACT_APP_BASKETAPI_URL;
//       const headers = {
//         'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
//         'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
//       }

//       // console.log(req.body, basicUrl);
//       var date = new Date();
//       var year = date.toLocaleString("en-US", { year: "numeric" });
//       var month = date.toLocaleString("en-US", { month: "2-digit" });
//       var day = date.toLocaleString("en-US", { day: "2-digit" });
//       var today = `${day}/${month}/${year}`;
      
//       //  For yesterday
//       var current_time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
//       var current_minute = new Date().toLocaleTimeString('en-US', { minute: '2-digit', hour12: false });
//       console.log("current time - ", current_time, " : ", current_minute);

//       if(current_time == '00' && Number(current_minute) < 50){
//         var today1 = new Date();
//         var yesterday1 = new Date(today1.setDate(today1.getDate() - 1));
//         var year1 = yesterday1.toLocaleString("en-US", { year: "numeric" });
//         var month1 = yesterday1.toLocaleString("en-US", { month: "2-digit" });
//         var day1 = yesterday1.toLocaleString("en-US", { day: "2-digit" });
//         var last = `${day1}/${month1}/${year1}`;
//         const response = await MatchHistory.findOne({date: last});
//         if(response == null){
//           console.log('Last data is null');
//           let matchLast = await axios.get(basicUrl+`matches/${last}`, { headers: headers, proxy: false });
//           let details = matchLast.data.events;
//           let finished1 = 0;
//           let postponed1 = 0;
//           let notstarted1 = 0;
//           let canceled1 = 0;
//           let inprogress1 = 0;
//           for(let i = 0; i<matchLast.data.events.length; i++){
//             let matchID1 = matchLast.data.events[i].id;
//             if(matchLast.data.events[i].status.type == "finished") finished1 ++;
//             else if(matchLast.data.events[i].status.type == "postponed") postponed1 ++;
//             else if(matchLast.data.events[i].status.type == "notstarted") notstarted1 ++;
//             else if(matchLast.data.events[i].status.type == "canceled") canceled1 ++;
//             else if(matchLast.data.events[i].status.type == "inprogress") inprogress1 ++;

//             if(matchLast.data.events[i].status.type == "finished" || matchLast.data.events[i].status.type == "inprogress"){
//               setTimeout(function() {
//                 // Your code here
//                 console.log("Last - Server", i);
//               }, 300);
//               let matchStat1 = await axios.get(basicUrl+`match/${matchID1}/statistics`, { headers: headers, proxy: false });
//               details[i].stat = matchStat1.data.statistics;
//             }
//             else{
//               details[i].stat = null;
//             }
            
//           }
//           const response2 = await MatchHistory.findOne({date: last});
//           if(response2 == null){
//             let matchhistory = new MatchHistory(
//               {
//                 status: Object({finished:finished1, inprogress:inprogress1, notstarted:notstarted1, postponed:postponed1, canceled:canceled1}),
//                 stat: details,
//                 date: last,
//               }
//             );
//             await matchhistory.save();
//           }
          
//         }
//         else{
//           console.log('----> Last data is ok!');
//         }

//         const response2 = await MatchCurrent.findOne({date: last});
//         if(response2 != null){
//           await MatchCurrent.deleteMany({date: last});
//         }
//         else {
//           console.log('----> Only today data is in current!');
//         }
//       }

//       const staticFolderPath = path.join(__dirname, 'static');

//       // Ensure the static folder exists
//       if (!fs.existsSync(staticFolderPath)) {
//         fs.mkdirSync(staticFolderPath);
//       }
//       const imageNames = await getImageNames(staticFolderPath);

//       let matchSechedule = await axios.get(basicUrl+`matches/${today}`, { headers: headers, proxy: false });
//       // let matchCount = 20;
//       // let response = matchSechedule.data.events.slice(0,matchCount);
//       let response = matchSechedule.data.events;
//       // let response2 = response;
//       let matchIDs = []
//       // let finished = 0;
//       // let notstarted = 0;
//       // let inprogress = 0;
//       for(let i = 0; i<matchSechedule.data.events.length; i++){
//       // for(let i = 0; i<5; i++){
//         let homeTeamID = matchSechedule.data.events[i].homeTeam.id;
//         let homeTeamCode = matchSechedule.data.events[i].homeTeam.nameCode;
//         let homeTeamLogoUrl = basicUrl+`team/${homeTeamID}/image`;
        
//         if(!imageNames.includes(`${homeTeamID}.jpg`)){
//           downloadImage(homeTeamLogoUrl, path.join(staticFolderPath, `${homeTeamID}.jpg`));
//           setTimeout(function() {
//                     // Your code here
//                     console.log("Today Logo loop - Endpoint", i);
//                 }, 300);
//         }
        
        
//         let awayTeamID = matchSechedule.data.events[i].awayTeam.id;
//         let awayTeamCode = matchSechedule.data.events[i].awayTeam.nameCode;
//         let awayTeamLogoUrl = basicUrl+`team/${awayTeamID}/image`;

//         if(!imageNames.includes(`${awayTeamID}.jpg`)){
//           downloadImage(awayTeamLogoUrl, path.join(staticFolderPath, `${awayTeamID}.jpg`));
//           setTimeout(function() {
//                     // Your code here
//                     console.log("Today Logo loop - Endpoint", i);
//                 }, 300);
//         }
        
//         let matchID = matchSechedule.data.events[i].id;
//         matchIDs.push(matchID);
//         // console.log(matchID);
        
//         if(matchSechedule.data.events[i]?.status.type != "finished"){
//           let matchStat = await axios.get(basicUrl+`match/${matchID}/statistics`, { headers: headers, proxy: false });
//           setTimeout(function() {
//               // Your code here
//               // console.log("Today - Server", i);
//           }, 300);
//           response[i].stat = matchStat.data.statistics;
//           let matchcurrent = await MatchCurrent.updateOne(
//             { id: matchID },
//             { $set: {
//               id: matchID,
//               status: matchSechedule.data.events[i].status.type,
//               homeTeam: matchSechedule.data.events[i].homeTeam.id,
//               awayTeam: matchSechedule.data.events[i].awayTeam.id,
//               stat: response[i],
//               date: today,
//             } },
//             { upsert: true },
//           );
//         } 
//         else{
//           const response = await MatchCurrent.findOne({id: matchID});
//           if(response == null){
//             let matchStat = await axios.get(basicUrl+`match/${matchID}/statistics`, { headers: headers, proxy: false });
//             setTimeout(function() {
//                 // Your code here
//                 // console.log("Today - Server", i);
//             }, 300);
//             response[i].stat = matchStat.data.statistics;
//             let matchcurrent = await MatchCurrent.updateOne(
//               { id: matchID },
//               { $set: {
//                 id: matchID,
//                 status: matchSechedule.data.events[i].status.type,
//                 homeTeam: matchSechedule.data.events[i].homeTeam.id,
//                 awayTeam: matchSechedule.data.events[i].awayTeam.id,
//                 stat: response[i],
//                 date: today,
//               } },
//               { upsert: true },
//             );
//           }
//         }
//       }

//     } catch (err) {
//       console.error(err.message);
//       console.log('NBA API Error');
//     }
// }

// Define an async function with a while loop
// async function myAsyncWhileLoop() {
//     while (true) {
//         await myAsyncFunction(); // Call the asynchronous function
//         setTimeout(function() {
//             // Your code here
//             console.log("while loop ");
//         }, 5000);
//     }
// }

// Start the async while loop
// myAsyncWhileLoop();


// Define Routes
app.use('/api/match-schedule', require('./routes/api/match-schedule'));
// app.use('/api/last', require('./routes/api/last'));
// app.use('/api/upcoming', require('./routes/api/profile'));
// app.use('/api/live', require('./routes/api/match-schedule'));
// app.use('/api/statistics', require('./routes/api/match-schedule'));





const PORT = 5000;

app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT}`));
