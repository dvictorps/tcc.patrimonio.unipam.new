import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import mData from '@/app/mock/data_table.json'
import { useMemo } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Box
} from '@chakra-ui/react'

export default function DataTable() {

    const data = useMemo(() => mData, [])

    const columns = [
        {
            header: 'Nº Patrimônio',
            accessorKey: 'patrimonio'
        },
        {
            header: 'Tipo Equipamento',
            accessorKey: 'tipoEquipamento'
        },
        {
            header: 'Nota Fiscal',
            accessorKey: 'notaFiscal'
        },
        {
            header: 'Data Aquisição',
            accessorKey: 'dataAquisicao'
        },
        {
            header: 'Data Cadastro',
            accessorKey: 'dataCadastro'
        },
        {
            header: 'Data Modificação',
            accessorKey: 'dataModificacao'
        },
        {
            header: 'Empresa',
            accessorKey: 'empresa'
        },
        {
            header: 'Fabricante',
            accessorKey: 'fabricante'
        },
        {
            header: 'Departamento',
            accessorKey: 'departamento'
        },
    ]

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() })



    return (
        <Box >
            <Table variant='striped' colorScheme='blue'>
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => <Th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
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
    )
}