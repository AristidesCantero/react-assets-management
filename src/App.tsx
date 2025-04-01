import { Component, useState } from 'react'
import './App.css'
import { BrowserRouter, isRouteErrorResponse, Route, Routes } from 'react-router';
import Home from './pages/Home.js';
import BusinessWindow from './pages/TableWindows/BusinessWindow.js';
import Tests from './pages/Tests.js';

import { Outlet } from 'react-router';


class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      elements:[],
    }
  }

  render() {
    return (
      <>   
      </>
       
     )
  }

}

export default App
