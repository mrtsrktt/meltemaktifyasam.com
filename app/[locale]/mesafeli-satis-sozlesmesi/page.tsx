export default function MesafeliSatisSozlesmesiPage() {
  return (
    <section className="py-12 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray">
        <h1>Mesafeli Satış Sözleşmesi</h1>
        <p className="text-sm text-muted-foreground">Son güncelleme: 15 Mart 2026</p>

        <h2>1. Taraflar</h2>
        <h3>Satıcı Bilgileri</h3>
        <ul>
          <li><strong>Unvan:</strong> Meltem Tanık</li>
          <li><strong>Adres:</strong> İstanbul, Türkiye</li>
          <li><strong>E-posta:</strong> info@meltemaktifyasam.com</li>
          <li><strong>Telefon:</strong> +90 541 252 34 21</li>
          <li><strong>Web:</strong> meltemaktifyasam.com</li>
        </ul>

        <h3>Alıcı Bilgileri</h3>
        <p>
          Alıcı bilgileri sipariş sırasında alıcı tarafından sağlanan bilgilerdir.
          Sipariş formunda belirtilen ad-soyad, adres, e-posta ve telefon bilgileri
          bu sözleşmenin ayrılmaz parçasıdır.
        </p>

        <h2>2. Sözleşmenin Konusu</h2>
        <p>
          İşbu sözleşmenin konusu, alıcının meltemaktifyasam.com web sitesinden
          elektronik ortamda sipariş verdiği aşağıda nitelikleri ve satış fiyatı
          belirtilen ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı
          Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
          hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
        </p>

        <h2>3. Sözleşme Konusu Ürün/Hizmet</h2>
        <p>
          Sipariş edilen ürün/hizmetin türü, adedi, miktarı, marka/modeli, rengi,
          satış bedeli sipariş onay sayfasında ve e-posta ile gönderilen sipariş
          özetinde belirtilmiştir. Bu bilgiler sözleşmenin ayrılmaz parçasıdır.
        </p>

        <h2>4. Genel Hükümler</h2>
        <ul>
          <li>Alıcı, sözleşme konusu ürünün temel nitelikleri, satış fiyatı, ödeme şekli ve teslimata ilişkin bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli onayı verdiğini kabul eder.</li>
          <li>Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile, alıcının sipariş tarihinden itibaren 7 iş günü içinde teslim edilir.</li>
          <li>Sözleşme konusu ürün, alıcıya veya alıcının gösterdiği adresteki kişi/kuruluşa teslim edilir.</li>
          <li>Satıcı, sözleşme konusu ürünü eksiksiz, siparişte belirtilen niteliklere uygun teslim etmeyi kabul eder.</li>
        </ul>

        <h2>5. Ödeme</h2>
        <ul>
          <li>Ürün/hizmet bedeli sipariş sırasında belirtilen tutardır ve KDV dahildir.</li>
          <li>Ödeme; kredi kartı, banka kartı veya havale/EFT yöntemlerinden biri ile yapılabilir.</li>
          <li>Kredi kartı ile ödeme yapılması halinde taksit seçenekleri sipariş sırasında gösterilir.</li>
          <li>Ödemeler PCI-DSS uyumlu ödeme altyapısı üzerinden güvenli şekilde gerçekleştirilir.</li>
        </ul>

        <h2>6. Teslimat</h2>
        <ul>
          <li>Ürün, sipariş onayından itibaren en geç 30 gün içinde teslim edilir.</li>
          <li>Teslimat, anlaşmalı kargo firması aracılığıyla alıcının sipariş sırasında belirttiği adrese yapılır.</li>
          <li>Teslimat masrafı aksi belirtilmedikçe alıcıya aittir.</li>
          <li>250 TL ve üzeri siparişlerde kargo ücretsizdir.</li>
        </ul>

        <h2>7. Cayma Hakkı</h2>
        <p>
          Alıcı, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa
          tesliminden itibaren <strong>14 (on dört) gün</strong> içinde cayma hakkını kullanabilir.
        </p>
        <p>Cayma hakkının kullanılması için:</p>
        <ul>
          <li>14 gün içinde satıcıya yazılı olarak (e-posta veya WhatsApp) bildirim yapılması gerekir.</li>
          <li>Ürün kullanılmamış ve ambalajı açılmamış olmalıdır.</li>
          <li>Fatura aslı ile birlikte iade edilmelidir.</li>
        </ul>

        <h3>Cayma Hakkı Kullanılamayacak Ürünler</h3>
        <ul>
          <li>Ambalajı açılmış gıda takviyeleri ve sağlık ürünleri</li>
          <li>Tüketicinin özel isteklerine göre hazırlanan ürünler</li>
          <li>Çabuk bozulabilecek veya son kullanma tarihi geçebilecek ürünler</li>
          <li>Hijyen açısından iade edilemeyecek ürünler</li>
        </ul>

        <h2>8. İade Süreci</h2>
        <p>
          Cayma hakkının kullanılması halinde satıcı, cayma bildiriminin kendisine ulaşmasından
          itibaren en geç <strong>14 gün</strong> içinde toplam bedeli alıcıya iade eder.
          İade, alıcının ödeme yöntemine uygun şekilde yapılır.
        </p>

        <h2>9. Temerrüt Hali ve Hukuki Sonuçları</h2>
        <p>
          Alıcı, ödeme işlemlerini kredi kartı ile yaptığı durumlarda temerrüde düştüğü takdirde,
          kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyeceğini
          ve bankaya karşı sorumlu olacağını kabul eder.
        </p>

        <h2>10. Yetkili Mahkeme</h2>
        <p>
          İşbu sözleşmeden doğan uyuşmazlıklarda Gümrük ve Ticaret Bakanlığınca ilan edilen
          değere kadar Tüketici Hakem Heyetleri, üzerinde İstanbul Tüketici Mahkemeleri yetkilidir.
        </p>

        <h2>11. Yürürlük</h2>
        <p>
          Alıcı, site üzerinden sipariş vermekle işbu sözleşmenin tüm koşullarını
          kabul etmiş sayılır. Satıcı, siparişin gerçekleşmesi öncesinde işbu sözleşmenin
          sitede alıcı tarafından okunup kabul edildiğine dair onay alır.
        </p>

        <h2>12. İletişim</h2>
        <p>
          Sözleşme ile ilgili tüm iletişim için:<br />
          <strong>E-posta:</strong> info@meltemaktifyasam.com<br />
          <strong>WhatsApp:</strong> +90 541 252 34 21
        </p>
      </div>
    </section>
  );
}
