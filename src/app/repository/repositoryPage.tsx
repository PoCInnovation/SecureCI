"use client";

import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu/dropdown-menu";

interface Repository {
  id: string;
  name: string;
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

        const apiUrl = '/api/repos/repository/route';
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <div>
        <h1>Your Repositories</h1>
        <DropdownMenu>
          {repositories.map((repo) => (
              <DropdownMenuItem key={repo.id}>{repo.name}</DropdownMenuItem>
          ))}
        </DropdownMenu>
      </div>
  );
};

export default RepositoryPage;