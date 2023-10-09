'use client'
import { Box, Text, useDisclosure } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { Category, Company, Department, Equipamento, EquipamentoFormated, Manufacturer, Situation } from '@/utils/types'
const DataTable = dynamic<DataTableType<Equipamento>>(() => import('@/app/PatrimonioLista/DataTable'), { ssr: false })
import Sidebar from '@/components/Sidebar'
import { HTMLProps, useEffect, useRef, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { useApi } from '@/context/ApiContext'
import { ActionMenu } from './ActionMenu'
import { DataTableType } from '@/app/PatrimonioLista/DataTable'

export default function PatrimonioLista() {

  const { categoryData, companyData, manufacturerData, departmentData, situationData, arrayLength, deleteIds, useFetchData, roomData,
    useFetchFullData, fetchTableDescriptionData } = useApi();

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
    IdSituacaoEquipamento: undefined,
    DescricaoSituacaoEquipamento: "Ativo"
  })
  const [companyValue, setCompanyValue] = useState<Company>({
    IdEmpresa: undefined,
    NomeEmpresa: undefined,
  })
  const [categoryValue, setCategoryValue] = useState<Category>({
    IdCategoriaEquipamento: undefined,
    DescricaoCategoriaEquipamento: undefined
  })
  const [manufacturerValue, setManufacturerValue] = useState<Manufacturer>({
    IdFabricante: undefined,
    NomeFabricante: undefined
  })
  const [departmentValue, setDepartmentValue] = useState<Department>({
    IdDepartamento: undefined,
    NomeDepartamento: undefined
  })

  const dataQuery = useFetchData<Equipamento>(selectOption, searchValue, route, situationValue.IdSituacaoEquipamento?.toString()
    || '', companyValue.IdEmpresa?.toString() || '', categoryValue.IdCategoriaEquipamento?.toString() || ''
    , manufacturerValue.IdFabricante?.toString() || '', departmentValue.IdDepartamento?.toString() || '')

  const dataQueryFull = useFetchFullData<EquipamentoFormated>(selectOption, searchValue, 'equipment/formated/get', situationValue.IdSituacaoEquipamento?.toString()
    || '', companyValue.IdEmpresa?.toString() || '', categoryValue.IdCategoriaEquipamento?.toString() || ''
    , manufacturerValue.IdFabricante?.toString() || '', departmentValue.IdDepartamento?.toString() || '')

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
    {
      header: 'Descrição',
      accessorKey: 'DescricaoEquipamento',
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
    fetchTableDescriptionData();
    dataQuery.refetch();
    dataQueryFull.refetch();
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
              dataQueryFull={dataQueryFull}
              categoryValue={categoryValue}
              companyValue={companyValue}
              departmentValue={departmentValue}
              manufacturerValue={manufacturerValue}
              setCategoryValue={setCategoryValue}
              setCompanyValue={setCompanyValue}
              setDepartmentValue={setDepartmentValue}
              setManufacturerValue={setManufacturerValue}
            />
          </Box>
        </Box>
      </Box >
    </Box>
  )
}

