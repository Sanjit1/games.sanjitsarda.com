import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
    var dummy = useRef();
    var [moveList, setMoveList] = useState([]);
    var [up, down, left, right] = [useRef(), useRef(), useRef(), useRef()];
    var [
        [canMove, setCanMove],
        [time, setTime],
        [timerActive, setTimerActive],
        [moves, setMoves],
        [speed, setSpeed],
        [gameMode, setGameMode],
        [gameLevel, setGameLevel],
    ] = [
        useState(false),
        useState(0),
        useState(false),
        useState(0),
        useState(0),
        useState("stock"),
        useState("easy"),
    ];

    var [logs, setLogs] = useState([]);
    /*
    {
        Level: Easy,
        Variant: Blind,
        Time: 10,
        Moves: 100,
        Speed: 10
    }
    */

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
            if (event.key == "r") {
                newgame();
            }

            if (canMove) {
                if (event.key == "w" || event.key == "ArrowUp") {
                    legalMove = updateMatrix("u");
                    up.current.className = styles.pressed;
                    setMoveList([...moveList, "Up"]);
                    setTimeout(() => {
                        up.current.className = styles.key;
                    }, 100);
                } else if (event.key == "a" || event.key == "ArrowLeft") {
                    legalMove = updateMatrix("l");
                    left.current.className = styles.pressed;
                    setMoveList([...moveList, "Left"]);
                    setTimeout(() => {
                        left.current.className = styles.key;
                    }, 100);
                } else if (event.key == "s" || event.key == "ArrowDown") {
                    legalMove = updateMatrix("d");
                    down.current.className = styles.pressed;
                    setMoveList([...moveList, "Down"]);
                    setTimeout(() => {
                        down.current.className = styles.key;
                    }, 100);
                } else if (event.key == "d" || event.key == "ArrowRight") {
                    legalMove = updateMatrix("r");
                    right.current.className = styles.pressed;
                    setMoveList([...moveList, "Right"]);

                    setTimeout(() => {
                        right.current.className = styles.key;
                    }, 100);
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
                        setCanMove(false);
                        winPop.current.open();
                        /*
                        {
                            Level: Easy,
                            Variant: Blind,
                            Time: 10,
                            Moves: 100,
                            Speed: 10
                        }
                        */
                        setLogs((logs) => [
                            {
                                level: gameLevel,
                                varient: gameMode,
                                time: time,
                                moves: moves,
                                speed: speed,
                            },
                            ...logs,
                        ]);
                    }
                }
            } else {
                if (event.key === "Escape") {
                    winPop.current.xOut();
                }
            }
        };

        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
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
        setMoveList([]);
        Array.from(board.current.children).forEach((piece) => {
            piece.style.fontSize = "54px";
        });
        if (gameMode == "blind") {
            function* shuffle(array) {
                var i = array.length;

                while (i--) {
                    yield array.splice(
                        Math.floor(Math.random() * (i + 1)),
                        1
                    )[0];
                }
            }
            var nums = shuffle(Array.from(Array(16).keys()));
            /*
             * Easy 2
             * Not sooo easy 3
             * Medium 4
             * Hard 5
             * Too Hard 7
             */
            var blocked = Array.from(
                {
                    length:
                        gameLevel == "easy"
                            ? 2
                            : gameLevel == "nse"
                            ? 3
                            : gameLevel == "med"
                            ? 4
                            : gameLevel == "hard"
                            ? 5
                            : gameLevel == "too hard"
                            ? 7
                            : 0,
                },
                () => nums.next().value
            );

            blocked.forEach((n) => {
                board.current.children[n].style.fontSize = 0;
            });
        }
        winPop.current.xOut();
        shuffle();
        setTime(0);
        setTimerActive(false);
        setMoves(0);
        setSpeed(0);
        setCanMove(true);
    }
    useEffect(newgame, [board]);
    useEffect(newgame, [gameMode]);

    useEffect(() => {
        dummy.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
        });
        var interval = null;
        if (timerActive) {
            interval = setInterval(() => {
                setTime((time) => Number((time + 0.1).toFixed(1)));
                setSpeed((moves / time).toFixed(1));
                if (gameMode == "memory") {
                    if (
                        Math.ceil(
                            time %
                                (gameLevel == "easy"
                                    ? 4
                                    : gameLevel == "nse"
                                    ? 5
                                    : gameLevel == "med"
                                    ? 6
                                    : gameLevel == "hard"
                                    ? 8
                                    : gameLevel == "too hard"
                                    ? 100
                                    : 0)
                        ) == 1
                    ) {
                        Array.from(board.current.children).forEach((piece) => {
                            piece.style.fontSize = "54px";
                        });
                    } else {
                        Array.from(board.current.children).forEach((piece) => {
                            piece.style.fontSize = "0px";
                        });
                    }
                }
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
                <center>
                    <br />
                    <button className={styles.popupButton} onClick={newgame}>
                        New Game
                    </button>
                    <p>Or press r to restart</p>
                </center>
            </Popup>
            <center>
                <h1>15 Puzzle</h1>
                <div className={styles.space}>
                    <div className={styles.variants}>
                        <button
                            onClick={() => {
                                setGameMode("stock");
                            }}
                            style={{
                                background:
                                    gameMode == "stock" ? "#ffd249" : null,
                            }}
                            className={styles.normal}
                        >
                            stock
                        </button>
                        <button
                            onClick={() => {
                                setGameMode("blind");
                            }}
                            style={{
                                background:
                                    gameMode == "blind" ? "#ffd249" : null,
                            }}
                            className={styles.blind}
                        >
                            blind
                        </button>
                        <button
                            onClick={() => {
                                setGameMode("memory");
                            }}
                            style={{
                                background:
                                    gameMode == "memory" ? "#ffd249" : null,
                            }}
                            className={styles.memory}
                        >
                            memory
                        </button>
                        <button
                            style={{
                                background:
                                    gameMode == "size" ? "#ffd249" : null,
                            }}
                            className={styles.size}
                        >
                            size*
                        </button>
                        <button
                            style={{
                                background:
                                    gameMode == "picture" ? "#ffd249" : null,
                            }}
                            className={styles.pic}
                        >
                            picture*
                        </button>
                    </div>
                    <br />
                    <div className={styles.gamespace}>
                        <div className={styles.pressedKeys}>
                            <h4 className={styles.heading}>Keys</h4>
                            <div className={styles.keyHolder}>
                                <div className={styles.keyN}></div>
                                <div className={styles.key} ref={up}>
                                    Up
                                </div>
                                <div className={styles.keyN}></div>
                                <div className={styles.key} ref={left}>
                                    Left
                                </div>
                                <div className={styles.key} ref={down}>
                                    Down
                                </div>
                                <div className={styles.key} ref={right}>
                                    Right
                                </div>
                            </div>
                        </div>
                        <div className={styles.history}>
                            <h4 className={styles.heading}>History</h4>
                            <div className={styles.logs}>
                                {logs.map((game) => {
                                    return (
                                        <div className={styles.logEntry}>
                                            {game.level
                                                .charAt(0)
                                                .toUpperCase() +
                                                game.level.slice(1)}{" "}
                                            {game.varient
                                                .charAt(0)
                                                .toUpperCase() +
                                                game.varient.slice(1)}
                                            <br />
                                            <stat className={styles.statsLog}>
                                                <b>T:</b> {game.time}s,{" "}
                                                <b>M:</b> {game.moves},{" "}
                                                <b>S:</b> {game.speed}
                                            </stat>
                                            <br />
                                        </div>
                                    );
                                })}
                            </div>
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
                                    best solution*
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
                            <div className={styles.movelog}>
                                {Array.from(Array(moveList.length).keys()).map(
                                    (index) => {
                                        return (
                                            <div>
                                                <b>{index + 1}.</b>{" "}
                                                {moveList[index]}
                                            </div>
                                        );
                                    }
                                )}
                                <div ref={dummy}></div>
                            </div>
                        </div>
                        <div className={styles.level}>
                            <h4 className={styles.heading}>Game Level</h4>
                            <div className={styles.levelSelectors}>
                                <br />
                                <button
                                    onClick={() => {
                                        setGameLevel("easy");
                                    }}
                                    style={{
                                        background:
                                            gameLevel == "easy"
                                                ? "#A0E7E5"
                                                : null,
                                    }}
                                    className={styles.easy}
                                >
                                    Easy
                                </button>
                                <br />
                                <button
                                    onClick={() => {
                                        setGameLevel("nse");
                                    }}
                                    style={{
                                        background:
                                            gameLevel == "nse"
                                                ? "#A0E7E5"
                                                : null,
                                    }}
                                    className={styles.nse}
                                >
                                    Not sooo Easy
                                </button>{" "}
                                <br />
                                <button
                                    onClick={() => {
                                        setGameLevel("med");
                                    }}
                                    style={{
                                        background:
                                            gameLevel == "med"
                                                ? "#A0E7E5"
                                                : null,
                                    }}
                                    className={styles.med}
                                >
                                    Medium
                                </button>{" "}
                                <br />
                                <button
                                    onClick={() => {
                                        setGameLevel("hard");
                                        console.log(gameLevel);
                                    }}
                                    style={{
                                        background:
                                            gameLevel == "hard"
                                                ? "#A0E7E5"
                                                : null,
                                    }}
                                    className={styles.hard}
                                >
                                    Hard
                                </button>{" "}
                                <br />
                                <button
                                    onClick={() => {
                                        setGameLevel("too hard");
                                        console.log(gameLevel);
                                    }}
                                    style={{
                                        background:
                                            gameLevel == "too hard"
                                                ? "#A0E7E5"
                                                : null,
                                    }}
                                    className={styles.tooHard}
                                >
                                    Too Hard
                                </button>{" "}
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
            </center>
            <center>
                <br />
                <br />
                <Link href="https://www.speedsolving.com/wiki/index.php/15_puzzle">
                    <a className="normal">
                        Try this link for a quick tutorial(or use google).
                    </a>
                </Link>
                <br />
                This game was made with heavy inspiration from{" "}
                <Link href="https://15puzzle.netlify.app">
                    <a className="normal">this game</a>
                </Link>
                , made by Shubmam Singh.
                <br />
                The reason I made this was to make my own improvements and add
                other stuff to it.
                <br />
                *Feature not available(yet!). Feel free to add a pull request
                implementing these features{" "}
                <Link href="https://github.com/Sanjit1/games.sanjitsarda.com">
                    <a className="normal">here.</a>
                </Link>
            </center>
        </div>
    );
}
