import React, { useEffect, useState } from "react";
import {
  deleteTestCase,
  uploadTestCasesFromExcel,
  // downloadTestCasesExcel,
} from "../api/testCaseAPI";

export default function TestCaseList({
  onEdit,
  testCases,
  moduleFilter,
  setModuleFilter,
  onRefresh,
}) {
  const [uniqueModules, setUniqueModules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of test cases per page
  const [activeTab, setActiveTab] = useState("testcases"); // "testcases" or "stats"
  const [moduleStats, setModuleStats] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    const modules = [...new Set(testCases.map((tc) => tc.module))];
    setUniqueModules(modules);
    setCurrentPage(1);

    // Calculate statistics for each module
    const stats = modules.map((module) => {
      const count = testCases.filter((tc) => tc.module === module).length;
      return { module, count };
    });

    // Sort by count (descending)
    stats.sort((a, b) => b.count - a.count);
    setModuleStats(stats);
  }, [testCases, moduleFilter]);

  const handleDelete = async (id) => {
    await deleteTestCase(id);
    onRefresh(); // Use the refresh function from props
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadError(null);

    try {
      await uploadTestCasesFromExcel(formData);
      onRefresh(); // Refresh list after upload
    } catch (err) {
      setUploadError(err.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // const handleExcelDownload = () => {
  //   // Pass the current module filter to download only filtered data if a module is selected
  //   downloadTestCasesExcel(moduleFilter);
  // };

  // Filter test cases based on selected module
  const filteredTestCases = moduleFilter
    ? testCases.filter((tc) => tc.module === moduleFilter)
    : testCases;

  // Get current test cases for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTestCases = filteredTestCases.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredTestCases.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Total test cases count
  const totalTestCases = testCases.length;

  return (
    <div className="mt-6">
      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "testcases"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("testcases")}
        >
          Test Cases
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "stats"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        <div className="mb-0 mx-auto flex items-center">
          <div>
            <label className="block mb-2 ml-8 font-medium text-gray-700">
              Upload Test Cases (Excel):
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="block w-full ml-8 border px-3 py-2 rounded"
            />
            {uploading && <p className="text-blue-500 mt-1">Uploading...</p>}
            {uploadError && <p className="text-red-500 mt-1">{uploadError}</p>}
          </div>
        </div>
      </div>
      {/* <div className="m-2 flex justify-end gap-4">
        <button
          onClick={handleExcelDownload}
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded"
        >
          Download Excel
        </button>
      </div> */}

      {activeTab === "testcases" ? (
        // Test Cases View
        <>
          <div className="mb-4">
            <select
              className="border rounded px-3 py-2 w-full"
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
            >
              <option value="">All Modules</option>
              {uniqueModules.map((module) => (
                <option key={module} value={module}>
                  {module}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {currentTestCases.length > 0 ? (
              currentTestCases.map((tc) => (
                <div
                  key={tc._id}
                  className="border rounded p-4 shadow-sm bg-white"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-blue-700">{tc.testCaseId}</h3>
                    <span className="text-sm text-gray-500">
                      Module: {tc.module}
                    </span>
                  </div>
                  <p>
                    <strong>Pre-Requisite:</strong> {tc.preRequisite}
                  </p>
                  <p>
                    <strong>Scenario:</strong> {tc.description}
                  </p>
                  <p>
                    <strong>Steps:</strong> {tc.steps}
                  </p>
                  <p>
                    <strong>Expected Result:</strong> {tc.expectedResult}
                  </p>
                  <p>
                    <strong>Priority:</strong> {tc.priority}
                  </p>
                  <p>
                    <strong>Automation:</strong> {tc.automationStatus}
                  </p>

                  <div className="mt-3 space-x-2">
                    <button
                      onClick={() => onEdit(tc)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tc._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No test cases found
              </div>
            )}
          </div>

          {filteredTestCases.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredTestCases.length)} of{" "}
                {filteredTestCases.length} test cases
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {[...Array(totalPages).keys()].map((number) => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === number + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Stats View
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Test Case Statistics</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Case Count
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {moduleStats.map((stat, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.count}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {totalTestCases > 0
                        ? `${Math.round((stat.count / totalTestCases) * 100)}%`
                        : "0%"}
                    </td> */}
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {totalTestCases}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    100%
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
