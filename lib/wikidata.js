const wdk = require('wikidata-sdk');
const request = require('request');

exports.queryWikidata = queryWikidata;
exports.toGeoJSON = toGeoJSON;

function stripNullProps(geojson) {
	Object.keys(geojson.properties).forEach(function(key) {
		if (geojson.properties[key] === null) {
			delete geojson.properties[key];
		}
	});
	return geojson;
}

function toGeoJSON(entity, options) {
  options = Object.assign({ includeLabels: [] }, options);
	const geojson = {
		type: 'Feature',
		properties: Object.assign({
			'wikidata:qid': entity.id,
			'wikidata:image_url': extractStatementImageUrl(entity),
			'wikidata:surface_area': extractStatementIntQuantity(entity, 'P2046'),
			'wikidata:postal_code': extractStatementString(entity, 'P281'),
			'wikidata:official_site': extractStatementString(entity, 'P856'),
			'wikidata:elevation': extractStatementIntQuantity(entity, 'P2044'),
		}, extractTranslations(entity, options.includeLabels)),
		geometry: {
			type: 'Point',
			coordinates: extractCoordinates(entity)
		}
	};
	return stripNullProps(geojson);
}

function extractStatementImageUrl(entity) {
		const filename = extractStatementString(entity, 'P18');
		if (!filename) return null;
		return 'https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(filename);
}

function extractStatementString(entity, claimId) {
    var claims = entity.claims[claimId];
    if(claims && claims.length > 0) {
        return claims[0].mainsnak.datavalue.value;
    }
    return null
}

function extractStatementIntQuantity(entity, claimId) {
    var claims = entity.claims[claimId];
    if(claims && claims.length > 0) {
        return parseInt(claims[0].mainsnak.datavalue.value.amount)
    }
    return null
}

function extractTranslations(entity, includeLabels) {
    var props = {}
    for (var key in entity.labels) {
      if (includeLabels.length !== 0 && includeLabels.indexOf(key) < 0) continue;
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
