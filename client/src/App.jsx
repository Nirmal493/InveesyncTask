import React from 'react'
import Home from './Pages/Home/Home'
import { Routes, Route } from "react-router-dom"
import ItemsMaster from './Pages/ItemsMaster/ItemsMaster'
import Sidebar from './Components/SideBar/Sidebar'
import RightSidebar from './Components/RightSidebar/RightSidebar'
import Processes from './Pages/Processes/Processes'
import BillOfMaterial from './Pages/BillOfMaterial/BillOfMaterial'
import ProcessSteps from './Pages/ProcessSteps/ProcessSteps'
import UploadBulkData from './Pages/UploadBulkData/UploadBulkData'
import ViewAuditLog from './Pages/ViewAuditLog/ViewAuditLog'
import DownloadTemplates from './Pages/DownloadTemplates/DownloadTemplates'
const App = () => {
  return (
    <div className='flex h-screen bg-gray-100 w-full'>
      <div className='w-[25%]'>
      <Sidebar/>
      </div>
      <div className='w-[50%]'>
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/items" element={<ItemsMaster/>} />
        <Route path="/processes" element={<Processes />} />
        <Route path="/bom" element={<BillOfMaterial />} />
        <Route path="/processsteps" element={<ProcessSteps />} />
        <Route path="/uploadbulkdata" element={<UploadBulkData/>} />
        <Route path="/download" elementdata={<DownloadTemplates/>} />
        <Route path="/viewauditlog" element={<ViewAuditLog/>} />
      </Routes>
      </div>
      
      <div className='w-[25%]'>
      <RightSidebar/>
      </div>
      

    </div>

  )
}

export default App