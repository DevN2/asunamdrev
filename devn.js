// Copyright Devn 2023
// Secret Code
// Cardinal System Project

import path from 'path';
import { spawn } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Ubah file server yang akan dijalankan
const serverFile = 'server.js';

// Mulai server Node.js sebagai anak proses
const serverProcess = spawn(process.argv[0], [path.join(__dirname, serverFile)], {
  stdio: 'inherit',
});

// Tangani peristiwa keluar
serverProcess.on('exit', (code) => {
  console.error(`Server exited with code ${code}`);
  process.exit(code);
});

// Tangani peristiwa error
serverProcess.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Tangani peristiwa sinyal dan restart server
process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Stopping server...');
  serverProcess.kill();
  process.exit();
});

// Tangani peristiwa keluar server dan restart
process.on('exit', () => {
  console.log('Exiting main process. Stopping server...');
  serverProcess.kill();
});

//Inisialisasi
import config from "./config.js"
import { Client, Serialize } from "./lib/serialize.js"
import baileys from "@whiskeysockets/baileys"
const { useMultiFileAuthState, DisconnectReason, makeInMemoryStore, jidNormalizedUser, makeCacheableSignalKeyStore, PHONENUMBER_MCC } = baileys
import { Boom } from "@hapi/boom"
import Pino from "pino"
import NodeCache from "node-cache"
import chalk from "chalk"
import readline from "readline"
import { parsePhoneNumber } from "libphonenumber-js"
import open from "open"
import path from "path"
//End Inisialisasi

global.api = async (name, options = {}) => new (await import("./lib/api.js")).default(name, options)

//const section
const database = (new (await import("./lib/database.js")).default())
const store = makeInMemoryStore({ logger: Pino({ level: "fatal" }).child({ level: "fatal" }) })
const pairingCode = !!config.options.pairingNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

