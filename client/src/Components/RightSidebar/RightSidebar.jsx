import React, { useState } from "react";

const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility on small screens

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <div className="lg:hidden p-4 bg-blue-500 text-white text-center">
        <button
          className="text-lg font-bold"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close Sidebar ✖" : "Open Sidebar ☰"}
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:block bg-white shadow-lg p-4 transition-all duration-300`}
      >
        <h2 className="text-lg font-bold mb-4">Pending Setup</h2>

        <div className="border-b pb-4 mb-4">
          <p className="font-bold">Steel Pipe Grade A</p>
          <p className="text-gray-500 text-sm">Missing UoM</p>
          <button className="text-blue-500 mt-2">Resolve Now →</button>
        </div>

        <div>
          <p className="font-bold">Assembly X23</p>
          <p className="text-gray-500 text-sm">Incomplete components</p>
          <button className="text-blue-500 mt-2">Resolve Now →</button>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
