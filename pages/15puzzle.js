import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import styles from "../components/styles/15puzzle.module.css";
import Popup from "../components/Popup";
import Cell from "../components/15puzzle/cell";

export default function Puzzle() {
    var [matrix, setMatrix] = useState([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0],
    ]);
    const solvedMatrix = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 0],
    ];
    var winPop = useRef();
    var board = useRef();
    var canMove = true;
    var [
        [time, setTime],
        [timerActive, setTimerActive],
        [moves, setMoves],
        [speed, setSpeed],
    ] = [useState(0), useState(false), useState(0), useState(0)];

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

    function equal(array1, array2) {
        if (!Array.isArray(array1) && !Array.isArray(array2)) {
            return array1 === array2;
        }

        if (array1.length !== array2.length) {
            return false;
        }

        for (var i = 0, len = array1.length; i < len; i++) {
            if (!equal(array1[i], array2[i])) {
                return false;
            }
        }

        return true;
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
            } else {
                return false;
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
            } else {
                return false;
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
            } else {
                return false;
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
            } else {
                return false;
            }
        }
        setMatrix([...matrix]);

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
        return true;
    }
    useEffect(() => {
        const handleEsc = (event) => {
            var legalMove = true;
            if (canMove) {
                if (event.key == "w" || event.key == "ArrowUp") {
                    legalMove = updateMatrix("u");
                } else if (event.key == "a" || event.key == "ArrowLeft") {
                    legalMove = updateMatrix("l");
                } else if (event.key == "s" || event.key == "ArrowDown") {
                    legalMove = updateMatrix("d");
                } else if (event.key == "d" || event.key == "ArrowRight") {
                    legalMove = updateMatrix("r");
                } else {
                    legalMove = false;
                }

                if (legalMove) {
                    setMoves(moves + 1);
                    setSpeed((moves / time).toFixed(1));
                    if (!timerActive) {
                        setTimerActive(true);
                    }

                    if (equal(matrix, solvedMatrix)) {
                        setTimerActive(false);
                        console.log(winPop.current.open());
                    }
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

    function shuffle(e) {
        for (let i = 1; i < 300; i++) {
            setTimeout(function timer() {
                updateMatrix(
                    ["u", "d", "l", "r"][Math.floor(Math.random() * 4)]
                );
                updateMatrix(
                    ["u", "d", "l", "r"][Math.floor(Math.random() * 4)]
                );
                updateMatrix(
                    ["u", "d", "l", "r"][Math.floor(Math.random() * 4)]
                );
                updateMatrix(
                    ["u", "d", "l", "r"][Math.floor(Math.random() * 4)]
                );
                updateMatrix(
                    ["u", "d", "l", "r"][Math.floor(Math.random() * 4)]
                );
            }, i * 1);
        }
    }

    function newgame() {
        shuffle();
        setTime(0);
        setTimerActive(false);
        setMoves(0);
        setSpeed(0);
    }
    useEffect(newgame, [board]);

    useEffect(() => {
        var interval = null;
        if (timerActive) {
            interval = setInterval(() => {
                setTime((time) => Number((time + 0.1).toFixed(1)));
                setSpeed((moves / time).toFixed(1));
            }, 100);
        } else if (!timerActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timerActive, time]);

    return (
        <div>
            <Head>
                <title>15 Puzzle</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>

            <Popup ref={winPop}>
                {" "}
                <div className={styles.statsPop}>
                    <div className={styles.timePop}>
                        T{" "}
                        <div className={styles.indivStat}>
                            {time}
                            {"s"}
                        </div>
                    </div>
                    <div className={styles.movenPop}>
                        M <div className={styles.indivStat}>{moves}</div>
                    </div>
                    <div className={styles.speedPop}>
                        S <div className={styles.indivStat}>{speed}</div>
                    </div>
                </div>
                <button></button>
            </Popup>

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
                                <button
                                    onClick={newgame}
                                    className={styles.restart}
                                >
                                    new
                                </button>

                                <button className={styles.best}>
                                    best solution
                                </button>
                                <div className={styles.stats}>
                                    <div className={styles.time}>
                                        T{" "}
                                        <div className={styles.indivStat}>
                                            {time}
                                            {"s"}
                                        </div>
                                    </div>
                                    <div className={styles.moven}>
                                        M{" "}
                                        <div className={styles.indivStat}>
                                            {moves}
                                        </div>
                                    </div>
                                    <div className={styles.speed}>
                                        S{" "}
                                        <div className={styles.indivStat}>
                                            {speed}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className={styles.game} ref={board}>
                                    {[...Array(16).keys()].map((n) => (
                                        <Cell
                                            number={
                                                [].concat.apply([], matrix)[n]
                                            }
                                            key={n}
                                            frog={n}
                                        />
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
