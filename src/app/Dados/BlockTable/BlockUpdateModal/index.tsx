import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Block } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type BlockUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
    componentData?: Block

}

export function BlockUpdateModal({ onClose, open, isCentered, dataQuery, componentData }: BlockUpdateModal) {

    const { patch } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Block) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Block) {
        try {
            const response = await patch<Block>(`block/update/${componentData?.IdBlocoDepartamento}`, data)
            console.log('Resposta update:', response)

        } catch (error) {
            console.log('Erro no update', error);
        }
        onClose()
    }


    const checkData = (formData: Block, originalData?: Block) => {
        const filteredData: Partial<Block> = {};

        if (formData.DescricaoBlocoDepartamento !== originalData?.DescricaoBlocoDepartamento) {
            filteredData.DescricaoBlocoDepartamento = formData?.DescricaoBlocoDepartamento;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: Block) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    return (

        <ModalStyled onClose={onClose} title="Editar Bloco" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoBlocoDepartamento} isRequired>
                        <FormLabel>Nome do Bloco</FormLabel>
                        <Input
                            defaultValue={componentData?.DescricaoBlocoDepartamento}
                            id="DescricaoBlocoDepartamento"
                            {...register("DescricaoBlocoDepartamento", { maxLength: 20, required: true })}
                        />
                        {errors.DescricaoBlocoDepartamento && errors.DescricaoBlocoDepartamento.type === "maxLength" && (
                            <FormErrorMessage>A descrição do bloco pode ter no máximo 20 caracteres</FormErrorMessage>
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