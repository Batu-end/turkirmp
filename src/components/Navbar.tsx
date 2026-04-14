'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';

export default function Navbar() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === 'tr' ? 'en' : 'tr';
    // Replace the locale segment in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

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
            <Button
              onClick={switchLocale}
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'rgba(26, 26, 46, 0.2)',
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '0.8rem',
                minWidth: 'auto',
                px: 2,
                '&:hover': {
                  borderColor: '#e94560',
                  color: '#e94560',
                },
              }}
            >
              {t('language')}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
