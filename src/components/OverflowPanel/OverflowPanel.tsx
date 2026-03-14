import styles from './OverflowPanel.module.scss';
import {useCallback, useEffect, useRef, useState} from "react";

export default function  OverflowPanel(props: any) {

    const onClick = useCallback(() => {
        props.setOverflowPanel(-1);
    }, []);

    const [zIndex, setZIndex] = useState(props.overflowPanel);
    const [classNames, setClassNames] = useState(styles.overflowPanel);
    useEffect(() => {
        setTimeout(() => {
            setClassNames((prevValue) =>  prevValue + " " + styles.visible);
        }, 20);
    }, []);

    if (props.overflowPanel === -1) {
        return null;
    }

    return <>
        <div style={{zIndex: zIndex}} className={classNames} onClick={onClick}></div>
    </>
}