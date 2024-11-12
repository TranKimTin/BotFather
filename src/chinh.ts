import axios from 'axios';

const url = 'https://s3.coinmarketcap.com/generated/core/crypto/cryptos.json';

interface CryptoResult {
    id: number | null;
    slug: string | null;
}

async function getIdAndSlug(symbol: string): Promise<CryptoResult> {
    try {
        const processedSymbol = symbol.toUpperCase().replace(/USDT$/i, '');
        const response = await axios.get(url);
        const data = response.data;

        if (!Array.isArray(data.fields) || !Array.isArray(data.values)) {
            console.error("Unexpected data structure:", data);
            return { id: null, slug: null };
        }

        const symbolIndex = data.fields.indexOf("symbol");
        const idIndex = data.fields.indexOf("id");
        const slugIndex = data.fields.indexOf("slug");

        if (symbolIndex === -1 || idIndex === -1 || slugIndex === -1) {
            console.error("Fields 'symbol', 'id', or 'slug' not found in data structure.");
            return { id: null, slug: null };
        }

        const matchingItem = data.values.find((item: any[]) => item[symbolIndex] === processedSymbol);

        if (matchingItem) {
            return {
                id: matchingItem[idIndex],
                slug: matchingItem[slugIndex]
            };
        } else {
            console.log(`Symbol ${symbol} not found.`);
            return { id: null, slug: null };
        }
    } catch (error) {
        console.error("Error fetching ID and slug:", error);
        return { id: null, slug: null };
    }
}

async function getMarketCap(id: number): Promise<number | null> {
    try {
        const response = await axios.get(`https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/lite?id=${id}`);
        const data = response.data;

        if (data && data.data && data.data.statistics && typeof data.data.statistics.marketCap === 'number') {
            return data.data.statistics.marketCap;
        } else {
            console.error("Market Cap data not found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching Market Cap:", error);
        return null;
    }
}

function isMarketCapLessThanMax(marketCap: number | null, maxMarketCap: number): boolean {
    if (marketCap == null) return false;
    return marketCap < maxMarketCap;
}

async function getInvestorsNames(slug: string | null): Promise<string> {
    try {
        const response = await axios.get(`https://api.cryptorank.io/v0/coins/${slug}/investors-list`);
        const data = response.data;

        if (!data || !Array.isArray(data.investors)) {
            console.error("Unexpected data structure:", data);
            return '';
        }


        const investorNames = data.investors
            .filter((investor: any) => investor.isLead === true)
            .map((investor: any) => investor.name)
            .join(' , ');
        return investorNames;
    } catch (error) {
        console.error("Error fetching investors:", error);
        return '';
    }
}




(async () => {
    const id = 30449;
    const marketCap = await getMarketCap(id);
    console.log("Market Cap:", marketCap);
    console.log(isMarketCapLessThanMax(marketCap, 200000000));
})();

(async () => {
    const symbol = 'TNSRUSDT';
    const result = await getIdAndSlug(symbol);
    console.log("Result:", result);

    const investorNames = await getInvestorsNames(result.slug);
    console.log("Investor Names:", investorNames);
})();