//Buka Koneksi
async function start() {
   process.on("unhandledRejection", (err) => console.error(err))

   const content = await database.read()
   if (content && Object.keys(content).length === 0) {
      global.db = {
         users: {},
         groups: {},
         ...(content || {}),
      }
      await database.write(global.db)
   } else {
      global.db = content
   }

   const { state, saveCreds } = await useMultiFileAuthState(`./${config.options.sessionName}`)
   const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"

   const devn = baileys.default({
      logger: Pino({ level: "fatal" }).child({ level: "fatal" }), // hide log
      printQRInTerminal: !pairingCode, // popping up QR in terminal log
      mobile: useMobile, // mobile api (prone to bans)
      auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: ['Chrome (Linux)', '', ''], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
      markOnlineOnConnect: true, // set false for offline
      generateHighQualityLinkPreview: true, // make high preview link
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
   })
   // bind store, write store maybe
   store.bind(devn.ev)

   // push update name to store.contacts
   devn.ev.on("contacts.update", (update) => {
      for (let contact of update) {
         let id = jidNormalizedUser(contact.id)
         if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
      }
   })

   // bind extra client
   await Client({ devn, store })

   // login use pairing code
   // source code https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
   if (pairingCode && !devn.authState.creds.registered) {
      if (useMobile) throw new Error('Cannot use pairing code with mobile api')

      let phoneNumber
      if (!!config.options.pairingNumber) {
         phoneNumber = config.options.pairingNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))
            process.exit(0)
         }
      } else {
         phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Ask again when entering the wrong number
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))

            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
         }
      }

      setTimeout(async () => {
         let code = await devn.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
      }, 3000)
   }

   // login mobile API (prone to bans)
   // source code https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L72
   if (useMobile && !devn.authState.creds.registered) {
      const { registration } = devn.authState.creds || { registration: {} }

      if (!registration.phoneNumber) {
         let phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Ask again when entering the wrong number
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))

            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number : `)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
         }

         registration.phoneNumber = "+" + phoneNumber
      }

      const phoneNumber = parsePhoneNumber(registration.phoneNumber)
      if (!phoneNumber.isValid()) throw new Error('Invalid phone number: ' + registration.phoneNumber)

      registration.phoneNumber = phoneNumber.format("E.164")
      registration.phoneNumberCountryCode = phoneNumber.countryCallingCode
      registration.phoneNumberNationalNumber = phoneNumber.nationalNumber

      const mcc = PHONENUMBER_MCC[phoneNumber.countryCallingCode]
      registration.phoneNumberMobileCountryCode = mcc

      async function enterCode() {
         try {
            const code = await question(chalk.bgBlack(chalk.greenBright(`Please Enter Your OTP Code : `)))
            const response = await devn.register(code.replace(/[^0-9]/g, '').trim().toLowerCase())
            console.log(chalk.bgBlack(chalk.greenBright("Successfully registered your phone number.")))
            console.log(response)
            rl.close()
         } catch (e) {
            console.error('Failed to register your phone number. Please try again.\n', e)
            await askOTP()
         }
      }

      // from this : https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L110
      async function enterCaptcha() {
         const response = await sock.requestRegistrationCode({ ...registration, method: 'captcha' })
         const pathFile = path.join(process.cwd(), "temp", "captcha.png")
         fs.writeFileSync(pathFile, Buffer.from(response.image_blob, 'base64'))
         await open(pathFile)
         const code = await question(chalk.bgBlack(chalk.greenBright(`Please Enter Your Captcha Code : `)))
         fs.unlinkSync(pathFile)
         registration.captcha = code.replace(/["']/g, '').trim().toLowerCase()
      }

      async function askOTP() {
         if (!registration.method) {
            let code = await question(chalk.bgBlack(chalk.greenBright('What method do you want to use? "sms" or "voice" : ')))
            code = code.replace(/["']/g, '').trim().toLowerCase()

            if (code !== 'sms' && code !== 'voice') return await askOTP()

            registration.method = code
         }

         try {
            await devn.requestRegistrationCode(registration)
            await enterCode()
         } catch (e) {
            console.error('Failed to request registration code. Please try again.\n', e)
            if (e?.reason === 'code_checkpoint') {
               await enterCaptcha()
            }
            await askOTP()
         }
      }

      await askOTP()
   }

   // for auto restart when error client
   devn.ev.on("connection.update", async (update) => {
      const { lastDisconnect, connection, qr } = update
      if (connection) {
         console.info(`Connection Status : ${connection}`)
      }

      if (connection === "close") {
         let reason = new Boom(lastDisconnect?.error)?.output.statusCode
         if (reason === DisconnectReason.badSession) {
            console.log(`Bad Session File, Please Delete Session and Scan Again`)
            process.send('reset')
         } else if (reason === DisconnectReason.connectionClosed) {
            console.log("Connection closed, reconnecting....")
            await start()
         } else if (reason === DisconnectReason.connectionLost) {
            console.log("Connection Lost from Server, reconnecting...")
            await start()
         } else if (reason === DisconnectReason.connectionReplaced) {
            console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First")
            process.exit(1)
         } else if (reason === DisconnectReason.loggedOut) {
            console.log(`Device Logged Out, Please Scan Again And Run.`)
            process.exit(1)
         } else if (reason === DisconnectReason.restartRequired) {
            console.log("Restart Required, Restarting...")
            await start()
         } else if (reason === DisconnectReason.timedOut) {
            console.log("Connection TimedOut, Reconnecting...")
            process.send('reset')
         } else if (reason === DisconnectReason.multideviceMismatch) {
            console.log("Multi device mismatch, please scan again")
            process.exit(0)
         } else {
            console.log(reason)
            process.send('reset')
         }
      }

      if (connection === "open") {
         devn.sendMessage(config.options.owner[0] + "@s.whatsapp.net", {
            text: `${devn?.user?.name || "devn"} has Connected...`,
         })
      }
   })

   // write session
   devn.ev.on("creds.update", saveCreds)

   // messages
   devn.ev.on("messages.upsert", async (message) => {
      if (!message.messages) return
      const m = await Serialize(devn, message.messages[0])
      await (await import(`./event/message.js?v=${Date.now()}`)).default(devn, m, message)
   })

   // group participants update
   devn.ev.on("group-participants.update", async (message) => {
      await (await import(`./event/group-participants.js?v=${Date.now()}`)).default(devn, message)
   })

   // group update
   devn.ev.on("groups.update", async (update) => {
      await (await import(`./event/group-update.js?v=${Date.now()}`)).default(devn, update)
   })

   // auto reject call when user call
   devn.ev.on("call", async (json) => {
      if (config.options.antiCall) {
         for (const id of json) {
            if (id.status === "offer") {
               let msg = await devn.sendMessage(id.from, {
                  text: `Maaf untuk saat ini, Kami tidak dapat menerima panggilan, entah dalam group atau pribadi\n\nJika Membutuhkan bantuan ataupun request fitur silahkan chat owner.`,
                  mentions: [id.from],
               })
               devn.sendContact(id.from, config.options.owner, msg)
               await devn.rejectCall(id.id, id.from)
            }
         }
      }
   })

   // rewrite database every 30 seconds
   setInterval(async () => {
      if (global.db) await database.write(global.db)
   }, 30000) // write database every 30 seconds

   return devn
}

start()
