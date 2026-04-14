// The university search autocomplete on the homepage.

'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import { supabase } from '@/lib/supabaseClient';

interface UniversityResult {
  id: string;
  name: string;
  city: string;
  slug: string;
}

export default function SearchBar() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<UniversityResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('id, name, city, slug')
          .ilike('name', `%${inputValue}%`)
          .limit(10);

        if (error) throw error;
        setOptions(data ?? []);
      } catch (error) {
        console.error('Search failed:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSelect = (_: React.SyntheticEvent, value: string | UniversityResult | null) => {
    if (value && typeof value !== 'string') {
      router.push(`/${locale}/universite/${value.slug}`);
    }
  };

  return (
    <Autocomplete
      id="university-search"
      freeSolo
      options={options}
      loading={loading}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.name
      }
      onInputChange={(_, value) => setInputValue(value)}
      onChange={handleSelect}
      noOptionsText={inputValue.length >= 2 ? t('noResults') : ''}
      PaperComponent={({ children, ...props }) => (
        <Paper
          {...props}
          elevation={8}
          sx={{
            borderRadius: 3,
            mt: 1,
            border: '1px solid rgba(26, 26, 46, 0.08)',
          }}
        >
          {children}
        </Paper>
      )}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box
            component="li"
            key={key}
            {...restProps}
            sx={{
              py: 1.5,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(233, 69, 96, 0.04)',
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                flexShrink: 0,
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
              }}
            >
              🏫
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: '#1a1a2e' }}
              >
                {option.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a4a6a' }}>
                📍 {option.city}
              </Typography>
            </Box>
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('searchPlaceholder')}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
              backgroundColor: '#fff',
              fontSize: '1.1rem',
              py: 0.5,
              boxShadow: '0 4px 24px rgba(26, 26, 46, 0.1)',
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 6px 32px rgba(26, 26, 46, 0.15)',
              },
              '&.Mui-focused': {
                boxShadow: '0 8px 40px rgba(233, 69, 96, 0.15)',
              },
            },
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="span" sx={{ color: '#4a4a6a', ml: 1, fontSize: '1.2rem' }}>
                    🔍
                  </Box>
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      sx={{ width: '100%', maxWidth: 640 }}
    />
  );
}
