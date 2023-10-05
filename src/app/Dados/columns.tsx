import { Department } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { useApi } from "@/context/ApiContext";
import { useState } from "react";
import { Button, IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";



export function DepartmentColumns(onOpen: () => void) {

    const { getBlock, getDepartmentSituation, getDepType, getOne } = useApi()

    const [componentData, setComponentData] = useState<Department>()

    async function handleGet(id: number) {
        try {
            const response = await getOne<Department>('department', id.toString())
            setComponentData(response)


        } catch (error) {
            setComponentData({})
            console.log('erro get ', error)
        }
    }

    function drawButton(id: number) {
        handleGet(id);
        console.log(componentData)
        return <IconButton onClick={onOpen} aria-label="edit" icon={<HamburgerIcon />} />
    }


    const columns: ColumnDef<Department>[] = [
        {
            header: 'Ações',
            accessorKey: 'IdDepartamento',
            cell: info => drawButton(info.getValue<number>())
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

    return columns

}

