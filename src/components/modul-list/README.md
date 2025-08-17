# Sistem Komponen Qwik untuk Modul Pembelajaran

Sistem komponen ini menggantikan `component.js` dengan implementasi Qwik yang lebih modern dan performant.

## Komponen yang Tersedia

### 1. ModuleHeader

Header utama untuk setiap modul dengan badge, judul, dan deskripsi.

```tsx
<ModuleHeader
  title="Judul Modul"
  moduleName="Modul 1"
  description="Deskripsi modul"
  theme="orange"
/>
```

### 2. Info

Komponen alert untuk informasi, warning, atau error.

```tsx
<Info
  title="Judul Info"
  content="<p>Konten HTML</p>"
  type="primary" // default, primary, success, warning, error, navy
  shared={true}
/>
```

### 3. Material

Komponen untuk konten pembelajaran dengan heading yang dapat dikustomisasi.

```tsx
<Material
  title="Judul Material"
  content="<p>Konten HTML</p>"
  level="h2" // h1, h2, h3, h4, h5, h6
  shared={true}
  theme="blue"
/>
```

### 4. Code

Komponen untuk menampilkan kode dengan syntax highlighting, download, dan fullscreen.

```tsx
<Code
  title="Judul Kode"
  description="Deskripsi kode"
  filePath="/path/to/file.js"
  language="javascript"
  shared={true}
  theme="orange"
/>
```

### 5. Command

Komponen untuk menampilkan command terminal dengan output dan komentar.

```tsx
<Command
  title="Judul Command"
  description="Deskripsi command"
  commands={[
    { command: "npm install", comment: "Install dependencies" },
    { command: "npm start", output: "Server started", comment: "Start server" },
  ]}
  type="terminal" // terminal, powershell, cmd
  shared={true}
  theme="orange"
/>
```

### 6. CardSection

Grid dari card untuk menampilkan informasi dalam format yang terstruktur.

```tsx
<CardSection
  title="Judul Section"
  cards={[
    { title: "Card 1", description: "Deskripsi 1", image: "/image1.png" },
    { title: "Card 2", description: "Deskripsi 2" },
  ]}
  columns={2} // 1, 2, atau 3
  shared={false}
  theme="blue"
/>
```

### 7. AccordionSection

Komponen accordion untuk FAQ atau konten yang dapat di-collapse.

```tsx
<AccordionSection
  title="Judul Accordion"
  items={[
    { title: "Item 1", content: "<p>Konten 1</p>" },
    { title: "Item 2", content: "<p>Konten 2</p>" },
  ]}
  allowMultiple={true}
  shared={true}
  theme="orange"
/>
```

### 8. Video

Komponen untuk menampilkan video YouTube.

```tsx
<Video
  title="Judul Video"
  description="Deskripsi video"
  videoId="dQw4w9WgXcQ"
  shared={true}
  theme="orange"
/>
```

### 9. Table

Komponen tabel dengan styling DaisyUI.

```tsx
<Table
  title="Judul Tabel"
  headers={["Kolom 1", "Kolom 2", "Kolom 3"]}
  rows={[
    ["Data 1", "Data 2", "Data 3"],
    ["Data 4", "Data 5", "Data 6"],
  ]}
  shared={true}
  theme="blue"
/>
```

## Penggunaan

### 1. Import Komponen

```tsx
import { ModuleHeader, Info, Material } from "~/components/modul-list";
```

### 2. Gunakan ModuleRenderer untuk JSON

```tsx
import { ModuleRenderer } from "~/components/modul-list";

<ModuleRenderer jsonPath="/data/modul-1.json" />;
```

### 3. Gunakan ComponentRenderer untuk Komponen Tunggal

```tsx
import { ComponentRenderer } from "~/components/modul-list";

const component = {
  type: "info",
  data: {
    title: "Judul",
    content: "<p>Konten</p>",
    type: "primary",
  },
};

<ComponentRenderer component={component} />;
```

## Struktur JSON

File JSON harus memiliki struktur berikut:

```json
{
  "title": "Judul Modul",
  "description": "Deskripsi modul",
  "components": [
    {
      "type": "moduleHeader",
      "data": {
        "title": "Judul",
        "moduleName": "Modul 1",
        "description": "Deskripsi",
        "theme": "orange"
      }
    }
  ]
}
```

## Fitur

- ✅ **TypeScript Support** - Full type safety
- ✅ **Qwik Best Practices** - Menggunakan `component$`, `useSignal`, `useTask$`
- ✅ **Responsive Design** - Menggunakan DaisyUI dan Tailwind CSS
- ✅ **Accessibility** - ARIA labels dan semantic HTML
- ✅ **Performance** - Lazy loading dan optimisasi Qwik
- ✅ **Share Functionality** - Built-in sharing untuk setiap komponen
- ✅ **Toast Notifications** - Feedback untuk user actions
- ✅ **Copy to Clipboard** - Untuk kode dan command
- ✅ **Fullscreen Mode** - Untuk komponen kode
- ✅ **Download Files** - Untuk file kode

## Keunggulan Dibanding component.js

1. **Modern Architecture** - Menggunakan Qwik framework yang modern
2. **Type Safety** - Full TypeScript support
3. **Better Performance** - Qwik's resumability dan lazy loading
4. **Component-Based** - Lebih mudah maintain dan extend
5. **Server-Side Rendering** - SEO friendly dan fast initial load
6. **Better Developer Experience** - Hot reload, TypeScript, modern tooling

## Migration dari component.js

1. Ganti `<script src="/js/component.js">` dengan import komponen Qwik
2. Ganti `renderComponent()` dengan `<ComponentRenderer>`
3. Ganti `autoRenderComponents()` dengan `<ModuleRenderer>`
4. Semua fungsi utility sudah tersedia sebagai QRL functions

## Dependencies

- `@qwik.dev/core` - Qwik core functionality
- `daisyui` - UI component library
- `tailwindcss` - CSS framework
- Font Awesome - Icons
