# 📁 Estructura de Imágenes - Sianna Travel

Coloca tus imágenes en las siguientes carpetas:

## 📦 `/packages/` - Fotos de Paquetes Turísticos

Nombra las imágenes según el ID del paquete:

| Archivo | Paquete |
|---------|---------|
| `cancun-beach.jpg` | Cancún Romantic Escape |
| `paris-eiffel.jpg` | París Encantador |
| `machu-picchu.jpg` | Aventura en Machu Picchu |
| `punta-cana.jpg` | Punta Cana All-Inclusive |
| `tokyo-adventure.jpg` | Tokyo Moderno |
| `bariloche-lakes.jpg` | Patagonia Argentina |

**Recomendaciones:**
- Tamaño mínimo: 800x600px
- Formato: WebP o JPG optimizado
- Relación de aspecto: 4:3

---

## 🏢 `/logos/` - Logotipos

| Archivo | Uso |
|---------|-----|
| `logo.svg` | Logo principal (header) |
| `logo-white.svg` | Logo blanco (footer) |
| `favicon.ico` | Favicon del sitio |
| `og-image.jpg` | Imagen para redes sociales (1200x630px) |

---

## 🖼️ `/backgrounds/` - Fondos

| Archivo | Uso |
|---------|-----|
| `hero-bg.jpg` | Fondo del hero principal |
| `contact-bg.jpg` | Fondo página de contacto |
| `cta-bg.jpg` | Fondo de llamadas a la acción |

---

## 🎨 `/icons/` - Iconos personalizados

Iconos SVG adicionales que necesites (aerolíneas, servicios, etc.)

---

## 🔧 Cómo usar las imágenes en el código

```jsx
// En componentes React:
<img src="/images/packages/cancun-beach.jpg" alt="Cancún" />

// En CSS:
background-image: url('/images/backgrounds/hero-bg.jpg');
```

## ⚡ Optimización

Para mejor rendimiento, optimiza las imágenes antes de subirlas:
- Usa [Squoosh](https://squoosh.app/) o [TinyPNG](https://tinypng.com/)
- Convierte a WebP cuando sea posible
- Usa lazy loading (ya configurado en el código)
