import { CSV } from "https://code4sabae.github.io/js/CSV.js";
import HTMLParser from "https://dev.jspm.io/node-html-parser";

const base = "https://saigai.gsi.go.jp/jusho/download/";
const url = "https://saigai.gsi.go.jp/jusho/download/index.html";

/*
const html = await (await fetch(url)).text();
await Deno.writeTextFile("data/index.html", html);

*/

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
            /*
            const html = await (await fetch(url)).text();
            await Deno.writeTextFile("data/" + fn, html);
            */
        }
    }
}
//console.log(list);
await Deno.writeTextFile("jpaddress.csv", CSV.encode(CSV.fromJSON(list)));
