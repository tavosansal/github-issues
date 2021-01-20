import { useEffect, useState } from 'react';
import GithubIssue from './interfaces/GithubIssue';

interface IssuesListProps {
  title: string;
  repoUrl: string;
}

function sortResultsByTitle(a: GithubIssue, b: GithubIssue) {
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

function cleanupAndSortResults(items: GithubIssue[]) {
  return items.filter((item: GithubIssue) => !Object.keys(item).includes('pull_request')).sort(sortResultsByTitle);
}


export default function IssuesList({ title, repoUrl }: IssuesListProps) {
  const [issuesList, setIssuesList] = useState<GithubIssue[]>([]);

  useEffect(() => {
    async function fetchData() {
      const results = await fetch(repoUrl);

      setIssuesList(cleanupAndSortResults(await results.json()));
    }
    fetchData();
  });

  return (
    <div className="bg-white p-6 rounded-lg mb-10">
      <h2 className="font-bold text-xl mb-5">
        {title} Issues
      </h2>
      {issuesList.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-lg border hover:bg-gray-200">
          <a className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5" href={item.html_url} target="_blank" rel="noopener noreferrer">
            <img src={item.user.avatar_url} alt="avatar" width="160" height="160" className="flex-none w-20 h-20 rounded-lg bg-gray-100" />
            <div className="min-w-0 flex-auto space-y-0.5">
              <h3 className="text-base sm:text-xl lg:text-base xl:text-lg font-semibold truncate">
                {item.title} (#{item.number})
              </h3>
              <a className="text-gray-500 text-base text-sm hover:underline" href={`https://github.com/${item.user.login}`} target="_blank" rel="noopener noreferrer">
                Opened By: 
                <span className="text-md font-bold">
                  {item.user.login}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <button className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-500">Remove</button>
          </a>
        </div>
      ))}
    </div>
  )
}
