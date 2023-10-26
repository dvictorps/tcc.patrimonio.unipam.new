import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { RoomType } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type RoomTypeModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
}

export function RoomTypeModal({ onClose, open, isCentered, dataQuery }: RoomTypeModal) {

    const { post } = useApi()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: RoomType) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: RoomType) {
        try {
            await post<RoomType>(`roomType/register`, data)
            toast({
                title: 'Sucesso',
                description: 'Tipo de sala cadastrado com sucesso',
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


    const checkData = (data: RoomType) => {
        const formData: Partial<RoomType> = {};

        formData.DescricaoTipoSala = data.DescricaoTipoSala;

        return formData;
    };

    const handleFormSubmit = (data: RoomType) => {
        const fields = checkData(data);
        onSubmit(fields);

    }


    return (

        <ModalStyled onClose={onClose} title="Adicionar Cidade" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoTipoSala} isRequired>
                        <FormLabel>Tipo Sala</FormLabel>
                        <Input
                            id="DescricaoTipoSala"
                            {...register("DescricaoTipoSala", { maxLength: 20, required: true })}
                        />
                        {errors.DescricaoTipoSala && errors.DescricaoTipoSala.type === "maxLength" && (
                            <FormErrorMessage>O tipo da sala pode ter no máximo 20 caracteres</FormErrorMessage>
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