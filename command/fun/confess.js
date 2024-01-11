module.exports = {
	name: "confess",
	alias: ["psn", "chat", "menfest", "confess"], 
	category: "other",
	use: "nama|nomer|pesan", 
	query: "Mohon isi dengan benar\nContoh: !pesan Rahasia|6282xxxxxx|pesannya",
	isSpam: true,
	async run({ msg, conn }, { arg, args, q}) {
	  const inp = q.split('|')
	  let nomer = inp[1]
	  let pesan = inp[2]
	  let pengirim = inp[0]
	  const [ result ] = await conn.onWhatsApp(nomer)
	  if(!result) return reply("Nomor salah, mohon ulangi dengan nomor yang benar")
	  pengirim !== undefined? pengirim:"Rahasia"
	  const txt = `[ Pesan Rahasia ]
	  
	  Pengirim: ${pengirim}
	  Pesan: ${pesan}
	  
	  Pada: ${moment().format('HH-mm-ss')} WIB
	  Untuk membalas Reply pesan ini dan ketik pesannya`
	  conn.sendMessage(nomer + "@s.whatsapp.net", {text: txt, mentions: [msg.from]})
	  conn.sendMessage(msg.from, {text: "Pesan berhasil dikirim kepada @" + nomer, withTag: true})
	}
}