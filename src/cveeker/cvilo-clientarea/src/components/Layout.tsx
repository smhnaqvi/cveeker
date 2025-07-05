import React, { useState } from 'react'
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Settings as SettingsIcon,
  ExitToApp,
  Person,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useAuthStore } from '../stores'
import ResumeSidebar from './ResumeSidebar'

const drawerWidth = 280
const sidebarWidth = 320

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
    handleProfileMenuClose()
  }

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'My Resumes', icon: <DescriptionIcon />, path: '/dashboard/resume/list' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ]

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #30363d' }}>
        <Logo />
      </Box>
      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} sx={{ p: 0, mb: 1 }}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(16, 163, 127, 0.1)',
                    color: '#10a37f',
                    '&:hover': {
                      backgroundColor: 'rgba(16, 163, 127, 0.15)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#10a37f',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', width: '100%', bgcolor: '#0d1117' }}>
      {/* Resume Sidebar (left, always visible) */}
      <Box
        sx={{
          width: { xs: 0, sm: sidebarWidth },
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          bgcolor: '#0d1117',
          borderRight: '1px solid #30363d',
          height: '100vh',
          position: 'fixed',
          zIndex: 1201,
        }}
      >
        <ResumeSidebar />
      </Box>

      {/* Main Navigation Drawer (right of sidebar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${sidebarWidth}px)` },
          ml: { sm: `${sidebarWidth}px` },
          backgroundColor: '#161b22',
          color: '#f0f6fc',
          borderBottom: '1px solid #30363d',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                }
              }}
            >
              <Avatar sx={{ width: 36, height: 36, bgcolor: '#10a37f', fontSize: '0.875rem', fontWeight: 600 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.3))',
            mt: 1.5,
            bgcolor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: 2,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '& .MuiMenuItem-root': {
              color: '#f0f6fc',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.04)',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <ListItemIcon>
            <Person fontSize="small" sx={{ color: '#8b949e' }} />
          </ListItemIcon>
          {user?.name || 'Profile'}
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" sx={{ color: '#8b949e' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ flexShrink: { sm: 0 }, ml: { sm: `${sidebarWidth}px` } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#0d1117',
              borderRight: '1px solid #30363d',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              bgcolor: '#0d1117',
              borderRight: '1px solid #30363d',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${sidebarWidth + drawerWidth}px)` },
          mt: { xs: 8, sm: 8 },
          bgcolor: '#0d1117',
          minHeight: '100vh',
          // ml: { sm: `${sidebarWidth + drawerWidth}px` },
        }}
      >
        {children}
      </Box>
    </Box>
  )
} 