import { SJIS } from "https://code4sabae.github.io/js/SJIS.js";
import HTMLParser from "https://dev.jspm.io/node-html-parser";

const base = "https://saigai.gsi.go.jp/jusho/download/";
const url = "https://saigai.gsi.go.jp/jusho/download/index.html";

/*
const html = await (await fetch(url)).text();
await Deno.writeTextFile("data/index.html", html);
*/
const html = await Deno.readTextFile("data/index.html");
const root = HTMLParser.parse(html);

const links = root.querySelectorAll("a");
for (const link of links) {
    const href = link.attributes.href;
    const txt = link.text.trim();
    if (href.startsWith("pref/")) {
        console.log(href, txt);
        const url = base + href;
        const html = await (await fetch(url)).text();
        const fn = href.substring(5);
        await Deno.writeTextFile("data/" + fn, html);
    }
}
