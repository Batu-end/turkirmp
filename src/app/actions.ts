'use server';

import { submitReview as submitReviewQuery, submitProfessorSuggestion as submitSuggestionQuery } from '@/lib/queries';
import type { ReviewInput, ProfessorSuggestionInput } from '@/lib/types';

export async function submitReviewAction(input: ReviewInput) {
  try {
    if (!input.professor_id) {
      return { success: false, error: 'Professor ID is required.' };
    }
    if (input.rating < 1 || input.rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5.' };
    }
    if (input.difficulty < 1 || input.difficulty > 5) {
      return { success: false, error: 'Difficulty must be between 1 and 5.' };
    }
    if (!input.comment || input.comment.trim().length < 10) {
      return { success: false, error: 'Comment must be at least 10 characters.' };
    }

    const review = await submitReviewQuery(input);
    return { success: true, review };
  } catch (error) {
    console.error('Failed to submit review:', error);
    return { success: false, error: 'Failed to submit review. Please try again.' };
  }
}

export async function submitProfessorSuggestionAction(input: ProfessorSuggestionInput) {
  try {
    if (!input.university_id) {
      return { success: false, error: 'University is required.' };
    }
    if (!input.first_name?.trim() || !input.last_name?.trim()) {
      return { success: false, error: 'First and last name are required.' };
    }
    if (!input.department?.trim()) {
      return { success: false, error: 'Department is required.' };
    }

    await submitSuggestionQuery(input);
    return { success: true };
  } catch (error) {
    console.error('Failed to submit suggestion:', error);
    return { success: false, error: 'Failed to submit suggestion. Please try again.' };
  }
}
