import { use } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Navbar from '@/components/Navbar';
import { getUniversityBySlug, getProfessorsByUniversity } from '@/lib/queries';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const university = await getUniversityBySlug(slug);

  if (!university) return { title: 'Not Found' };

  return {
    title:
      locale === 'tr'
        ? `${university.name} Hocaları | HocamıDeğerlendir`
        : `${university.name} Professors | HocamıDeğerlendir`,
    description:
      locale === 'tr'
        ? `${university.name} üniversitesindeki hocaları değerlendirin ve yorumları okuyun.`
        : `Rate and review professors at ${university.name}.`,
  };
}

export default function UniversityPage({ params }: Props) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('UniversityPage');

  const university = use(getUniversityBySlug(slug));

  if (!university) {
    notFound();
  }

  const professors = use(getProfessorsByUniversity(university.id));

  const getRatingBg = (rating: number) => {
    if (rating >= 4) return 'linear-gradient(135deg, #2ecc71, #27ae60)';
    if (rating >= 3) return 'linear-gradient(135deg, #f39c12, #e67e22)';
    return 'linear-gradient(135deg, #e74c3c, #c0392b)';
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fc' }}>
      <Navbar />

      {/* University Header */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          py: { xs: 5, md: 7 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(233, 69, 96, 0.12) 0%, transparent 70%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <a href={`/${locale}`} style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.6)',
                mb: 2,
                fontSize: '0.9rem',
                '&:hover': { color: '#fff' },
                transition: 'color 0.2s',
                cursor: 'pointer',
              }}
            >
              ← {t('backHome')}
            </Typography>
          </a>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#fff',
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.8rem' },
            }}
          >
            {university.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Chip
              label={`📍 ${university.city}`}
              sx={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
              }}
            />
            <Chip
              label={`👨‍🏫 ${professors.length} ${t('professorCount')}`}
              sx={{
                background: 'rgba(233, 69, 96, 0.2)',
                color: '#fff',
                fontWeight: 500,
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Professors List */}
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}
        >
          {t('professors')}
        </Typography>

        {professors.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: '#4a4a6a',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('noProfessors')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {professors.map((prof) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={prof.id}>
                <a
                  href={`/${locale}/hoca/${prof.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      border: '1px solid rgba(26, 26, 46, 0.06)',
                      cursor: 'pointer',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        {/* Rating badge */}
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.3rem',
                            color: '#fff',
                            background: getRatingBg(Number(prof.overall_rating)),
                            flexShrink: 0,
                          }}
                        >
                          {Number(prof.overall_rating).toFixed(1)}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              color: '#1a1a2e',
                              lineHeight: 1.2,
                              mb: 0.5,
                            }}
                          >
                            {prof.title ? `${prof.title} ` : ''}
                            {prof.first_name} {prof.last_name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4a4a6a' }}>
                            {prof.department}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${prof.total_reviews} ${t('reviews')}`}
                          size="small"
                          sx={{
                            background: 'rgba(233, 69, 96, 0.08)',
                            color: '#e94560',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        />
                        {Number(prof.would_take_again_pct) > 0 && (
                          <Chip
                            label={`👍 ${Number(prof.would_take_again_pct).toFixed(0)}%`}
                            size="small"
                            sx={{
                              background: 'rgba(46, 204, 113, 0.08)',
                              color: '#27ae60',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                            }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </a>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
