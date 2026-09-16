export interface ReviewItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  variant: string;
  content: string;
  helpfulCount: number;
  hasMedia?: boolean;
  sellerReply?: string;
}

export interface ShopeeProductData {
  rating: string;
  ratingNum: number;
  reviews: string;
  reviewsCountNum: number;
  sold: string;
  bpomNumber: string;
  satisfactionRate: string;
  fiveStarPercent: number;
  fourStarPercent: number;
  threeStarPercent: number;
  twoStarPercent: number;
  oneStarPercent: number;
  fiveStarCount: string;
  fourStarCount: string;
  mediaCount: string;
  reviewsList: ReviewItem[];
}

export const SHOPEE_PRODUCTS_DATA: Record<string, ShopeeProductData> = {
  // 1. Bright Glow Body Lotion UV Filter 750ml
  'bright-glow-body-lotion-uv-filter-750ml': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '3.8rb',
    reviewsCountNum: 3820,
    sold: '10rb+',
    bpomNumber: 'BPOM NA18240109992',
    satisfactionRate: '99%',
    fiveStarPercent: 95,
    fourStarPercent: 4,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '3.6rb',
    fourStarCount: '168',
    mediaCount: '1.4rb',
    reviewsList: [
      {
        id: 'rev-lotion-1',
        name: 's*****a (Sarah A.)',
        avatar: 'SA',
        rating: 5,
        date: '2 hari lalu',
        variant: '750ml UV Filter',
        content:
          'Losionnya beneran wangi banget dan teksturnya langsung meresap tanpa rasa lengket sama sekali. Dipakai panas-panasan naik motor tangan gak gampang belang karena ada UV Filternya. Ukuran botol 750ml jumbo banget, awet buat 2-3 bulan pemakaian harian. Wajib repeat order!',
        helpfulCount: 184,
        hasMedia: true,
        sellerReply:
          'Halo Kak Sarah, terima kasih banyak atas kepercayaannya! Gunakan rutin setiap pagi sebelum beraktivitas agar proteksi UV Filter dan kelembapan kulit terjaga optimal ya Kak ✨',
      },
      {
        id: 'rev-lotion-2',
        name: 'dinda_pertiwi',
        avatar: 'DP',
        rating: 5,
        date: '5 hari lalu',
        variant: '750ml UV Filter',
        content:
          'Udah botol kedua. Kulit aku tipe yang gampang kering bersisik di ruangan ber-AC kantor. Semenjak rutin pakai ini, kulit seharian tetep lembap kenyal. Pas dicampur sama booster powder hasilnya makin keliatan cerah natural dalam 2 minggu.',
        helpfulCount: 92,
        hasMedia: true,
      },
      {
        id: 'rev-lotion-3',
        name: 'n*****a (Natasha)',
        avatar: 'NT',
        rating: 5,
        date: '1 minggu lalu',
        variant: '750ml UV Filter',
        content:
          'Aroma vanila mewahnya tahan seharian, gak bikin pusing. Gak ninggalin whitecast abu-abu sama sekali di kulit sawo matang. Pengiriman dari Surabaya ke Jakarta cepet banget cuma 2 hari dan packing bubble wrap berlapis.',
        helpfulCount: 64,
        hasMedia: false,
      },
      {
        id: 'rev-lotion-4',
        name: 'rzk_septiani',
        avatar: 'RS',
        rating: 4,
        date: '2 minggu lalu',
        variant: '750ml UV Filter',
        content:
          'Bagus banget buat melembapkan dan wanginya fresh elegan. Botolnya emang jumbo banget jadi kalo bepergian lebih baik dipindahin ke botol pump travel. Untuk stok di rumah bener-bener hemat dan puas.',
        helpfulCount: 38,
        hasMedia: false,
        sellerReply:
          'Terima kasih masukannya Kak Rizka! Untuk bepergian bisa menggunakan botol travel ya Kak, botol 750ml memang kami hadirkan untuk nilai ekonomis perawatan harian di rumah.',
      },
    ],
  },
  'bright-glow-body-lotion-uv-filter-750ml-classic': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '3.8rb',
    reviewsCountNum: 3820,
    sold: '10rb+',
    bpomNumber: 'BPOM NA18240109992',
    satisfactionRate: '99%',
    fiveStarPercent: 95,
    fourStarPercent: 4,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '3.6rb',
    fourStarCount: '168',
    mediaCount: '1.4rb',
    reviewsList: [],
  },
  'body-lotion-uv-750ml': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '3.8rb',
    reviewsCountNum: 3820,
    sold: '10rb+',
    bpomNumber: 'BPOM NA18240109992',
    satisfactionRate: '99%',
    fiveStarPercent: 95,
    fourStarPercent: 4,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '3.6rb',
    fourStarCount: '168',
    mediaCount: '1.4rb',
    reviewsList: [],
  },

  // 2. Brightening Booster Gold Powder 25gr
  'brightening-booster-gold-powder-25gr': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '4.2rb',
    reviewsCountNum: 4250,
    sold: '10rb+',
    bpomNumber: 'BPOM NA18240200017',
    satisfactionRate: '99%',
    fiveStarPercent: 96,
    fourStarPercent: 3,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '4.1rb',
    fourStarCount: '124',
    mediaCount: '1.8rb',
    reviewsList: [
      {
        id: 'rev-powder-1',
        name: 'anisa.kurnia',
        avatar: 'AK',
        rating: 5,
        date: '3 hari lalu',
        variant: 'Gold Powder 25gr',
        content:
          'Kecil-kecil cabe rawit! Serbuk halusnya gampang banget larut pas dicampur losion, gak menggumpal sama sekali. Ada kilau emas halus yang bikin kulit keliatan glowing sehat seketika. Belang di tangan dan kaki udah pudar banget dalam 10 hari.',
        helpfulCount: 215,
        hasMedia: true,
        sellerReply:
          'Terima kasih Kak Anisa! Sinergi konsentrat Niacinamide dan Alpha Arbutin murni pada Booster Powder memang diformulasikan larut instan ke dalam losion untuk booster pencerah ekstra ✨',
      },
      {
        id: 'rev-powder-2',
        name: 'm*****i (Mega I.)',
        avatar: 'MI',
        rating: 5,
        date: '1 minggu lalu',
        variant: 'Gold Powder 25gr',
        content:
          'Udah repeat order botol ke-4 saking sukanya. Aku campur ke body cream pas malam hari, bangun tidur kulit rasanya halus banget dan cerah bercahaya. Ada izin BPOM resmi jadi tenang pakenya jangka panjang.',
        helpfulCount: 120,
        hasMedia: true,
      },
      {
        id: 'rev-powder-3',
        name: 'clarissa_w',
        avatar: 'CW',
        rating: 5,
        date: '2 minggu lalu',
        variant: 'Gold Powder 25gr',
        content:
          'Bagus pol serbuknya. Cukup seujung sendok takar aja udah bisa merata buat sepasang tangan dan kaki. Hemat pemakaiannya dan cepet meresap bareng losion.',
        helpfulCount: 47,
        hasMedia: false,
      },
      {
        id: 'rev-powder-4',
        name: 'fifi_safitri',
        avatar: 'FS',
        rating: 4,
        date: '3 minggu lalu',
        variant: 'Gold Powder 25gr',
        content:
          'Hasilnya bagus bikin kulit glowing sehat. Jangan dipakai langsung ke kulit ya, wajib dicampur losion atau cream dulu biar gampang diratakan. Recomended buat yang mau upgrade rutinitas bodycare.',
        helpfulCount: 31,
        hasMedia: false,
      },
    ],
  },
  'brightening-booster-gold-powder-25gr-classic': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '4.2rb',
    reviewsCountNum: 4250,
    sold: '10rb+',
    bpomNumber: 'BPOM NA18240200017',
    satisfactionRate: '99%',
    fiveStarPercent: 96,
    fourStarPercent: 3,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '4.1rb',
    fourStarCount: '124',
    mediaCount: '1.8rb',
    reviewsList: [],
  },
  'booster-gold-powder': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '4.2rb',
    reviewsCountNum: 4250,
    sold: '10rb+',
    bpomNumber: 'BPOM NA18240200017',
    satisfactionRate: '99%',
    fiveStarPercent: 96,
    fourStarPercent: 3,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '4.1rb',
    fourStarCount: '124',
    mediaCount: '1.8rb',
    reviewsList: [],
  },

  // 3. Kefir Collagen Soap 60gr
  'kefir-collagen-soap-60gr': {
    rating: '4.8',
    ratingNum: 4.8,
    reviews: '5.1rb',
    reviewsCountNum: 5140,
    sold: '10rb+',
    bpomNumber: 'BPOM NA18211200972',
    satisfactionRate: '98%',
    fiveStarPercent: 92,
    fourStarPercent: 6,
    threeStarPercent: 2,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '4.7rb',
    fourStarCount: '310',
    mediaCount: '2.1rb',
    reviewsList: [
      {
        id: 'rev-soap-1',
        name: 'putri_ayundaa',
        avatar: 'PA',
        rating: 5,
        date: '4 hari lalu',
        variant: 'Soap Bar 60gr',
        content:
          'Sabun mandi favorit! Busanya padat melimpah dan lembut banget. Biasanya sabun pencerah bikin kulit kesat ketarik, tapi yang ini malah bikin kulit lembap dan halus. Daki-daki dan sel kulit mati di leher serta siku langsung rontok bersih.',
        helpfulCount: 168,
        hasMedia: true,
        sellerReply:
          'Terima kasih Kak Putri! Enzim fermentasi kefir alami di sabun ini memang membersihkan pori secara lembut tanpa mengikis kelembapan alami skin barrier.',
      },
      {
        id: 'rev-soap-2',
        name: 'b*****a (Bella)',
        avatar: 'BL',
        rating: 5,
        date: '1 minggu lalu',
        variant: 'Soap Bar 60gr',
        content:
          'Aroma susunya seger banget dan wanginya nempel lama. Udah pemakaian rutin 10 hari bareng losionnya, bekas luka gigitan nyamuk mulai tersamarkan. Packing super rapi kardus dan bubble wrap tebal.',
        helpfulCount: 85,
        hasMedia: false,
      },
      {
        id: 'rev-soap-3',
        name: 'fitri.rahayu',
        avatar: 'FR',
        rating: 4,
        date: '2 minggu lalu',
        variant: 'Soap Bar 60gr',
        content:
          'Sabunnya efektif banget bersihin kotoran. Biar awet aku potong jadi 4 bagian kecil dan simpen di tempat kering. Kulit berasa jauh lebih bersih dan cerah dari minggu pertama.',
        helpfulCount: 73,
        hasMedia: true,
        sellerReply:
          'Trik yang sangat cerdas Kak Fitri! Memotong sabun menjadi beberapa bagian menjaga sabun tetap higienis dan lebih awet digunakan.',
      },
    ],
  },

  // 4. Brightening Body Cream Grape (100g / 200g)
  'brightening-body-cream-grape': {
    rating: '4.8',
    ratingNum: 4.8,
    reviews: '1.6rb',
    reviewsCountNum: 1620,
    sold: '5rb+',
    bpomNumber: 'BPOM NA18230100799',
    satisfactionRate: '98%',
    fiveStarPercent: 91,
    fourStarPercent: 7,
    threeStarPercent: 2,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '1.4rb',
    fourStarCount: '112',
    mediaCount: '620',
    reviewsList: [
      {
        id: 'rev-cream-1',
        name: 'vani_anggraini',
        avatar: 'VA',
        rating: 5,
        date: '3 hari lalu',
        variant: 'Ukuran 200gr Grape',
        content:
          'Wanginya manis anggur segar banget kayak permen mewah! Teksturnya rich tapi begitu diusap langsung melt meresap. Area siku dan lutut aku yang awalnya kasar dan gelap sekarang berasa kenyal dan cerah.',
        helpfulCount: 134,
        hasMedia: true,
        sellerReply:
          'Terima kasih banyak Kak Vani! Kandungan Niacinamide dan Glutathione dalam Body Cream Grape menutrisi area lipatan kulit yang membutuhkan kelembapan ekstra.',
      },
      {
        id: 'rev-cream-2',
        name: 'm*****a (Melisa)',
        avatar: 'MS',
        rating: 5,
        date: '1 minggu lalu',
        variant: 'Ukuran 100gr Travel',
        content:
          'Beli yang 100gr praktis buat dibawa di tas kerja. Kalo di kantor tangan kering kena AC tinggal oles. Melembapkan maksimal tanpa rasa licin pas ngetik di laptop.',
        helpfulCount: 58,
        hasMedia: false,
      },
    ],
  },
  'brightening-body-cream-grape-100g': {
    rating: '4.8',
    ratingNum: 4.8,
    reviews: '1.6rb',
    reviewsCountNum: 1620,
    sold: '5rb+',
    bpomNumber: 'BPOM NA18230100799',
    satisfactionRate: '98%',
    fiveStarPercent: 91,
    fourStarPercent: 7,
    threeStarPercent: 2,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '1.4rb',
    fourStarCount: '112',
    mediaCount: '620',
    reviewsList: [],
  },
  'brightening-body-cream-grape-200g': {
    rating: '4.8',
    ratingNum: 4.8,
    reviews: '1.6rb',
    reviewsCountNum: 1620,
    sold: '5rb+',
    bpomNumber: 'BPOM NA18230100799',
    satisfactionRate: '98%',
    fiveStarPercent: 91,
    fourStarPercent: 7,
    threeStarPercent: 2,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '1.4rb',
    fourStarCount: '112',
    mediaCount: '620',
    reviewsList: [],
  },

  // 5. The Glowing Set (3-in-1 Complete Ritual)
  'the-glowing-set': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '840',
    reviewsCountNum: 842,
    sold: '2rb+',
    bpomNumber: 'BPOM Resmi 3 Formula',
    satisfactionRate: '99%',
    fiveStarPercent: 96,
    fourStarPercent: 3,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '810',
    fourStarCount: '28',
    mediaCount: '410',
    reviewsList: [
      {
        id: 'rev-set-1',
        name: 'jessica.tan',
        avatar: 'JT',
        rating: 5,
        date: '2 hari lalu',
        variant: 'The Glowing Set (3-in-1)',
        content:
          'Beli paket ini jauh lebih hemat dapet sabun kefir, losion 750ml, sama booster gold powder. Rutin pake 3 langkah ini pagi dan malam selama 14 hari perubahannya nyata banget! Kulit belang bekas liburan pantai langsung balik cerah merata.',
        helpfulCount: 276,
        hasMedia: true,
        sellerReply:
          'Terima kasih banyak Kak Jessica! Sinergi 3 langkah: Cleanse, Boost, dan Protect memang ritual terbaik kami untuk hasil cerah merata dan skin barrier sehat.',
      },
      {
        id: 'rev-set-2',
        name: 'dewi_kartika',
        avatar: 'DK',
        rating: 5,
        date: '1 minggu lalu',
        variant: 'The Glowing Set (3-in-1)',
        content:
          'Kombinasi sabun dan losionnya juara. Ditambah bubuk boosternya bikin kulit glowing instan pas dipake acara kondangan. Pengiriman kilat dan respon admin ramah.',
        helpfulCount: 94,
        hasMedia: true,
      },
    ],
  },
  'glowing-set-3-in-1': {
    rating: '4.9',
    ratingNum: 4.9,
    reviews: '840',
    reviewsCountNum: 842,
    sold: '2rb+',
    bpomNumber: 'BPOM Resmi 3 Formula',
    satisfactionRate: '99%',
    fiveStarPercent: 96,
    fourStarPercent: 3,
    threeStarPercent: 1,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '810',
    fourStarCount: '28',
    mediaCount: '410',
    reviewsList: [],
  },

  // 6. Complete Brightening Set (5-in-1)
  'complete-brightening-set': {
    rating: '5.0',
    ratingNum: 5.0,
    reviews: '310',
    reviewsCountNum: 312,
    sold: '850+',
    bpomNumber: 'BPOM Resmi 5 Formula',
    satisfactionRate: '100%',
    fiveStarPercent: 98,
    fourStarPercent: 2,
    threeStarPercent: 0,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '305',
    fourStarCount: '7',
    mediaCount: '190',
    reviewsList: [
      {
        id: 'rev-comp-1',
        name: 'nadia_safira',
        avatar: 'NS',
        rating: 5,
        date: '4 hari lalu',
        variant: 'Complete Set (5-in-1)',
        content:
          'Paket paling worth it untuk perawatan total dari ujung kepala sampai kaki. Semua produk wangi dan lembut di kulit. Dapat diskon bundle yang lumayan banget dibanding beli satuan.',
        helpfulCount: 88,
        hasMedia: true,
        sellerReply:
          'Terima kasih Kak Nadia! Paket komplit ini dirancang khusus untuk perawatan tubuh menyeluruh dari mandi hingga proteksi UV.',
      },
    ],
  },

  // 7. Bright Glow Body Wash 250ml
  'bright-glow-body-wash-250ml': {
    rating: '4.8',
    ratingNum: 4.8,
    reviews: '670',
    reviewsCountNum: 672,
    sold: '2.4rb+',
    bpomNumber: 'BPOM NA18250701893',
    satisfactionRate: '98%',
    fiveStarPercent: 92,
    fourStarPercent: 6,
    threeStarPercent: 2,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '618',
    fourStarCount: '42',
    mediaCount: '280',
    reviewsList: [
      {
        id: 'rev-wash-1',
        name: 'aulia_rahma',
        avatar: 'AR',
        rating: 5,
        date: '5 hari lalu',
        variant: 'Body Wash 250ml',
        content:
          'Sabun cair yang busanya melimpah tapi gak bikin kulit kering sama sekali. Wanginya seger mewah dan bikin badan rileks abis seharian kerja di luar.',
        helpfulCount: 65,
        hasMedia: true,
      },
    ],
  },

  // 8. English Pear Body Toner 100ml
  'english-pear-body-toner-100ml': {
    rating: '4.8',
    ratingNum: 4.8,
    reviews: '510',
    reviewsCountNum: 514,
    sold: '1.8rb+',
    bpomNumber: 'BPOM Resmi RI',
    satisfactionRate: '97%',
    fiveStarPercent: 91,
    fourStarPercent: 7,
    threeStarPercent: 2,
    twoStarPercent: 0,
    oneStarPercent: 0,
    fiveStarCount: '468',
    fourStarCount: '38',
    mediaCount: '220',
    reviewsList: [
      {
        id: 'rev-toner-1',
        name: 'kiki_amelia',
        avatar: 'KA',
        rating: 5,
        date: '1 minggu lalu',
        variant: 'Body Toner 100ml',
        content:
          'Toner badan dengan aroma English Pear & Freesia yang beneran mirip parfum mahal! Dipakai sehabis mandi kulit langsung kerasa segar dan siap nerima losion.',
        helpfulCount: 52,
        hasMedia: true,
      },
    ],
  },
};

