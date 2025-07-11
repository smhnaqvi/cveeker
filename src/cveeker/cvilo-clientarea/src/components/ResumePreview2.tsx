import React from "react";
import { Box, Typography, Divider, Stack, Chip } from "@mui/material";
import type { ResumeFormValues } from "../pages/dashboard/resume/components/ResumeForm";
import { getThemeById, getDefaultTheme, type ResumeTheme } from "../lib/theme/resumeThemes";

type Props = {
  data: ResumeFormValues;
  theme?: string;
  printMode?: boolean;
};

const ResumePreview: React.FC<Props> = ({ data, theme = 'modern-blue', printMode = false }) => {
  // Get theme configuration
  const themeConfig: ResumeTheme = getThemeById(theme) || getDefaultTheme();
  const styles = themeConfig.styles;

  // Add print mode effect to body
  React.useEffect(() => {
    if (printMode) {
      const style = document.createElement("style");
      style.innerHTML = `
        @page {
          size: A4;
          margin: 0;
        }

        @media print {
          html, body {
            background: ${styles.container.backgroundColor} !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100vh !important;
            width: 100% !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          .resume-preview {
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            min-height: 100vh !important;
            width: 100% !important;
          }
          
          .resume-preview * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, [printMode, styles.container.backgroundColor]);

  return (
    <Box
      data-theme={theme}
      className="resume-preview"
      sx={{
        background: styles.container.backgroundColor,
        color: styles.container.color,
        fontFamily: styles.container.fontFamily,
        padding: printMode ? '0' : styles.container.padding,
        fontSize: styles.content.fontSize,
        lineHeight: styles.content.lineHeight,
        minHeight: printMode ? '100vh' : '297mm', // A4 height
        width: printMode ? '100%' : '210mm', // A4 width
        margin: printMode ? '0' : '0 auto',
        // Ensure colors are preserved in both preview and print
        '& *': {
          fontFamily: styles.container.fontFamily,
          '-webkit-print-color-adjust': 'exact',
          'color-adjust': 'exact',
          'print-color-adjust': 'exact',
        },
        '@media print': {
          margin: '0',
          borderRadius: '0',
          boxShadow: 'none',
          minHeight: '100vh',
          width: '100%',
          background: 'transparent',
          color: styles.container.color,
          '& *': {
            pageBreakInside: 'avoid',
            '-webkit-print-color-adjust': 'exact',
            'color-adjust': 'exact',
            'print-color-adjust': 'exact',
          },
        },
      }}
    >
      {/* Resume Container - matches cv-pdf.html structure */}
      <Box
        sx={{
          width: '100%',
          background: printMode ? 'transparent' : styles.container.backgroundColor,
          padding: printMode ? '0 25px' : styles.container.padding,
          borderRadius: printMode ? '0' : '12px',
          boxShadow: printMode ? 'none' : '0 4px 24px rgba(0,0,0,0.08)',
          lineHeight: styles.content.lineHeight,
          fontSize: styles.content.fontSize,
          minHeight: printMode ? '100vh' : 'auto',
          '@media print': {
            background: 'transparent',
            padding: '0 25px',
            borderRadius: '0',
            boxShadow: 'none',
            minHeight: '100vh',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ 
          pageBreakAfter: 'auto',
          pageBreakBefore: 'auto', // Don't force page break for header
          ...(themeConfig.layout.headerStyle === 'centered' && {
            textAlign: 'center',
            marginBottom: themeConfig.layout.headerSpacing || '32px',
            ...(themeConfig.layout.showHeaderBorder && {
              // borderBottom: `2px solid ${styles.section.dividerColor}`,
              paddingBottom: '20px',
            }),
          }),
          ...(themeConfig.layout.headerStyle === 'left-aligned' && {
            textAlign: 'left',
            marginBottom: themeConfig.layout.headerSpacing || '32px',
            ...(themeConfig.layout.showHeaderBorder && {
              // borderBottom: `2px solid ${styles.section.dividerColor}`,
              paddingBottom: '20px',
            }),
          }),
          ...(themeConfig.layout.headerStyle === 'minimal' && {
            textAlign: 'left',
            marginBottom: themeConfig.layout.headerSpacing || '20px',
          }),
          ...(themeConfig.layout.headerStyle === 'creative' && {
            textAlign: 'center',
            marginBottom: themeConfig.layout.headerSpacing || '32px',
            background: `linear-gradient(135deg, ${styles.container.backgroundColor} 0%, ${styles.content.accentColor}20 100%)`,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${styles.content.accentColor}30`,
          }),
          ...(themeConfig.layout.headerStyle === 'split' && {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: themeConfig.layout.headerSpacing || '32px',
            ...(themeConfig.layout.showHeaderBorder && {
              // borderBottom: `2px solid ${styles.section.dividerColor}`,
              paddingBottom: '20px',
            }),
          }),
          background: printMode ? `linear-gradient(90deg, ${styles.container.backgroundColor} 0%, ${styles.container.backgroundColor} 100%)` : 'transparent',
          borderRadius: printMode ? '8px' : '0',
          padding: printMode ? '20px' : '0',
          '@media print': {
            background: `linear-gradient(90deg, ${styles.container.backgroundColor} 0%, ${styles.container.backgroundColor} 100%)`,
            borderRadius: '8px',
            padding: '20px',
          },
        }}>
          <Box sx={{
            ...(themeConfig.layout.headerStyle === 'split' && {
              flex: '1',
            }),
          }}>
            <Typography 
              variant="h4" 
              sx={{
                color: styles.header.nameColor,
                fontSize: styles.header.nameFontSize,
                fontWeight: styles.header.nameFontWeight,
                marginBottom: '8px',
                lineHeight: '1.2',
                pageBreakAfter: 'avoid',
                ...(themeConfig.layout.headerStyle === 'split' && {
                  textAlign: 'left',
                }),
              }}
            >
              {data.fullName}
            </Typography>
          </Box>
          
                    {/* Contact Information - Theme-specific layouts */}
          <Box sx={{
            ...(themeConfig.layout.headerStyle === 'split' && {
              flex: '1',
              textAlign: 'right',
            }),
          }}>
            {themeConfig.layout.contactLayout === 'inline' && (
              <Typography 
                variant="subtitle1" 
                sx={{
                  color: styles.header.contactColor,
                  fontSize: styles.header.contactFontSize,
                  lineHeight: '1.4',
                  pageBreakAfter: 'avoid',
                  ...(themeConfig.layout.headerStyle === 'split' && {
                    textAlign: 'right',
                  }),
                }}
              >
                {data.email} | {data.phone} | {data.website}
              </Typography>
            )}
            
            {themeConfig.layout.contactLayout === 'stacked' && (
              <Stack spacing={1} sx={{ 
                alignItems: themeConfig.layout.headerStyle === 'centered' ? 'center' : 
                          themeConfig.layout.headerStyle === 'split' ? 'flex-end' : 'flex-start' 
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: styles.header.contactColor,
                    fontSize: styles.header.contactFontSize,
                    lineHeight: '1.4',
                    pageBreakAfter: 'avoid',
                  }}
                >
                  {data.email}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: styles.header.contactColor,
                    fontSize: styles.header.contactFontSize,
                    lineHeight: '1.4',
                    pageBreakAfter: 'avoid',
                  }}
                >
                  {data.phone}
                </Typography>
                {data.website && (
                  <Typography 
                    variant="subtitle1" 
                    sx={{
                      color: styles.header.contactColor,
                      fontSize: styles.header.contactFontSize,
                      lineHeight: '1.4',
                      pageBreakAfter: 'avoid',
                    }}
                  >
                    {data.website}
                  </Typography>
                )}
              </Stack>
            )}
            
            {themeConfig.layout.contactLayout === 'grid' && (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 2,
                marginTop: '12px',
                ...(themeConfig.layout.headerStyle === 'split' && {
                  justifyContent: 'flex-end',
                }),
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: styles.header.contactColor,
                    fontSize: styles.header.contactFontSize,
                    lineHeight: '1.4',
                    pageBreakAfter: 'avoid',
                  }}
                >
                  📧 {data.email}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: styles.header.contactColor,
                    fontSize: styles.header.contactFontSize,
                    lineHeight: '1.4',
                    pageBreakAfter: 'avoid',
                  }}
                >
                  📱 {data.phone}
                </Typography>
                {data.website && (
                  <Typography 
                    variant="subtitle1" 
                    sx={{
                      color: styles.header.contactColor,
                      fontSize: styles.header.contactFontSize,
                      lineHeight: '1.4',
                      pageBreakAfter: 'avoid',
                    }}
                  >
                    🌐 {data.website}
                  </Typography>
                )}
              </Box>
            )}
            
            {(data.linkedin || data.github) && (
              <Typography 
                variant="body2" 
                sx={{
                  color: styles.header.contactColor,
                  fontSize: styles.header.contactFontSize,
                  marginTop: '4px',
                  pageBreakAfter: 'avoid',
                  ...(themeConfig.layout.headerStyle === 'split' && {
                    textAlign: 'right',
                  }),
                }}
              >
                {data.linkedin && `LinkedIn: ${data.linkedin}`}
                {data.linkedin && data.github && ' | '}
                {data.github && `GitHub: ${data.github}`}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Summary */}
        {data.summary && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginBottom: '25px',
            marginTop: '25px',
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{
                color: styles.section.titleColor,
                fontSize: styles.section.titleFontSize,
                fontWeight: styles.section.titleFontWeight,
                marginBottom: styles.section.titleMarginBottom,
                pageBreakAfter: 'avoid',
              }}
            >
              Summary
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: styles.content.primaryColor,
                fontSize: styles.content.fontSize,
                lineHeight: styles.content.lineHeight,
                pageBreakAfter: 'avoid',
              }}
            >
              {data.summary}
            </Typography>
          </Box>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginTop: '20px'
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{
                color: styles.section.titleColor,
                fontSize: styles.section.titleFontSize,
                fontWeight: styles.section.titleFontWeight,
                marginBottom: styles.section.titleMarginBottom,
                pageBreakAfter: 'avoid',
              }}
            >
              Experience
            </Typography>
            <Stack spacing={2}>
              {data.experience.map((exp, idx) => (
                <Box key={idx} sx={{ pageBreakInside: 'avoid' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{
                      color: styles.content.primaryColor,
                      fontSize: styles.content.fontSize,
                      fontWeight: '600',
                      marginBottom: '4px',
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-primary"
                  >
                    {exp.position} at {exp.company}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{
                      color: styles.content.secondaryColor,
                      fontSize: '0.8rem',
                      display: 'block',
                      marginBottom: '6px',
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-secondary"
                  >
                    {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                    {exp.location && ` | ${exp.location}`}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: styles.content.primaryColor,
                      fontSize: styles.content.fontSize,
                      lineHeight: styles.content.lineHeight,
                      marginBottom: '4px',
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-primary"
                  >
                    {exp.description}
                  </Typography>
                  {exp.technologies && (
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: styles.content.accentColor,
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                        pageBreakAfter: 'avoid',
                      }}
                      className="content-accent"
                    >
                      <strong>Technologies:</strong> {exp.technologies}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginTop: '20px'
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{
                color: styles.section.titleColor,
                fontSize: styles.section.titleFontSize,
                fontWeight: styles.section.titleFontWeight,
                marginBottom: styles.section.titleMarginBottom,
                pageBreakAfter: 'avoid',
              }}
            >
              Education
            </Typography>
            <Stack spacing={2}>
              {data.education.map((edu, idx) => (
                <Box key={idx} sx={{ pageBreakInside: 'avoid' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{
                      color: styles.content.primaryColor,
                      fontSize: styles.content.fontSize,
                      fontWeight: '600',
                      marginBottom: '4px',
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-primary"
                  >
                    {edu.degree}
                    {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`} – {edu.institution}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{
                      color: styles.content.secondaryColor,
                      fontSize: '0.8rem',
                      display: 'block',
                      marginBottom: '6px',
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-secondary"
                  >
                    {edu.startDate} – {edu.endDate}
                    {edu.location && ` | ${edu.location}`}
                    {edu.gpa && ` | GPA: ${edu.gpa}`}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: styles.content.primaryColor,
                      fontSize: styles.content.fontSize,
                      lineHeight: styles.content.lineHeight,
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-primary"
                  >
                    {edu.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginTop: '20px'
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{
                color: styles.section.titleColor,
                fontSize: styles.section.titleFontSize,
                fontWeight: styles.section.titleFontWeight,
                marginBottom: styles.section.titleMarginBottom,
                pageBreakAfter: 'avoid',
              }}
            >
              Skills
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {data.skills.map((skill, idx) => (
                <Chip 
                  key={idx} 
                  label={`${skill.name} (${skill.level}/5)`}
                  sx={{
                    backgroundColor: styles.chip.backgroundColor,
                    color: styles.chip.color,
                    borderColor: styles.chip.borderColor,
                    fontSize: '0.8rem',
                    height: '28px',
                    margin: '0',
                    '& .MuiChip-label': {
                      fontSize: '0.8rem',
                    },
                  }}
                  variant={styles.chip.borderColor ? "outlined" : "filled"}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginTop: '20px'
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{
                color: styles.section.titleColor,
                fontSize: styles.section.titleFontSize,
                fontWeight: styles.section.titleFontWeight,
                marginBottom: styles.section.titleMarginBottom,
                pageBreakAfter: 'avoid',
              }}
            >
              Languages
            </Typography>
            <Stack spacing={1}>
              {data.languages.map((lang, idx) => (
                <Typography 
                  key={idx} 
                  variant="body2" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    lineHeight: styles.content.lineHeight,
                    pageBreakAfter: 'avoid',
                  }}
                >
                  <strong>{lang.name}</strong> – {lang.proficiency}
                </Typography>
              ))}
            </Stack>
          </Box>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginTop: '20px'
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{
                color: styles.section.titleColor,
                fontSize: styles.section.titleFontSize,
                fontWeight: styles.section.titleFontWeight,
                marginBottom: styles.section.titleMarginBottom,
                pageBreakAfter: 'avoid',
              }}
            >
              Certifications
            </Typography>
            <Stack spacing={1}>
              {data.certifications.map((cert, idx) => (
                <Box key={idx} sx={{ pageBreakInside: 'avoid' }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{
                      color: styles.content.primaryColor,
                      fontSize: styles.content.fontSize,
                      fontWeight: '600',
                      marginBottom: '2px',
                      pageBreakAfter: 'avoid',
                    }}
                  >
                    {cert.name}
                  </Typography>
                  {cert.issuer && (
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: styles.content.secondaryColor,
                        fontSize: '0.8rem',
                        display: 'block',
                        marginBottom: '2px',
                        pageBreakAfter: 'avoid',
                      }}
                    >
                      {cert.issuer}
                    </Typography>
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: styles.content.secondaryColor,
                      fontSize: '0.85rem',
                      pageBreakAfter: 'avoid',
                    }}
                  >
                    {cert.issueDate}
                    {cert.expiryDate && ` – ${cert.expiryDate}`}
                    {cert.credentialID && ` | ID: ${cert.credentialID}`}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginTop: '20px'
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{
                color: styles.section.titleColor,
                fontSize: styles.section.titleFontSize,
                fontWeight: styles.section.titleFontWeight,
                marginBottom: styles.section.titleMarginBottom,
                pageBreakAfter: 'avoid',
              }}
            >
              Projects
            </Typography>
            <Stack spacing={2}>
              {data.projects.map((proj, idx) => (
                <Box key={idx} sx={{ pageBreakInside: 'avoid' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{
                      color: styles.content.primaryColor,
                      fontSize: styles.content.fontSize,
                      fontWeight: '600',
                      marginBottom: '4px',
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-primary"
                  >
                    {proj.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: styles.content.primaryColor,
                      fontSize: styles.content.fontSize,
                      lineHeight: styles.content.lineHeight,
                      marginBottom: '4px',
                      pageBreakAfter: 'avoid',
                    }}
                    className="content-primary"
                  >
                    {proj.description}
                  </Typography>
                  {proj.technologies && (
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: styles.content.accentColor,
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                        marginBottom: '4px',
                        pageBreakAfter: 'avoid',
                      }}
                      className="content-accent"
                    >
                      <strong>Tech:</strong> {proj.technologies}
                    </Typography>
                  )}
                  {(proj.url || proj.github) && (
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: styles.content.secondaryColor,
                        fontSize: '0.8rem',
                        pageBreakAfter: 'avoid',
                      }}
                      className="content-secondary"
                    >
                      {proj.url && `Live: ${proj.url}`}
                      {proj.url && proj.github && ' | '}
                      {proj.github && `GitHub: ${proj.github}`}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Other Sections */}
        {(data.awards || data.interests || data.references) && (
          <Box sx={{ 
            pageBreakAfter: 'auto',
            marginTop: '20px'
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: styles.section.dividerMargin,
              }} 
            />
            {data.awards && (
              <Box sx={{ pageBreakAfter: 'auto' }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    color: styles.section.titleColor,
                    fontSize: styles.section.titleFontSize,
                    fontWeight: styles.section.titleFontWeight,
                    marginBottom: styles.section.titleMarginBottom,
                    pageBreakAfter: 'avoid',
                  }}
                >
                  Awards
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    lineHeight: styles.content.lineHeight,
                    marginBottom: '16px',
                    pageBreakAfter: 'avoid',
                  }}
                >
                  {data.awards}
                </Typography>
              </Box>
            )}
            {data.interests && (
              <Box sx={{ pageBreakAfter: 'auto' }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    color: styles.section.titleColor,
                    fontSize: styles.section.titleFontSize,
                    fontWeight: styles.section.titleFontWeight,
                    marginBottom: styles.section.titleMarginBottom,
                    pageBreakAfter: 'avoid',
                  }}
                >
                  Interests
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    lineHeight: styles.content.lineHeight,
                    marginBottom: '16px',
                    pageBreakAfter: 'avoid',
                  }}
                >
                  {data.interests}
                </Typography>
              </Box>
            )}
            {data.references && (
              <Box sx={{ pageBreakAfter: 'auto' }}>
                <Typography 
                  variant="h6" 
                  sx={{
                    color: styles.section.titleColor,
                    fontSize: styles.section.titleFontSize,
                    fontWeight: styles.section.titleFontWeight,
                    marginBottom: styles.section.titleMarginBottom,
                    pageBreakAfter: 'avoid',
                  }}
                >
                  References
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    lineHeight: styles.content.lineHeight,
                    pageBreakAfter: 'avoid',
                  }}
                >
                  {data.references}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* CVilo Advertisement - Print Only Footer */}
        {printMode && (
          <Box sx={{ 
            marginTop: '16px',
            pageBreakAfter: 'avoid',
            textAlign: 'center',
            opacity: '0.7',
            position: 'relative',
            '@media print': {
              position: 'fixed',
              bottom: '10mm',
              left: '0',
              right: '0',
              textAlign: 'center',
            },
          }}>
            <Divider 
              sx={{ 
                borderColor: styles.section.dividerColor,
                margin: '8px 0',
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{
                color: styles.content.secondaryColor,
                fontSize: '0.7rem',
                fontStyle: 'italic',
                lineHeight: '1.4',
                pageBreakAfter: 'avoid',
              }}
            >
              Created with{' '}
              <span style={{ 
                color: styles.content.accentColor || styles.section.titleColor,
                fontWeight: '600',
              }}>
                CVilo
              </span>
              {' '}• Professional Resume Builder
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ResumePreview;