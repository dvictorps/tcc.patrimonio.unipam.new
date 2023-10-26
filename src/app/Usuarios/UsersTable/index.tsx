import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { UsersModal } from "./UsersRegisterModal";
import { GenericTableType } from "@/components/GenericTable";
import { Users } from "@/utils/types";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { UsersUpdateModal } from "./UsersUpdateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
const DataTableUsers = dynamic<GenericTableType<Users>>(() => import('@/components/GenericTable'), { ssr: false })

export function UsersTable() {

    const { getPersonSituation, getPersonType, getOne, personTypeData, personSituationData, fetchTableDescriptionData, usersData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<Users>()

    const usersRegisterModal = useDisclosure();
    const usersUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<Users>('users', id.toString())
                setComponentData(response)


            } catch (error) {

                // console.log('erro get ', error)
            }
            usersUpdateModal.onOpen()
        }

        return (
            <Box>
                <UsersUpdateModal dataQuery={dataQuery} personTypeData={personTypeData}
                    personSituationData={personSituationData}
                    onClose={usersUpdateModal.onClose} open={usersUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<Users>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdPessoa',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Nome',
            accessorKey: 'Nome'
        },
        {
            header: 'Usuário',
            accessorKey: 'Usuario',
        },
        {
            header: 'Email',
            accessorKey: 'Email',
        },
        {
            header: 'Situação',
            accessorKey: 'IdSituacaoPessoa',
            cell: info => getPersonSituation(info.getValue<number>()),
        },
        {
            header: 'Permissões',
            accessorKey: 'IdTipoPessoa',
            cell: info => getPersonType(info.getValue<number>()),
        },
    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' p={'1rem'}>
            <Button onClick={usersRegisterModal.onOpen}>Adicionar</Button>
            <UsersModal dataQuery={dataQuery} personSituationData={personSituationData} personTypeData={personTypeData}
                onClose={usersRegisterModal.onClose} open={usersRegisterModal.isOpen} isCentered />

            <DataTableUsers columns={columns} data={usersData} />
        </Box>

    )
}