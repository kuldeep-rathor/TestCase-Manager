import { useState, useEffect } from "react";
import TestCaseForm from "./components/TestCaseForm";
import TestCaseList from "./components/TestCaseList";
import {
  createTestCase,
  updateTestCase,
  getTestCases,
} from "./api/testCaseAPI";

function App() {
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [moduleFilter, setModuleFilter] = useState("");

  const fetchData = async () => {
    const res = await getTestCases(moduleFilter);
    setTestCases(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [moduleFilter]);

  const handleSave = async (data) => {
    if (data._id) {
      await updateTestCase(data._id, data);
    } else {
      await createTestCase(data);
    }
    setSelectedTestCase(null);
    fetchData(); // Fetch updated data after save
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Test Case Manager
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TestCaseForm onSave={handleSave} selected={selectedTestCase} />
          <TestCaseList
            onEdit={setSelectedTestCase}
            testCases={testCases}
            moduleFilter={moduleFilter}
            setModuleFilter={setModuleFilter}
            onRefresh={fetchData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
