import { useState,useEffect } from "react";

export default function Card ({pokedex}) {

    const [sprites,setSprites] = useState([{
        name: "",
        sprite: "",
        isLoaded: false,
        isFlipped: false
    }]);
    const [data,setData] = useState([{
        name: "",
        sprite: "",
        isLoaded: false,
        isFlipped: false
    }]);
    const [gameOver,setGameOver] = useState(false);
    const [winner,setWinner] = useState(false);
    const [shuffledPokedex, setShuffledPokedex] = useState([]);
    // const [flippedCards,setFlippedCards] = useState([]);
    const [flipping, setFlipping] = useState("cards");
    const [refresh, setRefresh] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);

    
    useEffect(() => {
      // Shuffle the pokedex array once when the component is mounted or refreshed
      function shuffleArray (array,count) {
        const shuffled = [...array];
        for(let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0,count);
      }
      
      setShuffledPokedex(shuffleArray(pokedex,4));

      
    }, [pokedex]);

    if(refresh) {
        const shuffled = [...shuffledPokedex];
        for(let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setRefresh(false);
        setShuffledPokedex(shuffled);
    }

    

    useEffect( () => {
        async function fetchSprites () {
            const spritePromises = shuffledPokedex.map( async (pokemon) => {
                let apiUrl = pokemon.url;
                const response = await fetch(apiUrl);
                const data = await response.json();
                return {
                    name: data.name, 
                    sprite: data.sprites.front_default,
                    isLoaded:true
                };
            }
            );

            const spriteData = await Promise.all(spritePromises);
            const spriteMap = {};
            spriteData.forEach((pokemon) => {
              spriteMap[pokemon.name] = pokemon.sprite;
            });
            setSprites(spriteMap);
            setData(spriteData);
        }

    fetchSprites();
    },[shuffledPokedex]);

    const flipCard = (pokemon) => {

        if(pokemon.isFlipped) {
            setGameOver(true);
            setCurrentScore((currentScore) => currentScore == 0);
            if(bestScore>currentScore){
                setBestScore(bestScore);
            } else {
                setBestScore(currentScore);
            }
        } else {
            setCurrentScore((currentScore) => currentScore+1);
            setFlipping("cards flipping");
            pokemon.isFlipped = true;
            setRefresh(true);
            if (currentScore === shuffledPokedex.length-1) {
                setBestScore(currentScore+1);
                setWinner(true);
            } 
        }
            
            setInterval(function () {
                setFlipping("cards");
            }, 2000);


    };

    function playAgain () {
        setCurrentScore(0);
        setGameOver(false);
        setWinner(false);
        shuffledPokedex.forEach((pokemon) => {
            pokemon.isFlipped = false;
          });
        clearInterval();
        
        const shuffled = [...pokedex];
        for(let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setShuffledPokedex(shuffled.slice(0,4));
    }

   

    return (
        <>
        <div className="scoreBoard">
            <h1>Best Score: {bestScore}</h1>
            <h1>Score: {currentScore}</h1>
        </div>
            <div className="cardContainer">
                {
                    winner ? ( 
                        <div className="gameOver">
                        <h1>You Won!</h1>
                        <button onClick={playAgain}>Play Again</button>
                        </div>
                    )
                    :(
                    gameOver ? (
                        <div className="gameOver">
                            <h1>Game Over</h1>
                            <button onClick={playAgain}>Try Again</button>
                        </div>
                    ) : (
                        shuffledPokedex.map( (pokemon) => (
                        <div key={pokemon.name} className={flipping} onClick={()=>flipCard(pokemon)}>
                            <h2>{pokemon.name}</h2>
                            <img draggable="false" src={sprites[pokemon.name]} alt="" />
                        </div>
                        ))
                    )
                    )
                }
            </div>
        </>
    );
}