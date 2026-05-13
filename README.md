# E-Commerce Backend Simulation

Bu proje, temel bir e-ticaret backend sistemini simüle etmek için geliştirildi.  
Amaç sadece endpoint yazmak değil, bir e-ticaret sisteminin backend mantığını öğrenmekti.

Projede ürün listeleme, ürün arama, sepete ürün ekleme, sipariş oluşturma, stok düşme, sepet temizleme, sipariş durumu güncelleme, bildirim simülasyonu gibi temel e-ticaret akışları yer alıyor.

## Projede Neler Var?

- Ürün listeleme
- Ürün detay getirme
- Ürün arama
- Yeni ürün ekleme
- DTO ve validation ile ürün verisi kontrolü
- Sepete ürün ekleme
- Sepeti görüntüleme
- Sepetten ürün silme
- Sepeti temizleme
- Sepetten sipariş oluşturma
- Siparişleri listeleme
- Sipariş durumunu güncelleme
- Bildirim simülasyonu
- Global error handling
- Layered architecture yapısı

## Kullanılan Teknolojiler

- Node.js
- Express.js
- JavaScript

## Proje Yapısı

```bash
ecommerce-backend/
│
├── controllers/
│   └── orderController.js
│
├── data/
│   ├── cart.js
│   ├── orders.js
│   └── products.js
│
├── dtos/
│   └── createProductDto.js
│
├── middlewares/
│   └── errorHandler.js
│
├── repositories/
│   └── orderRepository.js
│
├── routes/
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
│
├── services/
│   └── orderService.js
│
├── utils/
│   └── AppError.js
│
├── validations/
│   └── productValidation.js
│
├── app.js
├── package.json
└── package-lock.json
