import styled from "styled-components";
import "./App.css";
import { useEffect, useMemo, useState } from "react";

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
    // let currentLive = 0;

    const [word, setWord] = useState<string>("");
    const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [currentLive, setCurrentLive] = useState<number>(0);
    const [gameBoard, setGameBoard] = useState(
        Array.from({ length: MAX_LIVES }, () => "#".repeat(wordTest.length)),
    );

    const bannedKeys = useMemo(() => ["Backspace", "Enter"], []);

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (e.key === "Backspace") {
                setWord((prev) => prev.slice(0, -1));
                return;
            }

            if (e.key === "Enter") {
                if (word.length !== wordTest.length) {
                    return;
                }

                setIsEnterPressed(true);
            }

            if (word.length >= wordTest.length) return;

            setWord((prev) => {
                if (bannedKeys.includes(e.key)) return prev + "";

                return prev + e.key;
            });
        }

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [word, bannedKeys]);

    useEffect(() => {
        if (isEnterPressed) {
            // if (word === wordTest) {
            //     console.log("YOU WON!");
            //     setIsGameOver(true);
            //     return;
            // }

            setIsEnterPressed(false);

            setGameBoard((prev) =>
                prev.map((val, i) => {
                    if (i === currentLive) {
                        return word;
                    }

                    return val;
                }),
            );

            setCurrentLive((prev) => prev + 1);
            setWord("");
            return;
        }
    }, [isEnterPressed, word, currentLive]);

    console.log(gameBoard);
    console.log("word:", word);

    return (
        <>
            {gameBoard.map((word, i) => {
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
            })}

            {keyboardKeys.map((row) => {
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
            })}
        </>
    );
}

export default App;
