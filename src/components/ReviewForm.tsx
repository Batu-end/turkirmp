// The form for submitting a review on a professor’s page.

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { submitReviewAction } from '@/app/actions';

interface ReviewFormProps {
  professorId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ professorId, onSuccess }: ReviewFormProps) {
  const t = useTranslations('ProfessorProfile');
  const [rating, setRating] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [courseCode, setCourseCode] = useState('');
  const [comment, setComment] = useState('');
  const [wouldTakeAgain, setWouldTakeAgain] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !difficulty || !comment.trim()) return;

    setSubmitting(true);
    setMessage(null);

    const result = await submitReviewAction({
      professor_id: professorId,
      rating,
      difficulty,
      course_code: courseCode || undefined,
      comment: comment.trim(),
      would_take_again:
        wouldTakeAgain === 'yes' ? true : wouldTakeAgain === 'no' ? false : undefined,
    });

    setSubmitting(false);

    if (result.success) {
      setMessage({ type: 'success', text: t('reviewSuccess') });
      setRating(null);
      setDifficulty(null);
      setCourseCode('');
      setComment('');
      setWouldTakeAgain(null);
      onSuccess?.();
    } else {
      setMessage({ type: 'error', text: result.error || t('reviewError') });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        border: '1px solid rgba(26, 26, 46, 0.08)',
        background: 'linear-gradient(135deg, rgba(248,249,252,1) 0%, rgba(255,255,255,1) 100%)',
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: '#1a1a2e', mb: 3 }}
      >
        ✍️ {t('writeReview')}
      </Typography>

      <Collapse in={!!message}>
        {message && (
          <Alert
            severity={message.type}
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}
      </Collapse>

      <Box component="form" onSubmit={handleSubmit}>
        {/* Rating */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: '#4a4a6a', mb: 1 }}
          >
            {t('ratingLabel')} *
          </Typography>
          <Rating
            value={rating}
            onChange={(_, value) => setRating(value)}
            size="large"
            sx={{
              '& .MuiRating-iconFilled': { color: '#e94560' },
            }}
          />
        </Box>

        {/* Difficulty */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: '#4a4a6a', mb: 1 }}
          >
            {t('difficultyLabel')} *
          </Typography>
          <Rating
            value={difficulty}
            onChange={(_, value) => setDifficulty(value)}
            size="large"
            sx={{
              '& .MuiRating-iconFilled': { color: '#f39c12' },
            }}
          />
        </Box>

        {/* Would Take Again */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: '#4a4a6a', mb: 1 }}
          >
            {t('wouldTakeAgainLabel')}
          </Typography>
          <ToggleButtonGroup
            value={wouldTakeAgain}
            exclusive
            onChange={(_, value) => setWouldTakeAgain(value)}
            size="small"
          >
            <ToggleButton
              value="yes"
              sx={{
                px: 3,
                borderRadius: '8px !important',
                '&.Mui-selected': {
                  background: '#2ecc71',
                  color: '#fff',
                  '&:hover': { background: '#27ae60' },
                },
              }}
            >
              👍 {t('yes')}
            </ToggleButton>
            <ToggleButton
              value="no"
              sx={{
                px: 3,
                borderRadius: '8px !important',
                '&.Mui-selected': {
                  background: '#e74c3c',
                  color: '#fff',
                  '&:hover': { background: '#c0392b' },
                },
              }}
            >
              👎 {t('no')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Course Code */}
        <TextField
          label={t('courseCode')}
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          placeholder="CMPE250"
        />

        {/* Comment */}
        <TextField
          label={t('commentPlaceholder')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          multiline
          rows={4}
          required
          sx={{ mb: 3 }}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={!rating || !difficulty || !comment.trim() || submitting}
          sx={{
            background: 'linear-gradient(135deg, #e94560 0%, #1a1a2e 100%)',
            py: 1.5,
            px: 4,
            fontSize: '1rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #ff6b81 0%, #2d2d5e 100%)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: '#ccc',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {submitting ? '...' : `📤 ${t('submitReview')}`}
        </Button>
      </Box>
    </Paper>
  );
}
