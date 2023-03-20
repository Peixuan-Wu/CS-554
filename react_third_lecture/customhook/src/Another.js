import React from 'react';
import useAxios from './useAxios';
function Another(props) {
  let {data, loading} = useAxios('https://pokeapi.co/api/v2/pokemon');
  return (
    <div className='App'>
      <div>
        {loading
          ? 'Loading...'
          : data.results.map((pokemon) => {
              return (
                <div key={pokemon.name} id={pokemon.id}>
                  {pokemon.name}
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Another;
