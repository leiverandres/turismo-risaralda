import React, { Component } from 'react';
import { Button, Card, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import requests from '../../utils/requests';

class RequestCard extends Component {
  constructor(props) {
    super(props);
    const { user } = props;

    this.state = {
      user: user,
      channelsToAccept: new Set()
    };
  }

  onChange = (ev, { value, checked }) => {
    if (checked) {
      this.setState(prevState => {
        prevState.channelsToAccept.add(value);
        return prevState;
      });
    } else {
      this.setState(prevState => {
        prevState.channelsToAccept.delete(value);
        return prevState;
      });
    }
  };

  handleApplyPermissions = () => {
    const { channelsToAccept, user } = this.state;

    const acceptedChannels = [];
    for (let channelId of channelsToAccept.values()) {
      acceptedChannels.push(channelId);
    }

    const body = { acceptedChannels };
    requests
      .applyPermissions(user._id, body)
      .then(res => {
        this.props.onApplyPermision();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { user } = this.state;
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            {`${user.firstName} ${user.lastName}`}
          </Card.Header>
          <Card.Meta>
            {user.email}
          </Card.Meta>
          <Card.Description>
            <p>Quiere administrar:</p>
            {user.adminPermission.pendingChannels.map(channel => {
              return (
                <Checkbox
                  key={channel._id}
                  label={`${channel.municipality}-${channel.activity}`}
                  value={channel._id}
                  onChange={this.onChange}
                />
              );
            })}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button basic color="green" onClick={this.handleApplyPermissions}>
            Aplicar
          </Button>
        </Card.Content>
      </Card>
    );
  }
}

RequestCard.propTypes = {
  user: PropTypes.object.isRequired,
  onApplyPermision: PropTypes.func.isRequired
};

export default RequestCard;
