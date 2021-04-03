import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function formatPosts(posts): Post[] {
  return posts.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [pagination, setPagination] = useState(postsPagination);

  function handleLoadMorePosts(): void {
    fetch(postsPagination.next_page, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const newPosts = formatPosts(data.results);
        setPagination({
          next_page: data.next_page,
          results: [...pagination.results, ...newPosts],
        });
      });
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        {pagination.results.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <div className={styles.postContent}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div className={commonStyles.postInfo}>
                <span>
                  <FiCalendar />{' '}
                  {format(
                    new Date(post.first_publication_date),
                    'dd LLL yyyy',
                    {
                      locale: ptBR,
                    }
                  )}
                </span>
                <span>
                  <FiUser /> {post.data.author}
                </span>
              </div>
            </div>
          </Link>
        ))}
        {pagination.next_page && (
          <button type="button" onClick={handleLoadMorePosts}>
            Carregar mais posts
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.content', 'post.author'],
      pageSize: 1,
    }
  );

  const posts: Post[] = formatPosts(postsResponse.results);

  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
