'use client'
import { useReactTable, getCoreRowModel, flexRender, PaginationState, ColumnDef, getPaginationRowModel } from "@tanstack/react-table";
import { HTMLProps, useEffect, useMemo, useRef, useState } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Box,
    IconButton,
    Checkbox,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Select,
    Input,
    Text,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { api } from "@/api/api";
import { Category, Company, Department, Manufacturer, Equipamento, Situation } from "@/utils/types";

type DataTableType = {
    tableData: Equipamento[]
    categoryData: Category[]
    companyData: Company[]
    departmentData: Department[]
    manufacturerData: Manufacturer[]
    situationData: Situation[]
}

export default function DataTable({ tableData, categoryData, companyData, departmentData, manufacturerData, situationData }: DataTableType) {


    const data = useMemo(() => tableData, [tableData])

    function ActionMenu() {
        return (
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<HamburgerIcon />}
                    variant='outline'
                />
                <MenuList>
                    <MenuItem icon={<EditIcon />}>
                        Editar
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />}>
                        Remover
                    </MenuItem>
                </MenuList>
            </Menu>
        )
    }

    function IndeterminateCheckbox({
        indeterminate,
        className = '',
        ...rest
    }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
        const ref = useRef<HTMLInputElement>(null!)

        useEffect(() => {
            if (typeof indeterminate === 'boolean') {
                ref.current.indeterminate = !rest.checked && indeterminate
            }
        }, [ref, indeterminate])

        return (
            <input
                type="checkbox"
                ref={ref}
                className={className + ' cursor-pointer'}
                {...rest}
            />
        )
    }

    const columns: ColumnDef<Equipamento>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
        {
            header: 'Nº Patrimônio',
            accessorKey: 'Patrimonio'
        },
        {
            header: 'Tipo Equipamento',
            accessorKey: 'IdCategoriaEquipamento',
            cell: info => getCategory(info.getValue<number>()),
        },
        {
            header: 'Situação Equipamento',
            accessorKey: 'IdSituacaoEquipamento',
            cell: info => getSituation(info.getValue<number>()),
        },
        {
            header: 'Número Serial',
            accessorKey: 'NumeroSerial'
        },
        {
            header: 'Data Aquisição',
            accessorKey: 'DataAquisicao',
            cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
        },
        {
            header: 'Data Cadastro',
            accessorKey: 'DataCadastro',
            cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
        },
        {
            header: 'Data Modificação',
            accessorKey: 'DataModificacao',
            cell: info => formatDateTime(info.getValue<string>()),
        },
        {
            header: 'Empresa',
            accessorKey: 'IdEmpresa',
            cell: info => getCompany(info.getValue<number>()),
        },
        {
            header: 'Fabricante',
            accessorKey: 'IdFabricante',
            cell: info => getManufacturer(info.getValue<number>()),
        },
        {
            header: 'Departamento',
            accessorKey: 'IdDepartamento',
            cell: info => getDepartment(info.getValue<number>()),
        },
        {
            header: 'Ações',
            cell: () => ActionMenu()

        }
    ]

    function getCategory(id: number) {
        const category = categoryData.find((category) => category.IdCategoriaEquipamento === id);
        return category?.DescricaoCategoriaEquipamento
    }

    function getCompany(id: number) {
        const company = companyData.find((company) => company.IdEmpresa === id);
        return company?.NomeEmpresa
    }

    function getManufacturer(id: number) {
        const manufacturer = manufacturerData.find((manufacturer) => manufacturer.IdFabricante === id);
        return manufacturer?.NomeFabricante
    }

    function getDepartment(id: number) {
        const department = departmentData.find((department) => department.IdDepartamento === id);
        return department?.NomeDepartamento
    }

    function getSituation(id: number) {
        const situation = situationData.find((situation) => situation.IdSituacaoEquipamento === id);
        return situation?.DescricaoSituacaoEquipamento
    }


    function formatDateTime(date: Date | string | null) {

        if (date === null) return 'Não modificado'

        return new Date(date).toLocaleDateString()

    }

    const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() })

    const [rowSelection, setRowSelection] = useState({})

    return (
        <Box>
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