import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { DepType } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type DepTypeModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
}

export function DepTypeModal({ onClose, open, isCentered, dataQuery }: DepTypeModal) {

    const { post } = useApi()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: DepType) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: DepType) {
        try {
            await post<DepType>(`DepType/register`, data)
            toast({
                title: 'Sucesso',
                description: 'Tipo de departamento cadastrado com sucesso',
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


    const checkData = (data: DepType) => {
        const formData: Partial<DepType> = {};

        formData.TipoDepartamento = data.TipoDepartamento;

        return formData;
    };

    const handleFormSubmit = (data: DepType) => {
        const fields = checkData(data);
        onSubmit(fields);

    }


    return (

        <ModalStyled onClose={onClose} title="Adicionar Tipo de Departamento" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.TipoDepartamento} isRequired>
                        <FormLabel>Tipo de Departamento</FormLabel>
                        <Input
                            id="TipoDepartamento"
                            {...register("TipoDepartamento", { maxLength: 50, required: true })}
                        />
                        {errors.TipoDepartamento && errors.TipoDepartamento.type === "maxLength" && (
                            <FormErrorMessage>O tipo de departamento pode ter no máximo 50 caracteres</FormErrorMessage>
                        )}
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