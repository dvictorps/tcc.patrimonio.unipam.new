'use client'
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Table, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, IconButton, Select, Text, Input } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import {
    Column,
    Table as ReactTable,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
} from '@tanstack/react-table'

export type GenericTableType<T> = {
    data: T[]
    columns: ColumnDef<T>[]
}

const selectResultsOptions = [
    10,
    20,
    30,
    50
]


function Filter({
    column,
    table,
}: {
    column: Column<any, any>
    table: ReactTable<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    return typeof firstValue === 'number' ? (
        <></>
    ) : (
        <Input
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Pesquisar...`}
            className="w-36 border shadow rounded"
        />
    )
}
export default function GenericTable<T>({ data, columns }: GenericTableType<T>) {


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
    })



    return (
        <Box>
            <Box overflowX={'auto'} overflowY={'auto'} >
                <Table variant='simple' colorScheme='blue' >
                    <Thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => <Th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getCanFilter() ? (
                                        <Box>
                                            <Filter column={header.column} table={table} />
                                        </Box>
                                    ) : null}
                                </Th>)}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map(row => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                    <Tfoot>
                        {table.getFooterGroups().map(footerGroup => (
                            <Tr key={footerGroup.id}>
                                {footerGroup.headers.map(header =>
                                    <Th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </Th>)
                                }
                            </Tr>
                        ))}
                    </Tfoot>
                </Table>
            </Box>
            <Box display={'flex'} gap={'0.4rem'} p={'1rem'}>
                <Button colorScheme="teal" onClick={() => table.setPageIndex(0)}
                    isDisabled={!table.getCanPreviousPage()}>{'<<'}</Button>
                <IconButton colorScheme="teal" aria-label='back' onClick={() => table.previousPage()} isDisabled={!table.getCanPreviousPage()} icon={<ArrowBackIcon />} />
                <IconButton colorScheme="teal" aria-label='foward' onClick={() => table.nextPage()} isDisabled={!table.getCanNextPage()} icon={<ArrowForwardIcon />} />
                <Button colorScheme="teal" onClick={() => table.setPageIndex(table.getPageCount() - 1)} isDisabled={!table.getCanNextPage()}>{'>>'}</Button>
                <Box justifyContent={'space-between'} display={'flex'} width={'100%'} alignItems={'center'}>
                    {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    <Box display={'flex'} justifyContent={'auto'}>
                        <Text>Resultados por página:</Text>
                        <Select value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value))
                            }}>
                            {selectResultsOptions.map(option =>
                            (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </Select>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}