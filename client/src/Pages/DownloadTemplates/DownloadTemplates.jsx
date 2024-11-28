import React from "react";

import axios from "axios";

 

// Helper function to convert JSON to CSV

const jsonToCsv = (data) => {

  if (!data || data.length === 0) return "";

 

  const headers = Object.keys(data[0]).join(","); // Create headers

  const rows = data.map((row) =>

    Object.values(row)

      .map((value) => `"${value}"`) // Wrap each value in quotes

      .join(",")

  ); // Map JSON values to rows

 

  return [headers, ...rows].join("\n"); // Combine headers and rows

};

 

const DownloadTemplates = () => {

  const downloadCsv = async (apiUrl, fileName) => {

    try {

      const response = await axios.get(apiUrl);

      const csvData = jsonToCsv(response.data);

 

      if (csvData) {

        // Create a Blob for CSV file and trigger download

        const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");

        const url = URL.createObjectURL(blob);

 

        link.href = url;

        link.setAttribute("download", `${fileName}.csv`);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

      } else {

        alert("No data available for download!");

      }

    } catch (error) {

      console.error("Error fetching data:", error);

      alert("Failed to fetch data. Please try again!");

    }

  };

 

  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">

      <h1 className="text-2xl font-bold mb-6">Download Data as CSV</h1>

 

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Download Item CSV */}

        <button

          className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:bg-blue-600"

          onClick={() =>

            downloadCsv("https://api-assignment.inveesync.in/items", "items")

          }

        >

          Download Items CSV

        </button>

 

        {/* Download BOM CSV */}

        <button

          className="bg-green-500 text-white px-6 py-3 rounded shadow hover:bg-green-600"

          onClick={() =>

            downloadCsv("https://api-assignment.inveesync.in/bom", "bom")

          }

        >

          Download BOM CSV

        </button>

 

        {/* Download Process CSV */}

        <button

          className="bg-yellow-500 text-white px-6 py-3 rounded shadow hover:bg-yellow-600"

          onClick={() =>

            downloadCsv("https://api-assignment.inveesync.in/process", "process")

          }

        >

          Download Process CSV

        </button>

 

        {/* Download Process Step CSV */}

        <button

          className="bg-red-500 text-white px-6 py-3 rounded shadow hover:bg-red-600"

          onClick={() =>

            downloadCsv(

              "https://api-assignment.inveesync.in/process-step",

              "process-step"

            )

          }

        >

          Download Process Step CSV

        </button>

      </div>

    </div>

  );

};

 

export default DownloadTemplates;