export type Category = {
    IdCategoriaEquipamento?: number,
    DescricaoCategoriaEquipamento?: string
}

export type Company = {
    IdEmpresa?: number,
    NomeEmpresa?: string
    EmailEmpresa?: string
    NomeRepresentante?: string
    SiteEmpresa?: string
    TelefoneEmpresa?: number
    IdCidade?: number
}


export type Manufacturer = {
    IdFabricante?: number,
    NomeFabricante?: string
}

export type Situation = {
    IdSituacaoEquipamento?: number,
    DescricaoSituacaoEquipamento?: string
}


export type Department = {
    IdDepartamento?: number,
    NomeDepartamento?: string
    IdBlocoDepartamento?: number
    IdTipoDepartamento?: number
    IdSituacaoDepartamento?: number
}

export type Equipamento = {
    IdEquipamento?: number
    Patrimonio?: string
    DescricaoEquipamento?: string
    NumeroSerial?: string
    DataAquisicao?: Date | string
    VencimentoGarantia?: Date | string
    DataCadastro?: Date | string
    DataModificacao?: Date | string
    IdEmpresa?: number
    IdCategoriaEquipamento?: number
    IdSituacaoEquipamento?: number
    IdFabricante?: number
    IdDepartamento?: number
    IdSala?: number
}

export type EquipamentoFormated = {
    IdEquipamento?: number
    Patrimonio?: string
    NumeroSerial?: string
    Sala?: string
    Departamento?: string
    SituacaoEquipamento?: string
    DescricaoEquipamento?: string
    DataAquisicao?: Date | string
    VencimentoGarantia?: Date | string
    DataCadastro?: Date | string
    DataModificacao?: Date | string
    Empresa?: string
    CategoriaEquipamento?: string
    Fabricante?: string
    IdSituacaoEquipamento?: number
}

export type Room = {
    IdSala?: number
    DescricaoSala?: string
    IdBlocoDepartamento?: number
    IdTipoSala?: number
    IdSituacaoSala?: number
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

export type Block = {
    IdBlocoDepartamento?: number
    DescricaoBlocoDepartamento?: string
}

export type DepType = {
    IdTipoDepartamento?: number
    TipoDepartamento?: string
}

export type RoomSituation = {
    IdSituacaoSala?: number
    DescricaoSituacaoSala?: string
}

export type RoomType = {
    IdTipoSala?: number
    DescricaoTipoSala?: string
}

export type City = {
    NomeCidade?: string
    IdCidade?: number
    IdEstado?: number
}

export type State = {
    IdEstado?: number
    NomeEstado?: string
    UF?: string
}

export type DepartmentSituation = {
    IdSituacaoDepartamento?: number
    DescricaoSituacaoDepartamento?: string
}

export type PersonType = {
    IdTipoPessoa: number
    DescricaoTipoPessoa: string
}

export type PersonSituation = {
    IdSituacaoPessoa: number
    DescricaoSituacaoPessoa: string
}

export type Users = {
    IdPessoa?: number
    Usuario?: string
    Nome?: string
    Email?: string
    IdSituacaoPessoa?: number
    IdTipoPessoa?: number
    Senha?: string
    DataCriacao?: Date
    DataModificacao?: Date,
}
