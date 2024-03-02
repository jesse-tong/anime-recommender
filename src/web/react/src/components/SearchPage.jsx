import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import PaginatedPage from './PaginatedPage'

export async function getSearchResult({request}){
    var searchAnime = new URL(request.url).searchParams.get('query');
    var foundAnimes = await fetch('http://localhost:5000/api/search?query=' + searchAnime).then(res => res.json());
    return {foundAnimes};
}

export default function SearchPage(){
    const { foundAnimes } = useLoaderData();

    const recommendAnimeElement = foundAnimes.map((value, index)=> {
        return (
        <div className='col-sm-12 col-md-6 col-lg-4 col-xl-3 anime-card-container'>
            <AnimeCard anime={value} key={'anime' + index} />
        </div> );
    });
    return (
        <>
          <h3 className='text-black'>Search Result: </h3>
          <PaginatedPage data={foundAnimes} />
        </>
    );
}