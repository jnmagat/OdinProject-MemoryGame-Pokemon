import { useEffect } from "react";
import { useState } from "react";
import Card from "./Card";

export default function Characters () {

    let [pokedex, setPokedex] = useState([]);
 
    useEffect( () => {
       fetch('https://pokeapi.co/api/v2/pokemon/')
       .then( response => response.json())
       .then( (data) => {
            setPokedex(data.results);
        });
    },[]);
    
    return(
            <Card pokedex={pokedex} />
    );
}