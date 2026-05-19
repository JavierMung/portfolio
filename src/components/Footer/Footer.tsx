
"use client"
import { useEffect, useState } from "react";

type LangName = "en" | "es";

const resumeByLang: Record<LangName, string> = {
    en: "/ResumeEn.pdf",
    es: "/ResumeEs.pdf",
};

export default function Footer() {
    const [currentLang, setCurrentLang] = useState<LangName>("en");

    useEffect(() => {
        const syncLang = () => {
            const saved = localStorage.getItem("portfolio-lang");
            if (saved === "en" || saved === "es") {
                setCurrentLang(saved);
            }
        };

        syncLang();
        window.addEventListener("portfolio-lang-change", syncLang);
        window.addEventListener("storage", syncLang);

        return () => {
            window.removeEventListener("portfolio-lang-change", syncLang);
            window.removeEventListener("storage", syncLang);
        };
    }, []);

    return (
        <footer className="fixed bottom-0 w-full p-6 flex justify-center items-center gap-8 bg-transparent text-gray-500 z-50">
            {/* GitHub */}
            <a
                href="https://github.com/JavierMung"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                aria-label="GitHub"
            >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
            </a>

            {/* LinkedIn */}
            <a
                href="https://mx.linkedin.com/in/javier-munguia"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0a66c2] transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(10,102,194,0.4)]"
                aria-label="LinkedIn"
            >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
            </a>

            {/* Gmail */}
            <a
                href="mailto:javiermunguia35@gmail.com"
                className="hover:text-[#ea4335] transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(234,67,53,0.4)]"
                aria-label="Gmail"
            >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
            </a>

            {/* Resume PDF */}
            <a
                href={resumeByLang[currentLang]}
                download
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#22c55e] transition-all duration-300 transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                aria-label={currentLang === "es" ? "Descargar CV" : "Download Resume"}
                title={currentLang === "es" ? "Descargar CV" : "Download Resume"}
            >
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M12 11v6" />
                    <path d="M9.5 14.5L12 17l2.5-2.5" />
                </svg>
            </a>
        </footer>
    );
}