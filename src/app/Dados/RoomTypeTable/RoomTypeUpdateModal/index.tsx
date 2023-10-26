import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { RoomType } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type RoomTypeUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
    componentData?: RoomType

}

export function RoomTypeUpdateModal({ onClose, open, isCentered, dataQuery, componentData }: RoomTypeUpdateModal) {

    const { patch } = useApi()
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
            await patch<RoomType>(`RoomType/update/${componentData?.IdTipoSala}`, data)
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


    const checkData = (formData: RoomType, originalData?: RoomType) => {
        const filteredData: Partial<RoomType> = {};

        if (formData.DescricaoTipoSala !== originalData?.DescricaoTipoSala) {
            filteredData.DescricaoTipoSala = formData?.DescricaoTipoSala;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: RoomType) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    return (

        <ModalStyled onClose={onClose} title="Editar Tipo Sala" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoTipoSala} isRequired>
                        <FormLabel>Descrição</FormLabel>
                        <Input
                            defaultValue={componentData?.DescricaoTipoSala}
                            id="DescricaoTipoSala"
                            {...register("DescricaoTipoSala", { maxLength: 20, required: true })}
                        />
                        {errors.DescricaoTipoSala && errors.DescricaoTipoSala.type === "maxLength" && (
                            <FormErrorMessage>O tipo de sala pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
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