import { useLoaderData } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
import { maxPerPage, maxPagination } from '../global/globalVars';
import AnimeCard from './AnimeCard';
import './../../public/custom.css'

export default function PaginatedPage(props){
    const data = props.data
    const [currentPage, setPage] = useState(1);
    
    const maxPages = Math.max(1, Math.ceil(data.length/maxPerPage) );

    function prevPage(event){
        if (currentPage > 1){
            setPage(currentPage - 1);
        }
    }

    function nextPage(event){
        if (currentPage < maxPages){
            setPage(currentPage + 1);
        }
    }

    function handlePageButtonClick(event, page){
        setPage(page);
    }

    function getDataForPage(page){
        return data.slice((page-1)*maxPerPage
            , Math.min(data.length + 1, page*maxPerPage));
    }

    const pageData = getDataForPage(currentPage);
    const paginationBlock = Math.floor((currentPage-1) / maxPagination); 
    
    const startPagination = maxPagination * paginationBlock + 1;
    const endPagination = Math.min((paginationBlock + 1) * maxPagination, maxPages);
    const pageElements = pageData.map((value, index)=> {
        return (
        <div key={'card-anime' + index} className={'col-sm-12 col-md-6 col-lg-6 col-xl-4 anime-card-container my-3 my-md-2 ' + (index=== 0 ? ' h-100' : '')}>
            <AnimeCard anime={value} key={'anime' + index}/>
        </div> );
    });
    var paginationElement = new Array(endPagination - startPagination + 1);

    for (let i = 0; i < endPagination - startPagination + 1; i++) { paginationElement[i] = startPagination + i;}
    paginationElement = paginationElement.map((page, index)=> {
        
        return (
            
            <li className={'page-item pointer-cursor' + ((page) == currentPage ? ' active ' : '')}
             onClick={(e)=> handlePageButtonClick(e, page)} key={'page-' + index} >
                <span className='page-link'>{page}</span>
            </li>
        );
    })
    return (
        <>
          <div className='d-flex flex-row align-baseline' >
            <ul className='pagination my-3'>
                <li className={'page-item pe-auto' + (currentPage == 1 ? ' disabled ' : ' pointer-cursor ')} onClick={prevPage} ><span className='page-link'>{'<<'}</span></li>
                {paginationElement}
                <li className={'page-item pe-auto' + (currentPage == maxPages ? ' disabled ' : ' pointer-cursor ')} onClick={nextPage} ><span className='page-link'>{'>>'}</span></li>
            </ul>
          </div>
          <div className='row mx-md-2 align-stretch'>
            {pageElements}
          </div>
          
        </>
    );
}