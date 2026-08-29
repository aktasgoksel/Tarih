# TarihApp - Eğitim ve Sınav Asistanı

TarihApp, KPSS ve benzeri sınavlara hazırlanan öğrenciler için geliştirilmiş, ilerleme takibi ve analiz yetenekleriyle donatılmış dijital bir eğitim platformudur. Bu doküman, uygulamanın sunduğu özellikleri ve temel kullanım prensiplerini içermektedir.

## Temel Özellikler

*   **Kişiselleştirilmiş İlerleme Takibi:** Çözülen tüm testler, başarı oranları ve zaman metrikleri bulut tabanlı (Firebase) olarak güvenle saklanır.
*   **Akıllı Algoritmalar (Favoriler & Yanlışlar):** Karşılaşılan sorular favorilere eklenebilir veya hatalı işaretlenen sorular sistem tarafından otomatik olarak kaydedilerek "Yanlışlarım" adı altında özel bir teste dönüştürülür.
*   **Gerçek Sınav Simülasyonu:** Rastgele seçilen 27 soru ile tüm konulardan bağımsız tam kapsamlı deneme sınavları oluşturulabilir.
*   **Gelişmiş İstatistik Paneli:** Doğru, yanlış ve boş sayıları ile başarı yüzdeleri detaylı grafikler (Donut ve Çizgi grafikleri) eşliğinde incelenebilir.
*   **Karanlık/Aydınlık Mod & PWA:** Kullanıcı deneyimini artıran dinamik tema seçeneği ve uygulamayı bir masaüstü/mobil uygulama gibi cihaza yükleme (Progressive Web App) desteği mevcuttur.
*   **KVKK Uyumlu Hesap Yönetimi:** Kullanıcılar diledikleri zaman hesaplarını ve tüm kişisel verilerini kalıcı olarak sistemden silebilirler.

## Kullanım Rehberi

### 1. Hesap Oluşturma ve Giriş
Sistemi tam kapsamlı kullanabilmek için geçerli bir e-posta adresi ile kayıt olunması veya Google hesabı ile giriş yapılması gerekmektedir. Yeni kayıtlarda veri güvenliği için e-posta doğrulama (Verification) adımı zorunludur.

### 2. Test Çözümü ve Anında Geri Bildirim
*   **Test Seçimi:** Ekrandaki "Test Seçin" açılır menüsünden istenilen tarih konusu seçilerek doğrudan teste başlanabilir.
*   **Anında Çözüm Göster:** Kontrol panelindeki bu anahtar (toggle) aktif edildiğinde, işaretlenen şıkkın doğruluğu ve sorunun detaylı çözümü anında ekrana yansır. Aktif edilmediğinde sonuçlar test bitimine bırakılır.
*   **Zamanlayıcı (Timer):** Sağ üst köşede bulunan "Süreyi Başlat" butonu ile her test için kendinizi zamanla yarışarak sınayabilir, dilediğinizde süreyi duraklatabilir veya sıfırlayabilirsiniz.

### 3. Özel Test Modları (Favoriler ve Yanlışlar)
*   Test esnasında yıldız (⭐) ikonuna basılarak önemli görülen sorular **Favoriler** listesine eklenir.
*   Yanlış işaretlenen sorular otomatik olarak depolanır.
*   Kontrol panelindeki **"Favoriler"** veya **"Yanlışlar"** butonlarına tıklayarak, sadece bu sorulardan oluşan kişiselleştirilmiş testler çözülebilir. Yanlışlar havuzunu sıfırlamak için butonun yanındaki çöp kutusu ikonu kullanılabilir.

### 4. Gerçek KPSS Denemesi
Açılır menüden **"Gerçek KPSS Denemesi (Rastgele 27 Soru)"** modunu seçtiğinizde, sistem mevcut tüm testlerin içinden karma bir deneme oluşturur. Yeni bir rastgele denemeye geçmek için açılır menünün yanındaki "Yeni Sorular Üret" butonuna (Zar ikonu) tıklamanız yeterlidir.

### 5. İstatistikleri İnceleme
Kontrol panelinde yer alan **"İstatistikler"** butonuna tıklandığında, çözülen toplam soru sayısı, doğru/yanlış grafikleri ve tarihsel ilerleme eğriniz görsel raporlar eşliğinde sunulur. Bu raporlar zayıf olduğunuz konuları tespit etmenize yardımcı olur.

### 6. Profil ve Veri Yönetimi
Sağ üst köşedeki kullanıcı adınıza (Profil simgesi) tıklayarak ayarlar paneline erişebilirsiniz. Bu panel üzerinden:
*   Kullanıcı adınızı değiştirebilir,
*   E-posta adresinizi güvenli bir şekilde güncelleyebilir,
*   Hesabınızı ve size ait tüm verileri kalıcı olarak (KVKK standartlarına uygun şekilde) silebilirsiniz.

### 7. Yasal Bildirimler ve İletişim
Sayfanın en altında bulunan alt çubuk (Footer) üzerinden uygulamanın Gizlilik Politikası ve Kullanım Koşulları metinlerine ulaşabilirsiniz. Uygulama ile ilgili bir tavsiyede bulunmak veya hata bildirmek isterseniz, üst panelde yer alan **"Öneri Gönder"** butonunu kullanabilirsiniz.
