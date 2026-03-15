import styles from "./RightSidePanel.module.scss";
import {Clear, StorageRounded} from "@mui/icons-material";
import {DAGType} from "../../data-types/DAG";
import {useCallback, useEffect, useState} from "react";
import {DAGNode} from "../../data-types/DAGNode";
import {DAGForm} from "../../data-types/DAGForm";
import DAGSubstitution from "../../data-types/DAGSubstitution";
import OverflowPanel from "../OverflowPanel/OverflowPanel";
import {createPortal} from "react-dom";
import Modal from "../Modal/Modal";

export default function Subfield(props: any) {

    const dag: DAGType = props.dag as DAGType;
    const node: DAGNode = props.node as DAGNode;
    const fieldName: string = props.name;
    const [hasSubstitution, setHasSubstitution] = useState(false);
    const [substitution, setSubstitution] = useState({} as DAGSubstitution);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Check if there are substitutions for this form
        const substitution: DAGSubstitution | null =  dag.getSubstitutionFor(fieldName, node);
        if (substitution !== null) {
            setHasSubstitution(true);
            setSubstitution(substitution);
        }
    }, []);

    const clearSubstitution = useCallback(() => {
        setHasSubstitution(false);
        setSubstitution({} as DAGSubstitution);
        dag.clearSubstitutionFor(fieldName, node);
    }, []);

    const openModal = useCallback(() => {
        if (hasSubstitution) {
            return;
        }
        setShowModal(true);
    }, [hasSubstitution]);

    const closeOverflowPanel = useCallback((index: number) => {
        setShowModal(false);
    }, []);

    const updateSubstitution = useCallback((substitution: DAGSubstitution) => {
        setHasSubstitution(true);
        setSubstitution(substitution);
    }, []);

    return <>
        <div className={`${styles.subfield}${hasSubstitution ? " " + styles.hasSubstitution : ""}`} key={props.key} onClick={openModal}>
            {hasSubstitution && <>
                <div>{substitution.getDisplayText()}</div>
                <div className={styles.close} onClick={clearSubstitution}><Clear /></div>
            </>}

            {!hasSubstitution && <>
                <div className={styles.icon}><StorageRounded /></div>
                <div className={styles.text}>{props.name}</div>
            </>}
        </div>
        {showModal && <>
            {createPortal(<OverflowPanel overflowPanel={12} setOverflowPanel={closeOverflowPanel} />, document.getElementById("portal-container") as HTMLElement)}
            {createPortal(<Modal
                updateSubstitution={updateSubstitution}
                zIndex={13}
                closeModal={closeOverflowPanel}
                dag={dag}
                node={node}
                fieldName={fieldName}
            />, document.getElementById("portal-container") as HTMLElement)}
        </>}
    </>
}