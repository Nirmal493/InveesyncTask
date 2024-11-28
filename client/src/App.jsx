import React from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from './Components/SideBar/Sidebar';
import RightSidebar from './Components/RightSidebar/RightSidebar';
import Home from './Pages/Home/Home';
import ItemsMaster from './Pages/ItemsMaster/ItemsMaster';
import Processes from './Pages/Processes/Processes';
import BillOfMaterial from './Pages/BillOfMaterial/BillOfMaterial';
import ProcessSteps from './Pages/ProcessSteps/ProcessSteps';
import UploadBulkData from './Pages/UploadBulkData/UploadBulkData';
import ViewAuditLog from './Pages/ViewAuditLog/ViewAuditLog';
import DownloadTemplates from './Pages/DownloadTemplates/DownloadTemplates';

const App = () => {
  return (
    <div className='flex flex-col lg:flex-row h-screen bg-gray-100'>
      
      {/* Sidebar */}
      <div className='lg:w-[25%] w-full'>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='lg:w-[50%] w-full overflow-auto'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<ItemsMaster />} />
          <Route path="/processes" element={<Processes />} />
          <Route path="/bom" element={<BillOfMaterial />} />
          <Route path="/processsteps" element={<ProcessSteps />} />
          <Route path="/uploadbulkdata" element={<UploadBulkData />} />
          <Route path="/downloadTemplates" element={<DownloadTemplates />} />
          <Route path="/viewauditlog" element={<ViewAuditLog />} />
        </Routes>
      </div>

      {/* Right Sidebar */}
      <div className='lg:w-[25%] w-full'>
        <RightSidebar />
      </div>

    </div>
  );
}

export default App;
