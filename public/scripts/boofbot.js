//Package initalizations
const fs = require('fs');
const axios = require('axios');
const https = require('https');
const cheerio = require("cheerio");
const ObjectsToCsv = require('objects-to-csv');
const CSVToJSON = require("csvtojson");


//Global property array
var propertyList = [];

//Bypass Site Security
axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});


module.exports = async function (idList, user, county) {

//Loads idList into array 
searchList = idList.split(' ');

//Processes county info
var countyUrl = "";
var fetchTag = "";
if(county == "gaston") {
    countyUrl = "https://gis.gastongov.com/Map/Default.aspx?AKPAR=";
    fetchTag = '#property-details-toolbox > div.card-body.text-light > table:nth-child(1) > tbody > tr:nth-child(4) > td';
};
if(county == "york") {
    countyUrl = "https://maps2.yorkcountygov.com/ez/Report_Property.aspx?type=tmid&key="
    fetchTag = '#cphMain_addr_Address';
};


//Pulls site data
for(let i = 0; i < searchList.length; i++) {
    axios.get(countyUrl + searchList[i]).then(urlResponse => {

        //Loads site data into cheerio
        const $ = cheerio.load(urlResponse.data);

        //Gets address data
        let address = $(fetchTag).text();
        console.log(address);
        //Processes address string for export
        let pData = address.split(','); 

        let stateZip = pData[2];
        let state_zip = stateZip.split(' ');

        let propertyObject = {
            taxID: searchList[i],
            street: pData[0],
            city: pData[1],
            state: state_zip[1],
            zip: state_zip[2]
        };

        propertyList.push(propertyObject);

        
        console.log(propertyList);

        //initalize csv
        let csv = new ObjectsToCsv(propertyList);

        //Save to file
        csv.toDisk('./public/csvfiles/' + user +'.csv');
        console.log("CSV Created");
    });
    };
    console.log("Search Complete")
};





