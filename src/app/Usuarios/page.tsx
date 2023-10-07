'use client'
import { Box, Text } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import { UsersTable } from "./UsersTable";

export default function Cadastrar() {


  return (
    <Box display={'flex'} minHeight={'100vh'}>
      <Sidebar />
      <Box flexDirection={'column'} boxSizing='border-box' flex={1} padding={'1rem'} sx={{
        maxWidth: 'calc(100% - 15rem)',
      }}>
        <Text fontSize={'3xl'} color={'blue.700'}>Usuários</Text>
        <Box>
          <UsersTable />
        </Box>
      </Box>
    </Box>

  )
}
