// const { cekStatus1, addSesi1 } = require("../../lib/optiongame");

// module.exports = {
// 	name: "tebakgambar",
// 	alias: ["tgambar"],
// 	category: "game",
// 	desc: "Main tebak gambar!",
// 	isSpam: true,
// 	isGroup: true,
// 	isLimitGame: true,
// 	async run({ msg, conn }, { q, map }) {
// 		if (cekStatus1(msg.from, map, "tebakgambar")) throw "Group Ini masih dalam sesi permainan";
// 		let waktugame = 60;
//         let gambar = fs.readFileSync('./lib/tgambar.json')
//         let json = JSON.parse(gambar)
//         let index = Math.floor(Math.random() * json.length)
//         let tebakan = json[index]
//         let jawaban = tebakan.teks
//         let gmbr = tebakan.image     
//         const { key } = await msg.reply(
//              `${gmbr} *_Silahkan Jawab Maksud dari Gambar ini kak :)_*`
//         );
//         addSesi(msg.from, key.id, jawaban, waktugame, map, "tebakgambar");
//         conn.game[key.id] = { status: false };
//     }
// };
