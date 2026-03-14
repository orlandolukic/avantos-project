import styles from "./RightSidePanel.module.scss";
import {Clear, StorageRounded} from "@mui/icons-material";
import {DAGType} from "../../data-types/DAG";
import {useCallback, useEffect, useState} from "react";
import {DAGNode} from "../../data-types/DAGNode";
import {DAGForm} from "../../data-types/DAGForm";

export default function Subfield(props: any) {

    const dag: DAGType = props.dag as DAGType;
    const node: DAGNode = props.node as DAGNode;
    const fieldName: string = props.name;
    const [hasSubstitution, setHasSubstitution] = useState(false);
    const [substitutionNode, setSubstitutionNode] = useState({} as DAGNode);

    useEffect(() => {
        // Check if there are substitutions for this form
        const substituteNode: DAGNode | null =  dag.getSubstitutionFor(fieldName, node);
        if (substituteNode !== null) {
            setHasSubstitution(true);
            setSubstitutionNode(substituteNode);
        }
    }, []);

    const clearSubstitution = useCallback(() => {
        setHasSubstitution(false);
        setSubstitutionNode({} as DAGNode);
        dag.clearSubstitutionFor(fieldName, node);
    }, []);

    return <>
        <div className={`${styles.subfield}${hasSubstitution ? " " + styles.hasSubstitution : ""}`} key={props.key}>
            {hasSubstitution && <>
                <div>{substitutionNode.name}.{fieldName}</div>
                <div className={styles.close} onClick={clearSubstitution}><Clear /></div>
            </>}

            {!hasSubstitution && <>
                <div className={styles.icon}><StorageRounded /></div>
                <div className={styles.text}>{props.name}</div>
            </>}
        </div>
    </>
}