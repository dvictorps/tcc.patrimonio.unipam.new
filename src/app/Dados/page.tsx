'use client'
import { useApi } from "@/context/ApiContext";
import { Department } from "@/utils/types"
import dynamic from "next/dynamic";
import { GenericTableType } from "@/components/GenericTable";
import { DepartmentColumns } from "./columns";
import { Box } from "@chakra-ui/react";

const DataTableDepartamento = dynamic<GenericTableType<Department>>(() => import('@/components/GenericTable'), { ssr: false })

export default function Dados() {

    const { categoryData, companyData, manufacturerData, departmentData, situationData, roomData,
        roomTypeData, roomSituationData, depTypeData, blockData, cityData, stateData, departmentSituationData } = useApi();




    return (
        <>
            <Box borderRadius={'6px'} shadow={'outline'} m='1rem'>
                <DataTableDepartamento columns={DepartmentColumns()} data={departmentData} />
            </Box>
        </>
    )
}