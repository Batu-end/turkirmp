'use server';

import { submitReview as submitReviewQuery } from '@/lib/queries';
import type { ReviewInput } from '@/lib/types';

export async function submitReviewAction(input: ReviewInput) {
  try {
    // Basic validation
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
