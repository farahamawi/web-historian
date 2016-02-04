var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
   fs.readFile(exports.paths.list,function(err,data) {
    if(err) {
      throw err;
    } else {
      callback(data.toString().split('\n'));
    }
   });
};

exports.isUrlInList = function(url, callback) {
  callback(_.contains(exports.readListOfUrls(function(v){return v}), url));
};

exports.addUrlToList = function(url,callback) {
  if(!exports.isUrlInList(url,function(v){return v})) {
   fs.writeFile(exports.paths.list,url + '\n',callback); 
  }
};

exports.isUrlArchived = function(url,callback) {
  fs.stat(exports.paths.archivedSites + '/' + url,callback);
};

exports.downloadUrls = function(urlArray) {
  var options = {
    host: '',
    port: 80,
    path: "/"
  };

  for(var i=0;i<urlArray.length;i++){
    options.host = urlArray[i];
    var body = '';

    var req = http.request(options,function(res){
      res.on('data',function(chunk){
        body+=chunk;
      });

      res.on('end',function(){
        var fixtureName = options.host;
        var fixturePath = exports.paths.archivedSites + "/" + fixtureName;
        fs.open(fixturePath, "w",'0666',function(err,fd){
          console.log('FD is ',fd);
          fs.writeFile(fixturePath, body,'utf8', function(){
            
            fs.close(fd);
          });
        });
      });
    });
    req.end();  
  }
};  
