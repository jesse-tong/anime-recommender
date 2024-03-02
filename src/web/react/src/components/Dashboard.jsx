import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { colorGenerator } from "../global/utils";
import {PieChart, Pie, Legend, Sector, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import ChangePasswordPage from './login/ChangePassword';

export function loadUser(){
    
}

export default function Dashboard(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [getCount, setCount] = useState(Array());

    const { t } = useTranslation();


    useEffect(()=>{

        axios.postForm('http://localhost:5000/auth/get-user-data', {
        username: ''
        }).then(data => {
            const userData = data.data;
            
            if (data.status != 200){
                alert('Error: ', data.statusText || '', ', Status code: ', data.status);
                navigate('/');
            }

            if (userData.success === true){
                setUser(userData);
                axios.get('http://localhost:5000/api/comment/user/' + userData.id)
                .then(data => {
                    var groupedComments = data.data;
                    var groupedCommentOfUserByAnime = new Map();
                    var commentCount = new Array();

                    for (let i = 0; i < groupedComments.length; i++){
                        let comment = groupedComments[i];
                        if (groupedCommentOfUserByAnime.has(comment['anime_id'])){
                            groupedCommentOfUserByAnime.set(comment['anime_id'], groupedCommentOfUserByAnime.get(comment['anime_id']) + 1);
                        }else {
                            groupedCommentOfUserByAnime.set(comment['anime_id'], 1);
                        }
                    }

                    groupedCommentOfUserByAnime.forEach((value, key)=>{
                        var entry = {};
                        entry['id'] = key;
                        entry['commentCount'] = value; 
                        commentCount.push(entry);
                    });

                    setCount(commentCount);

                }).catch(err => {});
            }
        }).catch(err => {
            return null;
        });
        
    }, []);

    var sum = 0; getCount.map(val => { sum += val['commentCount']; });

    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length){

            return (
                <div className="custom-tooltip bg-light p-2 rounded-2" style={{opacity: 0.85, fontSize: '12px'}}>
                    <p className="label">{`MyAnimeList ID: ${payload[0].name}`}</p> {/* namekey */}
                    <p className="intro">{`Your comment count: ${payload[0].value}`}</p> {/* First datakey*/}
                    <p className="desc">Lorem Ipsum</p>
                </div>
            );
        }
    }
    
    const colors = colorGenerator(getCount.length);
    const chart = (
        <ResponsiveContainer className='w-100 h-100' width="99%" height={225}>
        <PieChart className=""  margin={{top: 50, left: 80}}>
            <Pie 
            data={getCount} 
            cx={65} 
            cy={65}
            labelLine={false}
            innerRadius={40} 
            outerRadius={65}
            textAnchor='end'
            dataKey={'commentCount'}
            nameKey={'id'}
            fill={colors}   
            label
            >
            { 
            getCount.map((entry, index) => (
                <Cell fill={colors[index % colors.length]} key={`cell-${index}`} />
            ))
            }
            </Pie>
            <Tooltip cursor={false} content={customTooltip}/>
        </PieChart>
        </ResponsiveContainer>
    );

    const hasUserdata = (user != null);
    return hasUserdata ? (
        <div className="col">
            <div className="row-5">
                <div className="col-12 rounded-3 bg-light rounded-3 border border-success mb-2 mt-2 ml-3 px-3">
                    <div className="row align-content-center d-flex">
                        <h5>{t('username')}: {user.name}</h5>
                    </div>
                    <div className="row align-content-center d-flex">
                        <p>{t('id')}: <i>{user.id}</i></p>
                    </div>
                    <div className="row align-content-center d-flex">
                        <p>{t('email')}: <i>{user.email}</i></p>
                    </div>
                    <div className="row align-content-center d-flex">
                        <p>{t('role')}: <span className="badge bg-primary">{user.role.toLocaleUpperCase()}</span></p>
                    </div>
                </div>
            </div>
            <div className="row my-2 gx-5 gy-3" >
                <div className="col-12 col-md-6 px-3 my-2">
                    <div className="bg-light border border-success rounded">
                        <div className="">
                        {(user != null) ? chart : (<div>No chart available</div>)}
                        </div>
                        <div className=" ml-3 ">
                            <p>Comments: <span className="badge bg-primary">{sum}</span></p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 px-3 my-2">
                    <div className="bg-light rounded border border-primary">
                        <ChangePasswordPage />
                    </div>
                </div>
            </div>
            <div className="row-3 my-3">
                <div className="col-12 col-md-12 mx-1 px-3">
                    <div className="bg-light border border-primary rounded-3">
                        <p>Something</p>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div>Error loading userdata</div>
    );
}