import React, { useState } from "react";
import PropTypes from "prop-types";
import useInput from "../../Hooks/useInput";
import PostPresenter from "./PostPresenter";
import { useMutation, useQuery } from "react-apollo-hooks";
import { TOGGLE_LIKE, ADD_COMMENT } from "./PostQueries";
import { toast } from "react-toastify";
import { MyProfile } from "../../SharedQueries";

const PostContainer = ({
  id,
  user,
  files,
  likeCount,
  isLiked,
  comments,
  createdAt,
  caption,
  location
}) => {
  const [isLikedState, setIsLiked] = useState(isLiked);
  const [likeCountState, setLikeCount] = useState(likeCount);
  const [currentItem, setCurrentItem] = useState(0);
  const [selfComments, setSelfComments] = useState([]);
  const comment = useInput("");
  const { data: meQuery } = useQuery(MyProfile);
  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: { postId: id }
  });
  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: { postId: id, text: comment.value }
  });

  const totalFiles = files.length;
  const nextSlide = () => {
    if (totalFiles - 1 === currentItem) {
      setCurrentItem(currentItem);
    } else {
      setCurrentItem(currentItem + 1);
    }
  };
  const prevSlide = () => {
    if (currentItem === 0) {
      setCurrentItem(0);
    } else {
      setCurrentItem(currentItem - 1);
    }
  };

  const toggleLike = () => {
    if (isLikedState === true) {
      setIsLiked(false);
      setLikeCount(likeCountState - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCountState + 1);
    }
    try {
      toggleLikeMutation();
    } catch {
      toast.error("Cant register like");
    }
  };

  const onKeyPress = async event => {
    const { which } = event;
    if (which === 13) {
      event.preventDefault();
      comment.setValue("");
      setSelfComments([
        ...selfComments,
        {
          id: Math.floor(Math.random() * 100),
          text: comment.value,
          user: { username: meQuery.myProfile.username }
        }
      ]);
      try {
        await addCommentMutation();
      } catch {
        toast.error("Can't send Comment");
      }
    }
    return;
  };

  return (
    <PostPresenter
      user={user}
      files={files}
      likeCount={likeCountState}
      location={location}
      caption={caption}
      isLiked={isLikedState}
      comments={comments}
      createdAt={createdAt}
      newComment={comment}
      setIsLiked={setIsLiked}
      setLikeCount={setLikeCount}
      currentItem={currentItem}
      nextSlide={nextSlide}
      prevSlide={prevSlide}
      totalFiles={totalFiles}
      toggleLike={toggleLike}
      onKeyPress={onKeyPress}
      selfComments={selfComments}
    />
  );
};

PostContainer.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default PostContainer;
