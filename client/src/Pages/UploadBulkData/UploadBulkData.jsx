import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import * as XLSX from "xlsx"; // Library for Excel file parsing

const UploadBulkData = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [file, setFile] = useState(null);
  const [dataArray, setDataArray] = useState([]);
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
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setErrors([]);
  };

  // Parse CSV file
  const parseCSV = () => {
    if (!file) {
      setErrors(["Please upload a CSV file."]);
      return;
    }

    Papa.parse(file, {
      header: isHeaderSkipped,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length) {
          setErrors(result.errors.map((err) => `Row ${err.row}: ${err.message}`));
        } else {
          const data = result.data.map((row) => ({
            ...row,
            createdAt: new Date().toISOString(),
            
            deletedAt: new Date().toISOString(),
          }));
          setDataArray(data);
          setErrors([]);
        }
      },
    });
  };

  // Parse JSON file
  const parseJSON = () => {
    if (!file) {
      setErrors(["Please upload a JSON file."]);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedData = JSON.parse(reader.result);
        const data = parsedData.map((item) => ({
          ...item,
          createdAt: new Date().toISOString(),
          deletedAt: null,
        }));
        setDataArray(data);
        setErrors([]);
      } catch (error) {
        setErrors(["Failed to parse JSON file."]);
      }
    };
    reader.readAsText(file);
  };

  // Parse Excel file
  const parseExcel = () => {
    if (!file) {
      setErrors(["Please upload an Excel file."]);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const workbook = XLSX.read(reader.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const data = jsonData.map((row) => ({
        ...row,
        createdAt: new Date().toISOString(),
        deletedAt: null,
      }));
      setDataArray(data);
      setErrors([]);
    };
    reader.readAsBinaryString(file);
  };

  // Upload data
  const uploadData = async () => {
    if (!selectedOption) {
      setErrors(["Please select an option (Items, Process, Bill of Material, or Process Step)."]);
      return;
    }

    if (!dataArray.length) {
      setErrors(["No valid data found. Please upload and parse a valid file."]);
      return;
    }

    try {
      for (const record of dataArray) {
        const response = await axios.post(apiEndpoints[selectedOption], record, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Record uploaded:", response.data);
      }
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
        <h2 className="text-lg font-bold mb-4">Upload File</h2>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex justify-center items-center mb-4"
          onDrop={(e) => {
            e.preventDefault();
            setFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {file ? (
            <p className="text-gray-500">{file.name}</p>
          ) : (
            <p className="text-gray-400">Drag and drop files here or click below</p>
          )}
        </div>
        <input
          type="file"
          accept=".csv,.json,.xlsx"
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
            onClick={() => setFile(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => {
              if (file.name.endsWith(".csv")) {
                parseCSV();
              } else if (file.name.endsWith(".json")) {
                parseJSON();
              } else if (file.name.endsWith(".xlsx")) {
                parseExcel();
              }
            }}
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
      {dataArray.length > 0 && (
        <div className="mt-6 w-96 bg-gray-100 text-gray-800 p-4 rounded-md">
          <h3 className="font-bold mb-2">Parsed Data:</h3>
          <pre className="text-sm">{JSON.stringify(dataArray, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadBulkData;
