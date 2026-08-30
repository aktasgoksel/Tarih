# TarihApp Güvenlik Denetim Raporu (Security Audit)

Bu rapor, projenin güvenlik analizi (Penetration Test) bakış açısıyla taranması sonucu elde edilen bulguları, risk seviyelerini, somut istismar senaryolarını ve uygulanan/önerilen düzeltmeleri içermektedir.

---

## 1. Tespit Edilen Bulgular ve Düzeltmeler

### Bulgular Tablosu
| No | Açık / Risk Tanımı | Risk Seviyesi | Etkilenen Alan | Durum |
|----|-------------------|---------------|----------------|-------|
| 1  | Önerilerde Kullanıcı Kimliği Taklit Etme (Spoofing) | **Yüksek** | `suggestions` Koleksiyonu / `firestore.rules` | **DÜZELTİLDİ** |
| 2  | Öneri Gönderiminde Payload Sınırı Olmaması (DDoS/Maliyet) | **Orta** | `suggestions` Koleksiyonu / `firestore.rules` | **DÜZELTİLDİ** |
| 3  | İstatistik Modalı Konu İsimlerinde XSS (Cross-Site Scripting) | **Düşük** | İstatistik Ekranı / `tests.js` | **DÜZELTİLDİ** |
| 4  | Kullanıcı Profiline Doğrudan İstemci Tarafından Yazma | **Düşük** | `users` Koleksiyonu / `firestore.rules` | *Bilgilendirme* |

---

### BULGU 1: Önerilerde Kullanıcı Kimliği Taklit Etme (Spoofing) [YÜKSEK]
- **Açıklama:** Firestore güvenlik kurallarında `suggestions` koleksiyonuna yazma (`create`) izni sadece giriş yapmış olmayı (`request.auth != null`) şart koşuyordu. Ancak, oluşturulan dökümandaki `displayName`, `email` ve `uid` alanlarının, giriş yapan kullanıcının gerçek kimlik bilgileriyle uyuşup uyuşmadığı kontrol edilmiyordu.
- **İstismar Senaryosu:** Kötü niyetli bir kullanıcı giriş yaptıktan sonra tarayıcı konsolunu açıp Firebase SDK kullanarak öneriler tablosuna döküman yazabilir. Yazdığı dökümana `displayName: "Göksel Aktaş"` ve `email: "gokselaktas84@gmail.com"` (yani yönetici/admin bilgilerini) yazarak yöneticiyi taklit edebilir. Yönetici admin panelini açtığında, kendisinden gelmiş gibi görünen yanıltıcı/zararlı veya kimlik avı (phishing) içeren mesajlar görerek sosyal mühendislik saldırısına maruz kalabilirdi.
- **Düzeltme:** 
  1. `src/features/tests.js` modülünde öneri gönderilirken gönderici e-postası (`email`) açıkça eklendi.
  2. `firestore.rules` güncellenerek, yazılacak olan `uid` ve `email` alanlarının, istek atan kullanıcının şifreli authentication token bilgileriyle eşleşmesi zorunlu kılındı:
     `request.resource.data.uid == request.auth.uid && request.resource.data.email == request.auth.token.email`
- **Durum:** Düzeltildi. (Commit: `23acf04`)

---

### BULGU 2: Öneri Gönderiminde Payload Sınırı Olmaması (DDoS / Maliyet) [ORTA]
- **Açıklama:** `suggestions` koleksiyonunda döküman oluşturma işleminde veri tipi ve boyut sınırlandırması bulunmuyordu. Bu durum, Firestore sınırları dahilinde (doküman başına 1MB) çok büyük verilerin yazılmasına izin veriyordu.
- **İstismar Senaryosu:** Bir saldırgan otomatik bir script hazırlayarak, her biri 1MB boyutunda anlamsız metinler içeren binlerce öneri dökümanı oluşturabilir. Bu işlem Firestore depolama alanını hızla şişirir, yazma/okuma kotalarını doldurur ve Firebase üzerinde beklenmeyen yüksek maliyetlere (DDoS) yol açar.
- **Önerilen Düzeltme:** `firestore.rules` dosyasındaki kurala veri tipi ve karakter sınırı eklenmesi:
  `&& request.resource.data.text is string && request.resource.data.text.size() < 5000`
