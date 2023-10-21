import { ModalStyled } from "@/components/Modal"
import { useApi } from "@/context/ApiContext"
import { Block, Room, RoomSituation, RoomType } from "@/utils/types"
import { ModalBody, FormControl, FormLabel, Input, FormErrorMessage, ModalFooter, Button, Box, Select } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"
import { useForm } from "react-hook-form"
import { UseQueryResult } from "react-query"
type RoomModal = {

    open: boolean
    onClose(): void
    isCentered?: boolean
    blockData: Block[]
    roomSituationData: RoomSituation[]
    roomTypeData: RoomType[]
    dataQuery: UseQueryResult<void, unknown>
}

export function RoomModal({ onClose, open, isCentered, blockData, roomTypeData, roomSituationData, dataQuery }: RoomModal) {

    const { post } = useApi()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: Room) => {

        console.log('teste:', data)
        await handlePost(data);
        await dataQuery.refetch()
        reset();

    }

    async function handlePost(data: Room) {
        try {
            const response = await post<Room>(`room/register`, data)
            console.log('Resposta add:', response)

        } catch (error) {
            console.log('Erro no add', error);
        }
        onClose()
    }


    const checkData = (data: Room) => {
        const formData: Partial<Room> = {};

        formData.DescricaoSala = data.DescricaoSala;
        formData.IdBlocoDepartamento = selectedBloco;
        formData.IdSituacaoSala = selectedSituacao;
        formData.IdTipoSala = selectedTipo;

        return formData;
    };

    const handleFormSubmit = (data: Room) => {
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
        const option = roomSituationData.find(option => option.IdSituacaoSala?.toString() === event.target.value)
        if (option) return setSelectedSituacao(option.IdSituacaoSala)
    }

    function setSelectTipoOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = roomTypeData.find(option => option.IdTipoSala?.toString() === event.target.value)
        if (option) return setSelectedTipo(option.IdTipoSala)
    }

    return (

        <ModalStyled onClose={onClose} title="Adicionar Sala" open={open} isCentered={isCentered}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalBody>
                    <FormControl isInvalid={!!errors.DescricaoSala} isRequired>
                        <FormLabel>Descrição</FormLabel>
                        <Input
                            id="DescricaoSala"
                            {...register("DescricaoSala", { maxLength: 10, required: true })}
                        />
                        {errors.DescricaoSala && errors.DescricaoSala.type === "maxLength" && (
                            <FormErrorMessage>A descrição da sala pode ter no máximo 10 caracteres</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.IdBlocoDepartamento} isRequired>
                        <FormLabel>Selecionar Bloco</FormLabel>
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
                    <FormControl isInvalid={!!errors.IdTipoSala} isRequired>
                        <FormLabel>Selecionar Tipo</FormLabel>
                        <Select placeholder='Selecionar tipo de sala' value={selectedTipo} onChange={setSelectTipoOption}>
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
                        <Button colorScheme={"green"} type="submit">Adicionar</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </form>
        </ModalStyled>

    )

}