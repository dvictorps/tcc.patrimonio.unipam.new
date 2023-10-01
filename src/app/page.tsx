'use client'

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Box, Text, Divider } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Patrimônios Registrados', 'Patrimônios Virtuais'],
  datasets: [
    {
      label: 'Número de Registros',
      data: [12, 19],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const data1 = {
  labels: ['Informática', 'DS', 'Secretaria', 'Bolsas', 'Sala Amarela'],
  datasets: [
    {
      label: 'Número de registros',
      data: [12, 19, 3, 5, 2],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderWidth: 1,
    },
  ],
};



export default function Home() {

  const { user } = useAuth();

  return (
    <Box display={'flex'} height={'100vh'}>
      <Sidebar />
      <Box display={'flex'} flexDirection={'column'} gap={'2rem'} flex={'1'} sx={{
        maxWidth: 'calc(100% - 15rem)'
      }} margin={'1rem'}>
        <Text fontSize={'3xl'} color={'blue.700'}>Bem Vindo, {user?.name}.</Text>
        <Box display={'flex'} flexDirection={'row'} sx={{
          '@media (max-width: 835px)': {
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          },
        }}
          justifyContent={'center'} flexWrap={'wrap'} gap={'1rem'}>

          <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} width={'45%'} sx={{
            '@media (max-width: 835px)': {
              width: '90%'
            }
          }}>
            <Text fontSize={'3xl'}>Separação por Departamento</Text>
            <Doughnut data={data1} />
          </Box>

          <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} flexWrap={'wrap'} width={'45%'} sx={{
            '@media (max-width: 835px)': {
              width: '90%'
            }
          }}>
            <Text fontSize={'3xl'}>Separação por tipo</Text>
            <Doughnut data={data} />
          </Box>

        </Box>
      </Box >
    </Box>

  )
}
