'use client'

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


  return (
    <Box display={'flex'} gap={'2rem'} flexDirection={'column'} >
      <Text fontSize={'3xl'} color={'blue.700'}>Bem Vindo, Victor Pereira.</Text>

      <Box display={'flex'} flexDirection={'row'} gap={'4rem'} justifyContent={'center'} flexWrap={'wrap'}>
        <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} width={'45%'} >
          <Text fontSize={'3xl'}>Separação por Departamento</Text>
          <Doughnut data={data1} />
        </Box>

        <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} width={'45%'}>
          <Text fontSize={'3xl'}>Separação por tipo</Text>
          <Doughnut data={data} />
        </Box>

      </Box>
    </Box>
  )
}
