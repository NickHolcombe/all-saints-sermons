import RSS from "rss"

export async function GET() {
    const feed = new RSS({
        title: 'All Saints Church Crowborough',
        description: 'All Saints Church Crowborough Media',
        feed_url: 'https://all-saints-sermons.vercel.app/sermons',
        site_url: 'https://www.allsaintscrowborough.org',
        managingEditor: 'Nick Holcombe',
        webMaster: 'Nick Holcombe',
        copyright: `Copyright ${new Date().getFullYear().toString()}, Nick Holcombe`,
        language: 'en-US',
        categories: ['Sermon Media'],
        pubDate: new Date().toUTCString(),
        ttl: 60,
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
                            text: 'Sermon Media'
                        }},
                ]}
        ]
    });

    /* loop over data and add to feed */
    feed.item({
        title:  '[Advent 2024] The seals',
        description: 'Advent 2024 sermon series description',
        url: 'https://www.allsaintscrowborough.org/Media/Player.aspx?media_id=334330&amp;fullpage=True', // link to the item
        date: 'Sun, 15 Dec 2024 12:00:00 GMT', // any format that js Date can parse.
        guid: 'm_334330',
        custom_elements: [
            {'itunes:author': 'Pete Winstone'},
            {'itunes:subtitle': 'Sermon subtitle'},
            {'itunes:summary': 'Advent 2024 sermon series summary'},
            {'itunes:duration': '00:28:23'},
            {'itunes:image': {
                    _attr: {
                        href: 'https://raw.githubusercontent.com/AllSaintsCrowborough/sermon-feed/refs/heads/main/revelation.jpg'
                    }
                }},
            {'enclosure url="https://s3.us-east-1.amazonaws.com/media.1901.churchinsight.com/de2b5166-1ce4-4838-8a16-8a29f9d2c808.mp3" length="14037045" type="audio/mpeg"': {}}
        ]
    });

    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
