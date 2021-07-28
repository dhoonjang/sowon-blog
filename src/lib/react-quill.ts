import React from "react";
import dynamic from "next/dynamic";

const Quill = typeof window == "object" ? require("quill") : () => false;

const ImageUploader = dynamic(() => import("quill-image-uploader"), {
  ssr: false,
});
const ImageResize = dynamic(() => import("quill-image-resize-module"), {
  ssr: false,
});

const boldStyle: React.CSSProperties = {
  fontWeight: 500,
};

const blockquoteSytle: React.CSSProperties = {
  borderLeft: "4px solid #ccc",
  margin: "0",
  padding: "0",
  marginTop: "5px",
  marginBottom: "5px",
  paddingLeft: "16px",
};

const alignCenterStyle: React.CSSProperties = {
  textAlign: "center",
};

const alignRightStyle: React.CSSProperties = {
  textAlign: "right",
};

const indent1Style: React.CSSProperties = {
  paddingLeft: "2em",
};

const indent2Style: React.CSSProperties = {
  paddingLeft: "4em",
};

const indent3Style: React.CSSProperties = {
  paddingLeft: "6em",
};

const indent4Style: React.CSSProperties = {
  paddingLeft: "8em",
};

const indent5Style: React.CSSProperties = {
  paddingLeft: "10em",
};

const indent6Style: React.CSSProperties = {
  paddingLeft: "12em",
};

const indent7Style: React.CSSProperties = {
  paddingLeft: "14em",
};

const indent8Style: React.CSSProperties = {
  paddingLeft: "16em",
};

const doClass = (current: Element, className: string) => {
  let style: React.CSSProperties;
  switch (className) {
    case "fitple-strong":
      style = boldStyle;
      break;
    case "fitple-blockquote":
      style = blockquoteSytle;
      break;
    case "ql-align-center":
      style = alignCenterStyle;
      break;
    case "ql-align-right":
      style = alignRightStyle;
      break;
    case "ql-indent-1":
      style = indent1Style;
      break;
    case "ql-indent-2":
      style = indent2Style;
      break;
    case "ql-indent-3":
      style = indent3Style;
      break;
    case "ql-indent-4":
      style = indent4Style;
      break;
    case "ql-indent-5":
      style = indent5Style;
      break;
    case "ql-indent-6":
      style = indent6Style;
      break;
    case "ql-indent-7":
      style = indent7Style;
      break;
    case "ql-indent-8":
      style = indent8Style;
      break;
    default:
      style = {};
  }
  if (current.classList.contains(className)) {
    current.classList.remove(className);
    doStyle(current, style);
  }
};

const doStyle = (current: Element, whatStyle: React.CSSProperties) => {
  Object.keys(whatStyle).forEach((k) => {
    (current as HTMLElement).style[k as never] = whatStyle[k as never];
  });
};

const walkDOM = (current: Element) => {
  if (current.tagName === "OL") {
    (current as HTMLElement).style.paddingLeft = "1em";
  }
  if (current.tagName === "UL") {
    (current as HTMLElement).style.paddingLeft = "1em";
  }
  if (current.tagName === "LI") {
    (current as HTMLElement).style.fontFamily =
      "Spoqa Han Sans Neo, sans-serif";
    (current as HTMLElement).style.fontWeight = "400";
    (current as HTMLElement).style.marginLeft = "1.5em";
  }
  if (current.tagName === "P") {
    (current as HTMLElement).style.lineHeight = "1.5em";
    (current as HTMLElement).style.margin = "0";
    (current as HTMLElement).style.fontFamily =
      "Spoqa Han Sans Neo, sans-serif";
    (current as HTMLElement).style.fontWeight = "400";
  }
  if (current.tagName === "A") {
    if (!(current as HTMLElement).style.color)
      (current as HTMLElement).style.color = "#1c7ed6";
    (current as HTMLElement).style.textDecoration = "underline";
    (current as HTMLElement).style.fontFamily =
      "Spoqa Han Sans Neo, sans-serif";
  }

  if (current.tagName === "SPAN") {
    (current as HTMLElement).style.lineHeight = "1.5em";
    (current as HTMLElement).style.margin = "0";
    (current as HTMLElement).style.fontFamily =
      "Spoqa Han Sans Neo, sans-serif";
    (current as HTMLElement).style.fontWeight = "400";
  }

  if (current.tagName === "H1") {
    const h = current as HTMLElement;
    h.style.margin = "0";
    h.style.fontWeight = "500";
    h.style.lineHeight = "1.5em";
  }
  if (current.tagName === "H2") {
    const h = current as HTMLElement;
    h.style.margin = "0";
    h.style.fontWeight = "500";
    h.style.lineHeight = "1.5em";
  }
  if (current.tagName === "H3") {
    const h = current as HTMLElement;
    h.style.margin = "0";
    h.style.fontWeight = "500";
    h.style.lineHeight = "1.5em";
  }

  doClass(current, "fitple-strong");
  doClass(current, "fitple-blockquote");
  doClass(current, "ql-align-center");
  doClass(current, "ql-align-right");
  doClass(current, "ql-indent-1");
  doClass(current, "ql-indent-2");
  doClass(current, "ql-indent-3");
  doClass(current, "ql-indent-4");
  doClass(current, "ql-indent-5");
  doClass(current, "ql-indent-6");
  doClass(current, "ql-indent-7");
  doClass(current, "ql-indent-8");

  // 자식 노드에 대하여 수행
  for (let i = 0; i < current.children.length; i++) {
    walkDOM(current.children[i]);
  }
};

const convertToEmailTags = (tags: string) => {
  const parent = document.createElement("div");
  parent.style.fontFamily = "Spoqa Han Sans Neo, sans-serif";
  parent.style.fontSize = "1rem";
  parent.style.lineHeight = "28px";
  parent.style.boxSizing = "border-box";
  parent.style.color = "#333333";
  parent.style.width = "100%";
  parent.style.maxWidth = "600px";
  parent.innerHTML = tags;

  for (let i = 0; i < parent.children.length; i++) {
    walkDOM(parent.children[i]);
  }
  return parent.outerHTML;
};

export default () => {
  const Strong = Quill.import("blots/inline");
  class BoldBlot extends Strong {}
  BoldBlot.blotName = "bold";
  BoldBlot.tagName = "strong";
  BoldBlot.className = "fitple-strong";
  // blockquote
  const BlockQuote = Quill.import("blots/block");
  class BlockQuoteBlot extends BlockQuote {}
  BlockQuoteBlot.blotName = "blockquote";
  BlockQuoteBlot.tagName = "blockquote";
  BlockQuoteBlot.className = "fitple-blockquote";

  // 에디터에 렌더링되는 img 태그에 width 속성 추가 허용

  Quill.register(BoldBlot, true);
  Quill.register(BlockQuoteBlot, true);
  Quill.register("modules/imageUploader", ImageUploader);
  Quill.register("modules/imageResize", ImageResize, true);
};

export { convertToEmailTags };
