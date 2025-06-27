
import React from 'react';
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material';

type Template = { id: string; name: string; thumbnail: string; };

const templates: Template[] = [
  { id: 'light', name: 'Light', thumbnail: '/images/templates/light.png' },
  { id: 'dark', name: 'Dark', thumbnail: '/images/templates/dark.png' },
  { id: 'modern', name: 'Modern', thumbnail: '/images/templates/modern.png' },
  { id: 'classic', name: 'Classic', thumbnail: '/images/templates/classic.png' },
];

type Props = {
  selected: string;
  onSelect: (id: string) => void;
};

const TemplateSelector: React.FC<Props> = ({ selected, onSelect }) => (
  <Box display="flex" flexWrap="wrap" gap={2}>
    {templates.map((tpl) => (
      <Card
        key={tpl.id}
        variant={selected === tpl.id ? 'outlined' : 'elevation'}
        sx={{ borderColor: selected === tpl.id ? 'primary.main' : undefined }}
      >
        <CardActionArea onClick={() => onSelect(tpl.id)}>
          <CardContent>
            <Typography align="center">{tpl.name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    ))}
  </Box>
);

export default TemplateSelector;