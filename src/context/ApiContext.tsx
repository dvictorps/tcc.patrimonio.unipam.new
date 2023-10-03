import React, { createContext, useContext, useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { api } from '@/api/api';
import { AllRequestTypes, ArrayType, Category, Company, Department, Equipamento, Manufacturer, ReqData, Room, Situation } from '@/utils/types';
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
    fetchTableDescriptionData: () => void;
    arrayLength: ArrayType
    fetchTableData: <Type>(
        selectOption: SelectOptions,
        searchValue: string,
        route: string,
        situation: number
    ) => Promise<{ data: Type[]; totalRecords: number }>;
    rowSelection: Record<string, never>
    setRowSelection: React.Dispatch<React.SetStateAction<{}>>
    useFetchData: <QueryResult>(
        selectOption: SelectOptions,
        searchValue: string,
        route: string,
        situation: number
    ) => UseQueryResult<{ data: QueryResult[]; totalRecords: number; }, unknown>;
    deleteIds: number[],
    pageIndex: number,
    pageSize: number,
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    getOne: <Type>(route: string, id: string) => Promise<Type | undefined>
    useModalData: <Type>() => (Type | React.Dispatch<React.SetStateAction<Type | undefined>> | undefined)[]
    patch: <Type>(path: string, data: any) => Promise<AxiosResponse<Type>>
    roomData: Room[]
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
        const urls = ['/category', '/company', '/manufacturer', '/department', '/equipmentSituation', '/room'];
        const requests = urls.map((url) => api.get(url));

        try {
            const responses = await Promise.all(requests);

            const category = responses[0].data;
            const company = responses[1].data;
            const manufacturer = responses[2].data;
            const department = responses[3].data;
            const situation = responses[4].data;
            const room = responses[5].data;

            console.log('OIE', situation)

            setCategoryData(category);
            setCompanyData(company);
            setManufacturerData(manufacturer);
            setDepartmentData(department);
            setSituationData(situation);
            setRoomData(room);

            console.log('aqui agora', roomData)
        } catch (error) {
            console.error('Erro nas requisições:', error);
        }
    };

    const [arrayLength, setArrayLength] = useState({
        arrayLength: 0,
        pageCount: 0
    } as ArrayType)

    async function fetchTableData<Type>(selectOption: SelectOptions, searchValue: string, route: string, situation: number) {
        try {
            const response = await api.get(`/${route}?${selectOption.value}=${searchValue}&take=${fetchDataOptions.pageSize}&skip=${fetchDataOptions.pageIndex * fetchDataOptions.pageSize}&situation=${situation}`)
            const responseTyped: ReqData<Type> = response.data
            setArrayLength({ arrayLength: responseTyped.data.length, pageCount: responseTyped.totalRecords } as ArrayType)
            return { data: responseTyped.data, totalRecords: responseTyped.totalRecords }
        } catch (error) {
            console.log(error)
            return { data: [], totalRecords: 404 };
        }
    };

    async function getOne<Type>(route: string, id: string) {
        try {
            const response = await api.get(`/${route}/${id}`)
            const responseTyped: Type = response.data

            return responseTyped

        } catch (error) {
            console.log(error)
        }
    }

    function useFetchData<QueryResult>(selectOption: SelectOptions, searchValue: string, route: string, situation: number) {
        const dataQuery = useQuery(
            ['data', fetchDataOptions],
            () => fetchTableData<QueryResult>(selectOption, searchValue, route, situation),
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
        roomData

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