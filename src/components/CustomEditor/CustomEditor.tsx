"use client";

import React, {
  Dispatch,
  LegacyRef,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css"; // Default styling for React Quill
import Script from "next/script";
import "./style.css";
import { useAppDispatch } from "@/redux/hooks";
import { setContent } from "@/redux/slices/admin/StudyFormSlice";
interface Pros {
  content: string;
  // setContent: Dispatch<SetStateAction<string>>
}
// Dynamically import ReactQuill to avoid SSR issues with Quill
const ReactQuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    const component = ({ fowardRef, ...props }: ReactQuillWrapperProps) => {
      return <RQ ref={fowardRef} {...props} />;
    };
    return component;
  },
  { ssr: false }
);

interface ReactQuillWrapperProps extends ReactQuillProps {
  fowardRef: LegacyRef<ReactQuill>;
}

const CustomEditor = ({ content }: Pros) => {
  //   const [content, setcontent] = useState("");
  const dispatch = useAppDispatch();
  const editorRef = useRef(null);
  const [init, setInit] = useState<boolean>(false);
  const cloudinaryRef = useRef<any>(null); // Define type as 'any' for Cloudinary widget
  const handleChangeContent = async (e) => {
    console.log(e);
    dispatch(setContent(e));
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('initial');
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dlfsdepfc',
          uploadPreset: 'devArena',
          folder: 'study',
          clientAllowedFormats: ['image'],
          maxImageFileSize: 2000000,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            const quill = editorRef.current;
            const range = quill?.getEditorSelection();
            console.log(range);

            if (quill && range) {
              quill
                .getEditor()
                .insertEmbed(range.index, 'image', result.info.secure_url); // Insert image URL in editor
            }
          }
        }
      );
      cloudinaryRef.current = myWidget; // Store widget reference
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(timeoutId); // Clean up timeout
    };
  }, []);

  const imageHandler = useCallback(() => {
    if (cloudinaryRef.current) {
      console.log("image handler");
      cloudinaryRef.current.open(); // Open Cloudinary widget when image is clicked
    }
  }, []);

  return (
    <div>
      {/* <Script
        src="https://upload-widget.cloudinary.com/latest/global/all.js"
        onLoad={() => {
          console.log("Cloudinary Widget Script Loaded");
          setInit(true);
        }}
      /> */}
      {/* <h2>Custom Editor</h2> */}
      <ReactQuillWrapper
        fowardRef={editorRef}
        theme="snow"
        content={content}
        onChange={handleChangeContent}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, false] }], // Headers
              ["bold", "italic", "underline", "strike"], // Inline styles
              [{ list: "ordered" }, { list: "bullet" }], // Lists
              ["link", "image"], // Links and images
            ],
            handlers: {
              image: imageHandler, // Add image handler
            },
          },
        }}
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "list",
          "link",
          "image",
        ]}
      />

      <p>Editor Output:</p>
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>{content}</div>
    </div>
  );
};

export default CustomEditor;
