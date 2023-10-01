'use client'
import { Box, Button, Img, Input, Text, InputGroup, Stack, InputRightElement, IconButton, Icon, useBoolean, useDisclosure } from "@chakra-ui/react";
import { SetStateAction, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { api } from "@/api/api";
import { useRouter } from "next/navigation";
import { AlertStyled } from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";

export default function Login() {

  const { login } = useAuth();
  const router = useRouter();

  const checkForCookie = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token'));

    if (cookieValue) {

      router.push('/');
    }
  };

  useEffect(() => {
    checkForCookie();
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  async function handleLogin() {
    try {

      const Usuario = username;
      const Senha = password;
      const success = await login(Usuario, Senha);
      if (success) {
        router.push('/');
      } else {
        setError('Usuário ou senha inválidos');
        onOpen();
      }

    } catch (error: any) {
      if (error.response && error.response.status === 400) {

        console.error('Erro de autenticação:', error.response.data);
        setError('Usuário ou senha inválidos')
        onOpen()


      } else {

        console.error('Erro ao fazer login:', error);
        setError('Internal Server Error')
        onOpen()
      }
    }
  }

  const [show, setShow] = useBoolean(false);


  function PasswordIcon(show: boolean) {
    if (!show) return FaEye;
    if (show) return FaEyeSlash;
  }

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false })

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box
        display={'flex'}
        position={'fixed'}
        width={'auto'}
        height={'auto'}
        top={'50%'}
        left={'50%'}
        flexDirection={'column'}
        transform={'translate(-50%, -50%)'}
        alignItems={'center'}
      >
        <Box display={'inline-flex'} alignItems={'self-end'} gap={'0.5rem'} p={'1rem'} boxSizing='border-box'>
          <Img src='https://portal.unipam.edu.br/assets/media/img/logo/favicon.ico' objectFit={'cover'} boxSize={'60px'} />
          <Text fontSize={'4xl'} fontFamily={'sans-serif'} fontWeight={'bold'} color={'blue.600'}>UNIGEST</Text>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          shadow={'dark-lg'}
          borderRadius={'5px'}
          p={'1rem'}
          gap={'1rem'}
          alignItems={'center'}
        >
          <Text fontSize={'3xl'} color={'blue.700'} >Login</Text>
          <Stack>
            <InputGroup>
              <Input placeholder='Usuário'
                value={username}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setUsername(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <Input
                value={password}
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
                placeholder='Senha'
                type={show ? 'text' : 'password'}
              />
              <InputRightElement>
                <IconButton
                  aria-label="ShowPassword"
                  icon={<Icon as={PasswordIcon(show)} />}
                  onClick={setShow.toggle}
                  variant={'outline'}
                  size={'sm'}
                />
              </InputRightElement>
            </InputGroup>
          </Stack>
          <Button colorScheme="blue" onClick={handleLogin}>Login</Button>
        </Box>

      </Box>
      <Box display={'flex'} width={'auto'} height={'auto'}>
        <AlertStyled title="Erro de Login" description={error} status="error" isVisible={isVisible} onClose={onClose} />
      </Box>
    </Box>
  )
}
