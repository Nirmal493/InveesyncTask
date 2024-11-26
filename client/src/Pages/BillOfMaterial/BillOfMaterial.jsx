import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const BillOfMaterial = () => {
  const [finalProduct, setFinalProduct] = useState("");
  const [components, setComponents] = useState([]);
  const [newComponent, setNewComponent] = useState({
    component_id: null,
    quantity: "",
    uom: "",
  });
  const [errors, setErrors] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // Fetch existing components and dropdown options
  useEffect(() => {
    fetchComponents();
    fetchDropdownOptions();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await axios.get("https://api-assignment.inveesync.in/bom");
      setComponents(response.data);
    } catch (error) {
      console.error("Error fetching components:", error);
    }
  };

  const fetchDropdownOptions = async () => {
    // Simulate fetching dropdown options
    setDropdownOptions([
      { value: 1, label: "Component A" },
      { value: 2, label: "Component B" },
      { value: 3, label: "Component C" },
    ]);
  };

  // Add new component with validations
  const handleAddComponent = () => {
    const { component_id, quantity, uom } = newComponent;

    const currentErrors = [];
    if (!component_id) currentErrors.push("Component is required.");
    if (!quantity || quantity <= 0) currentErrors.push("Quantity must be greater than zero.");
    if (!uom) currentErrors.push("UOM is required.");
    if (uom === "Nos" && !Number.isInteger(Number(quantity)))
      currentErrors.push("For 'Nos', quantity must be an integer.");

    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      return;
    }

    setComponents([...components, newComponent]);
    setNewComponent({ component_id: null, quantity: "", uom: "" });
    setErrors([]);
  };

  // Save BOM to API
  const handleSaveBOM = async () => {
    try {
      await axios.post("https://api-assignment.inveesync.in/bom", {
        finalProduct,
        components,
      });
      fetchComponents();
      alert("BOM saved successfully!");
    } catch (error) {
      console.error("Error saving BOM:", error);
    }
  };

  // Delete component from list
  const handleDeleteComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-bold mb-4">Bill of Materials Builder</h2>
        <p className="text-gray-500 mb-6">
          Define product composition and component relationships.
        </p>

        {/* Final Product Input */}
        <div className="mb-6">
          <label htmlFor="finalProduct" className="block text-sm font-medium text-gray-700">
            Select Final Product
          </label>
          <Select
            options={dropdownOptions}
            value={dropdownOptions.find((option) => option.value === finalProduct)}
            onChange={(selected) => setFinalProduct(selected ? selected.value : "")}
            placeholder="Search or select final product"
            className="mt-1"
          />
        </div>

        {/* Components Table */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Components</h3>
          <table className="min-w-full border-collapse border border-gray-300 text-left">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Component</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">UOM</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.length > 0 ? (
                components.map((component, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">
                      {dropdownOptions.find((opt) => opt.value === component.component_id)?.label ||
                        "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{component.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">{component.uom}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteComponent(index)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                  >
                    No components added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Component */}
        <div className="mb-6">
          <h4 className="text-lg font-bold">Add New Component</h4>
          {errors.length > 0 && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <Select
              options={dropdownOptions}
              value={dropdownOptions.find((opt) => opt.value === newComponent.component_id)}
              onChange={(selected) =>
                setNewComponent({ ...newComponent, component_id: selected?.value || null })
              }
              placeholder="Search or select component"
              className="col-span-1"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newComponent.quantity}
              onChange={(e) =>
                setNewComponent({ ...newComponent, quantity: e.target.value })
              }
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 col-span-1"
            />
            <input
              type="text"
              placeholder="UOM"
              value={newComponent.uom}
              onChange={(e) =>
                setNewComponent({ ...newComponent, uom: e.target.value })
              }
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 col-span-1"
            />
          </div>
          <button
            type="button"
            onClick={handleAddComponent}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
          >
            + Add Component
          </button>
        </div>

        {/* Save Button */}
        <div>
          <button
            onClick={handleSaveBOM}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save Bill of Materials
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillOfMaterial;
