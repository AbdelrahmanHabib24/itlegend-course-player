
'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';

import type { CommentItem } from '@/types/course';

interface CommentsSectionProps {
  comments: CommentItem[];
  onAddComment: (commentText: string) => void;
}

export const CommentsSection = ({
  comments,
  onAddComment,
}: CommentsSectionProps) => {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setError('Please write a comment before submitting.');
      return;
    }

    setError('');
    onAddComment(trimmedComment);
    setCommentText('');
  };

  return (
    <section
      id="comments"
      aria-labelledby="comments-heading"
      className="my-8 scroll-mt-24"
    >
      <div className="mb-6">
        <h2
          id="comments-heading"
          className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
        >
          Comments
        </h2>
      </div>

      <div className="space-y-5 mb-8">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <article className="flex items-start gap-4">
              <img
                src={comment.authorAvatar}
                alt=""
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {comment.authorName}
                </h3>

                <time className="block text-xs text-slate-400 font-normal mt-0.5">
                  {comment.date}
                </time>

                <p className="text-sm text-slate-600 leading-relaxed mt-2.5 break-words whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </article>

            {index < comments.length - 1 && (
              <hr className="border-t border-slate-200/80 my-5" />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <label htmlFor="comment-input" className="sr-only">
          Write a comment
        </label>

        <textarea
          id="comment-input"
          rows={4}
          value={commentText}
          onChange={(e) => {
            setCommentText(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'comment-error' : undefined}
          placeholder="Write a comment"
          className="w-full p-4 sm:p-5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#40b299] focus:ring-1 focus:ring-[#40b299]/30 text-slate-800 placeholder:text-slate-400 transition-all resize-none shadow-xs"
        />

        {error && (
          <p
            id="comment-error"
            role="alert"
            className="text-xs text-red-500 mt-1 font-medium"
          >
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-start">
          <button
            type="submit"
            className="px-6 py-3 rounded-md text-sm font-semibold bg-[#40b299] hover:bg-[#369b85] text-white shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Submit Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </section>
  );
};
