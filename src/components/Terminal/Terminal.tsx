"use client"
import React from "react";
import Button from "../Button";
import { useEffect, useRef, useState, type JSX } from "react";
import { translations, type LangName } from "./translations";

type ThemeName = "dark" | "light" | "hacker" | "dracula" | "solarized";

interface TerminalTheme {
    bg: string;
    headerBg: string;
    text: string;
    promptUser: string;
    promptPath: string;
    inputText: string;
    cursorBg: string;
    border: string;
    headerText: string;
}

const themes: Record<ThemeName, TerminalTheme> = {
    dark: {
        bg: "bg-[#1e1e1e]",
        headerBg: "bg-[#2d2d2d]",
        text: "text-gray-300",
        promptUser: "text-green-400",
        promptPath: "text-blue-400",
        inputText: "text-white",
        cursorBg: "bg-white",
        border: "border-white/10",
        headerText: "text-gray-400",
    },
    light: {
        bg: "bg-[#f5f5f5]",
        headerBg: "bg-[#e0e0e0]",
        text: "text-gray-800",
        promptUser: "text-green-700",
        promptPath: "text-blue-700",
        inputText: "text-black",
        cursorBg: "bg-black",
        border: "border-black/20",
        headerText: "text-gray-600",
    },
    hacker: {
        bg: "bg-black",
        headerBg: "bg-[#0a0a0a]",
        text: "text-green-400",
        promptUser: "text-green-500",
        promptPath: "text-green-300",
        inputText: "text-green-400",
        cursorBg: "bg-green-400",
        border: "border-green-900",
        headerText: "text-green-600",
    },
    dracula: {
        bg: "bg-[#282a36]",
        headerBg: "bg-[#21222c]",
        text: "text-[#f8f8f2]",
        promptUser: "text-[#50fa7b]",
        promptPath: "text-[#bd93f9]",
        inputText: "text-[#f8f8f2]",
        cursorBg: "bg-[#f8f8f2]",
        border: "border-[#44475a]",
        headerText: "text-[#6272a4]",
    },
    solarized: {
        bg: "bg-[#002b36]",
        headerBg: "bg-[#073642]",
        text: "text-[#839496]",
        promptUser: "text-[#859900]",
        promptPath: "text-[#268bd2]",
        inputText: "text-[#93a1a1]",
        cursorBg: "bg-[#93a1a1]",
        border: "border-[#586e75]",
        headerText: "text-[#657b83]",
    },
};

