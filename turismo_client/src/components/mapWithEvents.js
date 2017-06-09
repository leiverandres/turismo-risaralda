import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

class MapWithEvents extends Component {
  static propTypes = {
    position: PropTypes.array.isRequired,
    events: PropTypes.array.isRequired,
    handleMapClick: PropTypes.func,
    editable: PropTypes.bool,
    onSeeMore: PropTypes.func,
    onEdit: PropTypes.func
  };

  static defaultProps = {
    editable: false
  };

  render() {
    const {
      position,
      events,
      editable,
      handleMapClick,
      onSeeMore,
      onEdit
    } = this.props;

    return (
      <div className="leaflet-container">
        <Map
          center={position}
          zoom={10}
          onClick={editable && handleMapClick}
          ref="map"
        >
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {events.map(event => {
            const coordinates = [
              event.coordinates.latitude,
              event.coordinates.longitude
            ];
            return (
              <Marker
                key={event._id}
                position={coordinates}
                draggable={editable && true}
              >
                <Popup>
                  <div>
                    <h1>{event.name}</h1>
                    <p>{`${event.description.slice(0, 140)} ...`}</p>
                    {onSeeMore &&
                      <a onClick={onSeeMore.bind(null, event)}>Ver más</a>}
                    {onEdit && <a onClick={onEdit.bind(null, event)}>Editar</a>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </Map>
      </div>
    );
  }
}

export default MapWithEvents;
