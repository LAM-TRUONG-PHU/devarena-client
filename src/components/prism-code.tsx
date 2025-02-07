import { useEffect, useRef } from "react";
import Prism from "prismjs";

// Import the required language grammar
import "prismjs/components/prism-java";

import "../app/prism.css";

type TProps = {
    code: string;
    plugins?: string[];
    language: string;
};

function PrismCode({ code, plugins, language }: TProps) {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        highlight();
    });

    const highlight = () => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    };

    const html = Prism.highlight(code, Prism.languages[language], language)
        .split("\n")
        .join("\n");

    return (
        <pre className={!plugins ? "!bg-gray-100 !rounded-xl overflow-auto" : plugins.join(" ")} data-start="0">
            <code
                ref={codeRef}
                className={`language-${language}`}
                dangerouslySetInnerHTML={{ __html: html }}
                style={{ fontSize: "13px" }}
            ></code>
        </pre>
    );
}

export default PrismCode;
