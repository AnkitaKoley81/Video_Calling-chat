import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserFriends } from '../lib/api';
import FriendCard from '../components/FriendCard';
import NotFriendFound from '../components/NotFriendFound';

const FriendsPage = () => {
  const { data: friends = [], isLoading, isError } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center mt-10 text-red-500">Error fetching friends!</div>;
  }

  if (friends.length === 0) {
    return <NotFriendFound />;
  }

  return (
      <div className="p-4">
    <h2 className="text-3xl font-bold tracking-tight text-left pl-4 mb-8">
      Your Friends
    </h2>

    <div className="flex justify-start mt-14 px-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {friends.map((friend) => (
          <FriendCard key={friend._id} friend={friend} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default FriendsPage;
