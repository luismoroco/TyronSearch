import { useResults } from './hooks/useResults';
import { useSearch } from './hooks/useSearch';
import { Results } from './components/Results';
import { useCallback } from 'react';
import debounce from 'just-debounce-it';

function App() {
  const { search, updateSearch } = useSearch();
  const { results, getResults, loading } = useResults({search});

  const debounceGetMovies = useCallback(
    debounce(search =>{
      getResults({search})
    },300)
    , [getResults]
  )

  const handleSubmit = (event) =>{
    event.preventDefault();

    getResults({search});
  }

  const handleChange = (event) => {
    const newQuery = event.target.value;
    if (newQuery.startsWith(' ')) return 
    updateSearch (event.target.value);
    debounceGetMovies(newQuery);
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#ede8c5]">
      <div className='flex flex-col max-w text-center w-3/6'>
        <h1 className="font-bold text-6xl tracking-wide text-[#224768]" >TyronSearch</h1> 
        <div className='mt-6'>
          <form className='form' onSubmit={handleSubmit}>
            <input className="px-2 rounded-2xl shadow-lg font-medium h-9 w-3/6" onChange={handleChange} value={search} name='query' placeholder='¿Qué quieres buscar?'/>
            <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mx-2'>Buscar</button>
          </form>
        </div>
        <div>
        {
          loading ? <p>Cargando...</p> : <Results results={results}/> 
        }
        </div>
        
      </div>
    </section>
  )
}

export default App
