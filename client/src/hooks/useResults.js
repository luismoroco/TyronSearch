import { useState, useRef, useMemo, useCallback } from 'react';

import responsiveResults from '../mocks/result.json';
import noReult from '../mocks/noReult.json';

//consultamos los json

export function useResults ({ search }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const ress = results;

  const mappedResults = ress?.map(it =>({
    id: it.id,
    url: it.url,
    title: it.title,
    text: it.text
  }));

const getResults =() =>{
  if(search){
    setResults(responsiveResults.filter((item) =>{
      return search.toLowerCase() === ''? item:item.text.toLowerCase().includes(search);
    }));
  } else {
    setResults(noReult);
  }
}
  return { results: mappedResults, getResults, loading }

}