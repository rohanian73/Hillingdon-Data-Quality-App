import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CorrectionLog.css";

export default function CorrectionLog() {
  const location = useLocation();
  const { analysisData, highlightedFileData } = location.state || {};

  useEffect(() => {
    if (analysisData != null) {
      console.log(analysisData);

      // Inaccuracy
      let inaccurateErrors = analysisData.inaccurateErr;
      for (let i = 0; i < inaccurateErrors[1].length; i++) {
        if (inaccurateErrors[1][i] != 0) {
          document.getElementById("inaccuracy").innerHTML +=
            `<p><span style="font-weight: bold">${inaccurateErrors[0][i]}</span> column contains 
            <span style="font-weight: bold">${inaccurateErrors[1][i]}</span> inaccurate records.</p>`;
        }
      }
      if (document.getElementById("inaccuracy").innerHTML.length != 0) {
        document.getElementById("inaccurateTitle").style.display = "block";
      }

      // if (document.getElementById("inaccuracy").innerHTML.length == 0) {
      //   document.getElementById("inaccuracy").innerHTML =
      //     "No inaccurate records identified.";
      // }

      // Incompleteness
      let incompleteErrors = analysisData.incompleteErr;
      for (let i = 0; i < incompleteErrors[1].length; i++) {
        if (incompleteErrors[1][i] != 0) {
          document.getElementById("incompleteness").innerHTML +=
            `<p><span style="font-weight: bold">${incompleteErrors[0][i]}</span> column contains 
            <span style="font-weight: bold">${incompleteErrors[1][i]}</span> incomplete records.</p>`;
        }
      }
      if (document.getElementById("incompleteness").innerHTML.length != 0) {
        document.getElementById("incompleteTitle").style.display = "block";
      }

      // Inconsistency
      let inconsistErrors = analysisData.inconsistErr;
      for (let i = 0; i < inconsistErrors[1].length; i++) {
        if (inconsistErrors[1][i] != 0) {
          document.getElementById("inconsistency").innerHTML +=
            `<p><span style="font-weight: bold">${inconsistErrors[0][i]}</span> column contains
            <span style="font-weight: bold">${inconsistErrors[1][i]}</span> inconsistent records.</p>`;
        }
      }
      if (document.getElementById("inconsistency").innerHTML.length != 0) {
        document.getElementById("inconsistTitle").style.display = "block";
      }

      // Duplication
      let duplicateErrors = analysisData.duplicateErr;
      if (duplicateErrors != 0) {
        document.getElementById("duplicateTitle").style.display = "block";
        document.getElementById("duplication").innerHTML +=
          `<p><span style="font-weight: bold">${duplicateErrors}</span> row is duplicate.</p>`;
      }

      // No DQ Errors Identified
      if (
        duplicateErrors == 0 &&
        document.getElementById("inconsistency").innerHTML.length == 0 &&
        document.getElementById("incompleteness").innerHTML.length == 0 &&
        document.getElementById("inaccuracy").innerHTML.length == 0
      ) {
        document.getElementById("noErrors").innerHTML =
          "No data quality errors were identified in the provided dataset.";
        document.getElementById("downloadFile").style.display = "none";
        document.getElementById("downloadBtn").style.display = "none";
      }
    }
  }, [analysisData]);

  const downloadHighlightedFile = () => {
    if (!highlightedFileData) return;
    const url = window.URL.createObjectURL(new Blob([highlightedFileData]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "highlighted_errors.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  const downloadCorrectedFile = async () => {
    await axios({
      method: "get",
      url: "http://localhost:8000/file3",
      responseType: "blob",
    }).then((correctedFile) => {
      console.log(correctedFile.data.type);
      if (correctedFile.data.type.includes("csv")) {
        const url = window.URL.createObjectURL(new Blob([correctedFile.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "corrected_errors.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const url = window.URL.createObjectURL(new Blob([correctedFile.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "corrected_errors.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    });
  };

  const navigate = useNavigate();
  const backToHome = () => {
    navigate("/");
  };

  return (
    <div className="correction-log-container">
      <div id="correctionLog">
        <h2 className="correction-log-title">Correction Log</h2>

        <p className="error-dimension" id="inaccurateTitle">
          Inaccuracy
        </p>
        <div className="error-details" id="inaccuracy"></div>
        <br></br>

        <p className="error-dimension" id="incompleteTitle">
          Incompleteness
        </p>
        <div className="error-details" id="incompleteness"></div>
        <br></br>

        <p className="error-dimension" id="inconsistTitle">
          Inconsistency
        </p>
        <div className="error-details" id="inconsistency"></div>
        <br></br>

        <p className="error-dimension" id="duplicateTitle">
          Duplication
        </p>
        <div className="error-details" id="duplication"></div>
        <br></br>

        <p className="no-errors" id="noErrors"></p>

        <div className="download-file" id="downloadFile">
          <p className="download-file-text">
            Download your file with highlighted errors:{" "}
          </p>
          <span
            className="download-file-link"
            onClick={downloadHighlightedFile}
          >
            highlighted_errors.xlsx
          </span>
        </div>

        <div className="buttons">
          <button
            className="download-btn"
            id="downloadBtn"
            onClick={downloadCorrectedFile}
          >
            Get Corrected File
          </button>
          <button className="return-btn" onClick={backToHome}>
            Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}
