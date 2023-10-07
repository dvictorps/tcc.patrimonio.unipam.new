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
    componentData?: Department
    dataQuery: UseQueryResult<void, unknown>

}

export function DepartmentUpdateModal({ onClose, open, isCentered, blockData, depTypeData, departmentSituationData, componentData, dataQuery }: DepartmentModal) {

    const { patch } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Department) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Department) {
        try {
            const response = await patch<Department>(`department/update/${componentData?.IdDepartamento}`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no update', error);
        }
        onClose()
    }


    const checkData = (formData: Department, originalData?: Department) => {
        const filteredData: Partial<Department> = {};

        if (formData.NomeDepartamento !== originalData?.NomeDepartamento) {
            filteredData.NomeDepartamento = formData?.NomeDepartamento;
        }

        if (selectedBloco !== originalData?.IdBlocoDepartamento) {
            filteredData.IdBlocoDepartamento = selectedBloco;
        }
        if (selectedSituacao !== originalData?.IdSituacaoDepartamento) {
            filteredData.IdSituacaoDepartamento = selectedSituacao;
        }
        if (selectedTipo !== originalData?.IdTipoDepartamento) {
            filteredData.IdTipoDepartamento = selectedTipo;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: Department) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    const [selectedBloco, setSelectedBloco] = useState<number | undefined>(componentData?.IdBlocoDepartamento)
    const [selectedSituacao, setSelectedSituacao] = useState<number | undefined>(componentData?.IdSituacaoDepartamento)
    const [selectedTipo, setSelectedTipo] = useState<number | undefined>(componentData?.IdTipoDepartamento)

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

        <ModalStyled onClose={onClose} title="Editar Departamento" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.NomeDepartamento} isRequired>
                        <FormLabel>Nome Departamento</FormLabel>
                        <Input
                            defaultValue={componentData?.NomeDepartamento}
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
                        <Button colorScheme={"green"} type="submit">Editar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}