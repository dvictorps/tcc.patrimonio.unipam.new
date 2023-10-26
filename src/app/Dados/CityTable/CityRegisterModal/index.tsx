import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { City, State } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type CityModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    stateData: State[]
    dataQuery: UseQueryResult<void, unknown>
}

export function CityModal({ onClose, open, isCentered, stateData, dataQuery }: CityModal) {

    const { post } = useApi()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: City) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: City) {
        try {
            await post<City>(`city/register`, data)
            toast({
                title: 'Sucesso',
                description: 'Cidade cadastrada com sucesso',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })

        } catch (error: any) {
            const errorMessage = error.response.data.message;
            toast({
                title: 'Algo deu errado',
                description: errorMessage,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        onClose()
    }


    const checkData = (data: City) => {
        const formData: Partial<City> = {};

        formData.NomeCidade = data.NomeCidade;
        formData.IdEstado = selectedEstado;

        return formData;
    };

    const handleFormSubmit = (data: City) => {
        const fields = checkData(data);
        onSubmit(fields);

    }

    const [selectedEstado, setSelectedEstado] = useState<number>()



    function setSelectedEstadoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = stateData.find(option => option.IdEstado?.toString() === event.target.value)
        if (option) return setSelectedEstado(option.IdEstado)
    }

    return (

        <ModalStyled onClose={onClose} title="Adicionar Cidade" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeCidade} isRequired>
                        <FormLabel>Cidade</FormLabel>
                        <Input
                            id="NomeCidade"
                            {...register("NomeCidade", { maxLength: 150, required: true })}
                        />
                        {errors.NomeCidade && errors.NomeCidade.type === "maxLength" && (
                            <FormErrorMessage>O Nome da cidade pode ter no máximo 150 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdEstado} isRequired>
                        <FormLabel>Estado</FormLabel>
                        <Select placeholder='Selecionar fabricante' value={selectedEstado} onChange={setSelectedEstadoOption}>
                            {stateData.map(
                                state =>
                                    <option value={state.IdEstado} key={state.IdEstado}>
                                        {state.NomeEstado}
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