import React from 'react'

const RightSidebar = () => {
  return (
    <div className="bg-white shadow-lg p-4">
    <h2 className="text-lg font-bold mb-4">Pending Setup</h2>
    <div className="border-b pb-4 mb-4">
      <p className="font-bold">Steel Pipe Grade A</p>
      <p className="text-gray-500 text-sm">Missing UoM</p>
      <button className="text-blue-500 mt-2">Resolve Now →</button>
    </div>
    <div>
      <p className="font-bold">Assembly X23</p>
      <p className="text-gray-500 text-sm">Incomplete components</p>
      <button className="text-blue-500 mt-2">Resolve Now →</button>
    </div>
  </div>
  )
}

export default RightSidebar