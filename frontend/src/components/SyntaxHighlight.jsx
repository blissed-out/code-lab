// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { duotoneForest } from "react-syntax-highlighter/dist/cjs/styles/prism";
// import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
// const ColorfullCode = ({ language, codeString }) => {
//   return (
//     <SyntaxHighlighter language={language} style={dark}>
//       {codeString}
//     </SyntaxHighlighter>
//   );
// };
//
// export default ColorfullCode;
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const ColorfullCode = ({ language, codeString }) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={atomOneDark}
      customStyle={{ background: "none", padding: 0, margin: 0 }}
    >
      {codeString}
    </SyntaxHighlighter>
  );
};

export default ColorfullCode;
