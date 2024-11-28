import React, { useState, useEffect } from "react";
import axios from "axios";

const MainBody = () => {
  const [activeTab, setActiveTab] = useState("Items Master");
  const [items, setItems] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [boms, setBoms] = useState([]);
  const [steps, setSteps] = useState([]);
  const [bomCount, setBomCount] = useState({ completed: 0, total: 0 });
  const [processCount, setProcessCount] = useState(0);

  const apiEndpoints = {
    items: "https://api-assignment.inveesync.in/items",
    process: "https://api-assignment.inveesync.in/process",
    bom: "https://api-assignment.inveesync.in/bom",
    steps: "https://api-assignment.inveesync.in/process-step",
  };

  const fetchData = async (tab) => {
    try {
      if (tab === "Items Master") {
        const response = await axios.get(apiEndpoints.items);
        setItems(response.data || []);
      } else if (tab === "Processes") {
        const response = await axios.get(apiEndpoints.process);
        setProcesses(response.data || []);
        setProcessCount(response.data.length);
      } else if (tab === "BOM") {
        const response = await axios.get(apiEndpoints.bom);
        setBoms(response.data || []);
        const completed = response.data.filter((bom) => bom.status === "Completed").length;
        setBomCount({ completed, total: response.data.length });
      } else if (tab === "Steps") {
        const response = await axios.get(apiEndpoints.steps);
        setSteps(response.data || []);
      }
    } catch (error) {
      console.error(`Failed to fetch ${tab} data:`, error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    fetchData(tab);
  };

  useEffect(() => {
    fetchData("Items Master");
  }, []);

  // Parallax effect handling
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const parallax = document.getElementById("parallax-bg");
    if (parallax) {
      parallax.style.backgroundPositionY = `${scrollY * 0.5}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white relative">
      {/* Parallax Background Image */}
      <div
        id="parallax-bg"
        className="absolute inset-0 bg-cover bg-center h-full"
        style={{
          backgroundImage: "url('https://your-image-url.jpg')",
          backgroundAttachment: "fixed",  // This creates the parallax effect
        }}
      ></div>

      {/* Content Area */}
      <div className="relative z-10">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Data Onboarding</h1>

        {/* Summary Counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
          <div className="bg-white shadow-md rounded p-4">
            <p className="text-lg font-bold">Processes</p>
            <p className="text-2xl sm:text-3xl">{processCount || "N/A"}</p>
          </div>
          <div className="bg-white shadow-md rounded p-4">
            <p className="text-lg font-bold">BOMs</p>
            <p className="text-2xl sm:text-3xl">
              {bomCount.completed}/{bomCount.total}
              <span className="block w-full bg-gray-300 h-2 rounded mt-2">
                <span
                  className="block bg-green-500 h-2 rounded"
                  style={{ width: `${(bomCount.completed / bomCount.total) * 100}%` }}
                ></span>
              </span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-md rounded p-4">
          <div className="flex flex-wrap space-x-4 sm:space-x-6 border-b pb-2">
            {["Items Master", "Processes", "BOM", "Steps"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`${
                  activeTab === tab
                    ? "text-blue-500 border-b-2 border-blue-500 font-bold"
                    : "text-gray-500"
                } text-sm sm:text-base`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Item Name</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">UOM</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeTab === "Items Master" &&
                  items.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2">{item.name || "N/A"}</td>
                      <td className="py-2">{item.type || "N/A"}</td>
                      <td className="py-2">{item.uom || "N/A"}</td>
                      <td className="py-2">
                        <span
                          className={`py-1 px-3 rounded ${
                            item.status === "Completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                {activeTab === "Processes" &&
                  processes.map((process, index) => (
                    <tr key={index}>
                      <td className="py-2">{process.name || "N/A"}</td>
                      <td className="py-2">{process.type || "N/A"}</td>
                      <td className="py-2">{process.uom || "N/A"}</td>
                      <td className="py-2">
                        <span
                          className={`py-1 px-3 rounded ${
                            process.status === "Completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {process.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                {activeTab === "BOM" &&
                  boms.map((bom, index) => (
                    <tr key={index}>
                      <td className="py-2">{bom.name || "N/A"}</td>
                      <td className="py-2">{bom.type || "N/A"}</td>
                      <td className="py-2">{bom.uom || "N/A"}</td>
                      <td className="py-2">
                        <span
                          className={`py-1 px-3 rounded ${
                            bom.status === "Completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {bom.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                {activeTab === "Steps" &&
                  steps.map((step, index) => (
                    <tr key={index}>
                      <td className="py-2">{step.name || "N/A"}</td>
                      <td className="py-2">{step.type || "N/A"}</td>
                      <td className="py-2">{step.uom || "N/A"}</td>
                      <td className="py-2">
                        <span
                          className={`py-1 px-3 rounded ${
                            step.status === "Completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {step.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBody;
