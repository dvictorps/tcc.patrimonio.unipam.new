import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { RoomModal } from "./RoomRegisterModal";
import { GenericTableType } from "@/components/GenericTable";
import { Department, Room } from "@/utils/types";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { RoomUpdateModal } from "./RoomUpdateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
const DataTableRoom = dynamic<GenericTableType<Room>>(() => import('@/components/GenericTable'), { ssr: false })

export function RoomTable() {

    const { getBlock, getOne, fetchTableDescriptionData, roomData, roomTypeData, roomSituationData, blockData, getRoomSituation, getRoomType } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<Department>()

    const roomRegisterModal = useDisclosure();
    const roomUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<Department>('room', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                console.log('erro get ', error)
            }
            roomUpdateModal.onOpen()
        }

        return (
            <Box>
                <RoomUpdateModal dataQuery={dataQuery} blockData={blockData} roomSituationData={roomSituationData} roomTypeData={roomTypeData}
                    onClose={roomUpdateModal.onClose} open={roomUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<Room>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdSala',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Descrição Sala',
            accessorKey: 'DescricaoSala'
        },
        {
            header: 'Bloco Departamento',
            accessorKey: 'IdBlocoDepartamento',
            cell: info => getBlock(info.getValue<number>()),
        },
        {
            header: 'Situação Sala',
            accessorKey: 'IdSituacaoSala',
            cell: info => getRoomSituation(info.getValue<number>()),
        },
        {
            header: 'Tipo Sala',
            accessorKey: 'IdTipoSala',
            cell: info => getRoomType(info.getValue<number>()),
        },
    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' p={'1rem'}>
            <Button onClick={roomRegisterModal.onOpen}>Adicionar</Button>
            <RoomModal dataQuery={dataQuery} blockData={blockData} roomSituationData={roomSituationData} roomTypeData={roomTypeData}
                onClose={roomRegisterModal.onClose} open={roomRegisterModal.isOpen} isCentered />

            <DataTableRoom columns={columns} data={roomData} />
        </Box>

    )
}