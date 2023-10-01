'use client'
import { Box, Text, Divider, Select, Input, Accordion, Button } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const DataTable = dynamic(() => import('@/components/DataTable'), { ssr: false })
import Sidebar from '@/components/Sidebar'
import { AccordionItemStyled } from '@/components/Accordion/AccordionItemStyled'
import { useAuth } from '@/context/AuthContext'
import { ChangeEvent, useEffect, useState } from 'react'
import { api } from '@/api/api'
import { Category, Company, Manufacturer, Department, Equipamento, Situation } from '@/utils/types'
import { DeleteIcon } from '@chakra-ui/icons'



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

          <Box borderRadius={'6px'} overflowX={'auto'} shadow={'outline'} m='1rem' overflowY={'auto'}>
            <DataTable />
          </Box>

        </Box>
      </Box >
    </Box>
  )
}
