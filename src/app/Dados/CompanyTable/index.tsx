import { Box, Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { CompanyModal } from "./CompanyRegisterModal";
import { GenericTableType } from "@/components/GenericTable";
import { Company, Department } from "@/utils/types";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CompanyUpdateModal } from "./CompanyUpdateModal";
import { HamburgerIcon } from "@chakra-ui/icons";
const DataTableCompany = dynamic<GenericTableType<Company>>(() => import('@/components/GenericTable'), { ssr: false })

export function CompanyTable() {

    const { getCity, getOne, cityData, fetchTableDescriptionData, companyData } = useApi();

    const dataQuery = useQuery(
        ['data'],
        () => fetchTableDescriptionData(),
        { keepPreviousData: true }
    )

    const [componentData, setComponentData] = useState<Company>()

    const companyRegisterModal = useDisclosure();
    const companyUpdateModal = useDisclosure();


    function ButtonWorking(id: number) {

        async function handleGet() {
            try {
                const response = await getOne<Company>('company', id.toString())
                setComponentData(response)


            } catch (error) {
                setComponentData({})
                console.log('erro get ', error)
            }
            companyUpdateModal.onOpen()
        }

        return (
            <Box>
                <CompanyUpdateModal dataQuery={dataQuery} cityData={cityData}
                    onClose={companyUpdateModal.onClose} open={companyUpdateModal.isOpen} isCentered componentData={componentData} />
                <IconButton onClick={handleGet} aria-label="edit" icon={<HamburgerIcon />} />
            </Box>
        )
    }

    const columns: ColumnDef<Company>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdEmpresa',
            cell: info => ButtonWorking(info.getValue<number>())
        },
        {
            header: 'Nome Empresa',
            accessorKey: 'NomeEmpresa'
        },
        {
            header: 'Nome Representante',
            accessorKey: 'NomeRepresentante',

        },
        {
            header: 'Site da Empresa',
            accessorKey: 'SiteEmpresa',

        },
        {
            header: 'Email da Empresa',
            accessorKey: 'EmailEmpresa',

        },
        {
            header: 'Telefone da Empresa',
            accessorKey: 'TelefoneEmpresa',

        },
        {
            header: 'Cidade',
            accessorKey: 'IdCidade',
            cell: info => getCity(info.getValue<number>()),
        },
    ]

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' p={'1rem'}>
            <Button onClick={companyRegisterModal.onOpen}>Adicionar</Button>
            <CompanyModal cityData={cityData} dataQuery={dataQuery} onClose={companyRegisterModal.onClose} open={companyRegisterModal.isOpen} isCentered />

            <DataTableCompany columns={columns} data={companyData} />
        </Box>

    )
}