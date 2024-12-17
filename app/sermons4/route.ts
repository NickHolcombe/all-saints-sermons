import RSS from "rss"
import Parser from 'rss-parser'

type CustomFeed = {foo: string};
type CustomItem = {
    description: string
    "itunes:author": string
    "itunes:summary": string
    "itunes:duration": string
};
type ASFeedType = CustomFeed & Parser.Output<CustomItem>

const fetchASItunesFeed = async (): Promise<ASFeedType> => {
    const parser: Parser<CustomFeed, CustomItem> = new Parser({
        customFields: {
            feed: ['foo'],
            item: [
                'description',
                'itunes:author',
                'itunes:summary',
                'itunes:duration',
            ]
        }
    });
    let asITunesFeed = await parser.parseURL('https://www.allsaintscrowborough.org/Media/rss.xml');
    return asITunesFeed;
}

export async function GET() {
    let asITunesFeed = await fetchASItunesFeed()
    console.log(asITunesFeed.title);

    // TODO: add TTL back in
    const feed = new RSS({
        title: asITunesFeed.title ?? 'All Saints Church Crowborough',
        description: asITunesFeed.description ?? 'All Saints Church Crowborough Media',
        generator: 'RSS for Node and Next.js',
        feed_url: 'https://all-saints-sermons.vercel.app/sermons',
        site_url: 'https://www.allsaintscrowborough.org',
        managingEditor: 'office@allsaintscrowborough.org (Nick Holcombe)',
        webMaster: 'office@allsaintscrowborough.org (Nick Holcombe)',
        copyright: `Copyright ${new Date().getFullYear().toString()}, Nick Holcombe`,
        language: 'en-US',
        ttl: 0,
        categories: ['Sermon Media'],
        pubDate: new Date().toUTCString(),
        custom_namespaces: {
            'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
        },
        custom_elements: [
            {'itunes:explicit': 'false'},
            {'itunes:author': 'Nick Holcombe'},
            {'itunes:summary': 'All Saints Church Sermon Media'},
            {'itunes:owner': [
                    {'itunes:name': 'Adrian Bailey'},
                    {'itunes:email': 'office@allsaintscrowborough.org'}
                ]},
            {'itunes:category': [
                    {_attr: {
                            text: 'Religion & Spirituality'
                        }},
                    {'itunes:category': {
                            _attr: {
                                text: 'Christianity'
                            }
                        }}
                ]}
        ]
    });

    asITunesFeed.items.forEach(item => {
        console.log(item.title + ':' + item['itunes:author'])
        const title = `[${item.description}] ${item.title}`
        // TODO: Fetch sermon image from somewhere
        const imageUrl = "https://allsaintscrowborough.org/Images/Content/1901/Thumbnail/1346597.jpeg"
        feed.item({
            title: title,
            description: item.description,
            url: item.link ?? '', // link to the item
            date:  item.pubDate ?? '', // any format that js Date can parse.
            guid: item.guid,
            custom_elements: [
                {'itunes:author': `${item['itunes:author']}`},
                {'itunes:subtitle': 'Sermon subtitle'},
                {'itunes:summary': `${item['itunes:summary']}`},
                {'itunes:duration': `${item['itunes:duration']}`},
                {'itunes:image': {
                        _attr: {
                            href: imageUrl
                        }
                    }},
            ],
            enclosure: item.enclosure,
        });
    });

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
