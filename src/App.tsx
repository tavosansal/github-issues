import React from 'react';
import './App.css';
import IssuesList from './IssuesList';

function App() {
  const repos = [{
    title: 'React',
    repoUrl: 'https://api.github.com/repos/facebook/react/issues',
  }, {
    title: 'Typescript',
    repoUrl: "https://api.github.com/repos/microsoft/typescript/issues",
  }, {
    title: 'GraphQL',
    repoUrl: 'https://api.github.com/repos/graphql/graphql-js/issues',
  }]

  return (
    <div className="bg-gray-200 p-8 items-center justify-center antialiased text-gray-900">
      {repos.map(repo => (
        <IssuesList title={repo.title} repoUrl={repo.repoUrl} key={repo.title}/>
      ))}
    </div>
  )
}

export default App;
