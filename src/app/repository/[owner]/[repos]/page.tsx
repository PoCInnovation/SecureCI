"use client";

import React, { useState, useEffect } from "react";
import { CircleAlert, Logs, FolderKanban, Star, LineChart, ShieldAlert, Component, TriangleAlert, Eye, GitFork } from "lucide-react";
import VulnerabilityCard from "../../../../../src/components/ui/card/vulnerability";
import GithubCommits from "../../../../../src/components/charts/github-commits-repos";
import GithubContributor from "../../../../../src/components/charts/github-contributors";
import Loading from "../../../../../src/components/ui/loading";


interface ReposProps {
    params: {
        repos: string;
        owner: string;
    };
}

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
}

interface Contributor {
    login: string;
    avatar_url: string;
    contributions: number;
}

interface CommitResponse {
    sha: string;
    node_id: string;
    commit: CommitDetails;
    url: string;
    html_url: string;
    comments_url: string;
    author: User;
    committer: User;
    parents: Parent[];
}
  
interface CommitDetails {
    author: AuthorCommitter;
    committer: AuthorCommitter;
    message: string;
    tree: Tree;
    url: string;
    comment_count: number;
    verification: Verification;
}
  
interface AuthorCommitter {
    name: string;
    email: string;
    date: string;
}
  
interface Tree {
    sha: string;
    url: string;
}
  
interface Verification {
    verified: boolean;
    reason: string;
    signature: string | null;
    payload: string | null;
}
  
