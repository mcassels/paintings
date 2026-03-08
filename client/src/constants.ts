import { TextContentId } from "./types";

export const JIM_BIO_KEY: TextContentId = 'jim_bio';
export const WHY_ADOPT_KEY: TextContentId = 'why_adopt';
export const HOW_TO_ADOPT_KEY: TextContentId = 'how_to_adopt';
export const AFTER_ADOPTION_KEY: TextContentId = 'after_adoption';
export const PRICING_KEY: TextContentId = 'pricing';
export const CARE_AND_CONSERVATION_KEY: TextContentId = 'care_and_conservation';

// For local storage
export const SAVED_PAINTING_KEY = 'GORDANEER_SAVED_PAINTINGS';
export const PAINTING_ORDER_KEY = 'GORDANEER_PAINTING_ORDER';

// Airtable
export const AIRTABLE_PAINTINGS_TABLE = 'broken_paintings';

export const MORGAN_BROOKS_WEBSITE = 'https://morganbrooks.io/';

export type ShowInfo = { title: string; blurb: string; url: string };

export const SHOWS: { [key: string]: ShowInfo } = {
  naked_ladies: {
    title: 'James Gordaneer - All the Naked Ladies',
    blurb: "In celebration of Jim Gordaneer's 10th deathiversary, his estate is sharing some of his most joyously life-affirming nudes.",
    url: 'https://visit.virtualartgallery.com/jamesgordaneer',
  },
};

export const DECADE_DESCRIPTIONS: {[decade: string]: string} = {
  '1950': 'Gordaneer began his career as an artist after dropping out of high school and enrolling in the Doon School of Fine Arts, near Kitchener, Ontario. From 1952-1955 he studied plein air painting with artists such as the Group of Seven’s Jock Macdonald, plus renowned Canadian artists Carl Shaefer, Jack Bechtel, Alex Millar, and Yvonne Housser. His work during this decade is characterized by explorations in figure and form, often using a dark, gritty palette that captures the landscapes of southern Ontario and the semi-industrial aura of working-class Toronto.',
  '1960': 'After spending several years traveling and painting in Mexico and Europe, Gordaneer returned to Toronto to teach art at Central Technical School. He moved to Orangeville Ontario in 1962, where he taught high school art classes and continued his painting practice, showing in Toronto galleries. His work during this decade is characterized by broad abstractions, colourful palettes, and experimentation with white space that reflects the decade’s contemporary approaches to abstraction.',
  '1970': 'The early 1970s saw Gordaneer’s explorations in abstraction explore broad, colourful canvases painted in acrylics, followed by a series of surrealist works that featured realistic animals and figures placed in unusual locations or on broad colour fields. He became a member of the Royal Canadian Academy of Art in 1973, and was also a member of the Ontario Society of Artists and the Canadian Group of Painters. Following a move from Toronto to Victoria in 1976, his work transitioned to a greener palette, exploring his new landscape through an abstract expressionistic lens.',
  '1980': 'During the 1980s, Gordaneer worked at the Victoria College of Art, where he taught painting to hundreds of students. After a brief foray into hard-edge abstraction and colour fields as part of a collective project at the art college, Gordaneer embraced a visual idiom characterized by bold strokes, large canvases, and bright, contrasting colours, with circus motifs and vivid figurative abstracts taking center stage.',
  '1990': 'Following a trip to Uganda and Kenya in 1991, and a critical illness in 1992, Gordaneer returned to the easel to explore concepts of time and space through his artwork. He formed the Chapman Group of artists, a collective of Victoria painters, writers, and philosophers who challenged artistic norms to create works inspired by new thinking in quantum physics. Gordaneer’s work during this decade is characterized by visual movement inspired by Riemannian geometry, thin glazes of oil paint that create rich, almost luminous colours, and compositions of diverse images in a single painting.',
  '2000': 'The new century led to Gordaneer’s renewed approach to artwork, after the Chapman Group disbanded. His work still retained many of the stylistic and conceptual ideas he’d developed along with the Chapman Group, but explored new directions in form and shape through visual idioms from across his career. This decade’s work is characterized by a sense of motion conveyed by line, a return to abstraction, and a darker palette.',
  '2010': 'Gordaneer’s health deteriorated after a severe stroke in 2011. Unable to walk, but still able to paint, he became more determined than ever to explore his diminished world through new ideas and approaches in his painting. He continued to paint daily, often focusing on reinventing familiar themes such as trains and nudes. Shortly after his health prevented him from returning to his studio, he passed away on March 9, 2016.',
};