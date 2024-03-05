import React, { useState } from 'react';
import * as XLSX from 'xlsx';
//import {postRequest} from './use'

const ExcelReader = () => {
  const [rowData, setRowData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });  



      // Assuming 'AccountNo' and 'consumerID' are the headers of the columns
      const drawDate = data[0].indexOf('Draw Date');
      const game = data[0].indexOf('Lotto Game');
      const winningnumbers = data[0].indexOf('Winning Numbers');
      const last5numbers = data[0].indexOf('5 Last Numbers');
      const events = data[0].indexOf('Event');

      if (drawDate !== -1 && game !== -1 && winningnumbers !== -1 && last5numbers !== -1 && events !== -1 ) {
        const rows = data.slice(1).map(row => ({
          drawDate: row[drawDate],
          game: row[game],
          winningnumbers: row[winningnumbers],
          last5numbers: row[last5numbers],
          events: row[events],                
        }));
        
        setRowData(rows);
        
        console.log(JSON.stringify({rows})); // Output the values of both columns for each row
      } else {
        console.error("Columns 'AccountNo' or 'consumerID' not found in the Excel file.");
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls, .csv" />
      <h3>JSON Data:</h3>
    {rowData && rowData.map((row, index) => (
      <pre key={index}>{JSON.stringify(row)}</pre>
    ))}
    </div>
  );
};

export default ExcelReader;
