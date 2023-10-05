import { Category, Company, Department, Equipamento, Manufacturer, Room, Situation } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useEffect, useState } from "react"
import { UseFormRegister, FieldValues, UseFormHandleSubmit, FormState, FieldErrors, UseFormSetValue } from "react-hook-form"
type EquipmentModal = {
    register: UseFormRegister<FieldValues>
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>
    onSubmit: (data: Equipamento) => Promise<void>
    errors: FieldErrors<FieldValues>
    onClose: () => void
    companyData: Company[]
    categoryData: Category[]
    manufacturerData: Manufacturer[]
    departmentData: Department[]
    situationData: Situation[]
    roomData: Room[]
}

export function EquipmentInputModal({ register, handleSubmit, errors, onSubmit, onClose, companyData,
    categoryData, manufacturerData, departmentData, situationData, roomData }: EquipmentModal) {

    const checkData = (data: Equipamento) => {
        const formData: Partial<Equipamento> = {};

        formData.Patrimonio = data.Patrimonio;
        formData.DescricaoEquipamento = data.DescricaoEquipamento;
        formData.NumeroSerial = data.NumeroSerial;
        formData.DataAquisicao = data.DataAquisicao;
        formData.VencimentoGarantia = data.VencimentoGarantia;
        formData.IdEmpresa = selectedCompanyOption;
        formData.IdCategoriaEquipamento = selectedCategoryOption;
        formData.IdFabricante = selectedManufacturerOption;
        formData.IdDepartamento = selectedDepartmentOption;
        formData.IdSituacaoEquipamento = selectedSituationOption;
        formData.IdSala = selectedRoomOption;

        return formData;
    };


    const handleFormSubmit = (data: Equipamento) => {
        const fields = checkData(data);

        onSubmit(fields);


    }

    const [selectedCompanyOption, setselectedCompanyOption] = useState<number>()
    const [selectedCategoryOption, setselectedCategoryOption] = useState<number>()
    const [selectedManufacturerOption, setselectedManufacturerOption] = useState<number>()
    const [selectedDepartmentOption, setselectedDepartmentOption] = useState<number>()
    const [selectedSituationOption, setselectedSituationOption] = useState<number>()
    const [selectedRoomOption, setselectedRoomOption] = useState<number>()


    function setSelectCompanyOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = companyData.find(option => option.IdEmpresa?.toString() === event.target.value)
        if (option) return setselectedCompanyOption(option.IdEmpresa)
    }

    function setSelectCategoryOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = categoryData.find(option => option.IdCategoriaEquipamento?.toString() === event.target.value)
        if (option) return setselectedCategoryOption(option.IdCategoriaEquipamento)
    }

    function setSelectManufacturerOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = manufacturerData.find(option => option.IdFabricante?.toString() === event.target.value)
        if (option) return setselectedManufacturerOption(option.IdFabricante)
    }

    function setSelectDepartmentOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = departmentData.find(option => option.IdDepartamento?.toString() === event.target.value)
        if (option) return setselectedDepartmentOption(option.IdDepartamento)
    }

    function setSelectSituationOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = situationData.find(option => option.IdSituacaoEquipamento?.toString() === event.target.value)
        if (option) return setselectedSituationOption(option.IdSituacaoEquipamento)
    }

    function setSelectRoomOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = roomData.find(option => option.IdSala?.toString() === event.target.value)
        if (option) return setselectedRoomOption(option.IdSala)
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.Patrimonio} isRequired>
                        <FormLabel>Patrimônio</FormLabel>
                        <Input
                            id="Patrimonio"
                            {...register("Patrimonio", { maxLength: 20, required: true })}
                        />
                        {errors.Patrimonio && errors.Patrimonio.type === "maxLength" && (
                            <FormErrorMessage>O número de patrimônio pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.DescricaoEquipamento} isRequired>
                        <FormLabel>Descricao Equipamento</FormLabel>
                        <Input
                            id="DescricaoEquipamento"
                            {...register("DescricaoEquipamento", { maxLength: 50, required: true })}
                        />
                        {errors.DescricaoEquipamento && errors.DescricaoEquipamento.type === "maxLength" && (
                            <FormErrorMessage>A descrição pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.NumeroSerial} isRequired>
                        <FormLabel>Numero Serial</FormLabel>
                        <Input
                            id="NumeroSerial"
                            {...register("NumeroSerial", { maxLength: 30, required: true })}
                        />
                        {errors.NumeroSerial && errors.NumeroSerial.type === "maxLength" && (
                            <FormErrorMessage>O numero de serial pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.DataAquisicao} isRequired>
                        <FormLabel>Data da Aquisição</FormLabel>
                        <Input
                            id="DataAquisicao"
                            {...register("DataAquisicao", { required: true })}
                            type="datetime-local"
                        />
                        {errors.DataAquisicao && errors.DataAquisicao.type === "required" && (
                            <FormErrorMessage>Preencha corretamente o campo de data</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.VencimentoGarantia} isRequired>
                        <FormLabel>Vencimento da Garantia</FormLabel>
                        <Input
                            id="VencimentoGarantia"
                            {...register("VencimentoGarantia", { required: true })}
                            type="datetime-local"
                        />
                        {errors.VencimentoGarantia && errors.VencimentoGarantia.type === "required" && (
                            <FormErrorMessage>Preencha corretamente o campo de data</FormErrorMessage>
                        )}
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
                        <Select placeholder='Selecionar situação' value={selectedSituationOption} onChange={setSelectSituationOption}>
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
                        <Button colorScheme={"green"} type="submit">Adicionar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </>
    )

}