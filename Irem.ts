import Daily from "./Daily";
import type { Data, Response } from "./Response";

export default class Irem {

    private static readonly _BASE_URL: string = 'https://sg-act-nap-api.hoyolab.com/event/game_record_zzz/api/zzz/note?server=prod_gf_us&role_id=';
    private static readonly _USERID: string = Bun.env.USERID!;

    public static async start(): Promise<void> {
        try {
            const data = await this.zzz();
            const daily = new Daily(data);
            await this.webhook(daily.message!);
        } catch (e: any) {
            console.error(e.message)
        }
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
            process.exit(1)
        }

        return data.data;
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
    }
}