import { useState, useEffect, forwardRef } from "react";
import { Form} from "react-router-dom";
import { useTranslation } from "react-i18next";
import StarInput from './StarInput';

const CommentCard = forwardRef(function CommentCard(props, ref){
    const index = props.index;
    const role = props.role;
    const {t} = useTranslation();
    const [editable, setEditable] = useState(false);
    const [commentData, setCommentData] = useState(ref.current[index]);
    const hasEditPermission = (role === 'admin' || commentData.role === role);
    
    //If the comment data of ref.current change, rerender so that the comment card would not have the old value
    useEffect(()=> { setCommentData(ref.current[index]); }, [ref.current]);

    const saveButton = (
        <button className={"btn btn-success mx-sm-2 mx-md-3"} type='submit' hidden={!editable }
        aria-hidden={editable ? 'true': 'false'}>Save comment</button>
    );
    const deleteButton = (
        <button className={"btn btn-danger mx-sm-2 mx-md-3"} hidden={!editable } onClick={(e)=> props.deleteCommentSubmit(e, index)} 
        aria-hidden={editable ? 'true': 'false'}>Delete comment</button>
    );
    const editButton = (
        <button className={"btn btn-primary mx-sm-2 mx-md-3" }  onClick={e => setEditable(editable => !editable)} type="button" 
        aria-hidden={editable ? 'false': 'true'} hidden={!hasEditPermission} >Edit comment</button>
    );
    return (
        <Form className="form m-auto w-100 border-primary-subtle rounded mb-2" onSubmit={(e) => props.editCommentSubmit(e, index)}>
            <div className="input-group input-group-sm mb-2">
                <label className="input-group-text" htmlFor='id'>ID: </label>
                <input type='text' name='id' className={'form-control bg-white' + (editable ? '' : ' bg-white ')} onChange={(e) => 
                {
                    setCommentData(oldState => ({ ...oldState, id: e.target.value})); 
                    ref.current[index] = {...ref.current[index], id: e.target.value};
                }} 
                value={commentData.id} disabled={true}></input>

                <label className="input-group-text" htmlFor='name'>{t("name")}: </label>
                <input  type='text' name='username' className={'form-control bg-white' + (editable ? '' : ' bg-white ')} 
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, username: e.target.value})); 
                        ref.current[index] = {...ref.current[index], username: e.target.value};
                    }} 
                value={commentData.username} disabled={true}></input>
            </div>
            <div className="input-group input-group-sm mb-2">
                <label className="input-group-text" htmlFor='email'>{t("email")}: </label>
                <input  type='email' name='email' className={'form-control bg-white' + (editable ? '' : ' bg-white ')} 
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, email: e.target.value})); 
                        ref.current[index] = {...ref.current[index], email: e.target.value};
                    }}
                value={commentData.userEmail} disabled={true}></input>
                <label className="input-group-text " htmlFor='role'>{t("role")}: </label>
                <input  type='text' name='role' className={'form-control bg-white' + (editable ? '' : ' bg-white ')} 
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, role: e.target.value})); 
                        ref.current[index] = {...ref.current[index], role: e.target.value};
                    }}
                value={commentData.role} disabled={true}></input>
            </div>
            <div className="form-group mb-2">
                <label className="form-label" htmlFor='rating'>{t("rating")}: {commentData.rating}</label>
                {/* <input  type='range' name='rating' className={'form-range' + (editable ? '' : ' ')} min='0' max='10' step='1' 
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, rating: e.target.value})); 
                        ref.current[index] = {...ref.current[index], rating: e.target.value};
                    }}
                value={commentData.rating} disabled={!editable}></input> */}
                <StarInput name={'rating'} icon={'star'} className={'form-range' + (editable ? '' : ' ')} max={'10'} step={'1'}
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, rating: e.target.value})); 
                        ref.current[index] = {...ref.current[index], rating: e.target.value};
                    }} value={commentData.rating} disabled={!editable}/>
                <label className="form-label" htmlFor='comment'>Comment: </label>
                <textarea name='comment' rows='5' className={'form-control overflow-scroll' + (editable ? '' : ' bg-white disabled')} 
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, comment: e.target.value})); 
                        ref.current[index] = {...ref.current[index], comment: e.target.value};
                    }}
                value={commentData.comment} disabled={!editable}></textarea>
            </div>
            <div className="form-group h-100">
                <div className="d-flex flex-row justify-content-between ">
                    {saveButton}
                    {editButton}
                    {deleteButton}
                </div>
            </div>
        </Form>
    );
});

export default CommentCard;