import React from "react";
import cn from "classnames";
import dynamic from "next/dynamic";
import initialize from "src/lib/react-quill";

const QuillEditor = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <>...Loading</>,
});

import { useRef } from "react";
import axios, { CancelTokenSource } from "axios";
import { useEffect, useMemo, useState, useImperativeHandle } from "react";
import {
  cancelRequest,
  createCancelToken,
  fileRequestConfig,
} from "src/lib/axios";

export interface IContentProps {
  value: string;
  onChange: (v: string) => void;
  ref?: React.ForwardedRef<IEditor>;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "underline", "strike", "blockquote"],
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
  readonly isImageUploading: boolean;
}

interface IQuillProps {
  value: string;
  onChange: (str: string) => void;
  placeholder?: string;
  ref?: React.ForwardedRef<IEditor>;
  disableMention?: boolean;
}

const Editor = React.forwardRef<IEditor, IQuillProps>(
  ({ placeholder, value, onChange, disableMention }, ref) => {
    // disableMention -> 공고 수정 상황에서 true (정확히는 email보낼 상황이 아닐 때). (2021/7/1 현재까지는)
    const [imageUploadingCount, setImageUploadingCount] = useState(0);

    const Quill = typeof window == "object" ? require("quill") : () => false;

    useImperativeHandle(
      ref,
      () => ({
        get isImageUploading(): boolean {
          return imageUploadingCount > 0;
        },
      }),
      [imageUploadingCount],
    );
    const cancelTokenRef = useRef<CancelTokenSource>(createCancelToken());

    useEffect(() => {
      initialize();
      const cancelToken = cancelTokenRef.current;
      return () => {
        if (cancelToken) cancelRequest(cancelToken);
      };
    }, []);

    const imageUploader = useMemo(() => {
      return {
        upload: (file: File) => {
          setImageUploadingCount((c) => c + 1);
          return new Promise((resolve, reject) => {
            if (!file.type.startsWith("image")) {
              alert("이미지 파일이 아닌 것 같습니다.");
              reject("Not a Image File");
              setImageUploadingCount((c) => c - 1);
              return;
            }
            const formData = new FormData();

            formData.append("editorImg", file);

            axios
              .post<any, { success: boolean; imageUrl: string }>(
                "/api/upload/img",
                formData,
                {
                  ...fileRequestConfig,
                  cancelToken: cancelTokenRef.current.token,
                },
              )
              .then((v) => {
                if (v.success) {
                  resolve(encodeURI(v.imageUrl));
                } else {
                  alert("이미지를 업로드할 수 없었습니다.");
                  reject("Upload failed");
                }
              })
              .catch((e) => {
                alert("이미지를 업로드할 수 없었습니다.");
                reject(e);
              })
              .finally(() => {
                setImageUploadingCount((c) => c - 1);
              });
          });
        },
      };
    }, [disableMention]);

    const withImageModule = useMemo(() => {
      return {
        ...modules,
        imageUploader,
        imageResize: {
          parchment: Quill.import("parchment"),
          modules: ["Resize", "DisplaySize"],
        },
      };
    }, [modules, imageUploader]);

    return (
      <>
        {imageUploadingCount !== 0 && (
          <div className="toast" key={`toast-${imageUploadingCount}`}>
            이미지 {imageUploadingCount}장 업로드 중...
          </div>
        )}
        <div
          className={cn("Quill", disableMention && "border-top")}
          onFocus={(e) => e.preventDefault()}
        >
          <QuillEditor
            modules={withImageModule}
            formats={formats}
            placeholder={placeholder}
            value={value || ""}
            onChange={(_, __, ___, editor) => {
              const html = editor.getHTML();
              onChange(html);
            }}
          />
        </div>
      </>
    );
  },
);

export default Editor;
