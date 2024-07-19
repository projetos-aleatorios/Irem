import Irem from "./Irem";

await Irem.start();
setInterval(async () => await Irem.start(), 1 * 60 * 60000);

export { }