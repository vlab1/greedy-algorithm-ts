import React, { useState } from "react";
import { useHttp } from "../../../hooks/http.hook";
import "./Main.scss";

const Main = () => {
  const [data, setData] = useState([]);
  const [columnCount, setColumnCount] = useState(null);
  const [rowCount, setRowCount] = useState(null);
  const { loading, request } = useHttp();
  const [analysisDataTables, setAnalysisDataTables] = useState([]);

  const handleAnalysisData = async () => {
    try {
      const saveData = {
        columns: [],
        rows: [],
        income: [],
        rowConstraint: [],
        colConstraint: [],
        efficiency: [],
      };
      const columns = data[0].slice(1);
      columns.pop();
      let rows = [];
      data
        .slice(1)
        .map(
          (row, rowIndex) =>
            rowIndex !== data.slice(1).length - 1 && rows.push(row[0])
        );
      let mainData = data.slice(1);
      mainData.map((row, rowIndex) => (mainData[rowIndex] = row.slice(1)));
      mainData.forEach((array, i) => {
        array.forEach((item, j) => {
          mainData[i][j] = Number(item);
        });
      });
      saveData.columns = columns;
      saveData.rows = rows;
      saveData.income = mainData;
      saveData.colConstraint = mainData[mainData.length - 1];
      saveData.income.pop();
      saveData.income.forEach((item, index) => {
        saveData.rowConstraint.push(saveData.income[index].pop());
      });
      saveData.income.forEach((array, index) => {
        array.forEach((item, index1) => {
          saveData.efficiency.push(item / 20);
        });
      });
      await request("/api/analysis/start", "POST", {
        ...saveData,
      }).then((res) => {
        setAnalysisDataTables(() => {
          let steps = [];
          for (let i = 0; i < res.data.length; i++) {
            let step = [];
            for (let j = 0; j < res.data[i].rows.length + 2; j++) {
              step.push([]);
            }
            for (let j = 0; j < step.length; j++) {
              if (j === 0) {
                step[j] = res.data[i].columns;
                step[j].unshift("");
                step[j].push("Row сonstraint");
              } else if (j < step.length - 1) {
                step[j] = res.data[i].income[j - 1];
                step[j].unshift(res.data[i].rows[j - 1]);
                step[j].push(res.data[i].rowConstraint[j - 1]);
              } else {
                step[j] = res.data[i].colConstraint;
                step[j].unshift("Column сonstraint");
              }
            }
            steps.push(step);
          }
          return steps;
        });
      });
    } catch (e) {
      throw new Error("Error");
    }
  };

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const handleColumnCountChange = (event) => {
    setColumnCount(parseInt(event.target.value));
    setRowCount(parseInt(event.target.value));
  };

  const handleCreateTable = () => {
    const newData = [];
    const topRow = [""];
    for (let i = 0; i < columnCount + 1; i++) {
      topRow.push("");
    }
    newData.push(topRow);
    for (let i = 0; i < rowCount + 1; i++) {
      const newRow = [""];
      for (let j = 0; j < columnCount + 1; j++) {
        newRow.push("");
      }
      newData.push(newRow);
    }
    setData(newData);
    setAnalysisDataTables([]);
  };

  const handleCellChange = (event, rowIndex, columnIndex) => {
    const value = event.target.value;
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnIndex] = value;
      return newData;
    });
    setAnalysisDataTables([]);
  };

  const handleGenerateData = () => {
    const U = 20;
    const newData = [];
    const topRow = [""];
    for (let i = 0; i < columnCount + 1; i++) {
      if (i === columnCount) {
        topRow.push("Row сonstraint");
      } else {
        topRow.push("Entity " + (i + 1));
      }
    }
    newData.push(topRow);
    for (let i = 0; i < rowCount + 1; i++) {
      let newRow = ["Tower " + (i + 1)];
      if (i === rowCount) {
        newRow = ["Column сonstraint "];
      }
      for (let j = 0; j < columnCount + 1; j++) {
        if (!(i === rowCount && j === columnCount)) {
          if (i === rowCount || j === columnCount) {
            newRow.push(randomIntFromInterval(1, 25) * U * 4 + "");
          } else {
            newRow.push(randomIntFromInterval(1, 25) * U + "");
          }
        }
      }
      newData.push(newRow);
    }
    setData(newData);
    setAnalysisDataTables([]);
  };

  return (
    <div>
      <div className="menu">
        <div className="field">
          <input
            value={columnCount}
            onChange={handleColumnCountChange}
            placeholder="Matrix size"
          ></input>
        </div>

        <div className="buttons">
          <button
            disabled={loading}
            className="action-button"
            onClick={handleCreateTable}
          >
            create
          </button>
          <button
            disabled={loading}
            className="action-button"
            onClick={handleGenerateData}
          >
            generate
          </button>

          <button
            disabled={loading}
            className="action-button"
            onClick={handleAnalysisData}
          >
            solve
          </button>
        </div>
      </div>
      <table className="table-input">
      <caption>Table</caption>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td
                  key={columnIndex}
                  style={
                    (rowIndex === 0 || columnIndex === 0) &&
                    !(rowIndex === 0 && columnIndex === 0)
                      ? { background: "#efefef" }
                      : { background: "white" }
                  }
                >
                  <input
                    disabled={rowIndex === 0 && columnIndex === 0}
                    type="text"
                    value={cell}
                    onChange={(event) =>
                      handleCellChange(event, rowIndex, columnIndex)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={loading ? { display: "block" } : { display: "none" }}
        className="loader"
      ></div>

      {analysisDataTables.length > 0 &&
        analysisDataTables.map((table, index) => {
          return (
            <table className="table-analysis">
               <caption>Step {index + 1}</caption>
              <tbody>
                {table.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, columnIndex) => {
                      let choice = false;
                      if ((cell + "").indexOf("(") >= 0 && (cell + "").indexOf("X") === -1) {
                        choice = true;
                      }
                      return <td key={columnIndex}  style={
                        choice 
                          //? { background: "#ffff79" }
                          ? { background: "#afffbb" }
                          : { background: "white" } &&
                            (rowIndex === 0 || columnIndex === 0) &&
                            !(rowIndex === 0 && columnIndex === 0)
                          ? { background: "#efefef" }
                          : { background: "white" }
                      }>{cell}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          );
        })}
   
    </div>
  );
};

export default Main;
