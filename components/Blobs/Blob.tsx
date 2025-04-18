import React from "react";
import Eclipse from "./Eclipse";

interface BlobProps {
  className?: string;
  style?: React.CSSProperties;
}

const Blob: React.FC<BlobProps> = ({ className = "", style = {} }) => {
  return (
    <div
      style={{
        width: "787.64px",
        height: "787.64px",
        borderRadius: "50%",
        // backgroundColor: "rgba(255, 255, 255, 0.79)",
        // border: "1px solid #000",
        ...style, // spread the style prop here to allow overrides
      }}
      className={`flex justify-center items-center ${className}`}
    >
      <div
        style={{
          width: "441.62px",
          height: "469.15px",
          //   border: "1px solid #000",
        }}
        className="relative"
      >
        <Eclipse className="absolute top-0" color="#FFB03A" />
        <Eclipse className="absolute right-0 z-10" color="#DAF341" />
        <Eclipse className="absolute bottom-0 left-16" color="#FFAB2D" />
      </div>
    </div>
  );
};

export default Blob;
