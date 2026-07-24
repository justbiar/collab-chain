export type Locale = "tr" | "en";

const dict = {
  tr: {
    siteName: "WEB3 CHAIN CARD",
    siteTagline: "Zincire katıl, kartını oluştur, X'te paylaş.",

    home: {
      totalCards: (n: number) => `${n} Kişi Zincirde`,
      startChain: "Zinciri Başlat",
      subtitleWithChain:
        "Birinin seni etiketlediği davet linkiyle zincire katıl, ya da kendi zincirini başlat.",
      subtitleEmpty: "Zincirin ilk halkası sen ol. Kartını oluştur ve daveti başlat.",
      cta: "Zincir Başlat",
      rulesTitle: "KURALLAR",
      ruleOneInvite: "Her kart zincirde sadece bir sonraki kişiyi davet edebilir.",
      ruleExpiry: (h: number) => `Davet edilen kişinin kabul etmesi için ${h} saati vardır.`,
      ruleRenew: "Süre dolarsa davet sahibi farklı birini etiketleyip daveti yenileyebilir.",
      emptyState: "Henüz kimse zincire katılmadı. İlk kartı sen oluştur!",
    },

    chainNode: {
      next: "SIRADAKİ",
      pending: "PENDING",
      expired: "SÜRESİ DOLDU",
    },

    card: {
      brand: "WEB3 CARD",
      digitalCollectible: "DIGITAL COLLECTIBLE",
      playerId: "PLAYER ID",
      active: "ACTIVE",
      skills: "SKILLS:",
      unnamed: "İsimsiz Oyuncu",
      defaultRole: "Web3 Builder",
    },

    chainShare: {
      watermark: "WEB3 CHAIN",
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
      targetUsername: "Zincirdeki Sıradaki Kişi (Hedef @username)",
      targetPlaceholder: "@davetettigin_kisi",
      lockedNote: (u: string) => `Bu davet sadece @${u} hesabı için geçerli.`,
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
      genesisLockedTitle: (admin: string) =>
        `Şu anda sadece @${admin} yeni bir zincir başlatabilir.`,
      genesisLockedBody: (admin: string) =>
        `Zincire katılmak istiyorsan @${admin} ile iletişime geç.`,
      contactCta: "İletişime Geç",
      adminSignInHint: (admin: string) => `@${admin} sen misin?`,
    },

    invite: {
      heading: "Zincire davetlisin!",
      body: (first: string, last: string, handle: string) =>
        `${first} ${last} (@${handle}) seni Web3 Chain'e davet etti. Kabul et, kendi kartını oluştur ve zinciri devam ettir.`,
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
      shareOnX: "X'te Paylaş",
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
      backHome: "← Ana Sayfaya Dön",
    },

    tweetIntent: {
      joined: (handle: string) =>
        `Ben Web3 zincirine katıldım! Sıra sende @${handle}, kendi kartını oluştur ve zinciri devam ettir! 🔗`,
      joinedNoTarget: "Ben Web3 zincirine katıldım! Kendi kartını oluştur ve zinciri devam ettir! 🔗",
    },
  },

  en: {
    siteName: "WEB3 CHAIN CARD",
    siteTagline: "Join the chain, create your card, share it on X.",

    home: {
      totalCards: (n: number) => `${n} People in the Chain`,
      startChain: "Start the Chain",
      subtitleWithChain:
        "Join the chain with an invite link someone tagged you with, or start your own chain.",
      subtitleEmpty: "Be the first link in the chain. Create your card and start the invite.",
      cta: "Start Chain",
      rulesTitle: "RULES",
      ruleOneInvite: "Each card can only invite one next person into the chain.",
      ruleExpiry: (h: number) => `The invited person has ${h} hours to accept.`,
      ruleRenew: "If time runs out, the inviter can tag someone else and renew the invite.",
      emptyState: "No one has joined the chain yet. Create the first card!",
    },

    chainNode: {
      next: "NEXT UP",
      pending: "PENDING",
      expired: "EXPIRED",
    },

    card: {
      brand: "WEB3 CARD",
      digitalCollectible: "DIGITAL COLLECTIBLE",
      playerId: "PLAYER ID",
      active: "ACTIVE",
      skills: "SKILLS:",
      unnamed: "Unnamed Player",
      defaultRole: "Web3 Builder",
    },

    chainShare: {
      watermark: "WEB3 CHAIN",
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
      targetUsername: "Next Person in the Chain (Target @username)",
      targetPlaceholder: "@person_youre_inviting",
      lockedNote: (u: string) => `This invite is only valid for @${u}.`,
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
      genesisLockedTitle: (admin: string) =>
        `Right now, only @${admin} can start a new chain.`,
      genesisLockedBody: (admin: string) =>
        `If you'd like to join the chain, get in touch with @${admin}.`,
      contactCta: "Get in Touch",
      adminSignInHint: (admin: string) => `Are you @${admin}?`,
    },

    invite: {
      heading: "You're invited to the chain!",
      body: (first: string, last: string, handle: string) =>
        `${first} ${last} (@${handle}) invited you to Web3 Chain. Accept, create your own card, and keep the chain going.`,
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
      shareOnX: "Share on X",
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
      backHome: "← Back to Home",
    },

    tweetIntent: {
      joined: (handle: string) =>
        `I just joined the Web3 chain! You're up @${handle} — create your own card and keep it going! 🔗`,
      joinedNoTarget: "I just joined the Web3 chain! Create your own card and keep it going! 🔗",
    },
  },
} as const;

export function t(locale: Locale) {
  return dict[locale];
}

export type Dict = ReturnType<typeof t>;
