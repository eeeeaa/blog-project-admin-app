export class Post {
  constructor(
    postId = null,
    title = null,
    content = null,
    createdAt = null,
    updatedAt = null,
    postStatus = null
  ) {
    this.postId = postId;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.postStatus = postStatus;
  }

  prettifyCreatedAt() {
    if (this.createdAt === null) return "";
    let date = new Date(this.createdAt);

    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  prettifyUpdatedAt() {
    if (this.updatedAt === null) return "";
    let date = new Date(this.updatedAt);

    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }
}
