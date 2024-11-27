# KeywordCraft Pro - SEO Keywords Generator

KeywordCraft Pro is a powerful web application designed to generate comprehensive SEO keywords using both template-based patterns and OpenAI's advanced language models.

![KeywordCraft Pro Screenshot](screenshot.png)

## Features

### 1. Multiple Generation Methods
- **Template-based Generation**
  - Quick and free
  - Uses predefined patterns and industry best practices
  - No API key required

- **OpenAI-powered Generation**
  - Advanced AI-generated keywords
  - Supports GPT-4 and GPT-3.5 Turbo models
  - Requires OpenAI API key

### 2. Keyword Categories
- Informational Keywords (how-to, what-is, etc.)
- Commercial Keywords (best, top, review, etc.)
- Transactional Keywords (buy, purchase, etc.)
- Navigational Keywords
- Short Tail Keywords
- Long Tail Keywords
- Exact Match Keywords
- Broad Match Keywords
- Phrase Match Keywords
- Primary Keywords
- Secondary Keywords
- Competitor Keywords
- Customer-Centric Keywords

### 3. User Interface Features
- Responsive design (up to 5-column layout)
- Interactive keyword selection
- Real-time keyword count display
- Export to Excel functionality
- Secure API key handling
- Modern, gradient-based design
- Intuitive category organization

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/keywordcraft-pro.git
cd keywordcraft-pro
```

2. Open `index.html` in your web browser

3. Choose your generation method:
   - **Template-based**: Just enter your topic and generate
   - **OpenAI**: Enter your OpenAI API key, select model, and generate

## Using OpenAI Integration

1. Get your OpenAI API key from [OpenAI's platform](https://platform.openai.com)
2. Select "OpenAI Powered" generation method
3. Enter your API key (it's never stored)
4. Choose between GPT-4 (most capable) or GPT-3.5 Turbo (faster)
5. Enter your topic and generate keywords

## Configuration

The `config.js` file contains settings for:
- Default OpenAI model
- Available models and descriptions
- UI theme settings
- Animation configurations

## Export Options

Export your selected keywords to Excel with categorization preserved. The export includes:
- All keyword categories
- Selection status
- Category grouping
- Timestamp

## Security

- API keys are never stored
- Keys are transmitted securely
- Password-type input for API keys
- Client-side only (no server storage)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for their powerful GPT models
- XLSX.js for Excel export functionality
- Tailwind CSS for styling

## Future Enhancements

- [ ] Keyword difficulty analysis
- [ ] Search volume integration
- [ ] Competitor keyword analysis
- [ ] Keyword trends visualization
- [ ] More export formats (CSV, JSON)
- [ ] Local storage for settings
- [ ] Batch processing
- [ ] Custom category creation

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
