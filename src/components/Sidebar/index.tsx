import { LuLayoutDashboard, LuActivitySquare, LuHome } from 'react-icons/lu'
import { FaUsers } from 'react-icons/fa'
import { MdLogout } from 'react-icons/md'
import { Img, Icon, Button, Box, Text, VStack, Divider, Image } from '@chakra-ui/react'
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
        option: 'Usuários',
        icon: FaUsers,
        id: 4,
        link: '/Usuarios'
    }
]


export default function Sidebar() {
    const { logout } = useAuth()
    const router = useRouter()

    return (
        <Box width='15rem' flex={'0'} backgroundColor={'#00476C'}>
            <Box display={'inline-flex'} alignItems={'self-end'} gap={'0.5rem'} p={'1rem'} boxSizing='border-box'>
                <Image src='images/logoWhite2.svg' objectFit={'cover'} />
            </Box>

            <VStack spacing={'0.3rem'} px={'0.5rem'}>
                {menuOptions.map(option => (
                    <Button
                        width='100%' key={option.id}
                        justifyContent={'flex-start'}
                        borderRadius={'8px'}
                        leftIcon={<Icon as={option.icon} />}
                        textColor={'white'}
                        colorScheme='whiteAlpha'
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
                    textColor={'white'}
                    colorScheme='whiteAlpha'
                    variant='ghost'
                    onClick={logout}
                >Sair</Button>
            </VStack>
        </Box>
    )
}