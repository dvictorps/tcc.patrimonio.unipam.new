'use client'
import { Box, Text, Divider } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
// const ReactDataTable = dynamic(() => import('@/components/ReactDataTable'), { ssr: false })
const DataTable = dynamic(() => import('@/components/DataTable'), { ssr: false })

export default function PatrimonioLista() {
  return (
    <Box flexDirection={'column'} >
      <Text fontSize={'3xl'} color={'blue.700'}>Lista de Patrimônios</Text>
      <Box display={'flex'} width={'100%'} justifyContent={'center'}>
        <Box borderRadius={'6px'} overflowX={'auto'} shadow={'outline'} m='1rem'>
          {/* <ReactDataTable /> */}
          <DataTable />
        </Box>
      </Box>
    </Box >
  )
}
