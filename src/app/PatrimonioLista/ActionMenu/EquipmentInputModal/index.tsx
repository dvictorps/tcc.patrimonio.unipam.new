import { Category, Company, Department, Equipamento, Manufacturer, Room, Situation } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react"
import { UseFormRegister, FieldValues, UseFormHandleSubmit, FormState, FieldErrors, UseFormSetValue } from "react-hook-form"
type EquipmentModal = {
    register: UseFormRegister<FieldValues>
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>
    onSubmit: (data: Equipamento) => Promise<void>
    errors: FieldErrors<FieldValues>
    componentData?: Equipamento
    onClose: () => void
    companyData: Company[]
    categoryData: Category[]
    manufacturerData: Manufacturer[]
    departmentData: Department[]
    situationData: Situation[]
    roomData: Room[]
}

export function EquipmentInputModal({ register, handleSubmit, errors, onSubmit, componentData, onClose, companyData,
    categoryData, manufacturerData, departmentData, situationData, roomData }: EquipmentModal) {


    const handleFormSubmit = (data: Equipamento) => {
        const changedFields = isDataUnchanged(data, componentData);

        if (Object.keys(changedFields).length === 0) {
            onClose();
        } else {
            onSubmit(changedFields);
        };
    }

    const dataAquisicaoFormatada = componentData?.DataAquisicao ? componentData?.DataAquisicao.toString().slice(0, -1) : ''
    const dataVencimentoGarantiaFormatada = componentData?.VencimentoGarantia ? componentData?.VencimentoGarantia.toString().slice(0, -1) : ''


    const [selectedCompanyOption, setselectedCompanyOption] = useState<number | undefined>(componentData?.IdEmpresa)
    const [selectedCategoryOption, setselectedCategoryOption] = useState<number | undefined>(componentData?.IdCategoriaEquipamento)
    const [selectedManufacturerOption, setselectedManufacturerOption] = useState<number | undefined>(componentData?.IdFabricante)
    const [selectedDepartmentOption, setselectedDepartmentOption] = useState<number | undefined>(componentData?.IdDepartamento)
    const [selectedSituationOption, setselectedSituationOption] = useState<number | undefined>(componentData?.IdSituacaoEquipamento)
    const [selectedRoomOption, setselectedRoomOption] = useState<number | undefined>(componentData?.IdSala)


    function setSelectCompanyOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = companyData.find(option => option.IdEmpresa.toString() === event.target.value)
        if (option) return setselectedCompanyOption(option.IdEmpresa)
    }

    function setSelectCategoryOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = categoryData.find(option => option.IdCategoriaEquipamento.toString() === event.target.value)
        if (option) return setselectedCategoryOption(option.IdCategoriaEquipamento)
    }

    function setSelectManufacturerOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = manufacturerData.find(option => option.IdFabricante.toString() === event.target.value)
        if (option) return setselectedManufacturerOption(option.IdFabricante)
    }

    function setSelectDepartmentOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = departmentData.find(option => option.IdDepartamento.toString() === event.target.value)
        if (option) return setselectedDepartmentOption(option.IdDepartamento)
    }

    function setSelectSituationOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = situationData.find(option => option.IdSituacaoEquipamento.toString() === event.target.value)
        if (option) return setselectedSituationOption(option.IdSituacaoEquipamento)
    }


    function setSelectRoomOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = roomData.find(option => option.IdSala.toString() === event.target.value)
        if (option) return setselectedRoomOption(option.IdSala)
    }



    const isDataUnchanged = (formData: Equipamento, originalData?: Equipamento) => {
        const filteredData: Partial<Equipamento> = {};

        if (formData.Patrimonio !== originalData?.Patrimonio) {
            filteredData.Patrimonio = formData.Patrimonio;
        }
        if (formData.DescricaoEquipamento !== originalData?.DescricaoEquipamento) {
            filteredData.DescricaoEquipamento = formData.DescricaoEquipamento;
        }

        if (formData.NumeroSerial !== originalData?.NumeroSerial) {
            filteredData.NumeroSerial = formData.NumeroSerial;
        }

        if (formData.DataAquisicao !== originalData?.DataAquisicao) {
            filteredData.DataAquisicao = formData.DataAquisicao += 'Z';
        }

        if (formData.VencimentoGarantia !== originalData?.VencimentoGarantia) {
            filteredData.VencimentoGarantia = formData.VencimentoGarantia += 'Z';
        }

        if (selectedCompanyOption !== originalData?.IdEmpresa) {
            filteredData.IdEmpresa = selectedCompanyOption;
        }

        if (selectedCategoryOption !== originalData?.IdCategoriaEquipamento) {
            filteredData.IdCategoriaEquipamento = selectedCategoryOption;
        }

        if (selectedManufacturerOption !== originalData?.IdFabricante) {
            filteredData.IdFabricante = selectedManufacturerOption;
        }

        if (selectedDepartmentOption !== originalData?.IdDepartamento) {
            filteredData.IdDepartamento = selectedDepartmentOption;
        }

        if (selectedSituationOption !== originalData?.IdSituacaoEquipamento) {
            filteredData.IdSituacaoEquipamento = selectedSituationOption;
        }

        if (selectedRoomOption !== originalData?.IdSala) {
            filteredData.IdSala = selectedRoomOption;
        }

        return filteredData;
    };


    return (
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.Patrimonio} isRequired>
                        <FormLabel>Patrimônio</FormLabel>
                        <Input
                            id="Patrimonio"
                            {...register("Patrimonio", { maxLength: 20 })}
                            defaultValue={componentData?.Patrimonio}

                        />
                        {errors.Patrimonio && errors.Patrimonio.type === "maxLength" && (
                            <FormErrorMessage>O número de patrimônio pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.DescricaoEquipamento} isRequired>
                        <FormLabel>Descricao Equipamento</FormLabel>
                        <Input
                            id="DescricaoEquipamento"
                            {...register("DescricaoEquipamento", { maxLength: 50 })}
                            defaultValue={componentData?.DescricaoEquipamento}
                        />
                        {errors.DescricaoEquipamento && errors.DescricaoEquipamento.type === "maxLength" && (
                            <FormErrorMessage>A descrição pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.NumeroSerial} isRequired>
                        <FormLabel>Numero Serial</FormLabel>
                        <Input
                            id="NumeroSerial"
                            {...register("NumeroSerial", { maxLength: 50 })}
                            defaultValue={componentData?.NumeroSerial}
                        />
                        {errors.NumeroSerial && errors.NumeroSerial.type === "maxLength" && (
                            <FormErrorMessage>O numero de serial pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.DataAquisicao} isRequired>
                        <FormLabel>Data da Aquisição</FormLabel>
                        <Input
                            id="DataAquisicao"
                            {...register("DataAquisicao")}
                            defaultValue={dataAquisicaoFormatada}
                            type="datetime-local"
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.VencimentoGarantia} isRequired>
                        <FormLabel>Vencimento da Garantia</FormLabel>
                        <Input
                            id="VencimentoGarantia"
                            {...register("VencimentoGarantia")}
                            defaultValue={dataVencimentoGarantiaFormatada}
                            type="datetime-local"
                        />
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdEmpresa} isRequired>
                        <FormLabel>Empresa</FormLabel>
                        <Select placeholder='Selecionar empresa' value={selectedCompanyOption} onChange={setSelectCompanyOption}>
                            {companyData.map(
                                company =>
                                    <option value={company.IdEmpresa} key={company.IdEmpresa}>
                                        {company.NomeEmpresa}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdCategoriaEquipamento} isRequired>
                        <FormLabel>Categoria</FormLabel>
                        <Select placeholder='Selecionar categoria' value={selectedCategoryOption} onChange={setSelectCategoryOption}>
                            {categoryData.map(
                                category =>
                                    <option value={category.IdCategoriaEquipamento} key={category.IdCategoriaEquipamento}>
                                        {category.DescricaoCategoriaEquipamento}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdFabricante} isRequired>
                        <FormLabel>Fabricante</FormLabel>
                        <Select placeholder='Selecionar fabricante' value={selectedManufacturerOption} onChange={setSelectManufacturerOption}>
                            {manufacturerData.map(
                                manufacturer =>
                                    <option value={manufacturer.IdFabricante} key={manufacturer.IdFabricante}>
                                        {manufacturer.NomeFabricante}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdDepartamento} isRequired>
                        <FormLabel>Departamento</FormLabel>
                        <Select placeholder='Selecionar departamento' value={selectedDepartmentOption} onChange={setSelectDepartmentOption}>
                            {departmentData.map(
                                department =>
                                    <option value={department.IdDepartamento} key={department.IdDepartamento}>
                                        {department.NomeDepartamento}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdSituacaoEquipamento} isRequired>
                        <FormLabel>Situação equipamento</FormLabel>
                        <Select placeholder='Selecionar situação' value={selectedCompanyOption} onChange={setSelectSituationOption}>
                            {situationData.map(
                                situation =>
                                    <option value={situation.IdSituacaoEquipamento} key={situation.IdSituacaoEquipamento}>
                                        {situation.DescricaoSituacaoEquipamento}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdSala} isRequired>
                        <FormLabel>Sala</FormLabel>
                        <Select placeholder='Selecionar sala' value={selectedRoomOption} onChange={setSelectRoomOption}>
                            {roomData.map(
                                room =>
                                    <option value={room.IdSala} key={room.IdSala}>
                                        {room.DescricaoSala}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme={"cyan"} type="submit">Editar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </>
    )

}