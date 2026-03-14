import styles from './ControlsBar.module.scss';
import {Button} from "@mui/material";
import React from "react";
import RotateLeft from '@mui/icons-material/RotateLeft';

export default function ControlsBar() {
    return <>
        <div className={styles.controlsContainer}>

            <div className={styles.control + " " + styles.revertIcon + " " + (true ? styles.disabled : "")}>
                <RotateLeft />
            </div>

            <div className={styles.control}>
                <Button disabled={true} color={"success"} variant={'contained'} className={styles.button}>
                    <span className={'strong'}>SAVE</span>
                </Button>
            </div>

            <div className={styles.control}>
                <Button variant={'outlined'} className={styles.button}>
                    <span className={'strong'}>REFRESH</span>
                </Button>
            </div>
        </div>
    </>;
}