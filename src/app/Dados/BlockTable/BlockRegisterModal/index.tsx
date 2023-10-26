import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Block } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type BlockModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
}

export function BlockModal({ onClose, open, isCentered, dataQuery }: BlockModal) {

    const toast = useToast();
    const { post } = useApi()

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
            await post<Block>(`block/register`, data)
            toast({
                title: 'Sucesso',
                description: 'Bloco cadastrado com sucesso',
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


    const checkData = (data: Block) => {
        const formData: Partial<Block> = {};

        formData.DescricaoBlocoDepartamento = data.DescricaoBlocoDepartamento;

        return formData;
    };

    const handleFormSubmit = (data: Block) => {
        const fields = checkData(data);
        onSubmit(fields);

    }


    return (

        <ModalStyled onClose={onClose} title="Adicionar Bloco" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoBlocoDepartamento} isRequired>
                        <FormLabel>Nome do Bloco</FormLabel>
                        <Input
                            id="DescricaoBlocoDepartamento"
                            {...register("DescricaoBlocoDepartamento", { maxLength: 20, required: true })}
                        />
                        {errors.DescricaoBlocoDepartamento && errors.DescricaoBlocoDepartamento.type === "maxLength" && (
                            <FormErrorMessage>O nome do bloco pode ter no máximo 20 caracteres</FormErrorMessage>
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