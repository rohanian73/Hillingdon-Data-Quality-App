import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "../DataProfiler.css";
import * as XLSX from "xlsx";

export default function DataProfiler() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file != null) {
      document.getElementById("fileLabel").style.transform = "translateX(-80%)";
      document.getElementById("fileBtn").style.transform = "translateX(80%)";
      document.getElementById("fileName").innerHTML = `File Name: ${file.name}`;
    }
  }, [file]);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    // console.log(formData);

    const analysis = await axios({
      method: "post",
      url: "http://localhost:8000/analyse_data",
      data: formData,
    });
    // .then((res) => {
    //   console.log(res);
    // })

    // console.log(analysis.data);

    const highlightedFile = await axios({
      method: "get",
      url: "http://localhost:8000/highlighted_file",
      responseType: "blob"
    });

    navigate("/correction_log", {
      state: {
        analysisData: analysis.data,
        highlightedFileData: highlightedFile.data,
      },
    });
  };

  return (
    <div class="container">
      <p className="instructions">
        Welcome to the Hillingdon Data Quality Enhancement System! Please upload
        a file that needs to be reviewed for the data quality issues.<br></br>
        <br></br>
        Your file needs to have one of those extensions: xlsx, csv.
        <br></br>
        <br></br>
        After submitting your file, you will be transferred to the correction
        log where the errors in your data will be shown in 4 data quality
        dimensions, such as Inaccuracy, Incompleteness, Inconsistency,
        Duplication. <br></br>
        <br></br>
        The system will generate 2 files that you will be able to upload:{" "}
        <br></br>
        <br></br>• a highlighted version of your file with all detected errors,{" "}
        <br></br>• a corrected version of your file.
      </p>

      <div className="fileName" id="fileName"></div>

      <form className="fileForm">
        <label for="fileUpload" id="fileLabel" className="fileLabel">
          <span>Choose File</span>
        </label>
        <input
          id="fileUpload"
          className="fileInput"
          type="file"
          accept=".csv, .xlsx"
          onChange={(event) => setFile(event.target.files[0])}
        />

        <button className="fileBtn" id="fileBtn" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}
