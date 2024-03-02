import React from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function AnimeCard({anime}){
    const {t} = useTranslation();
   
    if (anime.genres !== null){
      var genreBadges = anime.genres.split('|').map((genre, index)=> (
          <span className='badge bg-info mx-1' key={genre + 'badge'}>{genre}</span>
      ));
    }else {
      var genreBadges = (
        <span className="badge bg-warning-subtle">N/A</span>
      );
    }
    return (
      <>
      <Link to={'/recommend/' + anime.anime_id } className="text-decoration-none">
      <div className='card' >
        <div className='row'>
          <img className='col-5 no-gutters card-img-top img w-50' src={anime.main_pic}
           alt={'Main picture of anime ' + anime.title} title={anime.title}/>
          <div className='col no-gutters mt-2'> 
            <div className='row'>
              <Link to={anime.anime_url ?? ('/recommend/' + anime.anime_id)} className="text-decoration-none">
                <h5>{anime.title}</h5>
              </Link>
            </div>
            <div className='row no-gutters'>
              <div className='col h-100 d-flex align-items-center text-center'>
                <div>
                  <p className='text-secondary'>{t("score")}</p>
                  <span className='badge bg-primary '>{anime.score}</span>
                  <span className='badge bg-primary '>{t("rank")} # {anime.score_rank}</span>
                </div>
                <div>
                 <p className='text-secondary'>{t("popularity")}</p>
                 <span className='badge bg-success'># {anime.popularity_rank}</span>
                </div>
              </div>
              
            </div>

            <div className='row mt-2'>
              <p className='text-black'>Studios: {anime.studios !== null ? anime.studios.replace('|', ', '): 'N/A'}</p>
            </div>
            <div className='row no-gutters'>
              <div id='genres'>
              {genreBadges}
              </div>
            </div>
            <div className='row no-gutters'>
              <p className='text-black mt-2'>Type: {anime.type}</p>
            </div>
          </div>
        </div>
      </div>
      </Link>
    </>
    );
}
