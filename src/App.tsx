import React, {useCallback, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import '@xyflow/react/dist/style.css';
import {addEdge, applyEdgeChanges, applyNodeChanges, ReactFlow} from "@xyflow/react";

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

function App() {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
      (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
      [],
  );
  const onEdgesChange = useCallback(
      (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
      [],
  );
  const onConnect = useCallback(
      (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
      [],
  );

  return (
    <div className="App">
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        />
      </div>
    </div>
  );
}

export default App;
