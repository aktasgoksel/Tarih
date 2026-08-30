import { test, expect } from '@playwright/test';

test.describe('TarihApp E2E Smoke Tests', () => {
  const timestamp = Date.now();
  const testEmail = `test_${timestamp}@tarihapp.com`;
  const testPassword = 'TestPassword123';
  const testDisplayName = `TestUser_${timestamp}`;

  test('Giriş, Kayıt, Test Çözme, İstatistikler, Öneri Gönderimi ve Hesap Silme Akışı', async ({ page }) => {
    // 1. Sayfayı yükle
    await page.goto('/index_dev.html');
    await expect(page).toHaveTitle(/TarihApp/);

    // 2. Yeni Kullanıcı Kaydı (Register)
    await page.locator('button:has-text("Kayıt Ol")').first().click();
    await page.locator('#register-displayname').fill(testDisplayName);
    await page.locator('#register-username').fill(testEmail);
    await page.locator('#register-password').fill(testPassword);
    
    // Kayıt ol butonuna tıkla
    await page.locator('button:has-text("Kayıt Ol")').last().click();

    // 3. Yükleme ve Ana Ekran Kontrolü
    // Firestore ilk yüklemesi yoğun dönemlerde 30-40 saniye sürebilir.
    // Uygulamanın kendi loader timeout'u 30 saniyedir; biz bunun ötesinde bekliyoruz.
    await expect(page.locator('#app-screen')).toBeVisible({ timeout: 50000 });

    // Eğer uygulama kendi "Bağlantı Zaman Aşımı" modalını gösterdiyse kapat
    const timeoutModal = page.locator('#custom-modal-title:has-text("Bağlantı Zaman Aşımı")');
    if (await timeoutModal.isVisible({ timeout: 500 }).catch(() => false)) {
      await page.locator('#custom-modal-buttons button').click();
    }

    // Not: Firebase Auth kayıt esnasında displayName güncellenmeden önce ilk auth tetiklendiği için email ismi görünür.
    await expect(page.locator('#welcome-text')).toContainText(`test_${timestamp}`);

    // 4. Test Çözme Akışı
    // Soru seçeneklerinden ilkini (A şıkkı) işaretle
    await page.locator('label[for="opt-0-0"]').click();
    
    // Cevabı kontrol et butonuna tıkla
    await page.locator('#check-btn-container-0 button').click();
    
    // Çözüm açıklamasının açıldığını doğrula
    await expect(page.locator('#solution-0')).toBeVisible();
    
    // Sonraki soruya geç
    await page.locator('#next-btn').click();
    await expect(page.locator('#question-counter')).toContainText('Soru 2');

    // 5. İstatistikler Modalı Kontrolü
    await page.locator('button[onclick="window.showStatsModal()"]').click();
    await expect(page.locator('#stats-modal')).toBeVisible();
    // Yeni kullanıcı olduğu için boş modal uyarısının render edildiğini doğrula
    await expect(page.locator('#stats-empty')).toBeVisible();
    // Kapat
    await page.locator('button[onclick="window.closeStatsModal()"]').click();
    await expect(page.locator('#stats-modal')).toBeHidden();

    // 6. Öneri Gönderim Akışı
    await page.locator('button[onclick="window.openSuggestionModal()"]').first().click();
    await page.locator('#suggestion-text').fill('Bu otomatik E2E smoke test önerisidir.');
    await page.locator('#submit-suggestion-btn').click();
    
    // Başarılı uyarısını bekle
    await expect(page.locator('#custom-modal-title')).toHaveText('Başarılı');
    await page.locator('#custom-modal-buttons button').click(); // modalı kapat

    // 7. Hesap Silme & Veritabanı Temizliği (Self-cleaning)
    await page.locator('button[onclick="window.openProfileModal()"]').click();
    await expect(page.locator('#profile-modal')).toBeVisible();
    
    await page.locator('button[onclick="window.deleteAccount()"]').click();
    await expect(page.locator('#custom-modal-title')).toHaveText('Dikkat!');
    await page.locator('#custom-modal-buttons button:has-text("Evet, Hesabımı Sil")').click();
    
    // Silinme onayını bekle ve sayfayı yenilemeden çıkış yapıldığını doğrula
    await expect(page.locator('#custom-modal-title')).toHaveText('Hesap Silindi', { timeout: 10000 });
    
    // 2 saniye sonra otomatik reload olur, auth ekranına döndüğümüzü doğrula
    await page.waitForTimeout(3000);
    await expect(page.locator('#auth-screen')).toBeVisible();
  });
});
