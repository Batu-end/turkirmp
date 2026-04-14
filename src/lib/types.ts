// ============================================
// Database types matching the Supabase schema
// ============================================

export interface University {
  id: string;
  name: string;
  city: string;
  slug: string;
  website: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface Professor {
  id: string;
  university_id: string;
  first_name: string;
  last_name: string;
  slug: string;
  department: string;
  title: string | null;
  overall_rating: number;
  total_reviews: number;
  would_take_again_pct: number;
  average_difficulty: number;
  created_at: string;
}

/** Professor with the university object joined */
export interface ProfessorWithUniversity extends Professor {
  university: University;
}

export interface Review {
  id: string;
  professor_id: string;
  rating: number;
  difficulty: number;
  course_code: string | null;
  comment: string;
  would_take_again: boolean | null;
  is_anonymous: boolean;
  created_at: string;
}

/** Payload for submitting a new review (server action input) */
export interface ReviewInput {
  professor_id: string;
  rating: number;
  difficulty: number;
  course_code?: string;
  comment: string;
  would_take_again?: boolean;
}

/** Search result item returned by the autocomplete */
export interface SearchResult {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  department: string;
  university_name: string;
  overall_rating: number;
}
