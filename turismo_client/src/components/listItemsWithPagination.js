import React from 'react';
import { Grid, Segment, Header, Dimmer, Loader, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ListItemsWithPagination = ({
  loading,
  children,
  title,
  pageNumbers,
  pageSelected,
  onPageUpdate,
  ...rest
}) => {
  return (
    <Grid centered>
      <Grid.Column width={rest.width || '14'}>
        <Segment.Group>
          <Header
            textAlign="center"
            size="huge"
            color={rest.titleColor || 'blue'}
            attached="top"
          >
            {title}
          </Header>
          <Segment padded="very" attached>
            <Dimmer active={loading}>
              <Loader>Un momento por favor</Loader>
            </Dimmer>
            {children}
          </Segment>
          {pageNumbers.length > 0 &&
            <Segment textAlign="center">
              {pageNumbers &&
                <Menu pagination color="teal">
                  {pageNumbers.map(page => {
                    return (
                      <Menu.Item
                        name={page.toString()}
                        key={page}
                        active={pageSelected === page}
                        onClick={onPageUpdate.bind(null, page)}
                      />
                    );
                  })}
                </Menu>}
            </Segment>}

        </Segment.Group>
      </Grid.Column>
    </Grid>
  );
};

ListItemsWithPagination.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  pageNumbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  pageSelected: PropTypes.number.isRequired,
  onPageUpdate: PropTypes.func.isRequired
};

ListItemsWithPagination.defaultProps = {
  loading: false
};

export default ListItemsWithPagination;
