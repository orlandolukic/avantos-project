import './NodeWrapper.module.scss'
import '@xyflow/react/dist/style.css';
import {addEdge, applyEdgeChanges, applyNodeChanges, Edge, Node, ReactFlow} from "@xyflow/react";
import React, {useCallback, useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";
import {FormBlueprints} from "../../data-types/FormBlueprints";
import DAG from "../../data-types/DAG";
import {DAGConnection} from "../../data-types/DAGConnection";
import {DAGNode} from "../../data-types/DAGNode";
import {NodeMouseHandler} from "@xyflow/react/dist/esm/types";
import {createPortal} from "react-dom";
import OverflowPanel from "../OverflowPanel/OverflowPanel";
import RightSidePanel from "../RightSidePanel/RightSidePanel";
import {DAGForm} from "../../data-types/DAGForm";
import DAGSubstitution from "../../data-types/DAGSubstitution";
import DAGSubstitutionCustom from "../../data-types/DAGSubstitutionCustom";
import DAGSubstitutionCustomGroup from "../../data-types/DAGSubstitutionCustomGroup";
import DAGSubstitutionCustomGroups from "../../data-types/DAGSubstitutionCustomGroups";

export default function NodeWrapper() {

    const [dag, setDag] = useState( DAG() );
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [overflowPanel, setOverflowPanel] = useState(-1);
    const [selectedNode, setSelectedNode] = useState({} as Node);

    const processBlueprints = useCallback((data: FormBlueprints) => {
        const nodes = data.nodes;
        const edges: DAGConnection[] = data.edges;
        const forms = data.forms;

        const nodesForGui: any[] = [];
        const edgesForGui: any[] = [];
        const filteredNodes: DAGNode[] = [];
        const filteredForms: DAGForm[] = [];
        for (let i=0; i<nodes.length; i++) {
            filteredNodes.push({
                id: nodes[i].id,
                name: nodes[i].data.name,
                position: {
                    x: nodes[i].position.x,
                    y: nodes[i].position.y
                },
                component_id: nodes[i].data.component_id,
                form: null,                                          // it will be resolved later,
                substitutions: {} as Record<string, DAGSubstitution>
            });

            nodesForGui.push({
                id: nodes[i].id,
                position: {
                    x: nodes[i].position.x,
                    y: nodes[i].position.y
                },
                draggable: false,
                connectable: false,
                data: {
                    label: nodes[i].data.name,
                    id: nodes[i].id
                }
            });
        }
        for (let i=0; i<data.edges.length; i++) {
            edgesForGui.push({
                source: data.edges[i].source,
                target: data.edges[i].target,
                id: data.edges[i].source + "-" + data.edges[i].target
            });
        }
        for (let i=0; i<data.forms.length; i++) {
            filteredForms.push({
                id: data.forms[i].id,
                name: data.forms[i].name,
                description: data.forms[i].description,
                field_schema: data.forms[i].field_schema
            });
        }
        dag.initialize(filteredNodes, edges, filteredForms);
        // @ts-ignore
        setNodes(nodesForGui);
        // @ts-ignore
        setEdges(edgesForGui);

        // Print all nodes
        dag.printNodes();

        // Let's test!
        dag.print();

        const actionPropertiesGroup: DAGSubstitutionCustomGroup =
            DAGSubstitutionCustomGroups.getInstance().getGroupById("action-properties");

        const nodeB: DAGNode | null = dag.getNode("form-a4750667-d774-40fb-9b0a-44f8539ff6c4");               // B
        const substituteNode: DAGNode | null = dag.getNode("form-0f58384c-4966-4ce6-9ec2-40b96d61f745");      // D
        const node: DAGNode | null =  dag.getNode("form-bad163fd-09bd-4710-ad80-245f31b797d5");               // F
        const nodeA: DAGNode | null = dag.getNode("form-47c61d17-62b0-4c42-8ca2-0eff641c9d88");               // A

        const substitution1 = new DAGSubstitution("email", "email");
        substitution1.setSubstitution(substituteNode);
        const substitution2: DAGSubstitution = new DAGSubstitution("dynamic_object", "dynamic_object");
        substitution2.setSubstitution(nodeB);
        const substitution3: DAGSubstitution = new DAGSubstitution("id", "id");
        substitution3.setSubstitution(nodeA);
        const substitution4: DAGSubstitution = new DAGSubstitution("multi_select", "multi_select");
        const customSubstitution: DAGSubstitutionCustom = new DAGSubstitutionCustom(actionPropertiesGroup, 1);
        substitution4.setSubstitution(customSubstitution);

        // Substitute field email for node 'node F' with form from node D
        dag.setSubstitutionFor("email", node, substitution1);
        dag.setSubstitutionFor("dynamic_object", node, substitution2);
        dag.setSubstitutionFor("id", nodeB, substitution3);
        dag.setSubstitutionFor("multi_select", nodeB, substitution4);

        // Now, let's test our function for node F
        const arr = dag.availableFormsFor("form-bad163fd-09bd-4710-ad80-245f31b797d5");
        console.log(arr);

    }, []);

    useEffect((): void => {
        // Now we fetch API route from
        //      http://localhost:3000/api/v1/1/actions/blueprints/bpv_test/graph
        // and then process all nodes
        axios({
            method: "GET",
            url: "http://localhost:3000/api/v1/1/actions/blueprints/bpv_test/graph",
            responseType: "json"
        })
            .then(function (response: AxiosResponse<any, any>) {
                processBlueprints(response.data);
            });
    }, []);


    const clickHandler = useCallback((event: any, node: Node) => {
        // @ts-ignore
        setOverflowPanel(10);
        // @ts-ignore
        setSelectedNode(dag.getNode(node.id));
    }, [nodes]);


    return <>
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                zoomOnPinch={false}
                zoomOnScroll={false}
                nodes={nodes}
                edges={edges}
                fitView
                onNodeClick={clickHandler}
            />
            {overflowPanel > -1 && <>
                {createPortal(
                    <OverflowPanel overflowPanel={overflowPanel} setOverflowPanel={setOverflowPanel} />,
                    document.getElementById("portal-container") as HTMLElement
                )}
                {createPortal(
                    <RightSidePanel overflowPanel={overflowPanel} node={selectedNode} dag={dag} />,
                    document.getElementById("portal-container") as HTMLElement,
                    selectedNode !== null ? selectedNode.id : "key0"
                )}
            </>}
        </div>
    </>;
}