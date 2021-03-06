'use strict';
/* jshint quotmark: false */

var React = require('react');
var gMap = require('../../../lib/gMapLib');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      style: {
          height: window.innerHeight,
          width: window.innerWidth,
          position: 'absolute',
          top: 0,
          left: 0
        }
    };
  }, 
  componentDidMount: function() {
    gMap.startGMap({lng:-33.73, lat:149.02});
    gMap.disableAddPins = true;
    var hunt = this.props.hunt;
    gMap.getGeolocation(function(value){
      gMap.setCenter(value);
      var mapArray = [];
      var currentPinIndex = hunt.currentPinIndex;
      var numOfPins = hunt.pins.length;
      currentPinIndex = Math.min(currentPinIndex, numOfPins);
      for (var i = 0; i < hunt.pins.length && i < currentPinIndex; i++) {
        mapArray.push([hunt.pins[i].geo.lat,hunt.pins[i].geo.lng]);
      }
      if(mapArray.length > 0){
        gMap.importMap(mapArray);
      }
    });
    gMap.showCurrentLocation();
    this.updatePosInterval = setInterval(function(){
      gMap.showCurrentLocation();
    },5000);
  },
  componentWillUnmount: function() {
    clearInterval(this.updatePosInterval);
  },

  render: function () {
    return (
      <div id="gMap" style={this.state.style}></div>
    );
  }
});
