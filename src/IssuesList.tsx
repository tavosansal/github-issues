import { useEffect, useState, MouseEvent } from 'react';
import GithubIssue from './interfaces/GithubIssue';

interface IssuesListProps {
  title: string;
  repoUrl: string;
  issuesHtmlUrl: string;
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


export default function IssuesList({ title, repoUrl, color, issuesHtmlUrl }: IssuesListProps) {
  const [issuesList, setIssuesList] = useState<GithubIssue[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const results = await fetch(repoUrl);
      setIssuesList(cleanupAndSortResults(await results.json()));
      setIsLoaded(true);
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

  function Loading() {
    return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="animate-spin h-5 w-5 mr-2 float-left">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        <span>Fetching Issues...</span>
      </div>
    );
  }

  let ListBody;
  if (!isLoaded) {
    ListBody = <Loading />;
  } else {
    ListBody = (
      issuesList.map(item => (
        <div key={item.id} className={`p-4 rounded-lg border hover:${backgroundColor} mb-5`}>
          <div className="flex items-center space-x-3.5 sm:space-x-5 lg:space-x-3.5 xl:space-x-5 cursor-pointer" onClick={(e) => openInNewTab(item.html_url, e)}>
            <img src={item.user.avatar_url} alt="avatar" width="160" height="160" className="flex-none w-20 h-20 rounded-lg bg-gray-100" />
            <div className="min-w-0 flex-auto space-y-0.5">
              <h3 className="text-base sm:text-xl lg:text-base xl:text-lg font-semibold truncate">
                {item.title} (#{item.number})
              </h3>
              <div className="text-gray-500 text-base text-sm hover:underline float-left" onClick={(e) => openInNewTab(`https://github.com/${item.user.login}`, e)}>
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
      ))
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg mb-10">
      <h2 className="font-bold text-xl mb-5">
        <a href={issuesHtmlUrl} target="_blank" rel="noopener noreferrer">
          {title} Issues
        </a>
      </h2>
      {ListBody}
    </div>
  )
}
