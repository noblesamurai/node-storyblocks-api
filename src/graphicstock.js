const endpoint = require('./endpoint');
const downloadImage = require('../schema/graphicstock/download-image.json');
const getCollection = require('../schema/graphicstock/get-collection.json');
const getImage = require('../schema/graphicstock/get-image.json');
const getSimilarImages = require('../schema/graphicstock/get-similar-images.json');
const listCategories = require('../schema/graphicstock/list-categories.json');
const listCollections = require('../schema/graphicstock/list-collections.json');
const search = require('../schema/graphicstock/search.json');

const graphicstock = credentials => ({
  downloadImage: endpoint(downloadImage, credentials),
  getCollection: endpoint(getCollection, credentials),
  getImage: endpoint(getImage, credentials),
  getSimilarImages: endpoint(getSimilarImages, credentials),
  listCategories: endpoint(listCategories, credentials),
  listCollections: endpoint(listCollections, credentials),
  search: endpoint(search, credentials)
});

module.exports = graphicstock;
