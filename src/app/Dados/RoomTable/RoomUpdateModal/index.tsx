import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Block, Room, RoomSituation, RoomType } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type RoomUpdateModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    blockData: Block[]
    roomSituationData: RoomSituation[]
    roomTypeData: RoomType[]
    componentData?: Room
    dataQuery: UseQueryResult<void, unknown>

}

export function RoomUpdateModal({ onClose, open, isCentered, blockData, roomTypeData, roomSituationData, componentData, dataQuery }: RoomUpdateModal) {

    const { patch } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Room) => {

        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Room) {
        try {
            const response = await patch<Room>(`room/update/${componentData?.IdSala}`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no update', error);
        }
        onClose()
    }


    const checkData = (formData: Room, originalData?: Room) => {
        const filteredData: Partial<Room> = {};

        if (formData.DescricaoSala !== originalData?.DescricaoSala) {
            filteredData.DescricaoSala = formData?.DescricaoSala;
        }

        if (selectedBloco !== originalData?.IdBlocoDepartamento) {
            filteredData.IdBlocoDepartamento = selectedBloco;
        }
        if (selectedSituacao !== originalData?.IdSituacaoSala) {
            filteredData.IdSituacaoSala = selectedSituacao;
        }
        if (selectedTipo !== originalData?.IdTipoSala) {
            filteredData.IdTipoSala = selectedTipo;
        }
        return filteredData;
    };

    const handleFormSubmit = (data: Room) => {

        const fields = checkData(data, componentData);

        if (Object.keys(fields).length === 0) {
            onClose();
        } else {
            onSubmit(fields);
        };

    }

    const [selectedBloco, setSelectedBloco] = useState<number | undefined>(componentData?.IdBlocoDepartamento)
    const [selectedSituacao, setSelectedSituacao] = useState<number | undefined>(componentData?.IdSituacaoSala)
    const [selectedTipo, setSelectedTipo] = useState<number | undefined>(componentData?.IdTipoSala)

    function setSelectedBlocoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = blockData.find(option => option.IdBlocoDepartamento?.toString() === event.target.value)
        if (option) return setSelectedBloco(option.IdBlocoDepartamento)
    }

    function setSelectedSituacaoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = roomSituationData.find(option => option.IdSituacaoSala?.toString() === event.target.value)
        if (option) return setSelectedSituacao(option.IdSituacaoSala)
    }

    function setSelectTipoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = roomTypeData.find(option => option.IdTipoSala?.toString() === event.target.value)
        if (option) return setSelectedTipo(option.IdTipoSala)
    }

    return (

        <ModalStyled onClose={onClose} title="Editar Sala" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoSala} isRequired>
                        <FormLabel>Descrição</FormLabel>
                        <Input
                            defaultValue={componentData?.DescricaoSala}
                            id="DescricaoSala"
                            {...register("DescricaoSala", { maxLength: 10, required: true })}
                        />
                        {errors.DescricaoSala && errors.DescricaoSala.type === "maxLength" && (
                            <FormErrorMessage>A descrição da sala pode ter no máximo 10 caracteres</FormErrorMessage>
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
                    <FormControl isInvalid={!!errors.IdSituacaoSala} isRequired>
                        <FormLabel>Situação</FormLabel>
                        <Select placeholder='Selecionar situação' value={selectedSituacao} onChange={setSelectedSituacaoOption}>
                            {roomSituationData.map(
                                roomSituation =>
                                    <option value={roomSituation.IdSituacaoSala} key={roomSituation.IdSituacaoSala}>
                                        {roomSituation.DescricaoSituacaoSala}
                                    </option>
                            )}
                        </Select>
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdFabricante} isRequired>
                        <FormLabel>Tipo</FormLabel>
                        <Select placeholder='Selecionar tipo' value={selectedTipo} onChange={setSelectTipoOption}>
                            {roomTypeData.map(
                                roomType =>
                                    <option value={roomType.IdTipoSala} key={roomType.IdTipoSala}>
                                        {roomType.DescricaoTipoSala}
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