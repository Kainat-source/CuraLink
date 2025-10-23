import React from "react";
import LeftSide from "./LeftSide";
import Center from "./Center";
import RightSide from "./RightSide";

const Main = () => {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        marginTop: "64px",
        overflow: "hidden", // ✅ hide internal scrolls
      }}
    >
      {/* Left Side */}
      <div
        style={{
          flex: "0 0 20%",
          borderRight: "1px solid #e0e0e0",
          background: "#fff",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <LeftSide />
      </div>

      {/* Center (✅ this scrolls normally, scrollbar on far right) */}
      <div
        style={{
          flex: "1",
          background: "#fff",
          padding: "10px 20px",
          boxSizing: "border-box",
          overflowY: "visible", // ✅ allows page scroll
        }}
      >
        <Center />
      </div>

      {/* Right Side */}
      <div
        style={{
          flex: "0 0 20%",
          borderLeft: "1px solid #e0e0e0",
          background: "#fff",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
      >
        <RightSide />
      </div>
    </div>
  );
};

export default Main;
