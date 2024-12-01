import React, { useState, useEffect } from "react";
import TextInput from "../../Components/TextInput";
import SelectInput from "../../Components/SelectInput";
import Button from "../../Components/Button";
import { GoUpload } from "react-icons/go";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CheckedSelect from "../../Components/CheckedSelect";
import axios from "axios";
import Swal from "sweetalert2";
import { post, get } from "../../api";

const CreateCompliance = () => {
  const navigate = useNavigate();
  const [nature, setNature] = useState([]);
  const [states, setStates] = useState([]);
  const [fileName, setFileName] = useState('');
  const [selectOptions, setSelectOptions] = useState([]);
  const [compliance, setCompliance] = useState({
    natureOfCompliance: "",
    activity: "",
    typeOfAct: "",
    applicationLaborAct: "",
    dueDate: "",
    calendartype:"",
    section: "",
    score: "",
    nameOfForm: "",
    state: "",
    applicability: "",
    frequencyOfCompliance: "",
    priorityType: "",
    documentPdf: null,
  });

  useEffect(() => {
    const fetchNature = async () => {
      const response = await get('/natureofcompliance');
      setNature(response.data);
    };
    fetchNature();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      const response = await get('/states');
      setStates(response.data);
    };
    fetchStates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    Object.entries(compliance).forEach(([key, value]) => {
      if (key === "documentPdf" && value instanceof File) {
        // Append file to FormData
        formData.append("documentPdf", value);
      } else {
        formData.append(key, value);
      }
    });
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    try {
      const response = await post("/compliance", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Response:", response.data);
      Swal.fire({
        icon: "success",
        title: "Save!",
        text: "Compliance Save Successfully!",
      }).then(() => navigate("/compliancelist"));
    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Compliance record creation failed.",
      });
    }
  };
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompliance((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setCompliance((prev) => ({ ...prev, documentPdf: file }));
      setFileName(file.name);
    }
  };

  const handleCancel = () => {
    setCompliance({
      natureOfCompliance: "",
      activity: "",
      typeOfAct: "",
      applicationLaborAct: "",
      dueDate: "",
      calendartype:"",
      section: "",
      score: "",
      nameOfForm: "",
      state: "",
      applicability: "",
      frequencyOfCompliance: "",
      priorityType: "",
      documentPdf: null,
    });
    setFileName('');
    navigate("/compliancelist");
  };

  const handleSelectedOptions = (options) => {
    if (selectOptions.length > 0) {
      setSelectOptions("selectedOptions", JSON.stringify(selectOptions)); // Sending as JSON string
    }
  
  };

  return (
    <div className="h-full p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Create compliance</h2>
        <Link to="/compliancelist">
          <button className="w-36 py-1.5 bg-primary text-white rounded cursor-pointer flex items-center justify-center gap-2">
            <FaAngleLeft />
            <span>Back to List</span>
          </button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col gap-3">
            <SelectInput
              label="Nature of Compliance"
              name="natureOfCompliance"
              value={compliance.natureOfCompliance}
              required
              onChange={handleInputChange}
              options={[{ value: "", label: "Select the Nature of Compliance" }, ...nature.map((nat) => ({ value: nat.id, label: nat.nature }))]}
            />
            <SelectInput
              label="Type Of Act"
              name="typeOfAct"
              value={compliance.typeOfAct}
              onChange={handleInputChange}
              options={[{ value: "", label: "Select The Type Of Act" }, { value: "state", label: "State" }, { value: "central", label: "Central" }]}
            />
            <TextInput
              label="Name of Form"
              name="nameOfForm"
              value={compliance.nameOfForm}
              placeholder="Enter the name of form"
              onChange={handleInputChange}
            />
            <TextInput
              label="Applicable Labor Act"
              name="applicationLaborAct"
              value={compliance.applicationLaborAct}
              placeholder="Enter The applicable law"
              onChange={handleInputChange}
            />
            <div className="flex flex-col mb-3 relative">
  <label className="block font-semibold mb-2">Priority Type</label>
  <CheckedSelect
    selectedOptions={selectOptions}
    setSelectedOptions={(options) => {
      setSelectOptions(options); // Directly update state with selected options
      setCompliance((prev) => ({
        ...prev,
        priorityType: JSON.stringify(options), // Save options as a JSON string in the compliance state
      }));
    }}
  />
</div>

            <TextInput
              label="Due Date"
              name="dueDate"
              value={compliance.dueDate}
              placeholder="Enter the due date"
              onChange={handleInputChange}
            />
            <SelectInput
              label="Calendar Type"
              name="calendartype"
              value={compliance.calendartype}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select Calendar Type" },
                { value: "Financial year", label: "Financial year - apr to mar" },
                { value: "Calendar year", label: "Calendar year - jan to dec" },
              ]}
            />
            
          </div>
          <div className="flex flex-col gap-3">
            <TextInput
              label="Activity"
              name="activity"
              value={compliance.activity}
              placeholder="Enter the activity"
              onChange={handleInputChange}
            />
            <div className="mb-3">
              <label className="block mb-2 font-semibold">State</label>
              <select
                name="state"
                value={compliance.state}
                onChange={handleInputChange}
                className={`${compliance.typeOfAct === "central" ? 'bg-white cursor-not-allowed' : 'bg-selectbg'} w-full p-2 border border-bordergray rounded`}
                disabled={compliance.typeOfAct === "central"}
              >
                <option>Select the State</option>
                {states.map((state) => (
                  
                  <option key={state.id} value={state.id}>{state.statename}</option>
                ))}
              </select>
            </div>
            <TextInput
              label="Section"
              name="section"
              value={compliance.section}
              placeholder="Enter the section"
              onChange={handleInputChange}
            />
            <TextInput
              label="Applicability"
              name="applicability"
              value={compliance.applicability}
              placeholder="Enter the applicability"
              onChange={handleInputChange}
            />
            <SelectInput
              label="Score"
              name="score"
              value={compliance.score}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select Score" },
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
                { value: 6, label: "6" },
                { value: 7, label: "7" },
                { value: 8, label: "8" },
                { value: 9, label: "9" },
                { value: 10, label: "10" },
              ]}
            />
            <SelectInput
              label="Frequency of Compliance"
              name="frequencyOfCompliance"
              value={compliance.frequencyOfCompliance}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Select frequency of compliance" },
                { value: "Monthly", label: "Monthly" },
                { value: "Bi-Monthly", label: "Bi-Monthly" },
                { value: "Quarterly", label: "Quarterly" },
                { value: "Half-Yearly", label: "Half-Yearly" },
                { value: "Annual", label: "Annual" },
                { value: "Bi-Annual", label: "Bi-Annual" },
                { value: "3 Year Once", label: "3 Year Once" },
                { value: "5 Year Once", label: "5 Year Once" },
              ]}
            />
            <div className="mb-2">
              <label className="block mb-2 font-semibold">Upload Document</label>
              <label
                htmlFor="documentPdf"
                className="bg-primary text-white w-36 relative px-4 py-2 flex gap-3 justify-center items-center rounded cursor-pointer"
              >
                {compliance.documentPdf ? (
                  <span>
                    <IoDocumentTextOutline size={22} />
                  </span>
                ) : (
                  <span>
                    <GoUpload size={22} />
                  </span>
                )}
                {compliance.documentPdf ? (
                  <span>{fileName.slice(0, 9)}...{fileName.slice(-4)}</span>
                ) : (
                  <span className="font-semibold">Upload</span>
                )}
                <input
                  id="documentPdf"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
          </div>
        </div>
        <div className="flex justify-center items-center gap-5">
          <Button
            label="Cancel"
            onClick={handleCancel}
            className="bg-white border border-gray-800"
          />
          <Button
            label="Save"
            type="submit"
            className="text-white bg-primary border border-primary"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCompliance;
