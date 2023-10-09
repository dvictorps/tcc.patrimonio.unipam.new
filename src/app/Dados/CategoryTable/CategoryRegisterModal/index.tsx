import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Category } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type CategoryModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
}

export function CategoryModal({ onClose, open, isCentered, dataQuery }: CategoryModal) {

    const { post } = useApi()

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
            const response = await post<Category>(`category/register`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no add', error);
        }
        onClose()
    }


    const checkData = (data: Category) => {
        const formData: Partial<Category> = {};

        formData.DescricaoCategoriaEquipamento = data.DescricaoCategoriaEquipamento;

        return formData;
    };

    const handleFormSubmit = (data: Category) => {
        const fields = checkData(data);
        onSubmit(fields);

    }


    return (

        <ModalStyled onClose={onClose} title="Adicionar Categoria de Equipamento" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoCategoriaEquipamento} isRequired>
                        <FormLabel>Descrição Categoria Equipamento</FormLabel>
                        <Input
                            id="DescricaoCategoriaEquipamento"
                            {...register("DescricaoCategoriaEquipamento", { maxLength: 20, required: true })}
                        />
                        {errors.DescricaoCategoriaEquipamento && errors.DescricaoCategoriaEquipamento.type === "maxLength" && (
                            <FormErrorMessage>A categoria do equipamento pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme={"green"} type="submit">Adicionar</Button>
                        <Button onClick={onClose}>Cancelar</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}