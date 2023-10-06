import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { City, Company } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type CompanyModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    cityData: City[]
    dataQuery: UseQueryResult<void, unknown>
}

export function CompanyModal({ onClose, open, isCentered, cityData, dataQuery }: CompanyModal) {

    const { post } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Company) => {

        console.log('teste:', data)
        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Company) {
        try {
            const response = await post<Company>(`company/register`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no add', error);
        }
        onClose()
    }


    const checkData = (data: Company) => {
        const formData: Partial<Company> = {};

        formData.NomeEmpresa = data.NomeEmpresa;
        formData.EmailEmpresa = data.EmailEmpresa;
        formData.SiteEmpresa = data.SiteEmpresa;
        formData.NomeRepresentante = data.NomeRepresentante;
        formData.TelefoneEmpresa = Number(data.TelefoneEmpresa);
        formData.IdCidade = selectedCidade;

        return formData;
    };

    const handleFormSubmit = (data: Company) => {
        const fields = checkData(data);
        console.log('formdata', fields)
        onSubmit(fields);

    }

    const [selectedCidade, setSelectedCidade] = useState<number>()



    function setSelectCidadeOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = cityData.find(option => option.IdCidade?.toString() === event.target.value)
        if (option) return setSelectedCidade(option.IdCidade)
    }

    return (

        <ModalStyled onClose={onClose} title="Adicionar Empresa" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeEmpresa} isRequired>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <Input
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
                        <Button colorScheme={"green"} type="submit">Adicionar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}