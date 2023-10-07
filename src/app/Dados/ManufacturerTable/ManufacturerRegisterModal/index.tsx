import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Manufacturer } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type ManufacturerModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
}

export function ManufacturerModal({ onClose, open, isCentered, dataQuery }: ManufacturerModal) {

    const { post } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Manufacturer) => {

        console.log('teste:', data)
        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Manufacturer) {
        try {
            const response = await post<Manufacturer>(`manufacturer/register`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no add', error);
        }
        onClose()
    }


    const checkData = (data: Manufacturer) => {
        const formData: Partial<Manufacturer> = {};

        formData.NomeFabricante = data.NomeFabricante;

        return formData;
    };

    const handleFormSubmit = (data: Manufacturer) => {
        const fields = checkData(data);
        console.log('formdata', fields)
        onSubmit(fields);

    }


    return (

        <ModalStyled onClose={onClose} title="Adicionar Fabricante" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeFabricante} isRequired>
                        <FormLabel>Nome</FormLabel>
                        <Input
                            id="NomeFabricante"
                            {...register("NomeFabricante", { maxLength: 100, required: true })}
                        />
                        {errors.NomeFabricante && errors.NomeFabricante.type === "maxLength" && (
                            <FormErrorMessage>O nome da fabricante pode ter no máximo 100 caracteres</FormErrorMessage>
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