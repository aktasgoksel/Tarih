# TarihApp Uçtan Uca (E2E) Test Rehberi

Bu proje, kritik kullanıcı akışlarını otomatik olarak test etmek ve regresyonları engellemek için **Playwright** E2E test çerçevesini kullanmaktadır.

---

## 1. Test Ortamı Hazırlığı

Testleri çalıştırmadan önce Playwright kütüphanesini ve tarayıcı binary'lerini yüklemeniz gerekmektedir (bu işlem ilk kurulumda bir kez yapılır):

```bash
# Bağımlılıkları yükleyin
npm install

# Playwright tarayıcı motorunu kurun
npx playwright install chromium
```

---

## 2. Testleri Çalıştırma

E2E testlerini çalıştırmak için tek bir komut yeterlidir. Bu komut, arka planda Vite geliştirme sunucusunu otomatik olarak başlatır, testleri çalıştırır ve sunucuyu kapatır:

```bash
npm run test:e2e
```

### Admin Paneli Testini Çalıştırma (Opsiyonel)
Yönetici paneli (Admin) akışını da test paketine dahil etmek istiyorsanız, terminalinizde `ADMIN_PASSWORD` çevre değişkenini tanımlayarak komutu çalıştırmalısınız:

**Windows PowerShell:**
```powershell
$env:ADMIN_PASSWORD="admin_sifreniz"
npm run test:e2e
```

**Linux / macOS:**
```bash
ADMIN_PASSWORD="admin_sifreniz" npm run test:e2e
```

*Not: Eğer `ADMIN_PASSWORD` çevre değişkeni tanımlı değilse, admin testi güvenlik amacıyla kendisini otomatik olarak atlar (skip) ve diğer genel akış testleri çalışmaya devam eder.*

---

## 3. Test Yapısı ve Veritabanı Temizliği

Testlerimiz **Sıfır Veri Kirliliği (Zero Database Pollution)** prensibine göre tasarlanmıştır:
1. Her test çalıştığında dinamik olarak rastgele bir test hesabı açılır (`test_user_TIMESTAMP@tarihapp.com`).
2. Test adımları bu hesap üzerinden çözme, öneri gönderme ve istatistik kontrollerini gerçekleştirir.
3. Testin en sonunda, profil ayarlarından **"Hesabımı Kalıcı Olarak Sil"** fonksiyonu tetiklenerek bu hesap Firebase Auth ve Firestore'dan tamamen kaldırılır.
4. Bu sayede canlı veritabanında gereksiz test hesapları birikmez.
