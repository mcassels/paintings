import ImageCard from './ImageCard';
import { List } from 'antd';
import BrowsePaintingsButton from './BrowsePaintingsButton';

const BIO_TITLE = "About James Gordaneer";

type BioBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheader'; text: string };

const BIO_CONTENT: BioBlock[] = [
  { type: 'paragraph', text: "James Gordaneer painted in oils, acrylics, and watercolours from the 1950s until his death on March 9, 2016. One of Vancouver Island’s most prolific painters and a prominent art instructor to hundreds in Victoria, B.C., Gordaneer has a huge following of former students and collectors." },
  { type: 'subheader', text: "Gordaneer’s Early Years" },
  { type: 'paragraph', text: "Born in Toronto in 1933, Gordaneer was the youngest son in a working-class family. He quit high school after Grade 8 to work at the local grocery store alongside his older brothers, Harry and John Gordaneer. While he’d always doodled on anything he could, from playground dust to a pad of paper on the family table, Gordaneer’s parents were shocked when at age 19, he decided to take his talent for painting and drawing to art school — something that was a world away from their East-End Toronto experience." },
  { type: 'paragraph', text: "Gordaneer found himself at the Doon Summer School of Fine Arts at the historic Homer Watson house in Doon, Ontario. It was a prestigious art school, staffed by members of the Group of Seven and their contemporaries. Gordaneer almost left the same day he arrived, feeling the weight of impostor syndrome. Who was he to be part of such an elite group? But when he went for a walk and crossed over a bridge near the school, he was struck by the beauty of the river water running under it. Back at the residence, he was welcomed by the other art students, and never looked back." },
  { type: 'subheader', text: "Gordaneer’s Art Education" },
  { type: 'paragraph', text: "Learning from renowned artists like the Group of Seven’s Frederick Varley and J.E.H Macdonald, and recognized for his talent, he became an instructor at Doon the following year, teaching alongside renowned artists like Carl Schaefer, Yvonne Housser, Dorothy Stevens, and Jack Bechtel. Over six decades, Gordaneer was involved with many artist societies and groups, including the Canadian Group of Painters, the Chapman Group of Artists, the Ontario Society of Artists, the Royal Canadian Academy of Arts, and the Canadian Society of Painters in Watercolour." },
  { type: 'subheader', text: "Gordaneer’s Artistic Inspiration" },
  { type: 'paragraph', text: "Gordaneer produced thousands of works, all created with talent, curiosity, and a strong work ethic. His travels to Mexico, Spain, and Greece informed his early work, as did his later travels to Africa. His early inspiration came from works by Canadian artists, particularly David Milne and Fred Varley, plus Francis Bacon, Arshile Gorky, and Philip Guston. Eventually, he branched out, developing his own unique styles inspired by discussions held by the Chapman Group, a group of artists that he founded, together with his son Jeremy Gordaneer and philosopher Raymond Llorens, in the 1990s." },
  { type: 'subheader', text: "Gordaneer’s Stylistic Approaches" },
  { type: 'paragraph', text: "Known for his work as an abstract expressionist, Gordaneer’s works are characterised by rich colours and abstract figures. His \"Heads\" series (2006) portrayed numerous real and imagined figures in large-scale, vivid colours, while his \"Circus\" series (1987) captured the energy and life of acrobats, clowns and performing animals. His work is also renowned for its images of bodacious abstract nudes, impressionist landscapes, horses, wrestlers and steam locomotives, for which Gordaneer held a lifelong passion." },
  { type: 'subheader', text: "Gordaneer’s Exhibitions" },
  { type: 'paragraph', text: "More than one hundred of Gordaneer’s paintings were exhibited at the Art Gallery of Greater Victoria in a retrospective in 2010, documented in the exhibition catalogue by Lisa Baldissera." },
  { type: 'paragraph', text: "Many of Gordaneer’s oil paintings, watercolours, and drawings have been shown in public and private galleries across Canada and internationally, including at the National Gallery of Canada, the Art Gallery of Ontario, and the Albright Knox Art Museum in Buffalo, NY, as well as the Centre Cultural Canadians, Paris France, and at Canada House, London, UK. His paintings are held in numerous public collections across Canada, including the Robert McLaughlin Gallery, the McMichael Canadian Collection, the Peterborough Art Gallery, the Art Gallery of Greater Victoria, the Canada Council Art Bank, the Sarnia Art Gallery, Prince George Art Gallery, the Michael Williams Collection (University of Victoria), and the Homer Watson Gallery, as well as in collections curated by Imperial Oil, Crown Life, Queen’s University, Dow Chemical, Esso and hundreds of private collectors." },
  { type: 'subheader', text: "Gordaneer’s Later Years" },
  { type: 'paragraph', text: "Gordaneer’s health was not strong. A car accident in his 20s left him with lifelong aches that eventually required knee and hip replacement surgeries to help with his ongoing joint pain, while ongoing exposure to the chemicals in oil paints had an impact on his overall resilience. In 1992, he experienced a toxic reaction to a painkilling drug he’d received in the emergency room, and fell into a month-long coma. After he recovered and learned to walk again, he returned to the easel. He recalled numerous images and memories that he’d experienced while in his coma state — dream-like visions that formed the basis of many of his later paintings. In 2011, he experienced a severe stroke that left him unable to walk. However, he once again returned to painting, with the devotion of someone who has been given one more chance at life. He often said that if he couldn’t paint, he didn’t want to live. Only weeks after a severe illness forced him to enter a care home where he wasn’t able to paint, he passed away on March 9, 2016." },
];

