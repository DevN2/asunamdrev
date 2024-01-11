module.exports = {
	name: "halah",
	alias: ["halah", "hlah", "haah", "hlaah"], 
	category: "fun",
	use: "!halah [teks]", 
	query: "Usage : !halah aku ganteng",
	isSpam: true,
	async run({ msg, conn }, { arg, args, q}) {
        const isi = args[1]
        teks = isi.replace(/[e]/g,"a")
        teks = isi.replace(/[o]/g,"a")
        teks = isi.replace(/[u]/g,"a")
        teks = isi.replace(/[E]/g,"A")
        teks = isi.replace(/[O]/g,"A")
        teks = isi.replace(/[U]/g,"A")
	  conn.sendMessage(msg.from, {text: teks})
	}
}