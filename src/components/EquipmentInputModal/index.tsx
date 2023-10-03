import { Equipamento } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { UseFormRegister, FieldValues, UseFormHandleSubmit, FormState, FieldErrors } from "react-hook-form"

type EquipmentModal = {
    register: UseFormRegister<FieldValues>
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>
    onSubmit: (data: Equipamento) => Promise<void>
    errors: FieldErrors<FieldValues>
    componentData?: Equipamento
    onClose: () => void
}

export function EquipmentInputModal({ register, handleSubmit, errors, onSubmit, componentData, onClose }: EquipmentModal) {

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            <FormErrorMessage>A descrição pode ter no máximo 20 caracteres</FormErrorMessage>
                        )}
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