import { useEffect } from "react";
import styles from "../styles/15puzzle.module.css";
export default function Cell({ number, frog }) {
    var [show, style] =
        number == 0 ? ["", styles.hole] : [number, styles.piece];
    if (number == frog + 1) {
        style = styles.correct;
    }
    useEffect(() => {
        //console.log(show);
    }, [number]);
    return <div className={style}>{show}</div>;
}
