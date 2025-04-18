import React from "react";

interface EclipseProps {
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

const Eclipse: React.FC<EclipseProps> = ({ className, color, style = {} }) => {
  return (
    <div
      style={{
        width: "312.77px",
        height: "312.77px",
        borderRadius: "50%",
        backgroundColor: color, // Add color here
        filter: "blur(140.13px)",
        ...style,
      }}
      className={className}
    ></div>
  );
};

export default Eclipse;
