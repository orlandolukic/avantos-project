import styles from "./Modal.module.scss";
import {Ref, useCallback, useRef} from "react";

export default function Search(props: any) {

    const onKeyUp = useCallback(() => {
        props.setSearchCriteria((document.getElementById("search-input") as HTMLInputElement).value);
    }, []);

    return <>
        <div className={styles.search}>
            <div className={styles.title}>Available data</div>
            <div className={styles.input}>
                <input id={"search-input"} type={"text"} placeholder={"Search"} onKeyUp={onKeyUp} />
            </div>
        </div>
    </>;
}