export default function Terminal() {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [isInputVisible, setIsInputVisible] = useState(true);
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [prompt, setPrompt] = useState("");
    const [currentTheme, setCurrentTheme] = useState<ThemeName>("dark");
    const [currentLang, setCurrentLang] = useState<LangName>("en");
    const theme = themes[currentTheme];
    const t = translations[currentLang];

    const GetResponse = (prompt: string) => {
        const parts = prompt.toLowerCase().split(" ");
        const command = parts[0];

        switch (command) {
            case "help":
                return t.help;
            case "clear":
                return "";
            case "exit":
                return t.exit;
            case "theme": {
                const arg = parts[1];
                const available = Object.keys(themes) as ThemeName[];
                if (!arg) {
                    return t.themeCurrent(currentTheme, available.join(", "));
                }
                if (available.includes(arg as ThemeName)) {
                    setCurrentTheme(arg as ThemeName);
                    return t.themeChanged(arg);
                }
                return t.themeUnknown(arg, available.join(", "));
            }
            case "lang": {
                const arg = parts[1];
                const available = Object.keys(translations) as LangName[];
                if (!arg) {
                    return t.langCurrent(currentLang, available.join(", "));
                }
                if (available.includes(arg as LangName)) {
                    setCurrentLang(arg as LangName);
                    const newT = translations[arg as LangName];
                    return newT.langChanged(arg);
                }
                return t.langUnknown(arg, available.join(", "));
            }
            case "whoami":
                return t.whoami.join("\n");
            case "about":
                return t.about(AGE() - 1);
            case "projects":
                return t.projects;
            case "contact":
                return [t.contactEmail, t.contactSubject, t.contactMessage];
            case "skills":
                return t.skills;
            default:
                return t.commandNotFound;
        }
    }
    const [history, setHistory] = useState<{ prompt: string, response: string | string[] | JSX.Element[], type: "text" | "input" }[]>([
        {
            prompt: "whoami",
            response: GetResponse("whoami"),
            type: "text"
        }
    ]);
    const [tempHistory, setTempHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const USER = "javiermunguia.dev";
    const AGE = () => {
        const today = new Date();
        const birthDate = new Date("1999-09-26");
        const diff = today.getFullYear() - birthDate.getFullYear();

        return diff;
    }
    const handlePrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrompt(e.target.value);
    }

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const handleClose = () => {
        if (confirm(t.closeConfirm)) {
            setIsMinimized(!isMinimized);
            ClearTerminal();
        }
    };

    const ClearTerminal = () => {
        setHistory([
            {
                prompt: "whoami",
                response: "",
                type: "text"
            }
        ]);
        setPrompt("");
    }

    const onclickInput = () => {
        inputRef.current?.focus();
    }

    useEffect(() => {
        if (typeof window === "undefined") return;

        const savedLang = localStorage.getItem("portfolio-lang");
        if (savedLang === "en" || savedLang === "es") {
            setCurrentLang(savedLang as LangName);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        localStorage.setItem("portfolio-lang", currentLang);
        window.dispatchEvent(
            new CustomEvent("portfolio-lang-change", { detail: currentLang })
        );
    }, [currentLang]);

    return (
        <div onClick={onclickInput} className={`$ flex items-center justify-center min-h-[calc(100vh)] ${isMinimized ? "p-4" : " "} font-mono text-sm transition-transform duration-300`}>
            <div
                className={`
            absolute
            ${isMaximized ? "rounded-none" : "rounded-xl"} overflow-hidden
            shadow-2xl
            ${theme.bg}
            border ${theme.border}
            flex flex-col
            origin-center
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isMaximized ? "h-[100dvh] w-[100dvw]" : "h-[85dvh] w-[95dvw] md:h-[70dvh] md:w-[80dvw] lg:h-[65dvh] lg:w-[60dvw]"}
            ${isMinimized ? `opacity-0 scale-0 blur-sm pointer-events-none` : `opacity-100 scale-100 blur-0`}
        `}
            >
                {/* Header Bar */}
                <div className={`${theme.headerBg} px-3 py-1.5 flex items-center justify-between border-b border-black/40 shadow-sm`}>
                    <div className="flex space-x-1.5">
                        <Button color="bg-[#ff5f56]" onClick={handleClose} />
                        <Button color="bg-[#ffbd2e]" onClick={handleMinimize} />
                        <Button color="bg-[#27c93f]" onClick={handleMaximize} />
                    </div>
                    <div className={`${theme.headerText} text-[10px] font-semibold tracking-wider absolute left-1/2 -translate-x-1/2 uppercase`}>
                        {USER}@portfolio: ~
                    </div>
                    <div className="w-14" />
                </div>

                {/* Terminal Content */}
                <div className={`flex-1 p-3 md:p-6 ${theme.text} overflow-y-auto space-y-4`}>
                    {
                        history.map((item, index) => {
                            return (<div key={index} className="flex flex-col items-start">
                                <div className="flex items-center gap-1">
                                    <span className={`${theme.promptUser} font-bold`}>${USER}@portfolio</span>
                                    <span className={theme.inputText}>:</span>
                                    <span className={`${theme.promptPath} font-bold`}>~</span>
                                    <span className={theme.inputText}>$</span>
                                    <span className={`ml-2 ${theme.inputText}`}>{item.prompt}</span>
                                </div>
                                <pre className={`${theme.text} leading-relaxed ml-2 whitespace-pre-wrap break-words font-mono text-xs overflow-x-auto`}>

                                    {
                                        item.type === "text" ? (
                                            item.response
                                        ) : item.type === "input" ? (

                                            (item.response as string[]).map((response, index) => {

                                                const isCurrent = visibleIndex === index;
                                                const isLast = index === (item.response as string[]).length - 1;

                                                return (
                                                    <React.Fragment key={index}>

                                                        {index <= visibleIndex && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span>{response}</span>

                                                                {isCurrent ? (
                                                                    <div className="relative flex items-center">
                                                                        <input
                                                                            type="text"
                                                                            className={`
                                                                                inline-block
                                                                                w-auto
                                                                                field-sizing-content
                                                                                bg-transparent
                                                                                border-none
                                                                                outline-none
                                                                                ${theme.inputText}
                                                                                caret-transparent
                                                                            `}
                                                                            value={tempHistory[index] || ""}
                                                                            onChange={(e) => {
                                                                                const newHistory = [...tempHistory];
                                                                                newHistory[index] = e.target.value;
                                                                                setTempHistory(newHistory);
                                                                            }}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === "Enter") {
                                                                                    if (isLast) {
                                                                                        const currentValue = e.currentTarget.value;
                                                                                        setIsInputVisible(true);
                                                                                        setVisibleIndex(0);
                                                                                        setHistory(prev => {
                                                                                            const newH = [...prev];
                                                                                            const lastIdx = newH.length - 1;
                                                                                            const finalMessage = (item.response as string[]).map((resp, i) => {
                                                                                                return `${resp} ${i === index ? currentValue : (tempHistory[i] || "")}`;
                                                                                            }).join('\n');

                                                                                            newH[lastIdx] = {
                                                                                                ...newH[lastIdx],
                                                                                                type: "text",
                                                                                                response: finalMessage
                                                                                            };
                                                                                            return newH;
                                                                                        });
                                                                                        setTimeout(() => {
                                                                                            inputRef.current?.focus();
                                                                                        }, 10);
                                                                                    } else {
                                                                                        setVisibleIndex(prev => prev + 1);
                                                                                    }
                                                                                }
                                                                            }}
                                                                            autoFocus
                                                                            autoComplete="off"
                                                                            spellCheck="false"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                        <span className={`inline-block w-2.5 h-4 ${theme.cursorBg} animate-pulse [animation-duration:800ms]`}></span>
                                                                    </div>
                                                                ) : (
                                                                    <span className={theme.inputText}>{tempHistory[index]}</span>
                                                                )}
                                                            </div>
                                                        )}

                                                    </React.Fragment>
                                                );
                                            })

                                        ) : null
                                    }

                                </pre>
                            </div>
                            )

                        })
                    }

                    <div className={`flex items-center gap-1 ${isInputVisible ? "" : "hidden"}`}>
                        <span className={`${theme.promptUser} font-bold`}>${USER}@portfolio</span>
                        <span className={theme.inputText}>:</span>
                        <span className={`${theme.promptPath} font-bold`}>~</span>
                        <span className={theme.inputText}>$</span>
                        <div className="ml-2 relative flex items-center">
                            <input
                                type="text"
                                className={`
                                        inline-block
                                        w-auto
                                        field-sizing-content
                                        bg-transparent
                                        border-none
                                        outline-none
                                        ${theme.inputText}
                                        caret-transparent
                                    `}
                                value={prompt}
                                autoComplete="off"
                                spellCheck="false"
                                onChange={(e) => handlePrompt(e)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && (prompt === "clear" || prompt === "cls")) {
                                        setHistory([]);
                                        setPrompt("");
                                    }
                                    else if (e.key === "Enter" && prompt === "exit") {
                                        handleClose();
                                    }
                                    else if (e.key === "Enter" && prompt === "contact") {
                                        setHistory([...history, { prompt: prompt, response: GetResponse(prompt), type: "input" }]);
                                        setPrompt("");
                                        setIsInputVisible(false);
                                        setTempHistory([]);
                                    }
                                    else if (e.key === 'Enter') {
                                        setHistory([...history, { prompt: prompt, response: GetResponse(prompt), type: "text" }]);
                                        setPrompt("");
                                    }
                                    else if (e.key === 'ArrowUp') {

                                        if (history.length === 0) return;

                                        let newIndex;

                                        if (historyIndex === null) {
                                            newIndex = history.length - 1;
                                        } else {
                                            newIndex = Math.max(0, historyIndex - 1);
                                        }

                                        setHistoryIndex(newIndex);

                                        const command = history[newIndex].prompt;

                                        setPrompt(command);

                                        requestAnimationFrame(() => {
                                            const input = inputRef.current;

                                            if (input) {
                                                const length = input.value.length;

                                                input.setSelectionRange(length, length);
                                            }
                                        });
                                    } else if (e.key === 'ArrowDown') {

                                        if (history.length === 0) return;

                                        let newIndex;

                                        if (historyIndex === null) return;

                                        newIndex = Math.min(history.length - 1, historyIndex + 1);

                                        setHistoryIndex(newIndex);

                                        const command = history[newIndex].prompt;

                                        setPrompt(command);

                                        requestAnimationFrame(() => {
                                            const input = inputRef.current;

                                            if (input) {
                                                const length = input.value.length;

                                                input.setSelectionRange(length, length);
                                            }
                                        });
                                    }
                                }}
                                ref={inputRef}
                            />
                            <span className={`inline-block w-2.5 h-4 ${theme.cursorBg} animate-pulse [animation-duration:800ms]`}></span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={` absolute transition-all duration-300 ease-out cursor-pointer ${isMinimized ? "opacity-100 scale-100 animate-pulse" : "opacity-0 scale-75 pointer-events-none"} `} onClick={handleMinimize}>
                <div className="bg-white/90 hover:bg-white border border-white/90 px-5 py-3 rounded-xl backdrop-blur-md">
                    <p>{'>_'} {t.openTerminal}</p>
                </div>
            </div>
        </div>
    );
}