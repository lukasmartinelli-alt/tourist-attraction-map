function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
				var data = JSON.parse(httpRequest.responseText);
				if (callback) callback(data);
			}
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

mapboxgl.accessToken = 'pk.eyJ1IjoibW9yZ2Vua2FmZmVlIiwiYSI6IjIzcmN0NlkifQ.0LRTNgCc-envt9d5MzR75w';
var map = new mapboxgl.Map({
  container: 'map',
  style: '/site/style.json',
	hash: true
});
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
	fetchJSONFile('/outputs/washington_dc.geojson', function(collection) {
		console.log(collection);
		map.addSource('opentravelmap-attractions', {
			type: 'geojson',
			data: collection
		});
		addAttractionLayers();
	});

	// Create a popup, but don't add it to the map yet.
	var popup = new mapboxgl.Popup({
			closeButton: true,
			closeOnClick: true
	});

	function showPopup(e) {
			// Change the cursor style as a UI indicator.
			map.getCanvas().style.cursor = 'pointer';

			var feature = e.features[0];
			var coordinates = e.features[0].geometry.coordinates.slice();
			var title = '<h3>' + feature.properties['wikidata:label:en'] + ' <a href="https://www.wikidata.org/wiki/' + feature.properties['wikidata:qid'] + '"<i>(' + feature.properties['wikidata:qid'] + ')<i></a></h3>';
console.log(feature.properties);

			// Populate the popup and set its coordinates
			// based on the feature found.
			popup.setLngLat(coordinates)
					.setHTML(title)
					.addTo(map);
	}

	function hidePopup() {
			map.getCanvas().style.cursor = '';
	}

	map.on('mouseenter', 'attractions_3', showPopup);
	map.on('mouseleave', 'attractions_3', hidePopup);
	map.on('mouseenter', 'attractions_4', showPopup);
	map.on('mouseleave', 'attractions_4', hidePopup);
	map.on('mouseenter', 'attractions_5', showPopup);
	map.on('mouseleave', 'attractions_5', hidePopup);

});

function addAttractionLayers() {
	map.addLayer({
		"id": "attractions_3",
		"type": "symbol",
		"source": "opentravelmap-attractions",
		"filter": [
				"in",
				"popularity",
				2,
				3
		],
		"layout": {
				"text-line-height": 1.1,
				"text-size": 9,
				"text-allow-overlap": true,
				"icon-image": "{category}_11",
				"text-max-angle": 38,
				"symbol-spacing": 250,
				"text-font": [
						"DIN Offc Pro Medium",
						"Arial Unicode MS Regular"
				],
				"text-padding": 1,
				"text-offset": [
						0,
						1.2
				],
				"icon-optional": true,
				"text-rotation-alignment": "viewport",
				"icon-size": 0.8,
				"text-anchor": "top",
				"text-field": {
						"base": 1,
						"stops": [
								[
										0,
										""
								],
								[
										14,
										"{wikidata:label:en}"
								]
						]
				},
				"text-letter-spacing": 0.01,
				"icon-padding": 2,
				"text-max-width": 8
		},
		"paint": {
				"text-color": {
						"base": 1,
						"type": "categorical",
						"property": "category",
						"stops": [
								[
										"theatre",
										"hsl(233, 59%, 38%)"
								],
								[
										"landmark",
										"hsl(233, 59%, 38%)"
								]
						],
						"default": "hsl(0, 2%, 41%)"
				},
				"text-halo-color": "#ffffff",
				"text-halo-blur": 0,
				"text-halo-width": 0.5
		}
	});

	map.addLayer({
		"id": "attractions_4",
		"type": "symbol",
		"source": "opentravelmap-attractions",
		"filter": [
				"==",
				"popularity",
				4
		],
		"layout": {
				"text-line-height": 1.1,
				"text-size": 9,
				"icon-image": "{category}_15",
				"text-max-angle": 38,
				"symbol-spacing": 250,
				"text-font": [
						"DIN Offc Pro Medium",
						"Arial Unicode MS Regular"
				],
				"text-padding": 1,
				"text-offset": [
						0,
						1.2
				],
				"icon-optional": true,
				"text-rotation-alignment": "viewport",
				"icon-size": 0.9,
				"text-anchor": "top",
				"text-field": {
						"base": 1,
						"stops": [
								[
										0,
										""
								],
								[
										13,
										"{wikidata:label:en}"
								]
						]
				},
				"text-letter-spacing": 0.01,
				"icon-padding": 2,
				"text-max-width": 8
		},
		"paint": {
				"text-color": {
						"base": 1,
						"type": "categorical",
						"property": "category",
						"stops": [
								[
										"theatre",
										"hsl(233, 59%, 38%)"
								],
								[
										"landmark",
										"hsl(233, 59%, 38%)"
								]
						],
						"default": "hsl(0, 2%, 41%)"
				},
				"text-halo-color": "#ffffff",
				"text-halo-blur": 0,
				"text-halo-width": 0.5
		}
	})


	function createAttractionLayer(popularityFilter) {
		return {
			"id": "attractions_5",
			"type": "symbol",
			"source": "opentravelmap-attractions",
			"filter": popularityFilter,
			"layout": {
					"text-line-height": 1.1,
					"text-size": 9,
					"text-allow-overlap": true,
					"icon-image": "{category}_15",
					"text-max-angle": 38,
					"symbol-spacing": 250,
					"text-font": [
							"DIN Offc Pro Medium",
							"Arial Unicode MS Regular"
					],
					"text-padding": 1,
					"text-offset": [
							0,
							1.5
					],
					"icon-optional": true,
					"text-rotation-alignment": "viewport",
					"icon-size": 1.2,
					"text-anchor": "top",
					"text-field": "{wikidata:label:en}",
					"text-letter-spacing": 0.01,
					"icon-padding": 2,
					"text-max-width": 8
			},
			"paint": {
					"text-color": {
							"base": 1,
							"type": "categorical",
							"property": "category",
							"stops": [
									[
											"theatre",
											"hsl(233, 59%, 38%)"
									],
									[
											"landmark",
											"hsl(233, 59%, 38%)"
									]
							],
							"default": "hsl(0, 2%, 41%)"
					},
					"text-halo-color": "#ffffff",
					"text-halo-blur": 100,
					"text-halo-width": 2
			}
		}
	}
	map.addLayer(createAttractionLayer(["==", "popularity", 5]));
}
