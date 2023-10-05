'use client'
import { useApi } from "@/context/ApiContext";
import { Department } from "@/utils/types"
import dynamic from "next/dynamic";
import { GenericTableType } from "@/components/GenericTable";
import { DepartmentColumns } from "./columns";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { DepartmentModal } from "./DepartmentModal";
import { useEffect, useReducer, useState } from "react";
import { useQuery } from "react-query";

const DataTableDepartamento = dynamic<GenericTableType<Department>>(() => import('@/components/GenericTable'), { ssr: false })

export default function Dados() {

    const { categoryData, companyData, manufacturerData, departmentData, situationData, roomData,
        roomTypeData, roomSituationData, depTypeData, blockData, cityData, stateData, departmentSituationData, fetchTableDescriptionData } = useApi();

    const departmentModal = useDisclosure()
    const departmentModal2 = useDisclosure()

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    return (
        <>

            <Box borderRadius={'6px'} shadow={'outline'} m='1rem' p={'1rem'}>

                <Button onClick={departmentModal.onOpen} colorScheme="blue">Adicionar</Button>
                <DepartmentModal dataQuery={dataQuery} blockData={blockData} depTypeData={depTypeData} departmentSituationData={departmentSituationData}
                    onClose={departmentModal.onClose} open={departmentModal.isOpen} isCentered />

                <DepartmentModal dataQuery={dataQuery} blockData={blockData} depTypeData={depTypeData} departmentSituationData={departmentSituationData}
                    onClose={departmentModal2.onClose} open={departmentModal2.isOpen} isCentered />

                <DataTableDepartamento dataQuery={dataQuery} columns={DepartmentColumns(departmentModal2.onOpen)} data={departmentData} />
            </Box>
        </>
    )
}