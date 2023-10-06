import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { GenericTableType } from "@/components/GenericTable";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HamburgerIcon } from "@chakra-ui/icons";
const DataTableBlock = dynamic<GenericTableType<Block>>(() => import('@/components/GenericTable'), { ssr: false })
import { Block } from "@/utils/types";
import { BlockModal } from "./BlockRegisterModal";
import { BlockUpdateModal } from "./BlockUpdateModal";

export function BlockTable() {

    const { getOne, fetchTableDescriptionData, blockData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<Block>()

    const blockRegisterModal = useDisclosure();
    const blockUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<Block>('block', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                console.log('erro get ', error)
            }
            blockUpdateModal.onOpen()
        }


        return (
            <Box display={'flex'} gap={'1rem'}>
                <BlockUpdateModal dataQuery={dataQuery}
                    onClose={blockUpdateModal.onClose} open={blockUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<Block>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdBlocoDepartamento',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Bloco',
            accessorKey: 'DescricaoBlocoDepartamento',
        },

    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' p={'1rem'}>
            <Button onClick={blockRegisterModal.onOpen}>Adicionar</Button>
            <BlockModal dataQuery={dataQuery} onClose={blockRegisterModal.onClose} open={blockRegisterModal.isOpen} isCentered />
            <DataTableBlock columns={columns} data={blockData} />
        </Box>

    )
}