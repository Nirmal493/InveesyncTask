import React from 'react'
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4 text-center"><Link to="/">Inveesync</Link></h2>

      <ul className="space-y-4 bg-white p-4 rounded-md shadow-md">
        <li
          className={`flex items-center ${location.pathname === "/items" ? "text-blue-500 bg-blue-100" : "text-gray-600 hover:bg-gray-200"}
            rounded-md p-3 transition-colors duration-300`}
        >
          <Link to="/items" className="flex-1">
            Items Master
          </Link>
        </li>
        <li
          className={`flex items-center ${location.pathname === "/processes" ? "text-blue-500 bg-blue-100" : "text-gray-600 hover:bg-gray-200"}
            rounded-md p-3 transition-colors duration-300`}
        >
          <span className="mr-2">&#8226;</span>
          <Link to="/processes" className="flex-1">
            Processes
          </Link>
        </li>
        <li
          className={`flex items-center ${location.pathname === "/bom" ? "text-blue-500 bg-blue-100" : "text-gray-600 hover:bg-gray-200"}
            rounded-md p-3 transition-colors duration-300`}
        >
          <span className="mr-2">&#8226;</span>
          <Link to="/bom" className="flex-1">
            Bill of Materials
          </Link>
        </li>
        <li
          className={`flex items-center ${location.pathname === "/processsteps" ? "text-blue-500 bg-blue-100" : "text-gray-600 hover:bg-gray-200"}
            rounded-md p-3 transition-colors duration-300`}
        >
          <span className="mr-2">&#8226;</span>
          <Link to="/processsteps" className="flex-1">
            Process Steps
          </Link>
        </li>
      </ul>

      <div className="mt-8">
        <h3 className="text-lg font-bold">Quick Actions</h3>
        <div className='w-full flex flex-col'>
          <Link to="uploadbulkdata" className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded transition duration-300">
            Upload Bulk Data
          </Link>
          <Link to="downloadTemplates" className="w-full mt-2 bg-gray-300 hover:bg-gray-400 py-3 rounded text-center transition duration-300">
            Download Templates
          </Link>
          <Link to="viewauditlog" className="w-full mt-2 bg-gray-300 hover:bg-gray-400 py-3 rounded text-center transition duration-300">
            View Audit Log
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
