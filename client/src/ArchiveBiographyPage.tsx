import { Card } from "antd";

const PARAGRAPHS = [
  `James Gordaneer was an avid artist from childhood, but received little familial support for his work, and left high school after eighth grade to work in a local grocery store. At age 19, he had saved enough to enrol at the Doon School of Fine Arts near Kitchener, Ontario, where from 1952 to 1955 he studied plein air painting under artists including the Group of Seven's Jock Macdonald, as well as noted Canadian artists Carl Schaefer, Jack Bechtel, Alex Millar, and Yvonne Housser. The works of this period reflect those formative influences: explorations in figure and form rendered in a dark, gritty palette that captures figures in motion, the landscapes of southern Ontario, and the semi-industrial atmosphere of working-class Toronto. Following several years of travel and painting in Mexico and Europe, Gordaneer returned to Toronto to teach at Central Technical School before relocating to Orangeville, Ontario in 1962. Teaching in the local high school, he continued to exhibit in Toronto galleries while his work shifted toward broad abstractions, colourful palettes, and experimentation with white space in step with the decade's prevailing approaches to abstraction.`,
  `The 1970s brought further evolution. Early in the decade, Gordaneer produced large acrylic canvases of vivid colour, followed by a body of surrealist work in which realistic animals and figures appeared in unexpected locations or against expansive colour fields. He was elected a member of the Royal Canadian Academy of Art in 1973, and also held membership in the Ontario Society of Artists and the Canadian Group of Painters. A move from Toronto to Victoria, British Columbia in 1976 marked a significant turning point: his palette shifted toward greener tones as he explored his new landscape through an abstract expressionistic lens.`,
  `Throughout his career, Gordaneer returned again and again to certain subjects — trains, horses, buildings, nudes, wrestlers, and circus figures — weaving these recurring themes through successive stylistic transformations and giving his body of work a characteristic continuity beneath its remarkable range. During the 1980s, while teaching at the Victoria College of Art, he moved briefly into hard-edge abstraction and colour fields before embracing a more energetic visual language: bold strokes, large canvases, and bright contrasting colours, with circus motifs and vivid figurative abstracts at the fore. A journey to Uganda and Kenya in 1991, followed by a critical illness in 1992, prompted a profound reorientation that would affect his work from then forward.`,
  `Upon returning to the easel, Gordaneer co-founded the Chapman Group, a Victoria-based collective of painters, writers, and philosophers whose work drew on a range of perspectives including liberation theology and new thinking in quantum physics. His work from the 1990s is defined by visual movement inspired by Riemannian geometry, rendered in thin glazes of oil paint producing rich, luminous colour, and complex compositions that brought multiple, often disparate, images together within a single canvas.`,
  `After the Chapman Group disbanded in the early 2000s following the death of co-founder Raymond Llorens, Gordaneer retained the conceptual and stylistic framework he had developed within the collective, while pushing it in new directions. He created a sense of motion conveyed by line, a renewed commitment to abstraction, and a darker palette. A severe stroke in 2011 curtailed his mobility, but not his determination. Unable to walk, he continued to paint daily from his studio, returning with fresh intensity to beloved subjects such as trains and nudes. It was only when his health finally prevented him from reaching his studio that his practice came to a close. His final painting, a self-portrait in a hospital bed, was done in the care home where he passed away on March 9, 2016.`,
];

export default function ArchiveBiographyPage() {
  return (
    <div className="flex-1 min-h-0 bg-cover bg-center bg-fixed px-4 lg:pl-20 lg:mx-0 mx-auto"
         style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)' }}>
      <div className="py-6 space-y-6 flex-1">
        <Card style={{ maxWidth: "950px", borderRadius: "unset" }}>
          <div className="text-lg font-semibold py-2">James Gordaneer</div>
          <div className="flex flex-col space-y-2 pt-2">
            {PARAGRAPHS.map((text, i) => (
              <div key={i}>{text}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
