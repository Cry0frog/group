export const pinGreen = 'assets/map/pin_green.png';
export const pinRed = 'assets/map/pin_red.png';
export const pinBlue = 'assets/map/pin_blue.png';

const iconResource = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/';
export const centerIcon = `${iconResource}center.png`;
export const listIcon = `${iconResource}view_list.png`;

export const stylesMap = {
    'route': function(feature) {
    var geometry = feature.getGeometry();
    var styles = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 10
        }),
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'assets/map/pin_red.png'
        })
      })
    ];
  
    geometry.forEachSegment(function(start, end) {
      var dx = end[0] - start[0];
      var dy = end[1] - start[1];
      var rotation = Math.atan2(dy, dx);
      
      styles.push(new ol.style.Style({
        geometry: new ol.geom.Point(end),
        /*image: new ol.style.Icon({
          src: 'assets/map/arrow.png',
          anchor: [0.75, 0.5],
          rotateWithView: true,
          rotation: -rotation
        })*/
      }));
    });
  
    return styles;
  }
};

