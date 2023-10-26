import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Category } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type CategoryUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
    componentData?: Category

}

export function CategoryUpdateModal({ onClose, open, isCentered, dataQuery, componentData }: CategoryUpdateModal) {

    const { patch } = useApi()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Category) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Category) {
        try {
            await patch<Category>(`category/update/${componentData?.IdCategoriaEquipamento}`, data)
            toast({
                title: 'Sucesso',
                description: 'Categoria atualizada com sucesso',
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


    const checkData = (formData: Category, originalData?: Category) => {
        const filteredData: Partial<Category> = {};

        if (formData.DescricaoCategoriaEquipamento !== originalData?.DescricaoCategoriaEquipamento) {
            filteredData.DescricaoCategoriaEquipamento = formData?.DescricaoCategoriaEquipamento;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: Category) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    return (

        <ModalStyled onClose={onClose} title="Editar Categoria de Equipamento" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoCategoriaEquipamento} isRequired>
                        <FormLabel>Descrição categoria equipamento</FormLabel>
                        <Input
                            defaultValue={componentData?.DescricaoCategoriaEquipamento}
                            id="DescricaoCategoriaEquipamento"
                            {...register("DescricaoCategoriaEquipamento", { maxLength: 20, required: true })}
                        />
                        {errors.DescricaoCategoriaEquipamento && errors.DescricaoCategoriaEquipamento.type === "maxLength" && (
                            <FormErrorMessage>A descrição do equipamento pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme={"green"} type="submit">Editar</Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}