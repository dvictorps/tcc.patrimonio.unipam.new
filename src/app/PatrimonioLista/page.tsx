'use client'
import { Box, Text, useDisclosure } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { Equipamento, Situation } from '@/utils/types'
const DataTable = dynamic<DataTableType<Equipamento>>(() => import('@/components/DataTable'), { ssr: false })
import Sidebar from '@/components/Sidebar'
import { HTMLProps, useEffect, useRef, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useApi } from '@/context/ApiContext'
import { ActionMenu } from './ActionMenu'
import { DataTableType } from '@/components/DataTable'

export default function PatrimonioLista() {

  const { categoryData, companyData, manufacturerData, departmentData, situationData, arrayLength, deleteIds, useFetchData, roomData } = useApi();

  console.log(categoryData)
  const route = 'equipment'

  const searchSelectOptions = [
    {
      label: 'Nº de Patrimonio',
      value: 'searchPatrim'
    },
    {
      label: 'Serial',
      value: 'searchSerial'
    },
    {
      label: 'Descrição',
      value: 'searchDesc'
    },
  ]

  const [searchValue, setSearchValue] = useState('')
  const [selectOption, setSelectOption] = useState(searchSelectOptions[0]);
  const [situationValue, setSituationValue] = useState<Situation>({
    IdSituacaoEquipamento: 1,
    DescricaoSituacaoEquipamento: "Ativo"
  })

  const dataQuery = useFetchData<Equipamento>(selectOption, searchValue, route, situationValue.IdSituacaoEquipamento)

  function IndeterminateCheckbox({
    indeterminate,
    className = '',
    ...rest
  }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = useRef<HTMLInputElement>(null!)

    useEffect(() => {
      if (typeof indeterminate === 'boolean') {
        ref.current.indeterminate = !rest.checked && indeterminate
      }
    }, [ref, indeterminate])

    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + ' cursor-pointer'}
        {...rest}
      />
    )
  }

  const columns: ColumnDef<Equipamento>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },
    {
      header: 'Ações',
      accessorKey: 'IdEquipamento',
      cell: info => ActionMenu(info.getValue<number>(), dataQuery)
    },
    {
      header: 'Nº Patrimônio',
      accessorKey: 'Patrimonio'
    },
    {
      header: 'Departamento',
      accessorKey: 'IdDepartamento',
      cell: info => getDepartment(info.getValue<number>()),
    },
    {
      header: 'Sala Associada',
      accessorKey: 'IdSala',
      cell: info => getRoom(info.getValue<number>()),
    },
    {
      header: 'Tipo Equipamento',
      accessorKey: 'IdCategoriaEquipamento',
      cell: info => getCategory(info.getValue<number>()),
    },
    {
      header: 'Situação Equipamento',
      accessorKey: 'IdSituacaoEquipamento',
      cell: info => getSituation(info.getValue<number>()),
    },
    {
      header: 'Número Serial',
      accessorKey: 'NumeroSerial'
    },
    {
      header: 'Data Aquisição',
      accessorKey: 'DataAquisicao',
      cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
    },
    {
      header: 'Data Cadastro',
      accessorKey: 'DataCadastro',
      cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
    },
    {
      header: 'Vencimento Garantia',
      accessorKey: 'VencimentoGarantia',
      cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
    },
    {
      header: 'Data Modificação',
      accessorKey: 'DataModificacao',
      cell: info => formatDateTime(info.getValue<string>()),
    },
    {
      header: 'Empresa',
      accessorKey: 'IdEmpresa',
      cell: info => getCompany(info.getValue<number>()),
    },
    {
      header: 'Fabricante',
      accessorKey: 'IdFabricante',
      cell: info => getManufacturer(info.getValue<number>()),
    },
  ]

  function getCategory(id: number) {
    const category = categoryData.find((category) => category.IdCategoriaEquipamento === id);
    return category?.DescricaoCategoriaEquipamento
  }

  function getCompany(id: number) {
    const company = companyData.find((company) => company.IdEmpresa === id);
    return company?.NomeEmpresa
  }

  function getManufacturer(id: number) {
    const manufacturer = manufacturerData.find((manufacturer) => manufacturer.IdFabricante === id);
    return manufacturer?.NomeFabricante
  }

  function getDepartment(id: number) {
    const department = departmentData.find((department) => department.IdDepartamento === id);
    return department?.NomeDepartamento
  }

  function getSituation(id: number) {
    const situation = situationData.find((situation) => situation.IdSituacaoEquipamento === id);
    return situation?.DescricaoSituacaoEquipamento
  }

  function getRoom(id: number) {
    const room = roomData.find((room) => room.IdSala === id);
    return room?.DescricaoSala
  }


  function formatDateTime(date: Date | string | null) {

    if (date === null) return 'Não modificado'

    return new Date(date).toLocaleDateString()
  }

  const idsComBaseNaPosicao = deleteIds.map((posicao) => {
    if (posicao >= 0 && posicao < arrayLength.arrayLength) {
      return (`&equipments=${dataQuery.data?.data[posicao].IdEquipamento}`)
    }
    return '';
  });

  useEffect(() => {
    dataQuery.refetch()
  }, [])

  return (
    <Box display={'flex'} minHeight={'100vh'}>
      <Sidebar />
      <Box flexDirection={'column'} boxSizing='border-box' flex={1} padding={'1rem'} sx={{
        maxWidth: 'calc(100% - 15rem)',
      }}>
        <Text fontSize={'3xl'} color={'blue.700'}>Lista de Patrimonio</Text>
        <Box display={'flex'} width={'100%'} flexDirection={'column'}>
          <Box >
            <DataTable
              idPosit={idsComBaseNaPosicao}
              column={columns}
              searchSelectOptions={searchSelectOptions}
              arrayLength={arrayLength}
              dataQuery={dataQuery}
              selectOption={selectOption}
              setSearchValue={setSearchValue}
              setSelectOption={setSelectOption}
              setSituationValue={setSituationValue}
              situationData={situationData}
              situationValue={situationValue}
            />
          </Box>
        </Box>
      </Box >
    </Box>
  )
}

