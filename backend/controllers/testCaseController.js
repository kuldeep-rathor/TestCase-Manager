const TestCase = require("../models/TestCase");
const ExcelJS = require("exceljs");

// Download test cases as Excel
exports.downloadTestCasesExcel = async (req, res) => {
  try {
    const { module } = req.query;
    const query = module
      ? { module: { $regex: `^${module}`, $options: "i" } }
      : {};

    // Get test cases with optional filtering
    const testCases = await TestCase.find(query).sort({ createdAt: -1 });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Test Cases");

    // Define columns based on your TestCase model structure
    worksheet.columns = [
      { header: "Test Case ID", key: "testCaseId", width: 15 },
      { header: "Module", key: "module", width: 20 },
      { header: "Description", key: "description", width: 40 },
      { header: "Pre-Requisite", key: "preRequisite", width: 30 },
      { header: "Steps", key: "steps", width: 50 },
      { header: "Expected Result", key: "expectedResult", width: 40 },
      { header: "Priority", key: "priority", width: 10 },
      { header: "Automation Status", key: "automationStatus", width: 15 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
    ];

    // Add rows
    testCases.forEach((testCase) => {
      worksheet.addRow({
        testCaseId: testCase.testCaseId,
        module: testCase.module,
        description: testCase.description,
        preRequisite: testCase.preRequisite,
        steps: testCase.steps,
        expectedResult: testCase.expectedResult,
        priority: testCase.priority,
        automationStatus: testCase.automationStatus,
        createdAt: testCase.createdAt,
        updatedAt: testCase.updatedAt,
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=test-cases.xlsx"
    );

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new test case
exports.createTestCase = async (req, res) => {
  try {
    const testCase = new TestCase(req.body);
    const savedTestCase = await testCase.save();
    res.status(201).json(savedTestCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all test cases (filtered by module with case-insensitive partial matching)
exports.getTestCases = async (req, res) => {
  try {
    const { module } = req.query;
    const query = module
      ? { module: { $regex: `^${module}`, $options: "i" } }
      : {};
    const testCases = await TestCase.find(query).sort({ createdAt: -1 });
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single test case by ID
exports.getTestCaseById = async (req, res) => {
  try {
    const testCase = await TestCase.findById(req.params.id);
    if (!testCase)
      return res.status(404).json({ error: "Test case not found" });
    res.json(testCase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a test case
exports.updateTestCase = async (req, res) => {
  try {
    const updated = await TestCase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Test case not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a test case
exports.deleteTestCase = async (req, res) => {
  try {
    const deleted = await TestCase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Test case not found" });
    res.json({ message: "Test case deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
