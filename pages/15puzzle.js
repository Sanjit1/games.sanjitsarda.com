import Head from "next/head";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import styles from "../components/styles/15puzzle.module.css";
import Cell from "../components/15puzzle/cell";

export default function Puzzle() {
    var [matrix, setMatrix] = useState([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0],
    ]);
    var board = useRef();
    var canMove = true;

    function io2(arr, val) {
        for (var k = 0; k < arr.length; k++) {
            for (var l = 0; l < arr[k].length; l++) {
                if (arr[k][l] == val) {
                    return [k, l];
                }
            }
        }
        return false;
    }
    function updateMatrix(dir) {
        // Figure new matrix
        var blankspot = io2(matrix, 0);
        if (dir == "d") {
            if (blankspot[0] != 0) {
                [
                    matrix[blankspot[0]][blankspot[1]],
                    matrix[blankspot[0] - 1][blankspot[1]],
                ] = [
                    matrix[blankspot[0] - 1][blankspot[1]],
                    matrix[blankspot[0]][blankspot[1]],
                ];
            }
        }
        if (dir == "u") {
            if (blankspot[0] != 3) {
                [
                    matrix[blankspot[0]][blankspot[1]],
                    matrix[blankspot[0] + 1][blankspot[1]],
                ] = [
                    matrix[blankspot[0] + 1][blankspot[1]],
                    matrix[blankspot[0]][blankspot[1]],
                ];
            }
        }
        if (dir == "r") {
            if (blankspot[1] != 0) {
                [
                    matrix[blankspot[0]][blankspot[1]],
                    matrix[blankspot[0]][blankspot[1] - 1],
                ] = [
                    matrix[blankspot[0]][blankspot[1] - 1],
                    matrix[blankspot[0]][blankspot[1]],
                ];
            }
        }
        if (dir == "l") {
            if (blankspot[1] != 3) {
                [
                    matrix[blankspot[0]][blankspot[1]],
                    matrix[blankspot[0]][blankspot[1] + 1],
                ] = [
                    matrix[blankspot[0]][blankspot[1] + 1],
                    matrix[blankspot[0]][blankspot[1]],
                ];
            }
        }
        setMatrix([...matrix]);
        console.log(matrix);

        // Update all pieces
        var order = [].concat
            .apply([], matrix)
            .map((z) =>
                eval(z).current == undefined ? eval(z) : eval(z).current
            );
        for (var z = 0; z < 16; z++) {
            if (order[z] != board.current.children[z]) {
                // fix things
                //board.current.replaceChild(board.current.children[z], order[z]);
            }
        }
    }
    useEffect(() => {
        const handleEsc = (event) => {
            if (canMove) {
                if (event.key == "w" || event.key == "ArrowUp") {
                    updateMatrix("u");
                } else if (event.key == "a" || event.key == "ArrowLeft") {
                    updateMatrix("l");
                } else if (event.key == "s" || event.key == "ArrowDown") {
                    updateMatrix("d");
                } else if (event.key == "d" || event.key == "ArrowRight") {
                    updateMatrix("r");
                }
                canMove = false;
                setTimeout(() => {
                    canMove = true;
                }, 10);
            }
        };
        window.addEventListener("keypress", handleEsc);
        return () => window.removeEventListener("keypress", handleEsc);
    });

    return (
        <div>
            <Head>
                <title>15 Puzzle</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <center>
                <h1>15 Puzzle</h1>
                <div className={styles.space}>
                    <div className={styles.variants}>
                        <div className={styles.normal}>stock</div>
                        <div className={styles.blind}>blind</div>
                        <div className={styles.memory}>memory</div>
                        <div className={styles.size}>size</div>
                        <div className={styles.pic}>picture</div>
                    </div>
                    <br />
                    <div className={styles.gamespace}>
                        <div className={styles.history}>
                            <h4 className={styles.heading}>History</h4>
                            <div className={styles.logs}></div>
                        </div>
                        <div className={styles.realgame}>
                            <div className={styles.menu}>
                                <button className={styles.restart}>R+</button>
                                <div className={styles.best}>Best Solution</div>
                                <div className={styles.stats}>
                                    <div className={styles.time}>T</div>
                                    <div className={styles.moves}>M</div>
                                    <div className={styles.speed}>S</div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.game} ref={board}>
                                    {[].concat.apply([], matrix).map((n) => (
                                        <Cell number={n} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.moves}>
                            <h4 className={styles.heading}>Moves</h4>
                            <div className={styles.movelog}></div>
                        </div>
                    </div>
                </div>
            </center>
        </div>
    );
}
