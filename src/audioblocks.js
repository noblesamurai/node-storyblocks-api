const endpoint = require('./endpoint');
const downloadAudio = require('../schema/audioblocks/download-audio.json');
const getAudio = require('../schema/audioblocks/get-audio.json');
const getCollection = require('../schema/audioblocks/get-collection.json');
const getSimilarAudio = require('../schema/audioblocks/get-similar-audio.json');
const listCategories = require('../schema/audioblocks/list-categories.json');
const listCollections = require('../schema/audioblocks/list-collections.json');
const listSubCategories = require('../schema/audioblocks/list-subcategories.json');
const search = require('../schema/audioblocks/search.json');

const audioblocks = credentials => ({
  downloadAudio: endpoint(downloadAudio, credentials),
  getAudio: endpoint(getAudio, credentials),
  getCollection: endpoint(getCollection, credentials),
  getSimilarAudio: endpoint(getSimilarAudio, credentials),
  listCategories: endpoint(listCategories, credentials),
  listCollections: endpoint(listCollections, credentials),
  listSubCategories: endpoint(listSubCategories, credentials),
  search: endpoint(search, credentials)
});

module.exports = audioblocks;
