export interface ResumeTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimalist';
  styles: {
    container: {
      backgroundColor: string;
      color: string;
      fontFamily: string;
      padding: string;
      borderRadius?: string;
      boxShadow?: string;
    };
    header: {
      nameColor: string;
      nameFontSize: string;
      nameFontWeight: string;
      contactColor: string;
      contactFontSize: string;
    };
    section: {
      titleColor: string;
      titleFontSize: string;
      titleFontWeight: string;
      titleMarginBottom: string;
      dividerColor: string;
      dividerMargin: string;
    };
    content: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
      fontSize: string;
      lineHeight: string;
    };
    chip: {
      backgroundColor: string;
      color: string;
      borderColor?: string;
    };
  };
}

export const resumeThemes: ResumeTheme[] = [
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean and professional with blue accents',
    preview: 'Modern design with blue color scheme',
    category: 'modern',
    styles: {
      container: {
        backgroundColor: '#ffffff',
        color: '#2c3e50',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      header: {
        nameColor: '#3498db',
        nameFontSize: '2.5rem',
        nameFontWeight: '600',
        contactColor: '#7f8c8d',
        contactFontSize: '1rem',
      },
      section: {
        titleColor: '#2c3e50',
        titleFontSize: '1.25rem',
        titleFontWeight: '600',
        titleMarginBottom: '16px',
        dividerColor: '#3498db',
        dividerMargin: '24px 0',
      },
      content: {
        primaryColor: '#2c3e50',
        secondaryColor: '#7f8c8d',
        accentColor: '#3498db',
        fontSize: '0.9rem',
        lineHeight: '1.6',
      },
      chip: {
        backgroundColor: '#3498db',
        color: '#ffffff',
      },
    },
  },
  {
    id: 'classic-dark',
    name: 'Classic Dark',
    description: 'Traditional dark theme for formal resumes',
    preview: 'Traditional dark theme',
    category: 'classic',
    styles: {
      container: {
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        fontFamily: '"Times New Roman", serif',
        padding: '40px',
        borderRadius: '0px',
        boxShadow: 'none',
      },
      header: {
        nameColor: '#ecf0f1',
        nameFontSize: '2.75rem',
        nameFontWeight: '700',
        contactColor: '#bdc3c7',
        contactFontSize: '1.1rem',
      },
      section: {
        titleColor: '#ecf0f1',
        titleFontSize: '1.5rem',
        titleFontWeight: '700',
        titleMarginBottom: '20px',
        dividerColor: '#e74c3c',
        dividerMargin: '32px 0',
      },
      content: {
        primaryColor: '#ecf0f1',
        secondaryColor: '#bdc3c7',
        accentColor: '#e74c3c',
        fontSize: '1rem',
        lineHeight: '1.7',
      },
      chip: {
        backgroundColor: '#e74c3c',
        color: '#ffffff',
      },
    },
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Modern gradient design with creative elements',
    preview: 'Creative gradient theme',
    category: 'creative',
    styles: {
      container: {
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        fontFamily: '"Poppins", "Segoe UI", sans-serif',
        padding: '36px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      },
      header: {
        nameColor: '#ffffff',
        nameFontSize: '2.8rem',
        nameFontWeight: '700',
        contactColor: '#f8f9fa',
        contactFontSize: '1.1rem',
      },
      section: {
        titleColor: '#ffffff',
        titleFontSize: '1.4rem',
        titleFontWeight: '600',
        titleMarginBottom: '18px',
        dividerColor: '#ffd700',
        dividerMargin: '28px 0',
      },
      content: {
        primaryColor: '#ffffff',
        secondaryColor: '#f8f9fa',
        accentColor: '#ffd700',
        fontSize: '0.95rem',
        lineHeight: '1.65',
      },
      chip: {
        backgroundColor: '#ffd700',
        color: '#2c3e50',
      },
    },
  },
  {
    id: 'minimalist-gray',
    name: 'Minimalist Gray',
    description: 'Clean and minimal with subtle gray tones',
    preview: 'Minimalist gray theme',
    category: 'minimalist',
    styles: {
      container: {
        backgroundColor: '#f8f9fa',
        color: '#495057',
        fontFamily: '"Inter", "Helvetica Neue", sans-serif',
        padding: '28px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      },
      header: {
        nameColor: '#212529',
        nameFontSize: '2.2rem',
        nameFontWeight: '500',
        contactColor: '#6c757d',
        contactFontSize: '0.95rem',
      },
      section: {
        titleColor: '#212529',
        titleFontSize: '1.2rem',
        titleFontWeight: '500',
        titleMarginBottom: '14px',
        dividerColor: '#dee2e6',
        dividerMargin: '20px 0',
      },
      content: {
        primaryColor: '#495057',
        secondaryColor: '#6c757d',
        accentColor: '#007bff',
        fontSize: '0.9rem',
        lineHeight: '1.5',
      },
      chip: {
        backgroundColor: '#e9ecef',
        color: '#495057',
        borderColor: '#dee2e6',
      },
    },
  },
  {
    id: 'professional-green',
    name: 'Professional Green',
    description: 'Professional theme with green accents',
    preview: 'Professional green theme',
    category: 'modern',
    styles: {
      container: {
        backgroundColor: '#ffffff',
        color: '#2d3748',
        fontFamily: '"Roboto", "Arial", sans-serif',
        padding: '30px',
        borderRadius: '6px',
        boxShadow: '0 3px 8px rgba(0, 0, 0, 0.08)',
      },
      header: {
        nameColor: '#38a169',
        nameFontSize: '2.4rem',
        nameFontWeight: '600',
        contactColor: '#718096',
        contactFontSize: '1rem',
      },
      section: {
        titleColor: '#2d3748',
        titleFontSize: '1.3rem',
        titleFontWeight: '600',
        titleMarginBottom: '16px',
        dividerColor: '#38a169',
        dividerMargin: '24px 0',
      },
      content: {
        primaryColor: '#2d3748',
        secondaryColor: '#718096',
        accentColor: '#38a169',
        fontSize: '0.9rem',
        lineHeight: '1.6',
      },
      chip: {
        backgroundColor: '#38a169',
        color: '#ffffff',
      },
    },
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    description: 'Elegant design with purple and gold accents',
    preview: 'Elegant purple theme',
    category: 'creative',
    styles: {
      container: {
        backgroundColor: '#ffffff',
        color: '#2d1b69',
        fontFamily: '"Playfair Display", "Georgia", serif',
        padding: '35px',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(45, 27, 105, 0.15)',
      },
      header: {
        nameColor: '#2d1b69',
        nameFontSize: '2.6rem',
        nameFontWeight: '700',
        contactColor: '#6b46c1',
        contactFontSize: '1.05rem',
      },
      section: {
        titleColor: '#2d1b69',
        titleFontSize: '1.4rem',
        titleFontWeight: '600',
        titleMarginBottom: '18px',
        dividerColor: '#d69e2e',
        dividerMargin: '26px 0',
      },
      content: {
        primaryColor: '#2d1b69',
        secondaryColor: '#6b46c1',
        accentColor: '#d69e2e',
        fontSize: '0.95rem',
        lineHeight: '1.65',
      },
      chip: {
        backgroundColor: '#d69e2e',
        color: '#2d1b69',
      },
    },
  },
  {
    id: 'tech-dark',
    name: 'Tech Dark',
    description: 'Modern tech-inspired dark theme',
    preview: 'Tech dark theme',
    category: 'modern',
    styles: {
      container: {
        backgroundColor: '#1a202c',
        color: '#e2e8f0',
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      header: {
        nameColor: '#00ff88',
        nameFontSize: '2.3rem',
        nameFontWeight: '600',
        contactColor: '#a0aec0',
        contactFontSize: '0.95rem',
      },
      section: {
        titleColor: '#00ff88',
        titleFontSize: '1.25rem',
        titleFontWeight: '600',
        titleMarginBottom: '16px',
        dividerColor: '#00ff88',
        dividerMargin: '24px 0',
      },
      content: {
        primaryColor: '#e2e8f0',
        secondaryColor: '#a0aec0',
        accentColor: '#00ff88',
        fontSize: '0.9rem',
        lineHeight: '1.6',
      },
      chip: {
        backgroundColor: '#00ff88',
        color: '#1a202c',
      },
    },
  },
  {
    id: 'clean-white',
    name: 'Clean White',
    description: 'Ultra-clean white theme with black accents',
    preview: 'Clean white theme',
    category: 'minimalist',
    styles: {
      container: {
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: '"Helvetica Neue", "Arial", sans-serif',
        padding: '24px',
        borderRadius: '0px',
        boxShadow: 'none',
      },
      header: {
        nameColor: '#000000',
        nameFontSize: '2.2rem',
        nameFontWeight: '400',
        contactColor: '#666666',
        contactFontSize: '0.9rem',
      },
      section: {
        titleColor: '#000000',
        titleFontSize: '1.1rem',
        titleFontWeight: '500',
        titleMarginBottom: '12px',
        dividerColor: '#000000',
        dividerMargin: '16px 0',
      },
      content: {
        primaryColor: '#000000',
        secondaryColor: '#666666',
        accentColor: '#000000',
        fontSize: '0.85rem',
        lineHeight: '1.4',
      },
      chip: {
        backgroundColor: '#f0f0f0',
        color: '#000000',
        borderColor: '#000000',
      },
    },
  },
];

export function getThemeById(themeId: string): ResumeTheme | undefined {
  return resumeThemes.find(theme => theme.id === themeId);
}

export function getThemesByCategory(category: ResumeTheme['category']): ResumeTheme[] {
  return resumeThemes.filter(theme => theme.category === category);
}

export function getDefaultTheme(): ResumeTheme {
  return resumeThemes[0]; // Modern Blue as default
} 