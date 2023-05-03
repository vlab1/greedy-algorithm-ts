import React, { useState } from "react";
import { useHttp } from "../../../hooks/http.hook";
import "./Main.scss";

const Main = () => {
  const [data, setData] = useState([]);
  const [columnCount, setColumnCount] = useState(3);
  const [rowCount, setRowCount] = useState(3);
  const { loading, request } = useHttp();
  const [analysisData, setAnalysisData] = useState({});
  const [analysisDataTables, setAnalysisDataTables] = useState([]);
  const [objectiveFunction, setObjectiveFunction] = useState("");

  function transformData(table, startRow, endRow, startCol, endCol) {
    const columns = table[0].slice(startCol - 1, endCol);
    const rows = table.slice(startRow - 1, endRow).map((row) => row[0]);
    const data = table
      .slice(startRow - 1, endRow)
      .map((row) => row.slice(startCol - 1, endCol))
      .map((row) => row.map((item) => Number(item)));
    const columns_y = table
      .slice(startRow - 1, endRow)
      .map((row) => Number(row[table[0].indexOf("y")]));
    const columns_S = table
      .slice(startRow - 1, endRow)
      .map((row) => Number(row[table[0].indexOf("S")]));
    const columns_N = table
      .slice(startRow - 1, endRow)
      .map((row) => JSON.parse(row[table[0].indexOf("N")]));
    const rows_z = table[table.length - 3]
      .slice(startCol - 1, endCol)
      .map((row) => Number(row));
    const rows_H = table[table.length - 2]
      .slice(startCol - 1, endCol)
      .map((row) => Number(row));
    const rows_L = table[table.length - 1]
      .slice(startCol - 1, endCol)
      .map((row) => JSON.parse(row));
    return {
      columns,
      rows,
      data,
      columns_y,
      columns_S,
      columns_N,
      rows_z,
      rows_H,
      rows_L,
    };
  }

  function reverseTransformData(data) {
    const {
      columns,
      rows,
      data: newData,
      columns_y,
      columns_S,
      columns_N,
      rows_z,
      rows_H,
      rows_L,
    } = data;
    const table = [];
    const header = ["", ...columns, "y", "S", "N"];
    table.push(header);
    for (let i = 0; i < rows.length; i++) {
      const row = [
        rows[i],
        ...newData[i],
        columns_y[i],
        columns_S[i],
        columns_N[i],
      ];
      table.push(row);
    }
    const zRow = ["z", ...rows_z];
    table.push(zRow);
    const HRow = ["H", ...rows_H];
    table.push(HRow);
    const LRow = ["L", ...rows_L.map((row) => JSON.stringify(row))];
    table.push(LRow);
    return table;
  }

  const handleAnalysisData = async () => {
    try {
      const saveData = transformData(data, 2, rowCount + 1, 2, columnCount + 1);
      await request("/api/analysis/greedy-algorithm", "POST", {
        ...saveData,
      }).then((res) => {
        setAnalysisDataTables(res.data);
        setObjectiveFunction(() => {
          let result = "F = ";
          let sum = 0;
          for (let i = 0; i < saveData.data.length; i++) {
            for (let j = 0; j < saveData.data[i].length; j++) {
              const x = res.data.filter(
                (item) =>
                  item.column === j &&
                  item.row === i &&
                  item.type === "selected"
              ).length;
              result += `${x} • ${saveData.data[i][j]} + `;
              sum += saveData.data[i][j] * x;
            }
          }
          result = result.slice(0, -2);
          result += ` = ${sum}`;
          return result;
        });
      });
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleDownloadData = async () => {
    try {
      await request("/api/analysis/find").then((res) => {
        console.log(res.data.data.flat());
        if (res.data.data.flat().length > 7) {
          setData(res.data.data);
          setAnalysisData(res.data.assignment);
        }
      });
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleClearData = async () => {
    try {
      setData([]);
      setAnalysisData({});
    } catch (e) {
      throw new Error("Error");
    }
  };
  const handleRowCountChange = (event) => {
    setRowCount(parseInt(event.target.value));
  };
  const handleSaveData = async () => {
    try {
      setAnalysisData({});
      let saveData = {
        columns: [],
        rows: [],
        data: [],
      };
      if (data.length > 0) {
        let count = 0;
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === "") {
              count++;
            }
          }
        }
        let bool = true;
        if (count === data.length * data[0].length) {
          bool = false;
        }
        if (bool) {
          saveData = transformData(data, 2, rowCount + 1, 2, columnCount + 1);
          await request("/api/analysis/save", "POST", {
            ...saveData,
          });
        } else {
          await request("/api/analysis/delete", "DELETE", {
            ...saveData,
          });
        }
      } else {
        await request("/api/analysis/delete", "DELETE", {
          columns: [""],
          rows: [""],
          data: [[0]],
        });
      }
    } catch (e) {
      throw new Error("Error");
    }
  };

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const handleColumnCountChange = (event) => {
    setColumnCount(parseInt(event.target.value));
    // setRowCount(parseInt(event.target.value));
  };

  const handleCreateTable = () => {
    const newData = [];
    const topRow = [""];
    if (
      columnCount > 8 ||
      rowCount > 8 ||
      columnCount < 1 ||
      rowCount < 1 ||
      isNaN(columnCount) ||
      isNaN(rowCount)
    ) {
      alert("The size of the matrix must be a number between 0 and 8.");
    } else {
      for (let i = 0; i < columnCount + 3; i++) {
        topRow.push("");
      }
      newData.push(topRow);
      for (let i = 0; i < rowCount + 3; i++) {
        const newRow = [""];
        for (let j = 0; j < columnCount + 3; j++) {
          newRow.push("");
        }
        newData.push(newRow);
      }
      setData(newData);
      setAnalysisData({});
      setAnalysisDataTables([]);
    }
  };

  const handleCellChange = (event, rowIndex, columnIndex) => {
    const value = event.target.value;
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnIndex] = value;
      return newData;
    });
    setAnalysisData({});
  };

  const handleGenerateData = () => {
    const newData = [];
    const topRow = [""];
    if (
      columnCount > 8 ||
      rowCount > 8 ||
      columnCount < 1 ||
      rowCount < 1 ||
      isNaN(columnCount) ||
      isNaN(rowCount)
    ) {
      alert("The size of the matrix must be a number between 0 and 8.");
    } else {
      for (let i = 0; i < columnCount; i++) {
        topRow.push("Point " + (i + 1));
      }
      newData.push(topRow);
      for (let i = 0; i < rowCount; i++) {
        const newRow = ["Entity " + (i + 1)];

        for (let j = 0; j < columnCount; j++) {
          newRow.push(randomIntFromInterval(1, 25) + "");
        }
        newData.push(newRow);
      }

      for (let i = 0; i < newData.length; i++) {
        if (i === 0) {
          newData[i].push("y");
        } else {
          newData[i].push("1");
        }
        if (i + 1 === newData.length) {
          let array = [];
          for (let j = 0; j < newData[i].length; j++) {
            if (j === 0) {
              array.push("z");
            } else if (j !== newData[i].length - 1) {
              array.push("1");
            }
          }
          newData.push(array);
          break;
        }
      }
      for (let i = 0; i < newData.length; i++) {
        if (i === 0) {
          newData[i].push("S");
        } else {
          newData[i].push(randomIntFromInterval(500, 950) + "");
        }
        if (i + 2 === newData.length) {
          let array = [];
          for (let j = 0; j < newData[i].length; j++) {
            if (j === 0) {
              array.push("H");
            } else if (
              j !== newData[i].length - 1 &&
              j !== newData[i].length - 2
            ) {
              array.push(randomIntFromInterval(900, 1000) + "");
            }
          }
          newData.push(array);
          break;
        }
      }
      for (let i = 0; i < newData.length; i++) {
        if (i === 0) {
          newData[i].push("N");
        } else {
          newData[i].push(randomIntFromInterval(1, 4) + "");
        }
        if (i + 3 === newData.length) {
          let array = [];
          for (let j = 0; j < newData[i].length; j++) {
            if (j === 0) {
              array.push("L");
            } else if (
              j !== newData[i].length - 1 &&
              j !== newData[i].length - 2 &&
              j !== newData[i].length - 3
            ) {
              let item = JSON.stringify(
                [
                  ...new Set(
                    JSON.parse(
                      `[${randomIntFromInterval(1, 4)}, ${randomIntFromInterval(
                        1,
                        4
                      )}, ${randomIntFromInterval(
                        1,
                        4
                      )}, ${randomIntFromInterval(1, 4)}]`
                    )
                  ),
                ],
                null,
                1
              ).split("");
              item.splice(1, 2);
              item = item.join("");
              array.push(item);
            }
          }
          newData.push(array);
          break;
        }
      }
      setData(newData);
      setAnalysisData({});
      setAnalysisDataTables([]);
    }
  };
  const array = [];

  return (
    <div>
      <div className="menu">
        <div className="field">
          <input
            value={rowCount}
            onChange={handleRowCountChange}
            placeholder="Entities"
          ></input>
          <input
            value={columnCount}
            onChange={handleColumnCountChange}
            placeholder="Points"
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
        <div className="buttons">
          <button
            disabled={loading}
            className="action-button"
            onClick={handleSaveData}
          >
            save
          </button>
          <button
            disabled={loading}
            className="action-button"
            onClick={handleDownloadData}
          >
            download
          </button>
          <button
            disabled={loading}
            className="action-button"
            onClick={handleClearData}
          >
            clear
          </button>
        </div>
      </div>
      {data.length > 0 && (
        <table className="table-input">
          <caption>Data</caption>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => {
                  return !(
                    rowIndex === rowCount + 1 || columnIndex === columnCount + 1
                  ) ? (
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
                  ) : null;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div
        style={loading ? { display: "block" } : { display: "none" }}
        className="loader"
      ></div>

      {analysisDataTables.length > 0 &&
        data.length > 0 &&
        analysisDataTables.map((item, index) => {
          const el = analysisDataTables[index];
          array.push(el);
          return (
            <table className="table-analysis">
              <caption>STEP {index + 1}</caption>
              <tbody>
                {data.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                      {row.map((cell, columnIndex) => {
                        let el1 = null;
                        const bool =
                          array.filter(
                            (el) =>
                              el.row === rowIndex - 1 &&
                              el.column === columnIndex - 1
                          ).length >= 1;
                        let backgroundCell = el.background;
                        if (
                          analysisDataTables.filter(
                            (item) =>
                              item.column === columnIndex - 1 &&
                              item.row === rowIndex - 1
                          ).length > 0
                        ) {
                          let element = analysisDataTables.filter(
                            (item) =>
                              item.column === columnIndex - 1 &&
                              item.row === rowIndex - 1
                          )[0];
                          backgroundCell = element.background;
                          el1 = element
                        }
        
                        return !(
                          rowIndex === rowCount + 1 ||
                          columnIndex === columnCount + 1
                        ) ? (
                          <td
                            key={columnIndex}
                            style={
                              (rowIndex === 0 || columnIndex === 0) &&
                              !(rowIndex === 0 && columnIndex === 0)
                                ? { background: "#efefef" }
                                : bool
                                ? // ? { background: "#afffbb" }
                                  { background: backgroundCell }
                                : { background: "white" }
                            }
                          >
                            {!bool ? cell : el1?.type === "notselected" ? " 0": cell }
                            {/* <br/>
                            {columnIndex}{rowIndex} */}
                          </td>
                        ) : null;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })}
      {(analysisData.error ||
        (analysisData.maxTotalDamage === 0 &&
          analysisData.result.length === 0)) && (
        <table className="table-analysis">
          <caption>No answer</caption>
        </table>
      )}

      <div className="function">
        {objectiveFunction.length > 0 && (
          <table className="table-function">
            <caption>Objective Function</caption>
            <tbody>
              <tr key={1}>
                <td key={1}>{objectiveFunction}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Main;
