export class Comment {
  constructor(
    commentId = null,
    comment = null,
    createdAt = null,
    postId = null
  ) {
    this.commentId = commentId;
    this.comment = comment;
    this.createdAt = createdAt;
    this.postId = postId;
  }

  prettifyCreatedAt() {
    if (this.createdAt === null) return "";
    let date = new Date(this.createdAt);

    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }
}
