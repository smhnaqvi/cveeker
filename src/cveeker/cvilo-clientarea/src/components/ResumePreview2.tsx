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
            background-color: ${styles.container.backgroundColor} !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, [printMode]);

  return (
    <Box
      data-theme={theme}
      className="resume-preview"
      sx={{
        background: styles.container.backgroundColor,
        color: styles.container.color,
        fontFamily: styles.container.fontFamily,
        padding: styles.container.padding,
        fontSize: styles.content.fontSize,
        lineHeight: styles.content.lineHeight,
        minHeight: '297mm', // A4 height
        width: '210mm', // A4 width
        margin: '0 auto',
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
          minHeight: '297mm',
          width: '210mm',
          background: styles.container.backgroundColor,
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
      {/* Header */}
      <Box sx={{ 
        pageBreakAfter: 'auto',
        pageBreakBefore: 'auto', // Don't force page break for header
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
          }}
        >
          {data.fullName}
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
          {data.email} | {data.phone} | {data.website}
        </Typography>
        {(data.linkedin || data.github) && (
          <Typography 
            variant="body2" 
            sx={{
              color: styles.header.contactColor,
              fontSize: styles.header.contactFontSize,
              marginTop: '4px',
              pageBreakAfter: 'avoid',
            }}
          >
            {data.linkedin && `LinkedIn: ${data.linkedin}`}
            {data.linkedin && data.github && ' | '}
            {data.github && `GitHub: ${data.github}`}
          </Typography>
        )}
      </Box>

      {/* Summary */}
      {data.summary && (
        <Box sx={{ 
          pageBreakAfter: 'auto',
          pageBreakBefore: 'always',
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
          pageBreakBefore: 'always',
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
          pageBreakBefore: 'always',
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
          pageBreakBefore: 'always',
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
          pageBreakBefore: 'always',
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
          pageBreakBefore: 'always',
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
          pageBreakBefore: 'always',
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
          pageBreakBefore: 'always',
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
  );
};

export default ResumePreview;