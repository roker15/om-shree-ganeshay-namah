import { Tr, Th, Tbody, Td, Thead,Table } from "@chakra-ui/react";
// import * as React from "react";
import { useState } from "react";
import { render } from "react-dom";

// import { useTable, Column, useSortBy } from "react-table";

// // import "./styles.css";

// const columns: Column<Data>[] = [
//   {
//     Header: "Header1",
//     accessor: "name"
//   },
//   {
//     Header: "Header2",
//     accessor: "age"
//   },
// //   {
// //     Header: "Action",
// //     accessor: "action"
// //   },

// ];

// interface Data {
//   name: string;
//   age: number;
//   class:string
// }

// const data: Data[] = [
//   {
//     name: "John",
//     age: 23,
//     class:"tenth"
//   },
//   {
//     name: "Jane",
//     age: 26,
//     class:"fifth"
//   }
// ];

// const Table1= ()=> {

//     // const [data, setData] = useState([]);

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow
//   } = useTable<Data>({ columns, data }, useSortBy);

//   return (
//     <Table {...getTableProps()}>
//       <Thead>
//         {headerGroups.map(headerGroup => (
//           // eslint-disable-next-line react/jsx-key
//           <Tr  {...headerGroup.getHeaderGroupProps()}>
//             {headerGroup.headers.map(column => (
//               // eslint-disable-next-line react/jsx-key
//               <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
//                 {console.log(column.getSortByToggleProps())}
//                 {column.render("Header")}
//                 <span>
//                   {" "}
//                   {column.isSorted
//                     ? column.isSortedDesc
//                       ? " 🔽"
//                       : " 🔼"
//                     : ""}{" "}
//                 </span>
//               </Th>
//             ))}
//           </Tr>
//         ))}
//       </Thead>
//       <Tbody {...getTableBodyProps()}>
//         {rows.map((row, i) => {
//           prepareRow(row);
//           return (
//             // eslint-disable-next-line react/jsx-key
//             <Tr {...row.getRowProps()}>
//               {row.cells.map(cell => {
//                 // eslint-disable-next-line react/jsx-key
//                 return <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>;
//               })}
//             </Tr>
//           );
//         })}
//       </Tbody>
//     </Table>
//   );
// }

// export default Table1;

import React from "react";
import styled from "styled-components";
import { useTable, useSortBy, Column, TableInstance, Row } from "react-table";

import makeData from "./makeData.json";
import { divide } from "lodash";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function ReactTable({ columns, data }: { columns: any; data: any }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );
  // console.log("get table rows is ", rows)
  // console.log("get table body props is ", rowsById)

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 8);

  return (
    <>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                // eslint-disable-next-line react/jsx-key
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <br />
      <div>Showing {rows.length} rows</div>
    </>
  );
}

interface Data {
  idd: number;
  country: string;
  class: string;
}

const localData: Data[] = [
  {
    idd: 1,
    country: "Angola",
    class: "madarchod",
  },
  {
    idd: 2,
    country: "Argentina1",
    class: "madarchod1",
  },
  {
    idd: 3,
    country: "Argentina2",
    class: "madarchod1",
  },
  {
    idd: 4,
    country: "Argentina3",
    class: "madarchod1",
  },
];

function Table1() {
  const [data, setData] = React.useState(React.useMemo(() => localData, []));

  const [activeIndex, setActiveIndex] = React.useState(1000);
  const handleClickEditRow = (rowIndex: any) => {
    // setTableData(prev => prev.map((r, index) => ({...r, isEditing: rowIndex === index})))
  };

  const columns: Column<Data>[] = React.useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "Country",
            accessor: "country",
            // sortType: 'basic'
          },
        ],
      },

      {
        Header: "Delete",

        id: "delete",
        accessor: (str) => "delete",

        Cell: (tableProps: any) => (
          <span
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
            onClick={() => {
              console.log("table props is ", tableProps);
              // ES6 Syntax use the rvalue if your data is an array.
              const dataCopy = [...data];
              // It should not matter what you name tableProps. It made the most sense to me.
              dataCopy.splice(tableProps.row.index, 1);
              setData(dataCopy);
            }}
          >
            Delete
          </span>
        ),
      },
      {
        Header: "Edit",

        id: "edit",
        accessor: (str) => "edit",

        Cell: (tableProps: any) =>
          activeIndex === 1000 ? (
            <div>
              {" "}
              <span
                style={{
                  cursor: "pointer",
                  color: "blue",
                  //   textDecoration: "underline overline wavy blue",
                }}
                onClick={() => {
                  setActiveIndex(tableProps.row.index);
                  {
                    console.log("table props is ", tableProps);
                  }
                  // ES6 Syntax use the rvalue if your data is an array.
                  const dataCopy = [...data];
                  // It should not matter what you name tableProps. It made the most sense to me.
                  dataCopy[tableProps.row.index].country = "badla hua desh";
                  // dataCopy[tableProps.row()].country="badla hua desh";
                  setData(dataCopy);
                }}
              >
                Edit
              </span>
            </div>
          ) : activeIndex === tableProps.row.index ? (
            //    <div>hi</div>

            <div>
              <span> </span>

              <span
                style={{
                  cursor: "pointer",
                  color: "blue",
                  //   textDecoration: "underline",
                }}
                onClick={() => {
                  setActiveIndex(1000);
                  {
                    console.log("table props is ", tableProps);
                  }
                  // ES6 Syntax use the rvalue if your data is an array.
                  const dataCopy = [...data];
                  // It should not matter what you name tableProps. It made the most sense to me.
                  dataCopy[tableProps.row.index].country = "badla hua desh";
                  // dataCopy[tableProps.row()].country="badla hua desh";
                  setData(dataCopy);
                }}
              >
                Cancel Edit
              </span>
            </div>
          ) : (
            <div></div>
          ),

        //   },
      },
    ],
    [data]
  );

  return (
    // <Styles>
      <ReactTable columns={columns} data={data} />
    // </Styles>
  );
}

export default Table1;
