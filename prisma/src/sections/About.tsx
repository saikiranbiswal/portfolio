import { WordsPullUpMultiStyle } from '../components/WordsPullUpMultiStyle';
import { AnimatedParagraph } from '../components/AnimatedParagraph';

export function About() {
  return (
    <section className="bg-paper px-4 py-16 sm:py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-6xl rounded-2xl bg-paper-2 px-6 py-16 text-center sm:py-20 md:rounded-[2rem] md:px-12 md:py-28">
        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-clay sm:mb-10 sm:text-xs">
          Visual arts
        </p>

        <WordsPullUpMultiStyle
          className="mx-auto max-w-3xl text-3xl leading-[0.95] text-ink sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          segments={[
            { text: 'I am Marcus Chen,', className: 'font-normal mr-[0.25em]' },
            { text: 'a self-taught director.', className: 'italic font-serif mr-[0.25em]' },
            {
              text: 'I have skills in color grading, visual effects, and narrative design.',
              className: 'font-normal mr-[0.25em]',
            },
          ]}
        />

        <div className="mx-auto mt-10 max-w-xl sm:mt-14">
          <AnimatedParagraph
            className="text-xs leading-relaxed text-ink sm:text-sm md:text-base"
            text="Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
          />
        </div>
      </div>
    </section>
  );
}
