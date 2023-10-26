import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Block } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
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
    const toast = useToast()

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
            await patch<Block>(`block/update/${componentData?.IdBlocoDepartamento}`, data)
            toast({
                title: 'Sucesso',
                description: 'Bloco atualizado com sucesso',
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