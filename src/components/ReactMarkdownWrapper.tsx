import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import remarkGfm from "remark-gfm";

interface ReactMarkdownWrapperProps {
  body: string;
}

const ReactMarkdownWrapper: React.FC<ReactMarkdownWrapperProps> = ({
  body,
}) => {
  return (
    <ReactMarkdown
      children={body}
      linkTarget="_blank"
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          // className is the name of the language
          // children contains the code
          // props are the remaining props
          return !inline && match ? (
            <pre>
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                language={"javascript"} // You might want to dynamically set this based on the match
                style={docco}
              />
            </pre>
          ) : (
            // If inline OR no match with language then just print the code
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default ReactMarkdownWrapper;
