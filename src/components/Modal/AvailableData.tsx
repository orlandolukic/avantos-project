import {ChevronRight, SearchRounded } from '@mui/icons-material';
import styles from './Modal.module.scss';
import DataSource from "./DataSource";
import {DAGType} from "../../data-types/DAG";
import {DAGNode} from "../../data-types/DAGNode";
import {useEffect, useState} from "react";
import DAGSubstitutionCustomGroup from "../../data-types/DAGSubstitutionCustomGroup";
import DAGSubstitution from "../../data-types/DAGSubstitution";
import DAGSubstitutionCustomGroups from "../../data-types/DAGSubstitutionCustomGroups";

export default function AvailableData(props: any) {

    const dag: DAGType = props.dag as DAGType;
    const nodeModal: DAGNode = props.node as DAGNode;
    const searchCriteria: string = props.searchCriteria;
    const [groups, setGroups] = useState([] as DAGSubstitutionCustomGroup[]);
    const [nodes, setNodes] = useState([] as DAGNode[]);

    useEffect(() => {
        setGroups(DAGSubstitutionCustomGroups.getInstance().getAllGroups());

        const nodes: DAGNode[] = dag.availableFormsFor(nodeModal.id);
        setNodes(nodes);
    }, []);

    return <>
        <div className={styles.dataContainer}>
            {groups.map((group: DAGSubstitutionCustomGroup) => <>
                <DataSource searchCriteria={props.searchCriteria}
                            nodeModal={nodeModal}
                            source={group}
                            selectedOption={props.selectedOption}
                            selectedOptionCallback={props.selectedOptionCallback} />
            </>)}
            {nodes.map((node: DAGNode) => <>
                <DataSource searchCriteria={props.searchCriteria}
                            nodeModal={nodeModal}
                            source={node}
                            selectedOption={props.selectedOption}
                            selectedOptionCallback={props.selectedOptionCallback} />
            </>)}
        </div>
    </>;
}