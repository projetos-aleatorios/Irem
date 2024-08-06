export type Response = {
    retcode: number;
    message: string;
    data: Data
}

export type Data = {
    energy: Energy;
    vitality: Vitality;
    vhs_sale: VHS_SALE;
    card_sign: string;
}

export type Energy = {
    progress: Progress;
    restore: number
}

export type Progress = {
    max: number;
    current: number
}

export type Vitality = {
    max: number;
    current: number
}

export type VHS_SALE = {
    sale_state: string;
}