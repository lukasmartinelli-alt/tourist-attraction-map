const wdk = require('wikidata-sdk');
const request = require('request');

exports.queryWikidata = queryWikidata;
exports.toGeoJSON = toGeoJSON;

function toGeoJSON(entity) {
	return {
		type: 'Feature',
		properties: Object.assign({
			'wikidata:qid': entity.id,
		}, extractTranslations(entity)),
		geometry: {
			type: 'Point',
			coordinates: extractCoordinates(entity)
		}
	};
}

function extractTranslations(entity) {
    var props = {}
    for (var key in entity.labels) {
      var label = entity.labels[key];
      props["wikidata:label:" + label.language] = label.value;
    }
    return props;
}

function extractCoordinates(entity) {
	var claims = entity.claims['P625'];
	if(claims && claims.length > 0) {
			return [
				parseFloat(claims[0].mainsnak.datavalue.value.longitude),
				parseFloat(claims[0].mainsnak.datavalue.value.latitude)
			];
	}
	throw new Error('No coordinate claim found in entity ' + entity.id);
}

function queryWikidata(qid, cb) {
  if(!qid) return null
  const url = wdk.getEntities({
    ids: qid,
    properties: ['info', 'labels', 'statements']
  });
  request.get(url, function(error, response, body) {
    if (error || response.statusCode != 200) {
      cb(new Error('Could not fetch entity ' + qid));
    }
    const result = JSON.parse(body);
    const entity = result.entities[qid];
    cb(null, entity);
  });
}
