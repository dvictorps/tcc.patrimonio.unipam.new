import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { RoomTypeModal } from "./RoomTypeRegisterModal";
import { GenericTableType } from "@/components/GenericTable";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { RoomTypeUpdateModal } from "./RoomTypeUpdateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
import { RoomType } from "@/utils/types";
const DataTableRoomType = dynamic<GenericTableType<RoomType>>(() => import('@/components/GenericTable'), { ssr: false })

export function RoomTypeTable() {

    const { getOne, fetchTableDescriptionData, roomTypeData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<RoomType>()

    const roomTypeRegisterModal = useDisclosure();
    const roomTypeUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<RoomType>('roomType', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                console.log('erro get ', error)
            }
            roomTypeUpdateModal.onOpen()
        }


        return (
            <Box display={'flex'} gap={'1rem'}>
                <RoomTypeUpdateModal dataQuery={dataQuery}
                    onClose={roomTypeUpdateModal.onClose} open={roomTypeUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<RoomType>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdTipoSala',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Tipo Sala',
            accessorKey: 'DescricaoTipoSala',
        },

    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' p={'1rem'}>
            <Button onClick={roomTypeRegisterModal.onOpen}>Adicionar</Button>
            <RoomTypeModal dataQuery={dataQuery} onClose={roomTypeRegisterModal.onClose} open={roomTypeRegisterModal.isOpen} isCentered />
            <DataTableRoomType columns={columns} data={roomTypeData} />
        </Box>

    )
}