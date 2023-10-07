import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { GenericTableType } from "@/components/GenericTable";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ManufacturerModal } from "./ManufacturerRegisterModal";
import { ManufacturerUpdateModal } from "./ManufacturerUpdateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Manufacturer } from "@/utils/types";
const DataTableManufacturer = dynamic<GenericTableType<Manufacturer>>(() => import('@/components/GenericTable'), { ssr: false })

export function ManufacturerTable() {

    const { getOne, fetchTableDescriptionData, manufacturerData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<Manufacturer>()

    const ManufacturerRegisterModal = useDisclosure();
    const manufacturerUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<Manufacturer>('manufacturer', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                console.log('erro get ', error)
            }
            manufacturerUpdateModal.onOpen()
        }


        return (
            <Box display={'flex'} gap={'1rem'}>
                <ManufacturerUpdateModal dataQuery={dataQuery}
                    onClose={manufacturerUpdateModal.onClose} open={manufacturerUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<Manufacturer>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdFabricante',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Fabricante',
            accessorKey: 'NomeFabricante',
        },

    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem'>
            <Box p={'1rem'}>
                <Button onClick={ManufacturerRegisterModal.onOpen}>Adicionar</Button>
            </Box>
            <ManufacturerModal dataQuery={dataQuery} onClose={ManufacturerRegisterModal.onClose} open={ManufacturerRegisterModal.isOpen} isCentered />
            <DataTableManufacturer columns={columns} data={manufacturerData} />
        </Box>

    )
}