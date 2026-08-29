# KPSS Tarih Soru Bankası

Tamamen tarayıcı üzerinde çalışan, sunucusuz (serverless) ve interaktif bir KPSS Tarih Soru Bankası web uygulamasıdır. 

## 🌟 Özellikler

- **İnternetsiz / Sunucusuz Çalışma:** Veritabanı veya arka uç (backend) sunucusuna ihtiyaç duymaz. Tüm kayıtlar tarayıcının yerel depolama alanında (`localStorage`) tutulur.
- **Kişiselleştirilmiş Kullanıcı Hesapları:** Her kullanıcı kendi cihazında hesap oluşturabilir. Hangi testlerin çözüldüğü ve doğru/yanlış sayıları hesap bazında kaydedilir.
- **Akıllı Hata Takibi (Yanlışlarımı Çöz):** Testlerde yanlış yapılan veya boş bırakılan sorular otomatik olarak kaydedilir. "🔥 Yanlışlarımı Çöz" butonu ile sadece yanlış yapılan sorulardan oluşan özel testler oluşturulabilir. Soruyu doğru cevapladığınızda hata havuzundan silinir.
- **Anında Geri Bildirim:** İsteğe bağlı olarak "Anında Çözüm Göster" modu açılarak, soruyu cevaplar cevaplamaz doğru yanıtı ve çözüm açıklamasını görebilirsiniz.
- **Karanlık / Aydınlık Mod:** Göz yormayan tasarım, sistem temanıza göre otomatik ayarlanır veya menüdeki butondan manuel olarak değiştirilebilir.
- **Mobil Uyumlu (Responsive):** Tailwind CSS sayesinde telefon, tablet ve bilgisayar ekranlarına tam uyumludur.

## 🚀 Kurulum ve Çalıştırma

Projede sunucu olmadığı için kurulum çok basittir:

1. Bu projeyi bilgisayarınıza indirin veya `git clone` ile çekin.
2. Klasör içindeki `index.html` dosyasına çift tıklayarak herhangi bir modern tarayıcıda açın.
3. Çalışmaya başlayın!

### Yeni Soru Ekleme / Arayüzü Güncelleme
Proje kaynak kodlarını güncellemek isterseniz:
1. `data.js` dosyasını açıp JSON formatındaki test verilerine yeni sorular ekleyebilirsiniz.
2. Arayüz yapısını değiştirmek için `build_html.py` dosyasını düzenleyin. 
3. Yaptığınız değişikliklerin HTML dosyasına yansıması için terminalden şu komutu çalıştırın:
   ```bash
   python build_html.py
   ```
   Bu komut, en güncel `index.html` dosyasını sizin için otomatik oluşturacaktır.

## 🌐 GitHub Pages Üzerinde Yayınlama

Bu projeyi herkese açık bir web sitesi olarak internette ücretsiz yayınlamak için:

1. Deponuzu (Repository) GitHub'a yükleyin ve görünürlüğünü **Public** (Herkese Açık) yapın.
2. GitHub'da projenizin **Settings (Ayarlar)** sekmesine gidin.
3. Sol menüden **Pages** seçeneğine tıklayın.
4. "Source" kısmını `Deploy from a branch` olarak ayarlayın.
5. "Branch" kısmından `main` dalını seçin ve "Save" diyerek kaydedin.
6. Yaklaşık 1 dakika sonra siteniz `https://[kullanici-adiniz].github.io/Tarih` adresinde yayında olacaktır!

## 🛠️ Teknolojiler
- HTML5, CSS3, JavaScript (ES6)
- **Tailwind CSS** (Tasarım kütüphanesi - CDN üzerinden)
- **Python** (Statik site oluşturucu betik olarak)
