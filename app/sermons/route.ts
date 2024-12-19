import RSS from "rss"
import {fetchASItunesFeed, fetchASSecondaryFeed} from "@/app/sermons/utils";

export async function GET() {
    const asITunesFeed = await fetchASItunesFeed()
    const secondaryDict = await fetchASSecondaryFeed()
    
    // TODO: add TTL back in
    const feed = new RSS({
        title: 'All Saints Church Crowborough',
        description: 'All Saints Church Crowborough Media',
        generator: 'RSS for Node and Next.js',
        feed_url: 'https://all-saints-sermons.vercel.app/sermons',
        site_url: 'https://www.allsaintscrowborough.org',
        managingEditor: 'office@allsaintscrowborough.org (Church Office)',
        webMaster: 'office@allsaintscrowborough.org (Nick Holcombe)',
        copyright: `Copyright ${new Date().getFullYear().toString()}, Nick Holcombe`,
        language: 'en-US',
        categories: ['Sermon Media'],
        pubDate: new Date().toUTCString(),
        custom_namespaces: {
            'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
        },
        custom_elements: [
            {'itunes:explicit': 'false'},
            {'itunes:author': 'Church Office'},
            {'itunes:summary': 'All Saints Church Sermon Media'},
            {'itunes:owner': [
                    {'itunes:name': 'Church Office'},
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
        // console.log(item.title + ':' + item['itunes:author'])
        const title = item.guid ? `[${item.description}] ${secondaryDict[item.guid].title }` : `[${item.description}] ${item.title}`
        // const title = `[${item.description}] ${item.title}`
        // TODO: Fetch sermon image from somewhere (other rss feed)
        let imageUrl = "https://allsaintscrowborough.org/Images/Content/1901/Thumbnail/1346597.jpeg"
        if (item.guid) {
            const secondaryItem = secondaryDict[item.guid]
            const thumbnail = secondaryItem["media:thumbnail"]
            if (thumbnail.url !== undefined) {
                imageUrl = thumbnail.url
            }
        }

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
