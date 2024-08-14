"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import "./page.css";
import { redirect } from "next/navigation";
import { SideBar } from "../../components/ui/side-bar"; // Highlighted change

interface Repository {
    id: string;
    name: string;
    owner?: {
        avatar_url: string;
        login: string;
    };
    version: string;
    LastPush : string;
    language: string;
}

interface Organization { // Highlighted change
    name: string;
}

const RepositoryPage: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState("light");
    const [organizations, setOrganizations] = useState<Organization[]>([]); // Highlighted change
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null); // Highlighted change

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

    useEffect(() => {
        console.log("Repositories updated");
        console.log(repositories);
    }, [repositories]);

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
                <button onClick={toggleTheme} className="theme-toggle">
                    Switch to {theme === "light" ? "Dark" : "Light"} Theme
                </button>
                <ul className="repository-list">
                    {Array.isArray(repositories) && repositories.map((repo) => (
                        <li key={repo.id} className="repository-item">
                            <div className="repo-details">
                                <h2>{repo.name}</h2>
                                <span>Language: {repo.language}</span>
                            </div>
                            <div className="Owner">
                                <p className="owner">Owner: {repo.owner?.login}</p>
                            </div>
                            <img src={repo.owner?.avatar_url} alt={repo.owner?.login} className="avatar"/>
                        </li>
                    ))}
                </ul>
            </div>
            <SideBar organizations={organizations} currentOrg={currentOrg ?? { name: "Default Organization" }} />
        </>
    );
};

export default RepositoryPage;