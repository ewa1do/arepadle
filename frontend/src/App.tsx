import styled from "styled-components";
import "./App.css";

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
    const LIVES = 6;

    return (
        <>
            {Array.from({ length: LIVES }).map((_, i) => (
                <WordRow $columns={`${wordTest.length}`} $gap="10px">
                    {splitWord(wordTest).map((letter) => {
                        if (i === 2) {
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

                        if (i === 4) {
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
                        if (i === 5) {
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

                        return (
                            <Box>
                                <span
                                    style={{
                                        color: "#E4E5F2",
                                        fontWeight: "600",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    {letter}
                                </span>
                            </Box>
                        );
                    })}
                </WordRow>
            ))}

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

function splitWord(word: string): string[] {
    return word.toUpperCase().split("");
}

export default App;
