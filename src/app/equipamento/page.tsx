'use client'

import { Box, Input, Text, Button, Divider } from "@chakra-ui/react"
import data from '@/app/mock/data_table.json'
import { useState } from "react"
import Sidebar from "@/components/Sidebar"
const displayData = data[8]


export default function Patrimonio() {



    // "idEquipamento": "1",
    // "patrimonio": "982417342355",
    // "tipoEquipamento": "Laptop",
    // "notaFiscal": "6723489023",
    // "dataAquisicao": "2021-07-25T09:12:32Z",
    // "dataCadastro": "2023-02-18T14:20:09Z",
    // "dataModificacao": "2023-06-30T16:45:27Z",
    // "empresa": "Alienware",
    // "fabricante": "Alienware",
    // "departamento": "Administração"

    const [editState, setEdit] = useState(false)

    function handleEdit() {
        editState ? setEdit(false) : setEdit(true)

    }

    const inputArray = [
        {
            id: 1,
            label: 'Nº Patrimônio',
            defaultValue: displayData.patrimonio,
            disabled: false
        },
        {
            id: 2,
            label: 'Tipo de Equipamento',
            defaultValue: displayData.tipoEquipamento,
            disabled: false
        },
        {
            id: 3,
            label: 'Data de Aquisição',
            defaultValue: displayData.dataAquisicao,
            disabled: false
        },
        {
            id: 4,
            label: 'Data de Cadastro',
            defaultValue: displayData.dataCadastro,
            disabled: true

        },
        {
            id: 5,
            label: 'Data de Modificação',
            defaultValue: displayData.dataModificacao,
            disabled: true
        },
        {
            id: 6,
            label: 'Departamento',
            defaultValue: displayData.departamento,
            disabled: false
        },
        {
            id: 7,
            label: 'Empresa Associada',
            defaultValue: displayData.empresa,
            disabled: false
        },
        {
            id: 8,
            label: 'Fabricante',
            defaultValue: displayData.fabricante,
            disabled: false
        },
        {
            id: 9,
            label: 'Id Equipamento',
            defaultValue: displayData.idEquipamento,
            disabled: true
        },
        {
            id: 10,
            label: 'Nº Nota Fiscal',
            defaultValue: displayData.notaFiscal,
            disabled: false
        }
    ]


    return (

        <Box flexDirection={'column'} >
            <Box shadow={'dark-lg'} my='1rem' mx='2.5rem' borderRadius={'5px'} p='1rem'  >
                <Text fontSize={'xl'} color={'blue.700'}>Equipamento de Patrimônio nº {displayData.patrimonio}</Text>
                <Divider />
                <Box display={'flex'} flexDirection={'row'} p='1rem' overflowY={'auto'} maxHeight={'44rem'} flexWrap={'wrap'} gap={'2rem'}
                    sx={{
                        '@media only screen and (max-width: 1800px)': {
                            maxHeight: '24rem',
                            minHeight: '24rem'
                        },
                    }}>
                    {!editState ? (
                        inputArray.map(label => (
                            <Box my={'10px'} key={label.id} display={'flex'} flexDirection={'column'}>
                                <Text fontSize={'lg'} color={'blue.700'}>{label.label}</Text>
                                <Text>{label.defaultValue}</Text>
                            </Box>
                        ))
                    ) : (
                        inputArray.map(label => (
                            <Box my={'10px'} key={label.id} display={'flex'} flexDirection={'column'}>
                                <Text fontSize={'lg'} color={'blue.700'}>{label.label}</Text>
                                <Input defaultValue={label.defaultValue} disabled={label.disabled} />
                            </Box>
                        ))
                    )}


                </Box>
                <Divider />
                <Button onClick={handleEdit}>Editar</Button>
            </Box>


        </Box>

    )
}