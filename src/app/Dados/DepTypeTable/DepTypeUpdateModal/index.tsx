import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { DepType } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type DepTypeUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
    componentData?: DepType

}

export function DepTypeUpdateModal({ onClose, open, isCentered, dataQuery, componentData }: DepTypeUpdateModal) {

    const { patch } = useApi()

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
            const response = await patch<DepType>(`DepType/update/${componentData?.IdTipoDepartamento}`, data)
            console.log('Resposta update:', response)

        } catch (error) {
            console.log('Erro no update', error);
        }
        onClose()
    }


    const checkData = (formData: DepType, originalData?: DepType) => {
        const filteredData: Partial<DepType> = {};

        if (formData.TipoDepartamento !== originalData?.TipoDepartamento) {
            filteredData.TipoDepartamento = formData?.TipoDepartamento;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: DepType) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    return (

        <ModalStyled onClose={onClose} title="Editar Tipo de Departamento" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.TipoDepartamento} isRequired>
                        <FormLabel>Tipo de Departamento</FormLabel>
                        <Input
                            defaultValue={componentData?.TipoDepartamento}
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
                        <Button colorScheme={"green"} type="submit">Editar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}