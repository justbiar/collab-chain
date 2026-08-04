export type Locale = "tr" | "en";

const dict = {
  tr: {
    siteName: "COLLAB CHAIN",
    siteTagline: "Zincire katıl, kartını oluştur, X'te paylaş.",

    home: {
      totalCards: (n: number) => `${n} Kişi Zincirde`,
      startChain: "Zinciri Başlat",
      subtitleWithChain:
        "Birinin seni etiketlediği davet linkiyle zincire katıl, ya da kendi zincirini başlat.",
      subtitleEmpty: "Zincirin ilk halkası sen ol. Kartını oluştur ve daveti başlat.",
      cta: "Zincir Başlat",
      rulesTitle: "KURALLAR",
      ruleOneInviteTitle: "TEK DAVET",
      ruleOneInvite: "Her kart zincirde sadece bir sonraki kişiyi davet edebilir.",
      ruleExpiryTitle: "SÜRE SINIRI",
      ruleExpiry: (h: number) => `Davet edilen kişinin kabul etmesi için ${h} saati vardır.`,
      ruleRenewTitle: "ELENME",
      ruleRenew:
        "Süresini kaçıran zincirden elenir, sıra bir öncekine düşer ve elenen bir daha katılamaz.",
      emptyState: "Henüz kimse zincire katılmadı. İlk kartı sen oluştur!",
      collectionsTitle: "KOLEKSİYONLAR",
    },

    chainPage: {
      eyebrow: "KOLEKSİYON",
      membersCount: (n: number) => (n === 1 ? "1 üye" : `${n} üye`),
      backHome: "← Ana Sayfaya Dön",
      notFound: "Bu koleksiyon bulunamadı.",
    },

    joinRequest: {
      sendButton: "Katılma İsteği Gönder",
      sentNote: "İsteğin gönderildi — sıradaki kişi seni seçerse etiketlenirsin.",
      withdrawButton: "İsteği Geri Çek",
      confirmWithdraw: "İsteğini geri çekmek istiyor musun?",
      working: "...",
      errorAlreadyMember: "Zaten bu koleksiyondasın.",
      errorBanned: "Bu hesap kuralı çiğnediği için yasaklı.",
      errorNotStarted: "Bu koleksiyon henüz başlamadı.",
      errorClosed: "Bu koleksiyon artık yeni istek kabul etmiyor.",
      errorGeneric: "Bir hata oluştu.",
      errorConnection: "Bağlantı hatası, tekrar dene.",
      errorRateLimited: "Çok fazla istek gönderdin, biraz sonra tekrar dene.",
    },

    collection: {
      filterAll: "TÜMÜ",
      filterUpcoming: "YAKLAŞAN",
      filterOngoing: "DEVAM EDEN",
      filterPast: "GEÇMİŞ",
      emptyFiltered: "Bu filtrede koleksiyon yok.",

      statusCompleted: "TAMAMLANDI",
      statusCancelled: "İPTAL EDİLDİ",
      statusFrozen: "DONDU",
      statusUpcoming: "YAKLAŞAN",
      statusOngoing: "DEVAM EDİYOR",

      startsAt: (d: string) => `${d} tarihinde başlıyor`,
      deadlineLeft: (h: number) =>
        h >= 48 ? `${Math.floor(h / 24)} gün kaldı` : `${h} saat kaldı`,
      slotsLeft: (n: number, limit: number) => `${limit} kişilik · ${n} yer kaldı`,
      manualNote: "Yönetici bitirene kadar açık",

      // Oluşturma formu
      settingsTitle: "KOLEKSİYON AYARLARI",
      nameField: "Koleksiyon adı",
      namePlaceholder: "Web3 Builders, AI & LLM, Blokzincir...",
      nameHint: "Koleksiyon senin adınla değil, bu isimle anılır.",
      descriptionField: "Açıklama (opsiyonel)",
      descriptionPlaceholder: "Bu koleksiyon kimleri bir araya getiriyor?",
      coverField: "Kapak görseli (opsiyonel)",
      coverHint: "Ana sayfada koleksiyon kartının arkasında görünür.",
      byFounder: (handle: string) => `@${handle} başlattı`,
      nameRequired: "Koleksiyona bir isim vermelisin.",
      modeLabel: "Bu koleksiyon nasıl bitsin?",
      modeManual: "Ben bitirene kadar açık kalsın",
      modeManualHint: "İstediğin an tamamlayıp yayımlarsın.",
      modeDeadline: "Belirli bir tarihte kapansın",
      modeDeadlineHint: "O tarih gelince otomatik tamamlanır ve yayımlanır.",
      modeLimit: "Belirli kişi sayısında dursun",
      modeLimitHint: "Kontenjan dolunca otomatik tamamlanır.",
      deadlineField: "Bitiş tarihi",
      limitField: "Kişi sayısı",
      startField: "Başlangıç tarihi (opsiyonel)",
      startHint: "Boş bırakırsan hemen başlar. İleri bir tarih verirsen o zamana kadar 'yaklaşan' olarak listelenir.",
      imageInvalid: "Sadece PNG, JPEG, WEBP ya da GIF ve en fazla 900KB.",

      // Yönetici paneli
      adminTitle: "YÖNETİCİ",
      adminNote: "Bu koleksiyonu sen başlattın.",
      superAdminNote: "Süper admin olarak bu koleksiyonu yönetiyorsun.",
      actionComplete: "Tamamla ve Yayımla",
      actionCancel: "İptal Et",
      actionDelete: "Kalıcı Olarak Sil",
      actionRemove: "Çıkar",
      removeTitle: "Zincirden çıkar",
      removeHint:
        "Seçtiğin kişi ve altındaki herkes zincirden düşer. Yasaklanmazlar, başka koleksiyona katılabilirler.",
      confirmComplete: "Koleksiyon tamamlanacak ve kimse katılamayacak. Emin misin?",
      confirmCancel: "Koleksiyon iptal edilecek. Emin misin?",
      confirmDelete:
        "Bu koleksiyon ve içindeki TÜM kartlar kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misin?",
      confirmRemove: (h: string) => `@${h} ve altındaki herkes zincirden çıkarılacak. Emin misin?`,
      working: "...",
      errorGeneric: "İşlem başarısız oldu.",
      errorRateLimited: "Çok fazla istek gönderdin, biraz sonra tekrar dene.",
    },

    nav: {
      signIn: "X ile Giriş",
      signOut: "Çıkış",
      myProfile: "Profilim",
    },

    admin: {
      title: "SÜPER ADMIN",
      subtitle: "Bu panel sadece senin X hesabına görünür.",
      grantSectionTitle: "GENESİS YETKİSİ",
      grantSectionHint:
        "Yetki verdiğin X hesapları davetsiz yeni bir koleksiyon başlatabilir. Bir hesabı listeden kaldırmak için üzerine tıkla.",
      grantAction: "Yetki Ver",
      usernameRequired: "Bir X kullanıcı adı gir.",
      confirmRevoke: (u: string) => `@${u} hesabından genesis yetkisi alınacak. Emin misin?`,
      collectionsSectionTitle: "TÜM KOLEKSİYONLAR",
      working: "...",
      errorGeneric: "İşlem başarısız oldu.",
      errorConnection: "Bağlantı hatası, tekrar dene.",
      errorRateLimited: "Çok fazla istek gönderdin, biraz sonra tekrar dene.",
    },

    rulesPage: {
      nav: "KURALLAR",
      eyebrow: "NASIL İŞLER",
      title: "Zincirin Kuralları",
      intro:
        "Her koleksiyon tek bir kişiyle başlar ve sadece etiketleme yoluyla büyür. Zinciri ayakta tutan tek şey herkesin sırasında hareket etmesi.",

      steps: [
        {
          n: "01",
          title: "Zincir tek yönlü büyür",
          body: "Her kart zincirde sadece bir sonraki kişiyi etiketleyebilir. Dallanma yok — koleksiyon düz bir çizgi hâlinde ilerler.",
        },
        {
          n: "02",
          title: "Kabul için 24 saat",
          body: "Etiketlenen kişinin daveti kabul edip kartını oluşturmak için 24 saati vardır. Kabul etmezse davet düşer ve etiketleyen kişi başka birini çağırabilir.",
        },
        {
          n: "03",
          title: "Etiketlemek için 24 saat",
          body: "Zincire katıldıktan sonra bir sonraki kişiyi etiketlemek için 24 saatin var. Bu senin sıran — kaçırırsan sıra bir önceki kişiye düşer.",
        },
        {
          n: "04",
          title: "Kaçıran elenir, bir daha giremez",
          body: "Sıra geriye düştükten sonra yerine yeni biri katıldığı anda, kaçıran kişi zincirden çıkarılır ve X hesabı kalıcı olarak yasaklanır. Başka bir koleksiyona da katılamaz.",
        },
      ],

      clockAccept: "KABUL ETMEK İÇİN",
      clockTag: "ETİKETLEMEK İÇİN",

      exampleTitle: "ÖRNEK",
      exampleLead: "5 kişilik bir zincirde 5. kişi süresini kaçırırsa ne olur:",
      example: [
        {
          label: "Başlangıç",
          body: "Zincir 5 kişi: 1 → 2 → 3 → 4 → 5. Sıra 5. kişide, birini etiketlemesi için 24 saati var.",
        },
        {
          label: "5. kişi kaçırdı",
          body: "24 saat doldu, kimseyi etiketlemedi. Sıra 4. kişiye geri döner ve 4. kişiye taze 24 saat verilir.",
        },
        {
          label: "4. kişi yeni birini bulursa",
          body: "4. kişi yeni birini etiketler ve o kişi kabul ederse: 5. kişi zincirden elenir, kalıcı olarak yasaklanır. Zincir 1 → 2 → 3 → 4 → yeni olarak devam eder.",
        },
        {
          label: "4. kişi de kaçırırsa",
          body: "Sıra bu kez 3. kişiye düşer. 3. kişi yeni bir 4. çağırır ve o kabul ederse hem eski 4. hem de 5. birlikte elenir.",
        },
        {
          label: "En başa kadar",
          body: "Kaçırılmaya devam ederse sıra 2'ye, sonra kurucuya kadar düşer. Kurucu da kaçırırsa koleksiyon donar ve bir daha büyüyemez.",
        },
      ],

      tweetTitle: "KARTINA TWEET EKLE",
      tweetBody:
        "Zincire katıldığını X'te duyurduysan, o tweet'in linkini kendi kart sayfandan kartına ekleyebilirsin. Kartını gezen herkes tweet'i orada görür ve X'te açabilir.",

      exampleTweetTitle: "GERÇEK BİR ÖRNEK",
      exampleTweetLead: "Zincir X'te böyle başlıyor:",

      ctaBack: "← Ana Sayfaya Dön",
    },

    profilePage: {
      eyebrow: "OYUNCU PROFİLİ",
      statChains: "KATILDIĞI ZİNCİR",
      statFounded: "BAŞLATTIĞI ZİNCİR",
      statLongest: "EN UZUN ZİNCİR",
      statCards: "TOPLAM KART",
      chainsTitle: "ZİNCİRLERİ",
      positionLabel: (pos: number, total: number) => `${total} kişilik zincirde ${pos}. sırada`,
      eliminatedLabel: "Süresini kaçırdığı için bu zincirden elendi",
      founderBadge: "KURUCU",
      bannedNotice: "Bu hesap kuralı çiğnediği için kalıcı olarak yasaklı — yeni bir zincire katılamaz.",
      viewCard: "Kartı Gör",
      viewChain: "Koleksiyonu Gör",
      backHome: "← Ana Sayfaya Dön",
    },

    chainNode: {
      next: "SIRADAKİ",
      pending: "PENDING",
      expired: "SÜRESİ DOLDU",
      burned: "ELENDİ",
      turnBadge: "SIRA SENDE",
    },

    countdown: {
      hours: "SAAT",
      minutes: "DAKİKA",
      seconds: "SANİYE",
      turnTitle: "SIRANIN BİTMESİNE",
      collectionTitle: "KOLEKSİYONUN KAPANMASINA",
      startsInTitle: "BAŞLAMASINA",
      expired: "SÜRE DOLDU",
    },

    turn: {
      holder: (handle: string) => `Sıra @${handle} kişisinde`,
      remaining: (h: number) => (h <= 1 ? "1 saatten az kaldı" : `${h} saat kaldı`),
      lapsedNotice: (n: number) =>
        n === 1
          ? "1 kişi süresini kaçırdı — yerine yeni biri katılınca zincirden elenecek."
          : `${n} kişi süresini kaçırdı — yerlerine yeni biri katılınca zincirden elenecekler.`,
      deadTitle: "BU KOLEKSİYON DONDU",
      deadBody:
        "Sıra kurucuya kadar düştü ve süre doldu. Bu koleksiyon artık büyüyemez.",
      rules: (inviteH: number, turnH: number) =>
        `Etiketlenen kişinin kabul etmek için ${inviteH} saati, katıldıktan sonra birini etiketlemek için ${turnH} saati var. Kaçıran zincirden elenir ve bir daha katılamaz.`,
    },

    card: {
      brand: "COLLAB CHAIN",
      digitalCollectible: "DIGITAL COLLECTIBLE",
      playerId: "PLAYER ID",
      active: "ACTIVE",
      skills: "SKILLS:",
      unnamed: "İsimsiz Oyuncu",
      defaultRole: "Web3 Builder",
      aboutLabel: "HAKKINDA",
    },

    chainShare: {
      watermark: "COLLAB CHAIN",
      next: "SIRADAKİ",
      pending: "PENDING",
    },

    form: {
      title: "KART BİLGİLERİN",
      firstName: "İsim",
      lastName: "Soyisim",
      xUsername: "X (Twitter) Kullanıcı Adı",
      role: "Rol / Unvan",
      rolePlaceholder: "Founder, CTO, Smart Contract Dev...",
      skills: "Yetenekler (virgülle ayır)",
      skillsPlaceholder: "Solidity, Rust, DeFi, Tokenomics",
      profileImage: "Profil Fotoğrafı",
      logoImage: "Topluluk / Şirket Logosu",
      bio: "Kısaca kendinden bahset",
      bioPlaceholder: "FHE ve gizlilik teknolojileriyle ilgileniyorum",
      bioHint: "Bu metin paylaşacağın tweet'e otomatik olarak eklenir.",
      targetUsername: "Zincirdeki Sıradaki Kişi (Hedef @username)",
      targetPlaceholder: "@davetettigin_kisi",
      targetReason: "İnsanlar onu neden takip etsin?",
      targetReasonPlaceholder: "Web3 üzerine çok iyi içerik üretiyor",
      targetReasonHint: "Bu da tweet'e eklenir — etiketlediğin kişiyi tanıtır.",
      lockedNote: (u: string, platform: "x" | "farcaster" = "x") =>
        platform === "farcaster"
          ? `Farcaster ile giriş yaptığın hesaptan otomatik alındı: @${u}`
          : `X ile giriş yaptığın hesaptan otomatik alındı: @${u}`,
      imageInvalid: "Sadece PNG, JPEG, WEBP ya da GIF ve en fazla 900KB.",
      joinRequestsTitle: "KATILMA İSTEKLERİ",
      joinRequestsHint:
        "Birini etiketlemek yerine bu koleksiyona katılmak isteyenlerden birini seçebilirsin. İsme tıklarsan X profili açılır.",
      selectAction: "Seç",
    },

    create: {
      titleAccept: "ZİNCİRE KATIL",
      titleNew: "KARTINI OLUŞTUR",
      invitedBy: (first: string, last: string, handle: string) =>
        `🎉 ${first} ${last} (@${handle}) seni zincire davet etti!`,
      instructions: "Bilgilerini doldur, kartını oluştur ve zinciri devam ettir.",
      expiryNote: (h: number) => `Etiketlediğin kişinin daveti kabul etmesi için ${h} saati olacak.`,
      tabCard: "KOLEKSIYON KARTI",
      tabChain: "ZİNCİR PAYLAŞIMI",
      saving: "Kaydediliyor...",
      saveAccept: "Kabul Et ve Kartımı Oluştur",
      saveNew: "Kartımı Oluştur ve Zincire Katıl",
      backHome: "Ana sayfaya dön",
      requiredFields: "İsim ve X kullanıcı adı zorunludur.",
      errorAlreadyAccepted: "Bu davet başkası tarafından kabul edilmiş.",
      errorUsernameMismatch: "Bu davet sadece davet edilen X hesabıyla kabul edilebilir.",
      errorExpired: "Bu davetin süresi doldu.",
      errorNotAuthenticated: "Oturumun sona ermiş, sayfayı yenileyip tekrar X ile giriş yap.",
      errorBanned:
        "Bu hesap kuralı çiğnediği için zincirden elendi ve bir daha katılamaz.",
      errorNotYourTurn: "Sıra artık sende değil — süre dolduğu için zincirde geriye düştü.",
      errorChainDead: "Bu koleksiyon kapandı, artık yeni kimse katılamaz.",
      errorNotStarted: "Bu koleksiyon henüz başlamadı.",
      errorNotAdmin: "Yeni koleksiyon açma yetkin yok.",
      bannedTitle: "Bu hesap elendi",
      bannedBody:
        "Süresi içinde kimseyi etiketlemediğin için zincirden çıkarıldın. Bu kural gereği tekrar katılamazsın.",
      errorGeneric: "Bir hata oluştu.",
      errorConnection: "Bağlantı hatası, tekrar dene.",
      invalidLink: "Geçersiz davet linki.",
      inviteNotFound: "Davet bulunamadı.",
      inviteAlreadyAcceptedByOther: "Bu davet zaten başkası tarafından kabul edilmiş.",
      inviteExpiredRenewNeeded: "Bu davetin süresi doldu. Davet sahibinin daveti yenilemesi gerekiyor.",
      authRequiredTitle: (handle: string) =>
        `@${handle}, bu daveti kabul etmek için X ile giriş yapmalısın.`,
      authRequiredBody: (first: string, last: string) =>
        `${first} ${last} seni bu X hesabı için davet etti — devam etmeden önce kimliğini doğrulaman gerekiyor.`,
      signInWithX: "X ile Giriş Yap",
      notYoursTitle: "Bu davet sana ait değil",
      notYoursBody: (target: string, actual: string) =>
        `Bu davet @${target} için oluşturulmuş, ama sen @${actual} olarak giriş yaptın.`,
      unknownUser: "bilinmeyen",
      signOutRetry: "Çıkış Yap ve Farklı Hesapla Dene",
      startAuthRequiredTitle: "Yeni bir zincir başlatmak için giriş yapmalısın.",
      startAuthRequiredBody: "X ya da Farcaster hesabınla giriş yap, hemen kendi koleksiyonunu başlat.",
      errorRateLimited: "Çok fazla istek gönderdin, biraz sonra tekrar dene.",
    },

    invite: {
      heading: "Zincire davetlisin!",
      body: (first: string, last: string, handle: string) =>
        `${first} ${last} (@${handle}) seni Collab Chain'e davet etti. Kabul et, kendi kartını oluştur ve zinciri devam ettir.`,
      acceptCta: "Kabul Et ve Kartımı Oluştur",
      backHome: "← Ana Sayfaya Dön",
      noTarget: "Bu kart kimseyi davet etmemiş.",
      backHomePlain: "Ana sayfaya dön",
      alreadyAccepted: "Bu davet zaten kabul edildi 🎉",
      viewCard: (handle: string) => `@${handle} kartını gör`,
      expiredTitle: "Bu davetin süresi doldu ⌛",
      expiredBody: (first: string, last: string, handle: string) =>
        `${first} ${last}, davetini ${handle ? `@${handle}` : "bu kişi"} kabul etmediği için yenilemesi gerekiyor.`,
    },

    profile: {
      pngDownload: "PNG İndir",
      downloading: "İndiriliyor...",
      downloadError: "Görsel oluşturulamadı, tekrar dene.",
      shareOnX: "X'te Paylaş",
      shareOnFarcaster: "Farcaster'da Paylaş",
      accepted: (handle: string) => `✅ @${handle} zincire katıldı!`,
      expired: (handle: string) => `⌛ @${handle} daveti süresi doldu`,
      pending: (handle: string, hours: number | null) =>
        `⏳ @${handle} bekleniyor${hours != null ? ` · ${hours} saat kaldı` : ""}`,
      copyInviteLink: "Davet Linkini Kopyala",
      copied: "Kopyalandı!",
      renewHint: "Farklı birini etiketleyip daveti yenileyebilirsin.",
      renewPlaceholder: "@yeni_kullanici",
      renewButton: "Yenile",
      renewing: "...",
      renewErrorTarget: "Yeni bir X kullanıcı adı gir.",
      renewErrorGeneric: "Bir hata oluştu.",
      renewErrorConnection: "Bağlantı hatası, tekrar dene.",
      renewErrorRateLimited: "Çok fazla istek gönderdin, biraz sonra tekrar dene.",
      backHome: "← Ana Sayfaya Dön",
    },

    tweet: {
      title: "DUYURU TWEET'İ",
      empty: "Bu karta henüz bir tweet eklenmemiş.",
      ownerHint: "Zincire katıldığını duyurduğun tweet'in linkini yapıştır.",
      placeholder: "https://x.com/kullanici/status/123...",
      save: "Ekle",
      saving: "...",
      change: "Değiştir",
      remove: "Kaldır",
      cancel: "Vazgeç",
      view: "Tweet'i X'te Aç",
      errorInvalid: "Geçerli bir X gönderi linki değil.",
      errorGeneric: "Tweet kaydedilemedi.",
      errorConnection: "Bağlantı hatası, tekrar dene.",
      errorRateLimited: "Çok fazla istek gönderdin, biraz sonra tekrar dene.",
      metricsNote:
        "Beğeni ve retweet sayıları X'in kendi gömülü görünümünde canlı olarak görünür.",
    },

    tweetIntent: {
      startingLead: (name: string) => `${name} projesini başlatıyorum.`,
      joinedLead: (name: string) => `${name} projesine katıldım.`,
      passingTo: (handle: string) => `Bu arada @${handle} hesabına göz atın.`,
      passingToWithReason: (handle: string, reason: string) =>
        `Bu arada @${handle} hesabına göz atın — ${reason}`,
    },

    cast: {
      title: "DUYURU CAST'İ",
      empty: "Bu karta henüz bir cast eklenmemiş.",
      ownerHint: "Zincire katıldığını duyurduğun cast'in linkini yapıştır.",
      placeholder: "https://warpcast.com/kullanici/0x...",
      save: "Ekle",
      saving: "...",
      change: "Değiştir",
      remove: "Kaldır",
      cancel: "Vazgeç",
      view: "Cast'i Warpcast'te Aç",
      errorInvalid: "Geçerli bir Warpcast gönderi linki değil.",
      errorGeneric: "Cast kaydedilemedi.",
      errorConnection: "Bağlantı hatası, tekrar dene.",
      errorRateLimited: "Çok fazla istek gönderdin, biraz sonra tekrar dene.",
    },
  },

  en: {
    siteName: "COLLAB CHAIN",
    siteTagline: "Join the chain, create your card, share it on X.",

    home: {
      totalCards: (n: number) => `${n} People in the Chain`,
      startChain: "Start the Chain",
      subtitleWithChain:
        "Join the chain with an invite link someone tagged you with, or start your own chain.",
      subtitleEmpty: "Be the first link in the chain. Create your card and start the invite.",
      cta: "Start Chain",
      rulesTitle: "RULES",
      ruleOneInviteTitle: "ONE INVITE",
      ruleOneInvite: "Each card can only invite one next person into the chain.",
      ruleExpiryTitle: "TIME LIMIT",
      ruleExpiry: (h: number) => `The invited person has ${h} hours to accept.`,
      ruleRenewTitle: "ELIMINATION",
      ruleRenew:
        "Miss your window and you're cut from the chain — the turn falls back one step and you can never rejoin.",
      emptyState: "No one has joined the chain yet. Create the first card!",
      collectionsTitle: "COLLECTIONS",
    },

    chainPage: {
      eyebrow: "COLLECTION",
      membersCount: (n: number) => (n === 1 ? "1 member" : `${n} members`),
      backHome: "← Back to Home",
      notFound: "This collection couldn't be found.",
    },

    joinRequest: {
      sendButton: "Send Join Request",
      sentNote: "Your request was sent — you'll be tagged if the next person picks you.",
      withdrawButton: "Withdraw Request",
      confirmWithdraw: "Withdraw your join request?",
      working: "...",
      errorAlreadyMember: "You're already in this collection.",
      errorBanned: "This account is banned for breaking the rule.",
      errorNotStarted: "This collection hasn't started yet.",
      errorClosed: "This collection isn't accepting new requests anymore.",
      errorGeneric: "Something went wrong.",
      errorConnection: "Connection error, please try again.",
      errorRateLimited: "You're sending requests too fast — try again in a bit.",
    },

    collection: {
      filterAll: "ALL",
      filterUpcoming: "UPCOMING",
      filterOngoing: "ONGOING",
      filterPast: "PAST",
      emptyFiltered: "No collections in this filter.",

      statusCompleted: "COMPLETED",
      statusCancelled: "CANCELLED",
      statusFrozen: "FROZEN",
      statusUpcoming: "UPCOMING",
      statusOngoing: "ONGOING",

      startsAt: (d: string) => `Starts ${d}`,
      deadlineLeft: (h: number) =>
        h >= 48 ? `${Math.floor(h / 24)} days left` : `${h} hours left`,
      slotsLeft: (n: number, limit: number) => `${limit} seats · ${n} left`,
      manualNote: "Open until the admin closes it",

      settingsTitle: "COLLECTION SETTINGS",
      nameField: "Collection name",
      namePlaceholder: "Web3 Builders, AI & LLM, Blockchain...",
      nameHint: "The collection goes by this name, not yours.",
      descriptionField: "Description (optional)",
      descriptionPlaceholder: "Who does this collection bring together?",
      coverField: "Cover image (optional)",
      coverHint: "Shown behind the collection card on the home page.",
      byFounder: (handle: string) => `started by @${handle}`,
      nameRequired: "Give the collection a name.",
      modeLabel: "How should this collection end?",
      modeManual: "Stay open until I close it",
      modeManualHint: "You complete and publish it whenever you want.",
      modeDeadline: "Close on a specific date",
      modeDeadlineHint: "It completes and publishes automatically on that date.",
      modeLimit: "Stop at a number of people",
      modeLimitHint: "It completes automatically once the seats are full.",
      deadlineField: "End date",
      limitField: "Number of people",
      startField: "Start date (optional)",
      startHint:
        "Leave empty to start right away. Set a future date and it stays listed as 'upcoming' until then.",
      imageInvalid: "PNG, JPEG, WEBP or GIF only, up to 900KB.",

      adminTitle: "ADMIN",
      adminNote: "You started this collection.",
      superAdminNote: "You're managing this collection as the super admin.",
      actionComplete: "Complete & Publish",
      actionCancel: "Cancel",
      actionDelete: "Delete Permanently",
      actionRemove: "Remove",
      removeTitle: "Remove from chain",
      removeHint:
        "The person you pick and everyone below them drops out. They aren't banned — they can join another collection.",
      confirmComplete: "The collection will be completed and no one else can join. Are you sure?",
      confirmCancel: "The collection will be cancelled. Are you sure?",
      confirmDelete:
        "This collection and ALL cards inside it will be permanently deleted. This cannot be undone. Are you sure?",
      confirmRemove: (h: string) => `@${h} and everyone below them will be removed. Are you sure?`,
      working: "...",
      errorGeneric: "The action failed.",
      errorRateLimited: "You're sending requests too fast — try again in a bit.",
    },

    nav: {
      signIn: "Sign in with X",
      signOut: "Sign out",
      myProfile: "My Profile",
    },

    admin: {
      title: "SUPER ADMIN",
      subtitle: "This panel is only visible to your X account.",
      grantSectionTitle: "GENESIS PERMISSION",
      grantSectionHint:
        "X accounts you grant permission to can start a new collection without an invite. Click an account to remove it from the list.",
      grantAction: "Grant Permission",
      usernameRequired: "Enter an X username.",
      confirmRevoke: (u: string) => `Genesis permission will be revoked from @${u}. Are you sure?`,
      collectionsSectionTitle: "ALL COLLECTIONS",
      working: "...",
      errorGeneric: "The action failed.",
      errorConnection: "Connection error, please try again.",
      errorRateLimited: "You're sending requests too fast — try again in a bit.",
    },

    rulesPage: {
      nav: "RULES",
      eyebrow: "HOW IT WORKS",
      title: "Rules of the Chain",
      intro:
        "Every collection starts with one person and grows only by tagging. The one thing holding the chain up is everybody moving on their turn.",

      steps: [
        {
          n: "01",
          title: "The chain grows one way",
          body: "Each card can tag exactly one next person. No branching — a collection advances in a straight line.",
        },
        {
          n: "02",
          title: "24 hours to accept",
          body: "The tagged person has 24 hours to accept and create their card. If they don't, the invite lapses and the inviter can tag someone else.",
        },
        {
          n: "03",
          title: "24 hours to tag",
          body: "Once you've joined, you have 24 hours to tag the next person. That's your turn — miss it and the turn falls back to the person before you.",
        },
        {
          n: "04",
          title: "Miss it and you're out for good",
          body: "Once the turn has fallen back and someone new joins in your place, you're cut from the chain and your X account is permanently banned. You can't join another collection either.",
        },
      ],

      clockAccept: "TO ACCEPT",
      clockTag: "TO TAG SOMEONE",

      exampleTitle: "WORKED EXAMPLE",
      exampleLead: "What happens in a 5-person chain when the 5th person misses their window:",
      example: [
        {
          label: "Starting point",
          body: "The chain is 5 people: 1 → 2 → 3 → 4 → 5. It's the 5th person's turn, with 24 hours to tag someone.",
        },
        {
          label: "The 5th misses",
          body: "24 hours pass with nobody tagged. The turn falls back to the 4th person, who gets a fresh 24 hours.",
        },
        {
          label: "The 4th finds someone",
          body: "The 4th tags someone new and they accept: the 5th is cut from the chain and permanently banned. The chain continues 1 → 2 → 3 → 4 → new.",
        },
        {
          label: "The 4th misses too",
          body: "The turn falls back again, to the 3rd. The 3rd calls a new 4th, and when they accept, the old 4th and the old 5th are both eliminated together.",
        },
        {
          label: "All the way back",
          body: "If people keep missing, the turn falls to the 2nd and finally to the founder. If the founder misses too, the collection freezes and can never grow again.",
        },
      ],

      tweetTitle: "ATTACH YOUR TWEET",
      tweetBody:
        "If you announced joining the chain on X, you can attach that tweet's link to your card from your own card page. Anyone visiting your card sees the tweet there and can open it on X.",

      exampleTweetTitle: "A REAL EXAMPLE",
      exampleTweetLead: "This is what starting a chain on X looks like:",

      ctaBack: "← Back to Home",
    },

    profilePage: {
      eyebrow: "PLAYER PROFILE",
      statChains: "CHAINS JOINED",
      statFounded: "CHAINS FOUNDED",
      statLongest: "LONGEST CHAIN",
      statCards: "TOTAL CARDS",
      chainsTitle: "THEIR CHAINS",
      positionLabel: (pos: number, total: number) => `#${pos} of ${total} in the chain`,
      eliminatedLabel: "Cut from this chain for missing their window",
      founderBadge: "FOUNDER",
      bannedNotice: "This account is permanently banned for breaking the rule — it can't join a new chain.",
      viewCard: "View Card",
      viewChain: "View Collection",
      backHome: "← Back to Home",
    },

    chainNode: {
      next: "NEXT UP",
      pending: "PENDING",
      expired: "EXPIRED",
      burned: "ELIMINATED",
      turnBadge: "YOUR TURN",
    },

    countdown: {
      hours: "HOURS",
      minutes: "MINUTES",
      seconds: "SECONDS",
      turnTitle: "TURN ENDS IN",
      collectionTitle: "COLLECTION CLOSES IN",
      startsInTitle: "STARTS IN",
      expired: "TIME IS UP",
    },

    turn: {
      holder: (handle: string) => `It's @${handle}'s turn`,
      remaining: (h: number) => (h <= 1 ? "less than 1 hour left" : `${h} hours left`),
      lapsedNotice: (n: number) =>
        n === 1
          ? "1 person missed their window — they'll be cut from the chain once someone new joins in their place."
          : `${n} people missed their window — they'll be cut from the chain once someone new joins in their place.`,
      deadTitle: "THIS COLLECTION IS FROZEN",
      deadBody:
        "The turn fell all the way back to the founder and the clock ran out. This collection can no longer grow.",
      rules: (inviteH: number, turnH: number) =>
        `An invited person has ${inviteH} hours to accept, and ${turnH} hours after joining to tag someone. Miss it and you're cut from the chain for good.`,
    },

    card: {
      brand: "COLLAB CHAIN",
      digitalCollectible: "DIGITAL COLLECTIBLE",
      playerId: "PLAYER ID",
      active: "ACTIVE",
      skills: "SKILLS:",
      unnamed: "Unnamed Player",
      defaultRole: "Web3 Builder",
      aboutLabel: "ABOUT",
    },

    chainShare: {
      watermark: "COLLAB CHAIN",
      next: "NEXT UP",
      pending: "PENDING",
    },

    form: {
      title: "YOUR CARD DETAILS",
      firstName: "First Name",
      lastName: "Last Name",
      xUsername: "X (Twitter) Username",
      role: "Role / Title",
      rolePlaceholder: "Founder, CTO, Smart Contract Dev...",
      skills: "Skills (comma-separated)",
      skillsPlaceholder: "Solidity, Rust, DeFi, Tokenomics",
      profileImage: "Profile Photo",
      logoImage: "Community / Company Logo",
      bio: "Tell us about yourself, briefly",
      bioPlaceholder: "I'm into FHE and privacy tech",
      bioHint: "This gets added to your share tweet automatically.",
      targetUsername: "Next Person in the Chain (Target @username)",
      targetPlaceholder: "@person_youre_inviting",
      targetReason: "Why should people follow them?",
      targetReasonPlaceholder: "They put out great Web3 content",
      targetReasonHint: "This goes in the tweet too — it introduces who you tagged.",
      lockedNote: (u: string, platform: "x" | "farcaster" = "x") =>
        platform === "farcaster"
          ? `Auto-filled from the Farcaster account you signed in with: @${u}`
          : `Auto-filled from the X account you signed in with: @${u}`,
      imageInvalid: "PNG, JPEG, WEBP or GIF only, up to 900KB.",
      joinRequestsTitle: "JOIN REQUESTS",
      joinRequestsHint:
        "Instead of tagging someone, you can pick from people who requested to join this collection. Click a name to open their X profile.",
      selectAction: "Select",
    },

    create: {
      titleAccept: "JOIN THE CHAIN",
      titleNew: "CREATE YOUR CARD",
      invitedBy: (first: string, last: string, handle: string) =>
        `🎉 ${first} ${last} (@${handle}) invited you to the chain!`,
      instructions: "Fill in your details, create your card, and keep the chain going.",
      expiryNote: (h: number) => `The person you tag will have ${h} hours to accept.`,
      tabCard: "COLLECTIBLE CARD",
      tabChain: "CHAIN SHARE",
      saving: "Saving...",
      saveAccept: "Accept & Create My Card",
      saveNew: "Create My Card & Join the Chain",
      backHome: "Back to home",
      requiredFields: "Name and X username are required.",
      errorAlreadyAccepted: "This invite has already been accepted by someone else.",
      errorUsernameMismatch: "This invite can only be accepted by the invited X account.",
      errorExpired: "This invite has expired.",
      errorNotAuthenticated: "Your session expired — refresh the page and sign in with X again.",
      errorBanned: "This account was eliminated for breaking the rule and can never rejoin.",
      errorNotYourTurn: "It's no longer your turn — the clock ran out and the turn moved back up the chain.",
      errorChainDead: "This collection is closed. No one else can join.",
      errorNotStarted: "This collection hasn't started yet.",
      errorNotAdmin: "You're not allowed to start a new collection.",
      bannedTitle: "This account was eliminated",
      bannedBody:
        "You were cut from the chain for not tagging anyone in time. Under the rules you can't rejoin.",
      errorGeneric: "Something went wrong.",
      errorConnection: "Connection error, please try again.",
      invalidLink: "Invalid invite link.",
      inviteNotFound: "Invite not found.",
      inviteAlreadyAcceptedByOther: "This invite has already been accepted by someone else.",
      inviteExpiredRenewNeeded: "This invite has expired. The inviter needs to renew it.",
      authRequiredTitle: (handle: string) =>
        `@${handle}, you need to sign in with X to accept this invite.`,
      authRequiredBody: (first: string, last: string) =>
        `${first} ${last} invited this X account — you need to verify your identity before continuing.`,
      signInWithX: "Sign in with X",
      notYoursTitle: "This invite isn't yours",
      notYoursBody: (target: string, actual: string) =>
        `This invite was created for @${target}, but you signed in as @${actual}.`,
      unknownUser: "unknown",
      signOutRetry: "Sign Out and Try a Different Account",
      startAuthRequiredTitle: "You need to sign in to start a new chain.",
      startAuthRequiredBody: "Sign in with X or Farcaster and start your own collection right away.",
      errorRateLimited: "You're sending requests too fast — try again in a bit.",
    },

    invite: {
      heading: "You're invited to the chain!",
      body: (first: string, last: string, handle: string) =>
        `${first} ${last} (@${handle}) invited you to Collab Chain. Accept, create your own card, and keep the chain going.`,
      acceptCta: "Accept & Create My Card",
      backHome: "← Back to Home",
      noTarget: "This card hasn't invited anyone.",
      backHomePlain: "Back to home",
      alreadyAccepted: "This invite has already been accepted 🎉",
      viewCard: (handle: string) => `View @${handle}'s card`,
      expiredTitle: "This invite has expired ⌛",
      expiredBody: (first: string, last: string, handle: string) =>
        `${first} ${last} needs to renew the invite since ${handle ? `@${handle}` : "this person"} didn't accept it in time.`,
    },

    profile: {
      pngDownload: "Download PNG",
      downloading: "Downloading...",
      downloadError: "Couldn't create the image, try again.",
      shareOnX: "Share on X",
      shareOnFarcaster: "Share on Farcaster",
      accepted: (handle: string) => `✅ @${handle} joined the chain!`,
      expired: (handle: string) => `⌛ @${handle}'s invite has expired`,
      pending: (handle: string, hours: number | null) =>
        `⏳ Waiting on @${handle}${hours != null ? ` · ${hours}h left` : ""}`,
      copyInviteLink: "Copy Invite Link",
      copied: "Copied!",
      renewHint: "You can tag someone else and renew the invite.",
      renewPlaceholder: "@new_username",
      renewButton: "Renew",
      renewing: "...",
      renewErrorTarget: "Enter a new X username.",
      renewErrorGeneric: "Something went wrong.",
      renewErrorConnection: "Connection error, please try again.",
      renewErrorRateLimited: "You're sending requests too fast — try again in a bit.",
      backHome: "← Back to Home",
    },

    tweet: {
      title: "ANNOUNCEMENT TWEET",
      empty: "No tweet has been attached to this card yet.",
      ownerHint: "Paste the link to the tweet where you announced joining the chain.",
      placeholder: "https://x.com/username/status/123...",
      save: "Attach",
      saving: "...",
      change: "Change",
      remove: "Remove",
      cancel: "Cancel",
      view: "Open Tweet on X",
      errorInvalid: "That isn't a valid X post link.",
      errorGeneric: "Couldn't save the tweet.",
      errorConnection: "Connection error, please try again.",
      errorRateLimited: "You're sending requests too fast — try again in a bit.",
      metricsNote: "Likes and retweets show live inside X's own embedded view.",
    },

    tweetIntent: {
      startingLead: (name: string) => `Starting ${name}.`,
      joinedLead: (name: string) => `Just joined ${name}.`,
      passingTo: (handle: string) => `Also, check out @${handle}.`,
      passingToWithReason: (handle: string, reason: string) =>
        `Also, check out @${handle} — ${reason}`,
    },

    cast: {
      title: "ANNOUNCEMENT CAST",
      empty: "No cast has been attached to this card yet.",
      ownerHint: "Paste the link to the cast where you announced joining the chain.",
      placeholder: "https://warpcast.com/username/0x...",
      save: "Attach",
      saving: "...",
      change: "Change",
      remove: "Remove",
      cancel: "Cancel",
      view: "Open Cast on Warpcast",
      errorInvalid: "That isn't a valid Warpcast post link.",
      errorGeneric: "Couldn't save the cast.",
      errorConnection: "Connection error, please try again.",
      errorRateLimited: "You're sending requests too fast — try again in a bit.",
    },
  },
} as const;

export function t(locale: Locale) {
  return dict[locale];
}

export type Dict = ReturnType<typeof t>;
