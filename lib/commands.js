'use strict';
const csv = require('csv');
const ldj = require('ldjson-stream');
const through2 = require('through2');
const wikidata = require('./wikidata');

exports.addLabel = addLabel;
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

function addLabel(inputStream, outputStream) {
  inputStream
  .pipe(csv.parse())
  .pipe(through2.obj(function (record, enc, callback) {
    recordToEntity(record, callback);
  }))
  .pipe(through2.obj(function (record, enc, callback) {
    if (!('en' in record.labels)) {
      return callback(new Error('No english label for qid ' + record.id));
    }
    callback(null, [record.id, record.labels['en'].value]);
  }))
  .pipe(csv.stringify())
  .pipe(outputStream)
}

function toWikidata(inputStream, outputStream) {
  inputStream
  .pipe(csv.parse())
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