interface User {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
  
interface Parent {
    sha: string;
    url: string;
    html_url: string;
}
  

export default function RepoPage(
    { params }: ReposProps
) {

    const [repositories, setRepositories] = useState<Repository>();
    const [contributors, setContributors] = useState<Contributor[]>();
    const [commits, setCommits] = useState<CommitResponse[]>();
    const [lastCommits, setLastCommits] = useState<CommitResponse[]>();

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const response = await fetch(`/api/repos/${params.owner}/${params.repos}`);
        
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const data : Repository = await response.json();
                setRepositories(data);
            } catch (err) {
                console.log(err);
            }
        }

        const fetchContributors = async () => {
            try {
                const response = await fetch(`/api/repos/${params.owner}/${params.repos}/contributors`);
        
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const data : Contributor[] = await response.json();
                setContributors(data);
            } catch (err) {
                console.log(err);
            }
        }

        const fetchCommits = async () => {
            try {
                const response = await fetch(`/api/repos/${params.owner}/${params.repos}/commits`);
        
                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const data : CommitResponse[] = await response.json();
                const topFiveCommits : CommitResponse[] = data.slice(0, 5).map(commit => commit);
                setLastCommits(topFiveCommits);
                setCommits(data.map(commit => commit));
            } catch (err) {
                console.log(err);
            }
        }

        fetchRepositories().catch(console.error);
        fetchContributors().catch(console.error);
        fetchCommits().catch(console.error);

    }
    , []);

    useEffect(() => {
    }, [repositories, contributors, commits]);

    const formatDate = (isoDateString: string) => {
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


    return (
        <div className="sm:pl-64 flex">
            <div className="lg:w-2/3 pt-10 h-screen overflow-y-auto">
                <h1 className="ml-10 pb-2 mr-5 text-xl border-b">
                    <strong>Dashboard</strong>
                </h1>
                <div className="flex justify-between ml-10 pt-10">
                    <div className="flex">
                        <FolderKanban className="mt-1"/>
                        <div>
                            <p className="ml-3 text-2xl">
                                {repositories?.name}
                            </p>
                            <p className="ml-3 text-sm text-slate-400">
                                {formatDate(repositories?.created_at)}
                            </p>
                        </div>
                    </div>
                    <div className="flex mt-1 mr-16">
                        <div>
                            <div className="flex">
                                <Star className="mr-2 mt-2 text-slate-500" size={20} />
                                <p className="text-xl font-bold text-slate-500 mt-1">
                                    {repositories?.stargazers_count}
                                </p>
                                <p className="text-xl text-slate-500 ml-1 mt-1">
                                    stars
                                </p>
                            </div>
                            <div className="flex">
                                <GitFork className="mr-2 mt-2 text-slate-500" size={20} />
                                <p className="text-xl font-bold text-slate-500 mt-1">
                                    {repositories?.forks_count}
                                </p>
                                <p className="text-xl text-slate-500 ml-1 mt-1">
                                    forks
                                </p>
                            </div>
                            <div className="flex">
                                <Eye className="mr-2 mt-2 text-slate-500" size={20} />
                                <p className="text-xl font-bold text-slate-500 mt-1">
                                    {repositories?.watchers_count}
                                </p>
                                <p className="text-xl text-slate-500 ml-1 mt-1">
                                    watchers
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-10 pt-10">
                    <div className="flex mt-1">
                        <LineChart className="mr-3"/>
                        <p>Commits History</p>
                    </div>
                </div>
                <div className="mt-5 ml-10">
                    <div className="border p-3" style={{width: "95%"}}>
                        { commits ? (
                            <GithubCommits commits={commits} />
                        ) : (
                            <div className="flex flex-col justify-center items-center h-full">
                                <div className="flex justify-center">
                                    <p className="pl-7 pr-7 pb-7 text-center text-slate-500 dark:text-slate-300">Loading ...</p>
                                </div>
                                <div className="flex justify-center">
                                    <Loading />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-10 ml-10 mr-10 border-b"></div>
                <div className="flex gap-10 mb-10 pb-10">
                    <div className="w-1/2 pt-8">
                        <div className="ml-10 pb-8 flex">
                            <Component className="mt-1 mr-3"/>
                            <p className="mt-1">Contributors</p>
                        </div>
                        <div className="border p-3 h-full ml-10 dark:bg-semi-dark">
                            { contributors ? (
                                 <GithubContributor contributors={contributors} />
                            ) : (
                                <div className="flex flex-col justify-center items-center h-full">
                                    <div className="flex justify-center">
                                        <p className="pl-7 pr-7 pb-7 text-center text-slate-500 dark:text-slate-300">Loading ...</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <Loading />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 pt-8">
                        <div className="pb-8 mt-1 flex">
                            <ShieldAlert className="mr-3"/>
                            <p>Vulnerability History</p>
                        </div>
                        <div className="border p-3 mr-10 h-full dark:bg-semi-dark">
                            <p>Yo</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-semi-light dark:bg-slate-900 lg:w-1/3 lg:h-screen overflow-y-auto">
                <div className="pt-10">
                    <h1 className="ml-10 pb-2 mr-5 text-xl border-b">
                        <strong>Overview</strong>
                    </h1>
                    <div className="flex mt-7">
                        <CircleAlert className="ml-10" size={25} color="red" />
                        <p className="ml-2 font-medium">Vulnerability</p>
                    </div>
                    <VulnerabilityCard />
                    <VulnerabilityCard />
                    <div>
                        <div className="flex mt-7">
                            <Logs className="ml-10" size={25} />
                            <p className="ml-2 font-medium">Logs -&gt; Last Commits</p>
                        </div>
                        <div className="border bg-white dark:bg-black rounded border-slate-400 mt-5 mb-10 ml-10 mr-10 overflow-auto h-128">
                        {lastCommits ? (
                            lastCommits.map((commit, index) => (
                                <React.Fragment key={index}>
                                    <div className="p-7 flex justify-between">
                                        <div className="">
                                            <div className="flex">
                                                <img
                                                    src={commit.author.avatar_url}
                                                    alt="User avatar"
                                                    className="rounded-full h-10 w-10 mt-1"
                                                />
                                                <div>
                                                    <p className="ml-3">{commit.author.login}</p>
                                                    <p className="ml-3">{commit.commit.message}</p>
                                                    <p className="ml-3 text-xs text-slate-400">{formatDate(commit.commit.author.date)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {index % 2 === 0 && (
                                                <TriangleAlert color="red" className="ml-auto" size={25} />
                                            )}
                                        </div>
                                    </div>
                                    {index < lastCommits.length - 1 && (
                                        <div className="border-b border-slate-300 ml-32 mr-32"></div>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="flex flex-col justify-center items-center h-full">
                                <div className="flex justify-center">
                                    <p className="pl-7 pr-7 pb-7 text-center text-slate-500 dark:text-slate-300">Loading ...</p>
                                </div>
                                <div className="flex justify-center">
                                    <Loading />
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}