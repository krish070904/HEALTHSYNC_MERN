import React from "react";

const ImagePreview = ({ image }) => {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Image Preview</h2>
      <img
        src={image}
        alt="preview"
        className="w-full rounded-md border"
      />
    </div>
  );
};

export default ImagePreview;
