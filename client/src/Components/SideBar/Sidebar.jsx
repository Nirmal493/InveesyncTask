import React from 'react'
import { Link, useLocation } from "react-router-dom";


const Sidebar = () => {
    const location = useLocation();
    return (
        <div className="bg-white shadow-lg p-4">
            <h2 className="text-lg font-bold mb-4"><Link to="/">Inveesync</Link></h2>


            <ul className="space-y-2 bg-white p-4 rounded-md shadow-md border">
                <li
                    className={`flex items-center ${location.pathname === "/items" ? "text-blue-500 bg-blue-100" : "text-gray-400 hover:bg-gray-100"
                        } rounded-md p-2 transition`}
                >
                    <Link to="/items" className="flex-1">
                        Items Master
                    </Link>
                </li>
                <li
                    className={`flex items-center ${location.pathname === "/processes" ? "text-blue-500 bg-blue-100" : "text-gray-400 hover:bg-gray-100"
                        } rounded-md p-2 transition`}
                >
                    <span className="mr-2 text-blue-500">&#8226;</span>
                    <Link to="/processes" className="flex-1">
                        Processes
                    </Link>
                </li>
                <li
                    className={`flex items-center ${location.pathname === "/bom" ? "text-blue-500 bg-blue-100" : "text-gray-400 hover:bg-gray-100"
                        } rounded-md p-2 transition`}
                >
                    <span className="mr-2 text-blue-500">&#8226;</span>
                    <Link to="/bom" className="flex-1">
                        Bill of Materials
                    </Link>
                </li>
                <li
                    className={`flex items-center ${location.pathname === "/processsteps" ? "text-blue-500 bg-blue-100" : "text-gray-400 hover:bg-gray-100"
                        } rounded-md p-2 transition`}
                >
                    <span className="mr-2 text-blue-500">&#8226;</span>
                    <Link to="/processsteps" className="flex-1">
                        Process Steps
                    </Link>
                </li>
            </ul>






            <div className="mt-8 w-full">
                <h3 className="text-lg font-bold">Quick Actions</h3>
                <div className='w-full flex flex-col justify-center'>
                    <Link to="uploadbulkdata" className="w-full mt-2 bg-blue-500 text-white text-center py-2 rounded">
                        Upload Bulk Data
                    </Link>
                    <Link to="download" className="w-full mt-2 bg-gray-300 py-2 rounded text-center">
                        Download Templates
                    </Link>
                    <Link to="viewauditlog" className="w-full mt-2 bg-gray-300 py-2 rounded text-center">
                        View Audit Log
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Sidebar