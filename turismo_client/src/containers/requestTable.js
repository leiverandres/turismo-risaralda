import React, { Component } from 'react';
import { Card, Message } from 'semantic-ui-react';

import requests from '../utils/requests';
import ListItemsWithPagination from '../components/listItemsWithPagination';
import RequestCard from '../components/root/requestCard';

const itemsPerPage = 16;

class RequestTable extends Component {
  state = {
    loading: false,
    message: {},
    pageNumbers: [],
    pageSelected: 1,
    pendingUsers: []
  };

  componentDidMount() {
    this.fetchPendings();
  }

  fetchPendings = () => {
    this.setState({ loading: true });
    requests
      .getPendingUsers()
      .then(res => {
        const pendingUsers = res.data;
        const pages = Math.ceil(pendingUsers.length / itemsPerPage);
        const pageNumbers = [];
        for (let i = 1; i <= pages; i++) {
          pageNumbers.push(i);
        }
        this.setState({ loading: false, pendingUsers, pageNumbers });
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
    const {
      loading,
      message,
      pageNumbers,
      pageSelected,
      pendingUsers
    } = this.state;

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
          title="Solicitudes para ser administrador"
          loading={loading}
          pageNumbers={pageNumbers}
          pageSelected={pageSelected}
          onPageUpdate={this.handlePageChange}
        >
          {pendingUsers && pendingUsers.length > 0
            ? <Card.Group>
                {this.state.pendingUsers.slice(startList, endList).map(user => {
                  return (
                    <RequestCard
                      key={user._id}
                      user={user}
                      onApplyPermision={this.fetchPendings}
                    />
                  );
                })}
              </Card.Group>
            : <Message
                color="orange"
                size="massive"
                icon="hand victory"
                header="No hay Solicitudes"
                content={`Al parecer no tienes solicitudes nuevas.
                        Esta parece la oportunidad perfecta para tomarte unas vacaciones`}
              />}
        </ListItemsWithPagination>
      </div>
    );
  }
}

export default RequestTable;
