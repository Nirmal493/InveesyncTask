import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { FaInfoCircle } from "react-icons/fa";

const Processes = () => {
  const [rows, setRows] = useState([
    {
      process_name: null,
      factory_id: null,
      tenant_id: null,
      type: "internal",
      created_by: "user3",
      last_updated_by: "user3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      errors: [],
    },
  ]);

  const [dropdownOptions, setDropdownOptions] = useState({
    process_names: [
      { value: "Packaging", label: "Packaging" },
      { value: "Assembly", label: "Assembly" },
    ],
    factories: [
      { value: 15, label: "Factory A" },
      { value: 16, label: "Factory B" },
    ],
    tenants: [
      { value: 123, label: "Tenant X" },
      { value: 124, label: "Tenant Y" },
    ],
  });

  const validateRow = (row) => {
    const errors = [];
    if (!row.process_name) errors.push("Process name is required.");
    if (!row.tenant_id) errors.push("Tenant is required.");
    if (!row.factory_id && row.type === "transfer") errors.push("Factory ID is required for transfer type.");
    return errors;
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        process_name: null,
        factory_id: null,
        tenant_id: null,
        type: "internal",
        created_by: "user3",
        last_updated_by: "user3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        errors: [],
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleResetRow = (index) => {
    const updatedRows = [...rows];
    updatedRows[index] = {
      process_name: null,
      factory_id: null,
      tenant_id: null,
      type: "internal",
      created_by: "user3",
      last_updated_by: "user3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      errors: [],
    };
    setRows(updatedRows);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    updatedRows[index].errors = validateRow(updatedRows[index]);
    setRows(updatedRows);
  };

  const handleSave = async () => {
    for (const row of rows) {
      const errors = validateRow(row);
      if (errors.length > 0) {
        setRows((prevRows) =>
          prevRows.map((r) =>
            r === row ? { ...r, errors } : r
          )
        );
        return;
      }
    }

    try {
      const response = await axios.post("https://api-assignment.inveesync.in/process", rows);
      alert("Processes saved successfully!");
    } catch (error) {
      console.error("Error saving processes:", error);
      alert("Failed to save processes.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Process Manager</h2>
      <p className="text-gray-600 mb-6">
        Manage processes with proper validations and configurations.
      </p>

      {rows.map((row, index) => (
        <div
          key={index}
          className={`p-4 mb-4 border rounded-md ${
            row.errors.length > 0 ? "border-red-500" : "border-gray-300"
          }`}
        >
          <div className="grid grid-cols-4 gap-4">
            {/* Process Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Process Name
                <FaInfoCircle className="inline ml-1 text-gray-400" title="Select a process name." />
              </label>
              <Select
                options={dropdownOptions.process_names}
                value={dropdownOptions.process_names.find((opt) => opt.value === row.process_name)}
                onChange={(selected) => handleChange(index, "process_name", selected?.value)}
                placeholder="Select process"
              />
            </div>

            {/* Tenant */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tenant
                <FaInfoCircle className="inline ml-1 text-gray-400" title="Select a tenant." />
              </label>
              <Select
                options={dropdownOptions.tenants}
                value={dropdownOptions.tenants.find((opt) => opt.value === row.tenant_id)}
                onChange={(selected) => handleChange(index, "tenant_id", selected?.value)}
                placeholder="Select tenant"
              />
            </div>

            {/* Factory */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Factory
                <FaInfoCircle className="inline ml-1 text-gray-400" title="Select a factory." />
              </label>
              <Select
                options={dropdownOptions.factories}
                value={dropdownOptions.factories.find((opt) => opt.value === row.factory_id)}
                onChange={(selected) => handleChange(index, "factory_id", selected?.value)}
                placeholder="Select factory"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={row.type}
                onChange={(e) => handleChange(index, "type", e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="internal">Internal</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </div>

          {row.errors.length > 0 && (
            <div className="mt-2 text-red-600 text-sm">
              {row.errors.map((error, i) => (
                <div key={i}>{error}</div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handleResetRow(index)}
              className="text-gray-600 hover:underline"
            >
              Reset
            </button>
            <button
              onClick={() => handleRemoveRow(index)}
              className="text-red-600 hover:underline"
            >
              Remove Row
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddRow}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        + Add Row
      </button>

      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Save Processes
      </button>
    </div>
  );
};

export default Processes;
