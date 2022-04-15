import { useEffect } from "react";
import styles from "../styles/15puzzle.module.css";
export default function Cell({ number }) {
    var [show, style] =
        number == 0 ? ["", styles.hole] : [number, styles.piece];

    useEffect(() => {
        console.log(show);
    }, [number]);
    return <div className={style}>{show}</div>;
}
