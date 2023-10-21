import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { GenericTableType } from "@/components/GenericTable";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { HamburgerIcon } from "@chakra-ui/icons";
const DataTableCategory = dynamic<GenericTableType<Category>>(() => import('@/components/GenericTable'), { ssr: false })
import { CategoryModal } from "./CategoryRegisterModal";
import { CategoryUpdateModal } from "./CategoryUpdateModal";
import { Category } from "@/utils/types";

export function CategoryTable() {

    const { getOne, fetchTableDescriptionData, categoryData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<Category>()

    const categoryRegisterModal = useDisclosure();
    const categoryUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<Category>('category', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                console.log('erro get ', error)
            }
            categoryUpdateModal.onOpen()
        }


        return (
            <Box display={'flex'} gap={'1rem'}>
                <CategoryUpdateModal dataQuery={dataQuery}
                    onClose={categoryUpdateModal.onClose} open={categoryUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<Category>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdCategoriaEquipamento',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Categoria',
            accessorKey: 'DescricaoCategoriaEquipamento',
        },

    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem'>
            <Box p={'1rem'}>
                <Button onClick={categoryRegisterModal.onOpen}>Adicionar</Button>
            </Box>
            <CategoryModal dataQuery={dataQuery} onClose={categoryRegisterModal.onClose} open={categoryRegisterModal.isOpen} isCentered />
            <DataTableCategory columns={columns} data={categoryData} />
        </Box>

    )
}