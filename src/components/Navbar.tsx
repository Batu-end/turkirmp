'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function Navbar() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();



  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(26, 26, 46, 0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box
            onClick={() => router.push(`/${locale}`)}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              {t('appName')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              onClick={() => router.push(`/${locale}`)}
              sx={{ color: 'text.secondary', fontWeight: 500 }}
            >
              {t('home')}
            </Button>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(26, 26, 46, 0.15)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                component="button"
                onClick={() => {
                  if (locale !== 'tr') {
                    const segments = pathname.split('/');
                    segments[1] = 'tr';
                    router.push(segments.join('/'));
                  }
                }}
                sx={{
                  border: 'none',
                  cursor: locale === 'tr' ? 'default' : 'pointer',
                  px: 1.5,
                  py: 0.6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  background: locale === 'tr' ? '#e94560' : 'transparent',
                  color: locale === 'tr' ? '#fff' : '#4a4a6a',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: locale === 'tr' ? '#e94560' : 'rgba(233, 69, 96, 0.08)',
                  },
                }}
              >
                Türkçe
              </Box>
              <Box
                sx={{
                  width: '1px',
                  height: 20,
                  background: 'rgba(26, 26, 46, 0.15)',
                }}
              />
              <Box
                component="button"
                onClick={() => {
                  if (locale !== 'en') {
                    const segments = pathname.split('/');
                    segments[1] = 'en';
                    router.push(segments.join('/'));
                  }
                }}
                sx={{
                  border: 'none',
                  cursor: locale === 'en' ? 'default' : 'pointer',
                  px: 1.5,
                  py: 0.6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  background: locale === 'en' ? '#e94560' : 'transparent',
                  color: locale === 'en' ? '#fff' : '#4a4a6a',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: locale === 'en' ? '#e94560' : 'rgba(233, 69, 96, 0.08)',
                  },
                }}
              >
                English
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
