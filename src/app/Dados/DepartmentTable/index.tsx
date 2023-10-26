import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { DepartmentModal } from "./DepartmentRegisterModal";
import { GenericTableType } from "@/components/GenericTable";
import { Department } from "@/utils/types";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DepartmentUpdateModal } from "./DepartmentUpdateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
const DataTableDepartamento = dynamic<GenericTableType<Department>>(() => import('@/components/GenericTable'), { ssr: false })

export function DepartmentTable() {

    const { getBlock, getDepartmentSituation, getDepType, getOne, blockData, depTypeData, departmentSituationData, fetchTableDescriptionData, departmentData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<Department>()

    const departmentRegisterModal = useDisclosure();
    const departmentUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<Department>('department', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                // console.log('erro get ', error)
            }
            departmentUpdateModal.onOpen()
        }

        return (
            <Box>
                <DepartmentUpdateModal dataQuery={dataQuery} blockData={blockData} depTypeData={depTypeData}
                    departmentSituationData={departmentSituationData}
                    onClose={departmentUpdateModal.onClose} open={departmentUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<Department>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdDepartamento',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Nome Departamento',
            accessorKey: 'NomeDepartamento'
        },
        {
            header: 'Bloco Departamento',
            accessorKey: 'IdBlocoDepartamento',
            cell: info => getBlock(info.getValue<number>()),
        },
        {
            header: 'Situação Departamento',
            accessorKey: 'IdSituacaoDepartamento',
            cell: info => getDepartmentSituation(info.getValue<number>()),
        },
        {
            header: 'Tipo Departamento',
            accessorKey: 'IdTipoDepartamento',
            cell: info => getDepType(info.getValue<number>()),
        },
    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem'>
            <Box p={'1rem'}>
                <Button onClick={departmentRegisterModal.onOpen}>Adicionar</Button></Box>
            <DepartmentModal dataQuery={dataQuery} blockData={blockData} depTypeData={depTypeData} departmentSituationData={departmentSituationData}
                onClose={departmentRegisterModal.onClose} open={departmentRegisterModal.isOpen} isCentered />

            <DataTableDepartamento columns={columns} data={departmentData} />
        </Box>

    )
}