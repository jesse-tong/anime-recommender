import { useLoaderData } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import AnimeCard from './AnimeCard';
import PaginatedPage from './PaginatedPage';
import { checkUserRole } from './../controller/CheckUserRole';
import CommentSession from './CommentSession';
import axios from 'axios';

export async function loadRecommendedAnime({request, params}){
    const mal_id = params.mal_id;
    var query_anime_details = await fetch('http://localhost:5000/api/' + mal_id).then(data => data.json()).catch(err => {});
    var recommended_anime_details = await fetch('http://localhost:5000/api/recommend/' + mal_id).then(data => data.json()).catch(err => []);
    /* Fetch recommended anime from backend (Flask) here and return */
    
    
    var role = await checkUserRole();
    
    return { query_anime_details, recommended_anime_details, role };
}

export default function Recommend(){
    const { query_anime_details, recommended_anime_details, role} = useLoaderData();
    const anime_id = query_anime_details.anime_id;
    const [signalReload, reloadComment] = useState(true);
    const [comments, setComments] = useState(null);
    const commentData = useRef(null);

    const sendReloadSignal = () => {
      //Change signalReload so that useEffect fetch again and setComments
      console.log('Reload');
      reloadComment((state) => !state);
      
    }

    useEffect(()=> {
      
      axios.get('http://localhost:5000/api/comment/' + anime_id)
      .then(
        (response) => {  
          if (response.status == 200){
            setComments(response.data);
            commentData.current = response.data;
          }else {
            setComments(new Array());
            commentData.current = new Array();
          }
        }
      ).catch(err => { setComments(new Array()); commentData.current = new Array(); });
    }, [signalReload]);

    console.log(comments);
    //We shouldn't pass the initial state to the component as a prop because the getInitalState method is only
    //called the first time the component renders.Never more. Meaning that, if you re-render
    //that (parent) component passing a different value as a prop. the component will not react accordingly
    //because the (child) component will keep the state from the first time it was rendered. It's very error prone
    //So instead, use componentWillReceiveProps (class component), or useEffect will props dependencies (functional components)
    // instead (see CommentSession.jsx)
    var commentSession = comments !== null ? (
      <CommentSession ref={commentData} anime_id={anime_id} role={role} reloadComments={sendReloadSignal}/>
    ) : ( <div><p>Loading comments...</p></div>);

    return (
        <>
          <div className='container vh-50 align-content-center d-flex flex-column justify-content-center m-2'>
            <div className='col-sm-12 col-md-6'>
              <AnimeCard anime={query_anime_details} key='main-anime'/>
            </div>
          </div>
          
          <div className='d-flex align-content-center container'><h3>Recommended animes for you: </h3></div>
          <PaginatedPage data={recommended_anime_details} />
          {commentSession}
        </>
    );
}