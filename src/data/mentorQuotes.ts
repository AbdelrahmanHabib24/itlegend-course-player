import { MentorQuote } from '@/types/course';

export function getMentorQuoteForProgress(progress: number): MentorQuote {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));

  let quoteText = '';
  let level = '';
  let emoji = '👏';

  if (safeProgress < 40) {
    level = 'بداية موفقة';
    quoteText = 'بداية موفقة يا بطل، خطوة بخطوة وهتوصل لهدفك إن شاء الله 🚀';
    emoji = '🚀';
  } else if (safeProgress < 70) {
    level = 'مستوى ممتاز';
    quoteText = 'مستواك كويس جدًا يا بطل، كمل بنفس الرتم وإن شاء الله تخلص الكورس على خير 👏';
    emoji = '👏';
  } else if (safeProgress < 90) {
    level = 'قربت تخلص';
    quoteText = 'أنت قربت تخلص يا بطل، فاضلك شوية وتكمل الكورس كله 💪';
    emoji = '💪';
  } else if (safeProgress < 100) {
    level = 'آخر خطوة';
    quoteText = 'ما شاء الله، قربت جدًا يا بطل 😄 خلّص آخر خطوة ونقولك خلصت الكورس!';
    emoji = '😄';
  } else {
    level = 'إتمام الكورس';
    quoteText = 'عاش يا بطل! كملت الكورس للنهاية 💪🔥 تستاهل الاحتفال!';
    emoji = '🔥';
  }

  return {
    minProgress: 0,
    maxProgress: 100,
    levelName: level,
    quote: quoteText,
    emoji,
  };
}
