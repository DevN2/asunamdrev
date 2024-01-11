module.exports = {
	name: "adminmode",
	alias: ["administratormode", "adminmode", "admin"],
	category: "private",
	desc: "Ganti bot menjadi otoritas admin [UNTUK PENGEMBANGAN]",
	isSpam: true,
	isOwner: true,
	query: "Penggunaan :\n*#adminmode*",
	use: "@tag 30d",
	async run({ msg, conn }, { q, map, args }) {
			msg.reply("*[HANYA UNTUK PENGEMBANGAN]*\n\n[!] ADMINISTRATOR MODE ON [!]");
	},
};
