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

            <div className="block mb-4 mx-auto border-b border-slate-300 pb-2 max-w-[360px]">
                    <a target='_blank' className='block w-full px-4 py-2 text-center text-slate-700 transition-all '>
                            More components on <b>Material Tailwind</b>.
                        </a>
            </div>



            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white bg-opacity-100 shadow-md rounded-xl bg-clip-border">

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
                                                    className="relative inline-block h-15 w-15 !rounded-full object-cover object-center" />
                                            </div>
                                        </td>

                                        {row.getVisibleCells().map((cell) => (
                                            <td className="p-4 border-b border-slate-200 max-w-[1000px]" 
                                                key={cell.id}>
                                                    <div className="flex flex-col gap-3">
                                                        <span className="h-full text-sm font-semibold text-slate-500 truncate align-bottom">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </span>
                                                    </div>
                                            </td>
                                        ))}
                                        
                                        {setHandleUpdate && (
                                            <td className="p-4 border-b border-slate-200">
                                                <button onClick={() => { setHandleUpdate(true,row.original.id); }}>Edit</button>
                                            </td>
                                        )}
                                        {setHandleView && (
                                            <td className="p-4 border-b border-slate-200"> 
                                            <div className="text-sm font-medium leading-5 text-center whitespace-no-wrap border-b border-gray-200 " onClick={() => { setHandleView(true,row.original.id); }}>
                                                <a href="#" className="text-gray-600 hover:text-gray-900 show-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                </a>
                                            </div>
                                                {/* <button onClick={() => { setHandleView(true,row.original.id); }}>View</button> */}
                                            </td>
                                        )}
                                        {setHandleDelete && (
                                            <td className="p-4 border-b border-slate-200">
                                                <button onClick={() => { setHandleDelete(true,row.original.id); }}>Delete</button>
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


                <div className="flex items-center gap-2">
                    <button
                    className="border rounded p-1"
                    onClick={() => {table.firstPage(); console.log("presionado");}}
                    disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                    className="border rounded p-1"
                    onClick={() => {table.nextPage()}}
                    disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button
                    className="border rounded p-1"
                    onClick={() => {table.setPageIndex(table.getPageCount()); console.log(table.getPageCount());}}
                    disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>

                    <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                    </span>

                    <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                        const page = e.target.value ? Number(e.target.value) - 1 : 0
                        table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                    </span>

                    <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                    >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                        </option>
                    ))}
                    </select>

                </div>


                <div>
                    Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
                    {table.getRowCount().toLocaleString()} Rows
                </div>

            </div>
            
        </div>
    );
};

export default CrudTable;
