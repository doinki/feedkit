import { XMLBuilder } from 'fast-xml-parser';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export class Rss {
  private builder = new XMLBuilder({
    attributeNamePrefix: '@',
    format: true,
    ignoreAttributes: false,
  });

  private elements: Omit<
    Readonly<ChannelElements>,
    'categories' | 'images' | 'items'
  >;
  private categories: Readonly<Category>[];
  private images: Readonly<Image>[];
  private items: Readonly<Item>[];
  private skipDays: Set<number>;
  private skipHours: Set<number>;

  constructor(elements: Readonly<ChannelElements>) {
    const {
      categories = [],
      images = [],
      items = [],
      skipDays = [],
      skipHours = [],
      ...channelElements
    } = elements;

    this.elements = channelElements;
    this.categories = categories.concat();
    this.images = images.concat();
    this.items = items.concat();
    this.skipDays = new Set(skipDays);
    this.skipHours = new Set(skipHours);
  }

  addItem(item: Readonly<Item>): void {
    this.items.push(item);
  }

  clearItems(): void {
    this.items = [];
  }

  toString(): string {
    return (
      '<?xml version="1.0"?>\n' +
      this.builder.build({
        rss: {
          '@version': '2.0',
          channel: {
            ...this.elements,
            category: this.categories?.map(({ domain, text }) => ({
              '@domain': domain,
              '#text': text,
            })),
            cloud: this.elements.cloud
              ? {
                  '@domain': this.elements.cloud.domain,
                  '@port': this.elements.cloud.port,
                  '@path': this.elements.cloud.path,
                  '@registerProcedure': this.elements.cloud.registerProcedure,
                  '@protocol': this.elements.cloud.protocol,
                }
              : undefined,
            image: this.images,
            item: this.items.map(({ categories, ...item }) => ({
              ...item,
              guid: item.guid
                ? {
                    '@isPermaLink': item.guid.isPermaLink,
                    '#text': item.guid.text,
                  }
                : undefined,
              category: categories?.map(({ domain, text }) => ({
                '@domain': domain,
                '#text': text,
              })),
              enclosure: item.enclosure
                ? {
                    '@url': item.enclosure.url,
                    '@length': item.enclosure.length,
                    '@type': item.enclosure.type,
                  }
                : undefined,
              pubDate: item.pubDate?.toUTCString(),
              source: item.source
                ? {
                    '@url': item.source.url,
                    '#text': item.source.text,
                  }
                : undefined,
            })),
            lastBuildDate: this.elements.lastBuildDate?.toUTCString(),
            pubDate: this.elements.pubDate?.toUTCString(),
            skipDays: this.skipDays.size
              ? {
                  day: [...this.skipDays]
                    .filter((day) => day >= 0 && day <= 6)
                    .map((day) => days[day]),
                }
              : undefined,
            skipHours: this.skipHours.size
              ? {
                  hour: [...this.skipHours].filter(
                    (hour) => hour >= 0 && hour <= 23
                  ),
                }
              : undefined,
          },
        },
      })
    );
  }
}

export interface Category {
  text: string;
  domain?: string;
}

export interface Cloud {
  domain: string;
  port: number;
  path: string;
  registerProcedure: string;
  protocol: 'http-post' | 'soap' | 'xml-rpc';
}

export interface Image {
  url: string;
  title: string;
  link: string;
  width?: number;
  height?: number;
  description?: string;
}

export interface TextInput {
  title: string;
  description: string;
  name: string;
  link: string;
}

export interface ChannelElements {
  /**
   * The name of the channel. It's how people refer to your service. If you have an HTML website that contains the same information as your RSS file, the title of your channel should be the same as the title of your website.
   *
   * @example 'GoUpstate.com News Headlines'
   */
  title: string;

  /**
   * The URL to the HTML website corresponding to the channel.
   *
   * @example 'http://www.goupstate.com/'
   */
  link: string;

  /**
   * Phrase or sentence describing the channel.
   *
   * @example 'The latest news from GoUpstate.com, a Spartanburg Herald-Journal Web site.'
   */
  description: string;

  /**
   * The language the channel is written in. This allows aggregators to group all Italian language sites, for example, on a single page. A list of allowable values for this element, as provided by Netscape, is [here](https://www.rssboard.org/rss-language-codes). You may also use [values defined](https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes) by the W3C.
   *
   * @example 'en-us'
   */
  language?: string;

  /**
   * Copyright notice for content in the channel.
   *
   * @example 'Copyright 2002, Spartanburg Herald-Journal'
   */
  copyright?: string;

  /**
   * Email address for person responsible for editorial content.
   *
   * @example 'geo@herald.com (George Matesky)'
   */
  managingEditor?: string;

  /**
   * Email address for person responsible for technical issues relating to channel.
   *
   * @example 'betty@herald.com (Betty Guernsey)'
   */
  webMaster?: string;

  /**
   * The publication date for the content in the channel. For example, the New York Times publishes on a daily basis, the publication date flips once every 24 hours. That's when the pubDate of the channel changes. All date-times in RSS conform to the Date and Time Specification of [RFC 822](https://datatracker.ietf.org/doc/html/rfc822), with the exception that the year may be expressed with two characters or four characters (four preferred).
   *
   * @example 'Sat, 07 Sep 2002 00:00:01 GMT'
   */
  pubDate?: Date;