- **Durum:** Düzeltildi. (Commit: `4f9be3e`)

---

### BULGU 3: İstatistik Modalı Konu İsimlerinde XSS [DÜŞÜK]
- **Açıklama:** `tests.js` içerisinde kullanıcı istatistikleri render edilirken konu başlıkları (`${l}`) doğrudan `innerHTML` yardımıyla sayfaya basılmaktadır. Bu veri normalde sadece yöneticinin yazabildiği `/tests` koleksiyonundaki test başlıklarından ayrıştırılmaktadır.
- **İstismar Senaryosu:** Yönetici hesabı ele geçirilirse veya yönetici paneline bypass ile soru enjekte edilirse, test başlığına `<img src=x onerror=alert(document.cookie)>` gibi bir payload yazılabilir. Bu testi çözen kullanıcıların profilinde başarı oranları modalı açıldığında bu zararlı script otomatik olarak çalışır (Stored XSS).
- **Önerilen Düzeltme:** `tests.js` line 633'teki `${l}` alanı `${window.escapeHTML(l)}` olarak güncellenmelidir.
- **Durum:** Düzeltildi. (Commit: `ca7af1b`)

---

### BULGU 4: Kullanıcı Profiline Doğrudan İstemci Tarafından Yazma [DÜŞÜK]
- **Açıklama:** Kullanıcıların kendi profillerini (`/users/{userId}`) yönetebilmesi için `allow write: if request.auth.uid == userId;` kuralı mevcuttur. Bu kural, kullanıcının kendi dokümanındaki `testProgress`, `mistakes` veya `favorites` dizilerine dilediği veriyi yazmasına izin verir.
- **İstismar Senaryosu:** Bir kullanıcı konsoldan kendi verilerini manipüle ederek çözmediği testleri çözmüş gibi gösterip skorunu 100 yapabilir.
- **Risk Değerlendirmesi:** Bu proje sunucusuz (serverless) bir yapıda çalıştığı için istemcinin kendi verisine yazması doğaldır. Uygulamada global bir liderlik tablosu (leaderboard) veya ödül mekanizması bulunmadığından, kullanıcının kendi istatistiğini manipüle etmesi yalnızca kendini aldatması anlamına gelir; diğer kullanıcılara veya sisteme zarar veremez. Eğer gelecekte rekabetçi özellikler eklenirse, bu veriler Cloud Functions veya kurallardaki sıkı şema doğrulayıcılarıyla korunmalıdır.
- **Durum:** Bilgilendirme (İşlem Gerekmiyor).

---

## 2. Diğer Güvenlik İncelemeleri

- **API Anahtarları (API Keys):** `firebase.js` ve `migrate.js` içerisindeki API anahtarları tarayıcıda görünür durumdadır. Firebase mimarisi gereği bu anahtarlar gizli servis anahtarları değil, istemcinin Firebase servisleriyle haberleşmesini sağlayan tanımlayıcılardır ve açık olması bir güvenlik açığı değildir. Güvenlik tamamen Firestore Rules tarafından sağlanmaktadır.
- **Service Worker Önbellekleme:** `sw.js` sadece statik asset'leri (HTML, JS, CSS, CDN kütüphaneleri) önbelleğe almaktadır. Firebase Auth oturumları veya Firestore verileri sw.js tarafından cache'lenmediği için paylaşımlı cihazlarda veri sızıntısı riski yoktur.
- **Admin Panel Yetkilendirmesi:** Yönetici paneli girişi JS tarafında `ADMIN_EMAILS` ile kontrol edilmektedir. Bu kontrol bypass edilse bile (örneğin konsoldan kod tetiklenerek ekran açılsa bile), veritabanından veri çekme aşamasında Firestore Kuralları çalışacak ve yetkisiz kullanıcının isteğini engelleyecektir (`Missing or insufficient permissions`). Bu nedenle arka uç yetkilendirmesi tam ve güvenlidir.
