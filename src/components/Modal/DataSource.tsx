import styles from "./Modal.module.scss";
import {ChevronRight} from "@mui/icons-material";
import {useCallback, useEffect, useState} from "react";
import DAGSubstitutionCustomGroup from "../../data-types/DAGSubstitutionCustomGroup";
import {DAGNode} from "../../data-types/DAGNode";
import {DAGFormField, DAGFormFieldSchema} from "../../data-types/DAGForm";
import DAGSubstitutionCustom from "../../data-types/DAGSubstitutionCustom";


export default function DataSource(props: any) {

    const [toggled, setToggled] = useState(false);
    const [initialSubOptions, setInitialSubOptions] = useState([] as string[]);
    const [subOptions, setSubOptions] = useState([] as string[]);
    const isCustom: boolean = props.source instanceof DAGSubstitutionCustomGroup;
    const group: DAGSubstitutionCustomGroup = props.source as DAGSubstitutionCustomGroup;
    const nodeSource: DAGNode = props.source as DAGNode;
    const searchCriteria: string = props.searchCriteria;

    useEffect(() => {
        let arr: string[];
        if (isCustom) {
            arr = group.getValues();
        } else {
            arr = [];
            const fields:Record<string, DAGFormField> | undefined = nodeSource.form?.field_schema.properties;
            for(let key in fields) {
                arr.push(key);
            }
        }
        setSubOptions(arr);
        setInitialSubOptions(arr);
    }, []);

    useEffect(() => {
        if (searchCriteria === "") {
            setSubOptions(initialSubOptions);
            return;
        }
        const newSubOptions: string[] = initialSubOptions.filter((value) => value.indexOf(searchCriteria) > -1);
        setSubOptions(newSubOptions);
    }, [searchCriteria, initialSubOptions]);

    const selectOption = useCallback((option: string) => {
        let custom: DAGSubstitutionCustom = {} as DAGSubstitutionCustom;
        if (isCustom) {
            custom = new DAGSubstitutionCustom(group, 0);
            custom.selectValue(option);
        }
        props.selectedOptionCallback(option, isCustom, custom, nodeSource);
    }, [isCustom, group, nodeSource]);

    const toggleState = useCallback(() => {
        setToggled((prevValue) => !prevValue);
    }, []);

    return <>
        <div className={styles.dataSource}>
            <div className={styles.heading} onClick={toggleState}>
                <div className={`${styles.icon}${toggled ? " " + styles.toggled : ""}`}>
                    <ChevronRight />
                </div>
                <div className={styles.text}>
                    {isCustom ? group.getGroupName() : nodeSource.name}
                </div>
            </div>
            <div className={`${styles.suboptions}${toggled ? " " + styles.visible : " "}`}>
                {subOptions.map((option) => <>
                    <div className={`${styles.option}${option === props.selectedOption ? "  " + styles.selected : ""}`}
                         onClick={(e) => {selectOption(option)}}>{option}</div>
                </>)}
            </div>
        </div>
    </>;
}