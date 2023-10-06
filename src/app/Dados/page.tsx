'use client'
import { Box, Select, Text } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import { DepartmentTable } from "./DepartmentTable";
import { ChangeEvent, useState } from "react";
import { CompanyTable } from "./CompanyTable";
import { CityTable } from "./CityTable";
import { RoomTable } from "./RoomTable";
import { RoomTypeTable } from "./RoomTypeData";


export default function Dados() {

    const searchSelectOptions = [
        {
            label: 'Selecionar tipo de dado',
            value: 'nenhum'
        },
        {
            label: 'Departamento',
            value: 'departamento'
        },
        {
            label: 'Empresa',
            value: 'empresa'
        },
        {
            label: 'Cidade',
            value: 'cidade'
        },
        {
            label: 'Sala',
            value: 'sala'
        },
        {
            label: 'Tipo de Sala',
            value: 'tiposala'
        }
    ]

    const [selectOption, setSelectOption] = useState(searchSelectOptions[0]);


    function setSelectedOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = searchSelectOptions.find(option => option.value === event.target.value)
        if (option) return setSelectOption(option)
    }

    return (
        <Box display={'flex'} minHeight={'100vh'}>
            <Sidebar />

            <Box flexDirection={'column'} boxSizing='border-box' flex={1} padding={'1rem'} sx={{ maxWidth: 'calc(100% - 15rem)', }} m={'1rem'}>
                <Text fontSize={'3xl'} color={'blue.700'}>Dados do sistema</Text>
                <Box display={'flex'} width={'100%'} flexDirection={'column'}>

                    <Text>Selecione o tipo de dado</Text>
                    <Select width={'250px'} onChange={setSelectedOption} value={selectOption.value}>
                        {searchSelectOptions.map(
                            option =>
                                <option value={option.value} key={option.value}>
                                    {option.label}
                                </option>
                        )}

                    </Select>
                    {selectOption.value === 'departamento' && (<DepartmentTable />)}
                    {selectOption.value === 'empresa' && (<CompanyTable />)}
                    {selectOption.value === 'cidade' && (<CityTable />)}
                    {selectOption.value === 'sala' && (<RoomTable />)}
                    {selectOption.value === 'tiposala' && (<RoomTypeTable />)}

                </Box>
            </Box>
        </Box>
    )
}