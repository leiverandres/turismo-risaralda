import React, { Component } from 'react';
import {
  Grid,
  Message,
  Card,
  Label,
  Header,
  Icon,
  Dropdown
} from 'semantic-ui-react';

import requests from '../utils/requests';
import ListItemsWithPagination from '../components/listItemsWithPagination';
import EventInfoModal from '../components/eventInfoModal';

const itemsPerPage = 10;

const EventCard = ({ event, onSeeMore }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>{event.name}</Card.Header>
        <Card.Meta onClick={onSeeMore}>
          <a>
            Ver información completa
          </a>
        </Card.Meta>
        <Card.Description content={event.description.slice(0, 140)} />
      </Card.Content>
      <Card.Content extra>
        <Label tag>{event.channel.activity}</Label>
        <Label tag>{event.channel.municipality}</Label>
      </Card.Content>
    </Card>
  );
};

const FilterToolkit = ({ options, name, iconName, handleChange }) => {
  return (
    <Dropdown
      placeholder={name}
      fluid
      multiple
      search
      selection
      options={options}
      name={name}
      onChange={handleChange}
    />
  );
};

class UserBoardContainer extends Component {
  state = {
    showModal: false,
    modalEvent: {},
    loading: false,
    pageSelected: 1,
    pageNumbers: [],
    events: [],
    activityOpts: [],
    municipalityOpts: [],
    filterActivity: [],
    filterMunicipality: [],
    allEvents: []
  };

  componentDidMount() {
    this.fetchEvents();
  }

  generateOpts = events => {
    const activityOpts = [];
    const municipalityOpts = [];
    for (let e of events) {
      if (activityOpts.indexOf(e.channel.activity) === -1) {
        activityOpts.push(e.channel.activity);
      }

      if (municipalityOpts.indexOf(e.channel.municipality) === -1) {
        municipalityOpts.push(e.channel.municipality);
      }
    }

    this.setState({
      activityOpts: activityOpts.map(act => {
        return { key: act, text: act, value: act };
      }),
      municipalityOpts: municipalityOpts.map(mun => {
        return { key: mun, text: mun, value: mun };
      })
    });
  };

  fetchEvents = () => {
    this.setState({ loading: true });
    requests
      .getUserEvents()
      .then(res => {
        const events = res.data;

        this.setState({
          loading: false,
          allEvents: events,
          events
        });
        this.generateOpts(events);
        this.calculatePages();
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  };

  calculatePages = () => {
    const elements = this.state.events;
    const pages = Math.ceil(elements.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(i);
    }
    this.setState({ pageNumbers });
  };

  handlePageChange = page => {
    this.setState({ pageSelected: page });
  };

  showModal = eventObj => {
    this.setState({ showModal: true, modalEvent: eventObj });
  };

  closeModal = () => {
    this.setState({ showModal: false, modalEvent: {} });
  };

  onFilterChange = (ev, { name, value }) => {
    if (name === 'Municipios') {
      this.setState({ filterMunicipality: value });
    } else {
      this.setState({ filterActivity: value });
    }
    console.log('filtering');
    this.setState(prevState => {
      const { filterActivity, filterMunicipality } = prevState;
      console.log(filterActivity, filterMunicipality);
      console.log(prevState.events);
      let filteredEvents = prevState.allEvents.filter(ev => {
        const curActivity = ev.channel.activity;
        const curMunicipality = ev.channel.municipality;
        if (filterActivity.length > 0) {
          return filterActivity.indexOf(curActivity) !== -1;
        }

        if (filterMunicipality.length > 0) {
          return filterMunicipality.indexOf(curMunicipality) !== -1;
        }

        return false;
      });

      if (
        filteredEvents.length === 0 &&
        filterActivity.length === 0 &&
        filterMunicipality.length === 0
      ) {
        console.log('no filter');
        filteredEvents = prevState.allEvents;
      }
      return (prevState.events = filteredEvents);
    });
  };

  render() {
    const {
      loading,
      pageNumbers,
      pageSelected,
      showModal,
      modalEvent,
      activityOpts,
      municipalityOpts
    } = this.state;
    const startList = (pageSelected - 1) * itemsPerPage;
    const endList = startList + itemsPerPage;
    let events = this.state.events || this.state.allEvents;
    return (
      <div>
        <EventInfoModal
          open={showModal}
          event={modalEvent}
          handleClose={this.closeModal}
        />
        <Header size="huge">
          <Icon name="world" />
          <Header.Content>
            Explorar
          </Header.Content>
          <Header.Subheader>
            Te presentamos las mejores actividades según tus intereses
          </Header.Subheader>
        </Header>
        <Grid columns={3} padded stackable>
          <Grid.Column width={4}>
            <FilterToolkit
              name="Municipios"
              options={municipalityOpts}
              handleChange={this.onFilterChange}
            />
            <br />
            <FilterToolkit
              name="Actividades"
              options={activityOpts}
              handleChange={this.onFilterChange}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <ListItemsWithPagination
              title="Explorar"
              loading={loading}
              pageNumbers={pageNumbers}
              pageSelected={pageSelected}
              onPageUpdate={this.handlePageChange}
              width="16"
            >
              {events && events.length > 0
                ? <Card.Group>
                    {events.slice(startList, endList).map(event => {
                      return (
                        <EventCard
                          key={event._id}
                          event={event}
                          onSeeMore={this.showModal.bind(null, event)}
                        />
                      );
                    })}
                  </Card.Group>
                : <Message
                    color="orange"
                    size="massive"
                    icon="hand victory"
                    header="No eventos para ti"
                    content={`No hemos encontrado eventos dentro de tus intereses`}
                  />}
            </ListItemsWithPagination>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default UserBoardContainer;
