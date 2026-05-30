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

type UniversityOption = {
  type: 'university';
  id: string;
  name: string;
  city: string;
  slug: string;
};

type ProfessorOption = {
  type: 'professor';
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  department: string;
  overall_rating: number | null;
  university_name: string;
};

type SearchOption = UniversityOption | ProfessorOption;

export default function SearchBar() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SearchOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inputValue.length < 2) {
      setOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchTerm = `%${inputValue}%`;

        const [univResult, profResult] = await Promise.all([
          supabase
            .from('universities')
            .select('id, name, city, slug')
            .ilike('name', searchTerm)
            .limit(5),
          supabase
            .from('professors')
            .select('id, slug, first_name, last_name, department, overall_rating, university:universities!inner(name)')
            .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
            .limit(5),
        ]);

        const universities: UniversityOption[] = (univResult.data ?? []).map((u) => ({
          type: 'university',
          id: u.id,
          name: u.name,
          city: u.city,
          slug: u.slug,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const professors: ProfessorOption[] = (profResult.data ?? []).map((p: any) => ({
          type: 'professor',
          id: p.id,
          slug: p.slug,
          first_name: p.first_name,
          last_name: p.last_name,
          department: p.department,
          overall_rating: p.overall_rating,
          university_name: p.university.name,
        }));

        setOptions([...universities, ...professors]);
      } catch (err) {
        console.error('Search failed:', err);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSelect = (_: React.SyntheticEvent, value: string | SearchOption | null) => {
    if (!value || typeof value === 'string') return;
    if (value.type === 'university') {
      router.push(`/${locale}/universite/${value.slug}`);
    } else {
      router.push(`/${locale}/hoca/${value.slug}`);
    }
  };

  const getLabel = (option: string | SearchOption) => {
    if (typeof option === 'string') return option;
    if (option.type === 'university') return option.name;
    return `${option.first_name} ${option.last_name}`;
  };

  const getGroup = (option: SearchOption) =>
    option.type === 'university' ? t('searchGroupUniversities') : t('searchGroupProfessors');

  return (
    <Autocomplete
      id="combined-search"
      freeSolo
      options={options}
      loading={loading}
      groupBy={getGroup}
      getOptionLabel={getLabel}
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
      renderGroup={(params) => (
        <Box key={params.key}>
          <Typography
            sx={{
              px: 2,
              py: 0.75,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#e94560',
              borderBottom: '1px solid rgba(26, 26, 46, 0.06)',
            }}
          >
            {params.group}
          </Typography>
          {params.children}
        </Box>
      )}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        const isUniversity = option.type === 'university';

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
              '&:hover': { background: 'rgba(233, 69, 96, 0.04)' },
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
                fontSize: '1.3rem',
                flexShrink: 0,
                background: isUniversity
                  ? 'linear-gradient(135deg, #1a1a2e, #16213e)'
                  : 'linear-gradient(135deg, #e94560, #c0392b)',
              }}
            >
              {isUniversity ? '🏫' : '👨‍🏫'}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {isUniversity ? (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                    {option.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4a4a6a' }}>
                    📍 {option.city}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a1a2e' }}>
                    {option.first_name} {option.last_name}
                    {option.overall_rating != null && (
                      <Box
                        component="span"
                        sx={{
                          ml: 1,
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#e94560',
                        }}
                      >
                        ★ {Number(option.overall_rating).toFixed(1)}
                      </Box>
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4a4a6a' }}>
                    {option.department} · {option.university_name}
                  </Typography>
                </>
              )}
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
              '&:hover': { boxShadow: '0 6px 32px rgba(26, 26, 46, 0.15)' },
              '&.Mui-focused': { boxShadow: '0 8px 40px rgba(233, 69, 96, 0.15)' },
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
