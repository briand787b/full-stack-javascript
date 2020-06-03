import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import articles from './article-content';
import NotFoundPage from './NotFoundPage'

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({  upvotes: 0, comments: []});
    const { name } = useParams();

    useEffect(() => {
        setArticleInfo({ upvotes: 3 })
    }, []);

    const article = articles.find(article => article.name === name );

    return article 
        ? (
        <>
        <h1>{article.title}</h1>
        <p>This article has {articleInfo.upvotes} upvotes</p>
        {article.content.map((paragraph, id) => (
            <p key={id}>{paragraph}</p>
        ))}
        </>
    ) : (
        <NotFoundPage/>
    );
}

export default ArticlePage;