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


const searchSelectOptions = [
  {
    label: 'Nº de Patrimonio',
    value: 'searchPatrim'
  },
  {
    label: 'Serial',
    value: 'searchSerial'
  },
  {
    label: 'Descrição',
    value: 'searchDesc'
  },

]


export default function PatrimonioLista() {

  const { user } = useAuth();

  const [searchValue, setSearchValue] = useState('')
  const [selectOption, setSelectOption] = useState(searchSelectOptions[0]);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [manufacturerData, setManufacturerData] = useState<Manufacturer[]>([]);
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [situationData, setSituationData] = useState<Situation[]>([]);

  function setSelectedOption(event: ChangeEvent<HTMLSelectElement>) {

    const option = searchSelectOptions.find(option => option.value === event.target.value)

    if (option) return setSelectOption(option)
  }


  const [pageIndex, setPageIndex] = useState(0)

  const [pageSize, setPageSize] = useState(10)

  async function fetchTableData() {
    try {
      const response = await api.get(`/equipment?${selectOption.value}=${searchValue}&take=${pageSize}&skip=${pageIndex}`)
      setTableData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  function handleButton() {
    setPageIndex(pageIndex + 1 * pageSize)
    console.log('PAGEINDEX:', pageIndex)
  }


  console.log('teste de input:', selectOption)
  console.log('pesquisa teste:', searchValue)


  const [tableData, setTableData] = useState<Equipamento[]>([]);

  async function fetchTableDescriptionData() {

    const urls = [
      '/category',
      '/company',
      '/manufacturer',
      '/department',
      '/situation'
    ]


    const requests = urls.map((url) => api.get(url));

    Promise.all(requests)
      .then((responses) => {

        const category = responses[0].data;
        const company = responses[1].data;
        const manufacturer = responses[2].data;
        const department = responses[3].data;
        const situation = responses[4].data;

        setCategoryData(category);
        setCompanyData(company);
        setManufacturerData(manufacturer);
        setDepartmentData(department);
        setSituationData(situation);



      })
      .catch((error) => {
        console.error('Erro nas requisições:', error);
      });
  }


  useEffect(() => {

    fetchTableData();
    fetchTableDescriptionData();

  }, [pageIndex])



  return (
    <Box display={'flex'} minHeight={'100vh'}>
      <Sidebar />
      <Box flexDirection={'column'} boxSizing='border-box' flex={1} padding={'1rem'} sx={{
        maxWidth: 'calc(100% - 15rem)',
      }}>
        <Text fontSize={'3xl'} color={'blue.700'}>Lista de Patrimonio</Text>
        <Box display={'flex'} width={'100%'} flexDirection={'column'}>
          <Accordion defaultIndex={[0]} allowToggle colorScheme='blackAlpha' >
            <AccordionItemStyled title='Filtros Avançados'>
              <Box p='1rem'>
                <Box display={'flex'} flexDirection={'column'}>
                  <Text>Selecione uma opção para busca</Text>
                  <Box display={'flex'} flexDirection={'row'} gap={'1rem'}>
                    <Select placeholder='Selecionar opção' width={'250px'} onChange={setSelectedOption} defaultValue={selectOption.value}>
                      {searchSelectOptions.map(
                        selectOption =>
                          <option value={selectOption.value} key={selectOption.value}>
                            {selectOption.label}
                          </option>
                      )}
                    </Select>
                    <Input placeholder="Pesquisar" w={'250px'} onChange={event => setSearchValue(event.target.value)} />
                    <Button onClick={fetchTableData}>Pesquisar</Button>
                  </Box>
                </Box>
              </Box>
            </AccordionItemStyled>
          </Accordion>
          <Button onClick={handleButton}>teste</Button>
          <Box borderRadius={'6px'} overflowX={'auto'} shadow={'outline'} m='1rem' overflowY={'auto'}>
            <DataTable
              tableData={tableData}
              categoryData={categoryData}
              companyData={companyData}
              departmentData={departmentData}
              manufacturerData={manufacturerData}
              situationData={situationData}
            />
          </Box>

        </Box>
      </Box >
    </Box>
  )
}
