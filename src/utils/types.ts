export type Category = {
    IdCategoriaEquipamento: number,
    DescricaoCategoriaEquipamento: string
}

export type Company = {
    IdEmpresa: number,
    NomeEmpresa: string
    EmailEmpresa: string
    NomeRepresentante: string
    SiteEmpresa: string
    TelefoneEmpresa: number
    IdCidade: number
}


export type Manufacturer = {
    IdFabricante: number,
    NomeFabricante: string
}

export type Situation = {
    IdSituacaoEquipamento: number,
    DescricaoSituacaoEquipamento: string
}


export type Department = {
    IdDepartamento: number,
    NomeDepartamento: string
    IdBlocoDepartamento: number
    IdTipoDepartamento: number
    IdSituacaoDepartamento: number
}

export type Equipamento = {
    IdEquipamento?: number
    Patrimonio?: string
    DescricaoEquipamento?: string
    NumeroSerial?: string
    DataAquisicao?: string
    VencimentoGarantia?: Date
    DataCadastro?: Date
    DataModificacao?: Date
    IdEmpresa?: number
    IdCategoriaEquipamento?: number
    IdSituacaoEquipamento?: number
    IdFabricante?: number
    IdDepartamento?: number
}

export type ReqData<QueryResult> = {
    totalRecords: number
    data: QueryResult[]
}

export type SelectOptions = {
    label: string
    value: string
}

export type ArrayType = {
    arrayLength: number,
    pageCount: number
}

export type FetchDataOptions = {
    pageIndex: number;
    pageSize: number;
};

export type AllRequestTypes = (Equipamento | Department)