  /**
   * The last time the content of the channel changed.
   *
   * @example 'Sat, 07 Sep 2002 09:42:31 GMT'
   */
  lastBuildDate?: Date;

  /**
   * Specify one or more categories that the channel belongs to. Follows the same rules as the <item>-level [category](https://www.rssboard.org/rss-specification#ltcategorygtSubelementOfLtitemgt) element. More [info](https://www.rssboard.org/rss-specification#syndic8).
   *
   * @example [{ name: "Newspapers" }]
   */
  categories?: Readonly<Category>[];

  /**
   * A string indicating the program used to generate the channel.
   *
   * @example 'MightyInHouse Content System v2.3'
   */
  generator?: string;

  /**
   * A URL that points to the [documentation](https://www.rssboard.org/rss-specification) for the format used in the RSS file. It's probably a pointer to this page. It's for people who might stumble across an RSS file on a Web server 25 years from now and wonder what it is.
   *
   * @example 'https://www.rssboard.org/rss-specification'
   */
  docs?: string;

  /**
   * Allows processes to register with a cloud to be notified of updates to the channel, implementing a lightweight publish-subscribe protocol for RSS feeds. More info [here](https://www.rssboard.org/rss-specification#ltcloudgtSubelementOfLtchannelgt).
   *
   * @example { domain: 'rpc.sys.com', port: 80, path: '/RPC2', registerProcedure: 'pingMe', protocol: 'soap' }
   */
  cloud?: Readonly<Cloud>;

  /**
   * ttl stands for time to live. It's a number of minutes that indicates how long a channel can be cached before refreshing from the source. More info [here](https://www.rssboard.org/rss-specification#ltttlgtSubelementOfLtchannelgt).
   *
   * @example 60
   */
  ttl?: number;

  /**
   * Specifies a GIF, JPEG or PNG image that can be displayed with the channel. More info [here](https://www.rssboard.org/rss-specification#ltimagegtSubelementOfLtchannelgt).
   */
  images?: Readonly<Image>[];

  /**
   * The [PICS](https://www.w3.org/PICS/) rating for the channel.
   */
  rating?: string;

  /**
   * 	Specifies a text input box that can be displayed with the channel. More info [here](https://www.rssboard.org/rss-specification#lttextinputgtSubelementOfLtchannelgt).
   */
  textInput?: Readonly<TextInput>;

  /**
   * A hint for aggregators telling them which hours they can skip. This element contains up to 24 <hour> sub-elements whose value is a number between 0 and 23, representing a time in GMT, when aggregators, if they support the feature, may not read the channel on hours listed in the <skipHours> element. The hour beginning at midnight is hour zero.
   */
  skipHours?: number[];

  /**
   * A hint for aggregators telling them which days they can skip. This element contains up to seven <day> sub-elements whose value is Monday, Tuesday, Wednesday, Thursday, Friday, Saturday or Sunday. Aggregators may not read the channel during days listed in the <skipDays> element.
   */
  skipDays?: number[];

  items?: Readonly<Item>[];
}

export interface Enclosure {
  url: string;
  length: number;
  type: string;
}

export interface Guid {
  isPermaLink?: true;
  text: string;
}

export interface Source {
  url: string;
  text: string;
}

export type Item = (
  | {
      /**
       * The title of the item.
       *
       * @example 'Venice Film Festival Tries to Quit Sinking'
       */
      title: string;

      /**
       * The item synopsis.
       *
       * @example 'Some of the most heated chatter at the Venice Film Festival this week was about the way that the arrival of the stars at the Palazzo del Cinema was being staged.'
       */
      description?: string;
    }
  | { title?: string; description: string }
) & {
  /**
   * The URL of the item.
   *
   * @example 'http://nytimes.com/2004/12/07FEST.html'
   */
  link?: string;

  /**
   * Email address of the author of the item. [More](https://www.rssboard.org/rss-specification#ltauthorgtSubelementOfLtitemgt).
   */
  author?: string;

  /**
   * Includes the item in one or more categories. [More](https://www.rssboard.org/rss-specification#ltcategorygtSubelementOfLtitemgt).
   */
  categories?: Readonly<Category>[];

  /**
   * URL of a page for comments relating to the item. [More](https://www.rssboard.org/rss-specification#ltcommentsgtSubelementOfLtitemgt).
   */
  comments?: string;

  /**
   * 	Describes a media object that is attached to the item. [More](https://www.rssboard.org/rss-specification#ltenclosuregtSubelementOfLtitemgt).
   */
  enclosure?: Readonly<Enclosure>;

  /**
   * A string that uniquely identifies the item. [More](https://www.rssboard.org/rss-specification#ltguidgtSubelementOfLtitemgt).
   */
  guid?: Readonly<Guid>;

  /**
   * 	Indicates when the item was published. [More](https://www.rssboard.org/rss-specification#ltpubdategtSubelementOfLtitemgt).
   */
  pubDate?: Date;

  /**
   * The RSS channel that the item came from. [More](https://www.rssboard.org/rss-specification#ltsourcegtSubelementOfLtitemgt).
   */
  source?: Readonly<Source>;
};
