import type { Route } from "./+types/home";
import { json } from "@remix-run/node";

/* ========================================
   META
======================================== */
export function meta({}: Route.MetaArgs) {
  const title =
    "I Love Word Search | Free Printable & Online Word Search Puzzles for All Ages";
  const description =
    "Play free online word search puzzles or print PDF sheets for kids and adults. Browse thousands of themed puzzles: animals, holidays, food, geography, history, vocabulary, large-print, classroom worksheets, and more.";
  const url = "https://ilovewordsearch.com/";
  return [
    { title },
    { name: "description", content: description },
    {
      name: "keywords",
      content: [
        "free word search puzzles",
        "online word search",
        "printable word search",
        "easy word search for kids",
        "large print word search",
        "holiday word search",
        "classroom worksheets",
        "pdf word search generator",
        "word search for adults",
        "themed word search games",
      ].join(", "),
    },
    { name: "robots", content: "index,follow,max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: `${url}og-image.jpg` },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { rel: "canonical", href: url },
    { name: "theme-color", content: "#fef3c7" },
  ];
}

/* ========================================
   LOADER
======================================== */
export function loader() {
  return json({ nowISO: new Date().toISOString() });
}

/* ========================================
   UI HELPERS
======================================== */
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 space-y-4 leading-relaxed text-yellow-900">
      <h2 className="text-2xl font-bold text-yellow-900">{title}</h2>
      {children}
    </section>
  );
}

