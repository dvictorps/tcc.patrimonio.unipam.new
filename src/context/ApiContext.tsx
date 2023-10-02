import React, { createContext, useContext } from 'react';
import { AxiosResponse } from 'axios';
import { api } from '@/api/api';
import { Equipamento } from '@/utils/types';
// Defina os tipos de dados que sua API pode retornar aqui
type ApiContextType = {
    post: (
        path: string,
        data: any
    ) => Promise<AxiosResponse<Equipamento>>;

    delete: (
        path: string
    ) => Promise<AxiosResponse<Equipamento>>;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Um componente de provedor para encapsular sua aplicação
export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const post = async (
        path: string,
        data: any
    ): Promise<AxiosResponse<Equipamento>> => {
        return api.post(path, data);
    };

    const deleteRequest = async (
        path: string
    ): Promise<AxiosResponse<Equipamento>> => {
        return api.delete(path);
    };

    const contextValue: ApiContextType = {
        post,
        delete: deleteRequest,
    };

    return (
        <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
    );
};

// Um gancho personalizado para acessar o contexto em componentes
export const useApi = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useApi deve ser usado dentro de um ApiProvider');
    }

    return context;
};