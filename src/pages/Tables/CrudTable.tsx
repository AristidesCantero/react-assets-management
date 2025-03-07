import React from "react";
import Filter from "./columnFilters";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import es from "../lang/es";


import {Column, ColumnDef, Table, flexRender, ColumnFiltersState, VisibilityState,
        useReactTable, PaginationState, 
        getCoreRowModel, getPaginationRowModel,
        getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";

interface CrudTableProps {
    API_URL: string;
    objectType?: {};
    searchableColumns?: string[];
    setHandleCreate: (value: boolean, id: number) => void;
    setHandleUpdate?: (value: boolean, id: number) => void;
    setHandleDelete?: (value: boolean, id: number) => void;
    setHandleView?: (value: boolean, id: number) => void;
    discardedColumns?: string[];
}

interface CrudTableState {
    elements: any[];
    columns: { header: string; accessorKey: string }[];
}


const CrudTable: React.FC<CrudTableProps> = ({ 
    API_URL, objectType, 
    setHandleCreate, setHandleDelete, 
    setHandleUpdate, setHandleView , 
    searchableColumns, discardedColumns}) => {
    const [elements, setElements] = useState<any[]>([]);
    const [filtering, setFiltering] = useState<string>('');
    const [columnFiltering, setColumnFiltering] = useState<ColumnFiltersState>([]);
    const [sorting,setSorting] = useState<any[]>([]);
    const [columns, setColumns] = useState<ColumnDef<PresentationStyle, any>[]>([ ]);
    const [paginationButtons, setPaginationButtons] = useState<any[]>([]); 
    const currentPaginationPage = 1;
    const paginationGroupLimit = 11;
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
      });
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        discardedColumns?.reduce((acc, column) => {
            acc[column] = false;
            return acc;
        }, {} as { [key: string]: boolean }) || {}
    );
    const table = useReactTable({  data: elements,  columns: columns, 
        debugTable:true,
        debugHeaders: true,
        debugColumns: false,
        getCoreRowModel: getCoreRowModel(), 
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableColumnFilters: true,
        enableHiding: true,
        onSortingChange: setSorting, 
        onGlobalFilterChange: setFiltering,
        onColumnFiltersChange: setColumnFiltering,
        onColumnVisibilityChange: setColumnVisibility,
        filterFns: { },
        state: {
            globalFilter: filtering,
            columnFilters: columnFiltering, 
            sorting: sorting,
            columnVisibility: columnVisibility,
        }, 
        initialState: {
            pagination: pagination,
            columnVisibility: {
                id: false,
                name: false,
                description: false,
                created_at: false,
                updated_at: false
            },
        }
    });


    useEffect(() => {
        console.log("creador de botones llamado")
        let start = Math.max(0, currentPaginationPage - Math.floor(paginationGroupLimit / 2));
        let end = Math.min(start + paginationGroupLimit, table.getPageCount()+1);
        
        if (end === table.getPageCount()) {
            start = Math.max(1, end - paginationGroupLimit);
        }
        let buttons: any[] = [];
        console.log('start: ', start, 'end: ', end);

        for (let i = start; i < end-1; i++) {
            buttons.push(
                <div key={'pagination-'+i+1}>
                    <button
                    className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    onClick={() => {table.setPageIndex(i);}}
                    >
                        {i+1}
                    </button>
                </div>
            );
        }

        setPaginationButtons(buttons);
    }, [sorting, filtering, columnFiltering, columnVisibility, pagination, columns]);

    useEffect(() => {
        fetch(API_URL).then((response) => response.json())
        .then((data) => {
            const parsedElements: any[] = [];
            data.map((element: any) => { parsedElements.push(element); });
            const dictionary = parsedElements.map((element) => 
            {
                return Object.entries(element).reduce((acc, [key, value]) => 
                { acc[key] = value; return acc; }, {} as { [key: string]: any });
            });
            setElements(dictionary);
            })
            .catch((error) => { console.log("Fetch de CrudTable con django ha fallado para " + typeof objectType); });
    }, []);

    useEffect(() => {
        const newColumns = Object.keys(elements[0] || {}).map((key) => ({
            header: es[key] || key, //key.charAt(0).toUpperCase() + key.slice(1),
            accessorKey: key,
            footer: 'final ' + key,
            cell: (info: any) => {
            const value = info.getValue();
            return dayjs(value, 'YYYY-MM-DD', true).isValid() && key!=='id' ? dayjs(value).format('DD/MM/YYYY') : value;
            }

        }));
        setColumns(newColumns);
    }, [elements]);

    

    return (
        <div className="max-w-[1000px] mx-auto">

            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white bg-opacity-100 shadow-md rounded-xl bg-clip-border">

                {/*Upper text*/}
                <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
                    <div className="flex items-center justify-between ">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Employees List</h3>
                            <p className="text-slate-500">Review each person before edit</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                        <button className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 
                                        focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"> 
                                View All 
                        </button>

                    
                        <button
                                className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button" onClick={() => {setHandleCreate(true,-1) }} disabled={setHandleCreate === undefined}>
                                <svg className="w-6 h-6 text-blue-300 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                        d="M15 5v14m-8-7h2m0 0h2m-2 0v2m0-2v-2m12 1h-6m6 4h-6M4 19h16c.5523 0 1-.4477 1-1V6c0-.55228-.4477-1-1-1H4c-.55228 0-1 .44772-1 1v12c0 .5523.44772 1 1 1Z"/>
                                </svg>
                                Add member
                        </button>

                    
                        </div>
                    </div>
            
                </div>

                {/* Input and table */}
                <div className="p-0 overflow-scroll">

                    <input type="text" value={filtering} onChange={(e) => {setFiltering(e.target.value)}}/>

                    <table /*className="content-table crud"*/
                    className="w-full mt-4 text-left table-auto min-w-max" style={{ margin: '0 auto', textAlign: 'center' }}>
                        <thead>
                            {
                                table.getHeaderGroups().map((headerGroup) => 
                                <tr key={headerGroup.id}>
                                    <th className="p-4 transition-colors border-y border-slate-200 bg-slate-50"></th>
                                    {
                                        headerGroup.headers.map((header) => 
                                        <th key={header.id} className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                            {
                                            header.isPlaceholder ? null :
                                            <>
                                                <div className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''} 
                                                    onClick={header.column.getToggleSortingHandler()}>
                                                        <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                                            {flexRender(header.column.columnDef.header, header.getContext())}

                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                                                        stroke="currentColor" aria-hidden="true" className="w-5 h-5 ">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" preserveAspectRatio="xMidYMid meet"
                                                                            d={header.column.getIsSorted() === 'asc' ? 'M8.25 15L12 18.75 15.75 15' : header.column.getIsSorted() === 'desc' ? 'M8.25 9L12 5.25 15.75 9' : 'M8.25 15L12 18.75 15.75 15M8.25 9L12 5.25 15.75 9'}>
                                                                        </path>
                                                            </svg>
                                                        </p>
                                                </div>
                                            </>                                        
                                            }
                                        </th>)
                                    }
                                    {setHandleUpdate && <th className="p-4 transition-colors border-y border-slate-200 bg-slate-50"></th>}
                                    {setHandleView && <th className="p-4 transition-colors border-y border-slate-200 bg-slate-50 "></th>}
                                    {setHandleDelete && <th className="p-4 transition-colors border-y border-slate-200 bg-slate-50 "></th>}
                                </tr>)
                            }
                        </thead>
                        <tbody>
                            {           
                                table.getRowModel().rows.map((row) =>(
                                    
                                    <tr key={row.id}>
                                        <td className="border-b border-slate-200">
                                            <div className="flex items-center">
                                            <img src={"http://localhost:5173/src/pages/Resources/Images/iamgen-negocio.png"}
                                                    alt="John Michael" 
                                                    className="relative inline-block h-12 w-12 !rounded-full object-cover object-center" />
                                            </div>
                                        </td>

                                        {row.getVisibleCells().map((cell) => (
                                            <td className="border-b border-slate-200 max-w-[1000px]" 
                                                key={cell.id}>
                                                    <div className="flex flex-col gap-3">
                                                        <span className="h-full text-sm font-semibold text-slate-500 truncate align-bottom">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </span>
                                                    </div>
                                            </td>
                                        ))}
                                        
                                        {setHandleUpdate && (
                                            <td className="border-b border-slate-200">
                                                <div className="text-sm font-medium leading-5 text-center whitespace-no-wrap border-gray-200 ">
                                                <a href="#" className="show-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" 
                                                        className="text-green-400 hover:text-green-800" viewBox="0 0 16 16"
                                                        onClick={() => { setHandleUpdate(true,row.original.id); }}>
                                                        <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.1 6.1 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.1 8.1 0 0 1-3.078.132 4 4 0 0 1-.562-.135 1.4 1.4 0 0 1-.466-.247.7.7 0 0 1-.204-.288.62.62 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896q.19.012.348.048c.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04"/>
                                                    </svg>
                                                </a>
                                            </div>
                                            </td>
                                        )}
                                        {setHandleView && (
                                            <td className="border-b border-slate-200"> 
                                            <div className="text-sm font-medium leading-5 text-center whitespace-no-wrap border-gray-200 ">
                                                <a href="#" className="show-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" 
                                                        className="text-blue-400 hover:text-blue-800" viewBox="0 0 16 16"
                                                        onClick={() => { setHandleView(true,row.original.id); }}>
                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                                </svg>
                                                </a>
                                            </div>
                                            </td>
                                        )}
                                        {setHandleDelete && (
                                            <td className="border-b border-slate-200">
                                                <div className="text-sm font-medium leading-5 text-center whitespace-no-wrap border-gray-200 ">
                                                <a href="#" className="show-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" 
                                                        className="text-gray-600 hover:text-red-600" viewBox="0 0 16 16"
                                                        onClick={() => { setHandleDelete(true,row.original.id); }}>
                                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                                </svg>
                                                </a>
                                            </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            }
                        </tbody>
                        {/* <tfoot>
                            {table.getFooterGroups().map((footerGroup) => (
                                <tr key={footerGroup.id}>
                                    {footerGroup.headers.map((footer) => (
                                        <td key={footer.id}>
                                            {flexRender(footer.column.columnDef.footer, footer.getContext())}
                                        </td>
                                    ))}
                                    {setHandleUpdate && <td></td>}
                                    {setHandleView && <td></td>}
                                    {setHandleDelete && <td></td>}
                                </tr>
                            ))}
                        </tfoot> */}
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-4">

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mt-4">
                            <span className="text-sm text-gray-700 dark:text-gray-400"> Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> to <span className="font-semibold text-gray-900 dark:text-white">10</span> of <span className="font-semibold text-gray-900 dark:text-white">100</span> Entries </span>
                        </div>
                        <div className="flex items-center mt-2">
                            <button className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white "
                            onClick={() => {table.getState().pagination.pageIndex>0 ? table.setPageIndex(table.getState().pagination.pageIndex - 1): null;}}>
                                <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                                </svg>
                                Prev
                            </button>
                                {
                                    (paginationButtons && paginationButtons.map((button) => button))
                                }
                            <button className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                            onClick={() => {table.getState().pagination.pageIndex<table.getPageCount()-1 ? table.setPageIndex(table.getState().pagination.pageIndex + 1): null;}}>
                                Next
                                <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                            </button>
                        </div>
                    </div>

                </div>


            </div>
            
        </div>
    );
};

export default CrudTable;
