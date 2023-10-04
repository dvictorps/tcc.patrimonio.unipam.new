import { Equipamento } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { UseFormRegister, FieldValues, UseFormHandleSubmit, FormState, FieldErrors, UseFormSetValue } from "react-hook-form"
type EquipmentModal = {
    register: UseFormRegister<FieldValues>
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>
    onSubmit: (data: Equipamento) => Promise<void>
    errors: FieldErrors<FieldValues>
    componentData?: Equipamento
    onClose: () => void
}

export function EquipmentInputModal({ register, handleSubmit, errors, onSubmit, componentData, onClose }: EquipmentModal) {
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


        return filteredData;
    };

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