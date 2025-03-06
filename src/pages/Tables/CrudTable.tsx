import React from "react";
import Filter from "./columnFilters";
import dayjs from "dayjs";
import { useEffect, useState } from "react";


import {Column, ColumnDef, Table, flexRender, ColumnFiltersState, VisibilityState,
        useReactTable, PaginationState, 
        getCoreRowModel, getPaginationRowModel,
        getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";

interface CrudTableProps {
    API_URL: string;
    objectType?: {};
    searchableColumns?: string[];
    setHandleCreate?: (value: boolean, id: number) => void;
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
            header: key, //key.charAt(0).toUpperCase() + key.slice(1),
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
        <div className="max-w-[720px] mx-auto">

            <div className="block mb-4 mx-auto border-b bg-black border-slate-300 pb-2 max-w-[360px]">
                    <a target='_blank' className='block w-full px-4 py-2 text-center text-slate-700 transition-all '>
                            More components on <b>Material Tailwind</b>.
                        </a>
                </div>

            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white bg-opacity-100 shadow-md rounded-xl bg-clip-border">

                <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-gray-500 rounded-xl bg-clip-border">
                    <div className="flex items-center justify-between ">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Employees List</h3>
                            <p className="text-slate-500">Review each person before edit</p>
                        </div>
                    <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                        
                    </div>
                    </div>
                
                </div>

                <div className="p-0 overflow-scroll">

                    <input type="text" value={filtering} onChange={(e) => {setFiltering(e.target.value)}}/>

                    <table /*className="content-table crud"*/
                    className="w-full mt-4 text-left table-auto min-w-max" style={{ margin: '0 auto', textAlign: 'center' }}>
                        <thead className="">
                            {
                                table.getHeaderGroups().map((headerGroup) => 
                                <tr className="row100 head" key={headerGroup.id}>
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
                                                            {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : null}
                                                        </p>
                                                        
                                                </div>

                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column}/>
                                                    </div>
                                                ) : null}
                                            </>                                        
                                            }
                                        </th>)
                                    }
                                    {setHandleUpdate && <td></td>}
                                    {setHandleView && <td></td>}
                                    {setHandleDelete && <td></td>}
                                </tr>)
                            }
                        </thead>
                        <tbody>
                            {
                                table.getRowModel().rows.map((row) =>(
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                        
                                        {setHandleUpdate && (
                                            <td>
                                                <button onClick={() => { setHandleUpdate(true,row.original.id); }}>Edit</button>
                                            </td>
                                        )}
                                        {setHandleView && (
                                            <td> 
                                                <button onClick={() => { setHandleView(true,row.original.id); }}>View</button>
                                            </td>
                                        )}
                                        {setHandleDelete && (
                                            <td>
                                                <button onClick={() => { setHandleDelete(true,row.original.id); }}>Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            }
                        </tbody>
                        <tfoot>
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
                        </tfoot>
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


                    {setHandleCreate && 
                    ( <button onClick={() => { setHandleCreate(true,-1) }}>Create</button>)
                    }
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
