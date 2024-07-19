type Response = {
    retcode: number;
    message: string;
    data: Data
}

type Data = {
    energy: Energy;
    vitality: Vitality;
    vhs_sale: VHS_SALE;
    card_sign: string;
}

type Energy = {
    progress: Progress;
    restore: number
}

type Progress = {
    max: number;
    current: number
}

type Vitality = {
    max: number;
    current: number
}

type VHS_SALE = {
    sale_state: string;
}

export default class Irem {

    private static readonly _BASE_URL: string = 'https://sg-act-nap-api.hoyolab.com/event/game_record_zzz/api/zzz/note?server=prod_gf_us&role_id=';
    private static readonly _USERID: string = Bun.env.USERID!;
    private static _message: string = '';

    public static async start(): Promise<void> {
        const data = await this.zzz();
        const message = this.messages(data);

        if (!message) return;

        await this.webhook(this._message);
    }

    private static async zzz(): Promise<Data> {
        const response = await fetch(this._BASE_URL + this._USERID, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'Cookie': Bun.env.COOKIE!,
                'Origin': 'https://act.hoyolab.com',
                'Referer': 'https://act.hoyolab.com/'
            }
        })

        const data: Response = await response.json();

        if (data.retcode !== 0) {
            await this.webhook(data.message);
            throw new Error(data.message);
        }

        return data.data;
    }

    private static messages(data: Data): (string | null) {

        const energy = data.energy.progress;
        const vitality = data.vitality;

        if (energy.current >= 200) this._message += `**Carga de Bateria** \nSua stamina tá/quase cheia **${energy.current}** de **${energy.max}**\n\n`;
        if (vitality.current !== vitality.max) this._message += `**Atividade Diária** \nVocê não completou todas as missões diárias. Ainda falta **${vitality.current}** de **${vitality.max}**\n\n`;
        if (data.card_sign.toLowerCase() === 'cardsignno') this._message += `**Raspadinha** \nNão concluído \n\n`;
        if (data.vhs_sale.sale_state.toLowerCase() === 'salestatedone') this._message += `**Locadora de Vídeo** \nEstá aguardando o pagamento.\n\n`;

        if (!this._message.length) return null;

        this._message += '-# <@220255772909633536> [Clique aqui](<https://tenor.com/ja/view/yuri-kiss-magirevo-magical-revoluton-anim-gif-9041538471964899174>) para receber um beijo ';

        return this._message;
    }

    private static async webhook(message: string): Promise<void> {
        await fetch(Bun.env.WEBHOOK!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": 'Irem',
                "avatar_url": 'https://i.imgur.com/KpeM0Qx.png',
                "content": message,
            })
        })
        this._message = '';
    }
}