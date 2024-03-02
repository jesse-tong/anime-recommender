"use client"
import { useLoaderData, Link } from 'react-router-dom';
import React, { useRef, useEffect } from 'react';
import PaginatedPage from './PaginatedPage';
import lodash, { head } from 'lodash';
import { colorGenerator, countValue } from './../global/utils';
import { useTranslation } from 'react-i18next';
import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, Label } from 'recharts';


export const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Studio count for top 20 popular animes',
      },
    },
  };


export async function loadPopularAnime({request, params}){
    
    var popularAnime = await fetch('http://localhost:5000/api/popular').then(data => data.json()).catch(err => {
        return [{error: err.message}];
    });
    var headerPageText = 'Most popular anime (August 2022)';
    return {popularAnime, headerPageText};
}

export async function loadTopScoreAnime({request, params}){
    var popularAnime = await fetch('http://localhost:5000/api/highest-rating').then(data => data.json()).catch(err => {
        return [{error: err.message}];
    });
    var headerPageText = 'Highest rating anime (August 2022)';
    return {popularAnime, headerPageText};
}

export default function PopularPage(){
    const {t} = useTranslation();
    var {popularAnime, headerPageText} = useLoaderData();
    var topFiveAnime = lodash.slice(popularAnime, 0, 6);

    const carouselTopAnime = topFiveAnime.map((value, index) => {
        return (
        <div className={'carousel-item' + (index === 0 ? ' active ' : '')} key={'carouselAnime' + index}>
            <Link to={'/recommend/' + (value.anime_id | '')} className='m-auto justify-content-center'>
                <img src={value.main_pic || ''} className='w-100' alt={value.title}></img>
                <div className='carousel-caption d-block'><h3 className='text-white'>{value.title}</h3></div>
            </Link>
        </div>);
    });

    const carouselIndicatorButtons = topFiveAnime.map((value, index)=>{
        let ariaProps = new Map; if (index === 0) { ariaProps.set('aria-current', 'true') }
        ariaProps.set('aria-label', 'Top ' + (index+1) + ' most popular anime: ' + (value.title || ''))
        return (
        <button type='button' data-bs-target='#topAnimeCarousel' 
        data-bs-slide-to={index} {...ariaProps}
        className={index === 0 ? 'active' : ''} key={'carousel-button-' + index}>
        </button>
        );
    });

    var popularAnimeStudioSplit = lodash.cloneDeep(popularAnime);
    popularAnimeStudioSplit = popularAnimeStudioSplit.map(value => {
        let newValue = value;
        newValue['studios'] = newValue['studios'].split('|');
        return newValue;
    });
    var studio = countValue(popularAnimeStudioSplit);
    var studioCount = new Array();
    studio.forEach((value, key) => { 
        var studioObj = {};
        studioObj.name = key;
        studioObj.count = value;
        studioCount.push(studioObj);
     });   

    return (
        <>
            <div className='carousel slide mx-auto w-50 mb-2' id='topAnimeCarousel' key='topAnimeCarousel' data-bs-ride='carousel'>
                <div className='carousel-indicators'>
                    {carouselIndicatorButtons}
                </div>
                <div className='carousel-inner'>
                    {carouselTopAnime}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#topAnimeCarousel" data-bs-slide="prev" title='Previous page'>
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">{t('previous')}</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#topAnimeCarousel" data-bs-slide="next" title='Next page'>
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">{t('next')}</span>
                </button>
            </div>
            
            <h3 className='text-black m-3'>{headerPageText}</h3>
            <PaginatedPage data={popularAnime}/>
            <h5 className='text-center'>Studio count by Top 20 animes</h5>
            <ResponsiveContainer width='95%' height={325}>
                <BarChart  data={studioCount} margin={{bottom: 80, right: 25, top: 20}}>
                    <XAxis dataKey="name" interval={0} angle={-45} dy={50} style={{fontSize: '12px'}}/>
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>   
            </ResponsiveContainer>       
        </>
    );
}