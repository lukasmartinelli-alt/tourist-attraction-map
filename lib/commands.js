'use strict';
const csv = require('csv');
const ldj = require('ldjson-stream');
const through2 = require('through2');
const wikidata = require('./wikidata');

exports.toWikidata = toWikidata;
exports.toGeoJSON= toGeoJSON;
exports.toCollection= toCollection;

function recordToEntity(record, callback) {
  if (record[0] === 'landmark_qid') return callback(null);
  const qid = record[0];
  wikidata.queryWikidata(qid, function (err, entity) {
    if (err) return callback(err);
    callback(null, entity);
  });
}

function toWikidata(inputStream, outputStream) {
  inputStream
  .pipe(csv.parse({ delimiter: "\t" }))
  .pipe(through2.obj(function (record, enc, callback) {
    recordToEntity(record, callback);
  }))
  .pipe(ldj.serialize())
  .pipe(outputStream)
}

function toGeoJSON(inputStream, outputStream) {
  inputStream
  .pipe(ldj.parse())
  .pipe(through2.obj(function (entity, enc, callback) {
		callback(null, wikidata.toGeoJSON(entity));
  }))
  .pipe(ldj.serialize())
  .pipe(outputStream);
}

function toCollection(inputStream, callback) {
  const collection = {
    type: 'FeatureCollection',
    features: []
  };
  inputStream
  .pipe(ldj.parse())
  .on('data', function(feature) {
    collection.features.push(feature);
  })
  .on('finish', function() {
    callback(collection);
  })
}
