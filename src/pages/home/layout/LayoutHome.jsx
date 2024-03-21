import React, { useEffect, useState } from 'react';
import css from './layout.module.scss';
import Header from '../header/Header';
import Card from '../../card/Card';
import axios from 'axios';
import * as FaIcons from "react-icons/fa";
import { URL_POKEMON } from '../../../api/apiRest';


export default function LayoutHome() {

    const [arrayPokemon, setArrayPokemon] = useState([]);
    const [globalPokemon, setGlobalPokemon] = useState([]);
    const [xpage, setXpage] = useState(1);
    const [search, setSearch] = useState(' ');
    
    useEffect(() => {

        const api = async () => {

            const limit = 15;
            const xp = (xpage -1) * limit;

            const apiPoke = await axios.get(`${URL_POKEMON}/?offset=${xp}&limit=${limit}`);
            setArrayPokemon(apiPoke.data.results)
        }

        api();
        getGlobalPokemons();

        

    }, [xpage]);

    const getGlobalPokemons = async () => {
        const res = await axios.get(`${URL_POKEMON}?offset=0&limit=1000`);
        const promises = res.data.results.map( (pokemon) => {return pokemon;});

        const results = await Promise.all(promises);
        setGlobalPokemon(results);
    };

    const filterPokemons = (search[0] !== ' ' && search.length > 0)
    ? globalPokemon.filter(pokemon => pokemon?.name?.includes(search))
    : arrayPokemon;

    
    const obtenerSearch = (e) => {
        const texto = e.toLowerCase();
        setSearch(texto);
        setXpage(1);
    };

  return (
    <div className={css.layout}> 
        <Header obtenerSearch={obtenerSearch}/>

        <section className={css.section_paginacion}>
            <div className={css.div_paginacion}>
            <span className={css.double_item_izquierdo}
            onClick={()=> {
                setXpage(1);
            }}> 
            <abbr title="Página 1"><FaIcons.FaAngleDoubleLeft /></abbr>
            </span>

                <span className={css.item_izquierdo}
                onClick={()=> {
                    if (xpage === 1) {
                        return console.log("Primera página.")
                    } else {
                        setXpage(xpage - 1);
                    }
                }}><abbr title="Atrás"> <FaIcons.FaAngleLeft />{" "} </abbr>
                </span>
                <span className={css.item}> {xpage} </span>
                <span className={css.item}> DE </span>
                <span className={css.item}> {Math.round(globalPokemon?.length /15)}</span>
                <span className={css.item_derecho}
                onClick={()=> {
                    if (xpage === 67) {
                        return console.log("Última página.")
                    } else {
                        setXpage(xpage + 1);
                    }
                }}><abbr title="Siguiente">
                    {" "}
                    <FaIcons.FaAngleRight />{" "} </abbr>
                </span>
                <span className={css.double_item_derecho}
                onClick={() => {
                    setXpage(67);
                }}> 
                    <abbr title="Página 67"><FaIcons.FaAngleDoubleRight /></abbr>
                </span>
            </div>
        </section>

        <div className={css.card_content}>
            {filterPokemons.map((card, index) => {
                return <Card key={index} card={card} />
            })}
        </div>
    </div>
  )
}
