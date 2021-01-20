import GithubUser from './GithubUser';

export default interface GithubIssue {
  id: string;
  title: string;
  number: string;
  html_url: string;
  user: GithubUser;
}