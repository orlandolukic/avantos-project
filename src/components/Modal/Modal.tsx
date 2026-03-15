import styles from './Modal.module.scss';
import {useCallback, useEffect, useState} from "react";
import {Button} from "@mui/material";
import Search from './Search';
import AvailableData from './AvailableData';
import {DAGType} from "../../data-types/DAG";
import {DAGNode} from "../../data-types/DAGNode";
import DAGSubstitutionCustom from "../../data-types/DAGSubstitutionCustom";
import DAGSubstitution from "../../data-types/DAGSubstitution";

export default function Modal(props: any) {

    const dag: DAGType = props.dag as DAGType;
    const node: DAGNode = props.node as DAGNode;
    const fieldName: string = props.fieldName;
    const zIndex: number = props.zIndex !== undefined ? props.zIndex : 0;
    const [preview, setPreview] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedSource, setSelectedSource] = useState({} as DAGSubstitutionCustom | DAGNode);
    const [searchCritera, setSearchCriteria] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setPreview(true);
        }, 200);
    }, []);

    const closeModal = useCallback(() => {
        props.closeModal();
    }, []);

    const selectedOptionCallback = useCallback((option: string, isCustom: boolean, customSource: DAGSubstitutionCustom, nodeSource: DAGNode) => {
        const source: DAGSubstitutionCustom | DAGNode = isCustom ? customSource : nodeSource;
        setSelectedOption(option);
        setSelectedSource(source);
    }, []);

    const select = useCallback(() => {
        // Create substitution for the current node
        const substitution: DAGSubstitution = new DAGSubstitution(fieldName, selectedOption);
        substitution.setSubstitution(selectedSource);
        dag.setSubstitutionFor(fieldName, node, substitution);
        props.updateSubstitution(substitution);
        props.closeModal();
    }, [selectedSource, selectedOption]);

    return <>
        <div style={{zIndex: zIndex}} className={`${styles.modalContainer}${preview ? " " + styles.show : ""}`}>
            <div className={styles.header}>
                <span className={styles.title}>Select data element to map</span>
            </div>
            <div className={styles.body}>
                <div className={styles.firstColumn}>
                    <Search setSearchCriteria={setSearchCriteria} />
                    <AvailableData searchCriteria={searchCritera}
                                   dag={dag}
                                   node={node}
                                   selectedOption={selectedOption}
                                   selectedOptionCallback={selectedOptionCallback} />
                </div>
            </div>
            <div className={styles.footer}>
                <div className={styles.controls}>
                    <Button variant={"outlined"} onClick={closeModal}>Cancel</Button>
                    <Button disabled={selectedOption === ""} variant={"contained"} onClick={select}>Select</Button>
                </div>
            </div>
        </div>
    </>;
}