import type { Data, Progress, Vitality } from "./Response";

export default class Daily {

    private _message: string;
    private _energy: Progress;
    private _vitality: Vitality;

    constructor(private _data: Data) {
        this._energy = this._data.energy.progress;
        this._vitality = this._data.vitality;
        this._message = '';
    }

    public get message(): (string | undefined) {
        this.energy().vitality().cardSign().vhs();
        if (!this._message.length) throw new Error('Todas ás tarefas foram concluidas com sucesso! Volte amanhã.');
        return this._message;
    }

    private energy(): this {
        if (this._energy.current >= 200) {
            this._message += `**Carga de Bateria** \nSua stamina tá/quase cheia **${this._energy.current}** de **${this._energy.max}**\n\n`;
        }
        return this;
    }

    private vitality(): this {
        if (this._vitality.current !== this._vitality.max) {
            this._message += `**Atividade Diária** \nVocê não completou todas as missões diárias. Ainda falta **${this._vitality.current}** de **${this._vitality.max}**\n\n`;
        }
        return this;
    }

    private cardSign(): this {
        if (this._data.card_sign.toLowerCase() === 'cardsignno') {
            this._message += `**Raspadinha** \nNão concluído \n\n`;
        }
        return this;
    }

    private vhs(): this {
        if (this._data.vhs_sale.sale_state.toLowerCase() === 'salestatedone') {
            this._message += `**Locadora de Vídeo** \nEstá aguardando o pagamento.\n\n`;
        }
        return this;
    }
}