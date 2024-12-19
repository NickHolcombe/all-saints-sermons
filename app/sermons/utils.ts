import Parser from "rss-parser";

type CustomFeed = {foo: string};
type CustomItem = {
    description: string
    "itunes:author": string
    "itunes:summary": string
    "itunes:duration": string
    "media:thumbnail": { url: string }
};
type ASFeedType = CustomFeed & Parser.Output<CustomItem>

export const fetchASItunesFeed = async (): Promise<ASFeedType> => {
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
    return await parser.parseURL('https://www.allsaintscrowborough.org/Media/rss.xml');
}

export const fetchASSecondaryFeed = async (): Promise<{ [p: string]: CustomItem & Parser.Item }> => {
    const parser: Parser<CustomFeed, CustomItem> = new Parser({
        customFields: {
            feed: ['foo'],
            item: [
                'media:thumbnail'
            ]
        }
    });

    const dict: { [key: string]: CustomItem & Parser.Item } = {};

    const asSecondaryFeed = await parser.parseURL('https://www.allsaintscrowborough.org/Media/MediaXML.xml?fid=5170');
    asSecondaryFeed.items.forEach(item => {
        if (item.guid) {
            dict[item.guid] = item
        }
    })
    return dict
}
