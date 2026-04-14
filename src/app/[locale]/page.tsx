import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SearchBar from '@/components/SearchBar';
import Navbar from '@/components/Navbar';

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('HomePage');

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fc' }}>
      <Navbar />

      {/* Hero Section — full viewport centered */}
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, transparent 70%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233, 69, 96, 0.1) 0%, transparent 70%)',
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#fff',
                mb: 2,
                fontSize: { xs: '2rem', md: '3.5rem' },
                letterSpacing: '-0.02em',
              }}
            >
              {t('title')}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 300,
                mb: 6,
                fontSize: { xs: '1rem', md: '1.25rem' },
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              {t('subtitle')}
            </Typography>
          </Box>

          {/* Search Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SearchBar />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
