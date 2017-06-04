import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class UserMapContainer extends Component {
  state = {
    position: [4.814278, -75.694558]
  };

  render() {
    const { position } = this.state;
    return (
      <div className="leaflet-container">
        <Map center={position} zoom={10}>
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={position} draggable>
            <Popup>
              <span>A pretty CSS3 popup.<br />Easily customizable.</span>
            </Popup>
          </Marker>
        </Map>
      </div>
    );
  }
}

export default UserMapContainer;
