'use client'
import { Box, Text, Divider, Select, Input, Accordion } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const DataTable = dynamic(() => import('@/components/DataTable'), { ssr: false })
import mData from '@/app/mock/data_table.json'
import Sidebar from '@/components/Sidebar'
import { AccordionItemStyled } from '@/components/Accordion/AccordionItemStyled'

export default function PatrimonioLista() {
  return (

    <Sidebar>
      <Box flexDirection={'column'} >
        <Text fontSize={'3xl'} color={'blue.700'}>Lista de Patrimônios</Text>
        <Box display={'flex'} width={'100%'} flexDirection={'column'}>
          <Accordion allowToggle colorScheme='blackAlpha'>
            <AccordionItemStyled title='Filtros Avançados'>
              <Box p='1rem'>
                <Box display={'flex'} flexDirection={'column'}>
                  <Text>Selecione uma opção para busca</Text>
                  <Box display={'flex'} flexDirection={'row'} gap={'1rem'}>
                    <Select placeholder='Selecionar opção' width={'250px'}>
                      <option value='patrimonio'>Nº de Patrimonio</option>
                      <option value='serial'>Serial</option>
                      <option value='descricao'>Descrição</option>
                    </Select>
                    <Input placeholder="Pesquisar" w={'250px'} />
                  </Box>
                </Box>
              </Box>
            </AccordionItemStyled>
          </Accordion>
          <Box borderRadius={'6px'} overflowX={'auto'} shadow={'outline'} m='1rem'>
            <DataTable tableData={mData} />
          </Box>
        </Box>
      </Box >
    </Sidebar>
  )
}