export const DEFAULT_SHOPEE_DATA: ShopeeProductData = {
  rating: '4.9',
  ratingNum: 4.9,
  reviews: '250',
  reviewsCountNum: 250,
  sold: '1rb+',
  bpomNumber: 'BPOM Resmi RI',
  satisfactionRate: '99%',
  fiveStarPercent: 95,
  fourStarPercent: 4,
  threeStarPercent: 1,
  twoStarPercent: 0,
  oneStarPercent: 0,
  fiveStarCount: '238',
  fourStarCount: '10',
  mediaCount: '95',
  reviewsList: [
    {
      id: 'rev-def-1',
      name: 'beauty_enthusiast_id',
      avatar: 'BE',
      rating: 5,
      date: '3 hari lalu',
      variant: 'Original Formula',
      content:
        'Produk Beautyinu selalu konsisten dari segi formula dan wangi. Cepat meresap, tidak dempul, dan terbukti aman berizin BPOM.',
      helpfulCount: 45,
      hasMedia: true,
    },
  ],
};

export function getShopeeProductData(handle?: string): ShopeeProductData {
  if (!handle) return DEFAULT_SHOPEE_DATA;

  // Handle aliases
  if (handle === 'body-lotion-uv-750ml' || handle === 'bright-glow-body-lotion-uv-filter-750ml-classic') {
    return SHOPEE_PRODUCTS_DATA['bright-glow-body-lotion-uv-filter-750ml'];
  }
  if (handle === 'booster-gold-powder' || handle === 'brightening-booster-gold-powder-25gr-classic') {
    return SHOPEE_PRODUCTS_DATA['brightening-booster-gold-powder-25gr'];
  }
  if (handle === 'glowing-set-3-in-1') {
    return SHOPEE_PRODUCTS_DATA['the-glowing-set'];
  }
  if (handle === 'brightening-body-cream-grape-100g' || handle === 'brightening-body-cream-grape-200g') {
    return SHOPEE_PRODUCTS_DATA['brightening-body-cream-grape'];
  }

  return SHOPEE_PRODUCTS_DATA[handle] || DEFAULT_SHOPEE_DATA;
}
