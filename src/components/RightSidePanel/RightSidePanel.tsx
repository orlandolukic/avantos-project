import styles from './RightSidePanel.module.scss';
import {useEffect, useState} from "react";
import {Node} from "@xyflow/react";
import {DAGNode} from "../../data-types/DAGNode";
import {DAGFormFieldSchema} from "../../data-types/DAGForm";
import { SdStorage, StorageRounded } from '@mui/icons-material';
import Subfield from "./Subfield";
import {DAGType} from "../../data-types/DAG";

export default function RightSidePanel(props: any) {

    const node: DAGNode = props.node as DAGNode;
    const dag: DAGType = props.dag as DAGType;
    const [classNames, setClassNames] = useState(styles.rightSidePanel);

    useEffect(() => {
        setTimeout(() => {
            setClassNames((prevValue) => prevValue + " " + styles.visible);
        }, 100);
    }, []);

    const fieldsAsObj: any = node.form?.field_schema.properties as {};
    const fieldsAsArr: any[] = [];
    for (let key in fieldsAsObj) {
        fieldsAsArr.push({
            key: key,
            value: fieldsAsObj[key]
        });
    }

    return <>
        <div style={{zIndex: props.overflowPanel + 1}} className={classNames}>
            <h3>Prefill - {node.name}</h3>
            <span className={styles.subtitle}>Prefill fields for this form</span>

            <div className={styles.subfields}>
                {fieldsAsArr.map((field: any, index: number) =>
                    <Subfield key={field.key} node={node} name={field.key} dag={dag} />
                )}
            </div>
        </div>
    </>;
}