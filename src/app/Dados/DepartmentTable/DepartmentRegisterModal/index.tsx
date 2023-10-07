import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Block, Category, Company, DepType, Department, DepartmentSituation, Equipamento, Manufacturer, Room, Situation } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react"
import { UseFormRegister, FieldValues, UseFormHandleSubmit, FormState, FieldErrors, UseFormSetValue, useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type DepartmentModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    blockData: Block[]
    departmentSituationData: DepartmentSituation[]
    depTypeData: DepType[]
    dataQuery: UseQueryResult<void, unknown>
}

export function DepartmentModal({ onClose, open, isCentered, blockData, depTypeData, departmentSituationData, dataQuery }: DepartmentModal) {

    const { post } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Department) => {

        console.log('teste:', data)
        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Department) {
        try {
            const response = await post<Department>(`department/register`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no add', error);
        }
        onClose()
    }


    const checkData = (data: Department) => {
        const formData: Partial<Department> = {};

        formData.NomeDepartamento = data.NomeDepartamento;
        formData.IdBlocoDepartamento = selectedBloco;
        formData.IdSituacaoDepartamento = selectedSituacao;
        formData.IdTipoDepartamento = selectedTipo;

        return formData;
    };

    const handleFormSubmit = (data: Department) => {
        const fields = checkData(data);

        onSubmit(fields);

    }

    const [selectedBloco, setSelectedBloco] = useState<number>()
    const [selectedSituacao, setSelectedSituacao] = useState<number>()
    const [selectedTipo, setSelectedTipo] = useState<number>()


    function setSelectedBlocoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = blockData.find(option => option.IdBlocoDepartamento?.toString() === event.target.value)
        if (option) return setSelectedBloco(option.IdBlocoDepartamento)
    }

    function setSelectedSituacaoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = departmentSituationData.find(option => option.IdSituacaoDepartamento?.toString() === event.target.value)
        if (option) return setSelectedSituacao(option.IdSituacaoDepartamento)
    }

    function setSelectTipoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = depTypeData.find(option => option.IdTipoDepartamento?.toString() === event.target.value)
        if (option) return setSelectedTipo(option.IdTipoDepartamento)
    }

    return (

        <ModalStyled onClose={onClose} title="Adicionar Departamento" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeDepartamento} isRequired>
                        <FormLabel>Nome Departamento</FormLabel>
                        <Input
                            id="NomeDepartamento"
                            {...register("NomeDepartamento", { maxLength: 20, required: true })}
                        />
                        {errors.NomeDepartamento && errors.NomeDepartamento.type === "maxLength" && (
                            <FormErrorMessage>O Nome do Departamento pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdBlocoDepartamento} isRequired>
                        <FormLabel>Bloco departamento</FormLabel>
                        <Select placeholder='Selecionar Bloco' value={selectedBloco} onChange={setSelectedBlocoOption}>
                            {blockData.map(
                                block =>
                                    <option value={block.IdBlocoDepartamento} key={block.IdBlocoDepartamento}>
                                        {block.DescricaoBlocoDepartamento}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdSituacaoDepartamento} isRequired>
                        <FormLabel>Situação</FormLabel>
                        <Select placeholder='Selecionar situação' value={selectedSituacao} onChange={setSelectedSituacaoOption}>
                            {departmentSituationData.map(
                                depSituation =>
                                    <option value={depSituation.IdSituacaoDepartamento} key={depSituation.IdSituacaoDepartamento}>
                                        {depSituation.DescricaoSituacaoDepartamento}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdFabricante} isRequired>
                        <FormLabel>Fabricante</FormLabel>
                        <Select placeholder='Selecionar fabricante' value={selectedTipo} onChange={setSelectTipoOption}>
                            {depTypeData.map(
                                depType =>
                                    <option value={depType.IdTipoDepartamento} key={depType.IdTipoDepartamento}>
                                        {depType.TipoDepartamento}
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