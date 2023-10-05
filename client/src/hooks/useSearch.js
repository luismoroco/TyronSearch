import { useState, useEffect, useRef } from "react";

// ver lo que sucede cada ves que se cambia el search
export function useSearch () {
  const [search, updateSearch] = useState ('');
  const isFirstInput = useRef(true); // no considerar la primera visita

  useEffect(()=>{
    if(isFirstInput.current){
      //si es el primer input del usuario . va cambiar su valor si search es vacio
      isFirstInput.current = search === ' ';
      return
    }
  }, [search])

  return { search, updateSearch }
}