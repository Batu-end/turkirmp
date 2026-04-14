import { use } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Navbar from '@/components/Navbar';
import ReviewForm from '@/components/ReviewForm';
import { getProfessorBySlug, getReviewsByProfessor } from '@/lib/queries';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const professor = await getProfessorBySlug(slug);

  if (!professor) {
    return { title: 'Not Found' };
  }

  const fullName = `${professor.title ? professor.title + ' ' : ''}${professor.first_name} ${professor.last_name}`;

  return {
    title:
      locale === 'tr'
        ? `${fullName} - Hoca Değerlendirmesi | HocamıDeğerlendir`
        : `${fullName} - Professor Reviews | HocamıDeğerlendir`,
    description:
      locale === 'tr'
        ? `${fullName} hakkında ${professor.total_reviews} değerlendirme. ${professor.university?.name} - ${professor.department}`
        : `${professor.total_reviews} reviews for ${fullName}. ${professor.university?.name} - ${professor.department}`,
  };
}

export default function ProfessorPage({ params }: Props) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('ProfessorProfile');
  const tCommon = useTranslations('Common');

  const professor = use(getProfessorBySlug(slug));

  if (!professor) {
    notFound();
  }

  const reviews = use(getReviewsByProfessor(professor.id));

  const fullName = `${professor.title ? professor.title + ' ' : ''}${professor.first_name} ${professor.last_name}`;

  const getRatingBg = (rating: number) => {
    if (rating >= 4) return 'linear-gradient(135deg, #2ecc71, #27ae60)';
    if (rating >= 3) return 'linear-gradient(135deg, #f39c12, #e67e22)';
    return 'linear-gradient(135deg, #e74c3c, #c0392b)';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f8f9fc' }}>
      <Navbar />

      {/* Professor Header */}
      <Box
        sx={{
          background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
          py: { xs: 4, md: 6 },
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
            <Button
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 3,
                '&:hover': { color: '#fff' },
              }}
            >
              ← {t('back')}
            </Button>
          </a>

          <Grid container spacing={4} alignItems="center">
            {/* Big rating badge */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' } }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: getRatingBg(Number(professor.overall_rating)),
                    color: '#fff',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{ fontWeight: 800, lineHeight: 1 }}
                  >
                    {Number(professor.overall_rating).toFixed(1)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontWeight: 500 }}
                  >
                    {tCommon('outOf5')}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Professor Info */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#fff',
                  mb: 1,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                {fullName}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  label={`🏫 ${professor.university?.name}`}
                  sx={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip
                  label={professor.department}
                  sx={{
                    background: 'rgba(233, 69, 96, 0.2)',
                    color: '#fff',
                    fontWeight: 500,
                  }}
                />
              </Box>

              {/* Stats row */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#fff' }}
                  >
                    {professor.total_reviews}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {t('totalReviews')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#fff' }}
                  >
                    {Number(professor.would_take_again_pct).toFixed(0)}%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {t('wouldTakeAgain')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: '#fff' }}
                  >
                    {Number(professor.average_difficulty).toFixed(1)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {t('difficulty')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Reviews Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Reviews list */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}
            >
              {t('reviews')} ({reviews.length})
            </Typography>

            {reviews.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                  border: '1px solid rgba(26, 26, 46, 0.08)',
                }}
              >
                <Typography sx={{ color: '#4a4a6a' }}>
                  {t('noReviews')}
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {reviews.map((review) => (
                  <Paper
                    key={review.id}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid rgba(26, 26, 46, 0.06)',
                      transition: 'border-color 0.2s ease',
                      '&:hover': {
                        borderColor: 'rgba(233, 69, 96, 0.2)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {/* Rating badge */}
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#fff',
                          background: getRatingBg(review.rating),
                          flexShrink: 0,
                        }}
                      >
                        {review.rating}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                            flexWrap: 'wrap',
                          }}
                        >
                          {review.course_code && (
                            <Chip
                              label={review.course_code}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                background: 'rgba(26, 26, 46, 0.06)',
                                fontSize: '0.75rem',
                              }}
                            />
                          )}
                          <Chip
                            label={`${t('difficulty')}: ${review.difficulty}/5`}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.75rem',
                              background:
                                review.difficulty >= 4
                                  ? 'rgba(231, 76, 60, 0.1)'
                                  : 'rgba(46, 204, 113, 0.1)',
                              color:
                                review.difficulty >= 4 ? '#e74c3c' : '#27ae60',
                            }}
                          />
                          {review.would_take_again !== null && (
                            <Chip
                              label={
                                review.would_take_again
                                  ? `👍 ${locale === 'tr' ? 'Tekrar alırım' : 'Would take again'}`
                                  : `👎 ${locale === 'tr' ? 'Tekrar almam' : "Wouldn't take again"}`
                              }
                              size="small"
                              sx={{
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                background: review.would_take_again
                                  ? 'rgba(46, 204, 113, 0.1)'
                                  : 'rgba(231, 76, 60, 0.1)',
                                color: review.would_take_again
                                  ? '#27ae60'
                                  : '#e74c3c',
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{ color: '#999' }}
                        >
                          {formatDate(review.created_at)}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        color: '#333',
                        lineHeight: 1.7,
                      }}
                    >
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Grid>

          {/* Review Form */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              <ReviewForm professorId={professor.id} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
