"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import "./page.css";
import { redirect } from "next/navigation";
import { SideBar } from "@/components/ui/side-bar";
import { useRouter } from "next/navigation"

interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
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
    };
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    homepage: string | null;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    forks_count: number;
    open_issues_count: number;
    default_branch: string;
}

interface Organization {
    name: string;
}

const RepositoryPage: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState("light");
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

    const router = useRouter();

    useEffect(() => {
        const mode = localStorage.getItem("darkMode");
        if (mode === "true") {
            theme === "light" ? setTheme("dark") : setTheme("light");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                const session = await getSession();

                if (!session) {
                    setError("No valid access token found in session");
                    setLoading(false);
                    return;
                }

                const apiUrl = '/api/repos/repository';
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch repositories');
                }

                const data: Repository[] = await response.json();
                console.log(data);
                if (Array.isArray(data)) {
                    setRepositories(data);
                } else {
                    throw new Error('Fetched data is not an array');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories().catch(console.error);
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.log(error);
        redirect("/")
    }

    return (
        <>
            <div className={`container ${theme}`}>
                <h1 className="title">Your Repositories</h1>
                {repositories.map((repo) => (
                    <div>
                <ul className="repository-list">
                    {Array.isArray(repositories) && repositories.map((repo) => (
                        <li key={repo.id} className="repository-item" onClick={() => router.replace('/repository/' + repo.owner.login + '/' + repo.name)}>
                            <div className="repo-details">
                                <h2>{repo.name}</h2>
                                <span>Language: {repo.language}</span>
                            </div>
                            <div className="Owner">
                                <p className="owner">Owner: {repo.owner.login}</p>
                            </div>
                            <img src={repo.owner.avatar_url} alt={repo.owner.login} className="avatar"/>
                        </li>
                    ))}
                </ul>
                    </div>

                ))}
            </div>
            <SideBar organizations={organizations} currentOrg={currentOrg ?? { name: "Default Organization" }} />
        </>
    );
};

export default RepositoryPage;