import { Component, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';
import Business from './pages/Business';
import Tests from './pages/Tests';


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
       <BrowserRouter>
         
          <Routes>
            <Route index element={<Home/>} />
            <Route path="/Home" element={<Home/>} />
            <Route path="/Business" element={<Business/>} />
            <Route path="/Tests" element={<Tests/>}/>
            <Route path="*" element={<Home/>}/>
          </Routes>
        </BrowserRouter>
      </>
       
     )
  }

}

export default App
