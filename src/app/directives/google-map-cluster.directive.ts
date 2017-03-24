import { Directive, AfterContentInit, QueryList, Input, ContentChildren } from '@angular/core';
import { GoogleMapsAPIWrapper, SebmGoogleMap, SebmGoogleMapMarker, MarkerManager } from 'angular2-google-maps/core';
import { GoogleMap, Marker } from 'angular2-google-maps/core/services/google-maps-types';

import { PinSearchResultsDto } from '../models/pin-search-results-dto';
import { GoogleMapService } from '../services/google-map.service';
import '../../scripts/markerclusterer.js'

declare const MarkerClusterer;

interface IMarkerManager {
 _markers?: any;
  next(): any;
}
//MarkerManager.prototype.markerKeys = function() { return this._markers.keys(); }

// An Attribute Directive that creates a MarkerClusterer in the map once the markers are loaded.

@Directive({ selector: 'google-map-cluster' })
export class GoogleMapClusterDirective implements AfterContentInit {
  private map: GoogleMap;
  private cluster;

  constructor(
    private mapHlpr: GoogleMapService,
    private wrapper: GoogleMapsAPIWrapper,
    private markerManager: MarkerManager,
  ) {}

  ngAfterContentInit() {
    this.wrapper.getNativeMap().then(map => {
      let options = {
        averageCenter: true,
        imagePath: "https://image.ibb.co/cjEhdv/CLUSTER"
      };
      let sebmMarkers = <IMarkerManager>this.markerManager["_markers"].keys(); //markerKeys();
      let markers = [];
      let promises = [];
      let sebmMarker;
      while (!(sebmMarker = sebmMarkers.next()).done) {
        sebmMarker = sebmMarker.value;
        if (sebmMarker.iconUrl.endsWith("PERSON.png") ||
            sebmMarker.iconUrl.endsWith("GATHERING.png")) {
          let promise = this.markerManager.getNativeMarker(sebmMarker);
          promises.push(promise);
          promise.then(marker => {
            //marker.prop = 'test';
            markers.push(marker);
          })
        }
      }
      Promise.all(promises).then(() => {

        this.cluster = new MarkerClusterer(map, markers, options);



        //console.log('CLUSTERS');
        //console.log(this.cluster);

        var markerClusters = this.cluster.clusters_;

        setTimeout(()=>{
          //console.log('CLUSTERS W/ MARKERS');
          //console.log(markerClusters);
          //console.log('TEST: ' + markerClusters[0]);
          //console.log('CLUSTERS W/ MARKERS LENGTH: ' + markerClusters.length);

          var markersInClusters = [];

          for (var k = 0; k < markerClusters.length; k++) {

            //console.log('Iterating throught marker clusters');
            var mrkrs = markerClusters[k].markers_;
            //console.log('IND MARKERS: ');
            //console.log(mrkrs);

            for (var l = 0; l < markers.length; l++) {
              var mrkr = markers[l];
              markersInClusters.push(mrkr);
            }

          }

          //console.log('MARKERS IN CLUSTERS');
          //console.log(markersInClusters);

          this.mapHlpr.emitClusterMarkerData(markersInClusters);
        },1);


        // console.log('CLUSTERS W/ MARKERS');
        // console.log(markerClusters);
        // console.log('TEST: ' + markerClusters[0]);
        // console.log('CLUSTERS W/ MARKERS LENGTH: ' + markerClusters.length);
        //
        // var markersInClusters = [];
        //
        // for (var k = 0; k < markerClusters.length; k++) {
        //
        //   console.log('Iterating throught marker clusters');
        //   var mrkrs = markerClusters[k].markers_;
        //   console.log('IND MARKERS: ');
        //   console.log(mrkrs);
        //
        //   // for (var l = 0; l < markers.length; l++) {
        //   //   var mrkr = markers[l];
        //   //   markersInClusters.push(mrkr);
        //   // }
        //
        // }
        //
        // console.log('MARKERS IN CLUSTERS');
        // console.log(markersInClusters);
      })

    })
  }
}
