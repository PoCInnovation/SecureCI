"use client";

import { useRef, useEffect, useState } from "react";
import Loading from "../../../src/components/ui/loading";
import { CircleAlert, ChevronsUp, GitGraph } from "lucide-react";
import { MutableRefObject } from "react";

interface Repository {
  id: string;
  name: string;
  owner?: {
      avatar_url: string;
      login: string;
  };
  version: string;
  LastPush : string;
  created_at: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  clone_url: string;
}

interface Commit {
  commit: {
    message: string;
    author: {
      date: string;
      avatar_url: string;
      login: string;
    };
  };
  html_url: string;
  author: string;
  commitDate: string;
  commitAuthor: {
    avatar_url: string;
    login: string;
  };
  commitMessage: string;
  commitUrl: string;
  repoName: string;
}

type FilterOption = 'Last Week' | 'Last Month' | 'Last Year' | 'All Time';


export default function Dashboard() {

  const [recentCommits, setRecentCommits] = useState<Commit[]>([]);
  const [dropDownOption, setDropDownOption] = useState('All time');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermCommits, setsearchTermCommits] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dropdownRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

  const handleClickOutside: (event: MouseEvent) => void = (event: MouseEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchRepositories: () => void = async () => {
      try {
        const reposResponse = await fetch('/api/repos/repository');
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories');
        }

        let repos: Repository[] = await reposResponse.json();

        const filters: Record<FilterOption, (repos: Repository[]) => Repository[]> = {
          'Last Week': (repos) => {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return repos.filter((repo) => new Date(repo.updated_at) > lastWeek);
          },
          'Last Month': (repos) => {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return repos.filter((repo) => new Date(repo.updated_at) > lastMonth);
          },
          'Last Year': (repos) => {
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);
            return repos.filter((repo) => new Date(repo.updated_at) > lastYear);
          },
          'All Time': (repos) => repos
        };

        const applyFilter = (repos: Repository[], dropDownOption: FilterOption): Repository[] => {
          const filterFunction = filters[dropDownOption];
          return filterFunction ? filterFunction(repos) : repos;
        };

        repos = applyFilter(repos, dropDownOption as FilterOption);
        setRepos(repos);

      } catch (error) {
        console.error(error);
      }
    };

    fetchRepositories();
  }, [dropDownOption]);

  useEffect(() => {
    const fetchCommits: () => void = async () => {
      try {
        const allCommits: Commit[] = [];
        const counts: { repoName: string }[] = [];

        for (const repo of repos) {
          let page = 1;

          const commitsResponse = await fetch(
            `api/repos/${repo.owner?.login}/${repo.name}/commit?per_page=100&page=${page}`
          );

          if (!commitsResponse.ok) {
            throw new Error(`Failed to fetch commits for repo: ${repo.name}`);
          }

          const commitData = await commitsResponse.json();
          allCommits.push(
            ...commitData.map((commit: Commit) => ({
              repoName: repo.name,
              commitMessage: commit.commit.message,
              commitDate: commit.commit.author.date,
              commitUrl: commit.html_url,
              commitAuthor: commit.author,
            }))
          );
          page++;

          counts.push({ repoName: repo.name });
        }

        const sortedCommits = allCommits.sort((a: Commit, b: Commit) => {
          const dateA: Date = new Date(a.commitDate);
          const dateB: Date = new Date(b.commitDate);

          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            throw new Error('Invalid date format');
          }
        
          return dateB.getTime() - dateA.getTime();
        });

        const recentSortedCommits = sortedCommits.slice(0, 15);
        setRecentCommits(recentSortedCommits);

      } catch (error) {
        console.error(error);
      }
    };

    if (repos.length > 0) {
      fetchCommits();
    }
  }, [repos]);

  useEffect(() => {
    console.log(recentCommits)
  } , [recentCommits])

  const formatDate: (e: string) => string = (isoDateString: string): string => {
    const date: Date = new Date(isoDateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const filteredRepos: Repository[] = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommits: Commit[] = recentCommits.filter(commit =>
    commit.commitMessage.toLowerCase().includes(searchTermCommits.toLowerCase())
  );

  return (
    <div className="sm:pl-64">
      <h1 className="pt-10 ml-10 pb-5 mr-5 text-xl border-b">
        <strong>Dashboard</strong>
      </h1>
      <div className="ml-10 mt-5 flex">
        <CircleAlert size={30} className="mt-1 mr-3"/>
        <p className="text-3xl">New Vulnerability :</p>
      </div>
      <div className="ml-10 mt-5 flex">
        <p className="text-5xl text-red-700">3</p>
        <ChevronsUp size={24} color="red" className="ml-1"/>
      </div>
      <div className="ml-10 mr-10 mt-10">
        <div className="relative overflow-x-auto">
          <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div className="relative" ref={dropdownRef}>
              <button
                id="dropdownRadioButton"
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:outline-none dark:focus:ring-gray-700"
                type="button"
                onClick={toggleDropdown}
              >
                <svg
                  className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
                </svg>
                { dropDownOption}
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownRadio"
                className={`z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${dropdownOpen ? 'block' : 'hidden'}`}
                style={{ position: 'absolute', marginTop: '10px' }}
              >
                <ul
                  className="space-y-1 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownRadioButton"
                >
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <label
                        htmlFor="filter-radio-example-1"
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                        onClick={() => setDropDownOption('Last Week')}
                      >
                        Last Week
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <label
                        htmlFor="filter-radio-example-1"
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                        onClick={() => setDropDownOption('Last Month')}
                      >
                        Last Month
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <label
                        htmlFor="filter-radio-example-1"
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                        onClick={() => setDropDownOption('Last Year')}
                      >
                        Last Year
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                      <label
                        htmlFor="filter-radio-example-1"
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                        onClick={() => setDropDownOption('All Time')}
                      >
                        All Time
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 ps-10 text-sm text-gray-900 border rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-400 dark:bg-gray-700 dark:placeholder-gray-400 dark:outline-none dark:text-white"
                placeholder="Search for repositories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-144 overflow-auto border">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 border rounded-xl uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="px-6 py-4">
                    Repo name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Vulnerability
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Updated At
                  </th>
                  <th scope="col" className="px-6 py-3">
                    More Details
                  </th>
                  <th scope="col" className="px-6 py-3">
                    GIT URL
                  </th>
                </tr>
              </thead>
              <tbody>
                {repos.length == 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="flex flex-col justify-center items-center h-full">
                        <div className="flex justify-center">
                          <p className="pl-7 pr-7 pb-7 text-center text-slate-500 dark:text-slate-300">
                            Loading ...
                          </p>
                        </div>
                        <div className="flex justify-center">
                          <Loading />
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRepos.map((repo, index) => (
                    <tr
                      key={repo.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {repo.name}
                      </th>
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <img
                          className="w-10 h-10 rounded-full"
                          src={repo.owner?.avatar_url}
                        />
                        <div className="ps-3">
                          <div className="text-base font-semibold">{repo.owner?.login}</div>
                        </div>
                      </th>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                        { index % 3 >= 2 ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                          ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                        )}
                          {index % 3}
                        </div>
                      </td>
                      <td className="px-6 py-4">{formatDate(repo.updated_at)}</td>
                      <td className="px-6 py-4">
                        <a
                          href={`/repository/${repo.owner?.login}/${repo.name}`}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={repo.clone_url}
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="ml-10 mr-10 border mt-10"></div>
      <div className="flex">

        <div className="ml-10 mt-10 mr-10 mb-10 w-1/2">
          <div className="mb-5 ml-1 flex">
            <GitGraph size={18} className="mt-1 mr-3"/>
            <p>Last Commits</p>
          </div>
          <div className="relative overflow-x-auto">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
              <label htmlFor="table-search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  className="block p-2 ps-10 text-sm text-gray-900 border rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-400 dark:bg-gray-700 dark:placeholder-gray-400 dark:outline-none dark:text-white"
                  placeholder="Search for commits"
                  value={searchTermCommits}
                  onChange={(e) => setsearchTermCommits(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-3">Commit</th>
                    <th scope="col" className="px-6 py-3">Repo</th>
                    <th scope="col" className="px-6 py-3">Commit URL</th>
                  </tr>
                </thead>
                <tbody className="border">
                  {recentCommits.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        <div className="flex flex-col justify-center items-center h-full">
                          <div className="flex justify-center">
                            <p className="pl-7 pr-7 pb-7 text-center text-slate-500 dark:text-slate-300">Loading ...</p>
                          </div>
                          <div className="flex justify-center"><Loading /></div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCommits.map((commit) => (
                      <tr key={commit.commitUrl} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <img
                            className="w-10 h-10 rounded-full"
                            src={commit.commitAuthor.avatar_url}
                            alt={commit.commitAuthor.login}
                          />
                          <div className="ps-3">
                            <div className="text-base font-semibold">{commit.commitAuthor.login}</div>
                          </div>
                        </th>
                        <td className="px-6 py-4">{commit.commitMessage}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {commit.repoName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a href={commit.commitUrl} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">view</a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="ml-10 mt-10 mr-10 mb-10 w-1/2">
          <div className="mb-5 ml-1 flex">
            <GitGraph size={18} className="mt-1 mr-3"/>
            <p>Last Vulnerability</p>
          </div>
          <div className="relative overflow-x-auto">
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
              <label htmlFor="table-search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  className="block p-2 ps-10 text-sm text-gray-900 border rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-400 dark:bg-gray-700 dark:placeholder-gray-400 dark:outline-none dark:text-white"
                  placeholder="Search for vulnerabilities"
                  /*value={searchTermVulnerabilities}
                  onChange={(e) => setsearchTermVulnerabilities(e.target.value)}*/
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-4">Repos</th>
                    <th scope="col" className="px-6 py-3">Line</th>
                    <th scope="col" className="px-6 py-3">Type</th>
                    <th scope="col" className="px-6 py-3">Severity</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Corewar</td>
                    <td className="px-6 py-4">asm/db : 27</td>
                    <td className="px-6 py-4">Buffer Overflow</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>High</div>
                        <div className="ml-3 h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">2021-10-06</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Corewar</td>
                    <td className="px-6 py-4">asm/db : 27</td>
                    <td className="px-6 py-4">Buffer Overflow</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>High</div>
                        <div className="ml-3 h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">2021-10-06</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Corewar</td>
                    <td className="px-6 py-4">asm/db : 27</td>
                    <td className="px-6 py-4">Buffer Overflow</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>High</div>
                        <div className="ml-3 h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">2021-10-06</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">Corewar</td>
                    <td className="px-6 py-4">asm/db : 27</td>
                    <td className="px-6 py-4">Buffer Overflow</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>High</div>
                        <div className="ml-3 h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">2021-10-06</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
