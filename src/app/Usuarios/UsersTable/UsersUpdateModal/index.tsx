import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { PersonSituation, PersonType, Users } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type UsersUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    personTypeData: PersonType[]
    personSituationData: PersonSituation[]
    dataQuery: UseQueryResult<void, unknown>
    componentData?: Users


}

export function UsersUpdateModal({ onClose, open, isCentered, personTypeData, personSituationData, dataQuery, componentData }: UsersUpdateModal) {

    const { patch } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Users) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Users) {
        try {
            const response = await patch<Users>(`users/update/${componentData?.IdPessoa}`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no update', error);
        }
        onClose()
    }



    const checkData = (formData: Users, originalData?: Users) => {
        const filteredData: Partial<Users> = {};

        if (formData.Nome !== originalData?.Nome) {
            filteredData.Nome = formData?.Nome;
        }
        if (formData.Usuario !== originalData?.Usuario) {
            filteredData.Usuario = formData?.Usuario;
        }
        if (formData.Email !== originalData?.Email) {
            filteredData.Email = formData?.Email;
        }

        if (selectedSituacao !== originalData?.IdSituacaoPessoa) {
            filteredData.IdSituacaoPessoa = selectedSituacao;
        }

        if (selectedTipo !== originalData?.IdTipoPessoa) {
            filteredData.IdTipoPessoa = selectedTipo;
        }
        console.log('teste', filteredData)
        return filteredData;
    };

    const handleFormSubmit = (data: Users) => {


        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    const [selectedSituacao, setSelectedSituacao] = useState<number | undefined>(componentData?.IdSituacaoPessoa)
    const [selectedTipo, setSelectedTipo] = useState<number | undefined>(componentData?.IdTipoPessoa)

    function setSelectedSituacaoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = personSituationData.find(option => option.IdSituacaoPessoa?.toString() === event.target.value)
        if (option) return setSelectedSituacao(option.IdSituacaoPessoa)
    }

    function setSelectTipoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = personTypeData.find(option => option.IdTipoPessoa?.toString() === event.target.value)
        if (option) return setSelectedTipo(option.IdTipoPessoa)
    }

    return (

        <ModalStyled onClose={onClose} title="Editar Usuário" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.Nome} isRequired>
                        <FormLabel>Nome</FormLabel>
                        <Input
                            defaultValue={componentData?.Nome}
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
                            defaultValue={componentData?.Email}
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
                            defaultValue={componentData?.Usuario}
                            id="Usuario"
                            {...register("Usuario", { maxLength: 20, required: true })}
                        />
                        {errors.Usuario && errors.Usuario.type === "maxLength" && (
                            <FormErrorMessage>O Usuário pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdSituacaoPessoa} isRequired>
                        <FormLabel>Situação Usuário</FormLabel>
                        <Select placeholder='Selecionar situação' value={selectedSituacao} onChange={setSelectedSituacaoOption}>
                            {personSituationData.map(
                                personSituation =>
                                    <option value={personSituation.IdSituacaoPessoa} key={personSituation.IdSituacaoPessoa}>
                                        {personSituation.DescricaoSituacaoPessoa}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdTipoPessoa} isRequired>
                        <FormLabel>Permissões</FormLabel>
                        <Select placeholder='Selecionar fabricante' value={selectedTipo} onChange={setSelectTipoOption}>
                            {personTypeData.map(
                                personType =>
                                    <option value={personType.IdTipoPessoa} key={personType.IdTipoPessoa}>
                                        {personType.DescricaoTipoPessoa}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme={"green"} type="submit">Editar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}