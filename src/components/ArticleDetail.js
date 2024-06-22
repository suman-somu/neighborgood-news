import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const decodedUrl = decodeURIComponent(id);
    const article = useSelector(state =>
        state.news.articles.find(article => article.url === decodedUrl)
    );

    if (!article) {
        return <div className="text-center text-gray-600">Article not found</div>;
    }

    const cleanContent = (text) => {
        if (!text) return '';
        return text.replace(/\[\+\d+ chars\]$/, '').trim();
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <LazyLoadImage
                src={article.urlToImage || '/placeholder-image.jpg'}
                alt={article.title}
                effect="blur"
                className="w-full h-80 object-cover"
            />
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                    {article.title}
                </h1>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                    {cleanContent(article.content)}
                </p>
                <div className="flex justify-between items-center">
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                    >
                        Read full article on {new URL(article.url).hostname}
                    </a>
                    <Link
                        to="/"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;