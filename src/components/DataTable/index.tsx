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
    Box,
    IconButton,
    Checkbox
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";


type DataTableType = {
    tableData: any
}

export default function DataTable({tableData} : DataTableType ) {

    const data = useMemo(() => tableData, [])

    const columns = [
        {
            header: 'Ação',
            cell: () => <Box><Checkbox/></Box>
        },
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
            accessorKey: 'dataAquisicao',
            cell: (info: { getValue: () => string | number | Date; }) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            header: 'Data Cadastro',
            accessorKey: 'dataCadastro',
            cell: (info: { getValue: () => string | number | Date; }) => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            header: 'Data Modificação',
            accessorKey: 'dataModificacao',
            cell: (info: { getValue: () => string | number | Date; }) => new Date(info.getValue()).toLocaleDateString(),
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
        {
            header: 'Ações',
            cell: ()=> <Box display={'flex'} flexDirection={'row'} gap={'5px'}><IconButton aria-label='Editar' colorScheme='blue' icon={<EditIcon />} /><IconButton aria-label='Remover' colorScheme='red' icon={<DeleteIcon />} /></Box>
            
        }
    ]

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() })



    return (
        <Box >
            <Table variant='simple' colorScheme='blue'>
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