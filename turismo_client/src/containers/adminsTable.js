import React, { Component } from 'react';
import { Message, List, Card } from 'semantic-ui-react';

import ListItemsWithPagination from '../components/listItemsWithPagination';
import requests from '../utils/requests';

const itemsPerPage = 16;

const AdminCard = ({ admin }) => {
  return (
    <Card centered raised color="green">
      <Card.Content>
        <Card.Header>
          {admin.username}
        </Card.Header>
        <Card.Meta>
          <p>{`${admin.firstName} ${admin.lastName}`}</p>
          <p>{admin.email}</p>
        </Card.Meta>
        <Card.Description>
          {admin.adminPermission.acceptedChannels &&
            <List
              items={admin.adminPermission.acceptedChannels.map(ch => {
                return `${ch.municipality} - ${ch.activity}`;
              })}
            />}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};

class AdminsTable extends Component {
  state = {
    loading: false,
    message: {},
    admins: [],
    pageNumbers: [],
    pageSelected: 1
  };

  componentDidMount() {
    this.fetchAdmins();
  }

  fetchAdmins = () => {
    this.setState({ loading: true });
    requests
      .getAllAdmins()
      .then(res => {
        const admins = res.data;
        const pages = Math.ceil(admins.length / itemsPerPage);
        const pageNumbers = [];
        for (let i = 1; i <= pages; i++) {
          pageNumbers.push(i);
        }

        this.setState({
          loading: false,
          admins: admins,
          pageNumbers: pageNumbers
        });
      })
      .catch(err => {
        this.setState({ loading: false });
        this.addMessage({
          state: 'error',
          header: 'Algo salio mal',
          content: 'Error obteniendo usuarios'
        });
      });
  };

  addMessage = (messageBody, time = 10000) => {
    this.setState({ message: messageBody });

    setTimeout(() => {
      this.setState({ message: {} });
    }, time);
  };

  handlePageChange = page => {
    this.setState({ pageSelected: page });
  };

  render() {
    const { loading, message, pageNumbers, pageSelected, admins } = this.state;

    const startList = (pageSelected - 1) * itemsPerPage;
    const endList = startList + itemsPerPage;
    return (
      <div>
        <Message
          hidden={!message.state}
          success={message.state === 'success'}
          error={message.state === 'error'}
          header={message.header}
          content={message.content}
        />
        <ListItemsWithPagination
          title="Administradores activos"
          loading={loading}
          pageNumbers={pageNumbers}
          pageSelected={pageSelected}
          onPageUpdate={this.handlePageChange}
        >
          {admins &&
            <Card.Group itemsPerRow={4}>
              {admins.slice(startList, endList).map(admin => {
                return <AdminCard key={admin._id} admin={admin} />;
              })}
            </Card.Group>}

        </ListItemsWithPagination>
      </div>
    );
  }
}

export default AdminsTable;
