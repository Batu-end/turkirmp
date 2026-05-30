// All database operations in one place. Every function talks to Supabase.

import { supabase } from './supabaseClient';
import type {
  University,
  Professor,
  ProfessorWithUniversity,
  Review,
  ReviewInput,
  SearchResult,
  ProfessorSuggestionInput,
} from './types';

// ============================================
// University Queries
// ============================================

export async function getUniversities(): Promise<University[]> {
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .order('name');

  if (error) throw error;
  return data ?? [];
}

export async function getUniversityBySlug(slug: string): Promise<University | null> {
  const { data, error } = await supabase
    .from('universities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ============================================
// Professor Queries
// ============================================

export async function searchProfessors(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('professors')
    .select(`
      id,
      slug,
      first_name,
      last_name,
      department,
      overall_rating,
      university:universities!inner(name)
    `)
    .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
    .limit(10);

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((item: any) => ({
    id: item.id,
    slug: item.slug,
    first_name: item.first_name,
    last_name: item.last_name,
    department: item.department,
    overall_rating: item.overall_rating,
    university_name: item.university.name,
  }));
}

export async function getProfessorBySlug(
  slug: string
): Promise<ProfessorWithUniversity | null> {
  const { data, error } = await supabase
    .from('professors')
    .select(`
      *,
      university:universities(*)
    `)
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as ProfessorWithUniversity | null;
}

export async function getProfessorsByUniversity(
  universityId: string
): Promise<Professor[]> {
  const { data, error } = await supabase
    .from('professors')
    .select('*')
    .eq('university_id', universityId)
    .order('overall_rating', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// ============================================
// Review Queries
// ============================================

export async function getReviewsByProfessor(professorId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('professor_id', professorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function submitProfessorSuggestion(suggestion: ProfessorSuggestionInput): Promise<void> {
  const { error } = await supabase
    .from('professor_suggestions')
    .insert({
      university_id: suggestion.university_id,
      first_name: suggestion.first_name.trim(),
      last_name: suggestion.last_name.trim(),
      department: suggestion.department.trim(),
      title: suggestion.title?.trim() || null,
    });

  if (error) throw error;
}

export async function submitReview(review: ReviewInput): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      professor_id: review.professor_id,
      rating: review.rating,
      difficulty: review.difficulty,
      course_code: review.course_code || null,
      comment: review.comment,
      would_take_again: review.would_take_again ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
