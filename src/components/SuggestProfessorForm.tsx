'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import { submitProfessorSuggestionAction } from '@/app/actions';

interface Props {
  universityId: string;
}

export default function SuggestProfessorForm({ universityId }: Props) {
  const t = useTranslations('UniversityPage');
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const result = await submitProfessorSuggestionAction({
      university_id: universityId,
      first_name: firstName,
      last_name: lastName,
      department,
      title: title || undefined,
    });

    setSubmitting(false);

    if (result.success) {
      setMessage({ type: 'success', text: t('suggestSuccess') });
      setFirstName('');
      setLastName('');
      setDepartment('');
      setTitle('');
      setOpen(false);
    } else {
      setMessage({ type: 'error', text: result.error || t('suggestError') });
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      {/* Persistent success message shown after form closes */}
      <Collapse in={!!message && !open}>
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

      {!open ? (
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => { setOpen(true); setMessage(null); }}
            sx={{
              borderColor: 'rgba(233, 69, 96, 0.4)',
              color: '#e94560',
              borderRadius: 3,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#e94560',
                background: 'rgba(233, 69, 96, 0.04)',
              },
            }}
          >
            + {t('suggestButton')}
          </Button>
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid rgba(233, 69, 96, 0.2)',
            background: 'linear-gradient(135deg, rgba(248,249,252,1) 0%, rgba(255,255,255,1) 100%)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
            {t('suggestTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4a4a6a', mb: 3 }}>
            {t('suggestSubtitle')}
          </Typography>

          <Collapse in={!!message}>
            {message && (
              <Alert severity={message.type} sx={{ mb: 3, borderRadius: 2 }} onClose={() => setMessage(null)}>
                {message.text}
              </Alert>
            )}
          </Collapse>

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label={t('firstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label={t('lastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
              />
            </Box>

            <TextField
              label={t('department')}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label={t('titleLabel')}
              placeholder={t('titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!firstName.trim() || !lastName.trim() || !department.trim() || submitting}
                sx={{
                  background: 'linear-gradient(135deg, #e94560 0%, #1a1a2e 100%)',
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #ff6b81 0%, #2d2d5e 100%)',
                  },
                  '&:disabled': { background: '#ccc' },
                }}
              >
                {submitting ? '...' : t('suggestSubmit')}
              </Button>
              <Button
                variant="text"
                onClick={() => { setOpen(false); setMessage(null); }}
                sx={{ color: '#4a4a6a' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
