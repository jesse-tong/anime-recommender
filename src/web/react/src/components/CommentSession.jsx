import { useState, useRef, forwardRef, useEffect } from "react";
import { Form, useNavigate } from "react-router-dom";
import axios from 'axios';
import CommentCard from "./CommentCard";
import NewComment from "./NewComment";


const CommentSession = forwardRef(function CommentSession(props, ref){
    var commentData = ref;
    const anime_id = props.anime_id;
    const userRole = props.role;


    var newComment = useRef({rating: '0', comment: ''});
    const navigate = useNavigate();


    function newCommentSubmit(event){
        event.preventDefault();

        axios.postForm('http://localhost:5000/api/comment-edit/' + anime_id, newComment.current)
        .then(response => {
            var response_data = response.data;

            if (response_data.success === true){
                alert('Add comment successfully');
                props.reloadComments(); //Signal parent component to refetch and rerender comment session
            }else {
                alert('Error adding comment: ', response_data.error);
            }
        }).catch(err => {
            alert('Error adding comment: ', err);
        })
    }

    function editCommentSubmit(event, index){
        event.preventDefault();

        axios.putForm('http://localhost:5000/api/comment-edit/' + anime_id, commentData.current[index])
        .then(response => {
            var response_data = response.data;

            if (response_data.success === true){
                alert('Edit comment successfully');
                props.reloadComments(); //Signal parent component to refetch and rerender comment session
            }else {
                alert('Error editting comment: ', response_data.error);
                props.reloadComments(); //Signal parent component to refetch and rerender comment session
            }
        }).catch(err => {
            alert('Error editing comment: ', err);
            props.reloadComments(); //Signal parent component to refetch and rerender comment session
        })
    }

    function deleteCommentSubmit(event, index){
        event.preventDefault();

        axios.delete('http://localhost:5000/api/comment-edit/' + anime_id, 
        { 
            data: commentData.current[index],
            headers: {
                'Content-Type': 'multipart/form-data'
            }
         })
        .then(response => {
            var response_data = response.data;

            if (response_data.success === true){
                alert('Delete comment successfully');
                props.reloadComments(); //Signal parent component to refetch and rerender comment session
            }else {
                alert('Error deleting comment: ', response_data.error);
                props.reloadComments(); //Signal parent component to refetch and rerender comment session
            }
        }).catch(err => {
            alert('Error deleting comment: ', err);
            props.reloadComments; //Signal parent component to refetch and rerender comment session
        })
    }

    const commentElements = [];
    for (let i = 0; i < commentData.current.length; i++){
        commentElements.push(
            <CommentCard ref={commentData} key={'comment-' + i} role={userRole || ''}
            editCommentSubmit={editCommentSubmit} deleteCommentSubmit={deleteCommentSubmit} index={i}/>
        );
    }
    return (
        <>
        <div className='d-flex align-content-center container'><h4>New comment: </h4></div>
            <NewComment ref={newComment} newCommentSubmit={newCommentSubmit} anime_id={anime_id}/>
        <div className='d-flex align-content-center container'><h3>Comments: </h3></div>
            {commentElements}
        </>
    );

});

export default CommentSession;