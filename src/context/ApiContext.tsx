import React, { createContext, useContext, useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import { api } from '@/api/api';
import { ArrayType, Category, Company, Department, Equipamento, Manufacturer, ReqData, Situation } from '@/utils/types';
import { UseQueryResult, useQuery } from 'react-query';
import { SelectOptions, FetchDataOptions } from '@/utils/types';
import { PaginationState } from '@tanstack/react-table';

type ApiContextType = {
    post: (path: string, data: any) => Promise<AxiosResponse<Equipamento>>;
    delete: (path: string) => Promise<AxiosResponse<Equipamento>>;
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
        route: string
    ) => Promise<{ data: Type[]; totalRecords: number }>;
    rowSelection: Record<string, never>
    setRowSelection: React.Dispatch<React.SetStateAction<{}>>
    fetchData: <QueryResult>(
        selectOption: SelectOptions,
        searchValue: string,
        route: string
    ) => UseQueryResult<{ data: QueryResult[]; totalRecords: number; }, unknown>;
    deleteIds: number[],
    pageIndex: number,
    pageSize: number,
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
};


const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [companyData, setCompanyData] = useState<Company[]>([]);
    const [manufacturerData, setManufacturerData] = useState<Manufacturer[]>([]);
    const [departmentData, setDepartmentData] = useState<Department[]>([]);
    const [situationData, setSituationData] = useState<Situation[]>([]);
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

    const post = async (path: string, data: any): Promise<AxiosResponse<Equipamento>> => {
        return api.post(path, data);
    };

    const deleteRequest = async (path: string): Promise<AxiosResponse<Equipamento>> => {
        return api.delete(path);
    };

    const fetchTableDescriptionData = async () => {
        const urls = ['/category', '/company', '/manufacturer', '/department', '/situation'];
        const requests = urls.map((url) => api.get(url));

        try {
            const responses = await Promise.all(requests);

            const category = responses[0].data;
            const company = responses[1].data;
            const manufacturer = responses[2].data;
            const department = responses[3].data;
            const situation = responses[4].data;

            setCategoryData(category);
            setCompanyData(company);
            setManufacturerData(manufacturer);
            setDepartmentData(department);
            setSituationData(situation);
        } catch (error) {
            console.error('Erro nas requisições:', error);
        }
    };

    const [arrayLength, setArrayLength] = useState({
        arrayLength: 0,
        pageCount: 0
    } as ArrayType)

    async function fetchTableData<Type>(selectOption: SelectOptions, searchValue: string, route: string) {
        try {
            const response = await api.get(`/${route}?${selectOption.value}=${searchValue}&take=${fetchDataOptions.pageSize}&skip=${fetchDataOptions.pageIndex * fetchDataOptions.pageSize}`)
            const responseTyped: ReqData<Type> = response.data
            setArrayLength({ arrayLength: responseTyped.data.length, pageCount: responseTyped.totalRecords } as ArrayType)
            return { data: responseTyped.data, totalRecords: responseTyped.totalRecords }
        } catch (error) {
            console.log(error)
            return { data: [], totalRecords: 404 };
        }
    };

    function fetchData<QueryResult>(selectOption: SelectOptions, searchValue: string, route: string) {
        const dataQuery = useQuery(
            ['data', fetchDataOptions],
            () => fetchTableData<QueryResult>(selectOption, searchValue, route),
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
        fetchData,
        deleteIds,
        pageIndex,
        pageSize,
        setPagination

    };



    return <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useApi deve ser usado dentro de um ApiProvider');
    }

    return context;
};