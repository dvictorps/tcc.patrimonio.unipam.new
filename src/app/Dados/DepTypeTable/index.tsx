import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { GenericTableType } from "@/components/GenericTable";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HamburgerIcon } from "@chakra-ui/icons";
const DataTableDepType = dynamic<GenericTableType<DepType>>(() => import('@/components/GenericTable'), { ssr: false })
import { DepTypeModal } from "./DepTypeRegisterModal";
import { DepTypeUpdateModal } from "./DepTypeUpdateModal";
import { DepType } from "@/utils/types";

export function DepTypeTable() {

    const { getOne, fetchTableDescriptionData, depTypeData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<DepType>()

    const depTypeRegisterModal = useDisclosure();
    const depTypeUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<DepType>('DepType', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                // console.log('erro get ', error)
            }
            depTypeUpdateModal.onOpen()
        }


        return (
            <Box display={'flex'} gap={'1rem'}>
                <DepTypeUpdateModal dataQuery={dataQuery}
                    onClose={depTypeUpdateModal.onClose} open={depTypeUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<DepType>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdTipoDepartamento',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Tipo Departamento',
            accessorKey: 'TipoDepartamento',
        },

    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem'>
            <Box p={'1rem'}>
                <Button onClick={depTypeRegisterModal.onOpen}>Adicionar</Button>
            </Box>
            <DepTypeModal dataQuery={dataQuery} onClose={depTypeRegisterModal.onClose} open={depTypeRegisterModal.isOpen} isCentered />
            <DataTableDepType columns={columns} data={depTypeData} />
        </Box>

    )
}