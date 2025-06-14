import { useMemo, useEffect, useState } from "react";
import { keyboardKeys } from "../lib/keyboardKeys";

export function useKeyPressed(
    wordTest: string,
    word: string,
    setWord: React.Dispatch<React.SetStateAction<string>>,
    isEnterPressed: boolean,
    setIsEnterPressed: React.Dispatch<React.SetStateAction<boolean>>,
) {
    // const [word, setWord] = useState<string>("#".repeat(wordTest.length));
    // const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);
    const bannedKeys = useMemo(() => ["Backspace", "Enter"], []);

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (
                !keyboardKeys.flat().includes(e.key.toUpperCase()) &&
                !["Enter", "Backspace"].includes(e.key)
            ) {
                return;
            }

            if (e.key === "Backspace") {
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

            if (e.key === "Enter") {
                if (word.length !== wordTest.length) {
                    return;
                }

                setIsEnterPressed(true);
            }

            if (word.length > wordTest.length + 1) return;

            setWord((prev) => {
                if (bannedKeys.includes(e.key)) return prev + "";

                const findFirstPlaceholder = prev.split("").findIndex((val) => val === "#");

                return prev
                    .split("")
                    .map((letter, i) => (i === findFirstPlaceholder ? e.key.toUpperCase() : letter))
                    .join("");
            });
        }

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [word, bannedKeys, wordTest.length]);

    // return { isEnterPressed, setIsEnterPressed };
}
