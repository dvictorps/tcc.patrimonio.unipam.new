import React, { createContext, useContext, useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { api } from '@/api/api';
import { ArrayType, Block, Category, City, Company, DepType, Department, DepartmentSituation, Equipamento, Manufacturer, ReqData, Room, RoomSituation, RoomType, Situation, State } from '@/utils/types';
import { UseQueryResult, useQuery } from 'react-query';
import { SelectOptions, FetchDataOptions } from '@/utils/types';
import { PaginationState } from '@tanstack/react-table';

type ApiContextType = {
    post: <Type>(path: string, data: any) => Promise<AxiosResponse<Type>>
    delete: <Type>(path: string) => Promise<AxiosResponse<Type>>
    categoryData: Category[];
    companyData: Company[];
    manufacturerData: Manufacturer[];
    departmentData: Department[];
    situationData: Situation[];
    roomTypeData: RoomType[];
    roomSituationData: RoomSituation[];
    depTypeData: DepType[];
    blockData: Block[];
    cityData: City[];
    stateData: State[];
    departmentSituationData: DepartmentSituation[]
    fetchTableDescriptionData: () => void;
    arrayLength: ArrayType
    fetchTableData: <Type>(selectOption: SelectOptions, searchValue: string, route: string, situation: string,
        company: string, category: string, manufacturer: string, department: string) => Promise<{
            data: Type[];
            totalRecords: number;
        }>
    rowSelection: Record<string, never>
    setRowSelection: React.Dispatch<React.SetStateAction<{}>>
    useFetchData: <QueryResult>(selectOption: SelectOptions, searchValue: string, route: string, situation: string, company: string, category: string,
        manufacturer: string, department: string) => UseQueryResult<{
            data: QueryResult[];
            totalRecords: number;
        }, unknown>
    deleteIds: number[],
    pageIndex: number,
    pageSize: number,
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    getOne: <Type>(route: string, id: string) => Promise<Type | undefined>
    useModalData: <Type>() => (Type | React.Dispatch<React.SetStateAction<Type | undefined>> | undefined)[]
    patch: <Type>(path: string, data: any) => Promise<AxiosResponse<Type>>
    roomData: Room[]
    getCategory(id: number): string | undefined
    getCompany(id: number): string | undefined
    getManufacturer(id: number): string | undefined
    getDepartment(id: number): string | undefined
    getSituation(id: number): string | undefined
    getRoom(id: number): string | undefined
    getRoomType(id: number): string | undefined
    getRoomSituation(id: number): string | undefined
    getDepType(id: number): string | undefined
    getBlock(id: number): string | undefined
    getCity(id: number): string | undefined
    getState(id: number): string | undefined
    getDepartmentSituation(id: number): string | undefined
    fetchTableFullData: <Type>(selectOption: SelectOptions, searchValue: string, route: string, situation: string,
        company: string, category: string, manufacturer: string, department: string) => Promise<{
            data: Type[];
            totalRecords: number;
        }>
    useFetchFullData: <QueryResult>(selectOption: SelectOptions, searchValue: string, route: string, situation: string, company: string, category: string,
        manufacturer: string, department: string) => UseQueryResult<{
            data: QueryResult[];
            totalRecords: number;
        }, unknown>

};


const ApiContext = createContext<ApiContextType | undefined>(undefined);


type ApiProviderType = {
    children: React.ReactNode
}

export function ApiProvider({ children }: ApiProviderType) {
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [companyData, setCompanyData] = useState<Company[]>([]);
    const [manufacturerData, setManufacturerData] = useState<Manufacturer[]>([]);
    const [departmentData, setDepartmentData] = useState<Department[]>([]);
    const [situationData, setSituationData] = useState<Situation[]>([]);
    const [roomData, setRoomData] = useState<Room[]>([]);

    const [roomTypeData, setRoomType] = useState<RoomType[]>([]);
    const [roomSituationData, setRoomSituation] = useState<RoomSituation[]>([]);
    const [depTypeData, setDepType] = useState<DepType[]>([]);
    const [blockData, setBlockData] = useState<Block[]>([]);

    const [cityData, setCityData] = useState<City[]>([]);
    const [stateData, setStateData] = useState<State[]>([]);
    const [departmentSituationData, setDepartmentSituationData] = useState<DepartmentSituation[]>([]);


    const [rowSelection, setRowSelection] = useState({})



    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    }

    function useModalData<Type>() {
        const [editModalData, setEditModalData] = useState<Type>()

        return [editModalData, setEditModalData]
    }

    async function post(path: string, data: any): Promise<AxiosResponse<any>> {
        return api.post(path, data);
    };
    async function patch(path: string, data: any): Promise<AxiosResponse<any>> {
        return api.patch(path, data);
    };

    async function deleteRequest(path: string): Promise<AxiosResponse<any>> {
        return api.delete(path);
    };

    async function fetchTableDescriptionData() {
        const urls = ['/category', '/company', '/manufacturer', '/department', '/equipmentSituation', '/room', '/block', '/depType', '/roomSituation', '/roomType',
            '/city', '/state', '/departmentSituations'
        ];
        const requests = urls.map((url) => api.get(url));

        try {
            const responses = await Promise.all(requests);

            const category = responses[0].data; // ---
            const company = responses[1].data; // ----
            const manufacturer = responses[2].data; // ----
            const department = responses[3].data; //---
            const situation = responses[4].data; //---
            const room = responses[5].data; // ----
            const block = responses[6].data; // A fazer
            const depType = responses[7].data; // A fazer
            const roomSituation = responses[8].data; //----
            const roomType = responses[9].data; //  --- 
            const city = responses[10].data; //  ----
            const state = responses[11].data; //----
            const departmentSituations = responses[12].data; //----


            setCategoryData(category);
            setCompanyData(company);
            setManufacturerData(manufacturer);
            setDepartmentData(department);
            setSituationData(situation);
            setRoomData(room);
            setBlockData(block);
            setDepType(depType);
            setRoomSituation(roomSituation);
            setRoomType(roomType);
            setCityData(city);
            setStateData(state);
            setDepartmentSituationData(departmentSituations);


        } catch (error) {
            console.error('Erro nas requisições:', error);
        }
    };

    const [arrayLength, setArrayLength] = useState({
        arrayLength: 0,
        pageCount: 0
    } as ArrayType)


    async function getOne<Type>(route: string, id: string) {
        try {
            const response = await api.get(`/${route}/${id}`)
            const responseTyped: Type = response.data

            return responseTyped

        } catch (error) {
            console.log(error)
        }
    }

    async function fetchTableData<Type>(selectOption: SelectOptions, searchValue: string, route: string, situation: string, company: string, category: string,
        manufacturer: string, department: string) {
        try {
            const url = `/${route}?${selectOption.value}=${searchValue}&take=${fetchDataOptions.pageSize}&skip=${fetchDataOptions.pageIndex * fetchDataOptions.pageSize}&situation=${situation}&company=${company}&category=${category}&manufacturer=${manufacturer}&department=${department}`
            const response = await api.get(url)
            const responseTyped: ReqData<Type> = response.data
            setArrayLength({ arrayLength: responseTyped.data.length, pageCount: responseTyped.totalRecords } as ArrayType)
            return { data: responseTyped.data, totalRecords: responseTyped.totalRecords }
        } catch (error) {
            console.log(error)
            return { data: [], totalRecords: 404 };
        }
    };


    function useFetchData<QueryResult>(selectOption: SelectOptions, searchValue: string, route: string, situation: string, company: string, category: string,
        manufacturer: string, department: string) {
        const dataQuery = useQuery(
            ['data', fetchDataOptions],
            () => fetchTableData<QueryResult>(selectOption, searchValue, route, situation, company, category, manufacturer, department),
            { keepPreviousData: true }
        )
        return dataQuery
    }

    async function fetchTableFullData<Type>(selectOption: SelectOptions, searchValue: string, route: string, situation: string, company: string, category: string,
        manufacturer: string, department: string) {
        try {
            const url = `/${route}?${selectOption.value}=${searchValue}&situation=${situation}&company=${company}&category=${category}&manufacturer=${manufacturer}&department=${department}`
            const response = await api.get(url)
            console.log('RESPOSTA DO RELATORIO', response)
            const responseTyped: ReqData<Type> = response.data
            return { data: responseTyped.data, totalRecords: responseTyped.totalRecords }
        } catch (error) {
            console.log(error)
            return { data: [], totalRecords: 404 };
        }
    };

    function useFetchFullData<QueryResult>(selectOption: SelectOptions, searchValue: string, route: string, situation: string, company: string, category: string,
        manufacturer: string, department: string) {
        const dataQuery = useQuery(
            ['data'],
            () => fetchTableFullData<QueryResult>(selectOption, searchValue, route, situation, company, category, manufacturer, department),
            { keepPreviousData: true }
        )
        return dataQuery
    }


    const deleteIds: number[] = []

    for (const key in rowSelection) {
        deleteIds.push(Number(key))
    }

    useEffect(() => {
        fetchTableDescriptionData();
    }, [])

    function getCategory(id: number) {
        const category = categoryData.find((category) => category.IdCategoriaEquipamento === id);
        return category?.DescricaoCategoriaEquipamento
    }

    function getCompany(id: number) {
        const company = companyData.find((company) => company.IdEmpresa === id);
        return company?.NomeEmpresa
    }

    function getManufacturer(id: number) {
        const manufacturer = manufacturerData.find((manufacturer) => manufacturer.IdFabricante === id);
        return manufacturer?.NomeFabricante
    }

    function getDepartment(id: number) {
        const department = departmentData.find((department) => department.IdDepartamento === id);
        return department?.NomeDepartamento
    }

    function getSituation(id: number) {
        const situation = situationData.find((situation) => situation.IdSituacaoEquipamento === id);
        return situation?.DescricaoSituacaoEquipamento
    }

    function getRoom(id: number) {
        const room = roomData.find((room) => room.IdSala === id);
        return room?.DescricaoSala
    }

    function getRoomType(id: number) {
        const roomType = roomTypeData.find((roomType) => roomType.IdTipoSala === id);
        return roomType?.DescricaoTipoSala
    }

    function getRoomSituation(id: number) {
        const roomSituation = roomSituationData.find((roomSituation) => roomSituation.IdSituacaoSala === id);
        return roomSituation?.DescricaoSituacaoSala
    }

    function getDepType(id: number) {
        const depType = depTypeData.find((depType) => depType.IdTipoDepartamento === id);
        return depType?.TipoDepartamento
    }

    function getBlock(id: number) {
        const block = blockData.find((block) => block.IdBlocoDepartamento === id);
        return block?.DescricaoBlocoDepartamento
    }

    function getCity(id: number) {
        const city = cityData.find((city) => city.IdCidade === id);
        return city?.NomeCidade
    }

    function getState(id: number) {
        const state = stateData.find((state) => state.IdEstado === id);
        return state?.NomeEstado
    }

    function getDepartmentSituation(id: number) {
        const departmentSituation = departmentSituationData.find((departmentSituation) => departmentSituation.IdSituacaoDepartamento === id);
        return departmentSituation?.DescricaoSituacaoDepartamento
    }

    const contextValue: ApiContextType = {
        post,
        delete: deleteRequest,
        categoryData,
        companyData,
        manufacturerData,
        departmentData,
        situationData,
        fetchTableDescriptionData,
        arrayLength,
        fetchTableData,
        rowSelection,
        setRowSelection,
        useFetchData,
        deleteIds,
        pageIndex,
        pageSize,
        setPagination,
        getOne,
        useModalData,
        patch,
        roomData,
        blockData,
        depTypeData,
        roomSituationData,
        roomTypeData,
        cityData,
        departmentSituationData,
        stateData,
        getCategory, getBlock, getCity, getCompany,
        getDepartment, getDepartmentSituation, getDepType,
        getManufacturer, getRoom, getRoomSituation, getRoomType,
        getSituation, getState, fetchTableFullData, useFetchFullData

    };



    return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};

export function useApi() {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useApi deve ser usado dentro de um ApiProvider');
    }

    return context;
};