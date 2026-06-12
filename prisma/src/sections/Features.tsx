import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle';

const CARD_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4';

const ICONS = {
  storyboard:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
  critiques:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
  capsule:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
};

interface FeatureCardData {
  number: string;
  title: string;
  icon: string;
  items: string[];
}

const FEATURE_CARDS: FeatureCardData[] = [
  {
    number: '01',
    title: 'Project Storyboard.',
    icon: ICONS.storyboard,
    items: [
      'Scene-by-scene shot planning',
      'Drag-and-drop sequencing',
      'Versioned drafts and notes',
      'Share boards with your crew',
    ],
  },
  {
    number: '02',
    title: 'Smart Critiques.',
    icon: ICONS.critiques,
    items: [
      'Frame-level AI analysis',
      'Creative notes that stay in sync',
      'Integrations with your editing tools',
    ],
  },
  {
    number: '03',
    title: 'Immersion Capsule.',
    icon: ICONS.capsule,
    items: [
      'Silences notifications while you create',
      'Ambient soundscapes for deep focus',
      'Syncs with your shooting schedule',
    ],
  },
];

const CARD_EASE = [0.22, 1, 0.36, 1] as const;

function CardShell({ index, children, className = '' }: { index: number; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: CARD_EASE }}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ data, index }: { data: FeatureCardData; index: number }) {
  return (
    <CardShell
      index={index}
      className="flex h-full flex-col rounded-xl border border-line bg-card p-5 sm:p-6"
    >
      <img src={data.icon} alt="" className="h-10 w-10 rounded sm:h-12 sm:w-12" />
      <div className="mt-5 flex items-baseline gap-2 sm:mt-6">
        <span className="text-xs text-muted">({data.number})</span>
        <h3 className="text-lg font-bold text-ink sm:text-xl">{data.title}</h3>
      </div>
      <ul className="mt-4 flex flex-col gap-3 sm:mt-5">
        {data.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
            <span className="text-sm text-muted">{item}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="group mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-ink"
      >
        Learn more
        <ArrowRight className="h-4 w-4 -rotate-45 transition-transform group-hover:rotate-0" />
      </a>
    </CardShell>
  );
}

export function Features() {
  return (
    <section className="relative min-h-screen bg-paper px-4 py-16 sm:py-20 md:px-6 md:py-28">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <WordsPullUpMultiStyle
            className="mx-auto max-w-4xl text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[
              {
                text: 'Studio-grade workflows for visionary creators.',
                className: 'text-ink mr-[0.25em]',
              },
              { text: 'Built for pure vision. Powered by art.', className: 'text-muted mr-[0.25em]' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
          {/* Card 1 — video */}
          <CardShell index={0} className="relative h-64 overflow-hidden rounded-xl md:h-auto">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={CARD_VIDEO}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1815]/60 via-transparent to-transparent" />
            <p
              className="absolute bottom-5 left-5 text-lg font-medium sm:bottom-6 sm:left-6"
              style={{ color: '#E1E0CC' }}
            >
              Your creative canvas.
            </p>
          </CardShell>

          {FEATURE_CARDS.map((card, i) => (
            <FeatureCard key={card.number} data={card} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
