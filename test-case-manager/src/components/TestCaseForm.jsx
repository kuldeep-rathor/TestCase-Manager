import { useState, useEffect } from "react";

const initialState = {
  testCaseId: "",
  description: "",
  preRequisite: "",
  steps: "",
  expectedResult: "",
  priority: "Medium",
  automationStatus: "No",
  module: "",
};

export default function TestCaseForm({ onSave, selected }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setForm(initialState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded p-6 mb-4 space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Add / Edit Test Case</h2>

      {[
        { label: "Test Case ID", name: "testCaseId" },
        { label: "Module", name: "module" },
        { label: "Pre-Requisite", name: "preRequisite", type: "textarea" },
        { label: "Scenario", name: "description", type: "textarea" },
        { label: "Steps", name: "steps", type: "textarea" },
        { label: "Expected Result", name: "expectedResult", type: "textarea" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block font-medium mb-1">{field.label}</label>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
            />
          ) : (
            <input
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          )}
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Automation Status</label>
          <select
            name="automationStatus"
            value={form.automationStatus}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
  );
}
