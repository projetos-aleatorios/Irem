import Irem from "./Irem";

const { USERID, COOKIE, WEBHOOK } = Bun.env;
if (!USERID || !COOKIE || !WEBHOOK) throw new Error('USERID, COOKIE ou WEBHOOK está faltando no arquivo .env');

/* Bun Runtime */
await Irem.start();
setInterval(async () => await Irem.start(), 1 * 60 * 60000);

export {};