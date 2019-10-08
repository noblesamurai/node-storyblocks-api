const endpoint = require('./endpoint');
const downloadVideo = require('../schema/videoblocks/download-video.json');
const getCollection = require('../schema/videoblocks/get-collection.json');
const getSimilarVideos = require('../schema/videoblocks/get-similar-videos.json');
const getVideo = require('../schema/videoblocks/get-video.json');
const listCategories = require('../schema/videoblocks/list-categories.json');
const listCollections = require('../schema/videoblocks/list-collections.json');
const search = require('../schema/videoblocks/search.json');

const videoblocks = credentials => ({
  downloadVideo: endpoint(downloadVideo, credentials),
  getCollection: endpoint(getCollection, credentials),
  getSimilarVideos: endpoint(getSimilarVideos, credentials),
  getVideo: endpoint(getVideo, credentials),
  listCategories: endpoint(listCategories, credentials),
  listCollections: endpoint(listCollections, credentials),
  search: endpoint(search, credentials)
});

module.exports = videoblocks;
