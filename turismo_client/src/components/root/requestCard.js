import React from 'react';
import { Button, Card } from 'semantic-ui-react';

const RequestCard = props => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {`${props.firstName} ${props.lastName}`}
        </Card.Header>
        <Card.Meta>
          {props.email}
        </Card.Meta>
        <Card.Description>
          Want to admin
          {props.adminPermission.pendingChannels.map(channel => {
            return (
              <p key={`${channel.municipality}-${channel.activity}`}>
                {channel}{' '}
              </p>
            );
          })}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button basic color="green">
          Aplicar
        </Button>
      </Card.Content>
    </Card>
  );
};

export default RequestCard;
