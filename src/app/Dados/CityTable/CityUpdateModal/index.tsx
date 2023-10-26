import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { City, Company, State } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type CityUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    componentData?: City
    dataQuery: UseQueryResult<void, unknown>
    stateData: State[]

}

export function CityUpdateModal({ onClose, open, isCentered, stateData, componentData, dataQuery }: CityUpdateModal) {

    const { patch } = useApi()
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
            await patch<City>(`city/update/${componentData?.IdCidade}`, data)
            toast({
                title: 'Sucesso',
                description: 'Cidade atualizada com sucesso',
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


    const checkData = (formData: City, originalData?: City) => {
        const filteredData: Partial<City> = {};

        if (formData.NomeCidade !== originalData?.NomeCidade) {
            filteredData.NomeCidade = formData?.NomeCidade;
        }

        if (selectedEstado !== originalData?.IdEstado) {
            filteredData.IdEstado = selectedEstado;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: City) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    const [selectedEstado, setSelectedEstado] = useState<number | undefined>(componentData?.IdEstado)

    function setSelectedEstadoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = stateData.find(option => option.IdEstado?.toString() === event.target.value)
        if (option) return setSelectedEstado(option.IdEstado)
    }

    return (

        <ModalStyled onClose={onClose} title="Editar Cidade" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeCidade} isRequired>
                        <FormLabel>Nome da Cidade</FormLabel>
                        <Input
                            defaultValue={componentData?.NomeCidade}
                            id="NomeCidade"
                            {...register("NomeCidade", { maxLength: 150, required: true })}
                        />
                        {errors.NomeCidade && errors.NomeCidade.type === "maxLength" && (
                            <FormErrorMessage>O Nome da cidade pode ter no máximo 150 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdEstado} isRequired>
                        <FormLabel>Cidade</FormLabel>
                        <Select placeholder='Selecionar Estado' value={selectedEstado} onChange={setSelectedEstadoOption}>
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
                        <Button colorScheme={"green"} type="submit">Editar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}