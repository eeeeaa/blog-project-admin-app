import { Post } from "../../model/postUiModel";
import { Comment } from "../../model/commentUiModel";

function clean(obj) {
  for (let propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}

/**
 *
 * @param {Post} postModel
 * @returns
 */
export const postToJsonObjMapper = (postModel) => {
  //convert post ui model to request body (dont need to map id)
  return clean({
    post_title: postModel.title,
    post_content: postModel.content,
    created_at: postModel.createdAt,
    updated_at: postModel.updatedAt,
    post_status: postModel.postStatus,
  });
};

/**
 *
 * @param {Comment} commentModel
 * @returns
 */
export const commentToJsonObjMapper = (commentModel) => {
  //convert comment ui model to request body (dont need to map id)
  return clean({
    comment: commentModel.comment,
    created_at: commentModel.createdAt,
    post: commentModel.postId,
  });
};
