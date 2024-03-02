import '../assets/StarRating.css';
import parse from 'style-to-object';

export default function StarRating({name, max, value, icon, step, className, onChange, disabled}){
    var typeString;
    if (icon === 'heart'){
        typeString = '--fill: #C8102E;--symbol:var(--heart);';
    }else {
        typeString = '--fill: gold;--symbol:var(--star);';
    }
    var styleString = typeString + `--stars:${max ?? '5'};--value:${value}`;
    var styleObj = parse(styleString);
    
    return (
        <input
        className={"rating rating--nojs" + className }
        max={max ?? '10'}
        style={styleObj}
        step={step ?? '1'}
        type="range"
        value={value ?? '1'} name={name ?? 'rating'} onChange={onChange} disabled={disabled} />
    );
}