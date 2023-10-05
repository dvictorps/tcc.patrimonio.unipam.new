import { Department } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import { ActionMenu } from "../PatrimonioLista/ActionMenu";
import { useApi } from "@/context/ApiContext";

export function DepartmentColumns() {

    const { getBlock, getDepartmentSituation, getDepType } = useApi()

    const columns: ColumnDef<Department>[] = [
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

