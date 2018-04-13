# Landmarks for Maps

A landmark is a recognizable natural or artificial feature used for navigation and orientation.
This repository collects [Wikidata](https://www.wikidata.org/wiki/Q2319498) entities that
are landmarks for cartographic use.

## How to contribute

In `sources` create a new TSV file with the first column being the QID of the entity in Wikidata and an optional second column to make it easier to work with the data.

```
landmark_qid	debug_label
Q216344	Arlington National Cemetery
Q54109	United States Capitol
```

Before you reference a Wikidata entity ensure:
- It has a [`P625` coordinate location statement](https://www.wikidata.org/wiki/Property:P625)
