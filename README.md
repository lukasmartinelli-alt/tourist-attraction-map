# Landmarks for Maps

A landmark is a recognizable natural or artificial feature used for navigation and orientation.
This repository collects [Wikidata](https://www.wikidata.org/wiki/Q2319498) entities that
are landmarks for cartographic use.

![](https://user-images.githubusercontent.com/1288339/38777173-4849b1d0-40c1-11e8-8f4a-632b659870c3.png)

## How to contribute

In `sources` create a new TSV file with the first column being the QID of the entity in Wikidata and an optional second column to make it easier to work with the data.

```
landmark_qid	debug_label
Q216344	Arlington National Cemetery
Q54109	United States Capitol
```

Before you reference a Wikidata entity ensure:
- It has a [`P625` coordinate location statement](https://www.wikidata.org/wiki/Property:P625)

## Create GeoJSON from source data

Create a GeoJSON feature collection.

```
cat sources/**/*.csv \
    | node bin/openlandmarks.js to-wikidata \
    | node bin/openlandmarks.js to-geojson \
    | node bin/openlandmarks.js to-collection > openlandmarks.geojson
```


```
node bin/openlandmarks.js city-collection sources/washington_dc > outputs/washington_dc.geojson
```
