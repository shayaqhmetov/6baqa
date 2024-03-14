"use client";

import { useEffect } from 'react';

import './post-details.style.scss';
import { usePostDetails } from '@/states/posts';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import MarkdownRenderer from '@/components/common/markdown-renderer';


export default function PostDetails({ params }: { params: { id: string } }) {
    // get id from the router
    const { post, fetchAndSetPostDetails } = usePostDetails();

    // Use useEffect to do something with the postId when it changes
    useEffect(() => {
        fetchAndSetPostDetails(params.id);
    }, [params.id]);

    return <div className="post-details">

        <div className="post-details-header">
            <div className="post-details-header-title">
                <div className='post-details-header-title-box'>
                    <h1>{post?.title}</h1>
                    <h3>{post?.description}</h3>
                </div>
            </div>
            <img src="https://asiantrails.b-cdn.net/wp-content/uploads/2018/07/thailand.jpg" alt="" />
        </div>

        <div className='post-details-content'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/posts">Posts</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{post?.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className='post-details-content-markdown'>
                <MarkdownRenderer content={post?.content} />
            </div>
        </div>
    </div>;
}