import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Select from "react-select";

Modal.setAppElement("#root");

const ItemMaster = () => {
  const [items, setItems] = useState([]);
  const [formItem, setFormItem] = useState(null);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({}); // State for error messages

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
      console.error("Error fetching items:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setFormItem({ ...formItem, [key]: value });
    setErrors({ ...errors, [key]: "" }); // Clear error when user changes value
  };

  const handleAdditionalChange = (key, value) => {
    setFormItem({
      ...formItem,
      additional_attributes: {
        ...formItem.additional_attributes,
        [key]: value,
      },
    });
    setErrors({ ...errors, [key]: "" }); // Clear error when user changes value
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
  
    // Initialize errors object
    let validationErrors = {};
  
    // Validate mandatory fields
    if (!formItem.internal_item_name) {
      validationErrors.internal_item_name = "Internal Item Name is required!";
    }
    if (!formItem.tenant_id) {
      validationErrors.tenant_id = "Tenant ID is required!";
    }
    if (!formItem.item_description) {
      validationErrors.item_description = "Item Description is required!";
    }
    if (!formItem.uom) {
      validationErrors.uom = "UOM is required!";
    }
    if (!formItem.type) {
      validationErrors.type = "Item Type is required!";
    }
  
    // Validate min_buffer and max_buffer constraints
    const minBuffer = Number(formItem.min_buffer);
    const maxBuffer = Number(formItem.max_buffer);
  
    if (minBuffer < 0 || maxBuffer < 0) {
      validationErrors.max_buffer = "Min Buffer and Max Buffer must be greater than or equal to zero!";
    }
  
    if (minBuffer > maxBuffer) {
      validationErrors.max_buffer = "Min Buffer cannot be greater than Max Buffer!";
    }
  
    // Check for duplicate item names (excluding the item being edited)
    const duplicateItem = items.find(
      (item) => item.internal_item_name.toLowerCase() === formItem.internal_item_name.toLowerCase() && item.id !== formItem.id
    );
    if (duplicateItem) {
      validationErrors.internal_item_name = "An item with this name already exists!";
    }
  
    // If there are validation errors, update state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    // If item name is changed and it's a new item, show a warning
    if (!isEdit && formItem.internal_item_name !== "") {
      alert(`Item name has been changed to "${formItem.internal_item_name}"`);
    }
  
    // Perform API call for add or edit
    try {
      if (isEdit) {
        await axios.put(`${apiUrl}/${formItem.id}`, formItem);
      } else {
        await axios.post(apiUrl, formItem);
      }
      fetchItems();
      closeForm();
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const isEdit = !!formItem.id;

  //   // Initialize errors object
  //   let validationErrors = {};

  //   // Validate mandatory fields
  //   if (!formItem.internal_item_name) {
  //     validationErrors.internal_item_name = "Internal Item Name is required!";
  //   }
  //   if (!formItem.tenant_id) {
  //     validationErrors.tenant_id = "Tenant ID is required!";
  //   }
  //   if (!formItem.item_description) {
  //     validationErrors.item_description = "Item Description is required!";
  //   }
  //   if (!formItem.uom) {
  //     validationErrors.uom = "UOM is required!";
  //   }
  //   if (!formItem.type) {
  //     validationErrors.type = "Item Type is required!";
  //   }

  //   // Validate min_buffer and max_buffer constraints
  //   const minBuffer = Number(formItem.min_buffer);
  //   const maxBuffer = Number(formItem.max_buffer);

  //   if (minBuffer < 0 || maxBuffer < 0) {
  //     validationErrors.max_buffer = "Min Buffer and Max Buffer must be greater than or equal to zero!";
  //   }

  //   if (minBuffer > maxBuffer) {
  //     validationErrors.max_buffer = "Min Buffer cannot be greater than Max Buffer!";
  //   }

  //   // If there are validation errors, update state and return
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return;
  //   }

  //   // Perform API call for add or edit
  //   try {
  //     if (isEdit) {
  //       await axios.put(`${apiUrl}/${formItem.id}`, formItem);
  //     } else {
  //       await axios.post(apiUrl, formItem);
  //     }
  //     fetchItems();
  //     closeForm();
  //   } catch (error) {
  //     console.error("Error saving item:", error);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchItems();
    } catch (error) {
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
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.id}</td>
                  <td className="py-2">{item.internal_item_name}</td>
                  <td className="py-2">{item.type}</td>
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
              {/* Input fields */}
              {[ 
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
                  {errors[key] && (
                    <div className="text-red-500 text-sm mt-1">{errors[key]}</div>
                  )}
                </div>
              ))}

              <div className="mb-4 col-span-2">
                <label className="block text-sm font-bold">Type</label>
                <Select
                  options={typeOptions}
                  value={typeOptions.find((opt) => opt.value === formItem.type)}
                  onChange={(opt) => handleInputChange("type", opt.value)}
                />
                {errors.type && (
                  <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                )}
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
                    onChange={(e) => handleAdditionalChange(key, e.target.value)}
                  />
                  {errors[key] && (
                    <div className="text-red-500 text-sm mt-1">{errors[key]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded"
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
