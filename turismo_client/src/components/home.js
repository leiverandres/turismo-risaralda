import React from 'react';
import {Header, Image} from 'semantic-ui-react';

const Home = () => {
  return (
    <div>
      <Header size="huge" textAlign="center">
        {' '}Bienvenido al eje cafetero
      </Header>
      <Image src="/ejecafetero.jpg" size="large" centered id="home-img" />
      <p>Here would be the home description... which is under construction</p>
    </div>
  );
};

export default Home;
