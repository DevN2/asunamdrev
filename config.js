//Copyright Devn 2023
//Secret Code
//Cardinal System Project

//main setting
const menu = {
   main: ["help", "speed", "owner", "sc", "ping", "quoted"],
   owner: ["eval", "exec", "mute", "public", "setprofile", "setname"],
   convert: ["sticker", "toimage"],
   group: ["hidetag", "add", "welcome", "leaving", "setprofile", "setname", "linkgroup"],
   tool: ["fetch", "ssweb", "rvo", "blackbox", "ai", "diffusion", "animediffusion"],
   download: ["tiktok", "instagram", "facebook", "drive", "imgur", "mediafire", "pinterest", "twitter", "ytv", "yta", "apk", "spotify"],
   search: ["pinterest", "lirik", "chord"],
   education: ["wikipedia"],
   islami: ["quran", "nabi"]
}

const limit = {
   free: 15,
   premium: 150,
   VIP: "Infinity",
   download: {
      free: 50000000, // use byte
      premium: 350000000, // use byte
      VIP: 1130000000, // use byte
   }
}

export default {
   limit,
   menu,

   // Set your URL and API key here
   APIs: {
      xfarr: {
         baseURL: 'https://api.xfarr.com',
         Key: "buy on https://api.xfarr.com/pricing"
      }
   },

   // Set Prefix, Session Name, Database Name and other options here
   options: {
      public: true,
      antiCall: true, // reject call
      database: "database.json", // End .json when using JSON database or use Mongo URI
      owner: ["6282126688740"], // set owner number on here
      sessionName: "devn", // for name session
      prefix: /^[°•π÷×.¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i,
      pairingNumber: "62895323401464" // Example Input : 62xxx
   },

   // Set pack name sticker on here
   Exif: {
      packId: "https://asunabot.id",
      packName: `AsunaBot`,
      packPublish: "wa.me/62895323401464",
      packEmail: "asunabot@gmail.com",
      packWebsite: "https://asunabot.id",
      androidApp: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
      iOSApp: "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
      emojis: [],
      isAvatar: 0,
   },

   // message  response awikwok there
   msg: {
      owner: "*System Lock* Use authorized Developer to open!",
      group: "Hanya bisa digunakan didalam grup!",
      private: "Hanya bisa digunakan di chat pribadi!",
      admin: "Hanya admin grup yg bisa pakai fitur ini!",
      botAdmin: "Asuna belum admin, gabisa akses fiturnya :(",
      bot: "Features only accessible by me",
      media: "Reply media...",
      query: "Isi?",
      error: "*System Error* Tunggu sebentar dan coba lagi.",
      quoted: "Reply Pesan...",
      wait: "Tunggu!",
      urlInvalid: "Url Invalid",
      notFound: "Result Not Found!",
      premium: "*System Lock* Use authorized Premium to open!",
      vip: "*System Lock* Use authorized VIP to open!",
      dlFree: `File over ${formatSize(limit.download.free)} can only be accessed by premium users`,
      dlPremium: `WhatsApp cannot send files larger than ${formatSize(limit.download.premium)}`,
      dlVIP: `WhatsApp cannot send files larger than ${formatSize(limit.download.VIP)}`
   }
}


function formatSize(bytes, si = true, dp = 2) {
   const thresh = si ? 1000 : 1024;

   if (Math.abs(bytes) < thresh) {
      return `${bytes} B`;
   }

   const units = si
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
   let u = -1;
   const r = 10 ** dp;

   do {
      bytes /= thresh;
      ++u;
   } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
   );

   return `${bytes.toFixed(dp)} ${units[u]}`;
}