module.exports = {
	name: "sendsesi",
	alias: ["ssesi"], 
	category: "private",
	desc: "Mengirim sesi",
	isSpam: true,
	isOwner: true,
	async run({ msg, conn}) {
	  await conn.sendMessage(msg.from, {
					document: fs.readFileSync(`./devn.json`),
					fileName: "devn.json",
					mimetype: "application/json"
				});
		await msg.reply(`Sesi berhasil dikirim`);
	},
};
