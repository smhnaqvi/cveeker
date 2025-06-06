import { Box, Typography } from "@mui/material"

const Logo = () => {
    return   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
              CV
            </Typography>
          </Box>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            CVilo
          </Typography>
        </Box>
}

export default Logo