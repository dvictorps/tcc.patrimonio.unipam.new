'use client'
import { Box, Button, Input, Text, InputGroup, Stack, InputRightElement, IconButton, Icon, useBoolean, useDisclosure } from "@chakra-ui/react";
import { SetStateAction, useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { AlertStyled } from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";

export default function Cadastrar() {

  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('')

  const [error, setError] = useState('');
  const [sucess, setSucess] = useState('');

  async function handleRegister() {
    try {

      const Usuario = username;
      const Senha = password;
      const Email = email;
      const Nome = name;
      await register(Usuario, Senha, Nome, Email);
      setSucess('cadastro efetuado com sucesso')
      alertSucces.onOpen()
    } catch (error: any) {
      if (error.response && error.response.status === 400) {

        console.error('Erro de cadastro:', error.response.data);
        setError('Campos inválidos')
        alertError.onOpen()


      } else {

        console.error('Erro ao cadastrar:', error);
        setError('Internal Server Error')
        alertError.onOpen()
      }
    }
    setUsername('');
    setPassword('');
    setEmail('');
    setName('');
  }

  const [show, setShow] = useBoolean(false);


  function PasswordIcon(show: boolean) {
    if (!show) return FaEye;
    if (show) return FaEyeSlash;
  }

  const alertError = useDisclosure({ defaultIsOpen: false })
  const alertSucces = useDisclosure({ defaultIsOpen: false })

  return (
    <Box display={'flex'} minHeight={'100vh'}>
      <Sidebar />
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

          <Box
            display={'flex'}
            flexDirection={'column'}
            shadow={'dark-lg'}
            borderRadius={'5px'}
            p={'1rem'}
            gap={'1rem'}
            alignItems={'center'}
          >
            <Text fontSize={'3xl'} color={'blue.700'} >Cadastrar Usuário</Text>
            <Stack>
              <InputGroup>
                <Input placeholder='Nome'
                  value={name}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setName(e.target.value)}
                />
              </InputGroup>
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
              <InputGroup>
                <Input placeholder='Email'
                  value={email}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Stack>
            <Button colorScheme="blue" onClick={handleRegister}>Cadastrar</Button>
          </Box>
          <Box display={'flex'} width={'auto'} height={'auto'} m={'1rem'}>
            <AlertStyled title="Sucesso" description={sucess} status="success" isVisible={alertSucces.isOpen} onClose={alertSucces.onClose} />
            <AlertStyled title="Erro" description={error} status="error" isVisible={alertError.isOpen} onClose={alertError.onClose} />
          </Box>
        </Box>

      </Box>
    </Box>
  )
}
