import { useMemo, useEffect, useState } from "react";

export function useKeyPressed(wordTest: string) {
    const [word, setWord] = useState<string>("#".repeat(wordTest.length));
    const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);
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

            if (word.length > wordTest.length + 1) return;

            setWord((prev) => {
                if (bannedKeys.includes(e.key)) return prev + "";

                const findFirstPlaceholder = prev.split("").findIndex((val) => val === "#");

                return prev
                    .split("")
                    .map((letter, i) => (i === findFirstPlaceholder ? e.key : letter))
                    .join("");
            });
        }

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [word, bannedKeys, wordTest.length]);

    return { word, isEnterPressed, setIsEnterPressed, setWord };
}
