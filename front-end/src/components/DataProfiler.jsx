import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "../DataProfiler.css";
import * as XLSX from "xlsx";

export default function DataProfiler() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (file != null) {
      console.log(file);
      console.log(file.name);

      // document.getElementById("fileDetails").innerHTML = `
      // <div>File Name: ${file.name}</div>
      // <div>Size: ${file.size} bytes</div>
      // <div>Last Modified Date: ${file.lastModifiedDate}</div>
      // `;

      // document.getElementById("fileBtn").style.opacity = "1";
      // document.getElementById("fileBtn").style.display = "block";

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

    console.log(formData);

    const analysis = await axios({
      method: "post",
      url: "http://localhost:8000/file",
      data: formData,
    });
    // .then((res) => {
    //   console.log(res);
    // })

    console.log(analysis.data);

    const highlightedFile = await axios({
      method: "post",
      url: "http://localhost:8000/file2",
      data: formData,
      responseType: "blob",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // .then((res) => {
    //   console.log(res);
    // });

    // const url = window.URL.createObjectURL(new Blob([highlightedFile.data]));
    // const link = document.createElement("a");
    // link.href = url;
    // link.setAttribute("download", "highlighted_errors.xlsx");
    // document.body.appendChild(link);
    // link.click();
    // link.remove();

    navigate("/correction_log", {
      state: {
        analysisData: analysis.data,
        highlightedFileData: highlightedFile.data,
      },
    });
  };

  // const columns = res.data.columns;
  // const fixedRows = res.data.fixed_rows;

  // let fileColumns = columns.join(",");
  // let fileRows = fixedRows.map((row) =>
  //   columns
  //     .map((col) => {
  //       let value = row[col] ?? "";

  //       value = String(value).replace(/"/g, '""');

  //       if (
  //         value.includes(",") ||
  //         value.includes("\n") ||
  //         value.includes('"')
  //       ) {
  //         value = `"${value}"`;
  //       }

  //       return value;
  //     })
  //     .join(","),
  // );

  // let csvString = [fileColumns, ...fileRows].join("\n");

  // let file = new File([csvString], 'data.csv', { type: 'text/csv;charset=utf-8;' });
  // let url = URL.createObjectURL(file);
  // let a = document.createElement('a');
  // a.setAttribute('download', file.name);
  // a.href = url;
  // a.click();

  // const fileName = file.name;
  // const fileNameWithoutExt = fileName.substring(0, fileName.indexOf("."));

  // const worksheet = XLSX.utils.aoa_to_sheet([columns, ...fixedRows]);

  // const workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workbook, worksheet, "Cleaned Data");

  // XLSX.writeFile(workbook, `${fileNameWithoutExt}_corrected.xlsx`);

  // let rowsHTML = "";

  // for (let i = 0; i < fixedRows.length; i++) {
  //   rowsHTML += `<p>${fixedRows[i]}</p>`;
  // }

  // let nameInd = 0;

  // for (let i = 0; i < columns.length; i++) {
  //   if (columns[i].toLowerCase().includes("name")) {
  //     nameInd = i;
  //   }
  // }

  // console.log(nameInd);

  // let names = [];
  // for (let j = 0; j < rows.length; j++) {
  //   names.push(rows[j][nameInd])
  // }
  // console.log(names);

  // let nullValuesHTML = "";
  // let nullValuesList = res.data.resultNull;

  // for (let i = 0; i < nullValuesList[0].length; i++) {
  //   if (nullValuesList[1][i] != 0) {
  //     nullValuesHTML += `<p>${nullValuesList[0][i]} column contains ${nullValuesList[1][i]} NULL values</p>`;
  //   }
  // }

  // let resultHTML = "";
  // let resultList = res.data.result;

  // for (let i = 0; i < resultList[0].length; i++) {
  //   if (resultList[1][i] != null) {
  //     resultHTML += `<p>${resultList[1][i]}</p>`;
  //   }
  // }

  // document.getElementById("fileContent").innerHTML = `
  // <div><b>Columns:</b> ${columns}</div>
  // <div><p>${nullValuesHTML}</p></div>
  // <div><p>${resultHTML}</p></div>
  // <div className="fileRows" id="fileRows"><b>Rows</b><p>${rowsHTML}</p></div>
  // `;
  //   });
  // };

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

        {/* <div className="fileContent" id="fileContent"></div> */}
      </form>

      {/* <div id="content"></div> */}
      {/* <button type="button" onClick={() => uploadFile}>Submit</button> */}

      {/* {reportUrl && (
        <iframe
          src={reportUrl}
          title="Profiling Report"
          style={{ width: "100%", height: "90vh" }}
        />
      )} */}
    </div>
  );
}
