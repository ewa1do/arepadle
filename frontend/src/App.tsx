import styled from "styled-components";
import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { useKeyPressed } from "./hooks/useKeyPressed";

const WordRow = styled.div<{ $columns?: number; $gap: string }>`
    display: grid;
    grid-template-columns: repeat(${(props) => props.$columns || 1}, 3em);
    column-gap: ${(props) => props.$gap || "1em"};
    margin-bottom: 1em;
    justify-content: center;
`;

const Box = styled.div`
    border-radius: 4px;
    height: 2.5em;
    width: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid white;
`;

const BoxInactive = styled(Box)`
    background-color: #7e7f9a;
`;

const BoxCorrect = styled(Box)`
    background-color: #28536b;
`;

const BoxYellow = styled(Box)`
    background-color: #f1c604;
`;

const keyboardKeys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["BackSpace", "Z", "X", "C", "V", "B", "N", "M", "Enter"],
];

function App() {
    const wordTest = "arepa";
    const MAX_LIVES = 6;
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [currentLive, setCurrentLive] = useState<number>(0);

    const [gameBoard, setGameBoard] = useState(
        Array.from({ length: MAX_LIVES }, () => "#".repeat(wordTest.length)),
    );

    const { isEnterPressed, word, setIsEnterPressed, setWord } = useKeyPressed(wordTest);

    useEffect(() => {
        setGameBoard((prev) => {
            return prev.map((val, i) => {
                if (i === currentLive) {
                    return word;
                }
                return val;
            });
        });
    }, [word, currentLive]);

    useEffect(() => {
        // TODO: Handling press enter behavior (change letter of blocks)
        if (isEnterPressed) {
            // if (word === wordTest) {
            //     console.log("YOU WON!");
            //     setIsGameOver(true);
            //     return;
            // }

            setIsEnterPressed(false);

            setCurrentLive((prev) => prev + 1);
            setWord("#".repeat(wordTest.length));
            return;
        }
    }, [isEnterPressed, word, currentLive]);

    return (
        <>
            {gameBoard.map((word, i) => {
                return (
                    <WordRow $columns={`${wordTest.length}`} $gap="10px">
                        {Array.from(word, (letter) => {
                            return (
                                <Box>
                                    <span
                                        style={{
                                            color: "#E4E5F2",
                                            fontWeight: "600",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        {letter === "#" ? "" : letter}
                                    </span>
                                </Box>
                            );
                        })}
                    </WordRow>
                );
            })}

            {/* {gameBoard.map((word, i) => {
                return (
                    <WordRow $columns={`${wordTest.length}`} $gap="10px">
                        {Array.from(word, (letter, j) => {
                            if (wordTest[j] === word[j]) {
                                return (
                                    <BoxCorrect>
                                        <span
                                            style={{
                                                color: "#E4E5F2",
                                                fontWeight: "600",
                                                fontSize: "1.5rem",
                                            }}
                                        >
                                            {letter}
                                        </span>
                                    </BoxCorrect>
                                );
                            }

                            if (wordTest.includes(letter)) {
                                return (
                                    <BoxYellow>
                                        <span
                                            style={{
                                                color: "#E4E5F2",
                                                fontWeight: "600",
                                                fontSize: "1.5rem",
                                            }}
                                        >
                                            {letter}
                                        </span>
                                    </BoxYellow>
                                );
                            }

                            if (!wordTest.includes(letter) && !word.includes("#")) {
                                return (
                                    <BoxInactive>
                                        <span
                                            style={{
                                                color: "#E4E5F2",
                                                fontWeight: "600",
                                                fontSize: "1.5rem",
                                            }}
                                        >
                                            {letter}
                                        </span>
                                    </BoxInactive>
                                );
                            }

                            return (
                                <Box>
                                    <span
                                        style={{
                                            color: "#E4E5F2",
                                            fontWeight: "600",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        {letter === "#" ? "" : letter}
                                    </span>
                                </Box>
                            );
                        })}
                    </WordRow>
                );
            })} */}

            <Keys />
        </>
    );
}

function Keys() {
    return keyboardKeys.map((row) => {
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                    padding: "0 10px",
                    gap: "10px",
                    marginBottom: "0.5em",
                }}
            >
                {row.map((letter) => (
                    <div
                        style={{
                            border: "1px solid white",
                            color: "#E4E5F2",
                            fontSize: "1.35em",
                            padding: "0.3em 0.25em",
                            textAlign: "center",
                        }}
                    >
                        {letter}
                    </div>
                ))}
            </div>
        );
    });
}

export default App;
