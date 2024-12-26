import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  ChakraProvider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Box,
} from "@chakra-ui/react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Results = () => {
  const [studentsData, setStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const parsedData = json.slice(9).map((row) => ({
          student: row[2],
          sgpa: row[10],
          cgpa: row[11],
          allBacklog: row[13],
        }));

        setStudentsData(parsedData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const filteredStudents = studentsData.filter((student) =>
    student.allBacklog?.toString().includes(searchTerm)
  );

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <ChakraProvider>
      <Navbar/>
      <Sidebar/>
      <Box padding="20px">
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".xlsx, .xls"
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />

        

        {studentsData.length > 0 && (
          <Input
            placeholder="Search by All Backlog (e.g., 0)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            marginTop="20px"
            marginBottom="20px"
            size="md"
          />
        )}

        {/* Display filtered data */}
        {filteredStudents.length > 0 ? (
          <Box id="print-section" marginTop="20px">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Student</Th>
                  <Th>SGPA</Th>
                  <Th>CGPA</Th>
                  <Th>All Backlog</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredStudents.map((student, index) => (
                  <Tr key={index}>
                    <Td>{student.student}</Td>
                    <Td>{student.sgpa}</Td>
                    <Td>{student.cgpa}</Td>
                    <Td>{student.allBacklog}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box
            marginTop="20px"
            textAlign="center"
            padding="20px"
            backgroundColor="#f0f4f8"
            borderRadius="8px"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
          >
            Please upload a Excel file to view the results.
          </Box>
        )}
      </Box>

      {/* Print and Back Buttons */}
      <div
        style={{
          backgroundColor: "#f0f4f8",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <button
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={handleBack}
        >
          Back
        </button>

        <button
          style={{
            backgroundColor: "#28A745",
            color: "white",
            padding: "10px 20px",
            fontSize: "16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handlePrint}
        >
          Print
        </button>
      </div>

      <Footer />
    </ChakraProvider>
  );
};

export default Results;
