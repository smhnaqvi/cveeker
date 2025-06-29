import React from "react";
import { Box, Typography, Divider, Stack, Chip } from "@mui/material";
import type { ResumeFormValues } from "../pages/dashboard/resume/components/ResumeForm";
import { getThemeById, getDefaultTheme, type ResumeTheme } from "../lib/theme/resumeThemes";

type Props = {
  data: ResumeFormValues;
  theme?: string;
};

const ResumePreview: React.FC<Props> = ({ data, theme = 'modern-blue' }) => {
  // Get theme configuration
  const themeConfig: ResumeTheme = getThemeById(theme) || getDefaultTheme();
  const styles = themeConfig.styles;

  return (
    <Box
      sx={{
        background: styles.container.backgroundColor,
        color: styles.container.color,
        fontFamily: styles.container.fontFamily,
        padding: styles.container.padding,
        borderRadius: styles.container.borderRadius,
        boxShadow: styles.container.boxShadow,
        fontSize: styles.content.fontSize,
        lineHeight: styles.content.lineHeight,
        minHeight: '100%',
        '& *': {
          fontFamily: styles.container.fontFamily,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ marginBottom: '24px' }}>
        <Typography 
          variant="h4" 
          sx={{
            color: styles.header.nameColor,
            fontSize: styles.header.nameFontSize,
            fontWeight: styles.header.nameFontWeight,
            marginBottom: '8px',
            lineHeight: '1.2',
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
        <>
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
            }}
          >
            {data.summary}
          </Typography>
        </>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <>
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
            }}
          >
            Experience
          </Typography>
          <Stack spacing={2}>
            {data.experience.map((exp, idx) => (
              <Box key={idx}>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  {exp.position} at {exp.company}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: styles.content.secondaryColor,
                    fontSize: '0.8rem',
                    display: 'block',
                    marginBottom: '8px',
                  }}
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
                  }}
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
                    }}
                  >
                    <strong>Technologies:</strong> {exp.technologies}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <>
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
            }}
          >
            Education
          </Typography>
          <Stack spacing={2}>
            {data.education.map((edu, idx) => (
              <Box key={idx}>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
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
                    marginBottom: '8px',
                  }}
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
                  }}
                >
                  {edu.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <>
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
                  '& .MuiChip-label': {
                    fontSize: '0.8rem',
                  },
                }}
                variant={styles.chip.borderColor ? "outlined" : "filled"}
              />
            ))}
          </Stack>
        </>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <>
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
                }}
              >
                <strong>{lang.name}</strong> – {lang.proficiency}
              </Typography>
            ))}
          </Stack>
        </>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <>
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
            }}
          >
            Certifications
          </Typography>
          <Stack spacing={1}>
            {data.certifications.map((cert, idx) => (
              <Box key={idx}>
                <Typography 
                  variant="subtitle2" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    fontWeight: '600',
                    marginBottom: '2px',
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
                  }}
                >
                  {cert.issueDate}
                  {cert.expiryDate && ` – ${cert.expiryDate}`}
                  {cert.credentialID && ` | ID: ${cert.credentialID}`}
                </Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <>
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
            }}
          >
            Projects
          </Typography>
          <Stack spacing={2}>
            {data.projects.map((proj, idx) => (
              <Box key={idx}>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: styles.content.primaryColor,
                    fontSize: styles.content.fontSize,
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
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
                  }}
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
                    }}
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
                    }}
                  >
                    {proj.url && `Live: ${proj.url}`}
                    {proj.url && proj.github && ' | '}
                    {proj.github && `GitHub: ${proj.github}`}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Other Sections */}
      {(data.awards || data.interests || data.references) && (
        <>
          <Divider 
            sx={{ 
              borderColor: styles.section.dividerColor,
              margin: styles.section.dividerMargin,
            }} 
          />
          {data.awards && (
            <>
              <Typography 
                variant="h6" 
                sx={{
                  color: styles.section.titleColor,
                  fontSize: styles.section.titleFontSize,
                  fontWeight: styles.section.titleFontWeight,
                  marginBottom: styles.section.titleMarginBottom,
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
                }}
              >
                {data.awards}
              </Typography>
            </>
          )}
          {data.interests && (
            <>
              <Typography 
                variant="h6" 
                sx={{
                  color: styles.section.titleColor,
                  fontSize: styles.section.titleFontSize,
                  fontWeight: styles.section.titleFontWeight,
                  marginBottom: styles.section.titleMarginBottom,
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
                }}
              >
                {data.interests}
              </Typography>
            </>
          )}
          {data.references && (
            <>
              <Typography 
                variant="h6" 
                sx={{
                  color: styles.section.titleColor,
                  fontSize: styles.section.titleFontSize,
                  fontWeight: styles.section.titleFontWeight,
                  marginBottom: styles.section.titleMarginBottom,
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
                }}
              >
                {data.references}
              </Typography>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ResumePreview;