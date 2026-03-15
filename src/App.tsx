import React, {useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import NodeWrapper from "./components/NodeWrapper/NodeWrapper";
import ControlsBar from "./components/ControlsBar/ControlsBar";
import {Portal} from "@mui/material";
import DAGSubstitutionCustomGroups from "./data-types/DAGSubstitutionCustomGroups";

function App() {

    useEffect(() => {
        DAGSubstitutionCustomGroups.fetchDynamicSubstitutionGroups();
    }, [])

  return (
    <div className="App">
      <NodeWrapper />
      <ControlsBar />
    </div>
  );
}

export default App;
