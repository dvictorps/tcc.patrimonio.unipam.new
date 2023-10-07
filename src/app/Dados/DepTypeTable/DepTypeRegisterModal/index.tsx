import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { DepType } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: DepType) => {

        console.log('teste:', data)
        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: DepType) {
        try {
            const response = await post<DepType>(`DepType/register`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no add', error);
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
        console.log('formdata', fields)
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