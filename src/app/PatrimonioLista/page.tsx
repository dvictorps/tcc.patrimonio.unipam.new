'use client'
import { Box, Text, Divider, Select, Input, Accordion, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const DataTable = dynamic(() => import('@/components/DataTable'), { ssr: false })
import Sidebar from '@/components/Sidebar'
import { AccordionItemStyled } from '@/components/Accordion/AccordionItemStyled'
import { useAuth } from '@/context/AuthContext'
import { ChangeEvent, HTMLProps, useEffect, useRef, useState } from 'react'
import { api } from '@/api/api'
import { Category, Company, Manufacturer, Department, Equipamento, Situation } from '@/utils/types'
import { DeleteIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons'
import { ColumnDef } from '@tanstack/react-table'
import { ModalStyled } from '@/components/Modal'

const deleteUniqueModal = useDisclosure();

function ActionMenu(id: number) {
  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={<HamburgerIcon />}
          variant='outline'
        />
        <MenuList>
          <MenuItem icon={<EditIcon />}>
            Editar
          </MenuItem>
          <MenuItem icon={<DeleteIcon />} onClick={deleteUniqueModal.onOpen}>
            Remover
          </MenuItem>
        </MenuList>
      </Menu>
      <ModalStyled title="Remover"
        onClose={deleteUniqueModal.onClose}
        open={deleteUniqueModal.isOpen}
        isCentered={true}
      >
        <ModalBody>
          <Text>
            Você está prestes a remover este registro. Deseja prosseguir com a operação?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Box display={'inline-flex'} gap={'1rem'}>
            <Button colorScheme="red" rightIcon={<DeleteIcon />}>Confirmar remoção</Button>
            <Button onClick={deleteUniqueModal.onClose}>Cancel</Button>
          </Box>
        </ModalFooter>
      </ModalStyled>
    </>

  )
}

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

console.log(deleteUniqueModal.isOpen)

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
    header: 'Nº Patrimônio',
    accessorKey: 'Patrimonio'
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
    header: 'Departamento',
    accessorKey: 'IdDepartamento',
    cell: info => getDepartment(info.getValue<number>()),
  },
  {
    header: 'Ações',
    accessorKey: 'IdEquipamento',
    cell: info => ActionMenu(info.getValue<number>())
  }
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


function formatDateTime(date: Date | string | null) {

  if (date === null) return 'Não modificado'

  return new Date(date).toLocaleDateString()

}


export default function PatrimonioLista() {

  const { user } = useAuth();


  return (
    <Box display={'flex'} minHeight={'100vh'}>
      <Sidebar />
      <Box flexDirection={'column'} boxSizing='border-box' flex={1} padding={'1rem'} sx={{
        maxWidth: 'calc(100% - 15rem)',
      }}>
        <Text fontSize={'3xl'} color={'blue.700'}>Lista de Patrimonio</Text>
        <Box display={'flex'} width={'100%'} flexDirection={'column'}>

          <Box >
            <DataTable column={columns} />
          </Box>

        </Box>
      </Box >
    </Box>
  )
}
