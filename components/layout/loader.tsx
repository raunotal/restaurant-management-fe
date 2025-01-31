import React from "react";

export default function Loader() {
  return (
    <>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-1 animate-fade-in" />
      <div className="flex justify-center items-center h-screen relative z-1">
        <div className="rounded-full h-20 w-20 bg-indigo-600 animate-ping"></div>
      </div>
    </>
  );
}
