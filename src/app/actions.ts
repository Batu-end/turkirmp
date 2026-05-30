'use server';

import { createHash } from 'crypto';
import { headers } from 'next/headers';
import {
  submitReview as submitReviewQuery,
  submitProfessorSuggestion as submitSuggestionQuery,
  countRecentReviewsByIp,
} from '@/lib/queries';
import type { ReviewInput, ProfessorSuggestionInput } from '@/lib/types';

const RATE_LIMIT = 5;

async function getIpHash(): Promise<string> {
  const h = await headers();
  const ip =
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown';
  return createHash('sha256').update(ip).digest('hex');
}

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

    const ipHash = await getIpHash();
    const recentCount = await countRecentReviewsByIp(ipHash);
    if (recentCount >= RATE_LIMIT) {
      return {
        success: false,
        error: 'You have submitted too many reviews recently. Please try again later.',
      };
    }

    const review = await submitReviewQuery(input, ipHash);
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
