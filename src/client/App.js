import React, { Component } from 'react';

import Default from './components/Default';
import MainLayout from './layouts/MainLayout';

export default class App extends Component {

  render() {
    return (
      <MainLayout>
        <Default />
      </MainLayout>
    );
  }
}
