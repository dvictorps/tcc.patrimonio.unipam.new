import { LuLayoutDashboard, LuSettings, LuHome, LuPlus } from 'react-icons/lu'
import { MdLogout } from 'react-icons/md'
import { Img, Icon, Button, Box, Text, VStack, Divider } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'


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
        option: 'Cadastro de Patrimônio',
        icon: LuPlus,
        id: 3,
        link: '/equipamento'
    },
    {
        option: 'Configurações',
        icon: LuSettings,
        id: 4,
        link: '/'
    },
    {
        option: 'Sair',
        icon: MdLogout,
        id: 5,
        link: '/'
    }
]


export default function Sidebar({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter()

    return (
        <Box display={'flex'} maxHeight={'100vh'} maxWidth={'100vw'}>
            <Box h='100vh' shadow='dark-lg' minWidth='15rem'>
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
                </VStack>
            </Box>
            <Box m={'2rem'} width={'100%'} overflowY={'auto'} >
                {children}
            </Box>
        </Box>
    )
}