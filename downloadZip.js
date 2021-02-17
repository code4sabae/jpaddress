import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import { sleep } from "https://code4sabae.github.io/js/sleep.js";

const data = CSV.toJSON(CSV.decode(await Deno.readTextFile("jpaddress.csv")));
console.log(data);

for (const d of data) {
    const zip = new Uint8Array(await (await fetch(d.url)).arrayBuffer());
    const fn = d.url.substring(d.url.lastIndexOf("/") + 1);
    await Deno.writeFile("zip/" + fn, zip);
    console.log(fn, zip.length);
    await sleep(500);
}
/*
const list = [];

const fns = [];
const files = Deno.readDir("data/");
for await (const file of files) {
    const fn = file.name;
    if (fn == "index.html") {
        continue;
    }
    console.log(fn);
    fns.push(fn);
}
fns.sort();
for (const fn of fns) {
    const prefcode = "JP-" + fn.substring(0, 2);

    const html = await Deno.readTextFile("data/" + fn);
    const root = HTMLParser.parse(html);
    const h1 = root.querySelector("h1").text.trim();
    const pref = h1.substring(0, h1.indexOf("の"));

    const links = root.querySelectorAll("a");
    for (const link of links) {
        const href = link.attributes.href;
        const txt = link.text.trim();
        //console.log(href, txt);
        if (href.startsWith("../data/")) {
            const city = txt;
            const fn = href.substring(3);
            const url = base + fn;
            list.push({ "ISO3155-2": prefcode, pref, city, url });
        }
    }
}
//console.log(list);
*/
