# LinkVault

A modern, clean link management application with folder organization and tagging system. Built with vanilla JavaScript, TailwindCSS, and local storage.

## Features

- 🔗 **Link Management**: Save and organize your favorite links
- 📁 **Folder Organization**: Create color-coded folders to categorize links
- 🏷️ **Tagging System**: Add tags to links for better organization
- 🔍 **Powerful Search**: Search through links, tags, and notes
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 💾 **Local Storage**: All data stored locally in your browser
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd linkvault
```

2. Install dependencies:
```bash
npm install
```

3. Build the CSS:
```bash
npm run build-css
```

4. Copy files to dist:
```bash
npm run build
```

### Development

- **Build CSS**: `npm run build-css`
- **Watch CSS changes**: `npm run build-css:watch`
- **Full build**: `npm run build`
- **Start development server**: `npm run serve`

### Usage

1. Open `dist/index.html` in your browser
2. Start adding links with the form at the top
3. Create folders by clicking "Manage Folders"
4. Use the search bar to find specific links
5. Toggle dark mode with the theme button

## Project Structure

```
linkvault/
├── src/
│   ├── index.html          # Main page
│   ├── folders.html        # Folder management page
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   └── folders.js      # Folder management logic
│   └── styles/
│       └── input.css       # TailwindCSS input file
├── dist/                   # Built files
├── tailwind.config.js      # TailwindCSS configuration
├── postcss.config.js       # PostCSS configuration
└── package.json
```

## Data Storage

All data is stored locally in your browser's localStorage:

- **Links**: URL, tags, notes, folder assignment, creation timestamp
- **Folders**: Name, color tag, creation timestamp
- **Theme**: Dark mode preference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details