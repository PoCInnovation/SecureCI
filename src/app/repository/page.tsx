"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import "./page.css";
import { redirect } from "next/navigation";

interface Repository {
    id: string;
    name: string;
    author?: {
        avatar_url: string;
        login: string;
    };
    version: string;
    LastPush : string;

}

const RepositoryPage: React.FC = () => {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setRepositories(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchRepositories().catch(console.error);
    }, []);

    useEffect(() => {
        console.log(repositories);
    }, [repositories]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.log(error);
        redirect("/")
    }

    return (
        <>
        <div className="container">
            <h1 className="title">Your Repositories</h1>
            <ul className="repository-list">
                {repositories.map((repo) => (
                    <li key={repo.id} className="repository-item">
                        <div className="repo-details">
                            <h2>{repo.name}</h2>
                            <p className="version">LastPush: {repo.LastPush}</p>
                        </div>
                        <div className="repo-author">
                                <span>LastPush: {repo.LastPush}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default RepositoryPage;