const BIO_LINKS = [
  { description: "Video of James Gordaneer's Celebration of Life", url: "https://www.youtube.com/watch?v=YquxtyC_slw" },
  { description: "Obituary article in the Victoria News", url: "https://www.vicnews.com/community/art-gallery-to-celebrate-life-of-local-artist-19852" },
  { description: "Artists in Canada bio", url: "https://artistsincanada.com/article/jim-gordaneer/93" },
  { description: "Fairfield Artist Studio Tour", url: "https://artistsincanada.com/article/fairfield-artist-studio-tour/39" },
  { description: "University of Victoria James Gordaneer Fonds", url: "https://uvic2.coppul.archivematica.org/james-gordaneer-fonds" },
];

export default function Biography(props: {isArchive?: boolean}) {
  const { isArchive } = props;

  return (
    <div className="flex flex-col m-2 pt-6">
      <div className="flex flex-wrap justify-center gap-x-14">
        <div className="flex-col space-y-6 pb-6" style={{ maxWidth: "min(100%, 650px)"}}>
          <div className="text-left mx-2 flex justify-center">
            <div style={{ width: "min(100%, 650px)" }}>
              <div className="text-lg font-bold pb-2">{BIO_TITLE}</div>
              <div className="flex-row justify-center space-y-3">
                {BIO_CONTENT.map((block, i) =>
                  block.type === 'subheader' ? (
                    <div key={i} className="font-bold pt-2">{block.text}</div>
                  ) : (
                    <p key={i}>{block.text}</p>
                  )
                )}
              </div>
            </div>
          </div>
          <div>
            <List
              size="small"
              header={<div className="font-bold">Links</div>}
              bordered
            >
              {BIO_LINKS.map(({ description, url }) => (
                <List.Item key={url}>
                  <a href={url} target="_blank" rel="noreferrer">{description}</a>
                </List.Item>
              ))}
            </List>
          </div>
        </div>
        <div className="space-y-8" style={{ maxWidth: "min(100%, 500px)"}}>
          {!isArchive && (<div> <BrowsePaintingsButton /></div>)}
          <ImageCard
            imageKey="jim-self-portrait"
            caption="James Gordaneer, 1991. Self-Portrait. Oil on canvas. Collection of the Gordaneer family."
          />
          <ImageCard
            imageKey="jim-hands"
            caption="Jim was never far from a sketchbook or palette, be it watercolor, oils, or acrylics, even when he was in hospital. "
          />
          <ImageCard
            imageKey="jim-with-paints"
            caption="In 2015, when he returned to his studio after a long hospitalization, Jim couldn’t wait to get back to the painting he’d left on the easel — in this case, one of his beloved locomotives."
          />
          <ImageCard
            imageKey="jim-studio"
            caption="Jim’s studio, March 10, 2016, the day after he passed away."
          />
        </div>
      </div>
      {!isArchive && (
        <div className="py-6 flex justify-center">
          <BrowsePaintingsButton />
        </div>
      )}
    </div>
  );
}