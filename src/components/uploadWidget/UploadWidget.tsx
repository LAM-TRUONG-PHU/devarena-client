"use client";
import Script from "next/script";
import React, { useEffect } from "react";

const UploadWidget = () => {
  const initWidget = () => {
    // Kiểm tra xem window.cloudinary đã tồn tại
    //@ts-ignore
    if (window.cloudinary) {
          //@ts-ignore

      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: "dlfsdepfc",
          uploadPreset: "devArena",
          folder: "study",
          clientAllowedFormats: ["image"],
          maxImageFileSize: 2000000,
          theme: "purple",
              maxImageWidth: 200, //Scales the image down to a width of 2000 pixels before uploading
        },
            //@ts-ignore

        (error, result) => {
          if (!error && result && result.event === "success") {
            console.log("Done! Here is the image info: ", result.info);
            document
              .getElementById("uploadedimage")
              ?.setAttribute("src", result.info.secure_url);
          }
        }
      );

      myWidget.open(); // Mở widget
    }
  };

  return (
    <div>
      <button onClick={initWidget} className="cloudinary-button">
        Upload Image
      </button>
      <Script
        src="https://upload-widget.cloudinary.com/latest/global/all.js"
        onLoad={() => console.log("Cloudinary Widget Script Loaded")}
      />
    </div>
  );
};

export default UploadWidget;
