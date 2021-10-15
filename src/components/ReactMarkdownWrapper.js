import { React, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ReactMarkdownWrapper = ({ body }) => {
  return (
    <ReactMarkdown
      children={body}
      linkTarget="_blank"
      remarkPlugins={[remarkGfm]}
      //   rehypePlugins={[rehypeHighlight]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          // className is the name of the language
          // children contains the code
          // props are the remainging props
          return !inline && match ? (
            <pre>
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                language={"javascript"}
                style={docco}
              />
            </pre>
          ) : (
            //   If inline OR no match with language then just print the code
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
