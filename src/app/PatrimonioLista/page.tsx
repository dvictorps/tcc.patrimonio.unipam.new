'use client'
import { Box, Text, Divider } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const DataTable = dynamic(() => import('@/components/DataTable'), { ssr: false })
import mData from '@/app/mock/data_table.json'
import Sidebar from '@/components/Sidebar'

export default function PatrimonioLista() {
  return (
    <Sidebar>
    <Box flexDirection={'column'} >
      <Text fontSize={'3xl'} color={'blue.700'}>Lista de Patrimônios</Text>
      <Box display={'flex'} width={'100%'} justifyContent={'center'}>
        <Box borderRadius={'6px'} overflowX={'auto'} shadow={'outline'} m='1rem'>
          <DataTable tableData={mData}/>
        </Box>
      </Box>
    </Box >
    </Sidebar>
  )
}
