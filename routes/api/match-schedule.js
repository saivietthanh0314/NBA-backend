const express = require('express');
const axios = require('axios');
require('dotenv').config();
const router = express.Router();
const fs = require('fs');
const path = require('path');

// const MatchCurrent = require('../../models/MatchCurrent');
// const MatchUpcoming = require('../../models/MatchUpcoming');
// const MatchHistory = require('../../models/MatchHistory');


// @route    POST api/match-schedule/today
// @desc     Create a post
// @access   Private
router.post(
  '/today',
  async (req, res) => {
    try {
      const basicUrl = process.env.REACT_APP_BASKETAPI_URL;
      const headers = {
        'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
        'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
      }

      //------------------------   Day  -------------------------------
      var date = new Date();
      var year = date.toLocaleString("en-US", { year: "numeric" });
      var month = date.toLocaleString("en-US", { month: "2-digit" });
      var day = date.toLocaleString("en-US", { day: "2-digit" });
      var today = `${day}/${month}/${year}`;
      console.log("today endpoint", today);

      //------------------------   Get Logo names  -------------------------------
      // const staticFolderPath = path.join(__dirname, 'static');
      const staticFolderPath = path.join(__dirname, "../../", 'static');

      // Ensure the static folder exists
      if (!fs.existsSync(staticFolderPath)) {
        fs.mkdirSync(staticFolderPath);
      }
      const imageNames = await getImageNames(staticFolderPath);

      //------------------------   Main API  -------------------------------
      let matchToday = await axios.get(basicUrl+`matches/${today}`, { headers: headers, proxy: false });
      let response = matchToday.data.events;
      let needed_response = []
      for(let i = 0; i<response?.length; i++){
      // for(let i = 0; i<matchCount; i++){
        
        let matchSeason = response[i]?.tournament.uniqueTournament.slug;
        if(matchSeason.toLowerCase().includes("nba") || matchSeason.toLowerCase().includes("ncaa") || matchSeason.toLowerCase().includes("ncaa-women")){
          let needed_match = response[i];
          let matchID = response[i].id;
          let matchStatus = response[i]?.status.type;  

          //==========    Logo Save   ==========
          let homeTeamID = response[i].homeTeam.id;        
          if(!imageNames.includes(`${homeTeamID}.jpg`)){
            let homeTeamLogoUrl = basicUrl+`team/${homeTeamID}/image`;
            await downloadImage(homeTeamLogoUrl, path.join(staticFolderPath, `${homeTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Today Endpoint - HomeTeam - ", homeTeamID);
                  }, 300);
          }
          
          
          let awayTeamID = response[i].awayTeam.id;
          if(!imageNames.includes(`${awayTeamID}.jpg`)){
            let awayTeamLogoUrl = basicUrl+`team/${awayTeamID}/image`;
            await downloadImage(awayTeamLogoUrl, path.join(staticFolderPath, `${awayTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Today Endpoint - AwayTeam - ", awayTeamID);
                  }, 300);
          }

          //==========    Add Statistics   ==========
          if(matchStatus.toLowerCase().includes("finished") || matchStatus.toLowerCase().includes("inprogress")){
            let matchStat = await axios.get(basicUrl+`match/${matchID}/statistics`, { headers: headers, proxy: false });
            needed_match.stat = matchStat.data.statistics;
            setTimeout(function() {
                      console.log("Get Stat - Today Endpoint - ", matchID);
                  }, 200);
          }
          
          needed_response.push(needed_match);
        }
      }
      

      res.json(needed_response);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Endpoint Error - Today');
    }
  }
);


// @route    POST api/match-schedule/lasts
// @desc     Create a post
// @access   Private
router.post(
  '/lasts',
  async (req, res) => {
    try {
      const basicUrl = process.env.REACT_APP_BASKETAPI_URL;
      const headers = {
        'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
        'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
      }

      //------------------------   Day  -------------------------------
      var today = new Date();
      var yesterday = new Date(today.setDate(today.getDate() - 1));
      var year = yesterday.toLocaleString("en-US", { year: "numeric" });
      var month = yesterday.toLocaleString("en-US", { month: "2-digit" });
      var day = yesterday.toLocaleString("en-US", { day: "2-digit" });
      var last = `${day}/${month}/${year}`;
      console.log("last endpoint", last);

      //------------------------   Get Logo names  -------------------------------
      // const staticFolderPath = path.join(__dirname, 'static');
      const staticFolderPath = path.join(__dirname, "../../", 'static');

      // Ensure the static folder exists
      if (!fs.existsSync(staticFolderPath)) {
        fs.mkdirSync(staticFolderPath);
      }
      const imageNames = await getImageNames(staticFolderPath);

      //------------------------   Main API  -------------------------------
      let matchLasts = await axios.get(basicUrl+`matches/${last}`, { headers: headers, proxy: false });
      let response = matchLasts.data.events;
      let needed_response = []
      for(let i = 0; i<response?.length; i++){
      // for(let i = 0; i<matchCount; i++){
        
        let matchSeason = response[i]?.tournament.uniqueTournament.slug;
        if(matchSeason.toLowerCase().includes("nba") || matchSeason.toLowerCase().includes("ncaa") || matchSeason.toLowerCase().includes("ncaa-women")){
          let needed_match = response[i];
          let matchID = response[i].id;
          let matchStatus = response[i]?.status.type;  

          //==========    Logo Save   ==========
          let homeTeamID = response[i].homeTeam.id;        
          if(!imageNames.includes(`${homeTeamID}.jpg`)){
            let homeTeamLogoUrl = basicUrl+`team/${homeTeamID}/image`;
            await downloadImage(homeTeamLogoUrl, path.join(staticFolderPath, `${homeTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Lasts Endpoint - HomeTeam - ", homeTeamID);
                  }, 300);
          }
          
          
          let awayTeamID = response[i].awayTeam.id;
          if(!imageNames.includes(`${awayTeamID}.jpg`)){
            let awayTeamLogoUrl = basicUrl+`team/${awayTeamID}/image`;
            await downloadImage(awayTeamLogoUrl, path.join(staticFolderPath, `${awayTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Lasts Endpoint - AwayTeam - ", awayTeamID);
                  }, 300);
          }

          //==========    Add Statistics   ==========
          if(matchStatus.toLowerCase().includes("finished") || matchStatus.toLowerCase().includes("inprogress")){
            let matchStat = await axios.get(basicUrl+`match/${matchID}/statistics`, { headers: headers, proxy: false });
            needed_match.stat = matchStat.data.statistics;
            setTimeout(function() {
                      console.log("Get Stat - Last Endpoint - ", matchID);
                  }, 200);
          }
          
          needed_response.push(needed_match);
        }
      }
      

      res.json(needed_response);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Endpoint Error - Lasts');
    }
  }
);

      

// @route    POST api/match-schedule/lives
// @desc     Create a post
// @access   Private
router.post(
  '/lives',
  async (req, res) => {
    try {
      const basicUrl = process.env.REACT_APP_BASKETAPI_URL;
      const headers = {
        'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
        'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
      }

      console.log("live endpoint");

      //------------------------   Get Logo names  -------------------------------
      // const staticFolderPath = path.join(__dirname, 'static');
      const staticFolderPath = path.join(__dirname, "../../", 'static');

      // Ensure the static folder exists
      if (!fs.existsSync(staticFolderPath)) {
        fs.mkdirSync(staticFolderPath);
      }
      const imageNames = await getImageNames(staticFolderPath);

      //------------------------   Main API  -------------------------------
      let matchLives = await axios.get(basicUrl+`matches/live`, { headers: headers, proxy: false })
      // console.log("lives - length - ", matchLives?.data.events.length)
      let response = matchLives.data.events;
      let needed_response = []
      for(let i = 0; i<response?.length; i++){
      // for(let i = 0; i<matchCount; i++){
        
        let matchSeason = response[i]?.tournament.uniqueTournament.slug;
        if(matchSeason.toLowerCase().includes("nba") || matchSeason.toLowerCase().includes("ncaa") || matchSeason.toLowerCase().includes("ncaa-women")){
          let needed_match = response[i];
          let matchID = response[i].id;
          let matchStatus = response[i]?.status.type;  

          //==========    Logo Save   ==========
          let homeTeamID = response[i].homeTeam.id;        
          if(!imageNames.includes(`${homeTeamID}.jpg`)){
            let homeTeamLogoUrl = basicUrl+`team/${homeTeamID}/image`;
            await downloadImage(homeTeamLogoUrl, path.join(staticFolderPath, `${homeTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Lives Endpoint - HomeTeam - ", homeTeamID);
                  }, 300);
          }
          
          
          let awayTeamID = response[i].awayTeam.id;
          if(!imageNames.includes(`${awayTeamID}.jpg`)){
            let awayTeamLogoUrl = basicUrl+`team/${awayTeamID}/image`;
            await downloadImage(awayTeamLogoUrl, path.join(staticFolderPath, `${awayTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Lives Endpoint - AwayTeam - ", awayTeamID);
                  }, 300);
          }

          //==========    Add Statistics   ==========
          if(matchStatus.toLowerCase().includes("finished") || matchStatus.toLowerCase().includes("inprogress")){
            let matchStat = await axios.get(basicUrl+`match/${matchID}/statistics`, { headers: headers, proxy: false });
            needed_match.stat = matchStat.data.statistics;
            setTimeout(function() {
                      console.log("Get Stat - Live Endpoint - ", matchID);
                  }, 200);
          }
          
          needed_response.push(needed_match);
        }
      }
      

      res.json(needed_response);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Endpoint Error - Live');
    }
  }
);

      
      
// @route    POST api/match-schedule
// @desc     Create a post
// @access   Private
router.post(
  '/upcomings',
  async (req, res) => {
    try {
      const basicUrl = process.env.REACT_APP_BASKETAPI_URL;
      const headers = {
        'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
        'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
      }

      //------------------------   Day  -------------------------------
      var today = new Date();
      var tomorrow = new Date(today.setDate(today.getDate() + 1));
      var year = tomorrow.toLocaleString("en-US", { year: "numeric" });
      var month = tomorrow.toLocaleString("en-US", { month: "2-digit" });
      var day = tomorrow.toLocaleString("en-US", { day: "2-digit" });
      var upcoming = `${day}/${month}/${year}`;
      console.log("upcoming - endpoint", upcoming);

      //------------------------   Get Logo names  -------------------------------
      // const staticFolderPath = path.join(__dirname, 'static');
      const staticFolderPath = path.join(__dirname, "../../", 'static');

      // Ensure the static folder exists
      if (!fs.existsSync(staticFolderPath)) {
        fs.mkdirSync(staticFolderPath);
      }
      const imageNames = await getImageNames(staticFolderPath);

      //------------------------   Main API  -------------------------------
      let MatchUpcomings = await axios.get(basicUrl+`matches/${upcoming}`, { headers: headers, proxy: false });
      let response = MatchUpcomings.data.events;
      let needed_response = []
      for(let i = 0; i<response?.length; i++){
      // for(let i = 0; i<matchCount; i++){
        
        let matchSeason = response[i]?.tournament.uniqueTournament.slug;
        if(matchSeason.toLowerCase().includes("nba") || matchSeason.toLowerCase().includes("ncaa") || matchSeason.toLowerCase().includes("ncaa-women")){
          let needed_match = response[i];
          let matchID = response[i].id;
          let matchStatus = response[i]?.status.type;  

          //==========    Logo Save   ==========
          let homeTeamID = response[i].homeTeam.id;        
          if(!imageNames.includes(`${homeTeamID}.jpg`)){
            let homeTeamLogoUrl = basicUrl+`team/${homeTeamID}/image`;
            await downloadImage(homeTeamLogoUrl, path.join(staticFolderPath, `${homeTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Upcomings Endpoint - HomeTeam - ", homeTeamID);
                  }, 300);
          }
          
          
          let awayTeamID = response[i].awayTeam.id;
          if(!imageNames.includes(`${awayTeamID}.jpg`)){
            let awayTeamLogoUrl = basicUrl+`team/${awayTeamID}/image`;
            await downloadImage(awayTeamLogoUrl, path.join(staticFolderPath, `${awayTeamID}.jpg`));
            setTimeout(function() {
                      console.log("Logo Save - Upcomings Endpoint - AwayTeam - ", awayTeamID);
                  }, 300);
          }

          //==========    Add Statistics   ==========
          if(matchStatus.toLowerCase().includes("finished") || matchStatus.toLowerCase().includes("inprogress")){
            let matchStat = await axios.get(basicUrl+`match/${matchID}/statistics`, { headers: headers, proxy: false });
            needed_match.stat = matchStat.data.statistics;
            setTimeout(function() {
                      console.log("Get Stat - Upcomings Endpoint - ", matchID);
                  }, 200);
          }
          
          needed_response.push(needed_match);
        }
      }
      

      res.json(needed_response);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Endpoint Error - Upcomings');
    }
  }
);


async function downloadImage(url, destination) {
 try {

    // Check if the file already exists
    if (fs.existsSync(destination)) {
        console.log('Image already exists. Skipping download.', destination);
        return;
    }
    
    const headers = {
      'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
      'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
    }
    const response = await axios({
      method: 'GET',
      url,
      headers: headers,
      responseType: 'stream',
    });

    // Create a write stream
    const writer = fs.createWriteStream(destination);

    // Pipe the response stream into the write stream
    await response.data.pipe(writer);

    // Return a promise that resolves when the write stream is finished
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
 } catch (error) {
    console.error('Error downloading image:', error);
 }
}

function getImageNames(folderPath) {
 // Read the directory
 const files = fs.readdirSync(folderPath);

 // Filter out image files
 const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
 });

 return imageFiles;
}

// @route    POST api/match-schedule
// @desc     Create a post
// @access   Private
router.post(
  '/save_logo',
  async (req, res) => {
    try {
      const basicUrl = process.env.REACT_APP_BASKETAPI_URL;
      const headers = {
        'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key, 
        'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host
      }
      console.log("saveLogo - endpoint : Date - ", req.body.date);
      const date = req.body.date;
      // var today = new Date();
      // var tomorrow = new Date(today.setDate(today.getDate() + 1));
      // var year = tomorrow.toLocaleString("en-US", { year: "numeric" });
      // var month = tomorrow.toLocaleString("en-US", { month: "2-digit" });
      // var day = tomorrow.toLocaleString("en-US", { day: "2-digit" });
      // var upcoming = `${day}/${month}/${year}`;
      

      // console.log(imageNames);
      let matchSechedule = await axios.get(basicUrl+`matches/${date}`, { headers: headers, proxy: false });

      // Path to the static folder where you want to save the image
      const staticFolderPath = path.join(__dirname, "../../", 'static');

      // Ensure the static folder exists
      if (!fs.existsSync(staticFolderPath)) {
        fs.mkdirSync(staticFolderPath);
      }
      const imageNames = getImageNames(staticFolderPath);
      for(let i = 0; i<matchSechedule.data.events.length; i++){
      // for(let i = 0; i<24; i++){
        let homeTeamID = matchSechedule.data.events[i].homeTeam.id;
        let homeTeamCode = matchSechedule.data.events[i].homeTeam.nameCode;
        let homeTeamLogoUrl = basicUrl+`team/${homeTeamID}/image`;
        
        if(!imageNames.includes(`${homeTeamID}.jpg`)){
          downloadImage(homeTeamLogoUrl, path.join(staticFolderPath, `${homeTeamID}.jpg`));
          setTimeout(function() {
                    // Your code here
                    console.log("Logo loop - Endpoint", i);
                }, 600);
        }
        
        
        let awayTeamID = matchSechedule.data.events[i].awayTeam.id;
        let awayTeamCode = matchSechedule.data.events[i].awayTeam.nameCode;
        let awayTeamLogoUrl = basicUrl+`team/${awayTeamID}/image`;

        if(!imageNames.includes(`${awayTeamID}.jpg`)){
          downloadImage(awayTeamLogoUrl, path.join(staticFolderPath, `${awayTeamID}.jpg`));
          setTimeout(function() {
                    // Your code here
                    console.log("Logo loop - Endpoint", i);
                }, 600);
        }
        
      }

      // console.log(matchIDs);

      res.json({status: "success"});
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;