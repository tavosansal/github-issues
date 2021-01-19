import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [reactIssues, setReactIssues] = useState<any[]>([]);
  const [typescriptIssues, setTypescriptIssues] = useState<any[]>([]);
  const [graphqlIssues, setGraphqlIssues] = useState<any[]>([]);

  function sortResultsByTitle(a:any, b:any) {
    const nameA = a.title.toUpperCase();
    const nameB = b.title.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  function cleanupAndSortResults(items: any) {
    return items.filter((item: any) => !Object.keys(item).includes('pull_request')).sort(sortResultsByTitle);
  }

  useEffect(() => {
    async function fetchData() {
      const fetchReactIssues = fetch('https://api.github.com/repos/facebook/react/issues');
      const fetchTypescriptIssues = fetch('https://api.github.com/repos/microsoft/typescript/issues');
      const fetchGraphqlIssues = fetch('https://api.github.com/repos/graphql/graphql-js/issues');
      const [reactResponse, typescriptResponse, graphqlResponse] = await Promise.all([fetchReactIssues, fetchTypescriptIssues, fetchGraphqlIssues]);
      
      setReactIssues(cleanupAndSortResults(await reactResponse.json()));
      setTypescriptIssues(cleanupAndSortResults(await typescriptResponse.json()));
      setGraphqlIssues(cleanupAndSortResults(await graphqlResponse.json()));
    }
    fetchData();
  }, []);

  return(
    <div className="bg-gray-200 p-8 items-center justify-center antialiased text-gray-900">
      <div className="bg-white p-6 rounded-lg">
        <h2>React Issues</h2>
        {reactIssues.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg border hover:bg-gray-200">

           <a className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5" href={item.html_url} target="_blank">
              <img src={item.user.avatar_url} alt="avatar" width="160" height="160" className="flex-none w-20 h-20 rounded-lg bg-gray-100" />
              <div className="min-w-0 flex-auto space-y-0.5">
                <h2 className="text-base sm:text-xl lg:text-base xl:text-xl font-semibold truncate">
                  {item.title} (#{item.number})
                </h2>
                <a className="text-gray-500 text-base text-sm hover:underline" href={`https://github.com/${item.user.login}`} target="_blank" rel="noopener noreferrer">
                  Opened By: <span className="text-md font-bold">{item.user.login}</span>
                </a>
              </div>
            </a>
          </div>
        ))}
      </div>
      <br />
      <br />
      <br />
      <ul>
      <p>
        {typescriptIssues.length}
      </p>
      {typescriptIssues.map(item => (
          <li key={item.id}>
            {item.id} {item.title}
          </li>
        ))}
      </ul>

      <br />
      <br />
      <br />
      <p>
        {graphqlIssues.length}
      </p>
      <ul>
      {graphqlIssues.map(item => (
          <li key={item.id}>
            {item.id} {item.title}
          </li>
        ))}
      </ul>

    </div>
  )
}

export default App;
