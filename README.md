# Modul Praktikum Mobile Development Platform

Platform pembelajaran interaktif untuk praktikum pengembangan aplikasi mobile Android yang dikembangkan untuk Laboratorium Informatika UMM.

## 🚀 Features

- **Modular Content System**: Sistem konten berbasis JSON yang fleksibel dan mudah di-maintain
- **Component-Based Architecture**: 12+ jenis komponen UI yang dapat dikombinasikan untuk membuat konten yang kaya
- **Responsive Design**: Optimized untuk desktop, tablet, dan mobile devices
- **Dark/Light Theme**: Theme toggle dengan persistence menggunakan localStorage
- **Interactive Learning**: Quiz, code examples, video tutorials, dan download resources
- **Syntax Highlighting**: Code highlighting menggunakan Prism.js dengan berbagai bahasa
- **Modern UI**: Dibangun dengan Tailwind CSS untuk styling yang konsisten dan modern

## 📋 Prerequisites

- Web browser modern (Chrome, Firefox, Safari, Edge)
- Web server untuk development (Live Server, XAMPP, atau similar)
- Text editor (VS Code, Sublime Text, atau similar)

## 🛠 Installation & Setup

1. **Clone atau download project**
   ```bash
   git clone [repository-url]
   cd learning-platform
   ```

2. **Setup Web Server**
   - Gunakan Live Server extension di VS Code, atau
   - Setup XAMPP/WAMP dan letakkan folder di htdocs, atau
   - Gunakan Python simple server: `python -m http.server 8000`

3. **Akses Platform**
   - Buka browser dan navigate ke `http://localhost:8000` (atau port yang sesuai)
   - Platform siap digunakan!

## 📁 Project Structure

```
learning-platform/
├── index.html                 # Homepage
├── modules.html              # Modules overview page
├── modul/                    # Individual module pages
│   ├── modul1.html          # Module 1: Introduction
│   ├── modul2.html          # Module 2: Basic Layouts
│   ├── modul3.html          # Module 3: Activities (template)
│   ├── modul4.html          # Module 4: Fragments (template)
│   ├── modul5.html          # Module 5: Data Storage (template)
│   └── modul6.html          # Module 6: Networking (template)
├── pages/                   # Static pages
│   ├── about.html          # About page
│   └── contact.html        # Contact page
├── assets/
│   ├── js/                 # JavaScript files
│   │   ├── main.js         # Main application controller
│   │   ├── components.js   # Component rendering system
│   │   ├── theme.js        # Theme management
│   │   └── share.js        # Share functionality
│   ├── data/               # JSON configuration files
│   │   ├── homepage.json   # Homepage content
│   │   ├── modules.json    # Modules list data
│   │   ├── sidebar.json    # Sidebar navigation
│   │   ├── about.json      # About page content
│   │   └── content/        # Individual module content
│   │       ├── modul1.json # Module 1 content
│   │       ├── modul2.json # Module 2 content
│   │       └── ...         # Other modules
│   ├── code/               # Code examples
│   │   ├── modul1/         # Module 1 code samples
│   │   ├── modul2/         # Module 2 code samples
│   │   └── shared/         # Shared utilities
│   └── images/             # Image assets
└── README.md               # This file
```

## 🧩 Component System

Platform ini menggunakan sistem komponen berbasis JSON yang memungkinkan pembuatan konten yang fleksibel dan interaktif.

### Available Components

1. **Hero Component** - Banner dengan background image dan CTA buttons
2. **Text Component** - Rich text content dengan formatting
3. **Code Component** - Code blocks dengan syntax highlighting dan fitur copy/download
4. **Video Component** - YouTube video embeds
5. **Image Component** - Images dengan caption dan responsive sizing
6. **Alert Component** - Notification boxes (info, success, warning, error)
7. **List Component** - Ordered dan unordered lists
8. **Accordion Component** - Collapsible content sections
9. **Quiz Component** - Interactive quizzes dengan multiple choice dan text input
10. **Table Component** - Responsive data tables
11. **Card Component** - Card grid layouts
12. **Timeline Component** - Timeline untuk learning paths
13. **Download Component** - File download sections

