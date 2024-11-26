
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const UploadBulkData = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isHeaderSkipped, setIsHeaderSkipped] = useState(false);

  const apiEndpoints = {
    items: "https://api-assignment.inveesync.in/items",
    process: "https://api-assignment.inveesync.in/process",
    "bill of material": "https://api-assignment.inveesync.in/bom",
    "process-step": "https://api-assignment.inveesync.in/process-step",
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCsvFile(file);
    setErrors([]);
  };

  // Parse CSV file
  const parseCSV = () => {
    if (!csvFile) {
      setErrors(["Please upload a CSV file."]);
      return;
    }

    Papa.parse(csvFile, {
      header: isHeaderSkipped,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          setErrors(result.errors.map((err) => `Row ${err.row}: ${err.message}`));
        } else {
          setJsonData(result.data);
          setErrors([]);
        }
      },
    });
  };

  // Upload data
  const uploadData = async () => {
    if (!selectedOption) {
      setErrors(["Please select an option (Items, Process, Bill of Material, or Process Step)."]);
      return;
    }

    if (!jsonData.length) {
      setErrors(["No valid data found. Please upload and parse a valid CSV file."]);
      return;
    }

    try {
      const response = await axios.post(apiEndpoints[selectedOption], jsonData, {
        headers: { "Content-Type": "application/json" },
      });
      alert(`Data uploaded successfully!`);
    } catch (error) {
      setErrors([error.response?.data?.message || "An error occurred while uploading data."]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Bulk Data Upload</h1>

      {/* Options */}
      <div className="mb-6">
        {["items", "process", "bill of material", "process-step"].map((option) => (
          <button
            key={option}
            onClick={() => setSelectedOption(option)}
            className={`px-4 py-2 mx-2 text-white rounded-md ${
              selectedOption === option ? "bg-blue-600" : "bg-blue-400"
            } hover:bg-blue-500`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 shadow rounded-md w-96">
        <h2 className="text-lg font-bold mb-4">Upload CSV</h2>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex justify-center items-center mb-4"
          onDrop={(e) => {
            e.preventDefault();
            setCsvFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {csvFile ? (
            <p className="text-gray-500">{csvFile.name}</p>
          ) : (
            <p className="text-gray-400">Drag and drop files here or click below</p>
          )}
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mb-4"
        />
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={isHeaderSkipped}
            onChange={() => setIsHeaderSkipped(!isHeaderSkipped)}
          />
          <span>Skip header row</span>
        </label>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            onClick={() => setCsvFile(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={parseCSV}
          >
            Parse
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={uploadData}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-6 w-96 bg-red-100 text-red-600 p-4 rounded-md">
          <h3 className="font-bold mb-2">Errors:</h3>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Parsed Data */}
      {jsonData.length > 0 && (
        <div className="mt-6 w-96 bg-gray-100 text-gray-800 p-4 rounded-md">
          <h3 className="font-bold mb-2">Parsed Data:</h3>
          <pre className="text-sm">{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadBulkData;
