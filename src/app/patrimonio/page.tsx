'use client'

import Sidebar from '@/components/Sidebar'
import { Box, Text, Divider } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} height={'100%'}>

      <Text fontSize='xl' color={'blue.700'}>Patrimônios Cadastrados</Text>
      <Divider />



    </Box>
  )
}
