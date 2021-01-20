import { useEffect, useState, MouseEvent } from 'react';
import GithubIssue from './interfaces/GithubIssue';

interface IssuesListProps {
  title: string;
  repoUrl: string;
  color: string;
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


export default function IssuesList({ title, repoUrl, color }: IssuesListProps) {
  const [issuesList, setIssuesList] = useState<GithubIssue[]>([]);

  useEffect(() => {
    async function fetchData() {
      const results = await fetch(repoUrl);

      setIssuesList(cleanupAndSortResults(await results.json()));
    }
    fetchData();
  }, []);

  function removeItem(itemToRemove:GithubIssue, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const newList = issuesList.filter((item: GithubIssue) => item.id !== itemToRemove.id);
    setIssuesList(newList);
  }

  function openInNewTab(url: string, event: MouseEvent) {
    event.stopPropagation();
    window.open(url, '_blank');
  }

  // There might be a better way to do this. But postcss removes dynamic usasges of classes for color so usages need to be static.
  let backgroundColor = '';
  if (color === 'green') {
    backgroundColor = 'bg-green-200';
  }
  if (color === 'purple') {
    backgroundColor = 'bg-purple-200';
  }
  if (color === 'pink') {
    backgroundColor = 'bg-pink-200';
  }

  return (
    <div className="bg-white p-6 rounded-lg mb-10">
      <h2 className="font-bold text-xl mb-5">
        {title} Issues
      </h2>
      {issuesList.map(item => (
        <div key={item.id} className={`p-4 rounded-lg border hover:${backgroundColor} mb-5`}>
          <div className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5 cursor-pointer" onClick={(e) => openInNewTab(item.html_url, e)}>
            <img src={item.user.avatar_url} alt="avatar" width="160" height="160" className="flex-none w-20 h-20 rounded-lg bg-gray-100" />
            <div className="min-w-0 flex-auto space-y-0.5">
              <h3 className="text-base sm:text-xl lg:text-base xl:text-lg font-semibold truncate">
                {item.title} (#{item.number})
              </h3>
              <div className="text-gray-500 text-base text-sm hover:underline" onClick={(e) => openInNewTab(`https://github.com/${item.user.login}`, e)}>
                Opened By: {' '}
                <span className="text-md font-bold">
                  {item.user.login}
                </span>
              </div>
            </div>
            <button className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-500" onClick={(e) => removeItem(item, e)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
