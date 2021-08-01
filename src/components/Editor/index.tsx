import React, { useImperativeHandle, useState } from "react";
import cn from "classnames";
import dynamic from "next/dynamic";
import { useRef } from "react";

const QuillEditor = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <>...Loading</>,
});

export interface IContentProps {
  value: string;
  onChange: (v: string) => void;
  ref?: React.ForwardedRef<IEditor>;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "underline", "strike"],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [
      { align: [] },
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "clean"],
    ["image"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "align",
  "color",
  "background",
  "imageBlot",
  "width",
];

export interface IEditor {
  value: string;
  setValue: (str: string) => void;
}

interface IQuillProps {
  className?: string;
  placeholder?: string;
}

const Editor = React.forwardRef<IEditor, IQuillProps>(
  ({ placeholder, className }, ref) => {
    const inputRef = useRef<any>(null);
    const [value, setValue] = useState<string>("");

    useImperativeHandle(ref, () => {
      return {
        value,
        setValue,
      };
    });

    return (
      <QuillEditor
        className={className}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        value={value}
        onChange={(_, __, ___, editor) => {
          const html = editor.getHTML();
          setValue(html);
        }}
      />
    );
  }
);

export default Editor;