/* ========================================
   PAGE
======================================== */
export default function Home({ loaderData: { nowISO } }: Route.ComponentProps) {
  const featured = [
    { name: "Animals", desc: "Dogs, cats, jungle animals, ocean life" },
    { name: "Holidays", desc: "Christmas, Halloween, Easter, Valentine’s Day" },
    { name: "Countries & Geography", desc: "World capitals, landmarks, flags" },
    {
      name: "Food & Drinks",
      desc: "Fruits, desserts, breakfast, global cuisines",
    },
    { name: "Sports & Fitness", desc: "Soccer, basketball, Olympic events" },
    {
      name: "STEM & School",
      desc: "Science terms, math vocab, spelling words",
    },
    { name: "Pop Culture", desc: "Movies, music hits, famous characters" },
    {
      name: "Large-Print",
      desc: "Bigger grids for seniors & low-vision players",
    },
  ];

  return (
    <main className="bg-yellow-50 text-yellow-900">
      {/* ---------- HERO ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <h1 className="text-4xl font-extrabold text-yellow-900">
              Free Word Search Puzzles – Online & Printable
            </h1>
            <p className="text-lg text-yellow-800">
              Play unlimited themed word search puzzles online or download free
              printable PDF sheets for classrooms, rainy-day fun, or
              brain-training. No sign-up required and family-friendly for all
              ages.
            </p>
            <p className="text-sm text-yellow-700">
              Last updated: {new Date(nowISO).toLocaleDateString()}
            </p>
          </div>

          <Card className="border-yellow-300 bg-white/80">
            <h2 className="text-lg font-semibold text-yellow-900">
              Popular Categories
            </h2>
            <ul className="mt-3 grid gap-2 text-sm text-yellow-800 sm:grid-cols-2">
              {featured.map((c) => (
                <li key={c.name}>• {c.name}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-yellow-600">
              New puzzles added weekly
            </p>
          </Card>
        </div>
      </section>

      {/* ---------- FEATURED ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="text-2xl font-bold text-yellow-900">
          Browse Featured Word Search Topics
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <Card key={c.name}>
              <h3 className="text-base font-semibold text-yellow-900">
                {c.name}
              </h3>
              <p className="mt-1 text-sm text-yellow-800">{c.desc}</p>
              <span className="mt-2 inline-block text-xs font-medium text-yellow-700">
                Explore {c.name} Puzzles →
              </span>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- SEO-RICH CONTENT ---------- */}
      <Section title="Why Word Search Puzzles Are Great for Everyone">
        <p>
          Word search puzzles boost memory, improve spelling, and sharpen focus
          for children, teens, adults, and seniors. They’re perfect for quick
          mental workouts at home, in classrooms, or while commuting. Teachers
          use themed word searches to reinforce vocabulary in science, history,
          geography, and language arts. Seniors love large-print puzzles for
          gentle brain exercise that also reduces stress.
        </p>
        <p>
          On <strong>I Love Word Search</strong>, you can solve puzzles online
          or print PDF worksheets for free. Each puzzle is mobile-friendly,
          auto-generates a random letter grid, and highlights words as you find
          them.
        </p>
      </Section>

      <Section title="Free Printable PDF Puzzles for Classrooms & Parties">
        <p>
          Download hundreds of free printable word search sheets in PDF format.
          Our printables are designed for easy classroom distribution,
          home-school lessons, or themed party games. Choose from seasonal packs
          (Christmas, Halloween, Thanksgiving), STEM vocabulary sets, or fun
          categories like pets, desserts, and sports.
        </p>
      </Section>

      <Section title="Online Word Search Generator – Coming Soon">
        <p>
          Soon you’ll be able to create custom word search puzzles instantly:
          enter your own word list, select grid size (10×10, 15×15, etc.),
          difficulty level, and generate a shareable or printable puzzle in
          seconds. This feature will be perfect for teachers, party planners,
          and puzzle enthusiasts.
        </p>
      </Section>

      <Section title="Brain-Training Benefits of Word Search">
        <p>
          Regularly playing word search helps with pattern recognition, memory
          retention, and problem-solving skills. Studies show word puzzles can
          delay cognitive decline in seniors and improve language acquisition
          for ESL learners. They’re a relaxing way to unwind while keeping your
          brain active.
        </p>
      </Section>

      <Section title="Tips for Parents & Teachers">
        <ul className="list-disc list-inside space-y-1">
          <li>
            Use easy 8×8 grids for early-readers and larger 20×20 grids for
            teens.
          </li>
          <li>
            Pick themed puzzles that align with school lessons to boost
            vocabulary retention.
          </li>
          <li>Offer printable answer keys for quick grading in classrooms.</li>
          <li>
            For parties, try timed competitions to add excitement and teamwork.
          </li>
        </ul>
      </Section>

      <Section title="Large-Print & Accessible Puzzles">
        <p>
          We offer high-contrast, large-print word search puzzles specifically
          for seniors and low-vision users. These puzzles use bold fonts and
          simplified grids to ensure everyone can enjoy them comfortably.
        </p>
      </Section>

      <Section title="Seasonal & Holiday Word Search Collections">
        <p>
          Celebrate the seasons with themed puzzles that keep kids and adults
          engaged all year. Our curated holiday packs make learning festive and
          fun.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Winter holidays: Christmas, Hanukkah, New Year’s Eve</li>
          <li>Spring events: Valentine’s Day, St. Patrick’s Day, Easter</li>
          <li>Summer fun: Fourth of July, beach & vacation words</li>
          <li>Autumn favorites: Back-to-School, Halloween, Thanksgiving</li>
        </ul>
      </Section>

      <Section title="Classroom-Ready Printable Worksheets">
        <p>
          Teachers love our pre-made PDF word search sheets with answer keys.
          Perfect for morning warm-ups, homework, sub-plans, and spelling
          review.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Aligned with STEM and language-arts vocabulary</li>
          <li>Available in 8×8, 12×12, 15×15, and 20×20 grids</li>
          <li>Printable in black-and-white or color-friendly versions</li>
          <li>Free for personal, homeschool, and public-school use</li>
        </ul>
      </Section>

      <Section title="Daily Brain-Training Challenge">
        <p>
          Join our upcoming <strong>Daily Word Search Challenge</strong> to keep
          your brain sharp. New themed puzzles appear every morning to test your
          speed and focus.
        </p>
        <p>
          Track your streak, aim for personal best times, and compete with
          friends in future leaderboards. A fun routine to improve attention
          span and vocabulary one puzzle at a time.
        </p>
      </Section>

      <Section title="Tips for Solving Puzzles Faster">
        <p>
          Word search fans often ask for strategies to improve their solving
          speed. Our quick tips help players of all skill levels:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Scan rows and columns for uncommon letters first (like Q or Z)
          </li>
          <li>Highlight prefixes or suffixes to spot longer words quickly</li>
          <li>Circle found words to avoid double-checking the same area</li>
          <li>Use a finger or stylus on tablets to reduce eye-strain</li>
        </ul>
      </Section>

      <Section title="History & Fun Facts About Word Search">
        <p>
          Did you know the first known word search puzzle appeared in the U.S.
          in 1968 under the title “Word-Cross”? Since then, word searches have
          become a global pastime enjoyed by millions. They’re now available in
          dozens of languages, from English and Spanish to Japanese kana-based
          grids.
        </p>
        <p>
          Our site celebrates this heritage while adding modern online features
          and printable convenience for today’s players.
        </p>
      </Section>

      <Section title="Themed Puzzle Packs for All Ages">
        <p>
          Whether you’re planning a rainy-day activity for kids or a relaxing
          challenge for adults, our themed puzzle packs keep things fresh.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Early-reader packs with 3–6 letter words</li>
          <li>Adult-focused packs with advanced vocabulary & trivia</li>
          <li>Family game-night packs that mix easy and tough grids</li>
          <li>Travel-themed packs for road trips, airports, and campouts</li>
        </ul>
      </Section>

      <Section title="Teacher Tools & Curriculum Integration">
        <p>
          Our free printable word searches are perfect for reinforcing spelling
          lists, historical figures, or science topics. Teachers can easily plug
          them into weekly lesson plans.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Spelling-bee word lists converted to puzzles</li>
          <li>Geography grids with countries, capitals, landmarks</li>
          <li>Science-based sets for biology, astronomy, chemistry terms</li>
          <li>Ready-made answer keys to save grading time</li>
        </ul>
      </Section>

      <Section title="Multi-Language Word Search Collections">
        <p>
          Word search isn’t just for English speakers. We’re expanding to
          support <strong>Spanish, French, German, and Italian</strong> puzzles
          - plus ESL vocabulary packs for learners worldwide.
        </p>
        <p>
          These multi-language puzzles help students grow their vocabulary and
          make language lessons interactive.
        </p>
      </Section>

      <Section title="Printable Answer Keys & Solutions">
        <p>
          Every printable puzzle includes a clear, easy-to-read answer key so
          teachers, parents, and players can check solutions quickly. Our online
          puzzles also allow instant reveal of hidden words for accessibility.
        </p>
      </Section>

      <Section title="Upcoming Features & Roadmap">
        <p>
          We’re always working to improve I Love Word Search. Here’s what’s on
          the way:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Custom puzzle generator with word-list import</li>
          <li>Daily challenge leaderboard and streak tracking</li>
          <li>Interactive multiplayer timed puzzle rooms</li>
          <li>Printable PDF bundles organized by theme and grade level</li>
        </ul>
      </Section>

      <Section title="Printable Holiday Party Games">
        <p>
          Our holiday-themed word searches double as icebreakers at parties,
          classrooms, and family gatherings. Simply print the PDFs, set a timer,
          and let players race to find all the words.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Halloween mystery-themed grids with spooky words</li>
          <li>Valentine’s Day romantic phrases for couples’ game night</li>
          <li>Christmas trivia puzzles for office parties</li>
          <li>New Year countdown challenges to kick-off festivities</li>
        </ul>
      </Section>

      <Section title="Cross-Generational Fun at Home">
        <p>
          Word search is one of the few puzzle styles that grandparents and kids
          can enjoy together at the same table. Large-print grids and playful
          themes make it accessible and fun for the entire household.
        </p>
        <p>
          Encourage screen-free family evenings by keeping a stack of printable
          sheets handy for rainy days or quiet weekends.
        </p>
      </Section>

      <Section title="STEM-Inspired Word Search for Young Learners">
        <p>
          Spark curiosity about science, technology, engineering, and math with
          puzzles that highlight STEM vocabulary. Teachers love using these
          themed sets as warm-ups or homework reinforcement.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Biology & anatomy terms for middle-school science</li>
          <li>Astronomy word lists covering planets, stars, galaxies</li>
          <li>Math vocabulary puzzles with shapes, fractions, formulas</li>
          <li>Engineering-related words for project-based learning</li>
        </ul>
      </Section>

      <Section title="Travel-Themed Word Search Adventures">
        <p>
          Plan your next vacation or teach geography through puzzles inspired by
          world landmarks, capital cities, cuisines, and cultural festivals.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>World-capitals challenge for advanced solvers</li>
          <li>Beach-holiday themed word lists for summer trips</li>
          <li>Famous landmarks and UNESCO heritage sites</li>
          <li>National foods & cultural festivals word sets</li>
        </ul>
      </Section>

      <Section title="Printable Puzzle Packs for Road Trips">
        <p>
          Keep kids entertained on long drives with travel-friendly word search
          bundles. Our compact PDFs save ink and paper while providing hours of
          quiet back-seat fun.
        </p>
        <p>
          Combine them with coloring pages and crossword sheets for the perfect
          all-in-one travel activity pack.
        </p>
      </Section>

      <Section title="Eco-Friendly Printing Tips">
        <p>
          Printing at home? Save resources while still enjoying free puzzles:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use duplex (double-sided) printing to reduce paper</li>
          <li>Choose draft or grayscale mode for ink-saving prints</li>
          <li>Bundle several smaller grids per sheet when possible</li>
          <li>Recycle used sheets or repurpose as kids’ scrap paper</li>
        </ul>
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section title="Frequently Asked Questions">
        <div className="divide-y divide-yellow-200 rounded-2xl border border-yellow-200 bg-white shadow-sm">
          <details>
            <summary className="cursor-pointer px-5 py-4 font-medium text-yellow-900">
              Are these word search puzzles free to play and print?
            </summary>
            <div className="px-5 pb-4 text-yellow-800">
              Yes, all puzzles on I Love Word Search are 100% free for personal,
              classroom, and educational use.
            </div>
          </details>
          <details>
            <summary className="cursor-pointer px-5 py-4 font-medium text-yellow-900">
              Can I use them on a phone or tablet?
            </summary>
            <div className="px-5 pb-4 text-yellow-800">
              Absolutely. The online solver is mobile-friendly and works on all
              modern browsers. PDFs print clearly from any device.
            </div>
          </details>
          <details>
            <summary className="cursor-pointer px-5 py-4 font-medium text-yellow-900">
              Do you add new puzzles regularly?
            </summary>
            <div className="px-5 pb-4 text-yellow-800">
              We add fresh themed puzzles every week to keep things fun and
              engaging.
            </div>
          </details>
          <details>
            <summary className="cursor-pointer px-5 py-4 font-medium text-yellow-900">
              Will there be a custom puzzle generator?
            </summary>
            <div className="px-5 pb-4 text-yellow-800">
              Yes. Our upcoming generator lets you create custom puzzles with
              your own word lists for parties, classrooms, or printable gifts.
            </div>
          </details>
        </div>
      </Section>

      {/* ---------- FOOTER ---------- */}
      <footer className="border-t border-yellow-200 bg-yellow-100/60">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-yellow-800">
          © {new Date().getFullYear()} I Love Word Search - Free online and
          printable word search puzzles for kids and adults
        </div>
      </footer>
    </main>
  );
}
