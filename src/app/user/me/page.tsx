"use client";
import { useEffect, useState } from 'react';
import { UserRoundCheck, UserRoundPlus, MapPin, SquarePen, TrendingUp, EarthLock, BookKey, BookLock, Boxes, CircleDollarSign } from 'lucide-react';
import { signOut } from 'next-auth/react';
import GithubContributions from '@/components/charts/github-contributions';
import GithubContributionsPie from '@/components/charts/github-contributions-piechart';
import GithubStorage from '@/components/charts/github-storage-chart';

interface UserProps {
  params: {
    username: string;
  };
}

export default function UserPage({ params }: UserProps) {
  const { username } = params;
  const [userData, setUserData] = useState(null);
  const [userContributions, setUserContributions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionsLoading, setContributionsLoading] = useState(true);

  useEffect(() => {
    const mode = localStorage.getItem("darkMode");
    if (mode === "true") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    fetch("/api/users/me")
      .then(response => response.json())
      .then(data => {
        setUserData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [username]);

  useEffect(() => {
    if (userData?.login) {
      fetch(`https://github-contributions-api.jogruber.de/v4/${userData.login}`)
        .then(response => response.json())
        .then(data => {
          setUserContributions(data);
          setContributionsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user contributions:', error);
          setContributionsLoading(false);
        });
    }
  }, [userData]);

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className="pl-0 sm:pl-64">
      <div className="pl-5 flex justify-between border-b pb-5">
        <div className="pt-5 pr-10 flex flex-col lg:flex-row">
          <div className='pt-3'>
            <img src={userData.avatar_url} alt="User avatar" width={100} height={100} className="rounded-full" />
          </div>
          <div className="pt-5 pl-5">
            <h1 className="text-xl">{userData.name}</h1>
            <h2 className="text-slate-500">
              <div className='flex'>
                <SquarePen />
                <div className='pl-2'>
                  {userData.bio}
                </div>
              </div>
            </h2>
            <h2 className="text-slate-500">
              <div className='flex'>
                <MapPin />
                <div className='pl-2'>
                  {userData.location}
                </div>
              </div>
            </h2>
          </div>
        </div>
        <div className="mr-5 mt-5">
          <button onClick={() => signOut({ callbackUrl: '/' })} className="p-3 border rounded-sm dark:bg-collab-background">Log out</button>
        </div>
      </div>
      <div className="m-5 lg:m-10">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="dark:bg-dark-background border rounded-xl p-7 flex justify-between w-full lg:w-80 mb-5 lg:mb-0">
            <div>
              <p className="text-slate-600 dark:text-white pt-2 text-sm">FOLLOWERS</p>
              <p className="text-4xl">{userData.followers}</p>
            </div>
            <div className="p-5 border rounded-xl bg-followers-background">
              <UserRoundCheck color="green" className="h-10 w-10" />
            </div>
          </div>
          <div className="dark:bg-dark-background border rounded-xl p-7 flex justify-between w-full lg:w-80 mb-5 lg:mb-0">
            <div>
              <p className="text-slate-600 dark:text-white pt-2 text-sm">FOLLOWING</p>
              <p className="text-4xl">{userData.following}</p>
            </div>
            <div className="p-5 border rounded-xl bg-collab-background">
              <UserRoundPlus color="blue" className="h-10 w-10" />
            </div>
          </div>
          <div className="dark:bg-dark-background border rounded-xl p-7 flex justify-between w-full lg:w-80 mb-5 lg:mb-0">
            <div>
              <p className="text-slate-600 dark:text-white pt-2 text-sm">PUBLIC REPOS</p>
              <p className="text-4xl">{userData.public_repos}</p>
            </div>
            <div className="p-5 border rounded-xl bg-followers-background">
              <BookKey color="green" className="h-10 w-10" />
            </div>
          </div>
          <div className="dark:bg-dark-background border rounded-xl p-7 flex justify-between w-full lg:w-80 mb-5 lg:mb-0">
            <div>
              <p className="text-slate-600 dark:text-white pt-2 text-sm">PRIVATE REPOS</p>
              <p className="text-4xl">{userData.total_private_repos}</p>
            </div>
            <div className="p-5 border rounded-xl bg-collab-background">
              <BookLock color="blue" className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
      <div className="m-5 lg:m-10">
        <div className="lg:flex justify-between" style={{ width: "100%" }}>
          <div className="dark:bg-dark-background border rounded-xl">
            <div className='border-b flex justify-center'>
              <p className='text-xl p-5'>TOTAL CONTRIBUTION</p>
            </div>
            <div className=''>
              {contributionsLoading ? (
                <div>Loading contributions...</div>
              ) : (
                <GithubContributionsPie data={userContributions.total} />
              )}
            </div>
          </div>
          <div className="dark:bg-dark-background border rounded-xl" style={{ width: "40vw" }}>
            <div className='border-b flex justify-center'>
              <p className='text-xl p-5'>PLAN</p>
            </div>
            <div className="flex justify-between mt-3" style={{ height: "300px" }}>
              <div className='border-r ml-4 pt-5 flex flex-col' style={{ width: "50%", height: "100%" }}>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="bg-plan-background p-2 border outline-pink-500 rounded-md">
                        <CircleDollarSign color="red" />
                      </div>
                      <div className="ml-4 mt-1.5">
                        <p className='text-xl'>PLAN</p>
                      </div>
                    </div>
                    <p className='text-xl mr-5'>{userData.plan.name}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="bg-collab-background p-2 border outline-pink-500 rounded-md">
                        <Boxes color="blue" />
                      </div>
                      <div className="ml-4 mt-1.5">
                        <p className='text-xl'>COLLABORATORS</p>
                      </div>
                    </div>
                    <p className='text-xl mr-5 mt-1'>{userData.plan.collaborators}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="flex">
                      <div className="bg-private-background p-2 border outline-pink-500 rounded-md">
                        <EarthLock color="purple" />
                      </div>
                      <div className="ml-4 mt-1.5">
                        <p className='text-xl'>PRIVATE REPOS</p>
                      </div>
                    </div>
                    <p className='text-xl mr-5 mt-1'>{userData.plan.private_repos}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className='flex justify-center mt-6'>
                  <p>Storage Size</p>
                </div>
                <div className="mt-6">
                  <GithubStorage data={userData.plan} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='border-b flex'>
          <div className='border bg-collab-background rounded-xl mt-4 mr-2 mb-3 p-4'>
            <TrendingUp color="blue" />
          </div>
          <p className='mb-5 mt-7 pl-2 text-2xl'>Github Contributions</p>
        </div>
        <div className='mt-5'>
          {contributionsLoading ? (
            <div>Loading contributions...</div>
          ) : (
            <GithubContributions data={userContributions.contributions} />
          )}
        </div>
      </div>
    </div>
  );
}