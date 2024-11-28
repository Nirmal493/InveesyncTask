import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const ItemMaster = () => {
  const [items, setItems] = useState([]);
  const [formItem, setFormItem] = useState(null);
  const [search, setSearch] = useState("");

  const typeOptions = [
    { value: "sell", label: "Sell" },
    { value: "purchase", label: "Purchase" },
    { value: "component", label: "Component" },
  ];

  const apiUrl = "https://api-assignment.inveesync.in/items";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(apiUrl);
      setItems(response.data);
    } catch (error) {
      toast.error("Error fetching items!");
      console.error("Error fetching items:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setFormItem({ ...formItem, [key]: value });
  };

  const handleAdditionalChange = (key, value) => {
    setFormItem({
      ...formItem,
      additional_attributes: {
        ...formItem.additional_attributes,
        [key]: value,
      },
    });
  };

  const openForm = (item = null) => {
    setFormItem(
      item || {
        internal_item_name: "",
        tenant_id: "",
        item_description: "",
        uom: "",
        created_by: "",
        last_updated_by: "",
        type: "",
        max_buffer: "",
        min_buffer: "",
        customer_item_name: "",
        is_deleted: false,
        additional_attributes: {
          drawing_revision_number: "",
          drawing_revision_date: "",
          avg_weight_needed: "",
          scrap_type: "",
          shelf_floor_alternate_name: "",
        },
      }
    );
  };

  const closeForm = () => setFormItem(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!formItem.id;

    try {
      if (
        !formItem.internal_item_name ||
        !formItem.tenant_id ||
        !formItem.item_description ||
        !formItem.uom ||
        !formItem.type ||
        !formItem.additional_attributes.avg_weight_needed
      ) {
        toast.error("All mandatory fields must be filled!");
        return;
      }

      if (isEdit) {
        await axios.put(`${apiUrl}/${formItem.id}`, formItem);
        toast.success("Item updated successfully!");
      } else {
        await axios.post(apiUrl, formItem);
        toast.success("Item added successfully!");
      }

      fetchItems();
      closeForm();
    } catch (error) {
      toast.error("Error saving item!");
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      toast.success("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      toast.error("Error deleting item!");
      console.error("Error deleting item:", error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.internal_item_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex justify-between items-center p-6 bg-gray-200">
        <h1 className="text-2xl font-bold">Items Master</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => openForm()}
        >
          Add Item
        </button>
      </div>

      <div className="flex-1 p-6">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded w-full mb-4"
          placeholder="Search by item name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white shadow-md rounded p-4 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Item id</th>
                <th className="py-2">Item Name</th>
                <th className="py-2">Type</th>
                {/* <th className="py-2">Description</th> */}
                {/* <th className="py-2">UOM</th> */}
                {/* <th className="py-2">Max Buffer</th> */}
                {/* <th className="py-2">Min Buffer</th> */}
                {/* <th className="py-2">Customer Name</th> */}
                {/* <th className="py-2">Avg Weight</th> */}
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.id}</td>
                  <td className="py-2">{item.internal_item_name}</td>
                  <td className="py-2">{item.type}</td>
                  {/* <td className="py-2">{item.item_description}</td>
                  <td className="py-2">{item.uom}</td>
                  <td className="py-2">{item.max_buffer}</td>
                  <td className="py-2">{item.min_buffer}</td>
                  <td className="py-2">{item.customer_item_name}</td>
                  <td className="py-2">
                    {item.additional_attributes?.avg_weight_needed || "N/A"}
                  </td> */}
                  <td className="py-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => openForm(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {formItem && (
        <Modal
          isOpen={!!formItem}
          onRequestClose={closeForm}
          className="bg-white rounded shadow-lg max-w-3xl mx-auto mt-20 p-6"
          overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
        >
          <h2 className="text-2xl font-bold mb-4">
            {formItem.id ? "Edit Item" : "Add Item"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {/* Add input fields */}
              {[
                 { label: "Item Id", key: "item_id" },
                { label: "Internal Item Name", key: "internal_item_name" },
                { label: "Tenant ID", key: "tenant_id" },
                { label: "Item Description", key: "item_description" },
                { label: "UOM", key: "uom" },
                { label: "Created By", key: "created_by" },
                { label: "Last Updated By", key: "last_updated_by" },
                { label: "Max Buffer", key: "max_buffer" },
                { label: "Min Buffer", key: "min_buffer" },
                { label: "Customer Item Name", key: "customer_item_name" },
              ].map(({ label, key }) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-bold">{label}</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded w-full"
                    value={formItem[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                </div>
              ))}

              <div className="mb-4 col-span-2">
                <label className="block text-sm font-bold">Type</label>
                <Select
                  options={typeOptions}
                  value={typeOptions.find((opt) => opt.value === formItem.type)}
                  onChange={(opt) => handleInputChange("type", opt.value)}
                />
              </div>

              {/* Additional Attributes */}
              {[
                { label: "Drawing Revision Number", key: "drawing_revision_number" },
                { label: "Drawing Revision Date", key: "drawing_revision_date" },
                { label: "Avg Weight Needed", key: "avg_weight_needed" },
                { label: "Scrap Type", key: "scrap_type" },
                { label: "Shelf/Floor Alternate Name", key: "shelf_floor_alternate_name" },
              ].map(({ label, key }) => (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-bold">{label}</label>
                  <input
                    type="text"
                    className="p-2 border border-gray-300 rounded w-full"
                    value={formItem.additional_attributes[key] || ""}
                    onChange={(e) =>
                      handleAdditionalChange(key, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={closeForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ItemMaster;
