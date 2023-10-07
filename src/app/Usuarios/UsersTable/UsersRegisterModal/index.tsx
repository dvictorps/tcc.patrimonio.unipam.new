import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Block, Category, Company, DepType, Users, Equipamento, Manufacturer, PersonSituation, PersonType, Room, Situation } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react"
import { UseFormRegister, FieldValues, UseFormHandleSubmit, FormState, FieldErrors, UseFormSetValue, useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type UsersModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    personTypeData: PersonType[]
    personSituationData: PersonSituation[]
    dataQuery: UseQueryResult<void, unknown>
}

export function UsersModal({ onClose, open, isCentered, personTypeData, personSituationData, dataQuery }: UsersModal) {

    const { post } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Users) => {

        console.log('teste:', data)
        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Users) {
        try {
            const response = await post<Users>(`auth/signup`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no add', error);
        }
        onClose()
    }


    const checkData = (data: Users) => {
        const formData: Partial<Users> = {};

        formData.Nome = data.Nome;
        formData.Email = data.Email;
        formData.Senha = data.Senha;
        formData.Usuario = data.Usuario;
        formData.IdTipoPessoa = selectedTipo;

        return formData;
    };

    const handleFormSubmit = (data: Users) => {
        const fields = checkData(data);

        onSubmit(fields);

    }

    const [selectedTipo, setSelectedTipo] = useState<number>()


    function setSelectTipoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = personTypeData.find(option => option.IdTipoPessoa?.toString() === event.target.value)
        if (option) return setSelectedTipo(option.IdTipoPessoa)
    }

    return (

        <ModalStyled onClose={onClose} title="Adicionar Usuário" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.Nome} isRequired>
                        <FormLabel>Nome</FormLabel>
                        <Input
                            id="Nome"
                            {...register("Nome", { maxLength: 150, required: true })}
                        />
                        {errors.Nome && errors.Nome.type === "maxLength" && (
                            <FormErrorMessage>O Nome pode ter no máximo 150 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.Email} isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            id="Email"
                            {...register("Email", { maxLength: 150, required: true })}
                        />
                        {errors.Email && errors.Email.type === "maxLength" && (
                            <FormErrorMessage>O Email pode ter no máximo 150 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.Usuario} isRequired>
                        <FormLabel>Usuario</FormLabel>
                        <Input
                            id="Usuario"
                            {...register("Usuario", { maxLength: 20, required: true })}
                        />
                        {errors.Usuario && errors.Usuario.type === "maxLength" && (
                            <FormErrorMessage>O Usuário pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.Senha} isRequired>
                        <FormLabel>Senha</FormLabel>
                        <Input
                            id="Senha"
                            {...register("Senha", { maxLength: 20, required: true })}
                        />
                        {errors.Senha && errors.Senha.type === "maxLength" && (
                            <FormErrorMessage>A senha pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdTipoPessoa} isRequired>
                        <FormLabel>Permissões</FormLabel>
                        <Select placeholder='Selecionar permissões' value={selectedTipo} onChange={setSelectTipoOption}>
                            {personTypeData.map(
                                block =>
                                    <option value={block.IdTipoPessoa} key={block.IdTipoPessoa}>
                                        {block.DescricaoTipoPessoa}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme={"green"} type="submit">Adicionar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}