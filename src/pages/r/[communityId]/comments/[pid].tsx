import PageContent from '@/components/Layout/PageContent'
import PostItem from '@/components/Posts/PostItem'
import usePosts from '@/hooks/usePosts'
import React from 'react'

const PostPage:React.FC = () => {
    const {postStateValue} = usePosts()
    return(
    <PageContent>
      <>
      <PostItem />
      {/* SelectedPost */}
      {/* Comments */}
      </>
      <>
      {/* About */}
      </>
    </PageContent>
    )
  }

  export default PostPage
