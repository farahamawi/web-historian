var path = require('path');
var archive = require('../helpers/archive-helpers.js');
var helpers = require('./http-helpers.js');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  if(req.method === 'GET'){
    var ourPath = '';
    if(req.url === '/'){
      ourPath = archive.paths.siteAssets + '/index.html';
    } else {
      ourPath = archive.paths.archivedSites + req.url;
    }

    fs.readFile(ourPath,'utf8',function(err,data){
      if(err){
        helpers.writeResponse(404,res,data);
      } else {
        helpers.writeResponse(200,res,data);
      }  
    });
  } else if(req.method === 'POST'){
    
    //TODO: check is site is already in sites.txt
    var body = '';
    req.on('data',function(data){
      body += data;
    });
    req.on('end',function(){
      fs.writeFile(archive.paths.list, body.slice(4) + '\n', function(err,data){
        if(err){
          console.log(err);
        } else {
          helpers.writeResponse(302,res,data);
        }
      });  
    });
  }
};
