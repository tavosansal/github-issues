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
  }, []);


  return (
    <div className="bg-white p-6 rounded-lg">
      <h2>{title} Issues</h2>
      {issuesList.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-lg border hover:bg-gray-200">
          <a className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5" href={item.html_url} target="_blank" rel="noopener noreferrer">
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
  )
}
