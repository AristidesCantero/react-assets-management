import { Component, useState } from 'react'
import './App.css'
import { BrowserRouter, isRouteErrorResponse, Route, Routes } from 'react-router';
import Home from './pages/Home.js';
import BusinessWindow from './pages/BusinessWindow.js';
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
      {/* <Routes>
        <Route index element={<Home/>}/>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/Business' element={<BusinessWindow/>}/>

      </Routes> */}
       {/* <BrowserRouter>
         
          <Routes>
            <Route index element={<Home/>} />
            <Route path="/Home" element={<Home/>} />
            <Route path="/Business" element={<BusinessWindow/>} />
            <Route path="/Tests" element={<Tests/>}/>
            <Route path="*" element={<Home/>}/>
          </Routes>
        </BrowserRouter> */}
      </>
       
     )
  }

}

export default App
