
 let axios = require('axios')
 let cheerio = require('cheerio')
 
 module.exports = {
	name: "wiki",
	alias: ["wiki", "w"],
	category: "other",
	desc: "Wikipedia",
	async run({ msg, conn }, { q }) {
    async function result(query) {
    return new Promise((resolve, reject) => {
     axios.get(`https://id.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=1&srsearch=${encodeURIComponent(query)}`)
       .then(({ data }) => {
         const getId = data.query.search[0].pageid;
         axios.get(`https://id.wikipedia.org/?curid=${getId}`)
           .then(({ data }) => {
             $ = cheerio.load(data);
             let script = $("script[type='application/ld+json']").get();
             let json;
             for(let anu of script){
               json = JSON.parse(anu.children[0].data);
             }
             result = $("table.infobox").next().text().trim();
             const resultt = {
               title: json.headline,
               url: json.url,
               publisher: json.publisher.name,
               datePublished: json.datePublished,
               thumbnail: json.image,
               context: result
             };
             resolve(resultt);
           }).catch(reject);
       }).catch(reject);
   });
 }
}
 }
 module.exports = { result }
 