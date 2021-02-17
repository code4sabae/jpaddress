import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import { SJIS } from "https://code4sabae.github.io/js/SJIS.js";

const extractCSV = async (fn) => {
    const p = Deno.run({
        cmd: ["unzip", "-p", fn, "*.csv"],
        stdout: "piped",
    });
    const buf = await Deno.readAll(p.stdout);
    p.close();
    const txt = SJIS.decodeAuto(buf);
    const csv = CSV.decode(txt);
    return csv;
};

let cnt = 0;
const list = {};

const files = Deno.readDir("zip/");
for await (const file of files) {
    const fn = file.name;
    if (!fn.endsWith(".zip")) {
        continue;
    }
    const data = await extractCSV("zip/" + fn);
    cnt += data.length;
    console.log(fn, data.length, cnt);

    for (const d of data) {
        const name = d[0] + " " + d[1];
        const l = list[name];
        if (!l) {
            list[name] = [d[0], d[1], d[7], d[6]];
        }
    }
    //break;
}
const res = Object.values(list).sort((a, b) => {
    return parseInt(a[0]) - parseInt(b[0]);
});
res.unshift(["lgcode", "name", "lat", "lng"]);
await Deno.writeTextFile("jpaddress-summary.csv", CSV.encode(res));
console.log(res);
