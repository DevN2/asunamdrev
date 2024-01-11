module.exports = {
	name: "kalkulator",
	category: "converter",
    alias: ["kalkulator", "mtk", "math"],
	desc: "Convert number",
    async run({ msg, conn, args }, { q }) {
    try{
    //if (args.length == 0) return msg.reply('[❗] Kirim perintah *!mtk [ Angka ]*\nContoh : !mtk 12*12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /')
                const mtk = args[1]
                if (typeof Math_js.evaluate(mtk) !== "number") {
                    msg.reply(`"${mtk}", bukan angka!\n[❗] Kirim perintah *!mtk [ Angka ]*\nContoh : !mtk 12*12\n*NOTE* :\n- Untuk Perkalian Menggunakan *\n- Untuk Pertambahan Menggunakan +\n- Untuk Pengurangan Mennggunakan -\n- Untuk Pembagian Menggunakan /`)
                } else {
                    msg.reply(`*「 MATH 」*\n\n*Hasil :*\n${mtk} = ${Math_js.evaluate(mtk)}`)
                }
                                        } catch(kn) {
                     msg.reply(kn)
                                        }
                                    }
                                };
                            