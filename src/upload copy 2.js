import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelReader = () => {
  const [rowData, setRowData] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const drawDateIndex = data[0].indexOf('Draw Date');
      const gameIndex = data[0].indexOf('Lotto Game');
      const winningNumbersIndex = data[0].indexOf('Winning Numbers');
      const last5NumbersIndex = data[0].indexOf('5 Last Numbers');
      const eventsIndex = data[0].indexOf('Event');

      if (
        drawDateIndex !== -1 &&
        gameIndex !== -1 &&
        winningNumbersIndex !== -1 &&
        last5NumbersIndex !== -1 &&
        eventsIndex !== -1
      ) {
        const rows = data.slice(1).map((row) => ({
          drawDate: row[drawDateIndex],
          game: row[gameIndex],
          winningNumbers: row[winningNumbersIndex],
          last5Numbers: row[last5NumbersIndex],
          events: row[eventsIndex],
        }));

        setRowData(rows);

        // Get the filename of the uploaded Excel file
        const filename = file.name;

        // Open the specific JSON file
        const response = await fetch("C:\\Users\\raryee\\reportpdfgenerator\\src\\data.json");
        const existingData = await response.json();
        console.log(existingData);

        // Append the parsed rows to the JSON file
        const newData = existingData.concat({[filename]:rows});

        // Write the new data back to the JSON file
        await fetch(`C:\\Users\\raryee\\reportpdfgenerator\\src\\data.json`, {
          method: 'PUT',
          body: JSON.stringify(newData),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log(JSON.stringify({'Row Data': newData})); // Output the combined data
      } else {
        console.error("One or more columns not found in the Excel file.");
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
