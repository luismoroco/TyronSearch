function ListOfResults ({ results }) {
  return (
    <ul>
      {
        results.map(result => (
          <li key={result.id} className="my-6">
            <h3 className="font-bold text-2xl tracking-wide text-black">{result.title}</h3>
            <a href={result.url} className="no-underline hover:underline text-blue-500">{result.url}</a>
            <p className="font-bold text-1xl tracking-wide text-black">{result.text}</p>
          </li>
        ))
      }
    </ul>
  )
}

export function Results ({ results }){
  const hasResults = results?.length > 0

  return (
    hasResults
      ? <ListOfResults results={results} />
      : null
  )
}