# TarihApp — Akıllı KPSS Tarih Asistanı

TarihApp, KPSS ve benzeri sınavlara hazırlanan öğrenciler için geliştirilmiş bir soru bankası ve ilerleme takip uygulamasıdır. İlerleme Firebase Authentication + Cloud Firestore üzerinde saklanır; arayüz Vite + Tailwind CSS ile derlenir.

Canlı sürüm: [https://aktasgoksel.github.io/Tarih/](https://aktasgoksel.github.io/Tarih/)

---

## İçindekiler

1. [Özellikler](#özellikler)
2. [Kullanıcı rehberi](#kullanıcı-rehberi)
3. [Yönetici (admin) rehberi](#yönetici-admin-rehberi)
4. [Yerel kurulum](#yerel-kurulum)
5. [Ortam değişkenleri](#ortam-değişkenleri)
6. [Güvenlik ve Firestore kuralları](#güvenlik-ve-firestore-kuralları)
7. [Testler](#testler)
8. [Proje yapısı](#proje-yapısı)

---

## Özellikler

### Kimlik doğrulama ve oturum
- E-posta / şifre ile kayıt ve giriş
- **Google ile oturum açma** (`signInWithPopup`, hesap seçim ekranı zorunlu)
- **Şifre sıfırlama** (e-posta bağlantısı)
- Şifre görünürlüğünü aç/kapa
- Enter tuşu ile form gönderimi
- **Oturum kalıcılığı:** giriş sonrası oturum `browserSessionPersistence` ile yalnızca tarayıcı oturumu (sekme) boyunca tutulur; tarayıcı kapanınca oturum sonlanır
- **Firestore IndexedDB persistence:** çevrimdışı/önbellek için Firestore verisi cihazda tutulur (aynı anda birden fazla sekmede kısıtlıdır)
- E-posta doğrulama akışı kodda hazırdır (`verify-screen`); şu an giriş sonrası doğrulama zorunluluğu kapalıdır (geliştirme / E2E akışını kırmamak için)

### Yetkilendirme
- **Kullanıcı:** kendi `users/{uid}` belgesini okur/yazar; testleri okur; öneri oluşturur
- **Admin:** belirli e-posta adresi (`ADMIN_EMAILS` ve `firestore.rules`) ile yönetim paneli, soru yazma, öneri okuma/silme
- Admin butonu yalnızca yetkili hesapta görünür; panel açılsa bile yetkisiz Firestore yazmaları kurallarla reddedilir

### Test çözme ve CRUD
- Firestore `tests` koleksiyonundan test listesi okuma
- Test seçimi, önceki / sonraki soru, optik form ile soru atlama
- Cevap işaretleme, “Cevabı Kontrol Et”, anında çözüm gösterimi (anahtar)
- Test bitirme, boş soru uyarısı, sonuç banner’ı, testi sıfırlama
- **Gerçek KPSS denemesi:** havuzdan rastgele 27 soru; **yeni sorular üret** (zar) butonu
- **Favoriler:** yıldız ile ekle/çıkar, favori testi
- **Yanlışlar:** otomatik kayıt, özel test, tüm yanlışları silme
- İlerleme (`testProgress`), favoriler ve yanlışlar Firestore’a yazılır

### İstatistik ve profil
- Konu bazlı donut grafik (Chart.js) ve başarı çubukları
- Profil modalı: çözülen / doğru / yanlış özeti
- Kullanıcı adı güncelleme (`updateProfile`)
- E-posta güncelleme (`updateEmail`, yakın zamanda giriş gerekebilir)
- **Hesabı kalıcı silme** (Firestore kullanıcı belgesi + Auth kullanıcısı, KVKK)

### Yönetici paneli
- Yeni soru ekleme (mevcut teste ekler veya yeni test oluşturur)
- Gelen önerileri listeleme ve silme

### Arayüz ve PWA
- Karanlık / aydınlık tema (localStorage)
- Mobil hamburger menü, 44px dokunma alanları, yatay taşma koruması
- Progressive Web App (`manifest.json`, `sw.js`)
- Özel modal’lar (uyarı, başarı, hata), yasal metinler (Kullanım Koşulları, Gizlilik)
- Öneri / hata bildirimi (`suggestions` koleksiyonu)

---

## Kullanıcı rehberi

### 1. Kayıt ve giriş
1. Ana ekranda **Kayıt Ol** ile kullanıcı adı, e-posta ve en az 6 karakterli şifre girin; veya **Google ile Devam Et**.
2. Mevcut hesap için e-posta ve şifre ile **Giriş Yap**.
3. Şifreyi unuttuysanız **Şifremi Unuttum?** → e-posta → gelen kutudaki bağlantı.
4. Tarayıcıyı kapatınca oturum biter; aynı sekmede yenileme oturumu korur (session persistence).

### 2. Test çözmek
1. **Test Seçin** menüsünden bir konu seçin.
2. Şıkkı işaretleyin. **Anında Çözüm Göster** açıksa (rastgele deneme hariç) çözüm hemen gelir; kapalıysa **Cevabı Kontrol Et** veya test bitiminde görürsünüz.
3. **Önceki / Sonraki** veya optik form ile gezinin.
4. Son soruda **Testi Bitir**. Boş soru varsa onay istenir.
5. **Süreyi Başlat** (masaüstü başlıkta, mobilde alt barda) ile süre işler; dolunca test otomatik biter.

### 3. Favoriler ve yanlışlar
- Soru kartındaki yıldız ile favorilere ekleyin; **Favoriler** ile bu havuzu çözün.
- Yanlış cevaplar otomatik kaydedilir; **Yanlışlar** ile özel test açın. Çöp kutusu tüm yanlış kayıtlarını siler.

### 4. Rastgele KPSS denemesi
- Menüden **Gerçek KPSS Denemesi (Rastgele 27 Soru)** seçin.
- Yanındaki yenile (zar) ikonu yeni 27’li set üretir.

### 5. İstatistikler ve profil
- **İstatistikler:** konu dağılımı ve başarı yüzdeleri. Hiç test bitirmedıyseniz boş durum gösterilir.
- Profil (hoş geldin satırı): e-posta / kullanıcı adı güncelleme, hesap silme.

### 6. Öneri ve yasal metinler
- **Öneri** (mobilde hamburger menüde) ile geri bildirim gönderin.
- Footer: Kullanım Koşulları, Gizlilik Politikası, İletişim.

---

## Yönetici (admin) rehberi

1. Yetkili e-posta ile giriş yapın. Başlıkta **Yönetim** görünür (mobilde hamburger menü).
2. **Yönetim** → **Soru Yönetim Paneli**.
3. Test başlığı yazın (aynı başlık varsa soru o teste eklenir; yoksa yeni `tests/{id}` belgesi oluşur).
4. Soru metni, A–E şıkları, doğru cevap ve isteğe bağlı çözüm → **Soruyu Veritabanına Kaydet**.
5. **Gelen Öneriler ve Hatalar** listesinden kayıtları okuyun veya silin.
6. **Ana Ekrana Dön** ile öğrenci arayüzüne çıkın.

Yetkisiz kullanıcılar paneli JS ile açsa bile `firestore.rules` okuma/yazmayı engeller.

---

## Yerel kurulum

Gereksinimler: Node.js 18+ ve npm.

```bash
git clone https://github.com/aktasgoksel/Tarih.git
cd Tarih
npm install
npm run dev
```

Geliştirme sunucusu Vite ile `index_dev.html` üzerinden açılır (varsayılan `http://localhost:5173/index_dev.html`).

Diğer komutlar:

```bash
npm run build      # dist/ üretim derlemesi (tek dosya HTML)
npm run preview    # derlemeyi önizle
npm run test:e2e   # Playwright duman testi (Vite’i kendisi başlatır)
```

İlk E2E çalıştırmadan önce:

```bash
npx playwright install chromium
```

---

## Ortam değişkenleri

API anahtarı **değerlerini** repoya veya sohbete yazmayın. İsimler:

| Değişken | Açıklama |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web API anahtarı |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Proje kimliği |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender id |
| `VITE_FIREBASE_APP_ID` | Uygulama id |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics measurement id (isteğe bağlı) |

Kopya şablon: `.env.example`. Tanımsız bırakılırsa `src/firebase.js` içindeki yerleşik istemci yapılandırması kullanılır. Firebase web anahtarları gizli servis anahtarı değildir; asıl koruma Firestore Rules’dadır.

---

## Güvenlik ve Firestore kuralları

Kurallar `firestore.rules` dosyasındadır (özet):

- `users/{userId}`: yalnızca kendi `uid`
- `tests/{testId}`: giriş yapan okur; yalnızca admin yazar
- `suggestions/{id}`: oluştururken `uid` / `email` token ile eşleşmeli, metin &lt; 5000 karakter; okuma/silme yalnızca admin

Ayrıntılı denetim: `SECURITY_AUDIT.md`.

---

## Testler

Playwright duman testi (`tests/smoke.spec.js`): kayıt, soru işaretleme, istatistik modalı, öneri, hesap silme. Detay: `TESTING.md`.

```bash
npm run test:e2e
```

---

## Proje yapısı

```
index_dev.html     Geliştirme girişi
src/main.js        Modül yükleyici, servis çalışanı
src/firebase.js    Firebase başlatma, persistence
src/core/auth.js   Giriş, kayıt, Google, oturum
src/features/      Testler, timer, optik, favoriler, admin
src/ui/            Tema, modal, loader
firestore.rules    Güvenlik kuralları
```
