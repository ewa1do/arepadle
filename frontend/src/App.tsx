import styled from "styled-components";
import "./App.css";
import { useEffect, useState } from "react";
import { useKeyPressed } from "./hooks/useKeyPressed";
import { keyboardKeys } from "./lib/keyboardKeys";

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

const BoxIncorrect = styled(Box)`
    background-color: #7e7f9a;
`;

const BoxCorrect = styled(Box)`
    background-color: #28536b;
`;

const BoxGuess = styled(Box)`
    background-color: #f1c604;
`;

const Letter = styled.span`
    color: #e4e5f2;
    font-weight: 600;
    font-size: 1.5rem;
`;

function App() {
    const wordTest = "arepa";
    const MAX_LIVES = 6;
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [currentLive, setCurrentLive] = useState<number>(0);
    const [word, setWord] = useState<string>("#".repeat(wordTest.length));
    const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);

    const [gameBoard, setGameBoard] = useState(
        Array.from({ length: MAX_LIVES }, () => "#".repeat(wordTest.length)),
    );

    useKeyPressed(wordTest, word, setWord, isEnterPressed, setIsEnterPressed);

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

            setCurrentLive((prev) => prev + 1);
            setWord("#".repeat(wordTest.length));
            setIsEnterPressed(false);
            return;
        }
    }, [isEnterPressed, word, currentLive]);

    return (
        <>
            <Gameboard {...{ gameBoard, currentLive, wordTest }} />
            <Keys
                {...{
                    word,
                    wordTest,
                    setIsEnterPressed,
                    setWord,
                }}
            />
        </>
    );
}

interface BoardProps {
    gameBoard: string[];
    currentLive: number;
    wordTest: string;
}

function Gameboard({ gameBoard, currentLive, wordTest }: BoardProps) {
    return gameBoard.map((word, i) => {
        return (
            <WordRow $columns={`${wordTest.length}`} $gap="10px">
                {Array.from(word, (char, j) => {
                    if (i >= currentLive) {
                        return (
                            <Box>
                                <Letter>{char === "#" ? "" : char}</Letter>
                            </Box>
                        );
                    }

                    if (wordTest[j].toUpperCase() === word[j].toUpperCase()) {
                        return (
                            <BoxCorrect>
                                <Letter>{char}</Letter>
                            </BoxCorrect>
                        );
                    }

                    if (wordTest.toUpperCase().includes(char)) {
                        return (
                            <BoxGuess>
                                <Letter>{char}</Letter>
                            </BoxGuess>
                        );
                    }

                    return (
                        <BoxIncorrect>
                            <Letter>{char}</Letter>
                        </BoxIncorrect>
                    );
                })}
            </WordRow>
        );
    });
}

interface KeyProps {
    word: string;
    setWord: React.Dispatch<React.SetStateAction<string>>;
    setIsEnterPressed: React.Dispatch<React.SetStateAction<boolean>>;
    wordTest: string;
}

function Keys({ setIsEnterPressed, setWord, word, wordTest }: KeyProps) {
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
                onClick={(e) => {
                    const target = e.target as HTMLDivElement;

                    if (target.textContent === "Backspace") {
                        if (word[word.length - 1] !== "#") {
                            const deletedWord = word.slice(0, -1) + "#";

                            setWord(deletedWord);
                            return;
                        }

                        const getLastChar = word.split("").indexOf("#") - 1;

                        const deleteLastChar = word
                            .split("")
                            .map((char, i) => (i === getLastChar ? "#" : char))
                            .join("");

                        setWord(deleteLastChar);
                        return;
                    }

                    if (target.textContent === "Enter") {
                        if (word.length !== wordTest.length) {
                            return;
                        }

                        setIsEnterPressed(true);
                    }

                    return setWord((prev) => {
                        const findFirstPlaceholder = prev.split("").findIndex((val) => val === "#");

                        return prev
                            .split("")
                            .map((letter, i) =>
                                i === findFirstPlaceholder
                                    ? target.textContent?.toUpperCase()
                                    : letter,
                            )
                            .join("");
                    });
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
