import React from "react";
import { Box, Typography, Divider, Stack, Chip } from "@mui/material";
import type { ResumeFormValues } from "../pages/dashboard/resume/components/ResumeForm";

type Props = {
  data: ResumeFormValues;
  theme?: string;
};

const ResumePreview: React.FC<Props> = ({ data, theme }) => {
  return (
    <Box
      sx={{
        p: 4,
        bgcolor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#eee" : "#000",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        {data.fullName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {data.email} | {data.phone} | {data.website}
      </Typography>

      {/* Summary */}
      {data.summary && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Summary</Typography>
          <Typography variant="body2">{data.summary}</Typography>
        </>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Experience</Typography>
          <Stack spacing={2}>
            {data.experience.map((exp, idx) => (
              <Box key={idx}>
                <Typography variant="subtitle1">
                  {exp.position} at {exp.company}
                </Typography>
                <Typography variant="caption">
                  {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                </Typography>
                <Typography variant="body2">{exp.description}</Typography>
                {exp.technologies && (
                  <Typography variant="body2">
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
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Education</Typography>
          <Stack spacing={2}>
            {data.education.map((edu, idx) => (
              <Box key={idx}>
                <Typography variant="subtitle1">
                  {edu.degree}
                  {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`} – {edu.institution}
                </Typography>
                <Typography variant="caption">
                  {edu.startDate} – {edu.endDate}
                </Typography>
                <Typography variant="body2">{edu.description}</Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Skills</Typography>
          <Stack direction="row" flexWrap="wrap" spacing={1}>
            {data.skills.map((skill, idx) => (
              <Chip key={idx} label={`${skill.name} (${skill.level}/5)`} />
            ))}
          </Stack>
        </>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Languages</Typography>
          <Stack spacing={1}>
            {data.languages.map((lang, idx) => (
              <Typography key={idx} variant="body2">
                {lang.name} – {lang.proficiency}
              </Typography>
            ))}
          </Stack>
        </>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Certifications</Typography>
          <Stack spacing={1}>
            {data.certifications.map((cert, idx) => (
              <Box key={idx}>
                <Typography variant="subtitle2">{cert.name}</Typography>
                {cert.issuer && <Typography variant="caption">{cert.issuer}</Typography>}
                <Typography variant="body2">
                  {cert.issueDate}
                  {cert.expiryDate && ` – ${cert.expiryDate}`}
                </Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Projects</Typography>
          <Stack spacing={2}>
            {data.projects.map((proj, idx) => (
              <Box key={idx}>
                <Typography variant="subtitle1">{proj.name}</Typography>
                <Typography variant="body2">{proj.description}</Typography>
                {proj.technologies && (
                  <Typography variant="body2">
                    <strong>Tech:</strong> {proj.technologies}
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
          <Divider sx={{ my: 2 }} />
          {data.awards && (
            <>
              <Typography variant="h6">Awards</Typography>
              <Typography variant="body2">{data.awards}</Typography>
            </>
          )}
          {data.interests && (
            <>
              <Typography variant="h6">Interests</Typography>
              <Typography variant="body2">{data.interests}</Typography>
            </>
          )}
          {data.references && (
            <>
              <Typography variant="h6">References</Typography>
              <Typography variant="body2">{data.references}</Typography>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ResumePreview;