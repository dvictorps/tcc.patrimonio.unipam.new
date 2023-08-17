'use client'

import DataTable from 'react-data-table-component';
import data from '@/app/mock/data_table.json'
import { IconButton } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'


const columns = [
    {
        name: 'Nº Patrimônio',
        selector: (row: { patrimonio: any; }) => row.patrimonio,
    },
    {
        name: 'Tipo Equipamento',
        selector: (row: { tipoEquipamento: any; }) => row.tipoEquipamento
    },
    {
        name: 'Data Aquisição',
        selector: (row: { dataAquisicao: any; }) => row.dataAquisicao
    },
    {
        name: 'Data Cadastro',
        selector: (row: { dataCadastro: any; }) => row.dataCadastro
    },
    {
        name: 'Empresa',
        selector: (row: { empresa: any; }) => row.empresa
    },
    {
        name: 'Departamento',
        selector: (row: { departamento: any; }) => row.departamento
    },
    {
        name: 'Fabricante',
        selector: (row: { fabricante: any; }) => row.fabricante
    },

    {
        name: 'Nota Fiscal',
        selector: (row: { notaFiscal: any; }) => row.notaFiscal
    },
    {
        name: 'Ações',
        button: true,
        cell: () => <div><IconButton aria-label='Editar' colorScheme='blue' icon={<EditIcon />} /><IconButton aria-label='Remover' colorScheme='red' icon={<DeleteIcon />} /></div>,
    },
]



export default function ReactDataTable() {
    return (
        <DataTable
            columns={columns}
            data={data}
            pagination
            selectableRows
            fixedHeader
            fixedHeaderScrollHeight="25rem"
        />
    )
}