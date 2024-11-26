import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";

Modal.setAppElement("#root"); // Set accessibility for the modal

const ItemMaster = () => {
  const [items, setItems] = useState([]);
  const [viewItem, setViewItem] = useState(null); // Item to display in the popup
  const [errorRows, setErrorRows] = useState([]); // Rows with validation errors
  const [search, setSearch] = useState("");

  const typeOptions = [
    { value: "sell", label: "Sell" },
    { value: "purchase", label: "Purchase" },
    { value: "component", label: "Component" },
  ];

  // Fetch items from API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("https://api-assignment.inveesync.in/items");
      const dataWithErrors = validateItems(response.data);
      setItems(dataWithErrors);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Validation logic
  const validateItems = (data) => {
    const errors = [];
    const validatedData = data.map((item) => {
      const hasError =
        !item.internal_item_name ||
        !item.uom ||
        !item.additional_attributes?.avg_weight_needed ||
        (["sell", "purchase"].includes(item.type) && !item.additional_attributes?.scrap_type);
      if (hasError) errors.push(item);
      return { ...item, hasError };
    });
    setErrorRows(errors);
    return validatedData;
  };

  // Open detailed view
  const openViewMore = (item) => setViewItem(item);

  // Close detailed view
  const closeViewMore = () => setViewItem(null);

  // Filter items based on search
  const filteredItems = items.filter((item) =>
    item.internal_item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex flex-1 min-h-[100vh] overflow-hidden">


        {/* Table Section */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-4">
            <input
              type="text"
              className="p-2 border border-gray-300 rounded w-full"
              placeholder="Search by item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-white shadow-md rounded p-4 h-full overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Item Name</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">UOM</th>
                  <th className="py-2">Avg Weight</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-b ${item.hasError ? "bg-red-50" : ""}`}
                  >
                    <td className="py-2">{item.internal_item_name}</td>
                    <td className="py-2">
                      <Select
                        options={typeOptions}
                        defaultValue={typeOptions.find((opt) => opt.value === item.type)}
                        className="w-40"
                        placeholder="Select Type"
                      />
                    </td>
                    <td className="py-2">{item.uom || <span className="text-red-500">Missing</span>}</td>
                    <td className="py-2">
                      {item.additional_attributes?.avg_weight_needed || (
                        <span className="text-red-500">Missing</span>
                      )}
                    </td>
                    <td className="py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openViewMore(item)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* View More Modal */}
      {viewItem && (
        <Modal
          isOpen={!!viewItem}
          onRequestClose={closeViewMore}
          className="bg-white rounded shadow-lg max-w-3xl mx-auto mt-20 p-6"
          overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
        >
          <h2 className="text-2xl font-bold mb-4">Item Details</h2>
          <p><strong>Name:</strong> {viewItem.internal_item_name}</p>
          <p><strong>Description:</strong> {viewItem.item_description}</p>
          <p><strong>Type:</strong> {viewItem.type}</p>
          <p><strong>UOM:</strong> {viewItem.uom}</p>
          <p><strong>Avg Weight Needed:</strong> {viewItem.additional_attributes.avg_weight_needed}</p>
          <p><strong>Scrap Type:</strong> {viewItem.additional_attributes.scrap_type}</p>
          <p><strong>Created At:</strong> {new Date(viewItem.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(viewItem.updatedAt).toLocaleString()}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
            onClick={closeViewMore}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ItemMaster;
