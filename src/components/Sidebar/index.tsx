import { LuLayoutDashboard, LuActivitySquare, LuHome, LuPlus } from 'react-icons/lu'
import { MdLogout } from 'react-icons/md'
import { Img, Icon, Button, Box, Text, VStack, Divider } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'


const menuOptions = [
    {
        option: 'Início',
        icon: LuHome,
        id: 1,
        link: '/'
    },
    {
        option: 'Lista de Patrimônio',
        icon: LuLayoutDashboard,
        id: 2,
        link: '/PatrimonioLista'
    },
    {
        option: 'Dados',
        icon: LuActivitySquare,
        id: 3,
        link: '/Dados'
    },
    {
        option: 'Cadastrar Usuário',
        icon: LuPlus,
        id: 4,
        link: '/Cadastrar'
    }
]


export default function Sidebar() {
    const { logout } = useAuth()
    const router = useRouter()

    return (
        <Box shadow='dark-lg' width='15rem' flex={'0'}>
            <Box display={'inline-flex'} alignItems={'self-end'} gap={'0.5rem'} p={'1rem'} boxSizing='border-box'>
                <Img src='https://portal.unipam.edu.br/assets/media/img/logo/favicon.ico' objectFit={'cover'} boxSize={'50px'} />
                <Text fontSize={'2xl'} fontFamily={'sans-serif'} fontWeight={'bold'} color={'blue.600'}>UNIGEST</Text>
            </Box>
            <Divider />
            <VStack spacing={'0.3rem'} px={'0.5rem'}>
                {menuOptions.map(option => (
                    <Button
                        width='100%' key={option.id}
                        justifyContent={'flex-start'}
                        borderRadius={'8px'}
                        leftIcon={<Icon as={option.icon} />}
                        colorScheme='blue'
                        variant='ghost'
                        onClick={() => router.push(option.link)}
                    >{option.option}</Button>
                )
                )}
                <Button
                    width='100%'
                    justifyContent={'flex-start'}
                    borderRadius={'8px'}
                    leftIcon={<Icon as={MdLogout} />}
                    colorScheme='blue'
                    variant='ghost'
                    onClick={logout}
                >Sair</Button>
            </VStack>
        </Box>
    )
}