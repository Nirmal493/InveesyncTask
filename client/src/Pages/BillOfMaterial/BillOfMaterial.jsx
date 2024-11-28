import React, { useState, useEffect } from "react";
import axios from "axios";

const BillOfMaterial = () => {
  const [finalProduct, setFinalProduct] = useState("");
  const [components, setComponents] = useState([]);
  const [newComponent, setNewComponent] = useState({
    item_id: "",
    component_id: "",
    quantity: "",
    created_by: "user1",
    last_updated_by: "user2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [errors, setErrors] = useState([]);
  const [itemMasterIds, setItemMasterIds] = useState([]); // Store item IDs from Item Master
  const [isItemMasterLoaded, setIsItemMasterLoaded] = useState(false); // Check if Item Master is loaded

  const apiUrls = {
    bom: "https://api-assignment.inveesync.in/bom",
    items: "https://api-assignment.inveesync.in/items",
  };

  useEffect(() => {
    fetchComponents();
    fetchItemMasterIds();
  }, []);

  // Fetch BOM Components
  const fetchComponents = async () => {
    try {
      const response = await axios.get(apiUrls.bom);
      setComponents(response.data);
    } catch (error) {
      console.error("Error fetching BOM components:", error);
    }
  };

  // Fetch Item Master IDs
  const fetchItemMasterIds = async () => {
    try {
      const response = await axios.get(apiUrls.items);
      const ids = response.data.map((item) => item.id);
      setItemMasterIds(ids);
      setIsItemMasterLoaded(true); // Set the flag once the data is loaded
    } catch (error) {
      console.error("Error fetching item master data:", error);
    }
  };

  // Add New Component with Validation
  const handleAddComponent = () => {
    const { item_id, component_id, quantity, created_by, last_updated_by } = newComponent;
  
    const currentErrors = [];
  
    // Log item_id to verify it's correct and available
    console.log("Received Item ID:", item_id);
  
    if (!item_id) currentErrors.push("Item ID is required.");
  
    // Validate only after itemMasterIds is loaded
    if (isItemMasterLoaded) {
      // Log the itemMasterIds array to ensure it's populated
      console.log("Item Master IDs:", itemMasterIds);
  
      // Convert item_id to string and trim it, also convert each id in itemMasterIds to string
      const trimmedItemId = String(item_id).trim();
  
      // Check if the trimmed item_id exists in itemMasterIds
      if (!itemMasterIds.some((id) => String(id).trim() === trimmedItemId)) {
        currentErrors.push(`Invalid Item ID: ${trimmedItemId}.`);
      }
    }
  
    if (!component_id) currentErrors.push("Component ID is required.");
    if (!quantity || quantity <= 0) currentErrors.push("Quantity must be greater than zero.");
    if (!created_by) currentErrors.push("Created By is required.");
    if (!last_updated_by) currentErrors.push("Last Updated By is required.");
  
    if (currentErrors.length > 0) {
      setErrors(currentErrors);
      return;
    }
  
    // Add component
    setComponents([...components, newComponent]);
  
    // Reset newComponent state
    setNewComponent({
      item_id: "",
      component_id: "",
      quantity: "",
      created_by: "",
      last_updated_by: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  
    setErrors([]);
  };
  
  
  // Save BOM to API
  const handleSaveBOM = async () => {
    try {
      await axios.post(apiUrls.bom, {
        finalProduct,
        components,
      });
      fetchComponents();
      alert("BOM saved successfully!");
    } catch (error) {
      console.error("Error saving BOM:", error);
    }
  };

  // Delete Component from BOM
  const handleDeleteComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Bill of Materials Builder</h2>
        <p className="text-gray-500 mb-6 text-center">
          Define product composition and component relationships.
        </p>

        {/* Final Product Input */}
        <div className="mb-6">
          <label htmlFor="finalProduct" className="block text-sm font-medium text-gray-700">
            Select Final Product
          </label>
          <select
            id="finalProduct"
            value={finalProduct}
            onChange={(e) => setFinalProduct(e.target.value)}
            className="mt-2 p-2 border-gray-300 rounded-md w-full"
          >
            <option value="">Select Final Product</option>
            {/* Add dynamic options for final product */}
          </select>
        </div>

        {/* Components Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Components</h3>
          <table className="min-w-full border-collapse table-auto bg-white shadow-md rounded-md">
            <thead>
              <tr>
                <th className="border-b text-left px-4 py-2 font-semibold text-gray-700">Item ID</th>
                <th className="border-b text-left px-4 py-2 font-semibold text-gray-700">Component</th>
                <th className="border-b text-left px-4 py-2 font-semibold text-gray-700">Quantity</th>
                <th className="border-b text-left px-4 py-2 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {components.length > 0 ? (
                components.map((component, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border-b px-4 py-2">{component.item_id}</td>
                    <td className="border-b px-4 py-2">{component.component_id}</td>
                    <td className="border-b px-4 py-2">{component.quantity}</td>
                    <td className="border-b px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteComponent(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border-b text-center text-gray-500 py-4">
                    No components added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add New Component */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold">Add New Component</h4>
          {errors.length > 0 && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Item ID Input */}
            <input
              type="text"
              placeholder="Item ID"
              value={newComponent.item_id}
              onChange={(e) =>
                setNewComponent({ ...newComponent, item_id: e.target.value })
              }
              className="border-gray-300 rounded-md shadow-sm"
            />

            {/* Component ID Input */}
            <input
              type="text"
              placeholder="Component ID"
              value={newComponent.component_id}
              onChange={(e) =>
                setNewComponent({ ...newComponent, component_id: e.target.value })
              }
              className="border-gray-300 rounded-md shadow-sm"
            />

            {/* Quantity Input */}
            <input
              type="number"
              placeholder="Quantity"
              value={newComponent.quantity}
              onChange={(e) =>
                setNewComponent({ ...newComponent, quantity: e.target.value })
              }
              className="border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Created By Input */}
            <input
              type="text"
              placeholder="Created By"
              value={newComponent.created_by}
              onChange={(e) =>
                setNewComponent({ ...newComponent, created_by: e.target.value })
              }
              className="border-gray-300 rounded-md shadow-sm"
            />

            {/* Last Updated By Input */}
            <input
              type="text"
              placeholder="Last Updated By"
              value={newComponent.last_updated_by}
              onChange={(e) =>
                setNewComponent({ ...newComponent, last_updated_by: e.target.value })
              }
              className="border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleAddComponent}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Component
            </button>
            <button
              type="button"
              onClick={handleSaveBOM}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Save BOM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillOfMaterial;
