//request pakage
//npm install request
//ci =>request

let req=require("request");
let fs=require("fs");
//npm install cheerio
let ch=require("cheerio");
//const { request } = require("http");

//Accessing through main page
req("https://www.espncricinfo.com/series/_/id/8048/season/2020/indian-premier-league",mainpage);
function mainpage(err,resp,html){
  let STool=ch.load(html);
  let result= STool("a[data-hover='View All Results']");
  let Rurl=STool(result).attr("href");
  resultpage(Rurl);
}

function resultpage(Murl){
  //input=> url, fn
  //All Matches
  req(Murl,getAllMurl);
  function getAllMurl(err,resp,html){
    //console.log(html);
    let STool= ch.load(html);
    let allmatchUrlElem= STool("a[data-hover='Scorecard']");
    for(let i=0; i<allmatchUrlElem.length; i++){
      let href= STool(allmatchUrlElem[i]).attr("href");
      let fUrl="https://www.espncricinfo.com"+href;
      findDatofMatch(fUrl);
    }
  }

  function findDatofMatch(url){
    req(url,urlkAns);

    function urlkAns(err,response,html){
        console.log(err);
        //  console.log(res.statusCode);
        //  console.log(html);

        //load file =>  (HTML Pages Recieved)
        console.log("Recieved input");
        //load html
          let STool=ch.load(html);
        //single
        //let output=STool("div.summary");
        //console.log(output.html());
        //console.log(output.text());
        //fs.writeFileSync("summary.html",output.html());
      
        //inning isolate
        let tableElem=STool("div.card.content-block.match-scorecard-table .Collapsible");
        console.log(tableElem.length);
        //let fullHtml="<table>"
        let count=0;
        for(let i=0; i<tableElem.length; i++){
          let teamName=STool(tableElem[i]).find("h5.header-title.label").text();
          let rowsofaTeam=STool(tableElem[i]).find(".table.batsman").find("tbody tr");

          for(let j=0; j<rowsofaTeam.length; j++){
            let rCols=STool(rowsofaTeam[j]).find("td");
            let isBatsManRow=STool(rCols[0]).hasClass("batsman-cell");

            if(isBatsManRow==true){
              count++;
              let pName=STool(rCols[0]).text();
              let runs=STool(rCols[2]).text();
              let balls=STool(rCols[3]).text();
              let fours=STool(rCols[5]).text();
              let sixes=STool(rCols[6]).text();
              let sr=STool(rCols[7]).text();
              console.log(`Name:${pName}  Runs:${runs}  Balls:${balls}  Fours:${fours}  Sixes:${sixes}  Strike Rate:${sr}`);
            }
          }
        console.log("No of batsman in a team : ",count);
        console.log(teamName);
        count=0;
        console.log("```````````````````````````````````````````````````````````````````````````");
      }
    }
  }   
}


//again new complete file
//request pakage
//npm install request
//ci =>request

let req=require("request");
let fs=require("fs");
//npm install cheerio
let ch=require("cheerio");
let path=require("path");
//const { request } = require("http");
let xlsx=require("xlsx");

//Accessing through main page
req("https://www.espncricinfo.com/series/_/id/8048/season/2020/indian-premier-league",mainpage);
function mainpage(err,resp,html){
  let STool=ch.load(html);
  let allmatchPageUrl= STool("a[data-hover='View All Results']").attr("href");
  let furl="https://www.espncricinfo.com"+allmatchPageUrl;
  resultpage(furl);
}

function resultpage(furl){
  //input=> url, fn
  //All Matches
  req(furl,getAllMurl);

  function getAllMurl(err,resp,html){
    //console.log(html);
    let STool= ch.load(html);
    let allmatchUrlElem= STool("a[data-hover='Scorecard']");

    for(let i=0; i<allmatchUrlElem.length; i++){
      let href= STool(allmatchUrlElem[i]).attr("href");
      let fUrl="https://www.espncricinfo.com"+href;

      findDatofMatch(fUrl);
    }
  }

  function findDatofMatch(url){
    req(url,urlkAns);
    function urlkAns(err,response,html){
      console.log(err);
      //  console.log(res.statusCode);
      //  console.log(html);

      //load file =>  (HTML Pages Recieved)
      console.log("Recieved input");
      //load html
      let STool=ch.load(html);
      //single
      //let output=STool("div.summary");
      //console.log(output.html());
      //console.log(output.text());
      //fs.writeFileSync("summary.html",output.html());
        
      //inning isolate
      let tableElem=STool("div.card.content-block.match-scorecard-table .Collapsible");
      console.log(tableElem.length);
      //let fullHtml="<table>"
      let count=0;
      for(let i=0; i<tableElem.length; i++){
        let teamName=STool(tableElem[i]).find("h5.header-title.label").text();
        let rowsofaTeam=STool(tableElem[i]).find(".table.batsman").find("tbody tr");
        // Royal Challengers Bangalore Innings (20 overs maximum)
        // [Royal Challengers Bangalore , (20 overs maximum)]
        let teamStrArr= teamName.split("Innings");
        teamName=teamStrArr[0].trim();
        console.log(teamName);

        for(let j=0; j<rowsofaTeam.length; j++){
          let rCols=STool(rowsofaTeam[j]).find("td");
          let isBatsManRow=STool(rCols[0]).hasClass("batsman-cell");

          if(isBatsManRow==true){
            count++;
            let pName=STool(rCols[0]).text().trim();
            let runs=STool(rCols[2]).text().trim();
            let balls=STool(rCols[3]).text().trim();
            let fours=STool(rCols[5]).text().trim();
            let sixes=STool(rCols[6]).text().trim();
            let sr=STool(rCols[7]).text().trim();
            //console.log(`Name:${pName}  Runs:${runs}  Balls:${balls}  Fours:${fours}  Sixes:${sixes}  Strike Rate:${sr}`);
            processPlayer(teamName,pName,runs,balls,fours,sixes,sr);
          }
        }
        console.log("No of batsman in a team : ",count);
        console.log(teamName);
        count=0;
        console.log("```````````````````````````````````````````````````````````````````````````");
      }
    }
  }   
}

function processPlayer(team,name,runs,balls,fours,sixes,sr){
  let dirPath=team;
  let pMatchStats={
    Team:team,
    Name:name,
    Balls:balls,
    Fours:fours,
    Sixes:sixes,
    SR:sr,
    Runs:runs
  }
  if(fs.existsSync(dirPath)){
    //file check
    // console.log("Folder exist")
  }
  else{
    // create folder 
    // create file
    // add data
    fs.mkdirSync(dirPath);
  }
  let playerFilePath= path.join(dirPath,name+".json");
  let pData=[];
  if(fs.existsSync(playerFilePath)){
    pData=require(`./${playerFilePath}`);
    pData.push(pMatchStats);
  }
  else{
    // create file
    console.log("File of player",playerFilePath,"created");
    pData=[pMatchStats];
  }
  fs.writeFileSync(playerFilePath,JSON.stringify(pData));
}




