import dotenv from "dotenv";
import axios from 'axios';
import NewsAPI from 'newsapi';
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

export const fetchNews = function (intentData, sort, fromdate, todate, language, number) {
    console.log('-------------------------------------------------------------------------');
    console.log(language);
    return newsapi.v2.everything({
        q: intentData,
        sortBy: sort || 'relevancy',
        from : fromdate || '2024-07-25', 
        to : todate || '2024-08-05',
        language: language || 'en',
        pageSize: number || 5,
    })
   }

       
export const newsController = async (req, res) => {
    try {
        const intentData = req.body.q;

        const prompt = "You are a helpful assistant designed to output JSON. You need to fetch JSON for News api and take out the fields q i.e. query (topic of news), sortBy (possible values are = relevancy, popularity, publishedAt), pageSize (number of news), language (type of language for the news, The 2-letter ISO-639-1 code of the language you want to get headlines for. Possible options: ar de en es fr he it nl no pt ru sv ud zh), and again two parameters 'from' and 'to' from (A date and optional time for the oldest article allowed. This should be in ISO 8601 format (e.g. 2024-08-05 or 2024-08-05T04:17:37)) and to A date and optional time for the newest article allowed. This should be in ISO 8601 format (e.g. 2024-08-05 or 2024-08-05T04:17:37) if date are not mentioned keep it null, if any of the data is not mentioned then keep it null" + intentData;
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: prompt
                },
                {
                    role:"user",
                    content: intentData
                }
            ],
            model: "gpt-4o-2024-08-06",
            response_format: { "type": "json_object" },
            max_tokens: 200,
        });
        console.log(completion.choices[0].message.content);

        const jresponse = completion.choices[0].message.content;
        const jobject = JSON.parse(jresponse);

        const jsquery = jobject.q;
        const sortByjson = jobject.sortBy;
        const from = jobject.from;
        const to = jobject.to;
        const lang = jobject.language;
        const pgsize = jobject.pageSize;

        console.log('Query:', jsquery);
        console.log('Sort By:', sortByjson);
        console.log('fromdate:', from);
        console.log('todate:', to);
        console.log('Language:', lang);
        console.log('Page Size:', pgsize);


        const response = await fetchNews(jsquery,sortByjson,from,to,lang,pgsize);
        if (response) {
            console.log(response.articles);
        } else {
            console.log('No articles found.');
        }
        console.log(response);
        console.log(response.articles.length);

        return res.status(200).json({
            message: "successful!!",
            result: response.articles
        });

    } catch (err) {
        console.log(err);
        return res.status(404).json({
            message: err.message,
        });
    }
}
