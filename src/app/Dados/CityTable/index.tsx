import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { CityModal } from "./CityRegisterModal";
import { GenericTableType } from "@/components/GenericTable";
import { City } from "@/utils/types";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CityUpdateModal } from "./CityUpdateModal";
import { HamburgerIcon, DeleteIcon } from "@chakra-ui/icons";
import { api } from "@/api/api";
const DataTableCity = dynamic<GenericTableType<City>>(() => import('@/components/GenericTable'), { ssr: false })

export function CityTable() {

    const { getOne, cityData, fetchTableDescriptionData, stateData, getState } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<City>()

    const cityRegisterModal = useDisclosure();
    const cityUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<City>('city', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                console.log('erro get ', error)
            }
            cityUpdateModal.onOpen()
        }


        return (
            <Box display={'flex'} gap={'1rem'}>
                <CityUpdateModal dataQuery={dataQuery} stateData={stateData}
                    onClose={cityUpdateModal.onClose} open={cityUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<City>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdCidade',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Cidade',
            accessorKey: 'NomeCidade',
        },
        {
            header: 'Estado',
            accessorKey: 'IdEstado',
            cell: info => getState(info.getValue<number>()),
        },
    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' p={'1rem'}>
            <Button onClick={cityRegisterModal.onOpen}>Adicionar</Button>
            <CityModal stateData={stateData} dataQuery={dataQuery} onClose={cityRegisterModal.onClose} open={cityRegisterModal.isOpen} isCentered />
            <DataTableCity columns={columns} data={cityData} />
        </Box>

    )
}