### Component Configuration Example

```json
{
  "type": "code",
  "id": "example-code",
  "data": {
    "title": "Hello World Example",
    "description": "Basic Android application",
    "filePath": "/assets/code/modul1/MainActivity.java",
    "language": "java",
    "showLineNumbers": true,
    "highlightLines": [5, 10],
    "showPreview": false,
    "showShare": true,
    "downloadable": true
  }
}
```

## 🎨 Customization

### Color Palette

Platform menggunakan custom color palette yang dapat dikonfigurasi di Tailwind config:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF6B35',
        'secondary-navy': '#1B263B',
        'accent-orange': '#FFB366',
        'dark-bg': '#0F1419',
        'code-light': '#F8F9FA',
        'code-dark': '#1E1E1E',
      }
    }
  }
}
```

### Adding New Modules

1. **Create HTML file** di folder `modul/` (copy dari template existing)
2. **Create JSON content** di `assets/data/content/`
3. **Update sidebar navigation** di `assets/data/sidebar.json`
4. **Update modules list** di `assets/data/modules.json`
5. **Add code examples** di `assets/code/modulX/`

### Adding New Components

1. **Add renderer function** di `assets/js/components.js`
2. **Export function** di bagian bawah file
3. **Test component** dengan menambahkan ke JSON content

## 🔧 Development

### JavaScript Architecture

- **main.js**: Application controller, routing, data loading
- **components.js**: Component rendering system
- **theme.js**: Dark/light theme management
- **share.js**: Social sharing functionality

### Data Flow

1. Page loads → `main.js` determines page type
2. Load sidebar data → Render sidebar navigation
3. Load page-specific JSON → Render content using components system
4. Initialize interactive features → Event listeners, theme toggle, etc.

### Adding Interactive Features

Contoh menambahkan fungsi interaktif baru:

```javascript
// Di components.js
function newInteractiveFunction(elementId) {
    const element = document.getElementById(elementId);
    // Implementation here
}

// Export for global use
window.newInteractiveFunction = newInteractiveFunction;
```

## 📱 Mobile Responsiveness

Platform dioptimalkan untuk berbagai ukuran layar:

- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, responsive grids
- **Mobile**: Hidden sidebar dengan overlay, single column layouts, touch-friendly interface

## 🎯 Best Practices

### Content Creation

1. **Gunakan heading hierarchy** yang proper (h1 → h2 → h3)
2. **Optimized images** untuk performa yang baik
3. **Consistent naming** untuk IDs dan file paths
4. **Accessibility** - selalu sertakan alt text dan aria labels
5. **Progressive disclosure** - gunakan accordion untuk konten yang panjang

### Code Examples

1. **Include context** - minimal 3-5 baris sebelum dan sesudah highlight
2. **Consistent formatting** - gunakan proper indentation
3. **Meaningful comments** - jelaskan bagian code yang penting
4. **Error handling** - tunjukkan cara menangani common errors

### Performance

1. **Lazy loading** untuk images dan video
2. **Minimize JSON payloads** - split large content ke multiple files
3. **Optimize assets** - compress images dan minify JS jika diperlukan
4. **Caching strategy** - gunakan appropriate cache headers

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Pastikan menggunakan web server, bukan file:// protocol
2. **JSON tidak load**: Check console untuk errors, validate JSON syntax
3. **Components tidak render**: Verify component type dan data structure
4. **Theme tidak persist**: Check localStorage permissions di browser
5. **Mobile menu tidak buka**: Verify JavaScript files loaded properly

### Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## 📄 License

This project is developed for educational purposes at Laboratorium Informatika UMM.

## 🤝 Contributing

Untuk berkontribusi pada platform ini:

1. **Fork repository** dan create feature branch
2. **Follow coding standards** yang sudah ada
3. **Test thoroughly** di berbagai devices dan browsers
4. **Update documentation** jika diperlukan
5. **Submit pull request** dengan deskripsi yang jelas

