import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Manufacturer } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type ManufacturerUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    dataQuery: UseQueryResult<void, unknown>
    componentData?: Manufacturer

}

export function ManufacturerUpdateModal({ onClose, open, isCentered, dataQuery, componentData }: ManufacturerUpdateModal) {

    const { patch } = useApi()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Manufacturer) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Manufacturer) {
        try {
            await patch<Manufacturer>(`manufacturer/update/${componentData?.IdFabricante}`, data)
            toast({
                title: 'Sucesso',
                description: 'Fabricante cadastrada com sucesso',
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


    const checkData = (formData: Manufacturer, originalData?: Manufacturer) => {
        const filteredData: Partial<Manufacturer> = {};

        if (formData.NomeFabricante !== originalData?.NomeFabricante) {
            filteredData.NomeFabricante = formData?.NomeFabricante;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: Manufacturer) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    return (

        <ModalStyled onClose={onClose} title="Editar fabricante" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeFabricante} isRequired>
                        <FormLabel>Descrição</FormLabel>
                        <Input
                            defaultValue={componentData?.NomeFabricante}
                            id="NomeFabricante"
                            {...register("NomeFabricante", { maxLength: 100, required: true })}
                        />
                        {errors.NomeFabricante && errors.NomeFabricante.type === "maxLength" && (
                            <FormErrorMessage>O nome da fabricante pode ter no máximo 150 caracteres</FormErrorMessage>
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