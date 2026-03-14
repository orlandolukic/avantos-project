import {useState} from "react";


export default function useOverflowPanel() {

    const [shown, setShown]= useState(false);
    const [zIndex, setZIndex]= useState(0);

    return {
        shown: shown,
        setZIndex: (zIndex: number) => { setZIndex(zIndex); }
    };

}