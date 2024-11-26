import React, { useState, useEffect } from "react";
import axios from "axios";

const ProcessSteps = () => {
  const [steps, setSteps] = useState([]);
  const [errors, setErrors] = useState([]);
  const baseUrl = "https://api-assignment.inveesync.in/";

  // Fetch process steps
  const fetchSteps = async () => {
    try {
      const response = await axios.get(`${baseUrl}/process-step`);
      setSteps(response.data.map((step) => ({ ...step, errors: [] })));
    } catch (error) {
      console.error("Error fetching process steps:", error);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  // Validate a row
  const validateRow = (step, allSteps) => {
    const rowErrors = [];

    if (!step.process_id) rowErrors.push("Process ID is required.");
    if (!step.item_id) rowErrors.push("Item ID is required.");
    if (!step.sequence) rowErrors.push("Sequence is required.");
    if (step.conversion_ratio == null) rowErrors.push("Conversion ratio is required.");
    if (step.conversion_ratio < 0 || step.conversion_ratio > 100) rowErrors.push("Conversion ratio must be between 0 and 100.");
    if (step.conversion_ratio < 30) rowErrors.push("Conversion ratio is less than 30. Please verify.");
    if (!step.Process_description) rowErrors.push("Process description is required.");

    // Check for duplicate `item_id + sequence`
    const duplicate = allSteps.find(
      (s) =>
        s.item_id === step.item_id &&
        s.sequence === step.sequence &&
        s.id !== step.id
    );
    if (duplicate) rowErrors.push("Duplicate item_id and sequence combination.");

    return rowErrors;
  };

  // Add a new row
  const addRow = () => {
    setSteps([
      ...steps,
      {
        id: null,
        item_id: null,
        process_id: null,
        sequence: null,
        conversion_ratio: null,
        Process_description: "",
        created_by: "user3",
        last_updated_by: "user3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        errors: [],
      },
    ]);
  };

  // Remove a row
  const removeRow = async (id) => {
    if (id) {
      try {
        await axios.delete(`${baseUrl}/process-step/${id}`);
        alert("Process step deleted successfully.");
      } catch (error) {
        console.error("Error deleting process step:", error);
        alert("Failed to delete process step.");
      }
    }
    setSteps(steps.filter((step) => step.id !== id));
  };

  // Save a row (Create or Update)
  const saveRow = async (step) => {
    const rowErrors = validateRow(step, steps);
    if (rowErrors.length > 0) {
      setSteps((prevSteps) =>
        prevSteps.map((s) => (s === step ? { ...s, errors: rowErrors } : s))
      );
      return;
    }

    try {
      if (step.id) {
        // Update existing row
        await axios.put(`${baseUrl}/process-step/${step.id}`, step);
        alert("Process step updated successfully.");
      } else {
        // Create new row
        const response = await axios.post(`${baseUrl}/process-step`, step);
        setSteps((prevSteps) =>
          prevSteps.map((s) =>
            s === step ? { ...response.data, errors: [] } : s
          )
        );
        alert("Process step created successfully.");
      }
    } catch (error) {
      console.error("Error saving process step:", error);
      alert("Failed to save process step.");
    }
  };

  // Handle field change
  const handleChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    updatedSteps[index].errors = validateRow(updatedSteps[index], updatedSteps);
    setSteps(updatedSteps);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Process Steps Management</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        onClick={addRow}
      >
        + Add Step
      </button>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`p-4 mb-4 border rounded-md ${
            step.errors.length > 0 ? "border-red-500" : "border-gray-300"
          }`}
        >
          <div className="grid grid-cols-5 gap-4">
            {/* Process ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Process ID</label>
              <input
                type="number"
                value={step.process_id || ""}
                onChange={(e) => handleChange(index, "process_id", +e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Item ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Item ID</label>
              <input
                type="number"
                value={step.item_id || ""}
                onChange={(e) => handleChange(index, "item_id", +e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sequence */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Sequence</label>
              <input
                type="number"
                value={step.sequence || ""}
                onChange={(e) => handleChange(index, "sequence", +e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Conversion Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Conversion Ratio</label>
              <input
                type="number"
                value={step.conversion_ratio || ""}
                onChange={(e) =>
                  handleChange(index, "conversion_ratio", +e.target.value)
                }
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Process Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={step.Process_description}
                onChange={(e) =>
                  handleChange(index, "Process_description", e.target.value)
                }
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {step.errors.length > 0 && (
            <div className="mt-2 text-red-600 text-sm">
              {step.errors.map((error, i) => (
                <div key={i}>{error}</div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => saveRow(step)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => removeRow(step.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessSteps;
