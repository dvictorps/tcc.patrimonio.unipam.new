'use client'

import { api } from '@/api/api';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Equipamento, ReqData } from '@/utils/types';
import { Box, Text, Divider } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {

  const [graphicsData, setGraphicsData] = useState<{ [key: string]: number }>({})
  const [equipmentData, setEquipmentData] = useState(0)
  const [barGraphicsData, setBarGraphicsData] = useState<{ [key: string]: number }>({})

  async function fetchGraphicsData() {
    try {
      const response = await api.get('equipment/graphics/count')
      const responseData = response.data
      setGraphicsData(responseData)

    } catch (error) {
      // console.log(error)
    }
  };

  async function fetchEquipmentData() {
    try {
      const response = await api.get('equipment')
      const responseTyped: ReqData<any> = await response.data
      const responseToSend = responseTyped.totalRecords
      setEquipmentData(responseToSend)

    } catch (error) {
      // console.log(error)
    }
  };

  async function fetchBarData() {
    try {
      const response = await api.get('equipment/graphics/bar')
      const responseData = response.data
      setBarGraphicsData(responseData)

    } catch (error) {
      // console.log(error)
    }
  };


  useEffect(() => {
    fetchGraphicsData();
    fetchEquipmentData();
    fetchBarData()
  }, [])

  const dataValues = [];

  for (const data in graphicsData) {
    if (graphicsData.hasOwnProperty(data)) {
      dataValues.push(graphicsData[data]);
    }
  }


  const barDataValues = [];

  for (const department in barGraphicsData) {
    if (barGraphicsData.hasOwnProperty(department)) {
      barDataValues.push(barGraphicsData[department]);
    }
  }


  function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.2)`; // RGBA com opacidade de 0.2
  }

  const data1 = {
    labels: Object.keys(barGraphicsData),
    datasets: [
      {
        label: 'Equipamentos:',
        data: barDataValues,
        backgroundColor: barDataValues.map(() => randomColor()),
        borderColor: barDataValues.map(() => randomColor()),
        borderWidth: 1,
      },
    ],
  };

  const data = {
    labels: ['Ativos', 'Baixados'],
    datasets: [
      {
        label: 'Número de registros',
        data: dataValues,
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



  const { user } = useAuth();

  return (
    <Box display={'flex'} minHeight={'100vh'}>
      <Sidebar />
      <Box display={'flex'} flexDirection={'column'} gap={'2rem'} flex={'1'} sx={{
        maxWidth: 'calc(100% - 15rem)'
      }} margin={'1rem'}>
        <Text fontSize={'3xl'} color={'blue.700'}>Bem Vindo, {user?.name}.</Text>
        <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} flexWrap={'wrap'}>
          <Text fontSize={'3xl'} color={'blue.700'}>Existem um total de {equipmentData} equipamentos cadastrados no sistema.</Text>
        </Box>

        <Box display={'flex'} flexDirection={'row'} sx={{
          '@media (max-width: 835px)': {
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center'
          },
        }}
          flexWrap={'wrap'} gap={'1rem'}>

          <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} flexWrap={'wrap'} width={'49%'} sx={{
            '@media (max-width: 835px)': {
              width: '90%'
            }
          }}>
            <Text fontSize={'3xl'}>Separação por situação</Text>
            <Doughnut data={data} />
          </Box>
          <Box shadow={'dark-lg'} borderRadius={'5px'} p={'1rem'} flexWrap={'wrap'} width={'49%'} sx={{
            '@media (max-width: 835px)': {
              width: '90%'
            }
          }}>
            <Text fontSize={'3xl'}>Separação por departamento</Text>
            <Pie data={data1} />
          </Box>
        </Box>
      </Box >
    </Box>

  )
}
