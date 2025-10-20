type Role = "SUPER_ADMIN" | "MANAGER" | "NOC"

export type User = { id: string; email: string; role: Role }
export type Customer = {
  id: string
  company: string
  branch?: string
  region?: string
  sid?: string
  isp?: string
  telpPic?: string
  callCenter?: string
  bandwidth?: string
  customerId?: string
}
export type Ticket = {
  id: string
  ticketNo: string
  customerId: string
  problem: string
  location: string
  status: "OPEN" | "IN_PROGRESS" | "CLOSED"
  openedBy: string
}

const g = globalThis as any
if (!g.__MEMDB__) {
  g.__MEMDB__ = {
    users: [] as User[],
    customers: [] as Customer[],
    tickets: [] as Ticket[],
    seq: 0,
  }
  // seed minimal dari screenshot
  g.__MEMDB__.customers.push(
    {
      id: "c-pt-pcn",
      company: "PT. Pandu Citinetwork Nusantara",
      region: "DIY",
      sid: "",
      isp: "Dikanet",
      callCenter: "081929200005",
    },
    {
      id: "c-pt-nus",
      company: "PT. Nusantara Mahabakti",
      branch: "Menara Karya",
      region: "Jakarta",
      sid: "S0046044",
      isp: "iForte",
    },
    {
      id: "c-pt-ent",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Tunjungan Plaza 5",
      region: "Surabaya",
      isp: "Telkom Indibiz",
    },
  )

  g.__MEMDB__.customers.push(
    // PT. Entertainment Indonesia (Celebrity Fitness ...)
    {
      id: "c-ent-tp5",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Tunjungan Plaza 5",
      region: "Surabaya",
      sid: "152413175556",
      isp: "Telkom Indibiz",
    },
    {
      id: "c-ent-fx-sudirman",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness FX Sudirman Plaza",
      region: "Jakarta",
      sid: "5501117172 / 1000461075",
      isp: "Biznet",
    },
    {
      id: "c-ent-kuningan",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Kuningan City",
      region: "Jakarta",
      sid: "54994942",
    },
    {
      id: "c-ent-artha",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Mall Artha Gading",
      region: "Jakarta",
      sid: "121108002457",
    },
    {
      id: "c-ent-gandaria",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Gandaria City",
      region: "Jakarta",
      sid: "121202272188",
    },
    {
      id: "c-ent-pik",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness PIK Avenue",
      region: "Jakarta",
      sid: "122734216706",
    },
    {
      id: "c-ent-bintaro",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Lotte Mall Bintaro",
      region: "Tangerang",
      sid: "122210311231",
    },
    {
      id: "c-ent-margo",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Mall Margo City",
      region: "Depok",
      sid: "122219620391",
    },
    {
      id: "c-ent-food-centrum",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Food Centrum",
      region: "Jakarta",
      sid: "123508209934",
    },
    {
      id: "c-ent-puri",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Mall Puri Indah",
      region: "Jakarta",
      sid: "5501117172 / 1000516836",
    },
    {
      id: "c-ent-karawaci",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Supermall Karawaci",
      region: "Tangerang",
      sid: "13030580",
    },
    {
      id: "c-ent-paragon",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Mall Paragon Semarang",
      region: "Semarang",
      sid: "142406118889",
    },
    {
      id: "c-ent-metro-pi",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Metro Pondok Indah",
      region: "Jakarta",
      sid: "5501117172 / 1000566876",
    },
    {
      id: "c-ent-lippo-jogja",
      company: "PT. Entertainment Indonesia",
      branch: "Celebrity Fitness Lippo Plaza Jogja",
      region: "Yogyakarta",
      sid: "15.10050176",
    },

    // PT. Fitness First Indonesia
    {
      id: "c-ffi-lsa",
      company: "PT. Fitness First Indonesia",
      branch: "Fitness First Lotte Shopping Avenue",
      region: "Jakarta",
      sid: "122712238821",
    },
    {
      id: "c-ffi-mbca",
      company: "PT. Fitness First Indonesia",
      branch: "Fitness First Menara BCA",
      region: "Jakarta",
      sid: "121661040206",
    },
    {
      id: "c-ffi-ta",
      company: "PT. Fitness First Indonesia",
      branch: "Fitness First Mall Taman Anggrek",
      region: "Jakarta",
      sid: "02148799",
    },
    {
      id: "c-ffi-lippo-kemang",
      company: "PT. Fitness First Indonesia",
      branch: "Fitness First Mall Lippo Kemang",
      region: "Jakarta",
      sid: "13.10050176",
    },
    {
      id: "c-ffi-cibubur",
      company: "PT. Fitness First Indonesia",
      branch: "Fitness First Cibubur Junction",
      region: "Bogor",
      sid: "14.10050176",
    },
    {
      id: "c-ffi-senayan",
      company: "PT. Fitness First Indonesia",
      branch: "Fitness First Senayan City",
      region: "Jakarta",
      sid: "5501117172 / 1000581959",
    },
    {
      id: "c-ffi-pejaten",
      company: "PT. Fitness First Indonesia",
      branch: "Fitness First Pejaten Village",
      region: "Jakarta",
      sid: "16.10050176",
    },

    // PT. HGC Global Communications Limited (Herbalife)
    {
      id: "c-hgc-bali",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Bali",
      region: "Bali",
      sid: "2077490417",
    },
    {
      id: "c-hgc-malang",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Malang",
      region: "Malang",
      sid: "2077556573",
    },
    {
      id: "c-hgc-banjar",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Banjar Baru",
      region: "Banjarbaru",
      sid: "2085588493",
    },
    {
      id: "c-hgc-pontianak",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Pontianak",
      region: "Pontianak",
      sid: "2085961343",
    },
    {
      id: "c-hgc-yogya",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Yogyakarta",
      region: "Yogyakarta",
      sid: "2085985329",
    },
    {
      id: "c-hgc-solo",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Solo",
      region: "Solo",
      sid: "208686977",
    },
    {
      id: "c-hgc-pekanbaru",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Pekanbaru",
      region: "Pekanbaru",
      sid: "2087016746",
    },
    {
      id: "c-hgc-bekasi",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Bekasi",
      region: "Bekasi",
      sid: "2087136596",
    },
    {
      id: "c-hgc-makassar",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Makassar",
      region: "Makassar",
      sid: "2089367738",
    },
    {
      id: "c-hgc-bandung",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Bandung",
      region: "Bandung",
      sid: "2089569766",
    },
    {
      id: "c-hgc-surabaya",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Surabaya",
      region: "Surabaya",
      sid: "2089575065",
    },
    {
      id: "c-hgc-tang-bsd",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Tangerang BSD",
      region: "Tangerang",
      sid: "AD25691BH0501 / NVZ5691",
    },
    {
      id: "c-hgc-medan",
      company: "PT. HGC Global Communications Limited",
      branch: "Herbalife Medan",
      region: "Medan",
      sid: "2091327977",
    },

    // PT. Mitra Internasional Indonesia
    {
      id: "c-mii-pakuwon",
      company: "PT. Mitra Internasional Indonesia",
      branch: "IT Store Pakuwon Mall Surabaya",
      region: "Surabaya",
    },
    {
      id: "c-mii-tunjungan4",
      company: "PT. Mitra Internasional Indonesia",
      branch: "IT Store Tunjungan Plaza 4",
      region: "Surabaya",
    },
  )
}
export const db = g.__MEMDB__ as {
  users: User[]
  customers: Customer[]
  tickets: Ticket[]
  seq: number
}

export function genTicketNo() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${`${d.getMonth() + 1}`.padStart(2, "0")}${`${d.getDate()}`.padStart(2, "0")}`
  db.seq += 1
  const seq = `${db.seq}`.padStart(6, "0")
  return `MIS-${ymd}-Notiket(${seq})`
}
