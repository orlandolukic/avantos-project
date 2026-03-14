import React, {useCallback, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import NodeWrapper from "./components/NodeWrapper/NodeWrapper";
import ControlsBar from "./components/ControlsBar/ControlsBar";
import {Portal} from "@mui/material";

function App() {

  return (
    <div className="App">
      <NodeWrapper />
      <ControlsBar />
    </div>
  );
}

export default App;
