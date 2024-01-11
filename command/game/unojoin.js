// const { cekuno } = require("../../lib/optiongame");
// module.exports = {
// 	name: "unojoin",
// 	alias: ["unojoin"],
// 	category: "game",
// 	desc: "*HIDDEN FILE*, Uno join",
// 	async run({ msg, conn }, { q, lok }) {
// 		if (cekuno(msg.from, lok, "uno")) throw "Group Ini masih dalam sesi permainan";
// 		let uno = await rzky.game.uno();
//         let player = 
// 		if (uno) {
// 			const { key } = await msg.reply(
// 				`*UNO JOINED*\nList player : ${player}`
// 			);
// 			addSesi(msg.from, key.id, uno.jawaban, waktugame, lok, "uno");
// 			conn.game[key.id] = { status: false };
// 		} else msg.reply("Error");
// }
// };