"use client";

import React, { useEffect } from 'react';
import { usePosts } from '@/states/posts';
import PostList from "@/components/posts/post-list";
import { RoleBasedContent } from '@/components/role-based-content';

export default function Posts() {
    const { posts, fetchAndSetPosts } = usePosts();

    useEffect(() => {
        fetchAndSetPosts();
    }, []);


    return (
        <main>
            <h1> Posts </h1>
            <div>
                <PostList posts={posts} />
            </div>
            <div>
                <RoleBasedContent allowedRoles={["admin"]}>
                    <h1>Secret content</h1>
                </RoleBasedContent>
            </div>
        </main>
    );
}