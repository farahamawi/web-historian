// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers.js');
var _ = require('underscore');

exports.fetcher = function() {
  //archive.createFile(archive.paths.archivedSites + '/ourfile.txt', 'Nailed it');
  archive.readListOfUrls(function(array) {
    archive.downloadUrls(array);
  });
  //setInterval(exports.fetcher,30000);
};

