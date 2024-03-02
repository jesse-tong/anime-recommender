import { useState, useRef, forwardRef } from "react";
import { Form, useNavigate } from "react-router-dom";
import StarInput  from './StarInput';

const NewComment = forwardRef(function NewComment(props, ref){
    
    const [editable, setEditable] = useState(true);
    const [commentData, setCommentData] = useState({ comment: '', rating: '0'});
    
    const saveButton = (
        <button className={"btn btn-primary" + (editable ? ' hidden ': '')} type='submit' 
        aria-hidden={editable ? 'true': 'false'}>Add comment</button>
    );
    const editButton = (
        <button className={"btn btn-primary" + (editable ? '': ' hidden ')} onClick={e => setEditable(editable => !editable)} type="button" 
        aria-hidden={editable ? 'false': 'true'}>Edit comment</button>
    );
    return (
        <Form className="form m-auto w-100 border-primary-subtle rounded" onSubmit={(e) => props.newCommentSubmit(e)}>
            
            <div className="form-group mb-2">
                <label className="form-label" htmlFor='rating'>Rating: {commentData.rating}</label>
                {/*<input type='range' name='rating' className={'form-range' + (editable ? '' : ' ')} min='0' max='10' step='1' 
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, rating: e.target.value})); 
                        ref.current = {...ref.current, rating: e.target.value};
                    }}
                value={commentData.rating} ></input>*/}
                <StarInput name={'rating'} icon={'star'} className={'form-range' + (editable ? '' : ' ')} max={'10'} step={'1'}
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, rating: e.target.value})); 
                        ref.current = {...ref.current, rating: e.target.value};
                    }} value={commentData.rating}/>
                <label className="form-label" htmlFor='comment'>Comment: </label>
                <textarea name='comment' rows='5' className={'form-control overflow-scroll' + (editable ? '' : ' bg-white disabled')} 
                onChange={(e) => 
                    {
                        setCommentData(oldState => ({ ...oldState, comment: e.target.value})); 
                        ref.current = {...ref.current, comment: e.target.value};
                    }}
                value={commentData.comment} ></textarea>
            </div>
            <div className="d-flex flex-row align-content-between form-group">
                {saveButton}
            </div>
        </Form>
    );
});

export default NewComment;