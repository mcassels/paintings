import { Card } from "antd";

interface Section {
  heading: string;
  paragraphs: string[];
}

const sections: Section[] = [
  {
    heading: "The Archive",
    paragraphs: [
      "The James Gordaneer Catalogue Raisonné contains the most comprehensive body of information on the life and work of James Gordaneer. It consists of an extensive photographic collection of images of Gordaneer's paintings. Future editions will include works on paper, sketchbooks, manuscripts, correspondence, exhibition, publication, and project records and press clippings, as well as documentation of various ephemera including objects, artifacts, and tools Gordaneer collected during his travels and throughout his lifetime.",
    ],
  },
  {
    heading: "Ordering and Numbering System",
    paragraphs: [
      "Artworks in the James Gordaneer Catalogue Raisonné are assigned a JG identification number by archive producers Alisa Gordaneer and Morgan Brooks, beginning at JG1 and continuing sequentially. Where possible, these numbers have been inscribed in pencil on the verso of each catalogued work.",
      "The viewable digital archive is organized chronologically by year. Where a precise date is uncertain, an estimated date is assigned based on available evidence, and the entry is placed accordingly in the chronological order.",
      "Damaged works are additionally assigned a BP identification number — BP standing for \"Broken Painting,\" a designation assigned with irony by the artist's estate. A single work may carry both a JG and a BP number. Additional images associated with a single work, such as verso photographs or detail images of damage, are noted under the same base number with a descriptive suffix (e.g., \"verso\" or \"bp\").",
      "Works that belong to a named series are identified in their title. Where the series title is the primary identifier, it appears first, followed by the individual title (e.g., Gravid Series, Yawn). Where the individual title is primary, the series is noted parenthetically (e.g., Beacon Hill Park (Arcadia series)). Recurring subjects or themes that do not constitute a formally named series — such as locomotives or wrestlers — are noted in the subject field of the catalogue database rather than solely in the title.",
      "Identification numbers assigned in previous inventories or exhibition catalogues are noted in the relevant entries where known. New works added to the catalogue after its initial compilation are assigned the next available JG number in sequence, in the order in which they are added, regardless of the date of the work.",
    ],
  },
  {
    heading: "Photography",
    paragraphs: [
      "The catalogue aims to provide photographs of all works for reference purposes, including primary views, verso images where details of note are present, and historical photographs from exhibition, studio, and personal archives where available.",
      "Primary photography was conducted on an iPhone 16 main camera (26mm, f/1.6, 18MP, approximately 4871×3703 pixels) under natural daylight, combined halogen and LED, or LED-only lighting, with digital colour correction applied at the time of photography if deemed necessary. Verso images have been included where the verso contains details of significance, including signatures, inscriptions, titles, dates, and personal notations. Where a verso is blank or without details of significance, inclusion of a verso image is of lower priority.",
      "For works held in private collections, high-quality digital or print images supplied by owners or galleries are accepted. Where no image is available, a standard placeholder is displayed in its place. As new images are obtained — including from owners, exhibition records, and archival sources — they will be added to the database and assigned a JG id number. Access to exhibition records held at the University of Victoria's Special Collections is an ongoing goal, and archival and exhibition photographs will be incorporated as they become available.",
    ],
  },
  {
    heading: "Titles",
    paragraphs: [
      "Titles are presented as recorded on the labels on the backs of works, which serve as the primary source. Archive producer Alisa Gordaneer, the artist's daughter, was responsible for assigning titles to many works during the artist's lifetime, beginning with \"Four Square Mickey\" (1973). The title recorded in the archive is considered the authoritative title for each work.",
      "Untitled works are listed as \"Untitled\" and given a parenthetical descriptive name based either on the visual content of the work (e.g., Untitled (Blue chair)) or on information known to the estate regarding the artist's location, habits, or associates at the time of the work's creation (e.g., Untitled (Corner of May and Linden) or Untitled (Mimi)).",
      "Many works have carried multiple titles over time. While alternate titles are not recorded in the archive's database fields, they may be visible in verso images and are preserved there for reference. Works belonging to a named series are identified as such in their title, as described above under Ordering and Numbering.",
    ],
  },
  {
    heading: "Dates",
    paragraphs: [
      "Dates are given by year, from the point the work is known or estimated to have been completed. The primary source for dating is any signature or inscription on the work itself. Where no date is inscribed, a best-estimate date is assigned based on family recollection and on comparison of style, medium, and substrate with other works of known date.",
      "Where a work is known to have been begun in one year and completed in another, the start and completion dates are not recorded as separate fields in the database, but may be visible in inscriptions documented in verso images. In some cases, dates inscribed on works may be incorrect or may have been added after the fact; the archive makes every effort to note such uncertainties where they are known.",
    ],
  },
  {
    heading: "Materials and Substrates",
    paragraphs: [
      "Painting media is documented as oil, acrylic, watercolour, ink, or mixed media. The current catalogue focuses on paintings; future updates will expand coverage to works on paper, at which point additional media — including pastel, gouache, pencil, charcoal, and related drawing media — will be documented accordingly.",
      "Substrates include canvas, linen, canvas or linen on panel, canvas board, wood panel, paper, board, masonite, and cardboard. All works on canvas are stretched. Where a work is framed, that information is noted, though framing dimensions and materials are recorded separately from the dimensions of the work itself. In certain periods, Gordaneer worked consistently on particular substrates; for example, a body of works from 2013 and 2014 was executed on pre-prepared canvases, and such patterns are noted in the relevant entries where known.",
    ],
  },
  {
    heading: "Dimensions",
    paragraphs: [
      "Dimensions are recorded in inches and reflect the support only, exclusive of any frame. For works on paper, both the sheet dimensions and the image area are measured; the image area is presented as the primary dimension in the archive entry. Measurements are taken by the archive compilers for works in their direct purview; owners and gallerists provide measurements for works in their possession. An acceptable margin of variation of one inch applies to works on canvas or panel.",
    ],
  },
  {
    heading: "Inscriptions and Signatures",
    paragraphs: [
      "Gordaneer typically signed his works with his surname only (\"Gordaneer\"), though occasional examples signed \"James Gordaneer\" or \"J. Gordaneer\" appear across the decades. Signatures appear on the front of a work, the verso, or occasionally both. He frequently, though not consistently, inscribed dates, titles, and other notations on the verso; these inscriptions at times document the successive titles or revisions a painting underwent, and in the case of works given as gifts, may include personal messages. The location and form of all inscriptions are documented in verso photography and in the catalogue wherever possible.",
      "Works that are unsigned are noted as such. Verification of provenance for unsigned works is made by the estate. Where inscriptions are inconsistent or their accuracy is uncertain, this is noted in the entry.",
    ],
  },
  {
    heading: "Series and Related Works",
    paragraphs: [
      "Gordaneer worked in a number of identifiable named series — among them Heads, Circus, and landscapes of Victoria — as well as returning throughout his career to recurring subjects including locomotives, wrestlers, horses, nudes, and buildings. Works that belong to a formally named series are identified as such in their title. Works that engage a recurring subject or theme without belonging to a named series are identified through the subject field of the catalogue database.",
      "Individual works within a series can be located through a title search in the database and are cross-referenced in the notes field of each entry. Studies or preparatory works related to a finished painting are noted by cross-reference to the relevant JG identification number.",
    ],
  },
  {
    heading: "Provenance and Current Collection",
    paragraphs: [
      "The works presented in the initial catalogue remain in the artist's estate, though many have been exhibited in galleries during and after Gordaneer's lifetime. The archive currently has limited access to sales records, exhibition sales lists, or gallery records documenting transfers of ownership; research into these records, including those held at the University of Victoria's Special Collections, is ongoing.",
      "Works held in private collections whose owners prefer anonymity are listed as \"Private collection.\" Works whose current location has not been determined are listed as \"Location currently unknown.\" Works known to have sustained significant damage are included in the catalogue with a BP identification number, as described above under Ordering and Numbering.",
    ],
  },
  {
    heading: "Exhibitions and Bibliography",
    paragraphs: [
      "Where possible, catalogue entries are linked to exhibitions in which the work is known to have appeared and to published literature in which the work has been cited or illustrated. Exhibition records, checklists, and catalogues covering Gordaneer's career are held in part at the University of Victoria's Special Collections, and the archive will incorporate this material as access allows. Some published literature referencing specific works has been identified and linked to the relevant entries; this work is ongoing.",
    ],
  },
  {
    heading: "Scope and Exclusions",
    paragraphs: [
      "The first iteration of the catalogue focuses on paintings in oil, acrylic, watercolour, ink, and mixed media on all supports. Works on paper and drawings are planned for inclusion in a future update.",
      "The archive includes works considered unfinished or abandoned, as there is no reliable means of determining which works Gordaneer regarded as incomplete; he frequently revised paintings after they had been titled, and the boundary between finished and unfinished work is therefore not clearly established. The archive aims to include, to the extent possible, works given away informally, traded, or otherwise held by other artists and collectors. Works of uncertain authorship are excluded.",
      "Works not created for public viewing — such as personal cards or other private ephemera made for family members — are not catalogued as artworks in this archive, but are planned for inclusion in a separate ephemera section to be developed in a future update.",
    ],
  },
];

export default function UserGuidePage() {
  return (
    <div className="flex-1 min-h-0 bg-cover bg-center bg-fixed px-4 lg:pl-20 lg:mx-0 mx-auto"
         style={{ backgroundImage: 'url(https://james-gordaneer-paintings.s3.ca-central-1.amazonaws.com/website_images/pastel_blue_chair_painting.webp)' }}>
      <div className="py-6 space-y-6 flex-1">
        <Card style={{ maxWidth: "950px", borderRadius: "unset" }}>
          <div className="text-lg font-semibold py-2">User Guide</div>
          <div className="flex flex-col space-y-6 pt-2">
            {sections.map((section) => (
              <div key={section.heading} className="flex flex-col space-y-2">
                <div className="font-semibold">{section.heading}</div>
                {section.paragraphs.map((p, i) => (
                  <div key={i}>{p}</div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
