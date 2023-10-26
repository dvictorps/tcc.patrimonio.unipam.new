import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { City, Company } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select, useToast } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type CompanyUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    componentData?: Company
    dataQuery: UseQueryResult<void, unknown>
    cityData: City[]

}

export function CompanyUpdateModal({ onClose, open, isCentered, cityData, componentData, dataQuery }: CompanyUpdateModal) {

    const { patch } = useApi()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Company) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Company) {
        try {
            await patch<Company>(`company/update/${componentData?.IdEmpresa}`, data)
            toast({
                title: 'Sucesso',
                description: 'Empresa atualizada com sucesso',
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


    const checkData = (formData: Company, originalData?: Company) => {
        const filteredData: Partial<Company> = {};

        if (formData.NomeEmpresa !== originalData?.NomeEmpresa) {
            filteredData.NomeEmpresa = formData?.NomeEmpresa;
        }

        if (formData.NomeRepresentante !== originalData?.NomeRepresentante) {
            filteredData.NomeRepresentante = formData?.NomeRepresentante;
        }

        if (formData.TelefoneEmpresa !== originalData?.TelefoneEmpresa) {
            filteredData.TelefoneEmpresa = Number(formData?.TelefoneEmpresa);
        }

        if (formData.SiteEmpresa !== originalData?.SiteEmpresa) {
            filteredData.SiteEmpresa = formData?.SiteEmpresa;
        }

        if (formData.EmailEmpresa !== originalData?.EmailEmpresa) {
            filteredData.EmailEmpresa = formData?.EmailEmpresa;
        }

        if (selectedCidade !== originalData?.IdCidade) {
            filteredData.IdEmpresa = selectedCidade;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: Company) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    const [selectedCidade, setSelectedCidade] = useState<number | undefined>(componentData?.IdCidade)

    function setSelectCidadeOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = cityData.find(option => option.IdCidade?.toString() === event.target.value)
        if (option) return setSelectedCidade(option.IdCidade)
    }

    return (

        <ModalStyled onClose={onClose} title="Editar Empresa" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeEmpresa} isRequired>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <Input
                            defaultValue={componentData?.NomeEmpresa}
                            id="NomeEmpresa"
                            {...register("NomeEmpresa", { maxLength: 150, required: true })}
                        />
                        {errors.NomeEmpresa && errors.NomeEmpresa.type === "maxLength" && (
                            <FormErrorMessage>O Nome da Empresa pode ter no máximo 150 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.SiteEmpresa} isRequired>
                        <FormLabel>Site da Empresa</FormLabel>
                        <Input
                            defaultValue={componentData?.SiteEmpresa}
                            id="SiteEmpresa"
                            {...register("SiteEmpresa", { maxLength: 150, required: true })}
                        />
                        {errors.SiteEmpresa && errors.SiteEmpresa.type === "maxLength" && (
                            <FormErrorMessage>O Site da Empresa pode ter no máximo 150 caracteres</FormErrorMessage>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.EmailEmpresa} isRequired>
                        <FormLabel>Email da Empresa</FormLabel>
                        <Input
                            defaultValue={componentData?.EmailEmpresa}
                            id="EmailEmpresa"
                            {...register("EmailEmpresa", { maxLength: 150, required: true })}
                        />
                        {errors.EmailEmpresa && errors.EmailEmpresa.type === "maxLength" && (
                            <FormErrorMessage>O Email da Empresa pode ter no máximo 150 caracteres</FormErrorMessage>
                        )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.NomeRepresentante} isRequired>
                        <FormLabel>Nome do Representante</FormLabel>
                        <Input
                            defaultValue={componentData?.NomeRepresentante}
                            id="NomeRepresentante"
                            {...register("NomeRepresentante", { maxLength: 100, required: true })}
                        />
                        {errors.NomeRepresentante && errors.NomeRepresentante.type === "maxLength" && (
                            <FormErrorMessage>O Nome do representante pode ter no máximo 100 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.TelefoneEmpresa} isRequired>
                        <FormLabel>Telefone da Empresa</FormLabel>
                        <Input
                            defaultValue={componentData?.TelefoneEmpresa}
                            type="number"
                            id="TelefoneEmpresa"
                            {...register("TelefoneEmpresa", { required: true })}
                        />
                        {errors.TelefoneEmpresa && errors.TelefoneEmpresa.type === "maxLength" && (
                            <FormErrorMessage>Por favor coloque um telefone para a empresa</FormErrorMessage>
                        )}
                    </FormControl>


                    <FormControl isInvalid={!!errors.IdFabricante} isRequired>
                        <FormLabel>Cidade</FormLabel>
                        <Select placeholder='Selecionar fabricante' value={selectedCidade} onChange={setSelectCidadeOption}>
                            {cityData.map(
                                city =>
                                    <option value={city.IdCidade} key={city.IdCidade}>
                                        {city.NomeCidade}
                                    </option>
                            )}
                        </Select>
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